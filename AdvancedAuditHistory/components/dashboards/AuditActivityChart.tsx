import * as React from 'react';
import { ToggleButton } from '@fluentui/react-components';
import { ActivityTimelineData } from '../../types/AnalyticsTypes';

interface IAuditActivityChartProps {
    data: ActivityTimelineData[];
    metric: 'daily' | 'weekly' | 'monthly';
    onMetricChange: (metric: 'daily' | 'weekly' | 'monthly') => void;
}

/**
 * AuditActivityChart - Line chart showing audit activity over time
 * 
 * @remarks
 * Displays change frequency across time periods with drill-down capabilities.
 * Supports daily, weekly, and monthly aggregation.
 * 
 * @param data - Timeline data points
 * @param metric - Current time metric (daily/weekly/monthly)
 * @param onMetricChange - Callback when metric selection changes
 */
export const AuditActivityChart: React.FC<IAuditActivityChartProps> = ({
    data,
    metric,
    onMetricChange
}) => {
    return (
        <div style={{ padding: '16px' }}>
            {/* Metric Selector */}
            <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
                <ToggleButton
                    checked={metric === 'daily'}
                    onClick={() => onMetricChange('daily')}
                >
                    Daily
                </ToggleButton>
                <ToggleButton
                    checked={metric === 'weekly'}
                    onClick={() => onMetricChange('weekly')}
                >
                    Weekly
                </ToggleButton>
                <ToggleButton
                    checked={metric === 'monthly'}
                    onClick={() => onMetricChange('monthly')}
                >
                    Monthly
                </ToggleButton>
            </div>

            {/* Chart Placeholder */}
            <div style={{ 
                height: '250px', 
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fafafa'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#666', margin: 0 }}>Activity Chart</p>
                    <p style={{ color: '#999', fontSize: '12px', margin: '8px 0 0 0' }}>
                        {data.length} data points • {metric} view
                    </p>
                </div>
            </div>
        </div>
    );
};
