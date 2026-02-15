import { useContext } from "react";
import { ControlContext } from "../context/control-context";
import { IInputs } from "../generated/ManifestTypes";
import { Attribute, Lookup } from "../interfaces/attributes";

export const useAudit = (context: ComponentFramework.Context<IInputs>) => {
    const { record } = useContext(ControlContext);

    // Detect test harness mode - Xrm is not available
    const isTestHarness = typeof window !== 'undefined' && !(window as unknown as { Xrm?: unknown }).Xrm;

    //@ts-expect-error - Method does not exist in PCF SDK
    const formContext = isTestHarness ? null : Xrm.Page;

    const restoreChanges = async (attributes: Attribute[]) => {
        // Skip restore in test harness mode
        if (isTestHarness) {
            console.log('[useAudit] Restore skipped in test harness mode', attributes);
            return;
        }

        const mappedChanges = attributes.reduce<Record<string, string | number | object | boolean | null>>(
            (acc, attr) => {
                const name = attr.logicalName;
                const value = attr.oldValue !== undefined
                    ? typeof attr.oldValue === "object"
                        ? [attr.oldValue]
                        : attr.oldValue
                    : null;

                acc[name] = value;
                return acc;
            }, {}
        );

        await restore(mappedChanges);
        await saveChanges()
    };

    const restore = async (update: object) => {
        if (isTestHarness) {
            console.log('[useAudit] Mock restore:', update);
            return Promise.resolve();
        }
        return context.webAPI.updateRecord(record.entityLogicalName, record.id, update);
    }

    const saveChanges = async () => {
        if (isTestHarness || !formContext) {
            console.log('[useAudit] Mock save changes');
            return Promise.resolve();
        }
        await formContext.data.refresh(true);
    }

    return {
        restoreChanges
    }
}