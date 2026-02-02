/**
 * Theme resolution utilities for renderer
 *
 * Provides utilities for the renderer to resolve theme colors when rendering components.
 * This allows components to automatically use theme colors when no explicit color is provided.
 */

import { getRendererTheme } from '../../theme/themeContext';
import { mergeComponentTheme } from '../../theme/resolveTheme';
import type { ThemeColor } from '../../theme/types';
import type { TextStyle, ViewStyle } from '../../types';

/**
 * Resolve theme color in renderer context
 *
 * Resolves a theme color reference to an actual color value using the current theme.
 * Used by the renderer when applying styles to components.
 *
 * @param color - Theme color reference or direct color value
 * @returns Resolved color value
 */
export function resolveColor(color: ThemeColor | string | undefined): string | undefined {
  if (!color) return undefined;

  const theme = getRendererTheme();

  // If it's a direct color value (not a theme key), return as-is
  if (typeof color === 'string' && !(color in theme.colors)) {
    return color;
  }

  // Resolve from theme colors
  const themeColor = theme.colors[color as keyof typeof theme.colors];
  return themeColor;
}

/**
 * Apply theme to component style
 *
 * Merges component default theme styles with provided styles,
 * resolving theme colors in the process.
 *
 * @param componentType - Type of component
 * @param style - Component style (may contain theme color references)
 * @returns Resolved style with theme colors applied
 */
export function applyThemeToStyle(
  componentType: 'text' | 'input' | 'button' | 'box' | 'selection',
  style?: TextStyle | ViewStyle
): TextStyle | ViewStyle | undefined {
  const theme = getRendererTheme();

  if (!style) {
    // Return component default theme if no style provided
    return mergeComponentTheme(componentType, undefined, theme);
  }

  // Merge component theme with provided style
  const merged = mergeComponentTheme(componentType, style as TextStyle & ViewStyle, theme);

  // If style has explicit colors, they override theme
  const resolved: TextStyle & ViewStyle = { ...merged, ...style };

  // Resolve any remaining theme color references
  if (resolved.color && typeof resolved.color === 'string' && resolved.color in theme.colors) {
    resolved.color = resolveColor(resolved.color);
  }

  if (
    resolved.backgroundColor &&
    typeof resolved.backgroundColor === 'string' &&
    resolved.backgroundColor in theme.colors
  ) {
    resolved.backgroundColor = resolveColor(resolved.backgroundColor);
  }

  if (
    resolved.borderColor &&
    typeof resolved.borderColor === 'string' &&
    resolved.borderColor in theme.colors
  ) {
    resolved.borderColor = resolveColor(resolved.borderColor);
  }

  if (
    resolved.borderBackgroundColor &&
    typeof resolved.borderBackgroundColor === 'string' &&
    resolved.borderBackgroundColor in theme.colors
  ) {
    resolved.borderBackgroundColor = resolveColor(resolved.borderBackgroundColor);
  }

  return resolved;
}
