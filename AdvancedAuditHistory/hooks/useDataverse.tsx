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

const useDataverse = (context: ComponentFramework.Context<IInputs>) => {
    const [isLoading, setIsLoading] = useState(true);
    const [attributes, setAttributes] = useState<Attribute[]>([]);
    const [audits, setAudits] = useState<Audit[]>([]);

    const record = useMemo(() => {
        return {
            //@ts-expect-error - contextInfo is not recognized
            id: context?.mode.contextInfo.entityId,
            //@ts-expect-error - contextInfo is not recognized
            entityLogicalName: context?.mode.contextInfo.entityTypeName
        } as Record
    }, [context?.mode]);

    const xrmService = useMemo(() => {
        const service = XrmService.getInstance();
        service.setContext(context);
        return service;
    }, [context]);

    useEffect(() => {
        const fetchData = async () => {
            const attributes = await getAttributes();
            const audits = await getAudit(attributes);

            setAttributes(attributes);
            setAudits(audits);
            setIsLoading(false)
        }

        fetchData()
    }, [])

    const getAttributes = async (): Promise<AttributeMetada[]> => {
        const result = await xrmService.fetch(
            `api/data/v9.1/EntityDefinitions(LogicalName='${record.entityLogicalName}')/Attributes?$select=LogicalName,DisplayName&$filter=AttributeOf eq null&$orderby=DisplayName asc`,
        ) as EntityDefinition[];

        return result.filter(item => item.LogicalName && !item.LogicalName.includes("_composite"))
                    .map((item: EntityDefinition) => {
                        return {
                            logicalName: item.LogicalName,
                            displayName: item.DisplayName.UserLocalizedLabel?.Label
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
        const audits = await getAudit(attributes);
        setAudits(audits);
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