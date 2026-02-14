import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerHeaderTitle,
    Button,
    Label,
    Dropdown,
    Option,
    Divider,
    Input,
    Checkbox,
    Persona,
    Field
} from "@fluentui/react-components";
import { DatePicker } from "@fluentui/react-datepicker-compat";
import { Dismiss24Regular, SearchRegular } from "@fluentui/react-icons";
import * as React from "react";
import { useState } from "react";
import { Attribute } from "../../interfaces/attributes";
import AttributesDropdown from "../dropdown/AttributesDropdown";

interface IFiltersPanelProps {
    /** Whether the filters panel is open */
    isOpen: boolean;
    /** Callback fired when the panel should be closed */
    onClose: () => void;
    /** Callback fired when filters are applied */
    onApplyFilters?: (filters: AuditFilters) => void;
    /** Available attributes for filtering */
    attributes: Attribute[];
    /** Available users for filtering (optional) */
    users?: string[];
}

/**
 * Represents the filter criteria for audit history
 */
export interface AuditFilters {
    /** Filter by specific user who made changes */
    user?: string;
    /** Filter by action type (Create, Update, Delete, etc.) */
    actionType?: string[];
    /** Filter by operation type */
    operationType?: string[];
    /** Include system-generated changes */
    includeSystemChanges: boolean;
    /** Only show changes with specific attributes */
    attributeNames?: string[];
    /** Minimum number of changes in an audit record */
    minChangesCount?: number;
    /** Filter by start date */
    startDate?: Date;
    /** Filter by end date */
    endDate?: Date;
}

/**
 * FiltersPanel component provides advanced filtering options for audit history data.
 * 
 * @remarks
 * Uses FluentUI Drawer component for a consistent side panel experience.
 * Allows users to filter audit records by user, action type, operation, and other criteria.
 * Filters can be applied, reset, or saved as presets for future use.
 * 
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * 
 * <FiltersPanel
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onApplyFilters={(filters) => handleFiltersApplied(filters)}
 * />
 * ```
 */
const FiltersPanel: React.FC<IFiltersPanelProps> = ({ isOpen, onClose, onApplyFilters, attributes, users = [] }) => {
    const [userFilter, setUserFilter] = useState<string>("");
    const [selectedActionTypes, setSelectedActionTypes] = useState<string[]>([]);
    const [selectedOperationTypes, setSelectedOperationTypes] = useState<string[]>([]);
    const [includeSystemChanges, setIncludeSystemChanges] = useState<boolean>(true);
    const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
    const [minChangesCount, setMinChangesCount] = useState<string>("");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    // Action types available in Dynamics 365 audit
    const actionTypes = [
        { key: "1", text: "Create" },
        { key: "2", text: "Update" },
        { key: "3", text: "Delete" },
        { key: "4", text: "Assign" },
        { key: "5", text: "Share" },
        { key: "6", text: "Unshare" },
        { key: "7", text: "Merge" }
    ];

    // Operation types
    const operationTypes = [
        { key: "user", text: "User Action" },
        { key: "system", text: "System Action" },
        { key: "workflow", text: "Workflow" },
        { key: "plugin", text: "Plugin" },
        { key: "api", text: "API Call" }
    ];

    const handleApplyFilters = () => {
        const filters: AuditFilters = {
            user: userFilter || undefined,
            actionType: selectedActionTypes.length > 0 ? selectedActionTypes : undefined,
            operationType: selectedOperationTypes.length > 0 ? selectedOperationTypes : undefined,
            includeSystemChanges,
            attributeNames: selectedAttributes.length > 0 ? selectedAttributes : undefined,
            minChangesCount: minChangesCount ? parseInt(minChangesCount, 10) : undefined,
            startDate: startDate || undefined,
            endDate: endDate || undefined
        };

        if (onApplyFilters) {
            onApplyFilters(filters);
        }
        onClose();
    };

    const handleResetFilters = () => {
        setUserFilter("");
        setSelectedActionTypes([]);
        setSelectedOperationTypes([]);
        setIncludeSystemChanges(true);
        setSelectedAttributes([]);
        setMinChangesCount("");
        setStartDate(null);
        setEndDate(null);
    };

    const handleActionTypeChange = (actionKey: string, checked: boolean) => {
        if (checked) {
            setSelectedActionTypes([...selectedActionTypes, actionKey]);
        } else {
            setSelectedActionTypes(selectedActionTypes.filter(k => k !== actionKey));
        }
    };

    const handleOperationTypeChange = (operationKey: string, checked: boolean) => {
        if (checked) {
            setSelectedOperationTypes([...selectedOperationTypes, operationKey]);
        } else {
            setSelectedOperationTypes(selectedOperationTypes.filter(k => k !== operationKey));
        }
    };

    return (
        <Drawer
            open={isOpen}
            onOpenChange={(_, { open }) => !open && onClose()}
            position="end"
            size="medium"
        >
            <DrawerHeader>
                <DrawerHeaderTitle
                    action={
                        <Button
                            appearance="subtle"
                            aria-label="Close"
                            icon={<Dismiss24Regular />}
                            onClick={onClose}
                        />
                    }
                >
                    Advanced Filters
                </DrawerHeaderTitle>
            </DrawerHeader>

            <DrawerBody>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* User Filter Section */}
                    <div>
                        <Label weight="semibold" style={{ fontSize: 16, marginBottom: 12, display: 'block' }}>
                            User Filter
                        </Label>
                        <Dropdown
                            placeholder="Select user"
                            value={userFilter}
                            onOptionSelect={(_, data) => setUserFilter(data.optionValue ?? "")}
                        >
                            {users.map((user, index) => (
                                <Option key={index} value={user} text={user}>
                                    <Persona
                                        avatar={{ color: "colorful", "aria-hidden": true }}
                                        name={user}
                                        presence={{
                                            status: "available",
                                        }}
                                        secondaryText="Available"
                                    />
                                </Option>
                            ))}
                        </Dropdown>
                        <div style={{ fontSize: 12, color: '#605E5C', marginTop: 4 }}>
                            Filter audit records by the user who made the changes
                        </div>
                    </div>

                    <Divider />

                    {/* Date Range Section */}
                    <div>
                        <Label weight="semibold" style={{ fontSize: 16, marginBottom: 12, display: 'block' }}>
                            Date Range
                        </Label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <Field label="Start Date">
                                <DatePicker
                                    placeholder="Select start date"
                                    value={startDate}
                                    onSelectDate={(date) => setStartDate(date || null)}
                                />
                            </Field>
                            <Field label="End Date">
                                <DatePicker
                                    placeholder="Select end date"
                                    value={endDate}
                                    onSelectDate={(date) => setEndDate(date || null)}
                                />
                            </Field>
                        </div>
                        <div style={{ fontSize: 12, color: '#605E5C', marginTop: 8 }}>
                            Filter audit records within the specified date range
                        </div>
                    </div>

                    <Divider />

                    {/* Action Type Filter Section */}
                    <div>
                        <Label weight="semibold" style={{ fontSize: 16, marginBottom: 12, display: 'block' }}>
                            Action Type
                        </Label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {actionTypes.map(action => (
                                <Checkbox
                                    key={action.key}
                                    label={action.text}
                                    checked={selectedActionTypes.includes(action.key)}
                                    onChange={(_, data) => handleActionTypeChange(action.key, data.checked === true)}
                                />
                            ))}
                        </div>
                        <div style={{ fontSize: 12, color: '#605E5C', marginTop: 8 }}>
                            Select one or more action types to filter
                        </div>
                    </div>

                    <Divider />

                    {/* Operation Type Filter Section */}
                    <div>
                        <Label weight="semibold" style={{ fontSize: 16, marginBottom: 12, display: 'block' }}>
                            Operation Type
                        </Label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {operationTypes.map(operation => (
                                <Checkbox
                                    key={operation.key}
                                    label={operation.text}
                                    checked={selectedOperationTypes.includes(operation.key)}
                                    onChange={(_, data) => handleOperationTypeChange(operation.key, data.checked === true)}
                                />
                            ))}
                        </div>
                        <div style={{ fontSize: 12, color: '#605E5C', marginTop: 8 }}>
                            Filter by how the change was initiated
                        </div>
                    </div>

                    <Divider />

                    {/* Attribute Filter Section */}
                    <div>
                        <Label weight="semibold" style={{ fontSize: 16, marginBottom: 12, display: 'block' }}>
                            Attribute Filter
                        </Label>
                        <AttributesDropdown
                            attributes={attributes}
                            placeholder="Select attributes to filter"
                            onFieldsChanged={setSelectedAttributes}
                        />
                        {selectedAttributes.length > 0 && (
                            <div style={{ fontSize: 12, color: '#323130', marginTop: 8, padding: '4px 8px', backgroundColor: '#F3F2F1', borderRadius: 4 }}>
                                <strong>Selected: </strong>
                                {selectedAttributes.map(logicalName => {
                                    const attr = attributes.find(a => a.logicalName === logicalName);
                                    return attr?.displayName || logicalName;
                                }).join(', ')}
                            </div>
                        )}
                        <div style={{ fontSize: 12, color: '#605E5C', marginTop: 4 }}>
                            Show only audit records that modified the selected attributes
                        </div>
                    </div>

                    <Divider />

                    {/* Advanced Options Section */}
                    <div>
                        <Label weight="semibold" style={{ fontSize: 16, marginBottom: 12, display: 'block' }}>
                            Advanced Options
                        </Label>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <Checkbox
                                label="Include System Generated Changes"
                                checked={includeSystemChanges}
                                onChange={(_, data) => setIncludeSystemChanges(data.checked === true)}
                            />
                            
                            <div>
                                <Label>Minimum Changes Count</Label>
                                <Input
                                    type="number"
                                    placeholder="e.g., 5"
                                    value={minChangesCount}
                                    onChange={(_, data) => setMinChangesCount(data.value)}
                                    style={{ marginTop: 4 }}
                                />
                                <div style={{ fontSize: 12, color: '#605E5C', marginTop: 4 }}>
                                    Show only audit records with at least this many changes
                                </div>
                            </div>
                        </div>
                    </div>

                    <Divider />

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                        <Button appearance="secondary" onClick={handleResetFilters}>
                            Reset Filters
                        </Button>
                        <Button appearance="primary" onClick={handleApplyFilters}>
                            Apply Filters
                        </Button>
                    </div>
                </div>
            </DrawerBody>
        </Drawer>
    );
};

export default FiltersPanel;
