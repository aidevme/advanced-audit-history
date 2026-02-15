import { useContext } from "react";
import { ControlContext } from "../context/control-context";
import { IInputs } from "../generated/ManifestTypes";
import { Attribute, Lookup } from "../interfaces/attributes";
import { ExtendedMode } from "../interfaces/pcf";

export const useAudit = (context: ComponentFramework.Context<IInputs>) => {
    const { record } = useContext(ControlContext);

    // Detect test harness mode using PCF authoring mode property
    const isTestHarness = (context.mode as ExtendedMode).isAuthoringMode !== true;

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