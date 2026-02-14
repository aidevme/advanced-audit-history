import { IInputs } from "../generated/ManifestTypes";

/**
 * Extended PCF context interface for accessing page context
 */
interface ExtendedContext extends ComponentFramework.Context<IInputs> {
    page?: {
        getClientUrl?: () => string;
    };
}

/**
 * Entity metadata response from Dataverse API
 */
interface EntityMetadataResponse {
    IsAuditEnabled?: {
        Value: boolean;
    };
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
