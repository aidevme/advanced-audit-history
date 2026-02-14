import * as React from 'react';
import { Text } from '@fluentui/react-components';
import { TopFieldData } from '../../types/AnalyticsTypes';

interface ITopFieldsChartProps {
    data: TopFieldData[];
}

/**
 * TopFieldsChart - Bar chart showing most frequently changed fields
 * 
 * @remarks
 * Displays top 10 fields by change count with percentage breakdown.
 * Includes field name, change count, and visual percentage bar.
 * 
 * @param data - Array of field change statistics
 */
export const TopFieldsChart: React.FC<ITopFieldsChartProps> = ({ data }) => {
    const maxCount = Math.max(...data.map(d => d.count), 1);

    return (
        <div className="topFieldsChart-container">
            {data.slice(0, 10).map((field, index) => {
                const percentage = (field.count / maxCount) * 100;
                
                return (
                    <div 
                        key={field.fieldName} 
                        className="topFieldsChart-row"
                    >
                        <Text size={200} className="topFieldsChart-fieldName">
                            {field.displayName || field.fieldName}
                        </Text>
                        <div className="topFieldsChart-barContainer">
                            <div 
                                className="topFieldsChart-bar"
                                style={{ '--bar-width': `${percentage}%` } as React.CSSProperties}
                                data-percentage={percentage}
                            />
                        </div>
                        <Text size={200} weight="semibold" className="topFieldsChart-count">
                            {field.count}
                        </Text>
                    </div>
                );
            })}
            {data.length === 0 && (
                <div className="topFieldsChart-empty">
                    No field changes to display
                </div>
            )}
        </div>
    );
};
