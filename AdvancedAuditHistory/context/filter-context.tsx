import { createContext } from "react";
import { IInputs } from "../generated/ManifestTypes";
import { Attribute } from "../interfaces/attributes";

interface IFilterContext {
    filter?: Attribute[]
}

export const FilterContext = createContext<IFilterContext>(undefined!);