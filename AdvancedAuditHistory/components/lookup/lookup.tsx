// AdvancedAuditHistory\components\lookup\lookup.tsx
import * as React from "react";
import { Link } from "@fluentui/react-components";
import { Lookup } from "../../interfaces/attributes";
import { useContext } from "react";
import { ControlContext } from "../../context/control-context";
import { useNavigation } from "../../hooks";

interface IProps {
    item: Lookup,
    isAuditField: boolean
}

/**
 * LookupField renders a clickable lookup value with audit-aware styling.
 *
 * @remarks
 * Uses PCF navigation to open the related record when clicked and
 * adjusts visual styling based on whether the value is shown in audit context.
 *
 * @param props - Lookup field props.
 * @returns Fluent UI Link that opens the related record.
 *
 * @example
 * ```tsx
 * <LookupField item={lookup} isAuditField={true} />
 * ```
 */

const LookupField = ({ item, isAuditField }: IProps) => {
    const { context } = useContext(ControlContext);
    const { openForm } = useNavigation(context)

    const onLookupClicked = (value: Lookup) => {
        void openForm(value.entityType, value.id)
    }

    return (
        <Link
            style={{
                backgroundColor: isAuditField == false ? 'transparent' : "rgb(235, 243, 252)",
                color: "rgb(17, 94, 163)",
                borderRadius: isAuditField == false ? 0 : 4,
                padding: isAuditField == false ? 0 : 6,
                textDecoration: isAuditField == false ? 'none' : 'underline',
                fontSize: isAuditField == false ? 12 : 14,
            }}
            onClick={() => onLookupClicked(item)}
        >
            {item.name}
        </Link>
    );
}

export default LookupField;