import * as React from 'react';
import { Text, Avatar } from '@fluentui/react-components';
import { ActiveUserData } from '../../types/AnalyticsTypes';

interface IActiveUsersChartProps {
    data: ActiveUserData[];
}

/**
 * ActiveUsersChart - List showing most active users by change count
 * 
 * @remarks
 * Displays top users with avatar, name, change count, and activity percentage.
 * Sorted by total changes in descending order.
 * 
 * @param data - Array of user activity statistics
 */
export const ActiveUsersChart: React.FC<IActiveUsersChartProps> = ({ data }) => {
    const maxCount = Math.max(...data.map(d => d.changeCount), 1);

    return (
        <div style={{ padding: '16px' }}>
            {data.slice(0, 10).map((user, index) => {
                const percentage = (user.changeCount / maxCount) * 100;
                const initials = user.userName
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .substring(0, 2);
                
                return (
                    <div 
                        key={user.userId} 
                        style={{ 
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}
                    >
                        <Avatar 
                            name={user.userName}
                            initials={initials}
                            size={32}
                            color="brand"
                        />
                        <div style={{ flex: 1 }}>
                            <Text size={300} weight="semibold" block>
                                {user.userName}
                            </Text>
                            <div style={{ 
                                marginTop: '4px',
                                height: '8px',
                                backgroundColor: '#f0f0f0',
                                borderRadius: '4px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    height: '100%',
                                    width: `${percentage}%`,
                                    backgroundColor: '#0078d4',
                                    transition: 'width 0.3s ease'
                                }} />
                            </div>
                        </div>
                        <Text size={200} weight="semibold">
                            {user.changeCount}
                        </Text>
                    </div>
                );
            })}
            {data.length === 0 && (
                <div style={{ textAlign: 'center', padding: '32px', color: '#666' }}>
                    No user activity to display
                </div>
            )}
        </div>
    );
};
