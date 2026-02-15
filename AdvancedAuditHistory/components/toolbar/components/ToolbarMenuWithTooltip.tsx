import { Menu, MenuTrigger, MenuPopover, MenuList, MenuItem, ToolbarButton, Tooltip, useId } from "@fluentui/react-components";
import * as React from "react";

/**
 * Interface for menu option items
 * 
 * @property label - Display text for the menu item
 * @property icon - Icon element to display alongside the label
 * @property onClick - Callback when menu item is clicked
 */
export interface MenuOption {
    label: string;
    icon: JSX.Element;
    onClick: () => void;
}

/**
 * Props for the ToolbarMenuWithTooltip component
 * 
 * @property tooltip - Tooltip text to display on hover
 * @property triggerIcon - Icon for the menu trigger button
 * @property ariaLabel - ARIA label for the trigger button
 * @property idPrefix - Prefix for generating unique menu ID
 * @property options - Array of menu options to display
 */
interface ToolbarMenuWithTooltipProps {
    tooltip: string;
    triggerIcon: JSX.Element;
    ariaLabel: string;
    idPrefix: string;
    options: MenuOption[];
}

/**
 * Reusable toolbar menu with tooltip component
 * 
 * @remarks
 * This component provides a dropdown menu in the toolbar with tooltip support.
 * Menu options are data-driven, making it easy to add, remove, or modify items.
 * Automatically generates unique IDs for accessibility.
 * 
 * @example
 * ```tsx
 * <ToolbarMenuWithTooltip
 *   tooltip="Switch view type"
 *   triggerIcon={<GridRegular />}
 *   ariaLabel="View Type"
 *   idPrefix="toolbar-view"
 *   options={[
 *     { label: "Card", icon: <CardUiRegular />, onClick: () => setView('card') },
 *     { label: "Timeline", icon: <TimelineRegular />, onClick: () => setView('timeline') }
 *   ]}
 * />
 * ```
 */
export const ToolbarMenuWithTooltip: React.FC<ToolbarMenuWithTooltipProps> = ({
    tooltip,
    triggerIcon,
    ariaLabel,
    idPrefix,
    options
}) => {
    const menuId = useId(idPrefix);

    return (
        <Tooltip content={tooltip} relationship="description" withArrow>
            <Menu>
                <MenuTrigger>
                    <ToolbarButton id={menuId} aria-label={ariaLabel} icon={triggerIcon} />
                </MenuTrigger>
                <MenuPopover>
                    <MenuList>
                        {options.map((option, index) => (
                            <MenuItem
                                key={index}
                                icon={option.icon}
                                onClick={option.onClick}
                            >
                                {option.label}
                            </MenuItem>
                        ))}
                    </MenuList>
                </MenuPopover>
            </Menu>
        </Tooltip>
    );
};
