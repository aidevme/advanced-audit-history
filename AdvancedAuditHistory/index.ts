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
        // Extract configuration parameters from manifest
        // For "Multiple" type parameters, .raw can be a JSON string or array
        let configurationParameters: unknown[] = [];
        const rawConfig = context.parameters.configurationParameters?.raw;

        if (rawConfig) {
            if (typeof rawConfig === 'string') {
                try {
                    const parsed: unknown = JSON.parse(rawConfig);
                    if (Array.isArray(parsed)) {
                        configurationParameters = parsed;
                    }
                } catch {
                    // If JSON parsing fails, use empty array
                    configurationParameters = [];
                }
            } else if (Array.isArray(rawConfig)) {
                configurationParameters = rawConfig;
            }
        }

        // Note: boundFieldType can be determined from manifest or configuration
        // The bound field can be "SingleLine.Text" or "Lookup.Simple"
        // This is made available via manifest or configuration parameters
        let boundFieldType: "SingleLine.Text" | "Lookup.Simple" | undefined;

        // Try to extract boundFieldType from configuration if provided
        if (Array.isArray(configurationParameters) && configurationParameters.length > 0) {
            const config = configurationParameters[0] as Record<string, unknown>;
            if (typeof config.boundFieldType === 'string') {
                boundFieldType = config.boundFieldType as "SingleLine.Text" | "Lookup.Simple";
            }
        }

        const appProps: IAdvancedAuditHistoryAppProps = {
            context,
            configurationParameters,
            boundFieldType
        };

        return React.createElement(AdvancedAuditHistoryApp, appProps);
    }

    public getOutputs(): IOutputs {
        return {};
    }

    public destroy(): void {
        this.mainControl.destroy();
    }
}