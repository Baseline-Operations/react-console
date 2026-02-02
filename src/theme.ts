/**
 * Theme System
 * Convenient exports for theme functionality
 *
 * @example
 * ```tsx
 * import { ThemeProvider, useTheme, defaultTheme } from 'react-console/theme';
 * ```
 */

// Theme types
export type {
  Theme,
  ThemeColors,
  ComponentTheme,
  ThemeColor,
  ThemeAwareStyle,
} from './theme/index';

// Theme utilities
export {
  defaultTheme,
  darkTheme,
  lightTheme,
  resolveThemeColor,
  resolveThemeStyle,
  mergeComponentTheme,
  useThemeStyle,
  useComponentTheme,
} from './theme/index';

// Theme context
export { ThemeProvider, useTheme, useThemeColors } from './context/ThemeContext';
