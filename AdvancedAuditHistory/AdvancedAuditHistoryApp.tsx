import * as React from "react";
import {
    FluentProvider,
    webLightTheme,
    IdPrefixProvider,
    Dialog,
    DialogSurface,
    DialogBody,
    DialogActions,
    Button,
    Spinner,
    makeStyles
} from "@fluentui/react-components";
import { IInputs } from "./generated/ManifestTypes";
import { ControlContext } from "./context/control-context";
import History from "./components/history";
import { useDataverse } from "./hooks";
import Header, { DateRange } from "./components/header/header";
import { useMemo, useState, useEffect } from "react";
import { FilterContext } from "./context/filter-context";
import { sortAudits } from "./utils/utils";
import { AuditFilters } from "./components/panel/filterspanel/FiltersPanel";
import { AuditAnalyticsDashboard } from "./components/dashboards";
import { SecurityService } from "./services/SecurityService/SecurityService";
import { ErrorPanel, ERROR_PANEL_TYPES } from "./components/panel/errorpanel/ErrorPanel";

const useAdvancedAuditHistoryAppStyles = makeStyles({
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

export interface IAdvancedAuditHistoryAppProps {
    context: ComponentFramework.Context<IInputs>
}

export default function AdvancedAuditHistoryApp({ context }: IAdvancedAuditHistoryAppProps) {
    const styles = useAdvancedAuditHistoryAppStyles();
    const { formatting, parameters, resources } = context;
    const { isLoading, attributes, audits, record, onRefresh } = useDataverse(context);
    const [filter, setFilter] = useState<string[]>([]);
    const [order, setOrder] = useState<"descending" | "ascending">("descending");
    const [dateRange, setDateRange] = useState<DateRange>({ startDate: undefined, endDate: undefined });
    const [advancedFilters, setAdvancedFilters] = useState<AuditFilters | null>(null);
    const [viewType, setViewType] = useState<'card' | 'card-timeline'>('card');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAnalytics, setShowAnalytics] = useState(false);

    // Check if running in test harness or design mode
    // Type assertion for PCF authoring mode property not in standard types
    interface ExtendedMode extends ComponentFramework.Mode {
        isAuthoringMode?: boolean;
    }
    const isTestHarness = (context.mode as ExtendedMode).isAuthoringMode !== true;

    // Debug logging
    console.log('[AdvancedAuditHistory] Test Harness Mode:', isTestHarness);
    console.log('[AdvancedAuditHistory] Context Mode:', context?.mode);
    console.log('[AdvancedAuditHistory] Record:', record);

    // Security validation state - skip security in test harness
    const [securityCheck, setSecurityCheck] = useState<{
        isChecking: boolean;
        canAccess: boolean;
        hasPermission: boolean;
        isAuditEnabled: boolean;
        message?: string;
    }>(() => {
        // Initialize with granted access for test harness
        if (isTestHarness) {
            console.log('[AdvancedAuditHistory] Security: Bypassing checks for test harness');
            return {
                isChecking: false,
                canAccess: true,
                hasPermission: true,
                isAuditEnabled: true
            };
        }
        // Default state for production
        console.log('[AdvancedAuditHistory] Security: Initializing for production');
        return {
            isChecking: true,
            canAccess: true,
            hasPermission: true,
            isAuditEnabled: true
        };
    });

    // Validate user permissions and entity audit status on mount
    useEffect(() => {
        // Skip all security validation in test harness
        if (isTestHarness) {
            return; // State already initialized with access granted
        }

        const validateAccess = async () => {
            if (!record.entityLogicalName) {
                setSecurityCheck({
                    isChecking: false,
                    canAccess: false,
                    hasPermission: false,
                    isAuditEnabled: false,
                    message: 'Unable to determine entity type. Please ensure the control is bound to a valid entity field.'
                });
                return;
            }

            const validation = await SecurityService.validateAuditAccess(context, record.entityLogicalName);
            setSecurityCheck({
                isChecking: false,
                canAccess: validation.canAccess,
                hasPermission: validation.hasPermission,
                isAuditEnabled: validation.isAuditEnabled,
                message: validation.message
            });
        };

        void validateAccess();
    }, [context, record.entityLogicalName, isTestHarness]);

    const filteredAudits = useMemo(() => {
        let filtered = !filter || filter.length <= 0 ?
            audits
            : audits.filter((audit) => {
                return audit.attributes.some((attr) => {
                    return filter.some((field) => field === attr.logicalName)
                })
            });

        // Apply date range filter
        if (dateRange?.startDate && dateRange?.endDate) {
            const startDate = new Date(dateRange.startDate).setHours(0, 0, 0, 0);
            const endDate = new Date(dateRange.endDate).setHours(0, 0, 0, 0);

            filtered = filtered.filter((item) => {
                const auditDate = new Date(item.timestamp).setHours(0, 0, 0, 0);
                return auditDate >= startDate && auditDate <= endDate;
            });
        }

        // Apply advanced filters from FiltersPanel
        if (advancedFilters) {
            // Filter by selected attributes from FiltersPanel
            if (advancedFilters.attributeNames && advancedFilters.attributeNames.length > 0) {
                filtered = filtered.filter((audit) => {
                    return audit.attributes.some((attr) => {
                        return advancedFilters.attributeNames!.some((field) => field === attr.logicalName)
                    })
                });
            }

            // Filter by users
            if (advancedFilters.users && advancedFilters.users.length > 0) {
                const usersLower = advancedFilters.users.map(u => u.toLowerCase());
                filtered = filtered.filter((audit) => {
                    const userName = audit.user?.name?.toLowerCase() || '';
                    return usersLower.some(user => userName.includes(user));
                });
            }

            // Filter by action type (operation)
            if (advancedFilters.actionType && advancedFilters.actionType.length > 0) {
                filtered = filtered.filter((audit) => {
                    const operationStr = audit.operation?.toString() || '';
                    return advancedFilters.actionType!.includes(operationStr);
                });
            }

            // Filter by minimum changes count
            if (advancedFilters.minChangesCount) {
                filtered = filtered.filter((audit) => {
                    return audit.attributes.length >= advancedFilters.minChangesCount!;
                });
            }
        }

        // Apply search filter
        if (searchTerm && searchTerm.trim() !== '') {
            const lowerSearch = searchTerm.toLowerCase();
            filtered = filtered.filter((audit) => {
                // Search in operation
                if (audit.operation?.toLowerCase().includes(lowerSearch)) return true;

                // Search in user name
                if (audit.user?.name?.toLowerCase().includes(lowerSearch)) return true;

                // Search in attributes (field names and values)
                return audit.attributes.some((attr) => {
                    const fieldNameMatch = attr.displayName?.toLowerCase().includes(lowerSearch) ??
                        attr.logicalName?.toLowerCase().includes(lowerSearch) ?? false;

                    // Safely convert value to string for search (handle primitives only)
                    const getSearchableValue = (value: unknown): string => {
                        if (value === null || value === undefined) return '';
                        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                            return String(value).toLowerCase();
                        }
                        return '';
                    };

                    const oldValueMatch = getSearchableValue(attr.oldValue).includes(lowerSearch);
                    const newValueMatch = getSearchableValue(attr.newValue).includes(lowerSearch);
                    return fieldNameMatch || oldValueMatch || newValueMatch;
                });
            });
        }

        return sortAudits(filtered, order);
    }, [audits, filter, order, dateRange, advancedFilters, searchTerm])

    const filteredAttributes = useMemo(() => {
        const data = !filter || filter.length <= 0 ?
            attributes
            : attributes.filter((attr) => filter.some((field) => field == attr.logicalName))

        return data.filter((item) => item.displayName)
            .sort((a, b) => a.displayName!.localeCompare(b.displayName!))
    }, [attributes, filter])

    const uniqueUsers = useMemo(() => {
        const users = audits
            .map(audit => audit.user?.name)
            .filter((name): name is string => !!name);
        return Array.from(new Set(users)).sort();
    }, [audits])

    const availableActionTypes = useMemo(() => {
        const actionTypes = audits
            .map(audit => audit.operation?.toString())
            .filter((action): action is string => !!action);
        return Array.from(new Set(actionTypes));
    }, [audits])

    const earliestAuditDate = useMemo(() => {
        if (audits.length === 0) return undefined;
        const dates = audits
            .map(audit => audit.timestamp)
            .filter((date): date is Date => !!date);
        if (dates.length === 0) return undefined;
        return new Date(Math.min(...dates.map(d => d.getTime())));
    }, [audits])

    const latestAuditDate = useMemo(() => {
        if (audits.length === 0) return undefined;
        const dates = audits
            .map(audit => audit.timestamp)
            .filter((date): date is Date => !!date);
        if (dates.length === 0) return undefined;
        return new Date(Math.max(...dates.map(d => d.getTime())));
    }, [audits])

    return (
        <div className={styles.root}>
            <IdPrefixProvider value="APPID-">
                <FluentProvider theme={webLightTheme}>
                    <ControlContext.Provider value={{ context, formatting, parameters, resources, record }}>
                        <FilterContext.Provider value={{ filter: filteredAttributes }}>
                            {
                                securityCheck.isChecking ? (
                                    <div className={styles.spinnerContainer}>
                                        <Spinner
                                            size="huge"
                                            label="Validating access... Please wait"
                                            labelPosition="below"
                                        />
                                    </div>
                                ) : !securityCheck.canAccess ? (
                                    <div className={styles.errorContainer}>
                                        <ErrorPanel
                                            resources={resources}
                                            errorType={!securityCheck.hasPermission ? ERROR_PANEL_TYPES.NO_PERMISSION : ERROR_PANEL_TYPES.AUDIT_NOT_ENABLED}
                                            message={securityCheck.message}
                                        />
                                    </div>
                                ) : isLoading ? (
                                    <div className={styles.spinnerContainer}>
                                        <Spinner
                                            size="huge"
                                            label="Audit History loading... Please wait"
                                            labelPosition="below"
                                        />
                                    </div>
                                ) : audits.length === 0 ? (
                                    <div className={styles.noDataContainer}>
                                        <ErrorPanel
                                            resources={resources}
                                            errorType={ERROR_PANEL_TYPES.NO_AUDIT_DATA}
                                        />
                                    </div>
                                ) : (
                                    <div className={styles.contentContainer}>
                                        <Header
                                            audits={filteredAudits}
                                            order={order}
                                            attributes={filteredAttributes}
                                            onFieldsChanged={setFilter}
                                            onRefresh={() => { void onRefresh(); }}
                                            onAuditSortOrderChanged={setOrder}
                                            onDateRangeSelected={setDateRange}
                                            onFiltersApplied={setAdvancedFilters}
                                            onViewTypeChanged={setViewType}
                                            onSearchChanged={setSearchTerm}
                                            onShowAnalytics={() => setShowAnalytics(true)}
                                            users={uniqueUsers}
                                            availableActionTypes={availableActionTypes}
                                            earliestAuditDate={earliestAuditDate}
                                            latestAuditDate={latestAuditDate}
                                        />
                                        <History audits={filteredAudits} viewType={viewType} />
                                    </div>
                                )
                            }
                        </FilterContext.Provider>
                    </ControlContext.Provider>

                    {/* Analytics Dashboard Dialog */}
                    <Dialog
                        open={showAnalytics}
                        onOpenChange={(event, data) => setShowAnalytics(data.open)}
                        modalType="non-modal"
                    >
                        <DialogSurface className={styles.dialogSurface}>
                            <DialogBody>
                                <AuditAnalyticsDashboard
                                    audits={filteredAudits}
                                    dateRange={dateRange.startDate && dateRange.endDate ? {
                                        from: dateRange.startDate,
                                        to: dateRange.endDate
                                    } : undefined}
                                    isLoading={isLoading}
                                    onRefresh={() => { void onRefresh(); }}
                                    onExport={(format) => console.log('Export analytics:', format)}
                                />
                            </DialogBody>
                            <DialogActions>
                                <Button
                                    appearance="primary"
                                    onClick={() => setShowAnalytics(false)}
                                >
                                    Close
                                </Button>
                            </DialogActions>
                        </DialogSurface>
                    </Dialog>
                </FluentProvider>
            </IdPrefixProvider>
        </div>
    );
}