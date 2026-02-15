# Mock Data for Local Testing

This folder contains mock data that is automatically used when running the control in the PCF test harness.

## How It Works

The `useDataverse` hook automatically detects when the control is running in the test harness (no Dataverse context) and loads mock data instead of making real API calls.

### Detection Logic

```typescript
// In useDataverse.tsx
const isTestHarness = !context?.mode?.contextInfo?.entityId;
```

When `isTestHarness` is `true`, the hook loads data from `mockData.ts` instead of calling the Dataverse Web API.

## Running the Control with Mock Data

```bash
npm start watch
```

This will launch the test harness with mock data automatically loaded. You'll see:

- **8 audit records** from 3 different users (John Doe, Jane Smith, Michael Johnson)
- **10 attributes** including Account Name, Email, Phone, Revenue, Owner, etc.
- Various operations: Create, Update, with realistic old/new values

## Mock Data Structure

### mockAttributes

Contains 10 typical Dynamics 365 entity attributes:

- String fields (name, email, phone, city, country)
- Numeric fields (revenue, number of employees)
- Lookup fields (owner)
- Picklist fields (relationship type)
- Memo fields (description)

### mockAudits

Contains 8 audit records spanning from Feb 7-14, 2026:

- Create operation (initial record creation)
- Multiple Update operations (field changes)
- Changes made by different users
- Realistic field value transitions

## Customizing Mock Data

To add your own test data, edit `mockData.ts`:

### Adding Attributes

```typescript
export const mockAttributes: Attribute[] = [
    {
        logicalName: "myfield",
        displayName: "My Custom Field",
        attributeType: 0,
        attributeTypeName: "String",
        isAuditEnabled: true,
        isValidForRead: true,
        isValidForCreate: true,
        isValidForUpdate: true
    },
    // ... existing attributes
];
```

### Adding Audit Records

```typescript
export const mockAudits: Audit[] = [
    {
        id: "audit-009",
        timestamp: new Date("2026-02-14T12:00:00"),
        operation: "Update",
        user: {
            id: "user-999",
            name: "Your Name",
            entityType: "systemuser"
        },
        attributes: [
            {
                logicalName: "myfield",
                displayName: "My Custom Field",
                oldValue: "old value",
                newValue: "new value",
                attributeType: 0,
                attributeTypeName: "String",
                isAuditEnabled: true,
                isValidForRead: true
            }
        ]
    },
    // ... existing audits
];
```

## Testing Specific Scenarios

### Testing with No Data

Set `mockAudits` to an empty array `[]` to test the "No Audit Data Available" message.

### Testing with Many Records

Duplicate audit records to test pagination, scrolling, and performance with large datasets.

### Testing Different Users

Add more unique users to test the multi-user filter functionality.

### Testing Date Ranges

Spread audit records across different dates to test date range filtering.

## Switching to Real Data

The control automatically uses real Dataverse data when:

- Deployed to a Dynamics 365/Power Apps environment
- The PCF context contains valid `entityId` and `entityTypeName`

No code changes needed - the switch is automatic!

## Mock Data vs Production

| Feature | Test Harness (Mock) | Production (Real) |
|---------|-------------------|-------------------|
| Data Source | `mockData.ts` | Dataverse Web API |
| Security Check | Bypassed | Full RBAC validation |
| Refresh | Reloads mock data | Fetches fresh data |
| Performance | Instant | Network dependent |
| Audit Operations | Pre-defined | Real user actions |

## Troubleshooting

### Mock data not loading

- Ensure `npm start watch` is running
- Check browser console for import errors
- Verify `mockData.ts` syntax is valid

### Real data loading in test harness

- The detection logic may have changed
- Check `useDataverse.tsx` isTestHarness condition
- Verify context.mode.contextInfo is undefined

### TypeScript errors

- Ensure mock data matches the `Audit` and `Attribute` interfaces
- Run `npm run build` to check for type errors
