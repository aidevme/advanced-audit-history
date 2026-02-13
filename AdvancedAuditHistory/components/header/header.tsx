import { Button, Toolbar, ToolbarButton, ToolbarDivider, Tooltip } from "@fluentui/react-components";
import * as React from "react";
import { Attribute } from "../../interfaces/attributes";
import { useContext, useState } from "react";
import { ArrowClockwiseRegular, ArrowSortDownLinesRegular, ArrowSortUpLinesRegular, SettingsRegular, FilterRegular } from '@fluentui/react-icons';
import { ControlContext } from "../../context/control-context";
import { DatePicker } from 'antd';
import { isNullOrEmpty } from "../../utils/utils";
import AttributesDropdown from "../dropdown/AttributesDropdown";
import SettingsPanel from "../panel/SettingsPanel";
import FiltersPanel, { AuditFilters } from "../panel/FiltersPanel";

interface IProps {
    order: 'descending' | 'ascending'
    attributes: Attribute[],
    onFieldsChanged: (attributes: string[]) => void,
    onRefresh: () => void;
    onAuditSortOrderChanged: (order: 'descending' | 'ascending') => void,
    onDateRangeSelected: (dateRange: DateRange) => void
}

export interface DateRange {
    startDate?: Date;
    endDate?: Date;
}

const { RangePicker } = DatePicker;

const Header = ({ order, attributes, onFieldsChanged, onDateRangeSelected, onRefresh, onAuditSortOrderChanged }: IProps) => {
    const { resources } = useContext(ControlContext);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    const handleDateChange = (dateStrings: [string, string]) => {
        const startDate = isNullOrEmpty(dateStrings[0]) ? undefined : new Date(dateStrings[0]);
        startDate?.setHours(0, 0, 0, 0);
        const endDate = isNullOrEmpty(dateStrings[1]) ? undefined : new Date(dateStrings[1]);
        startDate?.setHours(0, 0, 0, 0);
        onDateRangeSelected({ startDate, endDate })
    };

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
        // TODO: Apply filters to audit data
        console.log("Filters applied:", filters);
    }

    const onSettingsClick = () => {
        setIsSettingsOpen(true);
    }

    const onSettingsClose = () => {
        setIsSettingsOpen(false);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', gap: 8}}>
            <Toolbar style={{ justifyContent: 'flex-end' }}>
                <Tooltip 
                    content="Apply advanced filters to narrow down audit records by user, action type, or specific changes. Quickly find the exact audit trail you need."
                    relationship="description"
                >
                    <ToolbarButton 
                        icon={<FilterRegular />}
                        onClick={onFiltersClick}
                    >
                        {resources.getString("filters") || "Filters"}
                    </ToolbarButton>
                </Tooltip>
                 <ToolbarDivider />
                <Tooltip 
                    content="Refresh audit history data to see the latest changes. This will reload all audit records based on your current filter settings."
                    relationship="description"
                >
                    <ToolbarButton 
                        icon={<ArrowClockwiseRegular />}
                        onClick={onRefresh}
                    >
                        {resources.getString("refresh") || "Refresh"}
                    </ToolbarButton>
                </Tooltip>
                <ToolbarDivider />
                <Tooltip 
                    content="Configure display options, enable auto-refresh, manage field visibility settings, and customize your audit history viewing experience."
                    relationship="description"
                >
                    <ToolbarButton 
                        icon={<SettingsRegular />}
                        onClick={onSettingsClick}
                    >
                        {resources.getString("settings") || "Settings"}
                    </ToolbarButton>
                </Tooltip>
            </Toolbar>
            <AttributesDropdown
                attributes={attributes}
                placeholder={resources.getString("advanced-audit-history-dropdown-placeholder")}
                onFieldsChanged={onFieldsChanged}
            />
            <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
                <RangePicker
                    allowClear
                    placeholder={[resources.getString("start-date"), resources.getString("end-date")]}
                    onChange={(_, dateStrings) => handleDateChange(dateStrings)}
                />
                <Button
                    icon={ order == "ascending" ? <ArrowSortDownLinesRegular /> : <ArrowSortUpLinesRegular />} 
                    onClick={onOrderChanged} 
                    appearance="outline"
                    >
                    {
                        order == "ascending" ? 
                        resources.getString("sort-descending") 
                        : resources.getString("sort-ascending")
                    }
                </Button>
            </div>
            <FiltersPanel 
                isOpen={isFiltersOpen} 
                onClose={onFiltersClose}
                onApplyFilters={onApplyFilters}
            />
            <SettingsPanel 
                isOpen={isSettingsOpen} 
                onClose={onSettingsClose}
            />
        </div>
    );
}

export default Header;