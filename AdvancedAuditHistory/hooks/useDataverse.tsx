// AdvancedAuditHistory\hooks\useDataverse.tsx
import { useEffect, useMemo, useState } from "react";
import { IInputs } from "../generated/ManifestTypes";
import { XrmService } from "./service";
import { RecordData, Attribute, AttributeMetada, Lookup, EntityDefinition, XrmRequest, History, Audit, AuditDetail } from "../interfaces";
import { ExtendedMode } from "../interfaces/pcf";
import { getFormattedValue } from "../utils/utils";
import { AttributeTypeCode } from "../enums/AttributeTypeCode";

const useDataverse = (context: ComponentFramework.Context<IInputs>) => {
    const [isLoading, setIsLoading] = useState(true);
    const [attributes, setAttributes] = useState<AttributeMetada[]>([]);
    const [audits, setAudits] = useState<Audit[]>([]);

    // Detect test harness environment using ExtendedMode interface
    const isTestHarness = (context.mode as ExtendedMode).isAuthoringMode !== false;

    const record = useMemo((): RecordData => {
        const mode = context?.mode as ExtendedMode | undefined;
        return {
            id: mode?.contextInfo?.entityId ?? "00000000-0000-0000-0000-000000000000",
            entityLogicalName: mode?.contextInfo?.entityTypeName ?? "account"
        };
    }, [context?.mode]);

    const xrmService = useMemo(() => {
        const service = XrmService.getInstance();
        service.setContext(context);
        return service;
    }, [context]);

    useEffect(() => {
        const fetchData = async () => {
            if (isTestHarness) {
                // Load mock data for test harness
                const { mockAttributes, mockAudits } = await import('../mocks/mockData');
                setAttributes(mockAttributes as AttributeMetada[]);
                setAudits(mockAudits);
                setIsLoading(false);
            } else {
                // Load real data from Dataverse
                const attributes = await getAttributes();
                const audits = await getAudit(attributes);
                setAttributes(attributes);
                setAudits(audits);
                setIsLoading(false);
            }
        }

        void fetchData();
    }, [isTestHarness])

    const getAttributes = async (): Promise<AttributeMetada[]> => {
        // Define the attributes to select from the API
        const selectedAttributeFields: string[] = [
            'LogicalName',
            'DisplayName',
            'AttributeType',
            'AttributeTypeName',
            'IsAuditEnabled',
            'IsValidForRead',
            'IsValidForCreate',
            'IsValidForUpdate'
        ];

        const result = await xrmService.fetch(
            `api/data/v9.2/EntityDefinitions(LogicalName='${record.entityLogicalName}')/Attributes?$select=${selectedAttributeFields.join(',')}&$filter=AttributeOf eq null&$orderby=DisplayName asc`,
        ) as EntityDefinition[];

        return result.filter(item => item.LogicalName && !item.LogicalName.includes("_composite"))
            .map((item: EntityDefinition) => {
                return {
                    logicalName: item.LogicalName,
                    displayName: item.DisplayName.UserLocalizedLabel?.Label,
                    attributeType: item.AttributeType as AttributeTypeCode | undefined,
                    attributeTypeName: item.AttributeTypeName?.Value,
                    isAuditEnabled: item.IsAuditEnabled?.Value ?? false,
                    isValidForRead: item.IsValidForRead ?? true,
                    isValidForCreate: item.IsValidForCreate ?? true,
                    isValidForUpdate: item.IsValidForUpdate ?? true
                }
            });
    }

    const getAudit = async (attributes: AttributeMetada[]): Promise<Audit[]> => {
        const request: XrmRequest = {
            Target: {
                "@odata.type": `Microsoft.Dynamics.CRM.${record.entityLogicalName}`,
                [`${record.entityLogicalName}id`]: record.id
            },
            getMetadata: () => ({
                parameterTypes: {
                    Target: { structuralProperty: 5, typeName: "mscrm.crmbaseentity" },
                },
                operationType: 1,
                operationName: "RetrieveRecordChangeHistory",
            })
        }

        const audit = await xrmService.execute(request) as History;

        return audit.AuditDetailCollection.AuditDetails.map((detail: AuditDetail) => {
            const auditDetail = Object.keys(detail);
            const oldValueObj = auditDetail.includes("OldValue") ? detail.OldValue! : {};
            const newValueObj = auditDetail.includes("NewValue") ? detail.NewValue! : {};
            const oldValueKeys = Object.keys(oldValueObj);
            const newValueKeys = Object.keys(newValueObj);

            const getRawValue = (valueObj: unknown, logicalName: string): string | number | boolean | null | undefined => {
                if (!valueObj || typeof valueObj !== "object") {
                    return undefined;
                }

                const obj = valueObj as Partial<Record<string, unknown>>;
                const rawValue = obj[logicalName];

                if (typeof rawValue === "string" || typeof rawValue === "number" || typeof rawValue === "boolean") {
                    return rawValue;
                }

                return rawValue == null ? null : undefined;
            };

            // Helper to check whether a field name appears in an audit value object,
            // covering both direct key format and the _fieldname_value OData annotation format.
            const presentInObj = (keys: string[], logicalName: string) =>
                keys.includes(logicalName) ||
                keys.some(k => k === `_${logicalName}_value` || k.startsWith(`_${logicalName}_value@`));

            // Filter attributes that appear in the audit data (either base name or _value suffix format)
            const dataAttributes = attributes?.filter((attributeMetadata) => {
                return presentInObj(oldValueKeys, attributeMetadata.logicalName) ||
                    presentInObj(newValueKeys, attributeMetadata.logicalName);
            }
            )?.map((attributeMetadata) => {
                // Helper function to extract lookup value from audit data.
                // Handles both direct Lookup object format (mock data) and the real Dataverse
                // OData _fieldname_value annotation format that the audit API returns.
                const extractLookupValue = (valueObj: unknown, attrLogicalName: string): Lookup | string => {

                    const obj = valueObj as Partial<Record<string, unknown>>;

                    // Check for direct Lookup object (mock data or pre-formatted OData response)
                    const directValue = obj[attrLogicalName];
                    if (typeof directValue === "object" && directValue !== null && "id" in directValue && "name" in directValue) {
                        return directValue as Lookup;
                    }

                    // Check for _fieldname_value format (real Dataverse audit API response)
                    const valueKey = `_${attrLogicalName}_value`;
                    const valueExists = Object.keys(obj).some(key => key === valueKey || key.startsWith(`${valueKey}@`));

                    if (valueExists && obj[valueKey] != null) {
                        const idValue = obj[valueKey];
                        const nameValue = obj[`${valueKey}@OData.Community.Display.V1.FormattedValue`];
                        const entityTypeValue = obj[`${valueKey}@Microsoft.Dynamics.CRM.lookuplogicalname`];

                        return {
                            id: typeof idValue === "string" ? idValue : "",
                            name: typeof nameValue === "string" ? nameValue : "",
                            entityType: typeof entityTypeValue === "string" ? entityTypeValue : ""
                        } as Lookup;
                    }
                    return "";
                };

                // Detect lookup/customer/owner by both the numeric AttributeType code
                // (from EntityDefinitions API) and the string AttributeTypeName
                // (more reliable since it is always populated as a string from the API).
                // Also auto-detect via _fieldname_value key presence in the audit payload
                // as a final fallback when type metadata is missing or unreliable.
                const isLookupType =
                    attributeMetadata.attributeType === AttributeTypeCode.Lookup ||
                    attributeMetadata.attributeType === AttributeTypeCode.Customer ||
                    attributeMetadata.attributeType === AttributeTypeCode.Owner ||
                    attributeMetadata.attributeTypeName === "LookupType" ||
                    attributeMetadata.attributeTypeName === "CustomerType" ||
                    attributeMetadata.attributeTypeName === "OwnerType" ||
                    presentInObj(oldValueKeys, attributeMetadata.logicalName) && !oldValueKeys.includes(attributeMetadata.logicalName) ||
                    presentInObj(newValueKeys, attributeMetadata.logicalName) && !newValueKeys.includes(attributeMetadata.logicalName);

                const mappedAttribute: Attribute = {
                    logicalName: attributeMetadata.logicalName,
                    displayName: attributeMetadata.displayName,
                    attributeType: attributeMetadata.attributeType,
                    attributeTypeName: attributeMetadata.attributeTypeName,
                    isAuditEnabled: attributeMetadata.isAuditEnabled,
                    isValidForRead: attributeMetadata.isValidForRead,
                    oldValue: isLookupType
                        ? extractLookupValue(oldValueObj, attributeMetadata.logicalName)
                        : getFormattedValue(oldValueKeys, oldValueObj, attributeMetadata.logicalName),
                    newValue: isLookupType
                        ? extractLookupValue(newValueObj, attributeMetadata.logicalName)
                        : getFormattedValue(newValueKeys, newValueObj, attributeMetadata.logicalName),
                    oldValueRaw: getRawValue(oldValueObj, attributeMetadata.logicalName),
                    newValueRaw: getRawValue(newValueObj, attributeMetadata.logicalName)
                };
                return mappedAttribute;
            })

            return {
                id: detail.AuditRecord.auditid,
                timestamp: new Date(detail.AuditRecord.createdon),
                operation: detail.AuditRecord["action@OData.Community.Display.V1.FormattedValue"],
                user: {
                    id: detail.AuditRecord._userid_value,
                    name: detail.AuditRecord["_userid_value@OData.Community.Display.V1.FormattedValue"],
                    entityType: detail.AuditRecord["_userid_value@Microsoft.Dynamics.CRM.lookuplogicalname"]
                },
                attributes: dataAttributes
            } as Audit;
        });
    }

    const onRefresh = async () => {
        if (isTestHarness) {
            // Reload mock data for test harness
            const { mockAudits } = await import('../mocks/mockData');
            setAudits(mockAudits);
        } else {
            // Fetch fresh data from Dataverse
            const audits = await getAudit(attributes);
            setAudits(audits);
        }
    }

    return {
        isLoading,
        attributes,
        audits,
        onRefresh,
        record
    }
}

export default useDataverse;