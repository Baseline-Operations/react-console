/**
 * Responsive utilities for terminal-based sizing
 * Supports percentage-based widths and heights using terminal dimensions
 *
 * Utilities for resolving responsive sizes (percentages, viewport units, character units)
 * to fixed pixel values based on current terminal dimensions.
 */

import { getTerminalDimensions } from './terminal';

/**
 * Responsive size type
 * Number for fixed size, string for responsive size (e.g., "50%", "80vw", "80ch")
 */
export type ResponsiveSize = number | string;

/**
 * Resolve a responsive size to a pixel value based on terminal dimensions
 *
 * Supports multiple size formats:
 * - Fixed numbers: `80` (80 characters)
 * - Percentages: `"50%"` (50% of terminal width/height)
 * - Viewport units: `"80vw"` (80% width), `"50vh"` (50% height)
 * - Character units: `"80ch"` (80 characters, for width only)
 *
 * @param size - Fixed number or percentage/viewport/character string
 * @param dimension - 'width' or 'height' to use appropriate terminal dimension
 * @param maxSize - Optional maximum size constraint
 * @returns Resolved pixel value or undefined if invalid format
 *
 * @example
 * ```ts
 * resolveSize(80, 'width'); // 80
 * resolveSize('50%', 'width'); // 50% of terminal width
 * resolveSize('80vw', 'width'); // 80% of terminal width
 * resolveSize('80ch', 'width'); // 80 characters
 * ```
 */
export function resolveSize(
  size: ResponsiveSize | undefined,
  dimension: 'width' | 'height',
  maxSize?: number
): number | undefined {
  if (size === undefined) return undefined;

  if (typeof size === 'number') {
    // Fixed size
    return maxSize !== undefined ? Math.min(size, maxSize) : size;
  }

  if (typeof size === 'string') {
    // Percentage or other string format
    const trimmed = size.trim();

    // Parse percentage (e.g., "50%", "100%")
    if (trimmed.endsWith('%')) {
      const percent = parseFloat(trimmed.slice(0, -1));
      if (!isNaN(percent)) {
        const dims = getTerminalDimensions();
        const baseSize = dimension === 'width' ? dims.columns : dims.rows;
        const calculated = Math.floor((percent / 100) * baseSize);
        return maxSize !== undefined ? Math.min(calculated, maxSize) : calculated;
      }
    }

    // Parse viewport units (e.g., "80vw", "50vh") - treat as percentage
    if (trimmed.endsWith('vw') || trimmed.endsWith('vh')) {
      const percent = parseFloat(trimmed.slice(0, -2));
      if (!isNaN(percent)) {
        const dims = getTerminalDimensions();
        const baseSize = dimension === 'width' ? dims.columns : dims.rows;
        const calculated = Math.floor((percent / 100) * baseSize);
        return maxSize !== undefined ? Math.min(calculated, maxSize) : calculated;
      }
    }

    // Parse character units (e.g., "80ch") - use columns for width
    if (trimmed.endsWith('ch')) {
      const chars = parseFloat(trimmed.slice(0, -2));
      if (!isNaN(chars)) {
        const calculated = Math.floor(chars);
        return maxSize !== undefined ? Math.min(calculated, maxSize) : calculated;
      }
    }

    // Invalid format, return undefined
    return undefined;
  }

  return undefined;
}

/**
 * Get responsive width value
 *
 * Convenience function for resolving width sizes. Same as `resolveSize(width, 'width', maxWidth)`.
 *
 * @param width - Fixed number or responsive string (e.g., "50%", "80vw", "80ch")
 * @param maxWidth - Optional maximum width constraint
 * @returns Resolved width in characters or undefined if invalid
 *
 * @example
 * ```ts
 * resolveWidth(80); // 80
 * resolveWidth('50%'); // 50% of terminal width
 * resolveWidth('80vw'); // 80% of terminal width
 * ```
 */
export function resolveWidth(
  width: ResponsiveSize | undefined,
  maxWidth?: number
): number | undefined {
  return resolveSize(width, 'width', maxWidth);
}

/**
 * Get responsive height value
 *
 * Convenience function for resolving height sizes. Same as `resolveSize(height, 'height', maxHeight)`.
 *
 * @param height - Fixed number or responsive string (e.g., "50%", "50vh")
 * @param maxHeight - Optional maximum height constraint
 * @returns Resolved height in characters or undefined if invalid
 *
 * @example
 * ```ts
 * resolveHeight(24); // 24
 * resolveHeight('50%'); // 50% of terminal height
 * resolveHeight('50vh'); // 50% of terminal height
 * ```
 */
export function resolveHeight(
  height: ResponsiveSize | undefined,
  maxHeight?: number
): number | undefined {
  return resolveSize(height, 'height', maxHeight);
}
