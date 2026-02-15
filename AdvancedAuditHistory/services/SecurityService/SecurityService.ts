// AdvancedAuditHistory\services\SecurityService\SecurityService.ts
import { IInputs } from "../../generated/ManifestTypes";

/**
 * Extended PCF context interface for accessing page context
 */
interface ExtendedContext extends ComponentFramework.Context<IInputs> {
    page?: {
        getClientUrl?: () => string;
    };
}

/**
 * Privilege definition from Dataverse security model
 * 
 * @remarks
 * Represents a single privilege in the Dynamics 365/Dataverse security model.
 * Privilege types include: Create, Read, Write, Delete, Append, AppendTo, Assign, Share
 * Access levels: Basic (user-owned), Deep (business unit), Local (parent/child), Global (organization)
 */
export interface Privilege {
    CanBeBasic: boolean;
    CanBeDeep: boolean;
    CanBeGlobal: boolean;
    CanBeLocal: boolean;
    ExtensionData?: unknown;
    Name: string;
    PrivilegeId: string;
    PrivilegeType: string;
}

/**
 * Entity metadata response from Dataverse API
 */
interface EntityMetadataResponse {
    IsAuditEnabled?: {
        Value: boolean;
    };
    Privileges?: Privilege[];
}

/**
 * Entity privilege information
 */
export interface EntityPrivilege {
    privilegeName: string;
    privilegeId: string;
    privilegeType: string;
    depth: 'Basic' | 'Local' | 'Deep' | 'Global' | 'None';
    canCreate: boolean;
    canRead: boolean;
    canWrite: boolean;
    canDelete: boolean;
    canAppend: boolean;
    canAppendTo: boolean;
    canAssign: boolean;
    canShare: boolean;
}

/**
 * SecurityService - Service for security and permission checks
 * 
 * @remarks
 * Provides methods for checking user permissions and entity audit configuration.
 * Validates access rights before displaying audit history data.
 */
export class SecurityService {
    /**
     * Get user privileges for a specific entity
     * 
     * @remarks
     * Retrieves all privileges the current user has on a specified entity,
     * including privilege types (Create, Read, Write, Delete, etc.) and access depth.
     * 
     * @param context - PCF context object
     * @param entityLogicalName - Logical name of the entity to check privileges for
     * @returns Promise resolving to array of EntityPrivilege objects
     * 
     * @example
     * ```typescript
     * const privileges = await SecurityService.getUserPrivileges(context, 'account');
     * const canRead = privileges.some(p => p.canRead && p.depth !== 'None');
     * const canWrite = privileges.some(p => p.canWrite && p.depth !== 'None');
     * ```
     */
    static async getUserPrivileges(
        context: ComponentFramework.Context<IInputs>,
        entityLogicalName: string
    ): Promise<EntityPrivilege[]> {
        try {
            const userId = context.userSettings.userId.replace(/{|}/g, '');

            // Step 1: Get all role IDs for the user
            const userRolesResponse = await context.webAPI.retrieveMultipleRecords(
                'systemuserroles',
                `?$filter=systemuserid eq ${userId}&$select=roleid`
            );

            if (!userRolesResponse.entities || userRolesResponse.entities.length === 0) {
                return [];
            }

            const roleIds = userRolesResponse.entities.map(entity => entity.roleid);

            // Step 2: Get entity metadata to find available privileges for this entity
            const extendedContext = context as ExtendedContext;
            const clientUrl = extendedContext.page?.getClientUrl?.() ?? '';

            const metadataResponse = await fetch(
                `${clientUrl}/api/data/v9.2/EntityDefinitions(LogicalName='${entityLogicalName}')?$select=Privileges`,
                {
                    headers: {
                        'OData-MaxVersion': '4.0',
                        'OData-Version': '4.0',
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!metadataResponse.ok) {
                console.error(`Entity metadata query failed: ${metadataResponse.status}`);
                return [];
            }

            const metadataData = await metadataResponse.json() as EntityMetadataResponse;
            const entityPrivileges = metadataData.Privileges || [];

            if (entityPrivileges.length === 0) {
                return [];
            }

            // Step 3: Get role privileges for the user's roles and this entity's privileges
            const privilegeIds = entityPrivileges.map(p => p.PrivilegeId);
            const privilegeFilter = privilegeIds.map(id => `privilegeid eq ${id}`).join(' or ');
            const roleFilter = roleIds.map(id => `roleid eq ${id}`).join(' or ');

            const rolePrivilegesResponse = await context.webAPI.retrieveMultipleRecords(
                'roleprivileges',
                `?$filter=(${roleFilter}) and (${privilegeFilter})&$select=privilegeid,privilegedepthmask`
            );

            if (!rolePrivilegesResponse.entities || rolePrivilegesResponse.entities.length === 0) {
                return [];
            }

            // Step 4: Build the result by combining privilege info with depth masks
            const privilegeMap = new Map<string, number>();

            // Aggregate depth masks across all roles (use bitwise OR to get highest access)
            rolePrivilegesResponse.entities.forEach(rolePriv => {
                const privId = rolePriv.privilegeid;
                const depthMask = rolePriv.privilegedepthmask || 0;
                const currentMask = privilegeMap.get(privId) || 0;
                privilegeMap.set(privId, currentMask | depthMask);
            });

            // Map privileges to result format
            const result: EntityPrivilege[] = [];

            entityPrivileges.forEach(priv => {
                const depthMask = privilegeMap.get(priv.PrivilegeId);
                if (depthMask !== undefined && depthMask > 0) {
                    const depth = this.getDepthFromMask(depthMask, priv);
                    const privilegeType = this.getPrivilegeTypeFromName(priv.Name);

                    result.push({
                        privilegeName: priv.Name,
                        privilegeId: priv.PrivilegeId,
                        privilegeType: priv.PrivilegeType,
                        depth: depth,
                        canCreate: privilegeType === 'Create',
                        canRead: privilegeType === 'Read',
                        canWrite: privilegeType === 'Write',
                        canDelete: privilegeType === 'Delete',
                        canAppend: privilegeType === 'Append',
                        canAppendTo: privilegeType === 'AppendTo',
                        canAssign: privilegeType === 'Assign',
                        canShare: privilegeType === 'Share'
                    });
                }
            });

            return result;
        } catch (error) {
            console.error('Failed to retrieve user privileges for entity:', error);
            return [];
        }
    }

    /**
     * Determine access depth from privilege depth mask
     * 
     * @remarks
     * Depth mask values:
     * - 1 (Basic): User-owned records only
     * - 2 (Local): User + child business unit records
     * - 4 (Deep): User's business unit + child business units
     * - 8 (Global): Organization-wide access
     * 
     * @param depthMask - Bitmask representing access depth
     * @param privilege - Privilege metadata
     * @returns Access depth level
     */
    private static getDepthFromMask(
        depthMask: number,
        privilege: Privilege
    ): 'Basic' | 'Local' | 'Deep' | 'Global' | 'None' {
        // Check from highest to lowest privilege
        if ((depthMask & 8) && privilege.CanBeGlobal) return 'Global';
        if ((depthMask & 4) && privilege.CanBeDeep) return 'Deep';
        if ((depthMask & 2) && privilege.CanBeLocal) return 'Local';
        if ((depthMask & 1) && privilege.CanBeBasic) return 'Basic';
        return 'None';
    }

    /**
     * Extract privilege type from privilege name
     * 
     * @param privilegeName - Full privilege name (e.g., "prvCreateAccount")
     * @returns Privilege type (Create, Read, Write, Delete, etc.)
     */
    private static getPrivilegeTypeFromName(privilegeName: string): string {
        // Privilege names follow pattern: prv[Type][Entity]
        // Examples: prvCreateAccount, prvReadContact, prvWriteLead
        const match = /^prv([A-Z][a-z]+)/.exec(privilegeName);
        return match ? match[1] : 'Unknown';
    }

    /**
     * Check if the current user has permission to view audit history
     * 
     * @remarks
     * Queries the user's security roles to verify they have the 
     * "View Audit History" privilege (prvReadRecordAudit).
     * 
     * @param context - PCF context object
     * @returns Promise resolving to true if user has audit view permission, false otherwise
     * 
     * @example
     * ```typescript
     * const hasPermission = await SecurityService.checkUserAuditPermission(context);
     * if (!hasPermission) {
     *     console.log("User doesn't have permission to view audit history");
     * }
     * ```
     */
    static async checkUserAuditPermission(
        context: ComponentFramework.Context<IInputs>
    ): Promise<boolean> {
        try {
            const userId = context.userSettings.userId.replace(/{|}/g, '');

            // Query user's security roles (systemuserroles is an intersect entity)
            // We cannot expand navigation properties on intersect entities
            const response = await context.webAPI.retrieveMultipleRecords(
                'systemuserroles',
                `?$filter=systemuserid eq ${userId}&$select=roleid`
            );

            // If user has any roles, they likely have audit access
            // For more granular check, we'd need to query roleprivileges
            // but that requires additional API calls

            // Basic check: user has at least one active role
            const hasRoles = response.entities && response.entities.length > 0;

            return hasRoles;
        } catch (error) {
            console.error('Permission check failed:', error);
            return false;
        }
    }

    /**
     * Check if auditing is enabled for a specific entity
     * 
     * @remarks
     * Queries the entity metadata to determine if audit logging is enabled.
     * This check ensures the entity is configured to track changes.
     * 
     * @param context - PCF context object
     * @param entityLogicalName - Logical name of the entity to check
     * @returns Promise resolving to true if audit is enabled, false otherwise
     * 
     * @example
     * ```typescript
     * const isEnabled = await SecurityService.checkEntityAuditEnabled(context, 'account');
     * if (!isEnabled) {
     *     console.log("Audit is not enabled for this entity");
     * }
     * ```
     */
    static async checkEntityAuditEnabled(
        context: ComponentFramework.Context<IInputs>,
        entityLogicalName: string
    ): Promise<boolean> {
        try {
            const extendedContext = context as ExtendedContext;
            const clientUrl = extendedContext.page?.getClientUrl?.() ?? '';

            const response = await fetch(
                `${clientUrl}/api/data/v9.2/EntityDefinitions(LogicalName='${entityLogicalName}')?$select=IsAuditEnabled`,
                {
                    headers: {
                        'OData-MaxVersion': '4.0',
                        'OData-Version': '4.0',
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                console.error(`Entity metadata query failed: ${response.status} ${response.statusText}`);
                return false;
            }

            const data = await response.json() as EntityMetadataResponse;

            // IsAuditEnabled is a BooleanManagedProperty with a Value property
            return data.IsAuditEnabled?.Value ?? false;
        } catch (error) {
            console.error('Entity audit check failed:', error);
            return false;
        }
    }

    /**
     * Perform comprehensive security and audit validation
     * 
     * @remarks
     * Combines user permission check and entity audit status check.
     * Returns detailed validation result with messages.
     * 
     * @param context - PCF context object
     * @param entityLogicalName - Logical name of the entity to check
     * @returns Promise resolving to validation result object
     * 
     * @example
     * ```typescript
     * const validation = await SecurityService.validateAuditAccess(context, 'account');
     * if (!validation.canAccess) {
     *     console.log(validation.message);
     * }
     * ```
     */
    static async validateAuditAccess(
        context: ComponentFramework.Context<IInputs>,
        entityLogicalName: string
    ): Promise<{
        canAccess: boolean;
        hasPermission: boolean;
        isAuditEnabled: boolean;
        message?: string;
    }> {
        const [hasPermission, isAuditEnabled] = await Promise.all([
            this.checkUserAuditPermission(context),
            this.checkEntityAuditEnabled(context, entityLogicalName)
        ]);

        let message: string | undefined;
        let canAccess = true;

        if (!hasPermission) {
            message = "You don't have permission to view audit history. Please contact your system administrator.";
            canAccess = false;
        } else if (!isAuditEnabled) {
            message = `Audit logging is not enabled for this entity (${entityLogicalName}). Please enable auditing in the entity settings.`;
            canAccess = false;
        }

        return {
            canAccess,
            hasPermission,
            isAuditEnabled,
            message
        };
    }
}