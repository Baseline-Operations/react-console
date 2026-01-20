/**
 * Theme type definitions for React Console
 * 
 * Defines the structure of themes and theme-aware style properties.
 */

import type { Color, TextStyle, ViewStyle } from '../types';

/**
 * Theme color palette
 * 
 * Defines all colors used in the theme system.
 * Colors can be named ANSI colors or hex/RGB values.
 */
export interface ThemeColors {
  /** Primary text color */
  text: Color;
  /** Secondary/muted text color */
  textSecondary: Color;
  /** Disabled text color */
  textDisabled: Color;
  /** Error text color */
  textError: Color;
  /** Success text color */
  textSuccess: Color;
  /** Warning text color */
  textWarning: Color;
  /** Info text color */
  textInfo: Color;
  
  /** Primary background color */
  background: Color;
  /** Secondary background color */
  backgroundSecondary: Color;
  /** Disabled background color */
  backgroundDisabled: Color;
  /** Error background color */
  backgroundError: Color;
  /** Success background color */
  backgroundSuccess: Color;
  /** Warning background color */
  backgroundWarning: Color;
  /** Info background color */
  backgroundInfo: Color;
  
  /** Border color */
  border: Color;
  /** Focused border color */
  borderFocused: Color;
  /** Disabled border color */
  borderDisabled: Color;
  
  /** Primary action color (for buttons, links) */
  primary: Color;
  /** Primary action background */
  primaryBackground: Color;
  /** Secondary action color */
  secondary: Color;
  /** Secondary action background */
  secondaryBackground: Color;
}

/**
 * Component-specific theme styles
 * 
 * Defines default styles for specific component types.
 */
export interface ComponentTheme {
  /** Default Text component styles */
  text: Partial<TextStyle>;
  /** Default Input component styles */
  input: Partial<TextStyle & ViewStyle>;
  /** Default Button component styles */
  button: Partial<TextStyle & ViewStyle>;
  /** Default Box/View component styles */
  box: Partial<ViewStyle>;
  /** Default selection component styles (Radio, Checkbox, Dropdown, List) */
  selection: Partial<TextStyle & ViewStyle>;
}

/**
 * Complete theme definition
 * 
 * Contains all theme values including colors, component styles, and text styles.
 */
export interface Theme {
  /** Theme name */
  name: string;
  /** Color palette */
  colors: ThemeColors;
  /** Component-specific styles */
  components: ComponentTheme;
  /** Global text styles */
  textStyles?: {
    /** Heading text style */
    heading?: Partial<TextStyle>;
    /** Body text style */
    body?: Partial<TextStyle>;
    /** Caption text style */
    caption?: Partial<TextStyle>;
    /** Code text style */
    code?: Partial<TextStyle>;
  };
}

/**
 * Theme-aware style properties
 * 
 * Allows using theme color references in styles.
 * Theme colors are resolved at render time.
 */
export type ThemeColor = keyof ThemeColors | Color;

/**
 * Theme-aware style that can reference theme colors
 */
export interface ThemeAwareStyle extends Omit<ViewStyle, 'color' | 'backgroundColor'>, Omit<TextStyle, 'color' | 'backgroundColor'> {
  /** Theme-aware color (can reference theme.colors.*) */
  color?: ThemeColor;
  /** Theme-aware background color (can reference theme.colors.*) */
  backgroundColor?: ThemeColor;
}
