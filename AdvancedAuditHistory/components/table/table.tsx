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
import { ArrowUndo16Regular } from "@fluentui/react-icons";
import { useContext, useMemo } from "react";
import { FilterContext } from "../../context/filter-context";
import { ControlContext } from "../../context/control-context";
import LookupField from "../lookup/lookup";
import { useAudit } from "../../hooks/useAudit";
import { useNavigation } from "../../hooks";
import { getAttributeTypeName } from "../../enums/AttributeTypeCode";

const columns = [
{ key: "field", tooltip: "The name of the field that was changed in this audit record" },
{ key: "field-type", tooltip: "The data type of the field (e.g., String, Lookup, DateTime, Money)" },
{ key: "old-value", tooltip: "The previous value of the field before the change was made" },
{ key: "new-value", tooltip: "The new value of the field after the change was made" },
{ key: "action", tooltip: "Restore individual field values to their previous state from this audit entry" },
];

interface IProps {
    attributes: Attribute[]
}

export const AuditAttributes = ({ attributes }: IProps) => {
    const { context, resources } = useContext(ControlContext);
    const { filter } = useContext(FilterContext);
    const { restoreChanges } = useAudit(context);
    const { openConfirmationDialog } = useNavigation(context);

    const sortedAttributes = useMemo(() => {
        const filtered = attributes.filter((attr) => attr.displayName)
                            .sort((a, b) => a.displayName!.localeCompare(b.displayName!))

        return filtered?.filter(attr => filter?.some((field) => field.logicalName === attr.logicalName))
    }, [attributes, filter])

    const onRestore = async (attribute: Attribute) => {
        const isConfirmed = await openConfirmationDialog()
        
        if(isConfirmed) {
            await restoreChanges([attribute])
        }
    }


    return (
        <div style={{ padding: '16px', width: 'auto'}} >
            <Table>
                <TableHeader>
                    <TableRow>
                    {
                        columns.map((column) => (
                            <Tooltip
                                key={column.key}
                                content={column.tooltip}
                                relationship="description"
                                withArrow
                            >
                                <TableHeaderCell style={column.key === "action" ? { width: 30 } : undefined}>
                                    <b>{resources.getString(column.key)}</b>
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
                                            : attribute.oldValue ?? "-"
                                    }
                                </TableCellLayout>
                                </TableCell>
                                <TableCell>
                                    {
                                        typeof attribute.newValue == "object" ? 
                                            <LookupField item={attribute.newValue as Lookup} isAuditField={true} />
                                        : attribute.newValue ?? "-"
                                    }
                                </TableCell>
                                <TableCell style={{ width: 30 }}>
                                    <Tooltip
                                        content={`Restore ${attribute.displayName} to its previous value (${typeof attribute.oldValue === 'object' ? 'lookup value' : attribute.oldValue ?? 'empty'})`}
                                        relationship="description"
                                        withArrow
                                    >
                                        <Button 
                                            appearance="transparent"
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