/**
 * AuditOperationTypeCode EnumType
 * Describes the type of audit operation in Dynamics 365/Dataverse.
 * 
 * @remarks
 * Maps to Microsoft.Dynamics.CRM.AuditOperationTypeCode
 * 
 * @see https://learn.microsoft.com/en-us/power-apps/developer/data-platform/reference/entities/audit
 */
export enum AuditOperationTypeCode {
    /** Create action */
    Create = 1,

    /** Update action */
    Update = 2,

    /** Delete action */
    Delete = 3,

    /** Access action */
    Access = 4,

    /** Upsert action */
    Upsert = 5,

    /** CustomOperation action */
    CustomOperation = 200,

    /** Archive action */
    Archive = 115,

    /** Retain action */
    Retain = 116,

    /** RollbackRetain action */
    RollbackRetain = 117,

    /** Restore action */
    Restore = 118
}

/**
 * Get human-readable name for an audit operation type code
 * 
 * @param typeCode - The AuditOperationTypeCode value
 * @returns Human-readable operation name
 */
export function getAuditOperationTypeName(typeCode?: number): string {
    if (typeCode === undefined) return 'Unknown';
    return AuditOperationTypeCode[typeCode] || 'Unknown';
}
