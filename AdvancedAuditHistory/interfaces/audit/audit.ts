import { Attribute, Lookup } from "../attributes";

export default interface Audit {
    id: string;
    timestamp: Date;
    operation: string;
    user: Lookup;
    attributes: Attribute[];
}