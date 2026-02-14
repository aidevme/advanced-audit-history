import * as React from 'react';
import { useMemo, useState } from 'react';
import { Audit } from '../../interfaces';
import {
    Card,
    CardHeader,
    Text,
    Button,
    Spinner,
    makeStyles,
    tokens
} from '@fluentui/react-components';
import { ArrowDownload24Regular, ArrowSyncRegular } from '@fluentui/react-icons';
import { AuditActivityChart } from './AuditActivityChart';
import { TopFieldsChart } from './TopFieldsChart';
import { ActiveUsersChart } from './ActiveUsersChart';
import { ChangeFrequencyHeatmap } from './ChangeFrequencyHeatmap';
import { TrendAnalysisChart } from './TrendAnalysisChart';
import { AnalyticsService } from '../../services/AnalyticsService/AnalyticsService';
import { DateRange } from '../../types/DateRange';

const useStyles = makeStyles({
    container: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: tokens.spacingVerticalL,
        padding: tokens.spacingVerticalL
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: tokens.spacingVerticalL,
        padding: tokens.spacingVerticalM
    },
    card: {
        height: '100%',
        minHeight: '350px'
    },
    fullWidthCard: {
        gridColumn: '1 / -1',
        minHeight: '300px'
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px'
    }
});

interface IAuditAnalyticsDashboardProps {
    audits: Audit[];
    dateRange?: DateRange;
    isLoading?: boolean;
    onRefresh?: () => void;
    onExport?: (format: 'pdf' | 'excel' | 'csv') => void;
}

/**
 * AuditAnalyticsDashboard - Comprehensive analytics dashboard for audit data
 * 
 * @remarks
 * Provides visual analytics including:
 * - Audit activity timeline
 * - Top changed fields
 * - Most active users
 * - Change frequency heatmap
 * - Trend analysis
 * 
 * @param audits - Array of audit records to analyze
 * @param dateRange - Optional date range filter
 * @param isLoading - Loading state indicator
 * @param onRefresh - Callback for refresh action
 * @param onExport - Callback for export action
 */
export const AuditAnalyticsDashboard: React.FC<IAuditAnalyticsDashboardProps> = ({
    audits,
    dateRange,
    isLoading = false,
    onRefresh,
    onExport
}) => {
    const styles = useStyles();
    const [selectedMetric, setSelectedMetric] = useState<'daily' | 'weekly' | 'monthly'>('daily');

    const analyticsData = useMemo(() => {
        return AnalyticsService.analyzeAudits(audits, dateRange);
    }, [audits, dateRange]);

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <Spinner size="extra-large" label="Loading analytics..." />
            </div>
        );
    }

    return (
        <div>
            {/* Toolbar */}
            <div className={styles.toolbar}>
                <Text size={500} weight="semibold">
                    Audit Analytics Dashboard
                </Text>
                <div style={{ display: 'flex', gap: 8 }}>
                    {onRefresh && (
                        <Button
                            icon={<ArrowSyncRegular />}
                            onClick={onRefresh}
                        >
                            Refresh
                        </Button>
                    )}
                    {onExport && (
                        <Button
                            icon={<ArrowDownload24Regular />}
                            appearance="primary"
                            onClick={() => onExport('excel')}
                        >
                            Export Report
                        </Button>
                    )}
                </div>
            </div>

            {/* Analytics Grid */}
            <div className={styles.container}>
                {/* Audit Activity Over Time */}
                <Card className={`${styles.card} ${styles.fullWidthCard}`}>
                    <CardHeader
                        header={<Text weight="semibold">Audit Activity Over Time</Text>}
                        description={<Text size={200}>Track changes across different time periods</Text>}
                    />
                    <AuditActivityChart
                        data={analyticsData.activityTimeline}
                        metric={selectedMetric}
                        onMetricChange={setSelectedMetric}
                    />
                </Card>

                {/* Top Changed Fields */}
                <Card className={styles.card}>
                    <CardHeader
                        header={<Text weight="semibold">Top Changed Fields</Text>}
                        description={<Text size={200}>Most frequently modified attributes</Text>}
                    />
                    <TopFieldsChart data={analyticsData.topFields} />
                </Card>

                {/* Most Active Users */}
                <Card className={styles.card}>
                    <CardHeader
                        header={<Text weight="semibold">Most Active Users</Text>}
                        description={<Text size={200}>Users with highest change activity</Text>}
                    />
                    <ActiveUsersChart data={analyticsData.activeUsers} />
                </Card>

                {/* Change Frequency Heatmap */}
                <Card className={`${styles.card} ${styles.fullWidthCard}`}>
                    <CardHeader
                        header={<Text weight="semibold">Change Frequency Heatmap</Text>}
                        description={<Text size={200}>Visualize change patterns by day and hour</Text>}
                    />
                    <ChangeFrequencyHeatmap data={analyticsData.heatmapData} />
                </Card>

                {/* Trend Analysis */}
                <Card className={`${styles.card} ${styles.fullWidthCard}`}>
                    <CardHeader
                        header={<Text weight="semibold">Trend Analysis</Text>}
                        description={<Text size={200}>Compliance monitoring and pattern detection</Text>}
                    />
                    <TrendAnalysisChart data={analyticsData.trendData} />
                </Card>
            </div>
        </div>
    );
};

export default AuditAnalyticsDashboard;
