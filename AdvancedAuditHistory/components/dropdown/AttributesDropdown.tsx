import { Dropdown, Option, OptionOnSelectData, SelectionEvents } from "@fluentui/react-components";
import * as React from "react";
import { useMemo, useState } from "react";
import { Attribute } from "../../interfaces/attributes";
import { AttributeTypeCode } from "../../enums/AttributeTypeCode";
import {
    CalendarLtrRegular,
    NumberSymbolRegular,
    SearchRegular,
    TextAlignLeftRegular,
    CheckboxCheckedRegular,
    MoneyRegular,
    OptionsRegular,
    KeyRegular,
    PersonRegular,
    MailInboxRegular,
    DocumentTextRegular,
    QuestionCircleRegular
} from "@fluentui/react-icons";

/**
 * Get the appropriate icon for an attribute type
 * 
 * @param attributeType - The AttributeTypeCode
 * @returns React element for the icon
 */
const getAttributeTypeIcon = (attributeType?: AttributeTypeCode): JSX.Element => {
    switch (attributeType) {
        case AttributeTypeCode.Boolean:
            return <CheckboxCheckedRegular />;
        case AttributeTypeCode.DateTime:
            return <CalendarLtrRegular />;
        case AttributeTypeCode.Decimal:
        case AttributeTypeCode.Double:
        case AttributeTypeCode.Integer:
        case AttributeTypeCode.BigInt:
            return <NumberSymbolRegular />;
        case AttributeTypeCode.Money:
            return <MoneyRegular />;
        case AttributeTypeCode.Lookup:
        case AttributeTypeCode.Customer:
        case AttributeTypeCode.Owner:
            return <SearchRegular />;
        case AttributeTypeCode.String:
            return <TextAlignLeftRegular />;
        case AttributeTypeCode.Memo:
            return <DocumentTextRegular />;
        case AttributeTypeCode.Picklist:
        case AttributeTypeCode.State:
        case AttributeTypeCode.Status:
            return <OptionsRegular />;
        case AttributeTypeCode.Uniqueidentifier:
            return <KeyRegular />;
        case AttributeTypeCode.PartyList:
            return <PersonRegular />;
        case AttributeTypeCode.EntityName:
            return <MailInboxRegular />;
        default:
            return <QuestionCircleRegular />;
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
            multiselect
            placeholder={placeholder}
            selectedOptions={selectedFields}
            onOptionSelect={onFieldSelected}
            open={open}
            onOpenChange={onOpenChange}
        >
            {sortedAttributes.map((attribute) => {
                const displayText = attribute.displayName || attribute.logicalName;
                const optionText = attribute.isAuditEnabled 
                    ? displayText 
                    : `${displayText} (Audit Disabled)`;
                const icon = getAttributeTypeIcon(attribute.attributeType);
                
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
