// AdvancedAuditHistory\hooks\useUserInfo.tsx
import { useEffect, useState, useMemo } from "react";
import { IInputs } from "../generated/ManifestTypes";

/**
 * Interface representing a security role assigned to a user
 */
interface SecurityRole {
    /** Role unique identifier */
    roleid: string;
    /** Role name */
    name: string;
    /** Business unit ID */
    businessunitid?: string;
}

/**
 * System user roles entity response
 */
interface SystemUserRoleEntity {
    /** Role unique identifier */
    roleid: string;
}

/**
 * Interface for current user information
 */
export interface UserInfo {
    /** User's full name */
    userName: string;
    /** User's unique identifier (GUID) */
    userId: string;
    /** Array of security roles assigned to the user */
    securityRoles: SecurityRole[];
    /** Loading state indicator */
    isLoading: boolean;
}

/**
 * Custom hook to retrieve current user information including security roles.
 * 
 * @remarks
 * Fetches user data from PCF context.userSettings and security roles from Dataverse Web API.
 * Returns loading state while fetching security roles asynchronously.
 * 
 * @param context - PCF context object
 * @returns UserInfo object containing user name, ID, security roles, and loading state
 * 
 * @example
 * ```tsx
 * const { userName, userId, securityRoles, isLoading } = useUserInfo(context);
 * 
 * if (isLoading) return <Spinner />;
 * 
 * return (
 *   <div>
 *     <p>User: {userName}</p>
 *     <p>ID: {userId}</p>
 *     <p>Roles: {securityRoles.map(r => r.name).join(', ')}</p>
 *   </div>
 * );
 * ```
 */
export const useUserInfo = (context: ComponentFramework.Context<IInputs>): UserInfo => {
    const [securityRoles, setSecurityRoles] = useState<SecurityRole[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Extract user information from context.userSettings
    const userName = useMemo(() => {
        return context.userSettings.userName ?? "Unknown User";
    }, [context.userSettings.userName]);

    const userId = useMemo(() => {
        return context.userSettings.userId ?? "";
    }, [context.userSettings.userId]);

    const userRoleIds = useMemo(() => {
        const roleIds = context.userSettings.securityRoles ?? [];
        return roleIds.map((id) => id.replace(/{|}/g, ""));
    }, [context.userSettings.securityRoles]);

    useEffect(() => {
        const fetchSecurityRoles = async () => {
            if (!userId) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const cleanedUserId = userId.replace(/{|}/g, "");

                let roleIds = [...userRoleIds];

                if (roleIds.length === 0) {
                    // Step 1: Get role IDs from the systemuserroles intersect entity
                    const userRolesResponse = await context.webAPI.retrieveMultipleRecords(
                        "systemuserroles",
                        `?$filter=systemuserid eq ${cleanedUserId}&$select=roleid`
                    );

                    if (!userRolesResponse.entities || userRolesResponse.entities.length === 0) {
                        setSecurityRoles([]);
                        return;
                    }

                    roleIds = (userRolesResponse.entities as SystemUserRoleEntity[])
                        .map(entity => entity.roleid.replace(/{|}/g, ""));
                }

                if (roleIds.length === 0) {
                    setSecurityRoles([]);
                    return;
                }

                // Step 2: Fetch role details from the role entity
                const roleFilter = roleIds.map(id => `roleid eq ${id}`).join(" or ");
                const rolesResponse = await context.webAPI.retrieveMultipleRecords(
                    "role",
                    `?$filter=${roleFilter}&$select=roleid,name,businessunitid`
                );

                setSecurityRoles((rolesResponse.entities as SecurityRole[]) ?? []);
            } catch (error) {
                console.error("Error fetching security roles:", error);
                setSecurityRoles([]);
            } finally {
                setIsLoading(false);
            }
        };

        void fetchSecurityRoles();
    }, [userId, userRoleIds, context.webAPI]);

    return {
        userName,
        userId,
        securityRoles,
        isLoading
    };
};
