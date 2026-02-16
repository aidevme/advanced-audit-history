/**
 * AuditActionTypeCode EnumType
 * Describes the type of audit action in Dynamics 365/Dataverse.
 * 
 * @remarks
 * Maps to Microsoft.Dynamics.CRM.AuditActionTypeCode
 * 
 * @see https://learn.microsoft.com/en-us/power-apps/developer/data-platform/reference/entities/audit
 */
export enum AuditActionTypeCode {
    /** Unknown action */
    Unknown = 0,

    /** Create action */
    Create = 1,

    /** Update action */
    Update = 2,

    /** Delete action */
    Delete = 3,

    /** Activate action */
    Activate = 4,

    /** Deactivate action */
    Deactivate = 5,

    /** Upsert action */
    Upsert = 6,

    /** Cascade action */
    Cascade = 11,

    /** Merge action */
    Merge = 12,

    /** Assign action */
    Assign = 13,

    /** Share action */
    Share = 14,

    /** Retrieve action */
    Retrieve = 15,

    /** Close action */
    Close = 16,

    /** Cancel action */
    Cancel = 17,

    /** Complete action */
    Complete = 18,

    /** Resolve action */
    Resolve = 20,

    /** Reopen action */
    Reopen = 21,

    /** Fulfill action */
    Fulfill = 22,

    /** Paid action */
    Paid = 23,

    /** Qualify action */
    Qualify = 24,

    /** Disqualify action */
    Disqualify = 25,

    /** Submit action */
    Submit = 26,

    /** Reject action */
    Reject = 27,

    /** Approve action */
    Approve = 28,

    /** Invoice action */
    Invoice = 29,

    /** Hold action */
    Hold = 30,

    /** Add Member action */
    AddMember = 31,

    /** Remove Member action */
    RemoveMember = 32,

    /** Associate Entities action */
    AssociateEntities = 33,

    /** Disassociate Entities action */
    DisassociateEntities = 34,

    /** Add Members action */
    AddMembers = 35,

    /** Remove Members action */
    RemoveMembers = 36,

    /** Add Item action */
    AddItem = 37,

    /** Remove Item action */
    RemoveItem = 38,

    /** Add Substitute action */
    AddSubstitute = 39,

    /** Remove Substitute action */
    RemoveSubstitute = 40,

    /** Set State action */
    SetState = 41,

    /** Renew action */
    Renew = 42,

    /** Revise action */
    Revise = 43,

    /** Win action */
    Win = 44,

    /** Lose action */
    Lose = 45,

    /** Internal Processing action */
    InternalProcessing = 46,

    /** Reschedule action */
    Reschedule = 47,

    /** Modify Share action */
    ModifyShare = 48,

    /** Unshare action */
    Unshare = 49,

    /** Book action */
    Book = 50,

    /** Generate Quote From Opportunity action */
    GenerateQuoteFromOpportunity = 51,

    /** Add To Queue action */
    AddToQueue = 52,

    /** Assign Role To Team action */
    AssignRoleToTeam = 53,

    /** Remove Role From Team action */
    RemoveRoleFromTeam = 54,

    /** Assign Role To User action */
    AssignRoleToUser = 55,

    /** Remove Role From User action */
    RemoveRoleFromUser = 56,

    /** Add Privileges to Role action */
    AddPrivilegesToRole = 57,

    /** Remove Privileges From Role action */
    RemovePrivilegesFromRole = 58,

    /** Replace Privileges In Role action */
    ReplacePrivilegesInRole = 59,

    /** Import Mappings action */
    ImportMappings = 60,

    /** Clone action */
    Clone = 61,

    /** Send Direct Email action */
    SendDirectEmail = 62,

    /** Enabled for organization action */
    EnabledForOrganization = 63,

    /** User Access via Web action */
    UserAccessViaWeb = 64,

    /** User Access via Web Services action */
    UserAccessViaWebServices = 65,

    /** Delete Entity action */
    DeleteEntity = 100,

    /** Delete Attribute action */
    DeleteAttribute = 101,

    /** Audit Change at Entity Level action */
    AuditChangeAtEntityLevel = 102,

    /** Audit Change at Attribute Level action */
    AuditChangeAtAttributeLevel = 103,

    /** Audit Change at Org Level action */
    AuditChangeAtOrgLevel = 104,

    /** Entity Audit Started action */
    EntityAuditStarted = 105,

    /** Attribute Audit Started action */
    AttributeAuditStarted = 106,

    /** Audit Enabled action */
    AuditEnabled = 107,

    /** Entity Audit Stopped action */
    EntityAuditStopped = 108,

    /** Attribute Audit Stopped action */
    AttributeAuditStopped = 109,

    /** Audit Disabled action */
    AuditDisabled = 110,

    /** Audit Log Deletion action */
    AuditLogDeletion = 111,

    /** User Access Audit Started action */
    UserAccessAuditStarted = 112,

    /** User Access Audit Stopped action */
    UserAccessAuditStopped = 113,

    /** Archive action */
    Archive = 115,

    /** Retain action */
    Retain = 116,

    /** RollbackRetain action */
    RollbackRetain = 117,

    /** IPFirewall Access Denied action */
    IPFirewallAccessDenied = 118,

    /** IPFirewall Access Allowed action */
    IPFirewallAccessAllowed = 119,

    /** Restore action */
    Restore = 120,

    /** Application Based Access Denied action */
    ApplicationBasedAccessDenied = 121,

    /** Application Based Access Allowed action */
    ApplicationBasedAccessAllowed = 122,

    /** Create - AI assisted action */
    CreateAIAssisted = 123,

    /** Update - AI assisted action */
    UpdateAIAssisted = 124,

    /** Read Unmasked action */
    ReadUnmasked = 125
}

/**
 * Get human-readable name for an audit action type code
 * 
 * @param typeCode - The AuditActionTypeCode value
 * @returns Human-readable action name
 */
export function getAuditActionTypeName(typeCode?: number): string {
    if (typeCode === undefined) return 'Unknown';
    return AuditActionTypeCode[typeCode] || 'Unknown';
}
