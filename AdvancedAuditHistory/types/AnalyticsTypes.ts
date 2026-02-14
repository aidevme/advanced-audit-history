/**
 * Analytics type definitions for audit history dashboard
 */

/**
 * Timeline data point for activity charts
 */
export interface ActivityTimelineData {
    /** Date or time period label */
    period: string;
    /** Number of changes in this period */
    count: number;
    /** ISO date string for the period */
    date: string;
}

/**
 * Top field change statistics
 */
export interface TopFieldData {
    /** Internal field name */
    fieldName: string;
    /** Display name for the field */
    displayName?: string;
    /** Number of times this field was changed */
    count: number;
    /** Percentage of total changes */
    percentage: number;
}

/**
 * User activity statistics
 */
export interface ActiveUserData {
    /** User's unique identifier */
    userId: string;
    /** User's display name */
    userName: string;
    /** Total number of changes made by user */
    changeCount: number;
    /** Percentage of total changes */
    percentage: number;
    /** Most recent change timestamp */
    lastActivity?: Date;
}

/**
 * Heatmap data point for change frequency visualization
 */
export interface HeatmapData {
    /** Day of week (0 = Sunday, 6 = Saturday) */
    dayOfWeek: number;
    /** Hour of day (0-23) */
    hour: number;
    /** Number of changes in this time slot */
    count: number;
}

/**
 * Trend analysis data
 */
export interface TrendData {
    /** Total changes in current period */
    totalChanges: number;
    /** Trend direction for changes */
    changesTrend: 'up' | 'down' | 'stable';
    /** Percentage change vs previous period */
    changesPercentChange: number;
    /** Number of active users */
    activeUsers: number;
    /** Trend direction for users */
    usersTrend: 'up' | 'down' | 'stable';
    /** Percentage change in users vs previous period */
    usersPercentChange: number;
    /** Average changes per day */
    avgChangesPerDay: number;
    /** Trend direction for average */
    avgTrend: 'up' | 'down' | 'stable';
    /** Number of anomalies detected */
    anomaliesDetected: number;
    /** Compliance status */
    complianceStatus: 'compliant' | 'warning' | 'violation';
}

/**
 * Complete analytics dataset
 */
export interface AnalyticsData {
    /** Activity timeline data */
    activityTimeline: ActivityTimelineData[];
    /** Top changed fields */
    topFields: TopFieldData[];
    /** Most active users */
    activeUsers: ActiveUserData[];
    /** Heatmap data points */
    heatmapData: HeatmapData[];
    /** Trend analysis */
    trendData: TrendData;
}
