/**
 * Core type definitions
 * Fundamental types used throughout React Console
 */

export type Color =
  | 'black'
  | 'red'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'magenta'
  | 'cyan'
  | 'white'
  | 'gray'
  | 'grey'
  | string; // Allow hex colors like '#FF0000' or RGB

export type TextStyleName = 'bold' | 'dim' | 'italic' | 'underline' | 'strikethrough' | 'inverse';

export type ResponsiveSize = number | string; // number for fixed pixels, string for percentage (e.g., "50%", "80vw", "80ch")

export type Position = 'relative' | 'absolute' | 'fixed' | 'sticky';

export type InputType = 'text' | 'string' | 'number' | 'radio' | 'checkbox' | 'dropdown' | 'list';

export type RenderMode = 'static' | 'interactive' | 'fullscreen';

export interface TerminalDimensions {
  columns: number;
  rows: number;
}
