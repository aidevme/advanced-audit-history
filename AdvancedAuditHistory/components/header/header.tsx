import { Button, Toolbar, ToolbarButton, ToolbarDivider, Tooltip, Label, Menu, MenuTrigger, MenuPopover, MenuList, MenuItem, Input } from "@fluentui/react-components";
import * as React from "react";
import { Attribute } from "../../interfaces";
import { useContext, useState } from "react";
import { ArrowClockwiseRegular, ArrowSortDownLinesRegular, ArrowSortUpLinesRegular, SettingsRegular, FilterRegular, DismissCircleRegular, MaximizeRegular, GridRegular, CardUiRegular, TimelineRegular, Search20Regular, ChartMultipleRegular } from '@fluentui/react-icons';
import { ControlContext } from "../../context/control-context";
import AttributesDropdown from "../dropdown/AttributesDropdown";
import SettingsPanel from "../panel/SettingsPanel";
import FiltersPanel, { AuditFilters } from "../panel/FiltersPanel";
import { ActiveFilters } from "../filters/ActiveFilters";

interface IProps {
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
    users: string[]
}

export interface DateRange {
    startDate?: Date;
    endDate?: Date;
}

const Header = ({ order, attributes, onFieldsChanged, onDateRangeSelected, onRefresh, onAuditSortOrderChanged, onFiltersApplied, onViewTypeChanged, onSearchChanged, onShowAnalytics, users }: IProps) => {
    const { resources } = useContext(ControlContext);
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
                updatedFilters.user = undefined;
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
        console.log("View type changed:", type);
    }

    const handleSearchChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const value = ev.target.value;
        setSearchTerm(value);
        onSearchChanged(value);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', gap: 8}}>
            <Toolbar style={{ justifyContent: 'flex-start' }}>
                <Input
                    type="search"
                    placeholder="Search audit records..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    contentBefore={<Search20Regular />}
                    size="small"
                    style={{ width: 250 }}
                />
                <ToolbarDivider />
                <Menu>
                    <MenuTrigger>
                        <ToolbarButton aria-label="View Type" icon={<GridRegular />} />
                    </MenuTrigger>

                    <MenuPopover>
                        <MenuList>
                            <MenuItem 
                                icon={<CardUiRegular />}
                                onClick={() => handleViewTypeChange('card')}
                            >
                                Card
                            </MenuItem>
                            <MenuItem 
                                icon={<TimelineRegular />}
                                onClick={() => handleViewTypeChange('card-timeline')}
                            >
                                Card - Timeline
                            </MenuItem>
                        </MenuList>
                    </MenuPopover>
                </Menu>
                <ToolbarDivider />
                <Tooltip 
                    content="View comprehensive analytics dashboard with visual charts, trend analysis, and compliance monitoring. See audit activity over time, top changed fields, most active users, and change frequency patterns."
                    relationship="description"
                    withArrow
                >
                    <ToolbarButton 
                        aria-label="Analytics Dashboard" 
                        icon={<ChartMultipleRegular />}
                        onClick={onShowAnalytics}
                    >
                        {/* Analytics */}
                    </ToolbarButton>
                </Tooltip>
                <ToolbarDivider />
                <Tooltip 
                    content={`Sort audit records by date. Currently sorted in ${order} order. Click to toggle between ascending and descending order.`}
                    relationship="description"
                    withArrow
                >
                    <ToolbarButton 
                        icon={order == "ascending" ? <ArrowSortDownLinesRegular /> : <ArrowSortUpLinesRegular />}
                        onClick={onOrderChanged}
                    >
                        {/* Sort */}
                    </ToolbarButton>
                </Tooltip>
                <ToolbarDivider />
                <Tooltip 
                    content="Apply advanced filters to narrow down audit records by user, action type, or specific changes. Quickly find the exact audit trail you need."
                    relationship="description"
                    withArrow
                >
                    <ToolbarButton 
                        icon={<FilterRegular />}
                        onClick={onFiltersClick}
                    >
                        {/* {resources.getString("filters") || "Filters"} */}
                    </ToolbarButton>
                </Tooltip>
                <Tooltip 
                    content="Clear all active filters and reset to default view. This will remove user, attribute, action type, operation, and date range filters."
                    relationship="description"
                    withArrow
                >
                    <ToolbarButton 
                        icon={<DismissCircleRegular />}
                        onClick={onClearAllFilters}
                        disabled={!activeFilters}
                    >
                        {/* Clear All Filters */}
                    </ToolbarButton>
                </Tooltip>
                 <ToolbarDivider />
                <Tooltip 
                    content="Refresh audit history data to see the latest changes. This will reload all audit records based on your current filter settings."
                    relationship="description"
                    withArrow
                >
                    <ToolbarButton 
                        icon={<ArrowClockwiseRegular />}
                        onClick={onRefresh}
                    >
                        {/* {resources.getString("refresh") || "Refresh"} */}
                    </ToolbarButton>
                </Tooltip>
                <ToolbarDivider />
                <Tooltip 
                    content="Configure display options, enable auto-refresh, manage field visibility settings, and customize your audit history viewing experience."
                    relationship="description"
                    withArrow
                >
                    <ToolbarButton 
                        icon={<SettingsRegular />}
                        onClick={onSettingsClick}
                    >
                        {/* {resources.getString("settings") || "Settings"} */}
                    </ToolbarButton>
                </Tooltip>
                <ToolbarDivider />
                <Tooltip 
                    content="Maximize the audit history view to full screen for better visibility and focus. Press Escape to exit full screen mode."
                    relationship="description"
                    withArrow
                >
                    <ToolbarButton 
                        icon={<MaximizeRegular />}
                        onClick={onMaximizeClick}
                    >
                        {/* Maximize */}
                    </ToolbarButton>
                </Tooltip>
            </Toolbar>
            {activeFilters && (
                <ActiveFilters 
                    activeFilters={activeFilters} 
                    attributes={attributes} 
                    onDismissFilter={onDismissFilter}
                />
            )}
            
            <FiltersPanel 
                isOpen={isFiltersOpen} 
                onClose={onFiltersClose}
                onApplyFilters={onApplyFilters}
                attributes={attributes}
                users={users}
            />
            <SettingsPanel 
                isOpen={isSettingsOpen} 
                onClose={onSettingsClose}
            />
        </div>
    );
}

export default Header;