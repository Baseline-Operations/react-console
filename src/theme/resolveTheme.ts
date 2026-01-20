/**
 * Theme resolution utilities
 * 
 * Functions to resolve theme color references to actual color values.
 */

import type { Theme, ThemeColor, ThemeAwareStyle } from './types';
import type { TextStyle, ViewStyle } from '../types';

/**
 * Resolve a theme color reference to an actual color value
 * 
 * If the color is a theme color key (e.g., 'text', 'primary'), resolves it from the theme.
 * Otherwise, returns the color as-is (for direct color values like 'red', '#FF0000').
 * 
 * @param color - Theme color reference or direct color value
 * @param theme - Current theme
 * @returns Resolved color value
 * 
 * @example
 * ```ts
 * resolveThemeColor('text', theme); // 'white' (from theme.colors.text)
 * resolveThemeColor('red', theme); // 'red' (direct color value)
 * resolveThemeColor('#FF0000', theme); // '#FF0000' (direct hex color)
 * ```
 */
export function resolveThemeColor(color: ThemeColor | undefined, theme: Theme): string | undefined {
  if (!color) return undefined;
  
  // If it's a direct color value (not a theme key), return as-is
  if (typeof color === 'string' && !(color in theme.colors)) {
    return color;
  }
  
  // Resolve from theme colors
  const themeColor = theme.colors[color as keyof Theme['colors']];
  return themeColor;
}

/**
 * Resolve theme-aware style to regular style
 * 
 * Converts a ThemeAwareStyle (which can reference theme colors) to a regular
 * TextStyle or ViewStyle with resolved color values.
 * 
 * @param style - Theme-aware style object
 * @param theme - Current theme
 * @returns Resolved style object
 * 
 * @example
 * ```ts
 * const themeStyle: ThemeAwareStyle = {
 *   color: 'text',
 *   backgroundColor: 'background',
 *   bold: true,
 * };
 * 
 * const resolved = resolveThemeStyle(themeStyle, theme);
 * // { color: 'white', backgroundColor: 'black', bold: true }
 * ```
 */
export function resolveThemeStyle(
  style: ThemeAwareStyle | undefined,
  theme: Theme
): TextStyle | ViewStyle | undefined {
  if (!style) return undefined;
  
  const resolved: TextStyle & ViewStyle = { ...style };
  
  // Resolve color references
  if (style.color !== undefined) {
    resolved.color = resolveThemeColor(style.color, theme);
  }
  
  if (style.backgroundColor !== undefined) {
    resolved.backgroundColor = resolveThemeColor(style.backgroundColor, theme);
  }
  
  // Resolve border color if it's a theme reference
  if (typeof style.borderColor === 'string' && style.borderColor in theme.colors) {
    resolved.borderColor = resolveThemeColor(style.borderColor as ThemeColor, theme);
  }
  
  return resolved;
}

/**
 * Merge component theme with custom style
 * 
 * Merges component default styles from theme with custom styles,
 * resolving theme color references in the process.
 * 
 * @param componentType - Type of component ('text', 'input', 'button', etc.)
 * @param customStyle - Custom style to merge
 * @param theme - Current theme
 * @returns Merged and resolved style
 * 
 * @example
 * ```ts
 * const style = mergeComponentTheme('button', { bold: true }, theme);
 * // Merges theme.components.button with custom style, resolves colors
 * ```
 */
export function mergeComponentTheme(
  componentType: keyof Theme['components'],
  customStyle: ThemeAwareStyle | undefined,
  theme: Theme
): TextStyle | ViewStyle | undefined {
  const componentTheme = theme.components[componentType];
  if (!componentTheme && !customStyle) return undefined;
  
  // Merge component theme with custom style
  const merged = {
    ...componentTheme,
    ...customStyle,
  };
  
  // Resolve theme colors
  return resolveThemeStyle(merged as ThemeAwareStyle, theme);
}
