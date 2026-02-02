/**
 * Theme system exports
 *
 * Central export point for theme-related functionality.
 */

export type { Theme, ThemeColors, ComponentTheme, ThemeColor, ThemeAwareStyle } from './types';

export { defaultTheme, darkTheme, lightTheme } from './defaultTheme';

export { resolveThemeColor, resolveThemeStyle, mergeComponentTheme } from './resolveTheme';

export { setRendererTheme, getRendererTheme } from './themeContext';

export { useThemeStyle, useComponentTheme } from './useThemeStyle';
