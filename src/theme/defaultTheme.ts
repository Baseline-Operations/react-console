/**
 * Default theme for React Console
 * 
 * Provides a sensible default theme with good contrast and readability.
 */

import type { Theme } from './types';

/**
 * Default theme - Light terminal theme with good contrast
 * 
 * Uses standard ANSI colors with good readability.
 * Suitable for most terminal applications.
 */
export const defaultTheme: Theme = {
  name: 'default',
  colors: {
    // Text colors
    text: 'white',
    textSecondary: 'gray',
    textDisabled: 'gray',
    textError: 'red',
    textSuccess: 'green',
    textWarning: 'yellow',
    textInfo: 'cyan',
    
    // Background colors
    background: 'black',
    backgroundSecondary: 'black',
    backgroundDisabled: 'black',
    backgroundError: 'black',
    backgroundSuccess: 'black',
    backgroundWarning: 'black',
    backgroundInfo: 'black',
    
    // Border colors
    border: 'gray',
    borderFocused: 'cyan',
    borderDisabled: 'gray',
    
    // Action colors
    primary: 'cyan',
    primaryBackground: 'black',
    secondary: 'blue',
    secondaryBackground: 'black',
  },
  components: {
    text: {
      color: 'text',
    },
    input: {
      color: 'text',
      backgroundColor: 'background',
      border: true,
      borderColor: 'border',
    },
    button: {
      color: 'primary',
      backgroundColor: 'primaryBackground',
      border: true,
      borderColor: 'primary',
    },
    box: {
      backgroundColor: 'background',
      border: false,
    },
    selection: {
      color: 'text',
      backgroundColor: 'background',
    },
  },
  textStyles: {
    heading: {
      color: 'text',
      bold: true,
    },
    body: {
      color: 'text',
    },
    caption: {
      color: 'textSecondary',
      dim: true,
    },
    code: {
      color: 'text',
      backgroundColor: 'backgroundSecondary',
    },
  },
};

/**
 * Dark theme variant
 * 
 * Dark theme optimized for dark terminal backgrounds.
 */
export const darkTheme: Theme = {
  ...defaultTheme,
  name: 'dark',
  colors: {
    ...defaultTheme.colors,
    // Dark theme uses same colors but can be customized
  },
};

/**
 * Light theme variant
 * 
 * Light theme optimized for light terminal backgrounds.
 * Note: Most terminals have dark backgrounds, so this may not render well.
 */
export const lightTheme: Theme = {
  name: 'light',
  colors: {
    // Text colors (inverted for light background)
    text: 'black',
    textSecondary: 'gray',
    textDisabled: 'gray',
    textError: 'red',
    textSuccess: 'green',
    textWarning: 'yellow',
    textInfo: 'blue',
    
    // Background colors
    background: 'white',
    backgroundSecondary: 'white',
    backgroundDisabled: 'white',
    backgroundError: 'white',
    backgroundSuccess: 'white',
    backgroundWarning: 'white',
    backgroundInfo: 'white',
    
    // Border colors
    border: 'gray',
    borderFocused: 'blue',
    borderDisabled: 'gray',
    
    // Action colors
    primary: 'blue',
    primaryBackground: 'white',
    secondary: 'cyan',
    secondaryBackground: 'white',
  },
  components: {
    text: {
      color: 'text',
    },
    input: {
      color: 'text',
      backgroundColor: 'background',
      border: true,
      borderColor: 'border',
    },
    button: {
      color: 'primary',
      backgroundColor: 'primaryBackground',
      border: true,
      borderColor: 'primary',
    },
    box: {
      backgroundColor: 'background',
      border: false,
    },
    selection: {
      color: 'text',
      backgroundColor: 'background',
    },
  },
  textStyles: {
    heading: {
      color: 'text',
      bold: true,
    },
    body: {
      color: 'text',
    },
    caption: {
      color: 'textSecondary',
      dim: true,
    },
    code: {
      color: 'text',
      backgroundColor: 'backgroundSecondary',
    },
  },
};
