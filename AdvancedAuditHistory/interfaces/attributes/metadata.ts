import { AttributeTypeCode } from "../../enums/AttributeTypeCode";

export default interface AttributeMetada {
    logicalName: string;
    displayName: string;
    attributeType?: AttributeTypeCode;
    attributeTypeName?: string;
    isAuditEnabled?: boolean;
    isValidForRead?: boolean;
    isValidForCreate?: boolean;
    isValidForUpdate?: boolean;
}