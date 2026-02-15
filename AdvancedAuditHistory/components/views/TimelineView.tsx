import * as React from 'react';
import { useState, useEffect, useRef, useContext } from 'react';
import { Audit } from '../../interfaces';
import { AuditCard } from '../cards/AuditCard';
import { getOperationIcon } from '../../tools/IconTools';
import { Caption1 } from '@fluentui/react-components';
import { ControlContext } from '../../context/control-context';

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
    const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());
    const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const cardId = entry.target.getAttribute('data-card-id');
                        if (cardId) {
                            setVisibleCards((prev) => new Set(prev).add(cardId));
                        }
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '50px'
            }
        );

        cardRefs.current.forEach((element) => {
            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, [audits]);

    if (!audits || audits.length === 0) {
        return null;
    }
    
    return (
        <>
            <style>
                {`
                    @keyframes slideFromLeft {
                        from {
                            opacity: 0;
                            transform: translateX(-100px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }
                    
                    @keyframes slideFromRight {
                        from {
                            opacity: 0;
                            transform: translateX(100px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }
                `}
            </style>
            <div 
                className="main-container"
                style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    padding: '20px 2px', 
                    gap: 0, 
                    backgroundColor: '#fafafa' 
                }}
            >
            {audits.map((audit, index) => {
                const isLeft = index % 2 === 0;
                const isVisible = visibleCards.has(audit.id);
                
                return (
                    <div 
                        key={audit.id}
                        className="cards-container"
                        style={{ 
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            minHeight: '200px',
                            marginBottom: index < audits.length - 1 ? '40px' : '0'
                        }}
                    >
                        {/* Left Card Sub-container */}
                        <div 
                            className="leftcard"
                            style={{ 
                                flex: 1,
                                paddingRight: '20px',
                                display: 'flex',
                                justifyContent: 'flex-end'
                            }}
                        >
                            {isLeft ? (
                                <div 
                                    ref={(el) => {
                                        if (el) cardRefs.current.set(audit.id, el);
                                    }}
                                    data-card-id={audit.id}
                                    style={{ 
                                        width: '100%', 
                                        maxWidth: '500px',
                                        animation: isVisible ? 'slideFromLeft 0.6s ease-out forwards' : 'none',
                                        opacity: isVisible ? undefined : 0,
                                        transform: isVisible ? undefined : 'translateX(-100px)',
                                        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
                                    }}>
                                    <AuditCard audit={audit} />
                                </div>
                            ) : (
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'flex-start', 
                                    justifyContent: 'flex-end',
                                    paddingRight: '20px',
                                    paddingTop: '10px',
                                    height: '40px',
                                    animation: isVisible ? 'slideFromLeft 0.6s ease-out forwards' : 'none',
                                    opacity: isVisible ? undefined : 0,
                                    transform: isVisible ? undefined : 'translateX(-100px)',
                                    transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
                                }}>
                                    <Caption1 style={{ fontWeight: 600, color: '#605E5C', fontSize: 16 }}>
                                        {formatting.formatDateShort(audit.timestamp, true)}
                                    </Caption1>
                                </div>
                            )}
                        </div>
                        
                        {/* Timeline Center Sub-container - Fixed 150px */}
                        <div 
                            className="timelinecenter"
                            style={{ 
                                display: 'flex', 
                                flexDirection: 'column',
                                alignItems: 'center',
                                position: 'relative',
                                flexShrink: 0,
                                alignSelf: 'stretch',
                                width: '150px'
                            }}
                        >
                            {/* Timeline Line - connects to next badge */}
                            {index < audits.length - 1 && (
                                <div style={{
                                    position: 'absolute',
                                    top: '20px',
                                    left: '74px',
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
                            
                            {/* Arrow pointing to card */}
                            <div style={{
                                position: 'absolute',
                                top: '18px',
                                [isLeft ? 'right' : 'left']: '55px',
                                width: 0,
                                height: 0,
                                borderTop: '8px solid transparent',
                                borderBottom: '8px solid transparent',
                                [isLeft ? 'borderRight' : 'borderLeft']: '12px solid #0078d4',
                                zIndex: 5
                            }} />
                        </div>
                        
                        {/* Right Card Sub-container */}
                        <div 
                            className="rightcard"
                            style={{ 
                                flex: 1,
                                paddingLeft: '20px',
                                display: 'flex',
                                justifyContent: 'flex-start'
                            }}
                        >
                            {!isLeft ? (
                                <div 
                                    ref={(el) => {
                                        if (el) cardRefs.current.set(audit.id, el);
                                    }}
                                    data-card-id={audit.id}
                                    style={{ 
                                        width: '100%', 
                                        maxWidth: '500px',
                                        animation: isVisible ? 'slideFromRight 0.6s ease-out forwards' : 'none',
                                        opacity: isVisible ? undefined : 0,
                                        transform: isVisible ? undefined : 'translateX(100px)',
                                        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
                                    }}>
                                    <AuditCard audit={audit} />
                                </div>
                            ) : (
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'flex-start', 
                                    justifyContent: 'flex-start',
                                    paddingLeft: '20px',
                                    paddingTop: '10px',
                                    height: '40px',
                                    animation: isVisible ? 'slideFromRight 0.6s ease-out forwards' : 'none',
                                    opacity: isVisible ? undefined : 0,
                                    transform: isVisible ? undefined : 'translateX(100px)',
                                    transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
                                }}>
                                    <Caption1 style={{ fontWeight: 600, color: '#605E5C', fontSize: 16 }}>
                                        {formatting.formatDateShort(audit.timestamp, true)}
                                    </Caption1>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
        </>
    );
};

export default TimelineView;
