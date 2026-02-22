import { makeStyles, tokens } from "@fluentui/react-components";

export const useFiltersPanelStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    fieldLabel: {
        fontWeight: tokens.fontWeightSemibold,
        fontSize: tokens.fontSizeBase400,
    },
    sectionLabel: {
        fontSize: tokens.fontSizeBase400,
        marginBottom: '12px',
        display: 'block',
    },
    selectedTagsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginTop: '12px',
        padding: '8px',
        backgroundColor: tokens.colorNeutralBackground2,
        borderRadius: tokens.borderRadiusMedium,
    },
    hintText: {
        fontSize: tokens.fontSizeBase200,
        color: tokens.colorNeutralForeground3,
        marginTop: '4px',
    },
    dateRangeContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    selectedRangeLabel: {
        fontSize: tokens.fontSizeBase300,
        color: tokens.colorNeutralForeground1,
        marginTop: '8px',
        padding: '8px 12px',
        backgroundColor: tokens.colorNeutralBackground2,
        borderRadius: tokens.borderRadiusMedium,
        fontWeight: tokens.fontWeightMedium,
    },
    checkboxGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    selectedAttributesLabel: {
        fontSize: tokens.fontSizeBase200,
        color: tokens.colorNeutralForeground1,
        marginTop: '8px',
        padding: '4px 8px',
        backgroundColor: tokens.colorNeutralBackground2,
        borderRadius: tokens.borderRadiusMedium,
    },
    advancedOptionsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    actionButtons: {
        display: 'flex',
        gap: '8px',
        justifyContent: 'flex-end',
        marginTop: '8px',
    },
    fullWidth: {
        width: '100%',
    },
});
