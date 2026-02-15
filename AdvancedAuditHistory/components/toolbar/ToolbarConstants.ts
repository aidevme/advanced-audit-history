/**
 * Toolbar Constants
 * 
 * @remarks
 * Centralized constants for toolbar component including tooltip texts,
 * placeholders, and ARIA labels. All strings are retrieved from PCF resources
 * for proper localization support.
 */

/**
 * Gets localized tooltip text constants for toolbar components
 * @param resources - PCF resources object for localization
 * @returns Object containing all toolbar tooltip texts
 */
export const getToolbarTooltips = (resources: ComponentFramework.Resources) => ({
    search: resources.getString('advanced-audit-history-toolbar-search-tooltip-text'),
    viewType: resources.getString('advanced-audit-history-toolbar-viewtype-tooltip-text'),
    analytics: resources.getString('advanced-audit-history-toolbar-analytics-tooltip-text'),
    filters: resources.getString('advanced-audit-history-toolbar-filters-tooltip-text'),
    clearFilters: resources.getString('advanced-audit-history-toolbar-clear-filters-tooltip-text'),
    refresh: resources.getString('advanced-audit-history-toolbar-refresh-tooltip-text'),
    export: resources.getString('advanced-audit-history-toolbar-export-tooltip-text'),
    settings: resources.getString('advanced-audit-history-toolbar-settings-tooltip-text'),
    maximize: resources.getString('advanced-audit-history-toolbar-maximize-tooltip-text')
});

/**
 * Gets localized placeholder text constants for input fields
 * @param resources - PCF resources object for localization
 * @returns Object containing all toolbar placeholder texts
 */
export const getToolbarPlaceholders = (resources: ComponentFramework.Resources) => ({
    search: resources.getString('advanced-audit-history-toolbar-search-placeholder-text')
});

/**
 * Gets localized ARIA label constants for accessibility
 * @param resources - PCF resources object for localization
 * @returns Object containing all toolbar ARIA labels
 */
export const getToolbarAriaLabels = (resources: ComponentFramework.Resources) => ({
    viewType: resources.getString('advanced-audit-history-toolbar-viewtype-aria-label'),
    analytics: resources.getString('advanced-audit-history-toolbar-analytics-aria-label'),
    export: resources.getString('advanced-audit-history-toolbar-export-aria-label')
});

/**
 * Generates the sort tooltip text based on the current sort order
 * @param order - The current sort order (ascending or descending)
 * @param resources - PCF resources object for localization
 * @returns Localized tooltip text explaining the sort functionality
 */
export const getSortTooltipText = (
    order: 'descending' | 'ascending',
    resources: ComponentFramework.Resources
): string => {
    const key = order === 'ascending'
        ? 'advanced-audit-history-toolbar-sort-ascending-tooltip-text'
        : 'advanced-audit-history-toolbar-sort-descending-tooltip-text';
    return resources.getString(key);
};
