import { Input, Tooltip, useId } from "@fluentui/react-components";
import { Search20Regular, Dismiss20Regular } from '@fluentui/react-icons';
import * as React from "react";

/**
 * Props for the SearchInput component
 * 
 * @property value - Current search value
 * @property placeholder - Placeholder text for the input
 * @property tooltip - Tooltip text to display on hover
 * @property onChange - Callback when search value changes
 * @property onClear - Callback when clear button is clicked
 * @property width - Optional width of the input (default: 250)
 */
interface SearchInputProps {
    value: string;
    placeholder: string;
    tooltip: string;
    onChange: (value: string) => void;
    onClear: () => void;
    width?: number;
}

/**
 * Search input component with clear button and tooltip
 * 
 * @remarks
 * This component provides a search input with integrated clear functionality
 * and tooltip. The clear button (X) is only shown when the input has a value.
 * Uses FluentUI Input component with search type for consistent styling.
 * 
 * @example
 * ```tsx
 * <SearchInput
 *   value={searchTerm}
 *   placeholder="Search audit records..."
 *   tooltip="Search and filter records"
 *   onChange={handleSearch}
 *   onClear={handleClear}
 * />
 * ```
 */
export const SearchInput: React.FC<SearchInputProps> = ({
    value,
    placeholder,
    tooltip,
    onChange,
    onClear,
    width = 250
}) => {
    const inputId = useId('toolbar-search');

    const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        onChange(ev.target.value);
    };

    return (
        <Tooltip content={tooltip} relationship="description" withArrow>
            <Input
                id={inputId}
                type="search"
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                contentBefore={<Search20Regular />}
                contentAfter={
                    value ? (
                        <Dismiss20Regular
                            onClick={onClear}
                            style={{ cursor: 'pointer' }}
                        />
                    ) : null
                }
                size="small"
                style={{ width }}
            />
        </Tooltip>
    );
};
