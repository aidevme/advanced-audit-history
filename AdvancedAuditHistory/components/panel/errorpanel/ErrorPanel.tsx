import * as React from 'react';
import { MessageBar, MessageBarBody, MessageBarTitle } from '@fluentui/react-components';

/**
 * Type for different error panel types
 */
export type ErrorPanelType =
    | 'no-permission'       // User does not have permission to access audit history
    | 'audit-not-enabled'   // Audit logging is not enabled for the entity
    | 'no-audit-data';      // No audit data available for the entity

/**
 * Constants for ErrorPanelType values
 */
export const ERROR_PANEL_TYPES = {
    NO_PERMISSION: 'no-permission' as ErrorPanelType,
    AUDIT_NOT_ENABLED: 'audit-not-enabled' as ErrorPanelType,
    NO_AUDIT_DATA: 'no-audit-data' as ErrorPanelType,
} as const;

interface IErrorPanelProps {
    /** PCF resources for localization */
    resources: ComponentFramework.Resources;
    /** The type of error being displayed */
    errorType: ErrorPanelType;
    /** Optional: Override default intent based on errorType */
    intent?: 'error' | 'warning' | 'info';
    /** Optional: Override default title based on errorType */
    title?: string;
    /** Optional: Override default message based on errorType */
    message?: string;
    maxWidth?: string;
}

/**
 * Get default configuration for each error type from resources
 */
const getErrorConfig = (errorType: ErrorPanelType, resources: ComponentFramework.Resources): { intent: 'error' | 'warning' | 'info'; title: string; message: string } => {
    switch (errorType) {
        case 'no-permission':
            return {
                intent: 'error',
                title: resources.getString('advanced-audit-history-error-panel-no-permission-title'),
                message: resources.getString('advanced-audit-history-error-panel-no-permission-message')
            };
        case 'audit-not-enabled':
            return {
                intent: 'warning',
                title: resources.getString('advanced-audit-history-error-panel-audit-not-enabled-title'),
                message: resources.getString('advanced-audit-history-error-panel-audit-not-enabled-message')
            };
        case 'no-audit-data':
            return {
                intent: 'info',
                title: resources.getString('advanced-audit-history-error-panel-no-audit-data-title'),
                message: resources.getString('advanced-audit-history-error-panel-no-audit-data-message')
            };
        default:
            return {
                intent: 'info',
                title: resources.getString('advanced-audit-history-error-panel-default-title'),
                message: resources.getString('advanced-audit-history-error-panel-default-message')
            };
    }
};

/**
 * ErrorPanel component displays error, warning, or informational messages using FluentUI MessageBar.
 * 
 * @remarks
 * This component provides a consistent way to display various message types throughout the application.
 * It centers the message on the screen with customizable padding and width.
 * The intent, title, and message are automatically determined based on errorType, but can be overridden.
 * 
 * @example
 * ```tsx
 * // Simplest usage - automatically determines intent, title, and message
 * <ErrorPanel resources={context.resources} errorType={ERROR_PANEL_TYPES.NO_PERMISSION} />
 * 
 * // With custom message override
 * <ErrorPanel
 *   resources={context.resources}
 *   errorType={ERROR_PANEL_TYPES.NO_PERMISSION}
 *   message="Custom permission error message"
 * />
 * 
 * // With all overrides
 * <ErrorPanel
 *   resources={context.resources}
 *   errorType={ERROR_PANEL_TYPES.NO_AUDIT_DATA}
 *   intent="warning"
 *   title="Custom Title"
 *   message="Custom message"
 * />
 * ```
 */
export const ErrorPanel: React.FC<IErrorPanelProps> = ({
    resources,
    errorType,
    intent: customIntent,
    title: customTitle,
    message: customMessage,
    maxWidth = '600px'
}) => {
    const config = getErrorConfig(errorType, resources);
    const intent = customIntent ?? config.intent;
    const title = customTitle ?? config.title;
    const message = customMessage ?? config.message;

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: intent === 'error' || intent === 'warning' ? '100vh' : 'auto',
            width: '100%'
        }}>
            <MessageBar
                intent={intent}
                style={{ maxWidth }}
            >
                <MessageBarBody>
                    <MessageBarTitle>{title}</MessageBarTitle>
                    {message}
                </MessageBarBody>
            </MessageBar>
        </div>
    );
};
