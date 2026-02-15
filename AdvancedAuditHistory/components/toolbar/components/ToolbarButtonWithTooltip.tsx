import { ToolbarButton, Tooltip, useId } from "@fluentui/react-components";
import * as React from "react";

/**
 * Props for the ToolbarButtonWithTooltip component
 * 
 * @property tooltip - Tooltip text to display on hover
 * @property icon - Icon element to display in the button
 * @property onClick - Optional callback when button is clicked
 * @property idPrefix - Prefix for generating unique button ID
 * @property ariaLabel - Optional ARIA label for accessibility
 * @property disabled - Optional flag to disable the button
 */
interface ToolbarButtonWithTooltipProps {
    tooltip: string;
    icon: JSX.Element;
    onClick?: () => void;
    idPrefix: string;
    ariaLabel?: string;
    disabled?: boolean;
}

/**
 * Reusable toolbar button with tooltip wrapper component
 * 
 * @remarks
 * This component wraps a FluentUI ToolbarButton with a Tooltip for consistent
 * button behavior across the toolbar. It automatically generates unique IDs
 * and provides standardized tooltip positioning.
 * 
 * @example
 * ```tsx
 * <ToolbarButtonWithTooltip
 *   tooltip="Refresh data"
 *   icon={<ArrowClockwiseRegular />}
 *   onClick={handleRefresh}
 *   idPrefix="toolbar-refresh"
 *   ariaLabel="Refresh"
 * />
 * ```
 */
export const ToolbarButtonWithTooltip: React.FC<ToolbarButtonWithTooltipProps> = ({
    tooltip,
    icon,
    onClick,
    idPrefix,
    ariaLabel,
    disabled = false
}) => {
    const buttonId = useId(idPrefix);

    return (
        <Tooltip content={tooltip} relationship="description" withArrow>
            <ToolbarButton
                id={buttonId}
                icon={icon}
                onClick={onClick}
                aria-label={ariaLabel}
                disabled={disabled}
            />
        </Tooltip>
    );
};
