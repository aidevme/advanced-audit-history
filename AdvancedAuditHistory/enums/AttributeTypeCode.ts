/**
 * AttributeTypeCode EnumType
 * Describes the type of an attribute in Dynamics 365/Dataverse.
 * 
 * @remarks
 * Maps to Microsoft.Dynamics.CRM.AttributeTypeCode
 * 
 * @see https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/reference/attributetypecode
 */
export enum AttributeTypeCode {
    /** A Boolean attribute */
    Boolean = 0,
    
    /** An attribute that represents a customer */
    Customer = 1,
    
    /** A date/time attribute */
    DateTime = 2,
    
    /** A decimal attribute */
    Decimal = 3,
    
    /** A double attribute */
    Double = 4,
    
    /** An integer attribute */
    Integer = 5,
    
    /** A lookup attribute */
    Lookup = 6,
    
    /** A memo attribute */
    Memo = 7,
    
    /** A money attribute */
    Money = 8,
    
    /** An owner attribute */
    Owner = 9,
    
    /** A partylist attribute */
    PartyList = 10,
    
    /** A picklist attribute */
    Picklist = 11,
    
    /** A state attribute */
    State = 12,
    
    /** A status attribute */
    Status = 13,
    
    /** A string attribute */
    String = 14,
    
    /** An attribute that is an ID */
    Uniqueidentifier = 15,
    
    /** An attribute that contains calendar rules */
    CalendarRules = 16,
    
    /** An attribute that is created by the system at run time */
    Virtual = 17,
    
    /** A big integer attribute */
    BigInt = 18,
    
    /** A managed property attribute */
    ManagedProperty = 19,
    
    /** An entity name attribute */
    EntityName = 20
}

/**
 * Get human-readable name for an attribute type code
 * 
 * @param typeCode - The AttributeTypeCode value
 * @returns Human-readable type name
 */
export function getAttributeTypeName(typeCode?: number): string {
    if (typeCode === undefined) return 'Unknown';
    return AttributeTypeCode[typeCode] || 'Unknown';
}

/**
 * Check if an attribute type supports auditing
 * 
 * @param typeCode - The AttributeTypeCode value
 * @returns true if the type supports auditing
 */
export function isAuditableType(typeCode?: number): boolean {
    if (typeCode === undefined) return false;
    
    // Virtual and CalendarRules typically don't support auditing
    const nonAuditableTypes = [
        AttributeTypeCode.Virtual,
        AttributeTypeCode.CalendarRules
    ];
    
    return !nonAuditableTypes.includes(typeCode);
}
