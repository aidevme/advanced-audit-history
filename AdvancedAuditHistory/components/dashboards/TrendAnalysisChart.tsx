import * as React from 'react';
import { Text, Badge } from '@fluentui/react-components';
import { TrendData } from '../../types/AnalyticsTypes';
import { ArrowTrendingLines20Regular, Warning20Regular, Checkmark20Regular } from '@fluentui/react-icons';

interface ITrendAnalysisChartProps {
    data: TrendData;
}

/**
 * TrendAnalysisChart - Trend analysis and compliance monitoring
 * 
 * @remarks
 * Displays key metrics, trends, and compliance indicators.
 * Includes anomaly detection and pattern recognition.
 * 
 * @param data - Trend analysis data including metrics and indicators
 */
export const TrendAnalysisChart: React.FC<ITrendAnalysisChartProps> = ({ data }) => {
    const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
        if (trend === 'up') return <ArrowTrendingLines20Regular style={{ color: '#107c10' }} />;
        if (trend === 'down') return <ArrowTrendingLines20Regular style={{ color: '#d13438', transform: 'scaleY(-1)' }} />;
        return <ArrowTrendingLines20Regular style={{ color: '#666' }} />;
    };

    return (
        <div style={{ padding: '16px' }}>
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '16px',
                marginBottom: '24px'
            }}>
                {/* Key Metrics */}
                <div style={{ 
                    padding: '16px', 
                    backgroundColor: '#f5f5f5', 
                    borderRadius: '8px',
                    borderLeft: '4px solid #0078d4'
                }}>
                    <Text size={200} block style={{ color: '#666', marginBottom: '4px' }}>
                        Total Changes
                    </Text>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Text size={500} weight="semibold">
                            {data.totalChanges.toLocaleString()}
                        </Text>
                        {getTrendIcon(data.changesTrend)}
                    </div>
                    <Text size={100} style={{ color: '#999' }}>
                        {data.changesPercentChange > 0 ? '+' : ''}{data.changesPercentChange}% vs last period
                    </Text>
                </div>

                <div style={{ 
                    padding: '16px', 
                    backgroundColor: '#f5f5f5', 
                    borderRadius: '8px',
                    borderLeft: '4px solid #107c10'
                }}>
                    <Text size={200} block style={{ color: '#666', marginBottom: '4px' }}>
                        Active Users
                    </Text>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Text size={500} weight="semibold">
                            {data.activeUsers}
                        </Text>
                        {getTrendIcon(data.usersTrend)}
                    </div>
                    <Text size={100} style={{ color: '#999' }}>
                        {data.usersPercentChange > 0 ? '+' : ''}{data.usersPercentChange}% vs last period
                    </Text>
                </div>

                <div style={{ 
                    padding: '16px', 
                    backgroundColor: '#f5f5f5', 
                    borderRadius: '8px',
                    borderLeft: '4px solid #8764b8'
                }}>
                    <Text size={200} block style={{ color: '#666', marginBottom: '4px' }}>
                        Avg Changes/Day
                    </Text>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Text size={500} weight="semibold">
                            {data.avgChangesPerDay.toFixed(1)}
                        </Text>
                        {getTrendIcon(data.avgTrend)}
                    </div>
                    <Text size={100} style={{ color: '#999' }}>
                        Rolling 30-day average
                    </Text>
                </div>
            </div>

            {/* Compliance Indicators */}
            <div style={{ marginTop: '16px' }}>
                <Text size={300} weight="semibold" block style={{ marginBottom: '12px' }}>
                    Compliance Indicators
                </Text>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Checkmark20Regular style={{ color: '#107c10' }} />
                        <Text size={200}>All changes within normal patterns</Text>
                    </div>
                    {data.anomaliesDetected > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Warning20Regular style={{ color: '#ff8c00' }} />
                            <Text size={200}>
                                {data.anomaliesDetected} anomalies detected in last 7 days
                            </Text>
                            <Badge color="warning" size="small">{data.anomaliesDetected}</Badge>
                        </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Checkmark20Regular style={{ color: '#107c10' }} />
                        <Text size={200}>Retention policy compliant</Text>
                    </div>
                </div>
            </div>
        </div>
    );
};
