// AdvancedAuditHistory\components\filters\ActiveFilters.tsx
import * as React from 'react';
import { Label, Tag } from '@fluentui/react-components';
import { Attribute } from '../../interfaces/attributes';
import { AuditFilters } from '../panel/filterspanel/FiltersPanel';
import { useActiveFiltersStyles } from './ActiveFiltersStyles';

/**
 * Props for the ActiveFilters component.
 *
 * @property activeFilters - The currently applied audit filters, or `null` when no filters are active.
 * @property attributes - Full list of entity attributes used to resolve logical names to display names on attribute filter tags.
 * @property onDismissFilter - Callback invoked when the user removes a single filter tag.
 *   Receives the filter category and an optional value identifying which item to remove
 *   (e.g. a user name or attribute logical name).
 */
interface IActiveFiltersProps {
    activeFilters: AuditFilters | null;
    attributes: Attribute[];
    onDismissFilter: (filterType: 'user' | 'attribute' | 'actionType' | 'operationType' | 'minChanges' | 'dateRange', value?: string) => void;
}

/**
 * ActiveFilters renders a horizontal row of dismissible filter tags representing every
 * currently active audit filter.
 *
 * @remarks
 * Each tag corresponds to one filter category (user, attribute, action type, operation type,
 * minimum change count, or date range). Clicking the dismiss icon on a tag calls
 * `onDismissFilter` with the appropriate category and optional value so the parent can
 * update filter state. When `activeFilters` is `null` a "No active filters" label is shown.
 *
 * @param props - Component props defined by {@link IActiveFiltersProps}.
 * @returns A flex-wrapped row of FluentUI `Tag` components, one per active filter value.
 *
 * @example
 * ```tsx
 * <ActiveFilters
 *   activeFilters={filters}
 *   attributes={attributes}
 *   onDismissFilter={(type, value) => removeFilter(type, value)}
 * />
 * ```
 */
export const ActiveFilters: React.FC<IActiveFiltersProps> = ({ activeFilters, attributes, onDismissFilter }) => {
    const styles = useActiveFiltersStyles();

    return (
        <div className={styles.container}>
            <Label weight="semibold" className={styles.label}>
                Filters:
            </Label>
            {!activeFilters && (
                <Label className={styles.emptyLabel}>
                    No active filters
                </Label>
            )}
            {activeFilters?.users && activeFilters.users.length > 0 && activeFilters.users.map((user, index) => (
                <Tag
                    key={index}
                    appearance="filled"
                    color="colorful"
                    shape="rounded"
                    size="small"
                    dismissible
                    dismissIcon={{ onClick: () => onDismissFilter('user', user) }}
                >
                    User: {user}
                </Tag>
            ))}
            {activeFilters?.attributeNames && activeFilters.attributeNames.length > 0 &&
                activeFilters.attributeNames.map((logicalName, index) => {
                    const attr = attributes.find(a => a.logicalName === logicalName);
                    return (
                        <Tag
                            key={index}
                            appearance="outline"
                            shape="rounded"
                            size="small"
                            dismissible
                            dismissIcon={{ onClick: () => onDismissFilter('attribute', logicalName) }}
                        >
                            {attr?.displayName ?? logicalName}
                        </Tag>
                    );
                })
            }
            {activeFilters?.actionType && activeFilters.actionType.length > 0 && (
                <Tag
                    appearance="outline"
                    shape="rounded"
                    size="small"
                    dismissible
                    dismissIcon={{ onClick: () => onDismissFilter('actionType') }}
                >
                    Actions: {activeFilters.actionType.length} selected
                </Tag>
            )}
            {activeFilters?.operationType && activeFilters.operationType.length > 0 && (
                <Tag
                    appearance="outline"
                    shape="rounded"
                    size="small"
                    dismissible
                    dismissIcon={{ onClick: () => onDismissFilter('operationType') }}
                >
                    Operations: {activeFilters.operationType.length} selected
                </Tag>
            )}
            {activeFilters?.minChangesCount && (
                <Tag
                    appearance="outline"
                    shape="rounded"
                    size="small"
                    dismissible
                    dismissIcon={{ onClick: () => onDismissFilter('minChanges') }}
                >
                    Min Changes: {activeFilters.minChangesCount}
                </Tag>
            )}
            {(activeFilters?.startDate !== undefined || activeFilters?.endDate !== undefined) && (
                <Tag
                    appearance="filled"
                    color="informative"
                    shape="rounded"
                    size="small"
                    dismissible
                    dismissIcon={{ onClick: () => onDismissFilter('dateRange') }}
                >
                    Date Range: {activeFilters.startDate ? activeFilters.startDate.toLocaleDateString() : 'Start'} - {activeFilters.endDate ? activeFilters.endDate.toLocaleDateString() : 'End'}
                </Tag>
            )}
        </div>
    );
};
