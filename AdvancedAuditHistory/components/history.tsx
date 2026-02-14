import * as React from 'react';
import { Audit } from '../interfaces';
import CardView from './views/CardView';
import TimelineView from './views/TimelineView';

interface IHistoryProps {
    audits?: Audit[];
    viewType: 'card' | 'card-timeline';
}

/**
 * History component - Router for different audit history view types.
 * 
 * @remarks
 * This component acts as a view router, rendering either a simple card list view
 * or an interactive timeline view based on the viewType prop.
 * 
 * @param audits - Array of audit records to display
 * @param viewType - Display mode: 'card' for simple list, 'card-timeline' for timeline layout
 */
export default function History({ audits, viewType }: IHistoryProps) {
    switch (viewType) {
        case 'card-timeline':
            return audits && audits.length > 0 
                ? <TimelineView audits={audits} /> 
                : <CardView audits={audits} />;
        case 'card':
        default:
            return <CardView audits={audits} />;
    }
}
