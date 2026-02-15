import * as React from "react";
import {
    TableBody,
    TableCell,
    TableRow,
    Table,
    TableHeader,
    TableHeaderCell,
    TableCellLayout,
    Button,
    Tooltip,
} from "@fluentui/react-components";
import { Attribute, Lookup } from "../../interfaces/attributes";
import { ArrowUndo16Regular, ArrowSortUp16Regular, ArrowSortDown16Regular } from "@fluentui/react-icons";
import { useContext, useMemo, useState } from "react";
import { FilterContext } from "../../context/filter-context";
import { ControlContext } from "../../context/control-context";
import LookupField from "../lookup/lookup";
import { useAudit } from "../../hooks/useAudit";
import { useNavigation } from "../../hooks";
import { getAttributeTypeName } from "../../enums/AttributeTypeCode";

type SortColumn = "field" | "fieldType" | "oldValue" | "newValue" | null;
type SortDirection = "asc" | "desc";

const columns = [
    { key: "advanced-audit-history-table-cell-field", tooltipKey: "advanced-audit-history-table-cell-field-tooltip", sortKey: "field" as SortColumn },
    { key: "advanced-audit-history-table-cell-field-type", tooltipKey: "advanced-audit-history-table-cell-field-type-tooltip", sortKey: "fieldType" as SortColumn },
    { key: "advanced-audit-history-table-cell-old-value", tooltipKey: "advanced-audit-history-table-cell-old-value-tooltip", sortKey: "oldValue" as SortColumn },
    { key: "advanced-audit-history-table-cell-new-value", tooltipKey: "advanced-audit-history-table-cell-new-value-tooltip", sortKey: "newValue" as SortColumn },
    { key: "advanced-audit-history-table-cell-action", tooltipKey: "advanced-audit-history-table-cell-action-tooltip", sortKey: null },
];

interface IProps {
    attributes: Attribute[]
}

export const AuditAttributes = ({ attributes }: IProps) => {
    const { context, resources } = useContext(ControlContext);
    const { filter } = useContext(FilterContext);
    const { restoreChanges } = useAudit(context);
    const { openConfirmationDialog } = useNavigation(context);
    const [sortColumn, setSortColumn] = useState<SortColumn>("field");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

    const sortedAttributes = useMemo(() => {
        const filtered = attributes.filter((attr) => attr.displayName)

        const getValueForSort = (attr: Attribute, column: SortColumn): string => {
            if (column === "field") return attr.displayName ?? "";
            if (column === "fieldType") return getAttributeTypeName(attr.attributeType as number | undefined) ?? "";
            if (column === "oldValue") {
                if (typeof attr.oldValue === "object") return (attr.oldValue as Lookup)?.name ?? "";
                return String(attr.oldValue ?? "");
            }
            if (column === "newValue") {
                if (typeof attr.newValue === "object") return (attr.newValue as Lookup)?.name ?? "";
                return String(attr.newValue ?? "");
            }
            return "";
        };

        const sorted = [...filtered].sort((a, b) => {
            if (!sortColumn) return a.displayName!.localeCompare(b.displayName!);

            const aValue = getValueForSort(a, sortColumn);
            const bValue = getValueForSort(b, sortColumn);

            const comparison = aValue.localeCompare(bValue);
            return sortDirection === "asc" ? comparison : -comparison;
        });

        return sorted?.filter(attr => filter?.some((field) => field.logicalName === attr.logicalName))
    }, [attributes, filter, sortColumn, sortDirection])

    const onRestore = async (attribute: Attribute) => {
        const isConfirmed = await openConfirmationDialog()

        if (isConfirmed) {
            await restoreChanges([attribute])
        }
    }

    const handleSort = (column: SortColumn) => {
        if (!column) return;

        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };


    return (
        <div style={{ padding: '16px', width: 'auto' }} >
            <Table>
                <TableHeader>
                    <TableRow>
                        {
                            columns.map((column) => (
                                <Tooltip
                                    key={column.key}
                                    content={resources.getString(column.tooltipKey)}
                                    relationship="description"
                                    withArrow
                                >
                                    <TableHeaderCell
                                        style={column.key === "advanced-audit-history-table-cell-action" ? { width: 30 } : { cursor: column.sortKey ? "pointer" : "default" }}
                                        onClick={() => handleSort(column.sortKey)}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                            <b>{resources.getString(column.key)}</b>
                                            {column.sortKey && sortColumn === column.sortKey && (
                                                sortDirection === "asc" ?
                                                    <ArrowSortUp16Regular /> :
                                                    <ArrowSortDown16Regular />
                                            )}
                                        </div>
                                    </TableHeaderCell>
                                </Tooltip>
                            ))
                        }
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        sortedAttributes?.map((attribute, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    {attribute.displayName}
                                </TableCell>
                                <TableCell>
                                    {getAttributeTypeName(attribute.attributeType as number | undefined)}
                                </TableCell>
                                <TableCell>
                                    <TableCellLayout>
                                        {
                                            typeof attribute.oldValue == "object" ?
                                                <LookupField item={attribute.oldValue as Lookup} isAuditField={true} />
                                                : (
                                                    <Tooltip
                                                        content={String(attribute.oldValue ?? "-")}
                                                        relationship="description"
                                                        withArrow
                                                    >
                                                        <div style={{
                                                            maxWidth: '200px',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}>
                                                            {attribute.oldValue ?? "-"}
                                                        </div>
                                                    </Tooltip>
                                                )
                                        }
                                    </TableCellLayout>
                                </TableCell>
                                <TableCell>
                                    {
                                        typeof attribute.newValue == "object" ?
                                            <LookupField item={attribute.newValue as Lookup} isAuditField={true} />
                                            : (
                                                <Tooltip
                                                    content={String(attribute.newValue ?? "-")}
                                                    relationship="description"
                                                    withArrow
                                                >
                                                    <div style={{
                                                        maxWidth: '200px',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}>
                                                        {attribute.newValue ?? "-"}
                                                    </div>
                                                </Tooltip>
                                            )
                                    }
                                </TableCell>
                                <TableCell style={{ width: 30 }}>
                                    <Tooltip
                                        content={`Restore ${attribute.displayName} to its previous value (${typeof attribute.oldValue === 'object' ? 'lookup value' : attribute.oldValue ?? 'empty'})`}
                                        relationship="description"
                                        withArrow
                                    >
                                        <Button
                                            appearance="secondary"
                                            icon={<ArrowUndo16Regular fontSize={16} />}
                                            onClick={() => void onRestore(attribute)}
                                        />
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    );
};