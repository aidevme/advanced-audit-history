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
} from "@fluentui/react-components";
import { Attribute, Lookup } from "../../interfaces/attributes";
import { ArrowUndo16Regular } from "@fluentui/react-icons";
import { useContext, useMemo } from "react";
import { FilterContext } from "../../context/filter-context";
import { ControlContext } from "../../context/control-context";
import LookupField from "../lookup/lookup";
import { useAudit } from "../../hooks/useAudit";
import { useNavigation } from "../../hooks";

const columns = [
{ key: "field" },
{ key: "old-value" },
{ key: "new-value" },
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
                            <TableHeaderCell key={column.key}>
                                <b>{resources.getString(column.key)}</b>
                            </TableHeaderCell>
                        ))
                    }
                    <TableHeaderCell key={"actions"} style={{ width: 30}} />
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
                                    <Button 
                                        appearance="transparent"
                                        icon={<ArrowUndo16Regular fontSize={16} />}
                                        onClick={() => onRestore(attribute)} 
                                    />
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    );
};