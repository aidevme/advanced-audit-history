import * as React from "react";
import { Attribute, Audit } from "../../interfaces";
import { useState } from "react";
import SettingsPanel from "../panel/settingspanel/SettingsPanel";
import FiltersPanel, { AuditFilters } from "../panel/filterspanel/FiltersPanel";
import { ActiveFilters } from "../filters/ActiveFilters";
import { Toolbars } from "../toolbar/Toolbars";




interface IHeaderProps {
    audits: Audit[];
    order: 'descending' | 'ascending'
    attributes: Attribute[],
    onFieldsChanged: (attributes: string[]) => void,
    onRefresh: () => void;
    onAuditSortOrderChanged: (order: 'descending' | 'ascending') => void,
    onDateRangeSelected: (dateRange: DateRange) => void,
    onFiltersApplied: (filters: AuditFilters | null) => void,
    onViewTypeChanged: (viewType: 'card' | 'card-timeline') => void,
    onSearchChanged: (searchTerm: string) => void,
    onShowAnalytics?: () => void,
    users: string[],
    availableActionTypes?: string[],
    earliestAuditDate?: Date,
    latestAuditDate?: Date
}

export interface DateRange {
    startDate?: Date;
    endDate?: Date;
}

const Header = ({ audits, order, attributes, onFieldsChanged, onDateRangeSelected, onRefresh, onAuditSortOrderChanged, onFiltersApplied, onViewTypeChanged, onSearchChanged, onShowAnalytics, users, availableActionTypes = [], earliestAuditDate, latestAuditDate }: IHeaderProps) => {
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
        console.log("Filters applied:", filters);
    }

    const onClearAllFilters = () => {
        setActiveFilters(null);
        onFiltersApplied(null);
        console.log("All filters cleared");
    }

    const onDismissFilter = (filterType: 'user' | 'attribute' | 'actionType' | 'operationType' | 'minChanges', value?: string) => {
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
        }

        // Check if any filters remain
        const hasRemainingFilters = Object.values(updatedFilters).some(val =>
            val !== undefined && val !== null && (Array.isArray(val) ? val.length > 0 : true)
        );

        if (hasRemainingFilters) {
            setActiveFilters(updatedFilters);
            onFiltersApplied(updatedFilters);
        } else {
            setActiveFilters(null);
            onFiltersApplied(null);
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
                onShowAnalytics={onShowAnalytics}
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
            />
        </div>
    );
}

export default Header;