/**
 * ANSI escape code utilities for terminal colors and styling
 */

import type { Color, StyleProps } from '../types';

const ANSI_RESET = '\x1b[0m';
const ANSI_BOLD = '\x1b[1m';
const ANSI_DIM = '\x1b[2m';
const ANSI_ITALIC = '\x1b[3m';
const ANSI_UNDERLINE = '\x1b[4m';
const ANSI_STRIKETHROUGH = '\x1b[9m';
const ANSI_INVERSE = '\x1b[7m';

const ANSI_FG_COLORS: Record<string, number> = {
  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37,
  gray: 90,
  grey: 90,
};

const ANSI_BG_COLORS: Record<string, number> = {
  black: 40,
  red: 41,
  green: 42,
  yellow: 43,
  blue: 44,
  magenta: 45,
  cyan: 46,
  white: 47,
};

/**
 * Convert hex color to ANSI 256 color code
 */
function hexToAnsi256(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  // Convert RGB to ANSI 256 color
  const r = Math.round((rgb.r / 255) * 5);
  const g = Math.round((rgb.g / 255) * 5);
  const b = Math.round((rgb.b / 255) * 5);
  return 16 + 36 * r + 6 * g + b;
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!match) return null;

  return {
    r: parseInt(match[1]!, 16),
    g: parseInt(match[2]!, 16),
    b: parseInt(match[3]!, 16),
  };
}

/**
 * Get ANSI foreground color code
 * 
 * Converts a color (named, hex, or RGB) to ANSI foreground color escape code.
 * Supports named colors (red, blue, etc.), hex colors (#FF0000), and RGB (rgb(255,0,0)).
 * 
 * @param color - Color to convert (named, hex, or RGB format)
 * @returns ANSI escape code for foreground color or empty string if invalid
 * 
 * @example
 * ```ts
 * getForegroundColorCode('red'); // '\x1b[31m'
 * getForegroundColorCode('#FF0000'); // '\x1b[38;5;...' (ANSI 256 color)
 * getForegroundColorCode('rgb(255,0,0)'); // '\x1b[38;2;255;0;0m' (RGB color)
 * ```
 */
export function getForegroundColorCode(color?: Color): string {
  if (!color) return '';

  // Named colors
  if (color in ANSI_FG_COLORS) {
    return `\x1b[${ANSI_FG_COLORS[color]}m`;
  }

  // Hex colors
  if (color.startsWith('#')) {
    const code = hexToAnsi256(color);
    return `\x1b[38;5;${code}m`;
  }

  // RGB format (rgb(255,0,0))
  const rgbMatch = color.match(/rgb\((\d+),(\d+),(\d+)\)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]!, 10);
    const g = parseInt(rgbMatch[2]!, 10);
    const b = parseInt(rgbMatch[3]!, 10);
    return `\x1b[38;2;${r};${g};${b}m`;
  }

  return '';
}

/**
 * Get ANSI background color code
 * 
 * Converts a color (named, hex, or RGB) to ANSI background color escape code.
 * Supports named colors (red, blue, etc.), hex colors (#FF0000), and RGB (rgb(255,0,0)).
 * 
 * @param color - Color to convert (named, hex, or RGB format)
 * @returns ANSI escape code for background color or empty string if invalid
 * 
 * @example
 * ```ts
 * getBackgroundColorCode('blue'); // '\x1b[44m'
 * getBackgroundColorCode('#0000FF'); // '\x1b[48;5;...' (ANSI 256 color)
 * ```
 */
export function getBackgroundColorCode(color?: Color): string {
  if (!color) return '';

  // Named colors
  if (color in ANSI_BG_COLORS) {
    return `\x1b[${ANSI_BG_COLORS[color]}m`;
  }

  // Hex colors
  if (color.startsWith('#')) {
    const code = hexToAnsi256(color);
    return `\x1b[48;5;${code}m`;
  }

  // RGB format
  const rgbMatch = color.match(/rgb\((\d+),(\d+),(\d+)\)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]!, 10);
    const g = parseInt(rgbMatch[2]!, 10);
    const b = parseInt(rgbMatch[3]!, 10);
    return `\x1b[48;2;${r};${g};${b}m`;
  }

  return '';
}

/**
 * Apply styles to text using ANSI escape codes
 * 
 * Applies multiple text styles and colors to text using ANSI escape codes.
 * Supports text styles (bold, italic, underline, etc.) and colors (foreground, background).
 * Automatically resets styles at the end of text.
 * 
 * @param text - Text to style
 * @param styles - Style properties to apply (color, backgroundColor, bold, italic, etc.)
 * @returns Styled text with ANSI escape codes
 * 
 * @example
 * ```ts
 * applyStyles('Hello', { color: 'red', bold: true });
 * // '\x1b[31m\x1b[1mHello\x1b[0m'
 * 
 * applyStyles('World', { backgroundColor: 'blue', underline: true });
 * // '\x1b[44m\x1b[4mWorld\x1b[0m'
 * ```
 */
export function applyStyles(text: string, styles?: StyleProps): string {
  if (!styles) return text;

  const codes: string[] = [];

  // Text styles
  if (styles.bold) codes.push(ANSI_BOLD);
  if (styles.dim) codes.push(ANSI_DIM);
  if (styles.italic) codes.push(ANSI_ITALIC);
  if (styles.underline) codes.push(ANSI_UNDERLINE);
  if (styles.strikethrough) codes.push(ANSI_STRIKETHROUGH);
  if (styles.inverse) codes.push(ANSI_INVERSE);

  // Colors
  const fgColor = getForegroundColorCode(styles.color);
  if (fgColor) codes.push(fgColor);

  const bgColor = getBackgroundColorCode(styles.backgroundColor);
  if (bgColor) codes.push(bgColor);

  if (codes.length === 0) return text;

  const openCodes = codes.join('');
  return `${openCodes}${text}${ANSI_RESET}`;
}

/**
 * Remove ANSI codes from text
 * 
 * Strips all ANSI escape codes from text, returning only visible characters.
 * Useful for measuring text width or comparing text without styling.
 * 
 * @param text - Text with ANSI escape codes
 * @returns Text without ANSI escape codes
 * 
 * @example
 * ```ts
 * stripAnsiCodes('\x1b[31mRed\x1b[0m'); // 'Red'
 * stripAnsiCodes('Normal'); // 'Normal'
 * ```
 */
export function stripAnsiCodes(text: string): string {
  // eslint-disable-next-line no-control-regex
  return text.replace(/\x1b\[[0-9;]*m/g, '');
}

/**
 * Get visible length of text (without ANSI codes)
 * 
 * Returns the visible character count of text, excluding ANSI escape codes.
 * Useful for layout calculations where ANSI codes shouldn't affect width.
 * 
 * @param text - Text with ANSI escape codes
 * @returns Visible character count (ANSI codes excluded)
 * 
 * @example
 * ```ts
 * getVisibleLength('Hello'); // 5
 * getVisibleLength('\x1b[31mRed\x1b[0m'); // 3 (ANSI codes excluded)
 * ```
 */
export function getVisibleLength(text: string): number {
  return stripAnsiCodes(text).length;
}

/**
 * Clear screen
 * 
 * Returns ANSI escape code to clear the entire terminal screen.
 * 
 * @returns ANSI escape code for clearing screen
 * 
 * @example
 * ```ts
 * process.stdout.write(clearScreen()); // Clears screen
 * ```
 */
export function clearScreen(): string {
  return '\x1b[2J';
}

/**
 * Move cursor to position
 * 
 * Returns ANSI escape code to move cursor to specified position.
 * Coordinates are converted from 0-based to 1-based (ANSI format).
 * 
 * @param x - X position (0-based, left to right)
 * @param y - Y position (0-based, top to bottom)
 * @returns ANSI escape code for cursor movement
 * 
 * @example
 * ```ts
 * process.stdout.write(moveCursor(10, 5)); // Moves cursor to column 11, row 6
 * ```
 */
export function moveCursor(x: number, y: number): string {
  return `\x1b[${y + 1};${x + 1}H`;
}

/**
 * Hide cursor
 * 
 * Returns ANSI escape code to hide the terminal cursor.
 * 
 * @returns ANSI escape code for hiding cursor
 * 
 * @example
 * ```ts
 * process.stdout.write(hideCursor()); // Hides cursor
 * ```
 */
export function hideCursor(): string {
  return '\x1b[?25l';
}

/**
 * Show cursor
 * 
 * Returns ANSI escape code to show the terminal cursor.
 * 
 * @returns ANSI escape code for showing cursor
 * 
 * @example
 * ```ts
 * process.stdout.write(showCursor()); // Shows cursor
 * ```
 */
export function showCursor(): string {
  return '\x1b[?25h';
}

/**
 * Clear line
 * 
 * Returns ANSI escape code to clear from cursor to end of line.
 * 
 * @returns ANSI escape code for clearing line
 * 
 * @example
 * ```ts
 * process.stdout.write(clearLine()); // Clears from cursor to end of line
 * ```
 */
export function clearLine(): string {
  return '\x1b[K';
}
