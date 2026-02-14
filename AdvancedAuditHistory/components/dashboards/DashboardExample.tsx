/**
 * Example: Integrating Audit Analytics Dashboard
 * 
 * This file demonstrates how to integrate the AuditAnalyticsDashboard
 * into your PCF control or React application.
 */

import * as React from 'react';
import { useState, useMemo } from 'react';
import { AuditAnalyticsDashboard } from './';
import { Audit } from '../../interfaces';
import { DateRange } from '../../types/DateRange';

/**
 * Example integration component showing dashboard usage
 */
export const DashboardExample: React.FC = () => {
    // Sample state management
    const [audits, setAudits] = useState<Audit[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [dateRange, setDateRange] = useState<DateRange>({
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        to: new Date()
    });

    // Refresh handler
    const handleRefresh = () => {
        setIsLoading(true);
        try {
            // Fetch fresh audit data from Dataverse
            // const freshData = await auditService.fetchAudits(entityId, dateRange);
            // setAudits(freshData);
        } catch (error) {
            console.error('Failed to refresh audit data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Export handler
    const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
        console.log(`Exporting analytics in ${format} format...`);
        // Implementation:
        // - Call ExportService with current analytics data
        // - Generate report in requested format
        // - Download or email the report
    };

    return (
        <div style={{ padding: '16px' }}>
            <h1>Audit Analytics</h1>
            
            {/* Dashboard Component */}
            <AuditAnalyticsDashboard
                audits={audits}
                dateRange={dateRange}
                isLoading={isLoading}
                onRefresh={handleRefresh}
                onExport={handleExport}
            />
        </div>
    );
};

/**
 * Example: Integration within a tabbed interface
 */
export const TabbedDashboardExample: React.FC<{ audits: Audit[] }> = ({ audits }) => {
    const [selectedTab, setSelectedTab] = useState<'list' | 'timeline' | 'analytics'>('list');

    return (
        <div>
            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <button onClick={() => setSelectedTab('list')}>List View</button>
                <button onClick={() => setSelectedTab('timeline')}>Timeline</button>
                <button onClick={() => setSelectedTab('analytics')}>Analytics</button>
            </div>

            {/* Tab Content */}
            {selectedTab === 'analytics' && (
                <AuditAnalyticsDashboard
                    audits={audits}
                    onRefresh={() => console.log('Refresh clicked')}
                    onExport={(format) => console.log('Export:', format)}
                />
            )}
            {selectedTab === 'list' && <div>List view component here</div>}
            {selectedTab === 'timeline' && <div>Timeline view component here</div>}
        </div>
    );
};

/**
 * Example: Dashboard with date range picker
 */
export const DashboardWithDateFilter: React.FC<{ audits: Audit[] }> = ({ audits }) => {
    const [dateRange, setDateRange] = useState<DateRange>({
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        to: new Date()
    });

    // Filter audits by date range
    const filteredAudits = useMemo(() => {
        return audits.filter(audit => {
            const auditDate = new Date(audit.timestamp);
            return auditDate >= dateRange.from && auditDate <= dateRange.to;
        });
    }, [audits, dateRange]);

    return (
        <div>
            {/* Date Range Selector */}
            <div style={{ marginBottom: '16px' }}>
                <label>
                    From:
                    <input
                        type="date"
                        value={dateRange.from.toISOString().split('T')[0]}
                        onChange={(e) => setDateRange(prev => ({
                            ...prev,
                            from: new Date(e.target.value)
                        }))}
                    />
                </label>
                <label style={{ marginLeft: '16px' }}>
                    To:
                    <input
                        type="date"
                        value={dateRange.to.toISOString().split('T')[0]}
                        onChange={(e) => setDateRange(prev => ({
                            ...prev,
                            to: new Date(e.target.value)
                        }))}
                    />
                </label>
            </div>

            {/* Dashboard with filtered data */}
            <AuditAnalyticsDashboard
                audits={filteredAudits}
                dateRange={dateRange}
            />
        </div>
    );
};
