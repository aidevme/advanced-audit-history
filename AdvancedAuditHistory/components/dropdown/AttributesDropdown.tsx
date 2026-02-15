import { Dropdown, Option, OptionOnSelectData, SelectionEvents, useId } from "@fluentui/react-components";
import * as React from "react";
import { useMemo, useState } from "react";
import { Attribute } from "../../interfaces";
import { AttributeTypeCode } from "../../enums/AttributeTypeCode";
import { Icons } from "../../tools/IconTools";

import { TextFieldIcon } from '@fluentui/react-icons-mdl2';

/**
 * Get the appropriate icon for an attribute type
 * 
 * @param attributeType - The AttributeTypeCode
 * @returns React element for the icon
 */
const getAttributeTypeIcon = (attributeType?: AttributeTypeCode): JSX.Element => {
    switch (attributeType) {
        case AttributeTypeCode.Boolean:
            return <Icons.Boolean />;
        case AttributeTypeCode.DateTime:
            return <Icons.Calendar />;
        case AttributeTypeCode.Decimal:
        case AttributeTypeCode.Double:
        case AttributeTypeCode.Integer:
        case AttributeTypeCode.BigInt:
            return <Icons.Number />;
        case AttributeTypeCode.Money:
            return <Icons.Money />;
        case AttributeTypeCode.Lookup:
        case AttributeTypeCode.Customer:
        case AttributeTypeCode.Owner:
            return <Icons.Lookup />;
        case AttributeTypeCode.String:
            return <Icons.Text />;
        case AttributeTypeCode.Memo:
            return <Icons.Document />;
        case AttributeTypeCode.Picklist:
        case AttributeTypeCode.State:
        case AttributeTypeCode.Status:
            return <Icons.Options />;
        case AttributeTypeCode.Uniqueidentifier:
            return <Icons.Key />;
        case AttributeTypeCode.PartyList:
            return <Icons.Person />;
        case AttributeTypeCode.EntityName:
            return <Icons.Mailbox />;
        default:
            return <Icons.Question />;
    }
};

interface IAttributesDropdownProps {
    attributes: Attribute[];
    placeholder: string;
    onFieldsChanged: (attributes: string[]) => void;
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
    onFieldsChanged 
}) => {
    const dropdownId = useId('attributes-dropdown');
    const [selectedFields, setSelectedFields] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
    
    const onFieldSelected = (_event: SelectionEvents, data: OptionOnSelectData) => {
        const selected = data.selectedOptions;
        setSelectedFields(selected);
        onFieldsChanged(selected);
    };

    const onOpenChange: (e: unknown, data: { open: boolean }) => void = (_e, data) => {
        setOpen(data.open);
    };

    const sortedAttributes = useMemo(() => {
        return attributes
            .filter((item) => item.displayName)
            .sort((a, b) => a.displayName!.localeCompare(b.displayName!));
    }, [attributes]);

    return (
        <Dropdown 
            id={dropdownId}
            multiselect
            clearable
            placeholder={placeholder}
            selectedOptions={selectedFields}
            onOptionSelect={onFieldSelected}
            open={open}
            onOpenChange={onOpenChange}
            style={{ width: '100%' }}
        >
            {sortedAttributes.map((attribute) => {
                const displayText = attribute.displayName ?? attribute.logicalName;
                const optionText = attribute.isAuditEnabled 
                    ? displayText 
                    : `${displayText} (Audit Disabled)`;
                // const icon = getAttributeTypeIcon(attribute.attributeType);
                const icon = <TextFieldIcon style={{ color: '#672367' }} />;
                
                return (
                    <Option 
                        key={attribute.logicalName} 
                        value={attribute.logicalName}
                        text={optionText}
                        disabled={!attribute.isAuditEnabled}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
