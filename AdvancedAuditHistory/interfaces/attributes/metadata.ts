import { AttributeTypeCode } from "../../enums/AttributeTypeCode";

export default interface AttributeMetada {
    logicalName: string;
    displayName: string;
    attributeType?: AttributeTypeCode;
    attributeTypeName?: string;
    format?: string;
    formatName?: string;
    isAuditEnabled?: boolean;
    isValidForRead?: boolean;
    isValidForCreate?: boolean;
    isValidForUpdate?: boolean;
}