import { createContext } from "react";
import { IInputs } from "../generated/ManifestTypes";
import Record from "../interfaces/data/record";

interface IControlContext {
    record: Record
    context: ComponentFramework.Context<IInputs>
    parameters: IInputs,
    formatting: ComponentFramework.Formatting,
    resources: ComponentFramework.Resources
}

export const ControlContext = createContext<IControlContext>(undefined!);