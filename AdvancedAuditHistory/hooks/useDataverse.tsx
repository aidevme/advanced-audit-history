import { useEffect, useMemo, useState } from "react";
import { IInputs } from "../generated/ManifestTypes";
import { XrmService } from "./service";
import Record from "../interfaces/data/record";
import { EntityDefinition } from "../interfaces/definition";
import { Attribute, AttributeMetada, Lookup } from "../interfaces/attributes";
import { XrmRequest } from "../interfaces/xrm";
import { History } from "../interfaces/data";
import { Audit, AuditDetail } from "../interfaces/audit";
import { getFormattedValue } from "../utils/utils";
import { AttributeTypeCode } from "../enums/AttributeTypeCode";

const useDataverse = (context: ComponentFramework.Context<IInputs>) => {
    const [isLoading, setIsLoading] = useState(true);
    const [attributes, setAttributes] = useState<Attribute[]>([]);
    const [audits, setAudits] = useState<Audit[]>([]);

    // Detect test harness environment
    // Type assertion for PCF authoring mode and context info not in standard types
    interface ExtendedMode extends ComponentFramework.Mode {
        isAuthoringMode?: boolean;
        contextInfo?: {
            entityId?: string;
            entityTypeName?: string;
        };
    }
    const isTestHarness = (context.mode as ExtendedMode).isAuthoringMode !== true;

    const record = useMemo(() => {
        const mode = context?.mode as ExtendedMode;
        return {
            id: mode.contextInfo?.entityId ?? "00000000-0000-0000-0000-000000000000",
            entityLogicalName: mode.contextInfo?.entityTypeName ?? "account"
        } as Record
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
                setAttributes(mockAttributes);
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
        const result = await xrmService.fetch(
            `api/data/v9.1/EntityDefinitions(LogicalName='${record.entityLogicalName}')/Attributes?$select=LogicalName,DisplayName,AttributeType,AttributeTypeName,IsAuditEnabled,IsValidForRead,IsValidForCreate,IsValidForUpdate&$filter=AttributeOf eq null&$orderby=DisplayName asc`,
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

    const getAudit = async (attributes: Attribute[]): Promise<Audit[]> => {
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
            const oldValue = auditDetail.includes("OldValue") ? Object.keys(detail.OldValue!) : [];
            const newValue = auditDetail.includes("NewValue") ? Object.keys(detail.NewValue!) : [];

            const dataAttributes = attributes?.filter((attributeMetadata) => {
                return newValue.includes(attributeMetadata.logicalName) ||
                    newValue.includes(`_${attributeMetadata.logicalName}_value`) ||
                    oldValue.includes(attributeMetadata.logicalName) ||
                    oldValue.includes(`_${attributeMetadata.logicalName}_value`)
            }
            )?.map((attributeMetadata) => {
                return {
                    logicalName: attributeMetadata.logicalName,
                    displayName: attributeMetadata.displayName,
                    attributeType: attributeMetadata.attributeType,
                    attributeTypeName: attributeMetadata.attributeTypeName,
                    isAuditEnabled: attributeMetadata.isAuditEnabled,
                    isValidForRead: attributeMetadata.isValidForRead,
                    oldValue: oldValue.includes(attributeMetadata.logicalName)
                        ? getFormattedValue(oldValue, detail.OldValue, attributeMetadata.logicalName)
                        : oldValue.includes(`_${attributeMetadata.logicalName}_value`)
                            ? {
                                id: detail.OldValue![`_${attributeMetadata.logicalName}_value`],
                                name: detail.OldValue![`_${attributeMetadata.logicalName}_value@OData.Community.Display.V1.FormattedValue`],
                                entityType: detail.OldValue![`_${attributeMetadata.logicalName}_value@Microsoft.Dynamics.CRM.lookuplogicalname`]
                            } as Lookup
                            : "",
                    newValue: newValue.includes(attributeMetadata.logicalName)
                        ? getFormattedValue(newValue, detail.NewValue, attributeMetadata.logicalName)
                        : newValue.includes(`_${attributeMetadata.logicalName}_value`)
                            ? {
                                id: detail.NewValue![`_${attributeMetadata.logicalName}_value`],
                                name: detail.NewValue![`_${attributeMetadata.logicalName}_value@OData.Community.Display.V1.FormattedValue`],
                                entityType: detail.NewValue![`_${attributeMetadata.logicalName}_value@Microsoft.Dynamics.CRM.lookuplogicalname`]
                            } as Lookup
                            : "",
                };
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