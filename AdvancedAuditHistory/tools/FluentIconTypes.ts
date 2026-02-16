/**
 * FluentIconTypes - Type definitions for Fluent UI React Icons
 * 
 * @remarks
 * This module provides TypeScript type definitions for creating and working with
 * Fluent UI icons. These types are extracted from @fluentui/react-icons package.
 */

import * as React from 'react';

/**
 * Props interface for Fluent UI icon components
 */
export interface FluentIconsProps extends React.SVGAttributes<SVGElement> {
    primaryFill?: string;
    className?: string;
    filled?: boolean;
    title?: string;
}

/**
 * Type definition for a Fluent UI icon component
 */
export type FluentIcon = React.FC<FluentIconsProps>;

/**
 * Options for creating a custom Fluent UI icon
 * 
 * @property flipInRtl - Whether to flip the icon in right-to-left languages
 * @property color - Whether the icon supports color customization
 */
export interface CreateFluentIconOptions {
    flipInRtl?: boolean;
    color?: boolean;
}

/**
 * Creates a Fluent UI icon component from SVG path data
 * 
 * @param displayName - The display name for the icon component (for debugging)
 * @param width - The viewBox width of the SVG icon
 * @param pathsOrSvg - SVG path data as string array or raw SVG string
 * @param options - Optional configuration for icon behavior
 * @returns A React functional component that renders the icon
 * 
 * @example
 * ```typescript
 * const CustomIcon = createFluentIcon(
 *   'CustomIcon',
 *   '20',
 *   ['M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16z'],
 *   { flipInRtl: true }
 * );
 * ```
 */
export declare const createFluentIcon: (
    displayName: string,
    width: string,
    pathsOrSvg: string[] | string,
    options?: CreateFluentIconOptions
) => FluentIcon;
