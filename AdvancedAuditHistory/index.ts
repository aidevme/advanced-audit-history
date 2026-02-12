import AdvancedAuditHistoryApp, { IAdvancedAuditHistoryAppProps } from "./AdvancedAuditHistoryApp";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";

export class AdvancedAuditHistory implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private mainControl: ComponentFramework.ReactControl<IInputs, IOutputs>;
    private notifyOutputChanged: () => void;
    
    //constructor() { }

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
    }

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        return React.createElement(AdvancedAuditHistoryApp, { context });
    }

    public getOutputs(): IOutputs {
        return { };
    }

    public destroy(): void {
        this.mainControl.destroy()
    }
}