/**
 * Hook for using theme-aware styles in components
 * 
 * Provides a hook that automatically resolves theme colors in styles.
 */

import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { resolveThemeStyle, mergeComponentTheme } from './resolveTheme';
import type { ThemeAwareStyle } from './types';
import type { TextStyle, ViewStyle } from '../types';

/**
 * Hook to resolve theme-aware styles
 * 
 * Automatically resolves theme color references in styles using the current theme.
 * Useful for components that want to use theme colors in their styles.
 * 
 * @param style - Theme-aware style object (can reference theme colors)
 * @returns Resolved style object with actual color values
 * 
 * @example
 * ```tsx
 * function ThemedComponent() {
 *   const style = useThemeStyle({
 *     color: 'text',
 *     backgroundColor: 'background',
 *     bold: true,
 *   });
 *   
 *   return <Text style={style}>Themed text</Text>;
 * }
 * ```
 */
export function useThemeStyle(
  style: ThemeAwareStyle | undefined
): TextStyle | ViewStyle | undefined {
  const { theme } = useTheme();
  
  return useMemo(() => {
    if (!style) return undefined;
    return resolveThemeStyle(style, theme);
  }, [style, theme]);
}

/**
 * Hook to get component theme with custom overrides
 * 
 * Merges component default theme styles with custom styles,
 * resolving theme colors in the process.
 * 
 * @param componentType - Type of component ('text', 'input', 'button', etc.)
 * @param customStyle - Custom style to merge with component theme
 * @returns Merged and resolved style
 * 
 * @example
 * ```tsx
 * function ThemedButton() {
 *   const style = useComponentTheme('button', { bold: true });
 *   
 *   return <Button style={style}>Themed Button</Button>;
 * }
 * ```
 */
export function useComponentTheme(
  componentType: keyof import('./types').Theme['components'],
  customStyle?: ThemeAwareStyle
): TextStyle | ViewStyle | undefined {
  const { theme } = useTheme();
  
  return useMemo(() => {
    return mergeComponentTheme(componentType, customStyle, theme);
  }, [componentType, customStyle, theme]);
}
