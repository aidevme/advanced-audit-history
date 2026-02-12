import Lookup from "./lookup";

export default interface Attribute {
    logicalName: string,
    displayName?: string | null,
    oldValue?: string | number | object | boolean | Lookup,
    newValue?: string | number | object | boolean | Lookup
}