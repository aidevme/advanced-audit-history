import { AuditDetail } from ".";

export default interface AuditDetailCollection {
    AuditDetails: AuditDetail[];
    PagingCookie: string,
    TotalRecordCount: number,
    MoreRecords: boolean
}