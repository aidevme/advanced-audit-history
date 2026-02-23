import { createContext } from "react";
import { IInputs } from "../generated/ManifestTypes";
import RecordData from "../interfaces/data/record";

interface IControlContext {
    record: RecordData
    context: ComponentFramework.Context<IInputs>
    parameters: IInputs,
    formatting: ComponentFramework.Formatting,
    resources: ComponentFramework.Resources
}

export const ControlContext = createContext<IControlContext>(undefined!);