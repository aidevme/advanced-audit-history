import { Audit } from "../interfaces/audit";
import { Dynamic } from "../interfaces/data";

export const getFormattedValue = (
    fields: string[], 
    value: Dynamic | undefined, 
    logicalName: string
): string | number | boolean | object | undefined => {
    if (!value) 
        return value;

    if (fields.includes(`${logicalName}@OData.Community.Display.V1.FormattedValue`))
        return value[`${logicalName}@OData.Community.Display.V1.FormattedValue`];
    else
        return value[logicalName];
}

export const sortAudits = (audits: Audit[], order: 'ascending' | 'descending') => {
    return order == "ascending" ?
            audits.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
            : audits.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export const isNullOrEmpty = (value: unknown) => {
    if(value === '' || value == null || !value)
        return true;
    
    return false;
}