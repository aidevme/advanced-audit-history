/**
 * Utility for creating Fluent UI-style icon components from SVG path data.
 *
 * @remarks
 * This helper mirrors the shape of `@fluentui/react-icons` so it can be used as a
 * drop-in replacement when you want to avoid importing the full icon package.
 * When the provided size is non-numeric (for example "1em"), the viewBox falls
 * back to 20 to keep SVG scaling predictable.
 *
 * @example
 * ```tsx
 * const RestoreIcon = createFluentIcon(
 *   'ArrowUndo16Regular',
 *   '16',
 *   ['M3 2.5a.5.5 0 0 1 1 0v3.84...'],
 *   { flipInRtl: true }
 * );
 * ```
 */
import * as React from 'react';

import type { CreateFluentIconOptions, FluentIcon, FluentIconsProps } from './FluentIconTypes';

const DEFAULT_VIEWBOX_SIZE = 20;

/**
 * Derives a numeric viewBox size from the provided width string.
 *
 * @param width - The width string passed to the icon factory
 * @returns Numeric viewBox size to use for the SVG
 */
const getViewBoxSize = (width: string): number => {
    const numericSize = Number(width);

    if (!Number.isNaN(numericSize) && numericSize > 0) {
        return numericSize;
    }

    return DEFAULT_VIEWBOX_SIZE;
};

/**
 * Resolves an optional RTL flip transform.
 *
 * @param size - Numeric viewBox size used for translation when flipping
 * @param options - Optional icon creation options
 * @returns SVG transform string or undefined when not flipping
 */
const getRtlTransform = (size: number, options?: CreateFluentIconOptions): string | undefined => {
    if (!(options?.flipInRtl ?? false)) {
        return undefined;
    }

    const direction = document?.documentElement?.dir ?? document?.dir ?? 'ltr';
    if (direction !== 'rtl') {
        return undefined;
    }

    return `translate(${size} 0) scale(-1 1)`;
};

/**
 * Creates a Fluent UI-style icon component from SVG path data.
 *
 * @param displayName - The display name for the icon component (for debugging)
 * @param width - The viewBox width of the SVG icon
 * @param pathsOrSvg - SVG path data as string array or raw SVG string
 * @param options - Optional configuration for icon behavior
 * @returns A React functional component that renders the icon
 */
export const createFluentIcon = (
    displayName: string,
    width: string,
    pathsOrSvg: string[] | string,
    options?: CreateFluentIconOptions
): FluentIcon => {
    const viewBoxSize = getViewBoxSize(width);

    const Icon: React.FC<FluentIconsProps> = ({ primaryFill, title, ...rest }) => {
        const fillColor = (options?.color ?? true) ? (primaryFill ?? 'currentColor') : 'currentColor';
        const transform = getRtlTransform(viewBoxSize, options);
        if (title) {
            return (
                <svg
                    viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
                    width="1em"
                    height="1em"
                    fill={fillColor}
                    focusable="false"
                    role="img"
                    {...rest}
                >
                    <title>{title}</title>
                    {Array.isArray(pathsOrSvg) ? (
                        <g transform={transform}>
                            {pathsOrSvg.map((path, index) => (
                                <path key={index} d={path} />
                            ))}
                        </g>
                    ) : (
                        <g transform={transform} dangerouslySetInnerHTML={{ __html: pathsOrSvg }} />
                    )}
                </svg>
            );
        }

        return (
            <svg
                viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
                width="1em"
                height="1em"
                fill={fillColor}
                aria-hidden="true"
                focusable="false"
                role="presentation"
                {...rest}
            >
                {Array.isArray(pathsOrSvg) ? (
                    <g transform={transform}>
                        {pathsOrSvg.map((path, index) => (
                            <path key={index} d={path} />
                        ))}
                    </g>
                ) : (
                    <g transform={transform} dangerouslySetInnerHTML={{ __html: pathsOrSvg }} />
                )}
            </svg>
        );
    };

    Icon.displayName = displayName;

    return Icon;
};
