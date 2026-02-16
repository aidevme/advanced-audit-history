import { makeStyles } from "@fluentui/react-components";

/**
 * Styles for the AdvancedAuditHistoryApp component.
 * 
 * @remarks
 * Provides layout and presentation styles for the main audit history application,
 * including spinner containers, error states, and content areas.
 */
export const useAdvancedAuditHistoryAppStyles = makeStyles({
    root: {
        width: '100%'
    },
    spinnerContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%',
        backgroundColor: 'rgba(128, 128, 128, 0.3)',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999
    },
    spinnerContainerNoOverlay: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%'
    },
    errorContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%',
        padding: '20px'
    },
    noDataContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 20px'
    },
    contentContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '2px'
    },
    dialogSurface: {
        maxWidth: '95vw',
        width: '1400px',
        maxHeight: '90vh'
    }
});
