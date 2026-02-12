import { useContext } from "react";
import { ControlContext } from "../context/control-context";
import { IInputs } from "../generated/ManifestTypes";
import { Attribute, Lookup } from "../interfaces/attributes";

export const useAudit = (context: ComponentFramework.Context<IInputs>) => {
    const { record } = useContext(ControlContext);
    
    //@ts-expect-error - Method does not exist in PCF SDK
    const formContext = Xrm.Page;

    const restoreChanges = async (attributes: Attribute[]) => {
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
        return context.webAPI.updateRecord(record.entityLogicalName, record.id, update);
    }

    const saveChanges = async () => {
        await formContext.data.refresh(true);
    }

    return {
        restoreChanges
    }
}