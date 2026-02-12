import * as React from 'react';
import { Audit } from '../interfaces/audit';
import { AuditCard } from './cards/audit';
import { Subtitle2 } from '@fluentui/react-components';
import { useContext } from 'react';
import { ControlContext } from '../context/control-context';

interface IHistoryProps {
    audits?: Audit[]
}

export default function History({ audits }: IHistoryProps) {
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
}
