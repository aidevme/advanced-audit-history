import { useContext, useRef } from "react";
import { ControlContext } from "../context/control-context";
import { IInputs } from "../generated/ManifestTypes";
import { Attribute, Lookup } from "../interfaces/attributes";
import { ExtendedContext, ExtendedMode } from "../interfaces/pcf";
import { AttributeTypeCode } from "../enums/AttributeTypeCode";

export const useAudit = (context: ComponentFramework.Context<IInputs>) => {
    const { record } = useContext(ControlContext);
    const entitySetNameCache = useRef<Map<string, string>>(new Map());

    // Detect test harness mode using PCF authoring mode property
    const isTestHarness = (context.mode as ExtendedMode).isAuthoringMode !== false;

    const restoreChanges = async (attributes: Attribute[]) => {
        // Skip restore in test harness mode
        if (isTestHarness) {
            console.log('[useAudit] Restore skipped in test harness mode', attributes);
            return;
        }

        const mappedChanges: Record<string, string | number | object | boolean | null> = {};

        for (const attr of attributes) {
            const name = attr.logicalName;
            const value = attr.oldValue ?? null;

            if (value === null) {
                mappedChanges[name] = null;
                continue;
            }

            if (isLookupValue(value)) {
                const entitySetName = await getEntitySetName(context, entitySetNameCache.current, value.entityType);
                if (!entitySetName) {
                    console.warn('[useAudit] Unable to resolve entity set name for lookup restore', value);
                    continue;
                }

                // Dataverse lookup restore uses @odata.bind to the target entity set
                mappedChanges[`${name}@odata.bind`] = `/${entitySetName}(${value.id})`;
                continue;
            }

            if (isNumericAttribute(attr.attributeType) && typeof value === "string") {
                const parsedValue = parseNumericValue(value);
                mappedChanges[name] = parsedValue ?? value;
                continue;
            }

            if (isOptionSetAttribute(attr.attributeType) && typeof value === "string") {
                const parsedValue = parseNumericValue(value);
                mappedChanges[name] = parsedValue ?? value;
                continue;
            }

            if (attr.attributeType === AttributeTypeCode.Boolean && typeof value === "string") {
                const parsedValue = parseBooleanValue(value);
                mappedChanges[name] = parsedValue ?? value;
                continue;
            }

            mappedChanges[name] = value;
        }

        await restore(mappedChanges);
    };

    const restore = async (update: object) => {
        if (isTestHarness) {
            console.log('[useAudit] Mock restore:', update);
            return Promise.resolve();
        }
        // Update the record via PCF WebAPI
        // The platform will automatically refresh the form after successful update
        return context.webAPI.updateRecord(record.entityLogicalName, record.id, update);
    }

    return {
        restoreChanges
    }
}

const isLookupValue = (value: unknown): value is Lookup => {
    return Boolean(
        value &&
        typeof value === "object" &&
        "id" in value &&
        "entityType" in value
    );
};

const isNumericAttribute = (attributeType?: AttributeTypeCode) => {
    if (attributeType === undefined) {
        return false;
    }

    const numericTypes = new Set<AttributeTypeCode>([
        AttributeTypeCode.Integer,
        AttributeTypeCode.BigInt,
        AttributeTypeCode.Decimal,
        AttributeTypeCode.Double,
        AttributeTypeCode.Money
    ]);

    return numericTypes.has(attributeType);
};

const isOptionSetAttribute = (attributeType?: AttributeTypeCode) => {
    if (attributeType === undefined) {
        return false;
    }

    const optionSetTypes = new Set<AttributeTypeCode>([
        AttributeTypeCode.Picklist,
        AttributeTypeCode.State,
        AttributeTypeCode.Status
    ]);

    return optionSetTypes.has(attributeType);
};

const parseNumericValue = (value: string): number | null => {
    const normalized = value.replace(/[^0-9.-]/g, "");
    if (!normalized.trim()) {
        return null;
    }

    const parsed = Number(normalized);
    return Number.isNaN(parsed) ? null : parsed;
};

const parseBooleanValue = (value: string): boolean | null => {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true" || normalized === "yes") {
        return true;
    }
    if (normalized === "false" || normalized === "no") {
        return false;
    }
    return null;
};

const getEntitySetName = async (
    context: ComponentFramework.Context<IInputs>,
    cache: Map<string, string>,
    logicalName: string
): Promise<string | undefined> => {
    const extendedContext = context as ExtendedContext;
    const clientUrl = extendedContext.page?.getClientUrl?.() ?? "";

    if (!clientUrl) {
        return undefined;
    }

    const cached = cache.get(logicalName);
    if (cached) {
        return cached;
    }

    const response = await fetch(
        `${clientUrl}/api/data/v9.2/EntityDefinitions(LogicalName='${logicalName}')?$select=EntitySetName`,
        {
            headers: {
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
    );

    if (!response.ok) {
        console.error(`Entity set lookup failed: ${response.status} ${response.statusText}`);
        return undefined;
    }

    const data = await response.json() as { EntitySetName?: string };
    const entitySetName = data.EntitySetName ?? "";

    if (entitySetName) {
        cache.set(logicalName, entitySetName);
        return entitySetName;
    }

    return undefined;
};