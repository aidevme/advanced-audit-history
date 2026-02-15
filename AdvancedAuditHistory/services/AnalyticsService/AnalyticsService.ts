import { Audit } from '../../interfaces';
import { DateRange } from '../../types/DateRange';
import {
    AnalyticsData,
    ActivityTimelineData,
    TopFieldData,
    ActiveUserData,
    HeatmapData,
    TrendData
} from '../../types/AnalyticsTypes';

/**
 * AnalyticsService - Service for analyzing and aggregating audit data
 * 
 * @remarks
 * Provides methods for transforming raw audit records into analytics insights.
 * Handles data aggregation, trend calculation, and statistical analysis.
 */
export class AnalyticsService {
    /**
     * Analyze audit records and generate complete analytics dataset
     * 
     * @param audits - Array of audit records to analyze
     * @param dateRange - Optional date range filter
     * @returns Complete analytics data object
     * 
     * @example
     * ```typescript
     * const analytics = AnalyticsService.analyzeAudits(auditRecords, {
     *     from: new Date('2026-01-01'),
     *     to: new Date('2026-02-14')
     * });
     * ```
     */
    static analyzeAudits(audits: Audit[], dateRange?: DateRange): AnalyticsData {
        const filteredAudits = dateRange
            ? this.filterByDateRange(audits, dateRange)
            : audits;

        return {
            activityTimeline: this.generateActivityTimeline(filteredAudits),
            topFields: this.calculateTopFields(filteredAudits),
            activeUsers: this.calculateActiveUsers(filteredAudits),
            heatmapData: this.generateHeatmapData(filteredAudits),
            trendData: this.calculateTrends(filteredAudits)
        };
    }

    /**
     * Filter audits by date range
     */
    private static filterByDateRange(audits: Audit[], range: DateRange): Audit[] {
        return audits.filter(audit => {
            const auditDate = new Date(audit.timestamp);
            return auditDate >= range.from && auditDate <= range.to;
        });
    }

    /**
     * Generate activity timeline data
     */
    private static generateActivityTimeline(audits: Audit[]): ActivityTimelineData[] {
        const dailyCounts = new Map<string, number>();

        audits.forEach(audit => {
            const date = new Date(audit.timestamp);
            const dateKey = date.toISOString().split('T')[0];
            dailyCounts.set(dateKey, (dailyCounts.get(dateKey) ?? 0) + 1);
        });

        const timeline: ActivityTimelineData[] = [];
        dailyCounts.forEach((count, dateStr) => {
            timeline.push({
                period: new Date(dateStr).toLocaleDateString(),
                count,
                date: dateStr
            });
        });

        return timeline.sort((a, b) => a.date.localeCompare(b.date));
    }

    /**
     * Calculate top changed fields
     */
    private static calculateTopFields(audits: Audit[]): TopFieldData[] {
        const fieldCounts = new Map<string, number>();
        const fieldNames = new Map<string, string>();

        audits.forEach(audit => {
            audit.attributes.forEach(attr => {
                const count = fieldCounts.get(attr.logicalName) ?? 0;
                fieldCounts.set(attr.logicalName, count + 1);
                if (attr.displayName) {
                    fieldNames.set(attr.logicalName, attr.displayName);
                }
            });
        });

        const totalChanges = Array.from(fieldCounts.values()).reduce((sum, count) => sum + count, 0);
        const topFields: TopFieldData[] = [];

        fieldCounts.forEach((count, fieldName) => {
            topFields.push({
                fieldName,
                displayName: fieldNames.get(fieldName),
                count,
                percentage: totalChanges > 0 ? (count / totalChanges) * 100 : 0
            });
        });

        return topFields.sort((a, b) => b.count - a.count);
    }

    /**
     * Calculate active users statistics
     */
    private static calculateActiveUsers(audits: Audit[]): ActiveUserData[] {
        const userCounts = new Map<string, { name: string; count: number; lastActivity?: Date }>();

        audits.forEach(audit => {
            if (!audit.user?.id) return;

            const userId = audit.user.id;
            const existing = userCounts.get(userId);
            const auditDate = new Date(audit.timestamp);

            if (existing) {
                existing.count++;
                if (!existing.lastActivity || auditDate > existing.lastActivity) {
                    existing.lastActivity = auditDate;
                }
            } else {
                userCounts.set(userId, {
                    name: audit.user.name ?? 'Unknown User',
                    count: 1,
                    lastActivity: auditDate
                });
            }
        });

        const totalChanges = Array.from(userCounts.values()).reduce((sum, user) => sum + user.count, 0);
        const activeUsers: ActiveUserData[] = [];

        userCounts.forEach((userData, userId) => {
            activeUsers.push({
                userId,
                userName: userData.name,
                changeCount: userData.count,
                percentage: totalChanges > 0 ? (userData.count / totalChanges) * 100 : 0,
                lastActivity: userData.lastActivity
            });
        });

        return activeUsers.sort((a, b) => b.changeCount - a.changeCount);
    }

    /**
     * Generate heatmap data for change frequency
     */
    private static generateHeatmapData(audits: Audit[]): HeatmapData[] {
        const heatmapMap = new Map<string, number>();

        audits.forEach(audit => {
            const date = new Date(audit.timestamp);
            const dayOfWeek = date.getDay();
            const hour = date.getHours();
            const key = `${dayOfWeek}-${hour}`;
            heatmapMap.set(key, (heatmapMap.get(key) ?? 0) + 1);
        });

        const heatmapData: HeatmapData[] = [];
        heatmapMap.forEach((count, key) => {
            const [dayOfWeek, hour] = key.split('-').map(Number);
            heatmapData.push({ dayOfWeek, hour, count });
        });

        return heatmapData;
    }

    /**
     * Calculate trend data and compliance metrics
     */
    private static calculateTrends(audits: Audit[]): TrendData {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        const sixtyDaysAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));

        const currentPeriod = audits.filter(a => new Date(a.timestamp) >= thirtyDaysAgo);
        const previousPeriod = audits.filter(a => {
            const date = new Date(a.timestamp);
            return date >= sixtyDaysAgo && date < thirtyDaysAgo;
        });

        const currentUsers = new Set(currentPeriod.map(a => a.user?.id).filter(Boolean));
        const previousUsers = new Set(previousPeriod.map(a => a.user?.id).filter(Boolean));

        const changesPercentChange = previousPeriod.length > 0
            ? ((currentPeriod.length - previousPeriod.length) / previousPeriod.length) * 100
            : 0;

        const usersPercentChange = previousUsers.size > 0
            ? ((currentUsers.size - previousUsers.size) / previousUsers.size) * 100
            : 0;

        const avgChangesPerDay = currentPeriod.length / 30;
        const previousAvg = previousPeriod.length / 30;
        const avgPercentChange = previousAvg > 0 ? ((avgChangesPerDay - previousAvg) / previousAvg) * 100 : 0;

        const getTrend = (percentChange: number): 'up' | 'down' | 'stable' => {
            if (percentChange > 5) return 'up';
            if (percentChange < -5) return 'down';
            return 'stable';
        };

        return {
            totalChanges: currentPeriod.length,
            changesTrend: getTrend(changesPercentChange),
            changesPercentChange: Math.round(changesPercentChange),
            activeUsers: currentUsers.size,
            usersTrend: getTrend(usersPercentChange),
            usersPercentChange: Math.round(usersPercentChange),
            avgChangesPerDay,
            avgTrend: getTrend(avgPercentChange),
            anomaliesDetected: this.detectAnomalies(currentPeriod),
            complianceStatus: 'compliant'
        };
    }

    /**
     * Detect anomalies in audit patterns
     */
    private static detectAnomalies(audits: Audit[]): number {
        // Simple anomaly detection: bulk changes by same user in short time
        let anomalies = 0;
        const userActivity = new Map<string, Date[]>();

        audits.forEach(audit => {
            if (!audit.user?.id) return;
            const dates = userActivity.get(audit.user.id) ?? [];
            dates.push(new Date(audit.timestamp));
            userActivity.set(audit.user.id, dates);
        });

        userActivity.forEach(dates => {
            dates.sort((a, b) => a.getTime() - b.getTime());
            for (let i = 0; i < dates.length - 9; i++) {
                const timeSpan = dates[i + 9].getTime() - dates[i].getTime();
                // 10+ changes in 5 minutes = anomaly
                if (timeSpan < 5 * 60 * 1000) {
                    anomalies++;
                }
            }
        });

        return anomalies;
    }
}
