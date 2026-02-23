/**
 * IconTools - Centralized icon management for Fluent UI React Icons
 * 
 * @remarks
 * This module provides utilities for handling Fluent UI icons throughout the PCF control.
 * It includes icon exports, mapping functions for operations, and helper utilities.
 */

import * as React from 'react';


import { createFluentIcon } from './createFluentIcon';

import {
    TextCalloutIcon,
    TextFieldIcon,
    TextBoxIcon,
    DropdownIcon,
    ToggleLeftIcon,
    NumberFieldIcon,
    DecimalsIcon,
    CircleHalfFullIcon,
    SearchIcon,
    ProfileSearchIcon,
    ContactIcon,
    PageIcon,
    Photo2Icon,

    AllCurrencyIcon,

    ClearFilterIcon,
    DocumentIcon,
    ExportIcon,
    FilterIcon,
    PDFIcon,


} from '@fluentui/react-icons-mdl2';

/**
 * Exported icon components for common operations
 */
export const Icons = {
    // Operation Icons
    Restore: createFluentIcon('ArrowUndo16Regular', "16", ["M3 2.5a.5.5 0 0 1 1 0v3.84l3.17-3.17a4 4 0 0 1 5.66 5.66L7.8 13.85a.5.5 0 0 1-.7-.7l5.02-5.03a3 3 0 1 0-4.24-4.24L4.76 7H8.5a.5.5 0 0 1 0 1H3.6a.6.6 0 0 1-.6-.6V2.5Z"], { flipInRtl: true }),
    Edit: createFluentIcon('Edit16Regular', "16", ["M14.24 1.76a2.62 2.62 0 0 0-3.71 0L2.66 9.64c-.38.37-.64.84-.78 1.35l-.86 3.39a.5.5 0 0 0 .6.6l3.39-.86c.51-.14.98-.4 1.35-.78l7.88-7.87a2.62 2.62 0 0 0 0-3.7Zm-3 .71a1.62 1.62 0 1 1 2.29 2.3l-.78.77-2.3-2.29.79-.78ZM9.75 3.96l2.3 2.29-6.4 6.39c-.24.24-.55.42-.89.5l-2.57.67.66-2.57c.09-.34.27-.65.51-.9l6.39-6.38Z"]),
    Add: createFluentIcon('Add16Regular', "16", ["M8 2c.28 0 .5.22.5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5c0-.28.22-.5.5-.5Z"]),
    Delete: createFluentIcon('Delete16Regular', "16", ["M7 3h2a1 1 0 0 0-2 0ZM6 3a2 2 0 1 1 4 0h4a.5.5 0 0 1 0 1h-.56l-1.2 8.84A2.5 2.5 0 0 1 9.74 15h-3.5a2.5 2.5 0 0 1-2.48-2.16L2.57 4H2a.5.5 0 0 1 0-1h4Zm1 3.5a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0v-5ZM9.5 6c.28 0 .5.22.5.5v5a.5.5 0 0 1-1 0v-5c0-.28.22-.5.5-.5Zm-4.74 6.7c.1.75.74 1.3 1.49 1.3h3.5a1.5 1.5 0 0 0 1.5-1.3L12.42 4H3.57l1.19 8.7Z"]),

    // Toolbar Icons
    Refresh: createFluentIcon('ArrowClockwiseRegular', "1em", ["M4 10a6 6 0 0 1 10.47-4H12.5a.5.5 0 0 0 0 1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-1 0v1.6a7 7 0 1 0 1.98 4.36.5.5 0 1 0-1 .08L16 10a6 6 0 0 1-12 0Z"]),
    SortAsc: createFluentIcon('ArrowSortDownLinesRegular', "1em", ["M15 2.5a.5.5 0 0 0-1 0v13.8l-2.15-2.15a.5.5 0 0 0-.7.7l3 3c.2.2.5.2.7 0l3-3a.5.5 0 0 0-.7-.7L15 16.29V2.5ZM2.5 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9ZM5 7.5c0-.28.22-.5.5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5ZM8.5 10a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3Z"]),
    SortDesc: createFluentIcon('ArrowSortUpLinesRegular', "1em", ["M15 17.5a.5.5 0 0 1-1 0V3.7l-2.15 2.15a.5.5 0 0 1-.7-.7l3-3c.2-.2.5-.2.7 0l3 3a.5.5 0 0 1-.7.7L15 3.71V17.5ZM2.5 16a.5.5 0 0 1 0-1h9a.5.5 0 0 1 0 1h-9ZM5 12.5c0 .28.22.5.5.5h6a.5.5 0 0 0 0-1h-6a.5.5 0 0 0-.5.5ZM8.5 10a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1h-3Z"]),
    SortUp16: createFluentIcon('ArrowSortUp16Regular', "16", ["M7.15 2.15c.2-.2.5-.2.7 0l3 3a.5.5 0 0 1-.7.7L8 3.71v9.79a.5.5 0 0 1-1 0V3.7L4.85 5.86a.5.5 0 1 1-.7-.7l3-3Z"]),
    SortDown16: createFluentIcon('ArrowSortDown16Regular', "16", ["M7.15 13.85c.2.2.5.2.7 0l3-3a.5.5 0 0 0-.7-.7L8 12.29V2.5a.5.5 0 0 0-1 0v9.8l-2.15-2.15a.5.5 0 0 0-.7.7l3 3Z"]),
    Settings: createFluentIcon('SettingsRegular', "1em", ["M1.91 7.38A8.5 8.5 0 0 1 3.7 4.3a.5.5 0 0 1 .54-.13l1.92.68a1 1 0 0 0 1.32-.76l.36-2a.5.5 0 0 1 .4-.4 8.53 8.53 0 0 1 3.55 0c.2.04.35.2.38.4l.37 2a1 1 0 0 0 1.32.76l1.92-.68a.5.5 0 0 1 .54.13 8.5 8.5 0 0 1 1.78 3.08c.06.2 0 .4-.15.54l-1.56 1.32a1 1 0 0 0 0 1.52l1.56 1.32a.5.5 0 0 1 .15.54 8.5 8.5 0 0 1-1.78 3.08.5.5 0 0 1-.54.13l-1.92-.68a1 1 0 0 0-1.32.76l-.37 2a.5.5 0 0 1-.38.4 8.53 8.53 0 0 1-3.56 0 .5.5 0 0 1-.39-.4l-.36-2a1 1 0 0 0-1.32-.76l-1.92.68a.5.5 0 0 1-.54-.13 8.5 8.5 0 0 1-1.78-3.08.5.5 0 0 1 .15-.54l1.56-1.32a1 1 0 0 0 0-1.52L2.06 7.92a.5.5 0 0 1-.15-.54Zm1.06 0 1.3 1.1a2 2 0 0 1 0 3.04l-1.3 1.1c.3.79.72 1.51 1.25 2.16l1.6-.58a2 2 0 0 1 2.63 1.53l.3 1.67a7.56 7.56 0 0 0 2.5 0l.3-1.67a2 2 0 0 1 2.64-1.53l1.6.58a7.5 7.5 0 0 0 1.24-2.16l-1.3-1.1a2 2 0 0 1 0-3.04l1.3-1.1a7.5 7.5 0 0 0-1.25-2.16l-1.6.58a2 2 0 0 1-2.63-1.53l-.3-1.67a7.55 7.55 0 0 0-2.5 0l-.3 1.67A2 2 0 0 1 5.81 5.8l-1.6-.58a7.5 7.5 0 0 0-1.24 2.16ZM7.5 10a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0Zm1 0a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z"]),
    FilterIcon: FilterIcon,
    ClearFilterIcon: ClearFilterIcon,
    Dismiss: createFluentIcon('Dismiss12Regular', "12", ["m2.09 2.22.06-.07a.5.5 0 0 1 .63-.06l.07.06L6 5.29l3.15-3.14a.5.5 0 1 1 .7.7L6.71 6l3.14 3.15c.18.17.2.44.06.63l-.06.07a.5.5 0 0 1-.63.06l-.07-.06L6 6.71 2.85 9.85a.5.5 0 0 1-.7-.7L5.29 6 2.15 2.85a.5.5 0 0 1-.06-.63l.06-.07-.06.07Z"]),
    Dismiss20: createFluentIcon('Dismiss20Regular', "20", ["m4.09 4.22.06-.07a.5.5 0 0 1 .63-.06l.07.06L10 9.29l5.15-5.14a.5.5 0 0 1 .63-.06l.07.06c.18.17.2.44.06.63l-.06.07L10.71 10l5.14 5.15c.18.17.2.44.06.63l-.06.07a.5.5 0 0 1-.63.06l-.07-.06L10 10.71l-5.15 5.14a.5.5 0 0 1-.63.06l-.07-.06a.5.5 0 0 1-.06-.63l.06-.07L9.29 10 4.15 4.85a.5.5 0 0 1-.06-.63l.06-.07-.06.07Z"]),
    Dismiss24: createFluentIcon('FilterDismiss24Regular', "24", ["M23 7.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Zm-7.15-2.35a.5.5 0 0 0-.7.7l1.64 1.65-1.64 1.65a.5.5 0 0 0 .7.7l1.65-1.64 1.65 1.64a.5.5 0 0 0 .7-.7L18.21 7.5l1.64-1.65a.5.5 0 0 0-.7-.7L17.5 6.79l-1.65-1.64Z", "M13.35 12.5a6.54 6.54 0 0 1-1.33-1.5H7.5a.75.75 0 0 0 0 1.5h5.85Z", "M11 7.5c0-.52.06-1.02.17-1.5H4.5a.75.75 0 0 0 0 1.5H11Z", "M13.5 16a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1 0-1.5h3Z"]),
    Maximize: createFluentIcon('MaximizeRegular', "1em", ["M3 5c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Zm2-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H5Z"]),
    Search: createFluentIcon('Search20Regular', "20", ["M13.73 14.44a6.5 6.5 0 1 1 .7-.7l3.42 3.4a.5.5 0 0 1-.63.77l-.07-.06-3.42-3.41Zm-.71-.71A5.54 5.54 0 0 0 15 9.5a5.5 5.5 0 1 0-1.98 4.23Z"]),

    // Export Icons
    Export: ExportIcon,
    PDF: PDFIcon,
    Document: DocumentIcon,

    // View Type Icons
    Grid: createFluentIcon('GridRegular', "1em", ["M7.5 11c.83 0 1.5.67 1.5 1.5v4c0 .83-.67 1.5-1.5 1.5h-4A1.5 1.5 0 0 1 2 16.5v-4c0-.83.67-1.5 1.5-1.5h4Zm9 0c.83 0 1.5.67 1.5 1.5v4c0 .83-.67 1.5-1.5 1.5h-4a1.5 1.5 0 0 1-1.5-1.5v-4c0-.83.67-1.5 1.5-1.5h4Zm-9 1h-4a.5.5 0 0 0-.5.5v4c0 .28.22.5.5.5h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-.5-.5Zm9 0h-4a.5.5 0 0 0-.5.5v4c0 .28.22.5.5.5h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-.5-.5Zm-9-10C8.33 2 9 2.67 9 3.5v4C9 8.33 8.33 9 7.5 9h-4A1.5 1.5 0 0 1 2 7.5v-4C2 2.67 2.67 2 3.5 2h4Zm9 0c.83 0 1.5.67 1.5 1.5v4c0 .83-.67 1.5-1.5 1.5h-4A1.5 1.5 0 0 1 11 7.5v-4c0-.83.67-1.5 1.5-1.5h4Zm-9 1h-4a.5.5 0 0 0-.5.5v4c0 .28.22.5.5.5h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-.5-.5Zm9 0h-4a.5.5 0 0 0-.5.5v4c0 .28.22.5.5.5h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-.5-.5Z"]),
    Card: createFluentIcon('CardUiRegular', "1em", ["M4.5 4A2.5 2.5 0 0 0 2 6.5v7A2.5 2.5 0 0 0 4.5 16h11a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 15.5 4h-11ZM3 6.5C3 5.67 3.67 5 4.5 5h11c.83 0 1.5.67 1.5 1.5v7c0 .83-.67 1.5-1.5 1.5h-11A1.5 1.5 0 0 1 3 13.5v-7ZM4.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5Zm0 2a.5.5 0 0 0 0 1h8a.5.5 0 0 0 0-1h-8Zm.5 3a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H5Z"]),
    Timeline: createFluentIcon('TimelineRegular', "1em", ["M3.5 3C2.67 3 2 3.67 2 4.5v4c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5v-4c0-.83-.67-1.5-1.5-1.5h-9ZM3 4.5c0-.28.22-.5.5-.5h9c.28 0 .5.22.5.5v4a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-4Zm.5 6.5c-.83 0-1.5.67-1.5 1.5v4c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5v-4c0-.83-.67-1.5-1.5-1.5h-9ZM3 12.5c0-.28.22-.5.5-.5h9c.28 0 .5.22.5.5v4a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-4Zm14-.06a2 2 0 0 1-1-3.88 2 2 0 0 1 1 3.88ZM16.5 3c.28 0 .5.22.5.5v4.04a3.02 3.02 0 0 0-1 0V3.5c0-.28.22-.5.5-.5Zm0 10.5c-.17 0-.34-.01-.5-.04v4.04a.5.5 0 0 0 1 0v-4.04c-.16.03-.33.04-.5.04Z"]),
    Chart: createFluentIcon('ChartMultipleRegular', "1em", ["M16.52 9c.26 0 .48-.2.48-.46V8.5A6.5 6.5 0 0 0 10.5 2h-.04a.47.47 0 0 0-.46.48V8.5c0 .28.22.5.5.5h6.02ZM11 3.02A5.5 5.5 0 0 1 15.98 8H11V3.02ZM8 9V5.1A5 5 0 0 0 9 15v1a6 6 0 0 1-.5-11.98c.28-.02.5.2.5.48V9a1 1 0 0 0 1 1h4.5c.28 0 .5.22.48.5a6 6 0 0 1-.06.5H10a2 2 0 0 1-2-2Zm9 1a1 1 0 0 0-1 1v7a1 1 0 1 0 2 0v-7a1 1 0 0 0-1-1Zm-3 2a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0v-5a1 1 0 0 0-1-1Zm-4 3a1 1 0 1 1 2 0v3a1 1 0 1 1-2 0v-3Z"]),


    // Attribute Type Icons
    // Unique Identifier
    UniqiueIdentifier: TextCalloutIcon,
    // Lookup types
    Lookup: SearchIcon,
    Customer: ProfileSearchIcon,
    Owner: ContactIcon,
    // Text fields
    TextField: TextFieldIcon,
    MultipleTextField: TextBoxIcon,
    // Number fields
    WholeNumber: NumberFieldIcon,
    DecimalNumber: DecimalsIcon,
    FloatingPointNumber: CircleHalfFullIcon,

    // Currency fields
    Currency: AllCurrencyIcon,

    // Choice fields
    Choice: DropdownIcon,
    YesNo: ToggleLeftIcon,

    // File fields
    File: PageIcon,
    Image: Photo2Icon,


    Question: createFluentIcon('QuestionCircleRegular', "1em", ["M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm0 1a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm0 10.5a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5Zm0-8a2.5 2.5 0 0 1 1.65 4.38l-.15.12-.22.17-.09.07-.16.15c-.33.36-.53.85-.53 1.61a.5.5 0 0 1-1 0 3.2 3.2 0 0 1 1.16-2.62l.25-.19.12-.1A1.5 1.5 0 0 0 10 6.5c-.83 0-1.5.67-1.5 1.5a.5.5 0 0 1-1 0A2.5 2.5 0 0 1 10 5.5Z"]),
    Info: createFluentIcon('Info16Regular', "16", ["M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1Zm0 1a6 6 0 1 0 0 12A6 6 0 0 0 8 2Zm0 3a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 8 5Zm0 7a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"]),
    Calendar16: createFluentIcon('CalendarDay16Regular', "16", ["M4.5 2.5a.5.5 0 0 1 .5.5V4h6V3a.5.5 0 0 1 1 0V4h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a.5.5 0 0 1 .5-.5ZM3 5a1 1 0 0 0-1 1v1h12V6a1 1 0 0 0-1-1H3Zm11 3H2v5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8ZM5 10.5c0-.28.22-.5.5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5Zm4 0c0-.28.22-.5.5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5Z"]),
    ShieldCheckmark16: createFluentIcon('ShieldCheckmark16Regular', "16", ["M8 1.42c.23 0 .45.1.6.28l2.95 3.54c.75.9 1.2 1.98 1.32 3.12l.02.38v1.63c0 1.53-.57 3-1.61 4.16l-.2.22a10.48 10.48 0 0 1-2.58 2l-.5.25-.5-.25a10.48 10.48 0 0 1-2.58-2 6.3 6.3 0 0 1-1.8-4.17l-.01-.21V8.74c0-1.22.4-2.4 1.14-3.38l.2-.3 2.95-3.54c.15-.18.37-.28.6-.28Zm0 1.09L5.3 5.88a4.76 4.76 0 0 0-1.29 3.05l-.01.22v1.57c0 1.3.5 2.54 1.37 3.5l.18.19a9.56 9.56 0 0 0 2.45 1.88 9.56 9.56 0 0 0 2.45-1.88c.96-1 1.5-2.3 1.54-3.69v-1.57c0-1.07-.37-2.1-1.05-2.93l-.25-.34L8 2.5Zm2.85 4.65c.2.2.2.5 0 .7l-3.5 3.5a.5.5 0 0 1-.7 0l-1.5-1.5a.5.5 0 1 1 .7-.7l1.15 1.14 3.15-3.14c.2-.2.5-.2.7 0Z"]),

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
const operationIconMap: Record<string, typeof Icons.Edit> = {
    [OperationType.Create]: Icons.Add,
    [OperationType.Update]: Icons.Edit,
    [OperationType.Delete]: Icons.Delete,
    [OperationType.Restore]: Icons.Restore,
    [OperationType.Assign]: Icons.Edit,
    [OperationType.Merge]: Icons.Edit,
    [OperationType.SetState]: Icons.Edit
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
 * // Returns <Icons.Edit /> for update operations
 * ```
 */
export const getOperationIcon = (operation?: string): React.ReactElement => {
    if (!operation) {
        return React.createElement(Icons.Edit);
    }

    const lowerOp = operation.toLowerCase();

    // Check for restore operation
    if (lowerOp.includes('restore')) {
        return React.createElement(Icons.Restore);
    }

    // Check for create operation
    if (lowerOp.includes('create') || lowerOp.includes('add')) {
        return React.createElement(Icons.Add);
    }

    // Check for delete operation
    if (lowerOp.includes('delete') || lowerOp.includes('remove')) {
        return React.createElement(Icons.Delete);
    }

    // Check exact matches in operation map
    const IconComponent = operationIconMap[lowerOp];
    if (IconComponent) {
        return React.createElement(IconComponent);
    }

    // Default to Edit icon
    return React.createElement(Icons.Edit);
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
export const getOperationIconComponent = (operation?: string): typeof Icons.Edit => {
    if (!operation) {
        return Icons.Edit;
    }

    const lowerOp = operation.toLowerCase();

    if (lowerOp.includes('restore')) {
        return Icons.Restore;
    }

    if (lowerOp.includes('create') || lowerOp.includes('add')) {
        return Icons.Add;
    }

    if (lowerOp.includes('delete') || lowerOp.includes('remove')) {
        return Icons.Delete;
    }

    return operationIconMap[lowerOp] || Icons.Edit;
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
