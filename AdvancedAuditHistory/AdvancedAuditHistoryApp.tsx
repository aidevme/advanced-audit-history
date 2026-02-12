import * as React from "react";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { IInputs } from "./generated/ManifestTypes";
import { ControlContext } from "./context/control-context";
import History from "./components/history";
import { useDataverse } from "./hooks";
import Header, { DateRange } from "./components/header/header";
import { useMemo, useState } from "react";
import { FilterContext } from "./context/filter-context";
import { sortAudits } from "./utils/utils";

export interface IAdvancedAuditHistoryAppProps {
    context: ComponentFramework.Context<IInputs>
}

export default function AdvancedAuditHistoryApp({ context }: IAdvancedAuditHistoryAppProps) {
    const { formatting, parameters, resources } = context;
    const { isLoading, attributes, audits, record, onRefresh } = useDataverse(context);
    const [filter, setFilter] = useState<string[]>([]);
    const [order, setOrder] = useState<"descending" | "ascending">("descending");
    const [dateRange, setDateRange] = useState<DateRange>({startDate: undefined, endDate: undefined});

    const filteredAudits = useMemo(() => {
        let filtered = !filter || filter.length <= 0 ? 
            audits
            : audits.filter((audit) => {
                return audit.attributes.some((attr) => {
                    return filter.some((field) => field === attr.logicalName)
                })
            });
        
            if (dateRange?.startDate && dateRange?.endDate) {
                const startDate = new Date(dateRange.startDate).setHours(0, 0, 0, 0);
                const endDate = new Date(dateRange.endDate).setHours(0, 0, 0, 0);

                filtered = filtered.filter((item) => {
                    const auditDate = new Date(item.timestamp).setHours(0, 0, 0, 0);
                    return auditDate >= startDate && auditDate <= endDate;
                });
            }

        return sortAudits(filtered, order);
    }, [audits, filter, order, dateRange])

    const filteredAttributes = useMemo(() => {
        const data = !filter || filter.length <= 0 ? 
                attributes
                : attributes.filter((attr) => filter.some((field) => field == attr.logicalName))

        return data.filter((item) => item.displayName)
                .sort((a, b) => a.displayName!.localeCompare(b.displayName!))
    }, [attributes, filter])

    return (
        <div style={{ width: '100%'}}>
            <FluentProvider theme={webLightTheme}>
                <ControlContext.Provider value={{ context, formatting, parameters, resources, record }}>
                    {
                        !isLoading && <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 2 }}>
                            <Header
                                order={order}
                                attributes={filteredAttributes} 
                                onFieldsChanged={setFilter} 
                                onRefresh={() => { void onRefresh(); }} 
                                onAuditSortOrderChanged={setOrder}
                                onDateRangeSelected={setDateRange}
                            />

                            <FilterContext.Provider value={{filter: filteredAttributes}}>
                                <div style={{ maxHeight: '650px', overflowY: 'auto' }}>
                                    <History audits={filteredAudits} />
                                </div>
                            </FilterContext.Provider>
                        </div>
                    }
                </ControlContext.Provider>
            </FluentProvider>
        </div>
    );
}