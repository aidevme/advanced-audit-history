import Lookup from "./lookup";
import { AttributeTypeCode } from "../../enums/AttributeTypeCode";

export default interface Attribute {
    logicalName: string,
    displayName?: string | null,
    attributeType?: AttributeTypeCode,
    attributeTypeName?: string,
    isAuditEnabled?: boolean,
    isValidForRead?: boolean,
    isValidForCreate?: boolean,
    isValidForUpdate?: boolean,
    oldValue?: string | number | object | boolean | Lookup,
    newValue?: string | number | object | boolean | Lookup
}