import { Dropdown, Option, OptionOnSelectData, SelectionEvents, useId } from "@fluentui/react-components";
import * as React from "react";
import { useMemo, useState, useEffect } from "react";
import { Attribute } from "../../interfaces";
import { getAttributeTypeIcon } from "./attributeTypeIcon";
import { useAttributesDropdownStyles } from "./AttributesDropdown.styles";

interface IAttributesDropdownProps {
    attributes: Attribute[];
    placeholder: string;
    onFieldsChanged: (attributes: string[]) => void;
    showFieldTypeIcons?: boolean;
    isReadOnly?: boolean;
}

/**
 * AttributesDropdown component provides a multi-select dropdown for filtering audit history by fields.
 * 
 * @remarks
 * Uses FluentUI Dropdown component for native Dynamics 365 look and feel.
 * Supports multi-selection with automatic sorting by display name.
 * Displays type-specific icons for each attribute based on AttributeTypeCode.
 * Non-auditable fields are disabled and marked with "(Audit Disabled)" suffix.
 * 
 * @example
 * ```tsx
 * <AttributesDropdown
 *   attributes={entityAttributes}
 *   placeholder="Select fields to filter"
 *   onFieldsChanged={handleFieldSelection}
 * />
 * ```
 */
const AttributesDropdown: React.FC<IAttributesDropdownProps> = ({
    attributes,
    placeholder,
    onFieldsChanged,
    showFieldTypeIcons = true,
    isReadOnly = false
}) => {
    const styles = useAttributesDropdownStyles();
    const dropdownId = useId('attributes-dropdown');
    const [selectedFields, setSelectedFields] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
    const [filterText, setFilterText] = useState<string>("");

    // Log attribute data when attributes are received
    useEffect(() => {
        if (attributes.length > 0) {
            console.log('AttributesDropdown - Received attributes:', attributes.length);
            attributes.forEach((attr) => {
                const logData = {
                    displayName: attr.displayName ?? '',
                    logicalName: attr.logicalName,
                    isAuditEnabled: attr.isAuditEnabled ?? false,
                    format: attr.format ?? 'undefined',
                    formatName: attr.formatName ?? 'undefined'
                };
                console.log(logData);
            });
        }
    }, [attributes]);

    const onFieldSelected = (_event: SelectionEvents, data: OptionOnSelectData) => {
        const selected = data.selectedOptions;
        setSelectedFields(selected);
        onFieldsChanged(selected);
    };

    const onOpenChange: (e: unknown, data: { open: boolean }) => void = (_e, data) => {
        setOpen(data.open);
    };

    const onInput = (e: React.FormEvent<HTMLButtonElement>) => {
        const value = (e.target as HTMLInputElement).value;
        setFilterText(value);
    };

    const sortedAttributes = useMemo(() => {
        return attributes
            .filter((item) => item.displayName)
            .sort((a, b) => a.displayName!.localeCompare(b.displayName!));
    }, [attributes]);

    const filteredAttributes = useMemo(() => {
        if (!filterText) {
            return sortedAttributes;
        }
        const lowerFilter = filterText.toLowerCase();
        return sortedAttributes.filter((attr) =>
            (attr.displayName?.toLowerCase().startsWith(lowerFilter) ?? false) ||
            attr.logicalName.toLowerCase().startsWith(lowerFilter)
        );
    }, [sortedAttributes, filterText]);

    return (
        <Dropdown
            id={dropdownId}
            multiselect
            clearable
            placeholder={placeholder}
            onInput={onInput}
            selectedOptions={selectedFields}
            onOptionSelect={onFieldSelected}
            open={open}
            onOpenChange={onOpenChange}
            className={styles.dropdown}
            disabled={isReadOnly}
        >
            {filteredAttributes.map((attribute) => {
                const displayText = `${attribute.displayName ?? attribute.logicalName} (${attribute.attributeTypeName ?? 'Unknown'})`;
                const optionText = attribute.isAuditEnabled
                    ? displayText
                    : `${displayText} (Audit Disabled)`;
                const icon = showFieldTypeIcons
                    ? getAttributeTypeIcon(attribute.attributeTypeName)
                    : null;

                return (
                    <Option
                        key={attribute.logicalName}
                        value={attribute.logicalName}
                        text={optionText}
                        disabled={!attribute.isAuditEnabled}
                    >
                        <div className={styles.optionContent}>
                            {icon}
                            <span>{optionText}</span>
                        </div>
                    </Option>
                );
            })}
        </Dropdown>
    );
};

export default AttributesDropdown;
