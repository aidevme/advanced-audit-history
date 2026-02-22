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
    Field,
    Tag,
    Avatar,
    useId,
} from "@fluentui/react-components";
import { DatePicker } from "@fluentui/react-datepicker-compat";
import { Icons } from '../../../tools/IconTools';
import * as React from "react";
import { useState } from "react";
import { Attribute } from "../../../interfaces";
import AttributesDropdown from "../../dropdown/AttributesDropdown";
import { useFiltersPanelStyles } from './FiltersPanelStyles';

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
    /** Available action types present in audit data (optional) */
    availableActionTypes?: string[];
    /** Available operation types present in audit data (optional) */
    availableOperationTypes?: string[];
    /** Earliest audit date for default start date (optional) */
    earliestAuditDate?: Date;
    /** Latest audit date for default end date (optional) */
    latestAuditDate?: Date;
}

/**
 * Represents the filter criteria for audit history
 */
export interface AuditFilters {
    /** Filter by specific users who made changes */
    users?: string[];
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
const FiltersPanel: React.FC<IFiltersPanelProps> = ({
    isOpen,
    onClose,
    onApplyFilters,
    attributes,
    users = [],
    availableActionTypes = [],
    availableOperationTypes = [],
    earliestAuditDate,
    latestAuditDate
}) => {
    const styles = useFiltersPanelStyles();
    const startDateId = useId('start-date');
    const endDateId = useId('end-date');

    const [userFilter, setUserFilter] = useState<string[]>([]);
    const [selectedActionTypes, setSelectedActionTypes] = useState<string[]>([]);
    const [selectedOperationTypes, setSelectedOperationTypes] = useState<string[]>([]);
    const [includeSystemChanges, setIncludeSystemChanges] = useState<boolean>(true);
    const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
    const [minChangesCount, setMinChangesCount] = useState<string>("");
    const [startDate, setStartDate] = useState<Date | null>(earliestAuditDate ?? null);
    const [endDate, setEndDate] = useState<Date | null>(latestAuditDate ?? null);

    // Action types available in Dynamics 365 audit
    const actionTypes = [
        { key: "Create", text: "Create" },
        { key: "Update", text: "Update" },
        { key: "Delete", text: "Delete" },
        { key: "Assign", text: "Assign" },
        { key: "Share", text: "Share" },
        { key: "Unshare", text: "Unshare" },
        { key: "Merge", text: "Merge" }
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
            users: userFilter.length > 0 ? userFilter : undefined,
            actionType: selectedActionTypes.length > 0 ? selectedActionTypes : undefined,
            operationType: selectedOperationTypes.length > 0 ? selectedOperationTypes : undefined,
            includeSystemChanges,
            attributeNames: selectedAttributes.length > 0 ? selectedAttributes : undefined,
            minChangesCount: minChangesCount ? parseInt(minChangesCount, 10) : undefined,
            startDate: startDate ?? undefined,
            endDate: endDate ?? undefined
        };

        if (onApplyFilters) {
            onApplyFilters(filters);
        }
        onClose();
    };

    const handleResetFilters = () => {
        setUserFilter([]);
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

    const handleRemoveUser = (userToRemove: string) => {
        setUserFilter(userFilter.filter(user => user !== userToRemove));
    };

    return (
        <Drawer
            open={isOpen}
            onOpenChange={(_, { open }) => !open && onClose()}
            position="end"
            size="large"
        >
            <DrawerHeader>
                <DrawerHeaderTitle
                    action={
                        <Button
                            appearance="subtle"
                            aria-label="Close"
                            icon={<Icons.Dismiss24 />}
                            onClick={onClose}
                        />
                    }
                >
                    Advanced Filters
                </DrawerHeaderTitle>
            </DrawerHeader>

            <DrawerBody>
                <div className={styles.container}>
                    {/* User Filter Section */}
                    <div>
                        <Field label="User Filter" className={styles.fieldLabel}>
                            <Dropdown
                                placeholder="Select users"
                                multiselect
                                clearable={userFilter.length > 0}
                                selectedOptions={userFilter}
                                onOptionSelect={(_, data) => setUserFilter(data.selectedOptions)}
                                className={styles.fullWidth}
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
                        </Field>
                        {userFilter.length > 0 && (
                            <>

                                <div className={styles.selectedTagsContainer}>
                                    {userFilter.map((user, index) => (
                                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', backgroundColor: '#F5F5F5', borderRadius: '4px' }}>
                                            <Persona
                                                name={user}
                                                size="extra-small"
                                                avatar={{ color: "colorful" }}
                                            />
                                            <Button
                                                appearance="subtle"
                                                size="small"
                                                icon={<Icons.Dismiss />}
                                                onClick={() => handleRemoveUser(user)}
                                                aria-label={`Remove ${user}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                        <div className={styles.hintText}>
                            Filter audit records by users who made the changes
                        </div>
                    </div>

                    <Divider />

                    {/* Date Range Section */}
                    <div>
                        <Label weight="semibold" className={styles.sectionLabel}>
                            Date Range
                        </Label>

                        <div className={styles.dateRangeContainer}>
                            <Field label="Start Date">
                                <DatePicker
                                    id={startDateId}
                                    placeholder="Select start date"
                                    minDate={earliestAuditDate}
                                    maxDate={latestAuditDate}
                                    value={startDate}
                                    onSelectDate={(date) => setStartDate(date ?? null)}
                                    inlinePopup={true}
                                />
                            </Field>
                            <Field label="End Date">
                                <DatePicker
                                    id={endDateId}
                                    placeholder="Select end date"
                                    minDate={earliestAuditDate}
                                    maxDate={latestAuditDate}
                                    value={endDate}
                                    onSelectDate={(date) => setEndDate(date ?? null)}
                                    inlinePopup={true}
                                />
                            </Field>
                        </div>

                        {(startDate !== null || endDate !== null) && (
                            <div className={styles.selectedRangeLabel}>
                                <strong>Selected Range: </strong>
                                {startDate !== null ? startDate.toLocaleDateString() : 'Not set'} - {endDate !== null ? endDate.toLocaleDateString() : 'Not set'}
                            </div>
                        )}

                        <div className={styles.hintText}>
                            Filter audit records within the specified date range
                        </div>
                    </div>

                    <Divider />

                    {/* Action Type Filter Section */}
                    <div>
                        <Label weight="semibold" className={styles.sectionLabel}>
                            Action Type
                        </Label>
                        <div className={styles.checkboxGroup}>
                            {actionTypes
                                .filter(action => availableActionTypes.length === 0 || availableActionTypes.includes(action.key))
                                .map(action => (
                                    <Checkbox
                                        key={action.key}
                                        label={action.text}
                                        checked={selectedActionTypes.includes(action.key)}
                                        onChange={(_, data) => handleActionTypeChange(action.key, data.checked === true)}
                                    />
                                ))}
                        </div>
                        <div className={styles.hintText}>
                            Select one or more action types to filter
                        </div>
                    </div>

                    <Divider />

                    {/* Operation Type Filter Section */}
                    <div>
                        <Label weight="semibold" className={styles.sectionLabel}>
                            Operation Type
                        </Label>
                        <div className={styles.checkboxGroup}>
                            {operationTypes
                                .filter(operation => availableOperationTypes.length === 0 || availableOperationTypes.includes(operation.key))
                                .map(operation => (
                                    <Checkbox
                                        key={operation.key}
                                        label={operation.text}
                                        checked={selectedOperationTypes.includes(operation.key)}
                                        onChange={(_, data) => handleOperationTypeChange(operation.key, data.checked === true)}
                                    />
                                ))}
                        </div>
                        <div className={styles.hintText}>
                            Filter by how the change was initiated
                        </div>
                    </div>

                    <Divider />

                    {/* Attribute Filter Section */}
                    <div>
                        <Field label="Attribute Filter" className={styles.fieldLabel}>
                            <AttributesDropdown
                                attributes={attributes}
                                placeholder="Select attributes to filter"
                                onFieldsChanged={setSelectedAttributes}
                            />
                        </Field>
                        {selectedAttributes.length > 0 && (
                            <div className={styles.selectedAttributesLabel}>
                                <strong>Selected: </strong>
                                {selectedAttributes.map(logicalName => {
                                    const attr = attributes.find(a => a.logicalName === logicalName);
                                    return attr?.displayName ?? logicalName;
                                }).join(', ')}
                            </div>
                        )}
                        <div className={styles.hintText}>
                            Show only audit records that modified the selected attributes
                        </div>
                    </div>

                    <Divider />



                    {/* Action Buttons */}
                    <div className={styles.actionButtons}>
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
