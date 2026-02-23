import { makeStyles } from "@fluentui/react-components";

export const useSettingsPanelStyles = makeStyles({
    tabContainer: {
        display: 'flex',
        gap: '16px',
        height: '100%'
    },
    tabContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        paddingLeft: '16px'
    },
    selectedTagsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginTop: '4px'
    },
    drawerBodyContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
    },
    tabsScrollContainer: {
        flex: 1,
        overflowY: 'auto',
        marginBottom: '16px'
    },
    buttonsContainer: {
        display: 'flex',
        gap: '8px',
        justifyContent: 'flex-end',
        paddingTop: '16px',
        paddingBottom: '16px',
        borderTop: '1px solid #E1DFDD'
    },
    settingsGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    settingRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    settingDescription: {
        fontSize: '12px',
        color: '#605E5C'
    },
    fieldDescription: {
        marginTop: '8px',
        display: 'block',
        color: '#605E5C',
        lineHeight: 1.5
    },
    aboutContainer: {
        flex: 1,
        overflowY: 'auto'
    },
    aboutContent: {
        fontSize: '12px',
        color: '#605E5C'
    },
    aboutTitle: {
        fontSize: '16px',
        fontWeight: 600,
        color: '#323130',
        marginBottom: '8px'
    },
    aboutVersion: {
        marginBottom: '4px'
    },
    aboutDescription: {
        marginTop: '16px',
        lineHeight: 1.5
    },
    userInfoSection: {
        marginTop: '16px'
    },
    userInfoContent: {
        marginTop: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    userInfoValue: {
        marginTop: '4px',
        color: '#605E5C',
        fontSize: '14px'
    },
    rolesContainer: {
        marginTop: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    roleItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 12px',
        backgroundColor: '#F3F2F1',
        borderRadius: '4px',
        fontSize: '14px'
    },
    roleName: {
        color: '#323130',
        fontSize: '14px'
    }
});
