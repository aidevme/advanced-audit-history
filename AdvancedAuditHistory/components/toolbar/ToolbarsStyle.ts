// AdvancedAuditHistory\components\toolbar\ToolbarsStyle.ts
import { makeStyles } from "@fluentui/react-components";

/**
 * Styles for the Toolbars component.
 */
export const useToolbarsStyles = makeStyles({
    exportSpinnerOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99999
    }
});
