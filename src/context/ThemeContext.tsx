/**
 * Theme Context Provider
 *
 * Provides theme context for components that need theme-aware styling.
 * Allows components to use theme colors and styles automatically.
 */

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Theme } from '../theme/types';
import { defaultTheme } from '../theme/defaultTheme';
import { setRendererTheme } from '../theme/themeContext';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colors: Theme['colors'];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Theme Provider
 *
 * Provides theme context to child components.
 * Allows components to access theme colors and styles.
 *
 * @param children - Child components
 * @param initialTheme - Initial theme (defaults to defaultTheme)
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <ThemeProvider>
 *       <ThemedComponent />
 *     </ThemeProvider>
 *   );
 * }
 *
 * // With custom theme
 * function App() {
 *   return (
 *     <ThemeProvider initialTheme={customTheme}>
 *       <ThemedComponent />
 *     </ThemeProvider>
 *   );
 * }
 * ```
 */
export function ThemeProvider({
  children,
  initialTheme = defaultTheme,
}: {
  children: ReactNode;
  initialTheme?: Theme;
}): React.JSX.Element {
  const [theme, setThemeState] = useState<Theme>(initialTheme);

  // Update renderer theme when theme changes
  useEffect(() => {
    setRendererTheme(theme);
  }, [theme]);

  const setTheme = (newTheme: Theme): void => {
    setThemeState(newTheme);
    setRendererTheme(newTheme);
  };

  const value: ThemeContextValue = {
    theme,
    setTheme,
    colors: theme.colors,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Hook to use theme context
 *
 * Returns theme context from the nearest ThemeProvider.
 *
 * @returns Theme context value
 * @throws Error if used outside ThemeProvider
 *
 * @example
 * ```tsx
 * function ThemedComponent() {
 *   const { theme, colors, setTheme } = useTheme();
 *
 *   return (
 *     <View>
 *       <Text color={colors.text}>Themed text</Text>
 *       <Button onClick={() => setTheme(darkTheme)}>
 *         Switch Theme
 *       </Button>
 *     </View>
 *   );
 * }
 * ```
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

/**
 * Hook to use theme colors
 *
 * Convenience hook that returns just the theme colors.
 *
 * @returns Theme colors object
 *
 * @example
 * ```tsx
 * function ThemedComponent() {
 *   const colors = useThemeColors();
 *
 *   return (
 *     <Text color={colors.text}>Themed text</Text>
 *   );
 * }
 * ```
 */
export function useThemeColors(): Theme['colors'] {
  const { colors } = useTheme();
  return colors;
}
