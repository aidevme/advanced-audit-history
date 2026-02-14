import * as React from 'react';
import { Label, Tag, TagProps } from '@fluentui/react-components';
import { Dismiss12Regular } from '@fluentui/react-icons';
import { Attribute } from '../../interfaces/attributes';
import { AuditFilters } from '../panel/FiltersPanel';

interface IActiveFiltersProps {
    activeFilters: AuditFilters;
    attributes: Attribute[];
    onDismissFilter: (filterType: 'user' | 'attribute' | 'actionType' | 'operationType' | 'minChanges', value?: string) => void;
}

export const ActiveFilters: React.FC<IActiveFiltersProps> = ({ activeFilters, attributes, onDismissFilter }) => {
    return (
        <div style={{ padding: '8px 0', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Label weight="semibold" style={{ fontSize: 14, color: '#323130' }}>
                Filters:
            </Label>
            {activeFilters.user && (
                <Tag 
                    appearance="filled" 
                    color="brand"
                    shape="rounded" 
                    size="small"
                    dismissible
                    dismissIcon={{ onClick: () => onDismissFilter('user') }}
                >
                    User: {activeFilters.user}
                </Tag>
            )}
            {activeFilters.attributeNames && activeFilters.attributeNames.length > 0 && 
                activeFilters.attributeNames.map((logicalName, index) => {
                    const attr = attributes.find(a => a.logicalName === logicalName);
                    return (
                        <Tag 
                            key={index}
                            appearance="outline" 
                            shape="rounded" 
                            size="small"
                            dismissible
                            dismissIcon={{ onClick: () => onDismissFilter('attribute', logicalName) }}
                        >
                            {attr?.displayName || logicalName}
                        </Tag>
                    );
                })
            }
            {activeFilters.actionType && activeFilters.actionType.length > 0 && (
                <Tag 
                    appearance="outline" 
                    shape="rounded" 
                    size="small"
                    dismissible
                    dismissIcon={{ onClick: () => onDismissFilter('actionType') }}
                >
                    Actions: {activeFilters.actionType.length} selected
                </Tag>
            )}
            {activeFilters.operationType && activeFilters.operationType.length > 0 && (
                <Tag 
                    appearance="outline" 
                    shape="rounded" 
                    size="small"
                    dismissible
                    dismissIcon={{ onClick: () => onDismissFilter('operationType') }}
                >
                    Operations: {activeFilters.operationType.length} selected
                </Tag>
            )}
            {activeFilters.minChangesCount && (
                <Tag 
                    appearance="outline" 
                    shape="rounded" 
                    size="small"
                    dismissible
                    dismissIcon={{ onClick: () => onDismissFilter('minChanges') }}
                >
                    Min Changes: {activeFilters.minChangesCount}
                </Tag>
            )}
        </div>
    );
};
