/**
 * Console utilities for terminal manipulation
 * Provides screen clearing, cursor positioning, and buffer utilities
 */

/**
 * Clear the entire screen
 * @returns ANSI escape sequence to clear screen
 */
export function clearScreen(): string {
  return '\x1b[2J\x1b[H'; // Clear screen and move cursor to home position
}

/**
 * Clear from cursor to end of screen
 * @returns ANSI escape sequence
 */
export function clearToEndOfScreen(): string {
  return '\x1b[J';
}

/**
 * Clear from cursor to beginning of screen
 * @returns ANSI escape sequence
 */
export function clearToBeginningOfScreen(): string {
  return '\x1b[1J';
}

/**
 * Clear current line
 * @returns ANSI escape sequence
 */
export function clearLine(): string {
  return '\x1b[2K';
}

/**
 * Clear from cursor to end of line
 * @returns ANSI escape sequence
 */
export function clearToEndOfLine(): string {
  return '\x1b[K';
}

/**
 * Clear from cursor to beginning of line
 * @returns ANSI escape sequence
 */
export function clearToBeginningOfLine(): string {
  return '\x1b[1K';
}

/**
 * Move cursor to a specific position
 * @param x - Column (0-indexed)
 * @param y - Row (0-indexed)
 * @returns ANSI escape sequence
 */
export function moveCursor(x: number, y: number): string {
  // ANSI uses 1-indexed positions
  return `\x1b[${y + 1};${x + 1}H`;
}

/**
 * Move cursor up
 * @param n - Number of lines (default: 1)
 * @returns ANSI escape sequence
 */
export function moveCursorUp(n: number = 1): string {
  return `\x1b[${n}A`;
}

/**
 * Move cursor down
 * @param n - Number of lines (default: 1)
 * @returns ANSI escape sequence
 */
export function moveCursorDown(n: number = 1): string {
  return `\x1b[${n}B`;
}

/**
 * Move cursor right
 * @param n - Number of characters (default: 1)
 * @returns ANSI escape sequence
 */
export function moveCursorRight(n: number = 1): string {
  return `\x1b[${n}C`;
}

/**
 * Move cursor left
 * @param n - Number of characters (default: 1)
 * @returns ANSI escape sequence
 */
export function moveCursorLeft(n: number = 1): string {
  return `\x1b[${n}D`;
}

/**
 * Save cursor position
 * @returns ANSI escape sequence
 */
export function saveCursor(): string {
  return '\x1b[s';
}

/**
 * Restore cursor position
 * @returns ANSI escape sequence
 */
export function restoreCursor(): string {
  return '\x1b[u';
}

/**
 * Hide cursor
 * @returns ANSI escape sequence
 */
export function hideCursor(): string {
  return '\x1b[?25l';
}

/**
 * Show cursor
 * @returns ANSI escape sequence
 */
export function showCursor(): string {
  return '\x1b[?25h';
}

/**
 * Scroll up
 * @param n - Number of lines (default: 1)
 * @returns ANSI escape sequence
 */
export function scrollUp(n: number = 1): string {
  return `\x1b[${n}S`;
}

/**
 * Scroll down
 * @param n - Number of lines (default: 1)
 * @returns ANSI escape sequence
 */
export function scrollDown(n: number = 1): string {
  return `\x1b[${n}T`;
}

/**
 * Screen buffer utilities
 */
export class ScreenBuffer {
  private buffer: string[][] = [];
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.clear();
  }

  /**
   * Clear the buffer
   */
  clear(): void {
    this.buffer = Array(this.height)
      .fill(null)
      .map(() => Array(this.width).fill(' '));
  }

  /**
   * Set a character at a specific position
   * @param x - Column (0-indexed)
   * @param y - Row (0-indexed)
   * @param char - Character to set
   */
  setChar(x: number, y: number, char: string): void {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.buffer[y]![x] = char.length > 0 ? char[0]! : ' ';
    }
  }

  /**
   * Set a string starting at a specific position
   * @param x - Starting column (0-indexed)
   * @param y - Starting row (0-indexed)
   * @param text - Text to set
   */
  setText(x: number, y: number, text: string): void {
    for (let i = 0; i < text.length; i++) {
      if (x + i < this.width && y < this.height) {
        this.setChar(x + i, y, text[i]!);
      }
    }
  }

  /**
   * Get character at a specific position
   * @param x - Column (0-indexed)
   * @param y - Row (0-indexed)
   * @returns Character at position
   */
  getChar(x: number, y: number): string {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      return this.buffer[y]![x] || ' ';
    }
    return ' ';
  }

  /**
   * Render buffer to string
   * @returns Rendered buffer as string
   */
  render(): string {
    return this.buffer.map((row) => row.join('')).join('\n');
  }

  /**
   * Get buffer as array of lines
   * @returns Array of lines
   */
  getLines(): string[] {
    return this.buffer.map((row) => row.join(''));
  }

  /**
   * Resize buffer
   * @param width - New width
   * @param height - New height
   */
  resize(width: number, height: number): void {
    const oldWidth = this.width;
    const oldHeight = this.height;
    this.width = width;
    this.height = height;

    // Create new buffer
    const newBuffer: string[][] = Array(this.height)
      .fill(null)
      .map(() => Array(this.width).fill(' '));

    // Copy old buffer content
    for (let y = 0; y < Math.min(oldHeight, this.height); y++) {
      for (let x = 0; x < Math.min(oldWidth, this.width); x++) {
        newBuffer[y]![x] = this.buffer[y]![x] || ' ';
      }
    }

    this.buffer = newBuffer;
  }
}
