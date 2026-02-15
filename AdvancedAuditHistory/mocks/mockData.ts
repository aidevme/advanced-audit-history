import { Audit } from "../interfaces/audit";
import { Attribute } from "../interfaces/attributes";

/**
 * Mock attributes for testing the control locally
 * These represent typical Dynamics 365 entity attributes
 */
export const mockAttributes: Attribute[] = [
    {
        logicalName: "name",
        displayName: "Account Name",
        attributeType: 0,
        attributeTypeName: "String",
        isAuditEnabled: true,
        isValidForRead: true,
        isValidForCreate: true,
        isValidForUpdate: true
    },
    {
        logicalName: "emailaddress1",
        displayName: "Email",
        attributeType: 0,
        attributeTypeName: "String",
        isAuditEnabled: true,
        isValidForRead: true,
        isValidForCreate: true,
        isValidForUpdate: true
    },
    {
        logicalName: "telephone1",
        displayName: "Main Phone",
        attributeType: 0,
        attributeTypeName: "String",
        isAuditEnabled: true,
        isValidForRead: true,
        isValidForCreate: true,
        isValidForUpdate: true
    },
    {
        logicalName: "revenue",
        displayName: "Annual Revenue",
        attributeType: 7,
        attributeTypeName: "Money",
        isAuditEnabled: true,
        isValidForRead: true,
        isValidForCreate: true,
        isValidForUpdate: true
    },
    {
        logicalName: "ownerid",
        displayName: "Owner",
        attributeType: 8,
        attributeTypeName: "Lookup",
        isAuditEnabled: true,
        isValidForRead: true,
        isValidForCreate: true,
        isValidForUpdate: true
    },
    {
        logicalName: "customertypecode",
        displayName: "Relationship Type",
        attributeType: 2,
        attributeTypeName: "Picklist",
        isAuditEnabled: true,
        isValidForRead: true,
        isValidForCreate: true,
        isValidForUpdate: true
    },
    {
        logicalName: "address1_city",
        displayName: "City",
        attributeType: 0,
        attributeTypeName: "String",
        isAuditEnabled: true,
        isValidForRead: true,
        isValidForCreate: true,
        isValidForUpdate: true
    },
    {
        logicalName: "address1_country",
        displayName: "Country/Region",
        attributeType: 0,
        attributeTypeName: "String",
        isAuditEnabled: true,
        isValidForRead: true,
        isValidForCreate: true,
        isValidForUpdate: true
    },
    {
        logicalName: "numberofemployees",
        displayName: "Number of Employees",
        attributeType: 1,
        attributeTypeName: "Integer",
        isAuditEnabled: true,
        isValidForRead: true,
        isValidForCreate: true,
        isValidForUpdate: true
    },
    {
        logicalName: "description",
        displayName: "Description",
        attributeType: 0,
        attributeTypeName: "Memo",
        isAuditEnabled: true,
        isValidForRead: true,
        isValidForCreate: true,
        isValidForUpdate: true
    }
];

/**
 * Mock audit records for testing the control locally
 * These represent typical audit history entries from Dynamics 365
 */
export const mockAudits: Audit[] = [
    {
        id: "audit-001",
        timestamp: new Date("2026-02-14T10:30:00"),
        operation: "Update",
        user: {
            id: "user-123",
            name: "John Doe",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "name",
                displayName: "Account Name",
                oldValue: "Contoso Ltd",
                newValue: "Contoso Corporation",
                attributeType: 0,
                attributeTypeName: "String",
                isAuditEnabled: true,
                isValidForRead: true
            },
            {
                logicalName: "emailaddress1",
                displayName: "Email",
                oldValue: "info@contoso.com",
                newValue: "contact@contosocorp.com",
                attributeType: 0,
                attributeTypeName: "String",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-002",
        timestamp: new Date("2026-02-13T15:45:00"),
        operation: "Update",
        user: {
            id: "user-456",
            name: "Jane Smith",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "revenue",
                displayName: "Annual Revenue",
                oldValue: "1000000",
                newValue: "1500000",
                attributeType: 7,
                attributeTypeName: "Money",
                isAuditEnabled: true,
                isValidForRead: true
            },
            {
                logicalName: "numberofemployees",
                displayName: "Number of Employees",
                oldValue: "50",
                newValue: "75",
                attributeType: 1,
                attributeTypeName: "Integer",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-003",
        timestamp: new Date("2026-02-12T09:15:00"),
        operation: "Update",
        user: {
            id: "user-789",
            name: "Michael Johnson",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "telephone1",
                displayName: "Main Phone",
                oldValue: "+1-555-0100",
                newValue: "+1-555-0199",
                attributeType: 0,
                attributeTypeName: "String",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-004",
        timestamp: new Date("2026-02-11T14:20:00"),
        operation: "Update",
        user: {
            id: "user-123",
            name: "John Doe",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "address1_city",
                displayName: "City",
                oldValue: "Seattle",
                newValue: "Redmond",
                attributeType: 0,
                attributeTypeName: "String",
                isAuditEnabled: true,
                isValidForRead: true
            },
            {
                logicalName: "address1_country",
                displayName: "Country/Region",
                oldValue: "USA",
                newValue: "United States",
                attributeType: 0,
                attributeTypeName: "String",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-005",
        timestamp: new Date("2026-02-10T11:00:00"),
        operation: "Update",
        user: {
            id: "user-456",
            name: "Jane Smith",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "description",
                displayName: "Description",
                oldValue: "Leading technology company",
                newValue: "Leading technology and consulting company specializing in enterprise solutions",
                attributeType: 0,
                attributeTypeName: "Memo",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-006",
        timestamp: new Date("2026-02-09T16:30:00"),
        operation: "Update",
        user: {
            id: "user-789",
            name: "Michael Johnson",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "ownerid",
                displayName: "Owner",
                oldValue: {
                    id: "user-123",
                    name: "John Doe",
                    entityType: "systemuser"
                },
                newValue: {
                    id: "user-456",
                    name: "Jane Smith",
                    entityType: "systemuser"
                },
                attributeType: 8,
                attributeTypeName: "Lookup",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-007",
        timestamp: new Date("2026-02-08T13:45:00"),
        operation: "Update",
        user: {
            id: "user-123",
            name: "John Doe",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "name",
                displayName: "Account Name",
                oldValue: "",
                newValue: "Contoso Ltd",
                attributeType: 0,
                attributeTypeName: "String",
                isAuditEnabled: true,
                isValidForRead: true
            },
            {
                logicalName: "emailaddress1",
                displayName: "Email",
                oldValue: "",
                newValue: "info@contoso.com",
                attributeType: 0,
                attributeTypeName: "String",
                isAuditEnabled: true,
                isValidForRead: true
            },
            {
                logicalName: "telephone1",
                displayName: "Main Phone",
                oldValue: "",
                newValue: "+1-555-0100",
                attributeType: 0,
                attributeTypeName: "String",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-008",
        timestamp: new Date("2026-02-07T10:10:00"),
        operation: "Update",
        user: {
            id: "user-456",
            name: "Jane Smith",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "customertypecode",
                displayName: "Relationship Type",
                oldValue: "Prospect",
                newValue: "Customer",
                attributeType: 2,
                attributeTypeName: "Picklist",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-009",
        timestamp: new Date("2026-02-06T08:30:00"),
        operation: "Update",
        user: {
            id: "user-789",
            name: "Michael Johnson",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "websiteurl",
                displayName: "Website",
                oldValue: "www.contoso.com",
                newValue: "https://www.contoso.com",
                attributeType: 0,
                attributeTypeName: "String",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-010",
        timestamp: new Date("2026-02-05T14:15:00"),
        operation: "Update",
        user: {
            id: "user-234",
            name: "Sarah Williams",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "creditlimit",
                displayName: "Credit Limit",
                oldValue: "50000",
                newValue: "100000",
                attributeType: 7,
                attributeTypeName: "Money",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-011",
        timestamp: new Date("2026-02-04T11:45:00"),
        operation: "Update",
        user: {
            id: "user-123",
            name: "John Doe",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "address1_postalcode",
                displayName: "ZIP/Postal Code",
                oldValue: "98052",
                newValue: "98053",
                attributeType: 0,
                attributeTypeName: "String",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-012",
        timestamp: new Date("2026-02-03T09:20:00"),
        operation: "Update",
        user: {
            id: "user-456",
            name: "Jane Smith",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "fax",
                displayName: "Fax",
                oldValue: "",
                newValue: "+1-555-0150",
                attributeType: 0,
                attributeTypeName: "String",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-013",
        timestamp: new Date("2026-02-02T16:00:00"),
        operation: "Update",
        user: {
            id: "user-345",
            name: "David Brown",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "industrycode",
                displayName: "Industry",
                oldValue: "Technology",
                newValue: "Software",
                attributeType: 2,
                attributeTypeName: "Picklist",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-014",
        timestamp: new Date("2026-02-01T12:30:00"),
        operation: "Update",
        user: {
            id: "user-234",
            name: "Sarah Williams",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "emailaddress1",
                displayName: "Email",
                oldValue: "info@contoso.com",
                newValue: "contact@contoso.com",
                attributeType: 0,
                attributeTypeName: "String",
                isAuditEnabled: true,
                isValidForRead: true
            },
            {
                logicalName: "emailaddress2",
                displayName: "Email Address 2",
                oldValue: "",
                newValue: "sales@contoso.com",
                attributeType: 0,
                attributeTypeName: "String",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-015",
        timestamp: new Date("2026-01-31T10:45:00"),
        operation: "Update",
        user: {
            id: "user-789",
            name: "Michael Johnson",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "revenue",
                displayName: "Annual Revenue",
                oldValue: "1500000",
                newValue: "2000000",
                attributeType: 7,
                attributeTypeName: "Money",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-016",
        timestamp: new Date("2026-01-30T15:20:00"),
        operation: "Update",
        user: {
            id: "user-123",
            name: "John Doe",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "address1_line1",
                displayName: "Street 1",
                oldValue: "123 Main St",
                newValue: "456 Enterprise Way",
                attributeType: 0,
                attributeTypeName: "String",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-017",
        timestamp: new Date("2026-01-29T13:10:00"),
        operation: "Update",
        user: {
            id: "user-456",
            name: "Jane Smith",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "donotbulkemail",
                displayName: "Do not allow Bulk Emails",
                oldValue: "false",
                newValue: "true",
                attributeType: 3,
                attributeTypeName: "Boolean",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-018",
        timestamp: new Date("2026-01-28T08:50:00"),
        operation: "Update",
        user: {
            id: "user-345",
            name: "David Brown",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "numberofemployees",
                displayName: "Number of Employees",
                oldValue: "75",
                newValue: "100",
                attributeType: 1,
                attributeTypeName: "Integer",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-019",
        timestamp: new Date("2026-01-27T14:35:00"),
        operation: "Update",
        user: {
            id: "user-234",
            name: "Sarah Williams",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "preferredcontactmethodcode",
                displayName: "Preferred Method of Contact",
                oldValue: "Email",
                newValue: "Phone",
                attributeType: 2,
                attributeTypeName: "Picklist",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-020",
        timestamp: new Date("2026-01-26T11:25:00"),
        operation: "Update",
        user: {
            id: "user-789",
            name: "Michael Johnson",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "telephone2",
                displayName: "Other Phone",
                oldValue: "",
                newValue: "+1-555-0200",
                attributeType: 0,
                attributeTypeName: "String",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-021",
        timestamp: new Date("2026-01-25T09:00:00"),
        operation: "Update",
        user: {
            id: "user-123",
            name: "John Doe",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "accountcategorycode",
                displayName: "Category",
                oldValue: "Standard",
                newValue: "Preferred Customer",
                attributeType: 2,
                attributeTypeName: "Picklist",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-022",
        timestamp: new Date("2026-01-24T16:40:00"),
        operation: "Update",
        user: {
            id: "user-456",
            name: "Jane Smith",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "name",
                displayName: "Account Name",
                oldValue: "",
                newValue: "Adventure Works",
                attributeType: 0,
                attributeTypeName: "String",
                isAuditEnabled: true,
                isValidForRead: true
            },
            {
                logicalName: "emailaddress1",
                displayName: "Email",
                oldValue: "",
                newValue: "contact@adventureworks.com",
                attributeType: 0,
                attributeTypeName: "String",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-023",
        timestamp: new Date("2026-01-23T12:15:00"),
        operation: "Update",
        user: {
            id: "user-345",
            name: "David Brown",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "address1_stateorprovince",
                displayName: "State/Province",
                oldValue: "WA",
                newValue: "Washington",
                attributeType: 0,
                attributeTypeName: "String",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-024",
        timestamp: new Date("2026-01-22T10:30:00"),
        operation: "Update",
        user: {
            id: "user-234",
            name: "Sarah Williams",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "description",
                displayName: "Description",
                oldValue: "Leading technology and consulting company specializing in enterprise solutions",
                newValue: "Leading technology and consulting company specializing in enterprise solutions and cloud services",
                attributeType: 0,
                attributeTypeName: "Memo",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-025",
        timestamp: new Date("2026-01-21T15:50:00"),
        operation: "Update",
        user: {
            id: "user-789",
            name: "Michael Johnson",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "ownerid",
                displayName: "Owner",
                oldValue: {
                    id: "user-456",
                    name: "Jane Smith",
                    entityType: "systemuser"
                },
                newValue: {
                    id: "user-345",
                    name: "David Brown",
                    entityType: "systemuser"
                },
                attributeType: 8,
                attributeTypeName: "Lookup",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-026",
        timestamp: new Date("2026-01-20T13:20:00"),
        operation: "Update",
        user: {
            id: "user-123",
            name: "John Doe",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "paymenttermscode",
                displayName: "Payment Terms",
                oldValue: "Net 30",
                newValue: "Net 60",
                attributeType: 2,
                attributeTypeName: "Picklist",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-027",
        timestamp: new Date("2026-01-19T08:45:00"),
        operation: "Update",
        user: {
            id: "user-456",
            name: "Jane Smith",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "telephone1",
                displayName: "Main Phone",
                oldValue: "+1-555-0199",
                newValue: "+1-555-0299",
                attributeType: 0,
                attributeTypeName: "String",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-028",
        timestamp: new Date("2026-01-18T14:00:00"),
        operation: "Update",
        user: {
            id: "user-345",
            name: "David Brown",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "creditonhold",
                displayName: "Credit Hold",
                oldValue: "false",
                newValue: "true",
                attributeType: 3,
                attributeTypeName: "Boolean",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-029",
        timestamp: new Date("2026-01-17T11:10:00"),
        operation: "Update",
        user: {
            id: "user-234",
            name: "Sarah Williams",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "address1_line2",
                displayName: "Street 2",
                oldValue: "",
                newValue: "Suite 300",
                attributeType: 0,
                attributeTypeName: "String",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-030",
        timestamp: new Date("2026-01-16T16:25:00"),
        operation: "Update",
        user: {
            id: "user-789",
            name: "Michael Johnson",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "shippingmethodcode",
                displayName: "Shipping Method",
                oldValue: "Ground",
                newValue: "Express",
                attributeType: 2,
                attributeTypeName: "Picklist",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-031",
        timestamp: new Date("2026-01-15T09:35:00"),
        operation: "Update",
        user: {
            id: "user-123",
            name: "John Doe",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "revenue",
                displayName: "Annual Revenue",
                oldValue: "2000000",
                newValue: "2500000",
                attributeType: 7,
                attributeTypeName: "Money",
                isAuditEnabled: true,
                isValidForRead: true
            },
            {
                logicalName: "numberofemployees",
                displayName: "Number of Employees",
                oldValue: "100",
                newValue: "125",
                attributeType: 1,
                attributeTypeName: "Integer",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-032",
        timestamp: new Date("2026-02-13T08:20:00"),
        operation: "Update",
        user: {
            id: "user-456",
            name: "Jane Smith",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "address1_latitude",
                displayName: "Latitude",
                oldValue: "47.6062",
                newValue: "47.6397",
                attributeType: 5,
                attributeTypeName: "Double",
                isAuditEnabled: true,
                isValidForRead: true
            },
            {
                logicalName: "address1_longitude",
                displayName: "Longitude",
                oldValue: "-122.3321",
                newValue: "-122.1283",
                attributeType: 5,
                attributeTypeName: "Double",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-033",
        timestamp: new Date("2026-02-12T15:00:00"),
        operation: "Update",
        user: {
            id: "user-345",
            name: "David Brown",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "participatesinworkflow",
                displayName: "Participates in Workflow",
                oldValue: "false",
                newValue: "true",
                attributeType: 3,
                attributeTypeName: "Boolean",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-034",
        timestamp: new Date("2026-02-11T10:40:00"),
        operation: "Update",
        user: {
            id: "user-234",
            name: "Sarah Williams",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "tickersymbol",
                displayName: "Ticker Symbol",
                oldValue: "",
                newValue: "CNTS",
                attributeType: 0,
                attributeTypeName: "String",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-035",
        timestamp: new Date("2026-02-10T14:55:00"),
        operation: "Update",
        user: {
            id: "user-789",
            name: "Michael Johnson",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "accountratingcode",
                displayName: "Account Rating",
                oldValue: "Hot",
                newValue: "Warm",
                attributeType: 2,
                attributeTypeName: "Picklist",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-036",
        timestamp: new Date("2026-02-09T11:30:00"),
        operation: "Update",
        user: {
            id: "user-123",
            name: "John Doe",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "name",
                displayName: "Account Name",
                oldValue: "",
                newValue: "Fabrikam Inc",
                attributeType: 0,
                attributeTypeName: "String",
                isAuditEnabled: true,
                isValidForRead: true
            },
            {
                logicalName: "telephone1",
                displayName: "Main Phone",
                oldValue: "",
                newValue: "+1-555-0300",
                attributeType: 0,
                attributeTypeName: "String",
                isAuditEnabled: true,
                isValidForRead: true
            },
            {
                logicalName: "emailaddress1",
                displayName: "Email",
                oldValue: "",
                newValue: "info@fabrikam.com",
                attributeType: 0,
                attributeTypeName: "String",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-037",
        timestamp: new Date("2026-02-08T09:15:00"),
        operation: "Update",
        user: {
            id: "user-456",
            name: "Jane Smith",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "donotphone",
                displayName: "Do not allow Phone Calls",
                oldValue: "false",
                newValue: "true",
                attributeType: 3,
                attributeTypeName: "Boolean",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-038",
        timestamp: new Date("2026-02-07T16:50:00"),
        operation: "Update",
        user: {
            id: "user-345",
            name: "David Brown",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "address1_freighttermscode",
                displayName: "Freight Terms",
                oldValue: "FOB",
                newValue: "No Charge",
                attributeType: 2,
                attributeTypeName: "Picklist",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-039",
        timestamp: new Date("2026-02-06T13:25:00"),
        operation: "Update",
        user: {
            id: "user-234",
            name: "Sarah Williams",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "stockexchange",
                displayName: "Stock Exchange",
                oldValue: "",
                newValue: "NASDAQ",
                attributeType: 0,
                attributeTypeName: "String",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-040",
        timestamp: new Date("2026-02-05T10:05:00"),
        operation: "Update",
        user: {
            id: "user-789",
            name: "Michael Johnson",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "originatingleadid",
                displayName: "Originating Lead",
                oldValue: {
                    id: "lead-111",
                    name: "Tech Trade Show Lead",
                    entityType: "lead"
                },
                newValue: {
                    id: "lead-222",
                    name: "Web Inquiry Lead",
                    entityType: "lead"
                },
                attributeType: 8,
                attributeTypeName: "Lookup",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-041",
        timestamp: new Date("2026-02-04T15:40:00"),
        operation: "Update",
        user: {
            id: "user-123",
            name: "John Doe",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "sic",
                displayName: "SIC Code",
                oldValue: "7372",
                newValue: "7373",
                attributeType: 0,
                attributeTypeName: "String",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-042",
        timestamp: new Date("2026-02-03T12:00:00"),
        operation: "Update",
        user: {
            id: "user-456",
            name: "Jane Smith",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "businesstypecode",
                displayName: "Business Type",
                oldValue: "Default Value",
                newValue: "Public",
                attributeType: 2,
                attributeTypeName: "Picklist",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-043",
        timestamp: new Date("2026-02-02T08:30:00"),
        operation: "Update",
        user: {
            id: "user-345",
            name: "David Brown",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "address2_city",
                displayName: "Other City",
                oldValue: "",
                newValue: "Bellevue",
                attributeType: 0,
                attributeTypeName: "String",
                isAuditEnabled: true,
                isValidForRead: true
            },
            {
                logicalName: "address2_stateorprovince",
                displayName: "Other State/Province",
                oldValue: "",
                newValue: "Washington",
                attributeType: 0,
                attributeTypeName: "String",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-044",
        timestamp: new Date("2026-02-01T14:10:00"),
        operation: "Update",
        user: {
            id: "user-234",
            name: "Sarah Williams",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "yominame",
                displayName: "Yomi Account Name",
                oldValue: "",
                newValue: "Contoso",
                attributeType: 0,
                attributeTypeName: "String",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-045",
        timestamp: new Date("2026-01-31T16:45:00"),
        operation: "Update",
        user: {
            id: "user-789",
            name: "Michael Johnson",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "ownershipcode",
                displayName: "Ownership",
                oldValue: "Private",
                newValue: "Public",
                attributeType: 2,
                attributeTypeName: "Picklist",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-046",
        timestamp: new Date("2026-01-30T09:20:00"),
        operation: "Update",
        user: {
            id: "user-123",
            name: "John Doe",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "transactioncurrencyid",
                displayName: "Currency",
                oldValue: {
                    id: "currency-usd",
                    name: "US Dollar",
                    entityType: "transactioncurrency"
                },
                newValue: {
                    id: "currency-eur",
                    name: "Euro",
                    entityType: "transactioncurrency"
                },
                attributeType: 8,
                attributeTypeName: "Lookup",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-047",
        timestamp: new Date("2026-01-29T11:55:00"),
        operation: "Update",
        user: {
            id: "user-456",
            name: "Jane Smith",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "territorycode",
                displayName: "Territory",
                oldValue: "West Coast",
                newValue: "Pacific Northwest",
                attributeType: 2,
                attributeTypeName: "Picklist",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-048",
        timestamp: new Date("2026-01-28T15:30:00"),
        operation: "Update",
        user: {
            id: "user-345",
            name: "David Brown",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "donotsendmm",
                displayName: "Send Marketing Materials",
                oldValue: "true",
                newValue: "false",
                attributeType: 3,
                attributeTypeName: "Boolean",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-049",
        timestamp: new Date("2026-01-27T10:15:00"),
        operation: "Update",
        user: {
            id: "user-234",
            name: "Sarah Williams",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "ftpsiteurl",
                displayName: "FTP Site",
                oldValue: "",
                newValue: "ftp://ftp.contoso.com",
                attributeType: 0,
                attributeTypeName: "String",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    {
        id: "audit-050",
        timestamp: new Date("2026-01-14T14:50:00"),
        operation: "Create",
        user: {
            id: "user-789",
            name: "Michael Johnson",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "marketcap",
                displayName: "Market Capitalization",
                oldValue: "5000000",
                newValue: "7500000",
                attributeType: 7,
                attributeTypeName: "Money",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    }
];
