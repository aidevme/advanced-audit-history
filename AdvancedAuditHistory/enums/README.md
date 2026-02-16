# Enums Module

This module contains TypeScript enums and their associated helper functions for the Advanced Audit History PCF control. All enums map to Microsoft Dynamics 365/Dataverse types.

## Table of Contents

- [Enums Overview](#enums-overview)
- [AttributeTypeCode](#attributetypecode)
- [AuditActionTypeCode](#auditactiontypecode)
- [AuditOperationTypeCode](#auditoperationtypecode)
- [Helper Functions](#helper-functions)
- [Barrel Exports](#barrel-exports)
- [Usage Examples](#usage-examples)

---

## Enums Overview

| Enum | Purpose | Values |
|------|---------|--------|
| `AttributeTypeCode` | Classifies attribute data types in Dataverse entities | 21 values (0-20) |
| `AuditActionTypeCode` | Represents the action type recorded in audit logs | 126+ values (0-125) |
| `AuditOperationTypeCode` | Defines the operation type tracked in audit history | 10 values (1-200) |

---

## AttributeTypeCode

**Purpose:** Describes the data type of an attribute in Dynamics 365/Dataverse entities.

**Reference:** [Microsoft Docs - AttributeTypeCode](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/reference/attributetypecode)

### Values

| Value | Name | Description |
|-------|------|-------------|
| 0 | `Boolean` | Boolean (yes/no) attribute |
| 1 | `Customer` | Customer lookup attribute |
| 2 | `DateTime` | Date and time attribute |
| 3 | `Decimal` | Decimal attribute (high precision) |
| 4 | `Double` | Double attribute (floating point) |
| 5 | `Integer` | Integer attribute (whole number) |
| 6 | `Lookup` | Lookup attribute (relationship) |
| 7 | `Memo` | Multi-line text attribute |
| 8 | `Money` | Currency attribute |
| 9 | `Owner` | Owner/Team lookup attribute |
| 10 | `PartyList` | Party list attribute |
| 11 | `Picklist` | Option set attribute |
| 12 | `State` | State attribute |
| 13 | `Status` | Status attribute |
| 14 | `String` | Single-line text attribute |
| 15 | `Uniqueidentifier` | GUID/ID attribute |
| 16 | `CalendarRules` | Calendar rules attribute |
| 17 | `Virtual` | Virtual attribute (virtual audit, derived) |
| 18 | `BigInt` | Big integer attribute (64-bit) |
| 19 | `ManagedProperty` | Managed property attribute |
| 20 | `EntityName` | Entity name attribute |

### Helper Functions

#### `getAttributeTypeName(typeCode?: number): string`

Returns the human-readable name of an attribute type.

```typescript
import { getAttributeTypeName } from '../../enums';

getAttributeTypeName(14);  // Returns "String"
getAttributeTypeName(2);   // Returns "DateTime"
getAttributeTypeName(999); // Returns "Unknown"
```

#### `isAuditableType(typeCode?: number): boolean`

Checks if an attribute type supports auditing.

```typescript
import { isAuditableType } from '../../enums';

isAuditableType(14);  // Returns true (String is auditable)
isAuditableType(17);  // Returns false (Virtual is not auditable)
isAuditableType(16);  // Returns false (CalendarRules is not auditable)
```

---

## AuditActionTypeCode

**Purpose:** Represents the action type recorded in audit logs for security/compliance tracking.

**Reference:** [Microsoft Docs - AuditActionTypeCode](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/reference/entities/audit)

### Values by Category

#### Basic Operations (0-6)
| Value | Name | Description |
|-------|------|-------------|
| 0 | `Unknown` | Unknown action |
| 1 | `Create` | Record was created |
| 2 | `Update` | Record was updated |
| 3 | `Delete` | Record was deleted |
| 4 | `Activate` | Record was activated |
| 5 | `Deactivate` | Record was deactivated |
| 6 | `Upsert` | Record was upserted (create or update) |

#### CRM Operations (11-18, 20-30)
| Value | Name | Description |
|-------|------|-------------|
| 11 | `Cascade` | Cascade operation |
| 12 | `Merge` | Record was merged |
| 13 | `Assign` | Record was assigned |
| 14 | `Share` | Record was shared |
| 15 | `Retrieve` | Record was retrieved |
| 16 | `Close` | Record was closed |
| 17 | `Cancel` | Record was cancelled |
| 18 | `Complete` | Record was completed |
| 20 | `Resolve` | Ticket was resolved |
| 21 | `Reopen` | Ticket was reopened |
| 22 | `Fulfill` | Order was fulfilled |
| 23 | `Paid` | Invoice was marked paid |
| 24 | `Qualify` | Lead was qualified |
| 25 | `Disqualify` | Lead was disqualified |
| 26 | `Submit` | Item was submitted |
| 27 | `Reject` | Item was rejected |
| 28 | `Approve` | Item was approved |
| 29 | `Invoice` | Order was invoiced |
| 30 | `Hold` | Record was placed on hold |

#### Membership Operations (31-40)
| Value | Name | Description |
|-------|------|-------------|
| 31 | `AddMember` | Member was added |
| 32 | `RemoveMember` | Member was removed |
| 33 | `AssociateEntities` | Entities were associated |
| 34 | `DisassociateEntities` | Entities were disassociated |
| 35 | `AddMembers` | Multiple members were added |
| 36 | `RemoveMembers` | Multiple members were removed |
| 37 | `AddItem` | Item was added |
| 38 | `RemoveItem` | Item was removed |
| 39 | `AddSubstitute` | Substitute was added |
| 40 | `RemoveSubstitute` | Substitute was removed |

#### System Operations (41-65)
| Value | Name | Description |
|-------|------|-------------|
| 41 | `SetState` | State was set |
| 42 | `Renew` | Record was renewed |
| 43 | `Revise` | Record was revised |
| 44 | `Win` | Opportunity was won |
| 45 | `Lose` | Opportunity was lost |
| 46 | `InternalProcessing` | Internal processing occurred |
| 47 | `Reschedule` | Activity was rescheduled |
| 48 | `ModifyShare` | Share permission was modified |
| 49 | `Unshare` | Sharing was removed |
| 50 | `Book` | Appointment was booked |
| 51 | `GenerateQuoteFromOpportunity` | Quote was generated from opportunity |
| 52 | `AddToQueue` | Record was added to queue |
| 53 | `AssignRoleToTeam` | Role was assigned to team |
| 54 | `RemoveRoleFromTeam` | Role was removed from team |
| 55 | `AssignRoleToUser` | Role was assigned to user |
| 56 | `RemoveRoleFromUser` | Role was removed from user |
| 57 | `AddPrivilegesToRole` | Privileges were added to role |
| 58 | `RemovePrivilegesFromRole` | Privileges were removed from role |
| 59 | `ReplacePrivilegesInRole` | Privileges were replaced in role |
| 60 | `ImportMappings` | Mappings were imported |
| 61 | `Clone` | Record was cloned |
| 62 | `SendDirectEmail` | Direct email was sent |
| 63 | `EnabledForOrganization` | Feature was enabled for organization |
| 64 | `UserAccessViaWeb` | User accessed via web |
| 65 | `UserAccessViaWebServices` | User accessed via web services |

#### Audit Configuration (100-113)
| Value | Name | Description |
|-------|------|-------------|
| 100 | `DeleteEntity` | Entity was deleted |
| 101 | `DeleteAttribute` | Attribute was deleted |
| 102 | `AuditChangeAtEntityLevel` | Audit was changed at entity level |
| 103 | `AuditChangeAtAttributeLevel` | Audit was changed at attribute level |
| 104 | `AuditChangeAtOrgLevel` | Audit was changed at organization level |
| 105 | `EntityAuditStarted` | Entity auditing was started |
| 106 | `AttributeAuditStarted` | Attribute auditing was started |
| 107 | `AuditEnabled` | Audit was enabled |
| 108 | `EntityAuditStopped` | Entity auditing was stopped |
| 109 | `AttributeAuditStopped` | Attribute auditing was stopped |
| 110 | `AuditDisabled` | Audit was disabled |
| 111 | `AuditLogDeletion` | Audit log was deleted |
| 112 | `UserAccessAuditStarted` | User access auditing was started |
| 113 | `UserAccessAuditStopped` | User access auditing was stopped |

#### Advanced Operations (115-125)
| Value | Name | Description |
|-------|------|-------------|
| 115 | `Archive` | Record was archived |
| 116 | `Retain` | Record retention was applied |
| 117 | `RollbackRetain` | Record retention was rolled back |
| 118 | `IPFirewallAccessDenied` | IP firewall access was denied |
| 119 | `IPFirewallAccessAllowed` | IP firewall access was allowed |
| 120 | `Restore` | Record was restored |
| 121 | `ApplicationBasedAccessDenied` | Application-based access was denied |
| 122 | `ApplicationBasedAccessAllowed` | Application-based access was allowed |
| 123 | `CreateAIAssisted` | Record was created with AI assistance |
| 124 | `UpdateAIAssisted` | Record was updated with AI assistance |
| 125 | `ReadUnmasked` | Masked data was read unmasked |

### Helper Function

#### `getAuditActionTypeName(typeCode?: number): string`

Returns the human-readable name of an audit action.

```typescript
import { getAuditActionTypeName } from '../../enums';

getAuditActionTypeName(1);    // Returns "Create"
getAuditActionTypeName(2);    // Returns "Update"
getAuditActionTypeName(120);  // Returns "Restore"
getAuditActionTypeName(999);  // Returns "Unknown"
```

---

## AuditOperationTypeCode

**Purpose:** Defines the operation type tracked in audit history records.

**Reference:** [Microsoft Docs - Audit Entity](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/reference/entities/audit)

### Values

| Value | Name | Description |
|-------|------|-------------|
| 1 | `Create` | Record creation operation |
| 2 | `Update` | Record update operation |
| 3 | `Delete` | Record deletion operation |
| 4 | `Access` | Record access operation |
| 5 | `Upsert` | Record upsert operation |
| 115 | `Archive` | Record archive operation |
| 116 | `Retain` | Record retention operation |
| 117 | `RollbackRetain` | Record retention rollback operation |
| 118 | `Restore` | Record restore operation |
| 200 | `CustomOperation` | Custom operation |

### Helper Function

#### `getAuditOperationTypeName(typeCode?: number): string`

Returns the human-readable name of an audit operation.

```typescript
import { getAuditOperationTypeName } from '../../enums';

getAuditOperationTypeName(1);   // Returns "Create"
getAuditOperationTypeName(2);   // Returns "Update"
getAuditOperationTypeName(200); // Returns "CustomOperation"
getAuditOperationTypeName(999); // Returns "Unknown"
```

---

## Helper Functions

All enums include helper functions to convert numeric codes to human-readable names:

### Pattern

```typescript
export function get<EnumName>Name(typeCode?: number): string {
    if (typeCode === undefined) return 'Unknown';
    return <EnumName>[typeCode] || 'Unknown';
}
```

### Behavior

- **Returns `'Unknown'`** when input is `undefined`
- **Returns `'Unknown'`** when the code doesn't exist in the enum
- **Returns the enum member name** for valid codes

---

## Barrel Exports

The `index.ts` file provides centralized exports for all enums and helpers:

```typescript
export { AttributeTypeCode, getAttributeTypeName } from './AttributeTypeCode';
export { AuditActionTypeCode, getAuditActionTypeName } from './AuditActionTypeCode';
export { AuditOperationTypeCode, getAuditOperationTypeName } from './AuditOperationTypeCode';
```

---

## Usage Examples

### Basic Enum Usage

```typescript
import { AttributeTypeCode, AuditActionTypeCode } from '../../enums';

// Check attribute type
if (attribute.attributeType === AttributeTypeCode.String) {
    console.log('This is a text field');
}

// Check audit action
if (auditRecord.action === AuditActionTypeCode.Create) {
    console.log('Record was created');
}
```

### Using Helper Functions

```typescript
import { 
    getAttributeTypeName, 
    getAuditActionTypeName,
    getAuditOperationTypeName 
} from '../../enums';

// Get display names
const typeName = getAttributeTypeName(14);        // "String"
const actionName = getAuditActionTypeName(1);     // "Create"
const operationName = getAuditOperationTypeName(2); // "Update"

// Display in UI
console.log(`Field Type: ${typeName}`);
console.log(`Action: ${actionName}`);
console.log(`Operation: ${operationName}`);
```

### In Components

```typescript
import React from 'react';
import { AttributeTypeCode, getAttributeTypeName } from '../../enums';
import { Icons } from '../../tools/IconTools';

interface AttributeDisplayProps {
    attributeType?: AttributeTypeCode;
}

export const AttributeDisplay: React.FC<AttributeDisplayProps> = ({ attributeType }) => {
    const typeName = getAttributeTypeName(attributeType);
    
    return (
        <div>
            <span>{typeName}</span>
        </div>
    );
};
```

### Type Safety

```typescript
import { AuditActionTypeCode } from '../../enums';

// This is type-safe - only valid enum values allowed
const action: AuditActionTypeCode = AuditActionTypeCode.Create; // ✅

// TypeScript will error on invalid values
const invalid: AuditActionTypeCode = 999; // ❌ TypeScript Error
```

### Filtering and Mapping

```typescript
import { AuditActionTypeCode, getAuditActionTypeName } from '../../enums';

const auditRecords = [
    { id: 1, action: AuditActionTypeCode.Create },
    { id: 2, action: AuditActionTypeCode.Update },
    { id: 3, action: AuditActionTypeCode.Delete },
];

// Filter creates only
const createRecords = auditRecords.filter(
    r => r.action === AuditActionTypeCode.Create
);

// Map to display format
const displayRecords = auditRecords.map(r => ({
    id: r.id,
    action: getAuditActionTypeName(r.action)
}));
```

---

## Notes

- All helper functions handle `undefined` gracefully, returning `'Unknown'`
- Enums are zero-indexed but some values have gaps (non-sequential numbering)
- Use helper functions for user-facing displays to ensure consistency
- For TypeScript type safety, always use the enum directly in code (not string literals)
- Refer to [Microsoft Docs](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/reference/entities/audit) for complete Dataverse documentation
