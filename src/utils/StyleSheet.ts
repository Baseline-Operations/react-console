/**
 * StyleSheet API - React Native-like stylesheets for terminal/console
 * Similar to React Native StyleSheet but adapted for terminal constraints
 */

import type { ViewStyle, TextStyle, TerminalStyle } from '../types';

/**
 * StyleSheet API - React Native-like stylesheets for terminal components
 * 
 * Similar to React Native's StyleSheet API but adapted for terminal constraints.
 * Provides consistent styling API and style composition utilities.
 * 
 * @example
 * ```tsx
 * const styles = StyleSheet.create({
 *   container: { padding: 2, border: 'single' },
 *   text: { color: 'cyan', bold: true },
 * });
 * 
 * <Box style={styles.container}>
 *   <Text style={styles.text}>Styled Text</Text>
 * </Box>
 * ```
 */
export const StyleSheet = {
  /**
   * Create a stylesheet from style definitions
   * Similar to React Native's StyleSheet.create()
   * 
   * @param styles - Object mapping style names to style objects
   * @returns The same styles object (for API consistency)
   * 
   * @example
   * ```tsx
   * const styles = StyleSheet.create({
   *   box: { padding: 2, backgroundColor: 'blue' },
   *   text: { color: 'white', bold: true },
   * });
   * ```
   */
  create<T extends Record<string, ViewStyle | TextStyle | TerminalStyle>>(
    styles: T
  ): T {
    // In terminal, we don't need to optimize like React Native does
    // But we keep the API consistent for familiarity
    return styles;
  },

  /**
   * Flatten an array of styles (similar to React Native)
   * Merges multiple styles into one, with later styles overriding earlier ones
   * 
   * @param styles - Array of styles to flatten (can include false, null, undefined)
   * @returns Merged style object or null if no valid styles
   * 
   * @example
   * ```tsx
   * const merged = StyleSheet.flatten([
   *   baseStyle,
   *   condition && conditionalStyle,
   *   overrideStyle,
   * ]);
   * ```
   */
  flatten<T extends ViewStyle | TextStyle | TerminalStyle>(
    styles: (T | false | null | undefined)[]
  ): T | null {
    const validStyles = styles.filter(
      (style): style is T => style !== false && style !== null && style !== undefined
    );
    
    if (validStyles.length === 0) return null;
    if (validStyles.length === 1) return validStyles[0]!;

    // Merge styles, later ones override earlier ones
    return validStyles.reduce((merged, style) => ({ ...merged, ...style }), {} as T);
  },

  /**
   * Compose styles (similar to React Native)
   * Alias for flatten - merges multiple styles into one
   * 
   * @param styles - Variadic arguments of styles to compose
   * @returns Merged style object or null if no valid styles
   * 
   * @example
   * ```tsx
   * const composed = StyleSheet.compose(
   *   baseStyle,
   *   variantStyle,
   *   overrideStyle
   * );
   * ```
   */
  compose<T extends ViewStyle | TextStyle | TerminalStyle>(
    ...styles: (T | false | null | undefined)[]
  ): T | null {
    return StyleSheet.flatten(styles);
  },
};
