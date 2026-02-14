import * as React from 'react';
import { Text } from '@fluentui/react-components';
import { HeatmapData } from '../../types/AnalyticsTypes';

interface IChangeFrequencyHeatmapProps {
    data: HeatmapData[];
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

/**
 * ChangeFrequencyHeatmap - Heatmap visualization of change patterns
 * 
 * @remarks
 * Displays change frequency by day of week and hour of day.
 * Color intensity represents change volume.
 * Useful for identifying patterns and anomalies.
 * 
 * @param data - Heatmap data points with day, hour, and count
 */
export const ChangeFrequencyHeatmap: React.FC<IChangeFrequencyHeatmapProps> = ({ data }) => {
    const maxCount = Math.max(...data.map(d => d.count), 1);

    const getColor = (count: number): string => {
        if (count === 0) return '#f0f0f0';
        const intensity = count / maxCount;
        if (intensity > 0.75) return '#0078d4';
        if (intensity > 0.5) return '#50b6ff';
        if (intensity > 0.25) return '#a0d8ff';
        return '#d0ecff';
    };

    const getCellData = (day: number, hour: number): number => {
        const cell = data.find(d => d.dayOfWeek === day && d.hour === hour);
        return cell?.count ?? 0;
    };

    return (
        <div className="changeFrequencyHeatmapContainer">
            <div className="changeFrequencyHeatmapGrid">
                {/* Hour labels */}
                <div className="hourLabelsRow">
                    {HOURS.map(hour => (
                        <div 
                            key={hour} 
                            className="hourLabelCell"
                        >
                            {hour % 3 === 0 ? hour : ''}
                        </div>
                    ))}
                </div>

                {/* Heatmap grid */}
                {DAYS.map((day, dayIndex) => (
                    <div key={day} className="dayRow">
                        <Text size={200} className="dayLabel">
                            {day}
                        </Text>
                        {HOURS.map(hour => {
                            const count = getCellData(dayIndex, hour);
                            return (
                                <div
                                    key={hour}
                                    title={`${day} ${hour}:00 - ${count} changes`}
                                    className="heatmapCell"
                                    data-count={count}
                                    data-color={getColor(count)}
                                />
                            );
                        })}
                    </div>
                ))}

                {/* Legend */}
                <div className="legendContainer">
                    <Text size={200}>Low</Text>
                    <div className="legendColors">
                        {['#d0ecff', '#a0d8ff', '#50b6ff', '#0078d4'].map((color, i) => (
                            <div
                                key={i}
                                className="legendColor"
                                data-color={color}
                            />
                        ))}
                    </div>
                    <Text size={200}>High</Text>
                </div>
            </div>
        </div>
    );
};
