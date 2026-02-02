/**
 * ANSIGenerator - Converts cells to ANSI escape codes
 *
 * Handles efficient generation of ANSI codes with minimal escape sequences
 * by tracking state and only emitting changes.
 */

import { Cell, createEmptyCell } from './types';

/**
 * ANSI color codes
 */
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
  brightBlack: 90,
  brightRed: 91,
  brightGreen: 92,
  brightYellow: 93,
  brightBlue: 94,
  brightMagenta: 95,
  brightCyan: 96,
  brightWhite: 97,
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
  gray: 100,
  grey: 100,
  brightBlack: 100,
  brightRed: 101,
  brightGreen: 102,
  brightYellow: 103,
  brightBlue: 104,
  brightMagenta: 105,
  brightCyan: 106,
  brightWhite: 107,
};

/**
 * ANSIGenerator - Efficient ANSI code generation
 */
export class ANSIGenerator {
  /**
   * Convert a cell to ANSI escape codes + character
   */
  cellToANSI(cell: Cell): string {
    const codes = this.getCellCodes(cell);

    if (codes.length === 0) {
      return cell.char || ' ';
    }

    return `\x1b[${codes.join(';')}m${cell.char || ' '}`;
  }

  /**
   * Get ANSI codes for a cell (without escape sequence wrapper)
   */
  private getCellCodes(cell: Cell): number[] {
    const codes: number[] = [];

    // Text styles
    if (cell.bold) codes.push(1);
    if (cell.dim) codes.push(2);
    if (cell.italic) codes.push(3);
    if (cell.underline) codes.push(4);
    if (cell.inverse) codes.push(7);
    if (cell.strikethrough) codes.push(9);

    // Foreground color
    const fgCodes = this.getColorCodes(cell.foreground, false);
    codes.push(...fgCodes);

    // Background color
    const bgCodes = this.getColorCodes(cell.background, true);
    codes.push(...bgCodes);

    return codes;
  }

  /**
   * Get color codes for a color value
   */
  private getColorCodes(color: string | null, isBackground: boolean): number[] {
    if (!color) return [];

    const colorMap = isBackground ? ANSI_BG_COLORS : ANSI_FG_COLORS;

    // Named color
    if (color in colorMap) {
      return [colorMap[color]!];
    }

    // Hex color (#RRGGBB or #RGB)
    if (color.startsWith('#')) {
      const rgb = this.hexToRgb(color);
      if (rgb) {
        // Use 256-color mode for compatibility
        const code256 = this.rgbTo256(rgb.r, rgb.g, rgb.b);
        return isBackground ? [48, 5, code256] : [38, 5, code256];
      }
    }

    // RGB format (rgb(r,g,b))
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]!, 10);
      const g = parseInt(rgbMatch[2]!, 10);
      const b = parseInt(rgbMatch[3]!, 10);
      // Use true color (24-bit)
      return isBackground ? [48, 2, r, g, b] : [38, 2, r, g, b];
    }

    return [];
  }

  /**
   * Convert hex color to RGB
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    // Handle both #RGB and #RRGGBB formats
    const shortMatch = hex.match(/^#([a-f\d])([a-f\d])([a-f\d])$/i);
    if (shortMatch) {
      return {
        r: parseInt(shortMatch[1]! + shortMatch[1]!, 16),
        g: parseInt(shortMatch[2]! + shortMatch[2]!, 16),
        b: parseInt(shortMatch[3]! + shortMatch[3]!, 16),
      };
    }

    const fullMatch = hex.match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (fullMatch) {
      return {
        r: parseInt(fullMatch[1]!, 16),
        g: parseInt(fullMatch[2]!, 16),
        b: parseInt(fullMatch[3]!, 16),
      };
    }

    return null;
  }

  /**
   * Convert RGB to 256-color palette index
   */
  private rgbTo256(r: number, g: number, b: number): number {
    // Convert to 6x6x6 color cube (indices 16-231)
    const r6 = Math.round((r / 255) * 5);
    const g6 = Math.round((g / 255) * 5);
    const b6 = Math.round((b / 255) * 5);
    return 16 + 36 * r6 + 6 * g6 + b6;
  }

  /**
   * Generate minimal codes when transitioning between cells
   * Returns codes to transition from `from` cell styling to `to` cell styling
   */
  transitionCodes(from: Cell | null, to: Cell): string {
    if (!from) {
      // No previous cell - generate full codes
      const codes = this.getCellCodes(to);
      if (codes.length === 0) {
        return '';
      }
      return `\x1b[${codes.join(';')}m`;
    }

    // Check if we need to reset first
    const needsReset = this.needsReset(from, to);

    if (needsReset) {
      // Reset and apply new codes
      const codes = this.getCellCodes(to);
      if (codes.length === 0) {
        return '\x1b[0m';
      }
      return `\x1b[0;${codes.join(';')}m`;
    }

    // Generate only the delta codes
    const deltaCodes = this.getDeltaCodes(from, to);

    if (deltaCodes.length === 0) {
      return '';
    }

    return `\x1b[${deltaCodes.join(';')}m`;
  }

  /**
   * Check if we need a reset before applying new styles
   */
  private needsReset(from: Cell, to: Cell): boolean {
    // Need reset if any style is being turned OFF
    // (ANSI doesn't have codes to turn off individual styles)
    if (from.bold && !to.bold) return true;
    if (from.dim && !to.dim) return true;
    if (from.italic && !to.italic) return true;
    if (from.underline && !to.underline) return true;
    if (from.inverse && !to.inverse) return true;
    if (from.strikethrough && !to.strikethrough) return true;

    // Need reset if going from a color to null (no specific "turn off" code)
    if (from.foreground && !to.foreground) return true;
    if (from.background && !to.background) return true;

    return false;
  }

  /**
   * Get delta codes (only what changed between cells)
   */
  private getDeltaCodes(from: Cell, to: Cell): number[] {
    const codes: number[] = [];

    // Style changes (only additions since we handle resets separately)
    if (!from.bold && to.bold) codes.push(1);
    if (!from.dim && to.dim) codes.push(2);
    if (!from.italic && to.italic) codes.push(3);
    if (!from.underline && to.underline) codes.push(4);
    if (!from.inverse && to.inverse) codes.push(7);
    if (!from.strikethrough && to.strikethrough) codes.push(9);

    // Foreground color change
    if (from.foreground !== to.foreground) {
      codes.push(...this.getColorCodes(to.foreground, false));
    }

    // Background color change
    if (from.background !== to.background) {
      codes.push(...this.getColorCodes(to.background, true));
    }

    return codes;
  }

  /**
   * Generate full line output
   */
  lineToANSI(cells: Cell[]): string {
    let output = '';
    let lastCell: Cell | null = null;

    for (const cell of cells) {
      output += this.transitionCodes(lastCell, cell);
      output += cell.char || ' ';
      lastCell = cell;
    }

    // Reset at end of line
    output += '\x1b[0m';

    return output;
  }

  /**
   * Generate full buffer output
   */
  bufferToANSI(cells: Cell[][], _width: number, height: number): string {
    const lines: string[] = [];

    for (let y = 0; y < height; y++) {
      const row = cells[y];
      if (row) {
        lines.push(this.lineToANSI(row));
      } else {
        lines.push('');
      }
    }

    return lines.join('\n');
  }

  /**
   * Strip all ANSI codes from text
   */
  static stripANSI(text: string): string {
    return text.replace(/\x1b\[[0-9;]*m/g, '');
  }

  /**
   * Get visible length of text (without ANSI codes)
   */
  static visibleLength(text: string): number {
    return ANSIGenerator.stripANSI(text).length;
  }
}

/**
 * Convenience functions
 */

/**
 * Create ANSI foreground color code
 */
export function fgColor(color: string): string {
  const generator = new ANSIGenerator();
  const cell = createEmptyCell();
  cell.foreground = color;
  cell.char = '';
  return generator.transitionCodes(null, cell);
}

/**
 * Create ANSI background color code
 */
export function bgColor(color: string): string {
  const generator = new ANSIGenerator();
  const cell = createEmptyCell();
  cell.background = color;
  cell.char = '';
  return generator.transitionCodes(null, cell);
}

/**
 * Reset ANSI codes
 */
export function reset(): string {
  return '\x1b[0m';
}
