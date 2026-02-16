import { Audit } from "../interfaces/audit";
import { Attribute } from "../interfaces/attributes";
import mockDataJson from "./mockData.json";

/**
 * Mock attributes for testing the control locally
 * These represent typical Dynamics 365 entity attributes
 * Data is loaded from mockData.json
 */
export const mockAttributes: Attribute[] = mockDataJson.attributes;

/**
 * Mock audit records for testing the control locally
 * These represent typical audit history entries from Dynamics 365
 * Data is loaded from mockData.json with timestamp strings converted to Date objects
 */
export const mockAudits: Audit[] = mockDataJson.audits.map(audit => ({
    ...audit,
    timestamp: new Date(audit.timestamp)
}));
