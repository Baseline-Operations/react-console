/**
 * StyleSheet API - React Native-like stylesheets for terminal/console
 * Integrated with the new class-based style system
 */

import type { ViewStyle, TextStyle, TerminalStyle } from '../types/styles';
import type { StyleMap } from '../nodes/base/types';

/**
 * StyleSheet API - React Native-like stylesheets for terminal components
 * 
 * Similar to React Native's StyleSheet API but adapted for terminal constraints.
 * Provides consistent styling API and style composition utilities.
 * Integrated with the new class-based style system.
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
    // Styles are now integrated with the new class-based style system
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
    const validStyles = styles.filter((s): s is T => s !== false && s !== null && s !== undefined);
    if (validStyles.length === 0) return null;
    
    // Merge styles with later styles overriding earlier ones
    return Object.assign({}, ...validStyles) as T;
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

/**
 * Convert StyleSheet style to StyleMap for use with new style system
 * This allows StyleSheet styles to work seamlessly with the new class-based nodes
 */
export function styleSheetToStyleMap(style: ViewStyle | TextStyle | TerminalStyle | null | undefined): StyleMap | null {
  if (!style) return null;
  
  // Convert to StyleMap format
  return style as StyleMap;
}
