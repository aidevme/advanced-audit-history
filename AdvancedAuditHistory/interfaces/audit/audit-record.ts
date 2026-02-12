export default interface AuditRecord {
    "@odata.type"?: string;
    auditid: string;
    createdon: string;
    "createdon@OData.Community.Display.V1.FormattedValue": string;
    "_userid_value@Microsoft.Dynamics.CRM.lookuplogicalname": string;
    "operation@OData.Community.Display.V1.FormattedValue": string;
    operation?: number;
    action?: number;
    "action@OData.Community.Display.V1.FormattedValue": string;
    "_userid_value@OData.Community.Display.V1.FormattedValue": string;
    "_userid_value": string;
    attributemask?: string;
}