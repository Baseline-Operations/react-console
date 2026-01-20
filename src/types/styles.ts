/**
 * Style-related type definitions
 * Types for styling components (CSS-like API)
 */

import type { Color, ResponsiveSize, Position } from './core';

export interface StyleProps {
  color?: Color;
  backgroundColor?: Color;
  bold?: boolean;
  dim?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  inverse?: boolean;
  className?: string | string[]; // Class names for style libraries (e.g., Tailwind-like)
}

export interface LayoutProps {
  padding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  margin?: number | { top?: number; right?: number; bottom?: number; left?: number };
  width?: ResponsiveSize; // Fixed number or percentage/unit string (e.g., 80, "50%", "80vw", "80ch")
  height?: ResponsiveSize; // Fixed number or percentage/unit string (e.g., 24, "50%", "50vh")
}

/**
 * ViewStyle - CSS-like styles for View/Box components (similar to React Native)
 */
export interface ViewStyle extends StyleProps, LayoutProps {
  // Positioning
  position?: Position;
  top?: number | string; // number for characters, string for responsive (e.g., "10%", "5vh")
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
  zIndex?: number;

  // Flexbox properties
  display?: 'block' | 'flex' | 'grid' | 'none';
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  alignContent?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'space-between' | 'space-around';
  gap?: number | { row?: number; column?: number }; // Gap between flex items
  rowGap?: number;
  columnGap?: number;
  flex?: number;
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: ResponsiveSize;
  order?: number; // Visual order of flex items

  // Alignment
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';

  // Grid properties
  gridTemplateColumns?: ResponsiveSize[] | string; // Array of sizes or template string
  gridTemplateRows?: ResponsiveSize[] | string;
  gridAutoColumns?: ResponsiveSize | ResponsiveSize[]; // Size for auto-generated columns
  gridAutoRows?: ResponsiveSize | ResponsiveSize[]; // Size for auto-generated rows
  gridAutoFlow?: 'row' | 'column' | 'row dense' | 'column dense'; // Auto-placement algorithm
  gridColumn?: number | string; // Grid item placement
  gridRow?: number | string;
  gridColumnStart?: number | string;
  gridColumnEnd?: number | string;
  gridRowStart?: number | string;
  gridRowEnd?: number | string;
  gridArea?: string; // Named grid area
  gridGap?: number | { row?: number; column?: number }; // Gap between grid items (alias for gap)
  gridRowGap?: number; // Alias for rowGap
  gridColumnGap?: number; // Alias for columnGap
  justifyItems?: 'start' | 'end' | 'center' | 'stretch';
  justifySelf?: 'start' | 'end' | 'center' | 'stretch';
  placeItems?: string; // Shorthand for align-items and justify-items
  placeSelf?: string; // Shorthand for align-self and justify-self

  // Overflow
  overflow?: 'visible' | 'hidden' | 'scroll';
  overflowX?: 'visible' | 'hidden' | 'scroll';
  overflowY?: 'visible' | 'hidden' | 'scroll';

  // Borders
  border?: boolean | {
    top?: boolean;
    right?: boolean;
    bottom?: boolean;
    left?: boolean;
  };
  borderColor?: Color;
  borderStyle?: 'single' | 'double' | 'thick' | 'dashed' | 'dotted';
  borderWidth?: number | {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  borderRadius?: number; // Character-based border radius (limited support in terminals)
}

/**
 * TextStyle - CSS-like styles for Text components (similar to React Native)
 */
export interface TextStyle extends StyleProps {
  // Text alignment (for multi-line text)
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  
  // Text decoration (already in StyleProps but keeping for CSS-like API)
  textDecoration?: 'none' | 'underline' | 'line-through';
  
  // Letter spacing (character spacing in terminal)
  letterSpacing?: number;
  
  // Line height (in lines)
  lineHeight?: number;
}

/**
 * TerminalStyle - Base style type that can be used by any component
 */
export type TerminalStyle = ViewStyle | TextStyle;
