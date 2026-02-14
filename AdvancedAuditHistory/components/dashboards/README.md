# Audit Analytics Dashboard

Comprehensive analytics dashboard for audit history visualization and analysis.

## Components

### AuditAnalyticsDashboard (Main Container)
The main orchestrator component that displays all analytics in a responsive grid layout.

**Features:**
- Activity timeline chart (daily/weekly/monthly views)
- Top changed fields visualization
- Most active users statistics
- Change frequency heatmap (day/hour patterns)
- Trend analysis with compliance indicators
- Export functionality
- Refresh capability

**Usage:**
```typescript
import { AuditAnalyticsDashboard } from './components/dashboards';

<AuditAnalyticsDashboard
    audits={auditRecords}
    dateRange={{ from: startDate, to: endDate }}
    isLoading={isLoadingData}
    onRefresh={handleRefresh}
    onExport={handleExport}
/>
```

### Individual Chart Components

#### AuditActivityChart
Line chart showing audit activity over time with metric selection (daily/weekly/monthly).

#### TopFieldsChart
Bar chart displaying the most frequently changed fields with counts and percentages.

#### ActiveUsersChart
User activity list with avatars, change counts, and visual percentage bars.

#### ChangeFrequencyHeatmap
Heatmap visualization showing change patterns by day of week and hour of day.
- Color intensity represents change volume
- Hover tooltips show exact counts
- Useful for identifying unusual activity patterns

#### TrendAnalysisChart
Displays key metrics, trends, and compliance indicators:
- Total changes with trend direction
- Active users statistics
- Average changes per day
- Anomaly detection
- Compliance status indicators

## Services

### AnalyticsService
Centralized service for audit data analysis and aggregation.

**Methods:**
- `analyzeAudits(audits, dateRange)` - Generate complete analytics dataset
- `calculateTopFields(audits)` - Identify most changed fields
- `calculateActiveUsers(audits)` - User activity statistics
- `generateHeatmapData(audits)` - Time-based change patterns
- `calculateTrends(audits)` - Trend analysis and anomaly detection

**Example:**
```typescript
import { AnalyticsService } from '../../services/AnalyticsService';

const analytics = AnalyticsService.analyzeAudits(auditRecords, {
    from: new Date('2026-01-01'),
    to: new Date('2026-02-14')
});

console.log(analytics.topFields); // Top changed fields
console.log(analytics.activeUsers); // User statistics
console.log(analytics.trendData); // Trend metrics
```

## Types

### AnalyticsTypes
All analytics data structures:
- `ActivityTimelineData` - Timeline data points
- `TopFieldData` - Field change statistics
- `ActiveUserData` - User activity stats
- `HeatmapData` - Time-based frequency data
- `TrendData` - Trend metrics and compliance
- `AnalyticsData` - Complete analytics dataset

### DateRange
```typescript
interface DateRange {
    from: Date;
    to: Date;
}
```

## Architecture

```
AuditAnalyticsDashboard (Container)
├── AuditActivityChart (Timeline)
├── TopFieldsChart (Bar chart)
├── ActiveUsersChart (User list)
├── ChangeFrequencyHeatmap (Heatmap)
└── TrendAnalysisChart (Metrics)

AnalyticsService (Data processing)
├── analyzeAudits()
├── generateActivityTimeline()
├── calculateTopFields()
├── calculateActiveUsers()
├── generateHeatmapData()
├── calculateTrends()
└── detectAnomalies()
```

## Features

### Anomaly Detection
The system automatically detects unusual patterns:
- 10+ changes by same user within 5 minutes flagged as anomaly
- Displayed in trend analysis with warning indicators
- Helps identify bulk operations or potential security issues

### Compliance Monitoring
- Track change volumes against baselines
- Identify trend deviations
- Compliance status indicators
- Retention policy tracking

### Performance
- Efficient data aggregation with Map-based counting
- Lazy calculation with useMemo
- Responsive grid layout adapts to screen size
- Handles large datasets (tested with 10,000+ audit records)

## Customization

### Metric Selection
AuditActivityChart supports dynamic metric switching:
```typescript
const [metric, setMetric] = useState<'daily' | 'weekly' | 'monthly'>('daily');
```

### Color Theming
Components use FluentUI theming for consistent branding.

### Export Formats
Supports multiple export formats (passed via callback):
- `'excel'` - Excel workbook
- `'pdf'` - PDF report
- `'csv'` - CSV data export

## Dependencies

- **@fluentui/react-components** - UI components and theming
- **@fluentui/react-icons** - Icon library
- **React** 16.14.0+ - Component framework

## Future Enhancements

- Chart library integration (Recharts/D3.js) for interactive charts
- Real-time data refresh with WebSocket support
- Custom report builder
- Advanced filtering within dashboard
- Drill-down capabilities for detailed analysis
- Export to Power BI integration
