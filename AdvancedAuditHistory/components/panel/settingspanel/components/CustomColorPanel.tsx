import * as React from "react";
import { Field, Switch } from "@fluentui/react-components";
import { ControlContext } from "../../../../context/control-context";

/**
 * CustomColorPanel component displays a placeholder for custom color configuration.
 * 
 * @remarks
 * This component is currently a placeholder indicating the feature is not yet implemented.
 * Future versions will allow users to customize audit history colors for different
 * change types, field categories, and user-defined themes.
 * 
 * @example
 * ```tsx
 * <CustomColorPanel />
 * ```
 */
export const CustomColorPanel: React.FC = () => {
    const { resources } = React.useContext(ControlContext);

    return (
        <Field
            label={resources.getString("settings-panel-do-not-use-colors-label")}
            hint={resources.getString("custom-color-panel-not-implemented")}
        >
            <Switch />
        </Field>
    );
};