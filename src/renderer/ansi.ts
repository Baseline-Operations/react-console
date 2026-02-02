/**
 * ANSI escape code utilities for terminal colors and styling
 */

import type { Color, StyleProps } from '../types';

const ANSI_RESET = '\x1b[0m';

// ANSI style codes (used via numeric values in applyStyles):
// Bold: 1, Dim: 2, Italic: 3, Underline: 4, Inverse: 7, Strikethrough: 9

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
  // Bright/light variants
  brightBlack: 100,
  brightRed: 101,
  brightGreen: 102,
  brightYellow: 103,
  brightBlue: 104,
  brightMagenta: 105,
  brightCyan: 106,
  brightWhite: 107,
  // Common aliases
  gray: 100, // brightBlack (dark gray)
  grey: 100, // alias for gray
  lightGray: 47, // white
  lightGrey: 47, // alias
  darkGray: 100, // brightBlack
  darkGrey: 100, // alias
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
 * // '\x1b[1;31mHello\x1b[0m' (combined codes)
 *
 * applyStyles('World', { backgroundColor: 'blue', underline: true });
 * // '\x1b[4;44mWorld\x1b[0m' (combined codes)
 * ```
 */
export function applyStyles(text: string, styles?: StyleProps): string {
  if (!styles) return text;

  // Collect numeric codes to combine into a single escape sequence
  // This produces \x1b[1;37;100m instead of \x1b[1m\x1b[37m\x1b[100m
  // which renders more cleanly in terminals
  const params: number[] = [];

  // Text styles (these are simple numeric codes)
  if (styles.bold) params.push(1);
  if (styles.dim) params.push(2);
  if (styles.italic) params.push(3);
  if (styles.underline) params.push(4);
  if (styles.strikethrough) params.push(9);
  if (styles.inverse) params.push(7);

  // For colors, we need to handle different formats
  // Simple colors (30-37, 40-47, 90-97, 100-107) can be combined
  // Extended colors (38;5;N or 38;2;R;G;B) need special handling
  const fgParams = getForegroundColorParams(styles.color);
  const bgParams = getBackgroundColorParams(styles.backgroundColor);

  if (params.length === 0 && fgParams.length === 0 && bgParams.length === 0) {
    return text;
  }

  // Combine all params into single escape sequence
  const allParams = [...params, ...fgParams, ...bgParams];
  const openCode = `\x1b[${allParams.join(';')}m`;
  return `${openCode}${text}${ANSI_RESET}`;
}

/**
 * Apply styles to text WITHOUT the trailing reset.
 * Useful for continuous style transitions where the next content
 * will apply its own styles (avoids [0m][XXm flicker in some terminals).
 */
export function applyStylesNoReset(text: string, styles?: StyleProps): string {
  if (!styles) return text;

  const params: number[] = [];

  if (styles.bold) params.push(1);
  if (styles.dim) params.push(2);
  if (styles.italic) params.push(3);
  if (styles.underline) params.push(4);
  if (styles.strikethrough) params.push(9);
  if (styles.inverse) params.push(7);

  const fgParams = getForegroundColorParams(styles.color);
  const bgParams = getBackgroundColorParams(styles.backgroundColor);

  if (params.length === 0 && fgParams.length === 0 && bgParams.length === 0) {
    return text;
  }

  const allParams = [...params, ...fgParams, ...bgParams];
  const openCode = `\x1b[${allParams.join(';')}m`;
  return `${openCode}${text}`;
}

/**
 * Get foreground color as numeric parameters (for combining in single escape sequence)
 */
function getForegroundColorParams(color?: Color): number[] {
  if (!color) return [];

  // Named colors
  if (color in ANSI_FG_COLORS) {
    return [ANSI_FG_COLORS[color]!];
  }

  // Hex colors -> 256 color
  if (color.startsWith('#')) {
    const code = hexToAnsi256(color);
    return [38, 5, code];
  }

  // RGB format
  const rgbMatch = color.match(/rgb\((\d+),(\d+),(\d+)\)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]!, 10);
    const g = parseInt(rgbMatch[2]!, 10);
    const b = parseInt(rgbMatch[3]!, 10);
    return [38, 2, r, g, b];
  }

  return [];
}

/**
 * Get background color as numeric parameters (for combining in single escape sequence)
 */
function getBackgroundColorParams(color?: Color): number[] {
  if (!color) return [];

  // Named colors
  if (color in ANSI_BG_COLORS) {
    return [ANSI_BG_COLORS[color]!];
  }

  // Hex colors -> 256 color
  if (color.startsWith('#')) {
    const code = hexToAnsi256(color);
    return [48, 5, code];
  }

  // RGB format
  const rgbMatch = color.match(/rgb\((\d+),(\d+),(\d+)\)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]!, 10);
    const g = parseInt(rgbMatch[2]!, 10);
    const b = parseInt(rgbMatch[3]!, 10);
    return [48, 2, r, g, b];
  }

  return [];
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
