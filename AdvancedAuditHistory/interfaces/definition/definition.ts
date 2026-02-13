import { DisplayName } from ".";

export default interface EntityDefinition {
    LogicalName: string;
    DisplayName: DisplayName;
    AttributeType?: number;
    AttributeTypeName?: {
        Value: string;
    };
    IsAuditEnabled?: {
        Value: boolean;
        CanBeChanged: boolean;
        ManagedPropertyLogicalName: string;
    };
    IsValidForRead?: boolean;
    IsValidForCreate?: boolean;
    IsValidForUpdate?: boolean;
}