import * as React from 'react';
import { Audit } from '../../interfaces';
import { AuditCard } from '../cards/AuditCard';
import { Subtitle2 } from '@fluentui/react-components';
import { useContext } from 'react';
import { ControlContext } from '../../context/control-context';

interface ICardViewProps {
    audits?: Audit[];
}

/**
 * CardView component displays audit records in a simple vertical card layout.
 * 
 * @remarks
 * This view renders audit records as a list of cards with consistent spacing.
 * Shows an empty state message when no audit records are available.
 * 
 * @param audits - Array of audit records to display
 */
export const CardView: React.FC<ICardViewProps> = ({ audits }) => {
    const { resources } = useContext(ControlContext);
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', padding: 2, gap: 8 }}>
            {
                audits?.map((audit) => (
                    <AuditCard key={audit.id} audit={audit} />
                ))
            }
            {
                !audits || audits.length <= 0 && (
                    <div 
                        style={{ 
                            height: '200px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
                        }}
                    >
                        <Subtitle2>{resources.getString("no-results")}</Subtitle2>
                    </div>
                )
            }
        </div>
    );
};

export default CardView;
