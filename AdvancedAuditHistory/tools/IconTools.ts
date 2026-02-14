/**
 * IconTools - Centralized icon management for Fluent UI React Icons
 * 
 * @remarks
 * This module provides utilities for handling Fluent UI icons throughout the PCF control.
 * It includes icon exports, mapping functions for operations, and helper utilities.
 */

import * as React from 'react';
import { 
    ArrowUndo16Regular, 
    Edit16Regular,
    Add16Regular,
    Delete16Regular,
    ArrowClockwiseRegular,
    ArrowSortDownLinesRegular,
    ArrowSortUpLinesRegular,
    SettingsRegular,
    FilterRegular,
    DismissCircleRegular,
    Dismiss12Regular,
    MaximizeRegular,
    GridRegular,
    CardUiRegular,
    TimelineRegular,
    Search20Regular,
    CalendarLtrRegular,
    NumberSymbolRegular,
    SearchRegular,
    TextAlignLeftRegular,
    CheckboxCheckedRegular,
    MoneyRegular,
    OptionsRegular,
    KeyRegular,
    PersonRegular,
    MailInboxRegular,
    DocumentTextRegular,
    QuestionCircleRegular,
    ChartMultipleRegular
} from '@fluentui/react-icons';

/**
 * Exported icon components for common operations
 */
export const Icons = {
    // Operation Icons
    Restore: ArrowUndo16Regular,
    Edit: Edit16Regular,
    Add: Add16Regular,
    Delete: Delete16Regular,
    
    // Toolbar Icons
    Refresh: ArrowClockwiseRegular,
    SortAsc: ArrowSortDownLinesRegular,
    SortDesc: ArrowSortUpLinesRegular,
    Settings: SettingsRegular,
    Filter: FilterRegular,
    ClearAll: DismissCircleRegular,
    Dismiss: Dismiss12Regular,
    Maximize: MaximizeRegular,
    Search: Search20Regular,
    
    // View Type Icons
    Grid: GridRegular,
    Card: CardUiRegular,
    Timeline: TimelineRegular,
    Chart: ChartMultipleRegular,
    
    // Attribute Type Icons
    Calendar: CalendarLtrRegular,
    Number: NumberSymbolRegular,
    Lookup: SearchRegular,
    Text: TextAlignLeftRegular,
    Boolean: CheckboxCheckedRegular,
    Money: MoneyRegular,
    Options: OptionsRegular,
    Key: KeyRegular,
    Person: PersonRegular,
    Mailbox: MailInboxRegular,
    Document: DocumentTextRegular,
    Question: QuestionCircleRegular
} as const;

/**
 * Operation type enumeration matching Dataverse audit operations
 */
export enum OperationType {
    Create = 'create',
    Update = 'update',
    Delete = 'delete',
    Restore = 'restore',
    Assign = 'assign',
    Merge = 'merge',
    SetState = 'setstate'
}

/**
 * Icon mapping for different operation types
 */
const operationIconMap: Record<string, typeof Edit16Regular> = {
    [OperationType.Create]: Add16Regular,
    [OperationType.Update]: Edit16Regular,
    [OperationType.Delete]: Delete16Regular,
    [OperationType.Restore]: ArrowUndo16Regular,
    [OperationType.Assign]: Edit16Regular,
    [OperationType.Merge]: Edit16Regular,
    [OperationType.SetState]: Edit16Regular
};

/**
 * Gets the appropriate icon component based on the operation type.
 * 
 * @param operation - The operation type string (e.g., 'create', 'update', 'delete')
 * @returns React element of the corresponding icon
 * 
 * @example
 * ```tsx
 * const icon = getOperationIcon(audit.operation);
 * // Returns <Edit16Regular /> for update operations
 * ```
 */
export const getOperationIcon = (operation?: string): React.ReactElement => {
    if (!operation) {
        return React.createElement(Edit16Regular);
    }
    
    const lowerOp = operation.toLowerCase();
    
    // Check for restore operation
    if (lowerOp.includes('restore')) {
        return React.createElement(ArrowUndo16Regular);
    }
    
    // Check for create operation
    if (lowerOp.includes('create') || lowerOp.includes('add')) {
        return React.createElement(Add16Regular);
    }
    
    // Check for delete operation
    if (lowerOp.includes('delete') || lowerOp.includes('remove')) {
        return React.createElement(Delete16Regular);
    }
    
    // Check exact matches in operation map
    const IconComponent = operationIconMap[lowerOp];
    if (IconComponent) {
        return React.createElement(IconComponent);
    }
    
    // Default to Edit icon
    return React.createElement(Edit16Regular);
};

/**
 * Gets the icon component class (not instance) based on operation type.
 * Useful when you need to pass the component itself rather than a rendered element.
 * 
 * @param operation - The operation type string
 * @returns Icon component class
 * 
 * @example
 * ```tsx
 * const IconComponent = getOperationIconComponent(audit.operation);
 * return <IconComponent />;
 * ```
 */
export const getOperationIconComponent = (operation?: string): typeof Edit16Regular => {
    if (!operation) {
        return Edit16Regular;
    }
    
    const lowerOp = operation.toLowerCase();
    
    if (lowerOp.includes('restore')) {
        return ArrowUndo16Regular;
    }
    
    if (lowerOp.includes('create') || lowerOp.includes('add')) {
        return Add16Regular;
    }
    
    if (lowerOp.includes('delete') || lowerOp.includes('remove')) {
        return Delete16Regular;
    }
    
    return operationIconMap[lowerOp] || Edit16Regular;
};

/**
 * Gets the color associated with an operation type for consistent theming.
 * 
 * @param operation - The operation type string
 * @returns Hex color code for the operation
 * 
 * @example
 * ```tsx
 * const color = getOperationColor('create'); // Returns '#107c10' (green)
 * ```
 */
export const getOperationColor = (operation?: string): string => {
    if (!operation) {
        return '#0078d4'; // Default blue
    }
    
    const lowerOp = operation.toLowerCase();
    
    if (lowerOp.includes('create') || lowerOp.includes('add')) {
        return '#107c10'; // Green
    }
    
    if (lowerOp.includes('delete') || lowerOp.includes('remove')) {
        return '#d13438'; // Red
    }
    
    if (lowerOp.includes('restore')) {
        return '#8764b8'; // Purple
    }
    
    return '#0078d4'; // Blue for update and default
};
