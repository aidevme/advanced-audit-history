// AdvancedAuditHistory\components\filters\ActiveFiltersStyles.ts
import { makeStyles, tokens } from '@fluentui/react-components';

/**
 * Styles for the {@link ActiveFilters} component.
 *
 * @returns Griffel style classes for the ActiveFilters layout and labels.
 */
export const useActiveFiltersStyles = makeStyles({
    container: {
        padding: `${tokens.spacingVerticalS} 0`,
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacingHorizontalS,
        flexWrap: 'wrap',
    },
    label: {
        fontSize: tokens.fontSizeBase400,
        color: tokens.colorNeutralForeground1,
    },
    emptyLabel: {
        fontSize: tokens.fontSizeBase200,
        color: tokens.colorNeutralForeground3,
        fontStyle: 'italic',
    },
});
