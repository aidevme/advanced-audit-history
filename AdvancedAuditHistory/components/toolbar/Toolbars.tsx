import { Toolbar, ToolbarDivider, Spinner, makeStyles } from "@fluentui/react-components";
import * as React from "react";
import { useContext, useMemo, useCallback, useState } from "react";
import {
    ArrowClockwiseRegular,
    ArrowSortDownLinesRegular,
    ArrowSortUpLinesRegular,
    SettingsRegular,
    MaximizeRegular,
    GridRegular,
    CardUiRegular,
    TimelineRegular,
    ChartMultipleRegular
} from '@fluentui/react-icons';

import { ExportIcon, PDFIcon, DocumentIcon } from '@fluentui/react-icons-mdl2';
import { Icons } from "../../tools/IconTools";
import { ControlContext } from "../../context/control-context";
import { AuditFilters } from "../panel/filterspanel/FiltersPanel";
import { Audit } from "../../interfaces";
import { ExportService } from "../../services";
import { getToolbarTooltips, getToolbarPlaceholders, getToolbarAriaLabels, getSortTooltipText } from "./ToolbarConstants";
import { ToolbarButtonWithTooltip } from "./components/ToolbarButtonWithTooltip";
import { SearchInput } from "./components/SearchInput";
import { ToolbarMenuWithTooltip, MenuOption } from "./components/ToolbarMenuWithTooltip";

/**
 * Styles for the Toolbars component
 */
const useToolbarsStyles = makeStyles({
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

/**
 * Props for the Toolbars component
 * 
 * @property audits - Array of audit records for export functionality
 * @property order - Current sort order for audit records
 * @property searchTerm - Current search term for filtering records
 * @property activeFilters - Currently active filters, if any
 * @property onSearchChanged - Callback when search term changes
 * @property onClearSearch - Callback to clear search
 * @property onViewTypeChanged - Callback when view type is changed
 * @property onShowAnalytics - Optional callback to show analytics dashboard
 * @property onOrderChanged - Callback when sort order is toggled
 * @property onFiltersClick - Callback when filters button is clicked
 * @property onClearAllFilters - Callback to clear all active filters
 * @property onRefresh - Callback to refresh audit data
 * @property onSettingsClick - Callback when settings button is clicked
 * @property onMaximizeClick - Callback when maximize button is clicked
 */
interface IToolbarsProps {
    audits: Audit[];
    order: 'descending' | 'ascending';
    searchTerm: string;
    activeFilters: AuditFilters | null;
    onSearchChanged: (term: string) => void;
    onClearSearch: () => void;
    onViewTypeChanged: (viewType: 'card' | 'card-timeline') => void;
    onShowAnalytics?: () => void;
    onOrderChanged: () => void;
    onFiltersClick: () => void;
    onClearAllFilters: () => void;
    onRefresh: () => void;
    onSettingsClick: () => void;
    onMaximizeClick: () => void;
}

/**
 * Toolbars component displays the main toolbar with search, view options, filters, and actions.
 * 
 * @remarks
 * This component provides the primary user interface for interacting with audit history,
 * including search, sorting, filtering, view type selection, analytics, export, and settings.
 * 
 * @example
 * ```tsx
 * <Toolbars
 *   order="descending"
 *   searchTerm=""
 *   activeFilters={null}
 *   onSearchChanged={handleSearch}
 *   onRefresh={handleRefresh}
 *   // ... other props
 * />
 * ```
 */
export const Toolbars: React.FC<IToolbarsProps> = ({
    audits,
    order,
    searchTerm,
    activeFilters,
    onSearchChanged,
    onClearSearch,
    onViewTypeChanged,
    onShowAnalytics,
    onOrderChanged,
    onFiltersClick,
    onClearAllFilters,
    onRefresh,
    onSettingsClick,
    onMaximizeClick
}) => {
    const styles = useToolbarsStyles();
    const { resources } = useContext(ControlContext);
    const [isExporting, setIsExporting] = useState(false);
    const [exportMessage, setExportMessage] = useState('Exporting...');

    // Localized strings (memoized to prevent recreation on every render)
    const tooltips = useMemo(() => getToolbarTooltips(resources), [resources]);
    const placeholders = useMemo(() => getToolbarPlaceholders(resources), [resources]);
    const ariaLabels = useMemo(() => getToolbarAriaLabels(resources), [resources]);

    // Export handlers (memoized to prevent recreation on every render)
    const handleExportExcel = useCallback(async () => {
        try {
            setIsExporting(true);
            setExportMessage('Exporting to Excel...');
            await ExportService.exportToExcel(audits);
        } catch (error) {
            console.error('[Toolbars] Excel export failed:', error);
            alert(error instanceof Error ? error.message : 'Failed to export to Excel');
        } finally {
            setIsExporting(false);
        }
    }, [audits]);

    const handleExportCSV = useCallback(() => {
        try {
            setIsExporting(true);
            setExportMessage('Exporting to CSV...');
            ExportService.exportToCSV(audits);
        } catch (error) {
            console.error('[Toolbars] CSV export failed:', error);
            alert(error instanceof Error ? error.message : 'Failed to export to CSV');
        } finally {
            setIsExporting(false);
        }
    }, [audits]);

    const handleExportPDF = useCallback(() => {
        try {
            setIsExporting(true);
            setExportMessage('Exporting to PDF...');
            ExportService.exportToPDF(audits);
        } catch (error) {
            console.error('[Toolbars] PDF export failed:', error);
            alert(error instanceof Error ? error.message : 'Failed to export to PDF');
        } finally {
            setIsExporting(false);
        }
    }, [audits]);

    // View type menu options (memoized to prevent recreation on every render)
    const viewTypeOptions: MenuOption[] = useMemo(() => [
        {
            label: "Card",
            icon: <CardUiRegular />,
            onClick: () => onViewTypeChanged('card')
        },
        {
            label: "Card - Timeline",
            icon: <TimelineRegular />,
            onClick: () => onViewTypeChanged('card-timeline')
        }
    ], [onViewTypeChanged]);

    // Export menu options (memoized to prevent recreation on every render)
    const exportOptions: MenuOption[] = useMemo(() => [
        {
            label: "Export to Excel",
            icon: <DocumentIcon />,
            onClick: () => void handleExportExcel()
        },
        {
            label: "Export to CSV",
            icon: <DocumentIcon />,
            onClick: handleExportCSV
        },
        {
            label: "Export to PDF",
            icon: <PDFIcon />,
            onClick: handleExportPDF
        }
    ], [handleExportExcel, handleExportCSV, handleExportPDF]);

    return (
        <>
            <Toolbar style={{ justifyContent: 'flex-start' }}>
                {/* Search Input */}
                <SearchInput
                    value={searchTerm}
                    placeholder={placeholders.search}
                    tooltip={tooltips.search}
                    onChange={onSearchChanged}
                    onClear={onClearSearch}
                />
                <ToolbarDivider />

                {/* View Type Menu */}
                <ToolbarMenuWithTooltip
                    tooltip={tooltips.viewType}
                    triggerIcon={<GridRegular />}
                    ariaLabel={ariaLabels.viewType}
                    idPrefix="toolbar-view-type"
                    options={viewTypeOptions}
                />
                <ToolbarDivider />

                {/* Analytics Dashboard Button - Temporarily Hidden */}
                {/* <ToolbarButtonWithTooltip
                tooltip={tooltips.analytics}
                icon={<ChartMultipleRegular />}
                onClick={onShowAnalytics}
                idPrefix="toolbar-analytics"
                ariaLabel={ariaLabels.analytics}
            />
            <ToolbarDivider /> */}

                {/* Sort Button */}
                <ToolbarButtonWithTooltip
                    tooltip={getSortTooltipText(order, resources)}
                    icon={order === "ascending" ? <ArrowSortDownLinesRegular /> : <ArrowSortUpLinesRegular />}
                    onClick={onOrderChanged}
                    idPrefix="toolbar-sort"
                />
                <ToolbarDivider />

                {/* Filters Button */}
                <ToolbarButtonWithTooltip
                    tooltip={tooltips.filters}
                    icon={<Icons.FilterIcon />}
                    onClick={onFiltersClick}
                    idPrefix="toolbar-filters"
                />

                {/* Clear Filters Button (conditional) */}
                {activeFilters && (
                    <ToolbarButtonWithTooltip
                        tooltip={tooltips.clearFilters}
                        icon={<Icons.ClearFilterIcon />}
                        onClick={onClearAllFilters}
                        idPrefix="toolbar-clear-filters"
                    />
                )}
                <ToolbarDivider />

                {/* Refresh Button */}
                <ToolbarButtonWithTooltip
                    tooltip={tooltips.refresh}
                    icon={<ArrowClockwiseRegular />}
                    onClick={onRefresh}
                    idPrefix="toolbar-refresh"
                />
                <ToolbarDivider />

                {/* Export Menu */}
                <ToolbarMenuWithTooltip
                    tooltip={tooltips.export}
                    triggerIcon={<ExportIcon />}
                    ariaLabel={ariaLabels.export}
                    idPrefix="toolbar-export"
                    options={exportOptions}
                />
                <ToolbarDivider />

                {/* Settings Button */}
                <ToolbarButtonWithTooltip
                    tooltip={tooltips.settings}
                    icon={<SettingsRegular />}
                    onClick={onSettingsClick}
                    idPrefix="toolbar-settings"
                />
                <ToolbarDivider />

                {/* Maximize Button */}
                <ToolbarButtonWithTooltip
                    tooltip={tooltips.maximize}
                    icon={<MaximizeRegular />}
                    onClick={onMaximizeClick}
                    idPrefix="toolbar-maximize"
                />
            </Toolbar>

            {/* Export Spinner Overlay */}
            {isExporting && (
                <div className={styles.exportSpinnerOverlay}>
                    <Spinner
                        size="huge"
                        label={exportMessage}
                        labelPosition="below"
                    />
                </div>
            )}
        </>
    );
};
