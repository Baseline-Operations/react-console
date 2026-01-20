/**
 * Output buffering and cursor management for console rendering
 */

import { hideCursor, showCursor, clearScreen, moveCursor } from './ansi';

export interface OutputBuffer {
  lines: string[];
  cursorX: number;
  cursorY: number;
}

/**
 * Create a new output buffer
 */
export function createOutputBuffer(): OutputBuffer {
  return {
    lines: [],
    cursorX: 0,
    cursorY: 0,
  };
}

/**
 * Write buffer to stdout
 */
export function flushOutput(buffer: OutputBuffer, clear: boolean = false): void {
  if (clear) {
    process.stdout.write(clearScreen());
  }

  // Write all lines
  for (let i = 0; i < buffer.lines.length; i++) {
    const line = buffer.lines[i]!;
    if (i > 0) {
      process.stdout.write('\n');
    }
    process.stdout.write(line || '');
  }

  // Reset cursor position
  process.stdout.write(moveCursor(buffer.cursorX, buffer.cursorY));
}

/**
 * Add line to buffer
 */
export function addLine(buffer: OutputBuffer, line: string): void {
  buffer.lines.push(line);
}

/**
 * Add text to current line
 */
export function addText(buffer: OutputBuffer, text: string): void {
  const lastIndex = buffer.lines.length - 1;
  if (lastIndex >= 0) {
    buffer.lines[lastIndex] = (buffer.lines[lastIndex] || '') + text;
  } else {
    buffer.lines.push(text);
  }
}

/**
 * Start rendering (hide cursor)
 */
export function startRendering(): void {
  process.stdout.write(hideCursor());
}

/**
 * Stop rendering (show cursor)
 */
export function stopRendering(): void {
  process.stdout.write(showCursor());
}
