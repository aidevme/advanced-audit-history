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

const LookupField = ({ item, isAuditField }: IProps) => {
    const { context } = useContext(ControlContext);
    const { openForm } = useNavigation(context)
    
    const onLookupClicked = (value: Lookup) => {
        openForm(value.entityType, value.id)
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