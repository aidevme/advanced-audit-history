import { AuditRecord } from ".";
import { Dynamic } from "../data";

export default interface AuditDetail {
    OldValue?: Dynamic;
    NewValue?: Dynamic;
    AuditRecord: AuditRecord;
}