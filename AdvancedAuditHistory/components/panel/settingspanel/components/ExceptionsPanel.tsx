import * as React from "react";
import {
    Table,
    TableHeader,
    TableHeaderCell,
    TableBody,
    TableRow,
    TableCell,
    TableCellLayout,
    Checkbox,
    Label,
    Tooltip,
    useId
} from "@fluentui/react-components";
import { ControlContext } from "../../../../context/control-context";
import { getAttributeTypeIcon } from "../../../../tools/attributeTypeIcon";
import { Icons } from "../../../../tools/IconTools";
import { Attribute } from "../../../../interfaces";

type SortDirection = 'ascending' | 'descending' | 'none';
type ColumnKey = 'attributeName' | 'attributeType' | 'readOnly' | 'automation';

interface ExceptionItem {
    attributeLogicalName: string;
    attributeName: string;
    attributeType: string;
    readOnly: boolean;
    isAuditEnabled: boolean;
    automation: boolean;
}

interface ExceptionsPanelProps {
    attributes: Attribute[];
}

/**
 * ExceptionsPanel component displays exception handling and error management settings.
 * 
 * @remarks
 * This component shows a table of attributes that can be configured for exception handling.
 * Users can view attribute names, types, and their read-only status with sorting capabilities.
 * 
 * @example
 * ```tsx
 * <ExceptionsPanel attributes={attributes} />
 * ```
 */
export const ExceptionsPanel: React.FC<ExceptionsPanelProps> = ({ attributes }) => {
    const { resources } = React.useContext(ControlContext);
    const exceptionsTitleId = useId("exceptions-panel-title");
    const [sortColumn, setSortColumn] = React.useState<ColumnKey | null>(null);
    const [sortDirection, setSortDirection] = React.useState<SortDirection>('none');

    // Sample data for demonstration
    const columns = [
        { key: "attributeName" as ColumnKey, labelKey: "settings-panel-exceptions-attribute-name", tooltipKey: "settings-panel-exceptions-attribute-name-tooltip" },
        { key: "attributeType" as ColumnKey, labelKey: "settings-panel-exceptions-attribute-type", tooltipKey: "settings-panel-exceptions-attribute-type-tooltip" },
        { key: "readOnly" as ColumnKey, labelKey: "settings-panel-exceptions-read-only", tooltipKey: "settings-panel-exceptions-read-only-tooltip" },
        { key: "automation" as ColumnKey, labelKey: "settings-panel-exceptions-automation", tooltipKey: "settings-panel-exceptions-automation-tooltip" }
    ];

    // Convert attributes to ExceptionItem format
    const initialItems: ExceptionItem[] = React.useMemo(() =>
        attributes.map(attr => ({
            attributeLogicalName: attr.logicalName,
            attributeName: attr.displayName ?? attr.logicalName,
            attributeType: attr.attributeTypeName ?? 'Unknown',
            readOnly: !(attr.isValidForUpdate ?? true),
            isAuditEnabled: attr.isAuditEnabled ?? false,
            automation: false
        })),
        [attributes]
    );

    const [items, setItems] = React.useState<ExceptionItem[]>(initialItems);
    const [selectedAttributeIds, setSelectedAttributeIds] = React.useState<Set<string>>(new Set());

    // Update items when attributes change
    React.useEffect(() => {
        setItems(initialItems);
    }, [initialItems]);

    React.useEffect(() => {
        setSelectedAttributeIds(new Set());
    }, [initialItems]);

    const handleCheckboxChange = (attributeName: string, checked: boolean) => {
        setItems(prevItems =>
            prevItems.map(item =>
                item.attributeName === attributeName
                    ? { ...item, readOnly: checked }
                    : item
            )
        );
    };

    const handleSelectionChange = (attributeLogicalName: string, checked: boolean) => {
        setSelectedAttributeIds(prevSelected => {
            const nextSelected = new Set(prevSelected);
            if (checked) {
                nextSelected.add(attributeLogicalName);
            } else {
                nextSelected.delete(attributeLogicalName);
            }
            return nextSelected;
        });
    };

    const handleSelectAllChange = (checked: boolean) => {
        if (!checked) {
            setSelectedAttributeIds(new Set());
            return;
        }

        const allIds = new Set(items.map(item => item.attributeLogicalName));
        setSelectedAttributeIds(allIds);
    };



    const handleSort = (columnKey: ColumnKey) => {
        if (sortColumn === columnKey) {
            // Cycle through: none -> ascending -> descending -> none
            if (sortDirection === 'none') {
                setSortDirection('ascending');
            } else if (sortDirection === 'ascending') {
                setSortDirection('descending');
            } else {
                setSortDirection('none');
                setSortColumn(null);
            }
        } else {
            setSortColumn(columnKey);
            setSortDirection('ascending');
        }
    };

    const sortedItems = React.useMemo(() => {
        if (!sortColumn || sortDirection === 'none') {
            return items;
        }

        const sorted = [...items].sort((a, b) => {
            const aValue = a[sortColumn];
            const bValue = b[sortColumn];

            if (aValue < bValue) return sortDirection === 'ascending' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'ascending' ? 1 : -1;
            return 0;
        });

        return sorted;
    }, [items, sortColumn, sortDirection]);

    const selectionState = React.useMemo(() => {
        const total = items.length;
        const selected = selectedAttributeIds.size;

        if (total === 0 || selected === 0) {
            return false;
        }

        if (selected === total) {
            return true;
        }

        return "mixed";
    }, [items.length, selectedAttributeIds.size]);

    return (
        <div>
            <Label id={exceptionsTitleId}>{resources.getString("settings-panel-exceptions-title")}</Label>
            <div style={{ fontSize: '12px', marginBottom: '12px', color: '#616161' }}>
                {resources.getString("settings-panel-exceptions-description")}
            </div>
            <Table aria-labelledby={exceptionsTitleId}>
                <TableHeader>
                    <TableRow>
                        <Tooltip
                            content={resources.getString("settings-panel-exceptions-select-all-tooltip")}
                            relationship="description"
                            withArrow
                        >
                            <TableHeaderCell style={{ width: '32px' }}>
                                <Checkbox
                                    checked={selectionState}
                                    onChange={(_, data) => handleSelectAllChange(data.checked === true)}
                                />
                            </TableHeaderCell>
                        </Tooltip>
                        {columns.map((column) => (
                            <Tooltip
                                key={column.key}
                                content={resources.getString(column.tooltipKey)}
                                relationship="description"
                                withArrow
                            >
                                <TableHeaderCell
                                    onClick={() => handleSort(column.key)}
                                    style={{ cursor: 'pointer', userSelect: 'none', fontWeight: 600, fontSize: '12px' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        {resources.getString(column.labelKey)}
                                        {sortColumn === column.key && sortDirection === 'ascending' && (
                                            <Icons.SortUp16 />
                                        )}
                                        {sortColumn === column.key && sortDirection === 'descending' && (
                                            <Icons.SortDown16 />
                                        )}
                                    </div>
                                </TableHeaderCell>
                            </Tooltip>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedItems.map((item, index) => (
                        <TableRow key={item.attributeLogicalName}>
                            <TableCell style={{ width: '32px' }}>
                                <TableCellLayout>
                                    <Checkbox
                                        checked={selectedAttributeIds.has(item.attributeLogicalName)}
                                        onChange={(_, data) => handleSelectionChange(item.attributeLogicalName, data.checked === true)}
                                    />
                                </TableCellLayout>
                            </TableCell>
                            <TableCell style={{ fontSize: '12px' }}>
                                <TableCellLayout>{item.attributeName}</TableCellLayout>
                            </TableCell>
                            <TableCell style={{ fontSize: '12px' }}>
                                <TableCellLayout>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        {getAttributeTypeIcon(item.attributeType)}
                                        <span>{item.attributeType}</span>
                                    </div>
                                </TableCellLayout>
                            </TableCell>
                            <TableCell style={{ fontSize: '12px' }}>
                                <TableCellLayout>
                                    <Checkbox
                                        checked={item.readOnly}
                                        disabled={!item.isAuditEnabled}
                                        onChange={(_, data) => handleCheckboxChange(item.attributeName, data.checked === true)}
                                    />
                                </TableCellLayout>
                            </TableCell>
                            <TableCell style={{ fontSize: '12px' }}>
                                <TableCellLayout>
                                    <div style={{
                                        opacity: item.isAuditEnabled ? 1 : 0.4,
                                        cursor: item.isAuditEnabled ? 'pointer' : 'not-allowed'
                                    }}>
                                        <Icons.Info />
                                    </div>
                                </TableCellLayout>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};