import * as React from "react";

import {
    Caption1,
    Button,
    Subtitle2,
    Tooltip,
    mergeClasses,
    tokens,
} from "@fluentui/react-components";
import { ArrowUndo16Regular } from "@fluentui/react-icons";
import {
    Card,
    CardHeader,
    CardPreview,
} from "@fluentui/react-components";
import { Audit, Attribute } from "../../interfaces";
import { useContext } from "react";
import { ControlContext } from "../../context/control-context";
import { AuditAttributes } from "../table/table";
import { useAudit } from "../../hooks/useAudit";
import { useNavigation } from "../../hooks";
import LookupField from "../lookup/lookup";
import { useAuditCardStyles } from "./AuditCardStyles";

interface IAuditCardProps {
    audit: Audit;
}

export const AuditCard = ({ audit }: IAuditCardProps) => {
    const styles = useAuditCardStyles();
    const { context, formatting, resources } = useContext(ControlContext);
    const { restoreChanges } = useAudit(context);
    const { openConfirmationDialog } = useNavigation(context);

    const onRestoreAll = async (attributes: Attribute[]) => {
        const isConfirmed = await openConfirmationDialog()

        if (isConfirmed) {
            await restoreChanges(attributes)
        }
    }

    // Determine card color based on operation type
    const getCardColorClass = () => {
        const operation = audit.operation?.toLowerCase() || '';
        if (operation.includes('create')) return styles.cardCreate;
        if (operation.includes('update')) return styles.cardUpdate;
        return styles.cardDefault;
    };

    // Get button background color based on operation type (matches card background)
    const getButtonColor = () => {
        const operation = audit.operation?.toLowerCase() || '';
        if (operation.includes('create')) return tokens.colorPaletteGreenBackground2;
        if (operation.includes('update')) return tokens.colorPaletteYellowBackground2;
        return tokens.colorPaletteBerryBackground2;
    };

    return (
        <div style={{ width: '100%' }}>
            <Card
                className={mergeClasses(styles.cardBase, getCardColorClass())}
                style={{ width: '100%', padding: 24 }}
                appearance="filled"
            >
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
                >
                    <CardHeader
                        header={
                            <Subtitle2 style={{ textTransform: 'capitalize' }}>
                                <b>{audit.operation}</b>
                            </Subtitle2>
                        }
                        description={
                            <div style={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
                                <Caption1 className={styles.caption}>
                                    {formatting.formatDateShort(audit.timestamp, true)}
                                </Caption1>
                                <Caption1 className={styles.caption}>·</Caption1>
                                <LookupField item={audit.user} isAuditField={false} />
                            </div>
                        }
                    />
                    {
                        audit.attributes && audit.attributes.length > 0 && (
                            <Tooltip
                                content="Restore all field values from this audit entry to their previous state. This will update the current record with the old values."
                                relationship="description"
                                withArrow
                            >
                                <Button
                                    appearance="primary"
                                    icon={<ArrowUndo16Regular fontSize={16} />}
                                    onClick={() => void onRestoreAll(audit.attributes)}
                                    style={{ 
                                        backgroundColor: getButtonColor(),
                                        borderColor: tokens.colorNeutralStroke1,
                                        color: '#000000'
                                    }}
                                >
                                    {resources.getString("restore-all")}
                                </Button>
                            </Tooltip>
                        )
                    }
                </div>
                {
                    audit.attributes && audit.attributes.length > 0 && (
                        <CardPreview>
                            <AuditAttributes attributes={audit.attributes} />
                        </CardPreview>
                    )
                }
            </Card>
        </div>
    );
};
