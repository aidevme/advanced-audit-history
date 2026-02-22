// AdvancedAuditHistory\components\header\Header.tsx
import * as React from "react";
import { Attribute, Audit } from "../../interfaces";
import { useState } from "react";
import SettingsPanel from "../panel/settingspanel/SettingsPanel";
import FiltersPanel, { AuditFilters } from "../panel/filterspanel/FiltersPanel";
import { ActiveFilters } from "../filters/ActiveFilters";
import { Toolbars } from "../toolbar/Toolbars";




/**
 * Props for the Header component.
 *
 * @remarks
 * Provides audit data, filtering metadata, and callbacks for toolbar actions,
 * date range updates, and settings panel state changes.
 */
interface IHeaderProps {
    /** Current audit entries shown in the view. */
    audits: Audit[];
    /** Current audit sort order. */
    order: 'descending' | 'ascending'
    /** All available entity attributes for filtering. */
    attributes: Attribute[],
    /** Callback when field selection changes. */
    onFieldsChanged: (attributes: string[]) => void,
    /** Callback to refresh audit data. */
    onRefresh: () => void;
    /** Callback when audit sort order changes. */
    onAuditSortOrderChanged: (order: 'descending' | 'ascending') => void,
    /** Callback when date range updates. */
    onDateRangeSelected: (dateRange: DateRange) => void,
    /** Callback when filters are applied or cleared. */
    onFiltersApplied: (filters: AuditFilters | null) => void,
    /** Callback when view type changes. */
    onViewTypeChanged: (viewType: 'card' | 'card-timeline') => void,
    /** Callback when search term changes. */
    onSearchChanged: (searchTerm: string) => void,
    /** Available user names for filter options. */
    users: string[],
    /** Optional list of available action types. */
    availableActionTypes?: string[],
    /** Optional earliest audit date available. */
    earliestAuditDate?: Date,
    /** Optional latest audit date available. */
    latestAuditDate?: Date
}

/**
 * Date range selection model.
 *
 * @remarks
 * Used by filters and date range pickers to limit audit history.
 */
export interface DateRange {
    /** Optional start date for the range. */
    startDate?: Date;
    /** Optional end date for the range. */
    endDate?: Date;
}

/**
 * Header component orchestrates toolbars, filters, and settings panels.
 *
 * @remarks
 * Manages local UI state for filters and view type while delegating data
 * updates to parent callbacks. Hosts the filters and settings panels.
 *
 * @param props - Header configuration and callback props.
 * @returns Header layout with toolbar, active filters, and panels.
 *
 * @example
 * ```tsx
 * <Header
 *   audits={audits}
 *   order="descending"
 *   attributes={attributes}
 *   onFieldsChanged={setFields}
 *   onRefresh={refresh}
 *   onAuditSortOrderChanged={setOrder}
 *   onDateRangeSelected={setDateRange}
 *   onFiltersApplied={setFilters}
 *   onViewTypeChanged={setViewType}
 *   onSearchChanged={setSearch}
 *   users={users}
 * />
 * ```
 */
const Header = ({ audits, order, attributes, onFieldsChanged, onDateRangeSelected, onRefresh, onAuditSortOrderChanged, onFiltersApplied, onViewTypeChanged, onSearchChanged, users, availableActionTypes = [], earliestAuditDate, latestAuditDate }: IHeaderProps) => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState<AuditFilters | null>(null);
    const [viewType, setViewType] = useState<'card' | 'card-timeline'>('card');
    const [searchTerm, setSearchTerm] = useState('');

    const onOrderChanged = () => {
        onAuditSortOrderChanged(order == "ascending" ? "descending" : "ascending")
    }

    const onFiltersClick = () => {
        setIsFiltersOpen(true);
    }

    const onFiltersClose = () => {
        setIsFiltersOpen(false);
    }

    const onApplyFilters = (filters: AuditFilters) => {
        setActiveFilters(filters);
        onFiltersApplied(filters);

        // Update date range when filters are applied
        onDateRangeSelected({
            startDate: filters.startDate,
            endDate: filters.endDate
        });

        console.log("Filters applied:", filters);
    }

    const onClearAllFilters = () => {
        setActiveFilters(null);
        onFiltersApplied(null);

        // Reset date range when all filters are cleared
        onDateRangeSelected({
            startDate: undefined,
            endDate: undefined
        });

        console.log("All filters cleared");
    }

    const onDismissFilter = (filterType: 'user' | 'attribute' | 'actionType' | 'operationType' | 'minChanges' | 'dateRange', value?: string) => {
        if (!activeFilters) return;

        const updatedFilters = { ...activeFilters };

        switch (filterType) {
            case 'user':
                if (value && updatedFilters.users) {
                    updatedFilters.users = updatedFilters.users.filter(name => name !== value);
                    if (updatedFilters.users.length === 0) {
                        updatedFilters.users = undefined;
                    }
                }
                break;
            case 'attribute':
                if (value && updatedFilters.attributeNames) {
                    updatedFilters.attributeNames = updatedFilters.attributeNames.filter(name => name !== value);
                    if (updatedFilters.attributeNames.length === 0) {
                        updatedFilters.attributeNames = undefined;
                    }
                }
                break;
            case 'actionType':
                updatedFilters.actionType = undefined;
                break;
            case 'operationType':
                updatedFilters.operationType = undefined;
                break;
            case 'minChanges':
                updatedFilters.minChangesCount = undefined;
                break;
            case 'dateRange':
                updatedFilters.startDate = undefined;
                updatedFilters.endDate = undefined;
                break;
        }

        // Check if any filters remain
        const hasRemainingFilters = Object.values(updatedFilters).some(val =>
            val !== undefined && val !== null && (Array.isArray(val) ? val.length > 0 : true)
        );

        if (hasRemainingFilters) {
            setActiveFilters(updatedFilters);
            onFiltersApplied(updatedFilters);

            // Update date range when filters are modified
            onDateRangeSelected({
                startDate: updatedFilters.startDate,
                endDate: updatedFilters.endDate
            });
        } else {
            setActiveFilters(null);
            onFiltersApplied(null);

            // Reset date range when no filters remain
            onDateRangeSelected({
                startDate: undefined,
                endDate: undefined
            });
        }

        console.log(`Filter dismissed: ${filterType}`, value);
    }

    const onSettingsClick = () => {
        setIsSettingsOpen(true);
    }

    const onSettingsClose = () => {
        setIsSettingsOpen(false);
    }

    const onMaximizeClick = () => {
        console.log("Maximize clicked");
        // TODO: Implement maximize functionality
    }

    const handleViewTypeChange = (type: 'card' | 'card-timeline') => {
        setViewType(type);
        onViewTypeChanged(type);
    }

    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
        onSearchChanged(term);
    }

    const handleClearSearch = () => {
        setSearchTerm('');
        onSearchChanged('');
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', gap: 8 }}>
            <Toolbars
                audits={audits}
                order={order}
                searchTerm={searchTerm}
                activeFilters={activeFilters}
                onSearchChanged={handleSearchChange}
                onClearSearch={handleClearSearch}
                onViewTypeChanged={handleViewTypeChange}
                onOrderChanged={onOrderChanged}
                onFiltersClick={onFiltersClick}
                onClearAllFilters={onClearAllFilters}
                onRefresh={onRefresh}
                onSettingsClick={onSettingsClick}
                onMaximizeClick={onMaximizeClick}
            />
            <ActiveFilters
                activeFilters={activeFilters}
                attributes={attributes}
                onDismissFilter={onDismissFilter}
            />

            <FiltersPanel
                isOpen={isFiltersOpen}
                onClose={onFiltersClose}
                onApplyFilters={onApplyFilters}
                attributes={attributes}
                users={users}
                availableActionTypes={availableActionTypes}
                earliestAuditDate={earliestAuditDate}
                latestAuditDate={latestAuditDate}
            />
            <SettingsPanel
                isOpen={isSettingsOpen}
                onClose={onSettingsClose}
                attributes={attributes}
            />
        </div>
    );
}

export default Header;