import * as React from 'react';
import { Audit } from '../../interfaces';
import { AuditCard } from '../cards/AuditCard';
import { Caption1 } from '@fluentui/react-components';
import { useContext } from 'react';
import { ControlContext } from '../../context/control-context';
import { getOperationIcon } from '../../tools/IconTools';

interface ITimelineViewProps {
    audits: Audit[];
}

/**
 * TimelineView component displays audit records in an interactive timeline layout.
 * 
 * @remarks
 * This view renders audit records as cards alternating left and right along a vertical timeline.
 * Features include:
 * - Centered timeline with connecting lines between nodes
 * - Operation-specific icons in timeline badges
 * - Timestamps positioned opposite to cards
 * - Arrow indicators pointing to cards
 * - Maximum card width of 500px for readability
 * 
 * @param audits - Array of audit records to display in timeline format
 */
export const TimelineView: React.FC<ITimelineViewProps> = ({ audits }) => {
    const { formatting } = useContext(ControlContext);
    
    if (!audits || audits.length === 0) {
        return null;
    }
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '20px 2px', gap: 0, backgroundColor: '#fafafa' }}>
            {audits.map((audit, index) => {
                const isLeft = index % 2 === 0;
                
                return (
                    <div 
                        key={audit.id} 
                        style={{ 
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            minHeight: '200px',
                            marginBottom: index < audits.length - 1 ? '40px' : '0'
                        }}
                    >
                        {/* Left Side - Card or Spacer */}
                        {isLeft ? (
                            <div style={{ 
                                flex: 1, 
                                paddingRight: '40px',
                                display: 'flex',
                                justifyContent: 'flex-end'
                            }}>
                                <div style={{ width: '100%', maxWidth: '500px' }}>
                                    <AuditCard audit={audit} />
                                </div>
                            </div>
                        ) : (
                            <div style={{ flex: 1 }} />
                        )}
                        
                        {/* Timeline Center */}
                        <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            alignItems: 'center',
                            position: 'relative',
                            flexShrink: 0,
                            width: '40px'
                        }}>
                            {/* Timeline Line - connects to next badge */}
                            {index < audits.length - 1 && (
                                <div style={{
                                    position: 'absolute',
                                    top: '20px',
                                    left: '19px',
                                    width: '2px',
                                    height: 'calc(100% + 60px)',
                                    backgroundColor: '#0078d4',
                                    zIndex: 0
                                }} />
                            )}
                            
                            {/* Timeline Node (Circle Icon) */}
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: '#0078d4',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '18px',
                                zIndex: 10,
                                border: '3px solid white',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                position: 'relative'
                            }}>
                                {getOperationIcon(audit.operation)}
                            </div>
                            
                            {/* Timestamp - positioned on opposite side of card */}
                            <div style={{
                                position: 'absolute',
                                top: '10px',
                                [isLeft ? 'left' : 'right']: '50px',
                                whiteSpace: 'nowrap',
                                textAlign: isLeft ? 'left' : 'right',
                                zIndex: 5
                            }}>
                                <Caption1 style={{ fontWeight: 600 }}>
                                    {formatting.formatDateShort(audit.timestamp, true)}
                                </Caption1>
                            </div>
                            
                            {/* Arrow pointing to card */}
                            <div style={{
                                position: 'absolute',
                                top: '18px',
                                [isLeft ? 'right' : 'left']: '40px',
                                width: 0,
                                height: 0,
                                borderTop: '8px solid transparent',
                                borderBottom: '8px solid transparent',
                                [isLeft ? 'borderRight' : 'borderLeft']: '12px solid #0078d4',
                                zIndex: 5
                            }} />
                        </div>
                        
                        {/* Right Side - Card or Spacer */}
                        {!isLeft ? (
                            <div style={{ 
                                flex: 1, 
                                paddingLeft: '40px',
                                display: 'flex',
                                justifyContent: 'flex-start'
                            }}>
                                <div style={{ width: '100%', maxWidth: '500px' }}>
                                    <AuditCard audit={audit} />
                                </div>
                            </div>
                        ) : (
                            <div style={{ flex: 1 }} />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default TimelineView;
