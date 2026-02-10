/**
 * DisplayBuffer - Manages terminal output with diff-based updates
 *
 * This buffer tracks what's currently displayed on the terminal and
 * calculates the minimal set of changes needed for updates.
 *
 * Uses diff-based rendering with ansi-escapes compatible sequences.
 */

import { CellBuffer } from './CellBuffer';
import { Cell, CellDiff, cellsEqual, cloneCell } from './types';
import { ANSIGenerator } from './ANSIGenerator';
import { debug } from '../utils/debug';
import { consumePendingBells } from '../apis/Bell';

// Flag to force a visual change - toggled character to force buffer diff
let bellDirtyToggle = false;

// ANSI escape sequences (same as ansi-escapes library)
const ESC = '\u001B[';
const cursorHide = ESC + '?25l';
// cursorShow not used - we use cell-based cursor highlighting instead
const cursorTo = (x: number, y: number) => ESC + (y + 1) + ';' + (x + 1) + 'H';
const eraseScreen = ESC + '2J';
const cursorHome = ESC + 'H';

/**
 * DisplayBuffer - Terminal output manager with double buffering
 */
export class DisplayBuffer {
  private current: CellBuffer; // What's currently on the terminal
  private pending: CellBuffer; // What should be displayed
  private ansiGenerator: ANSIGenerator;
  private _width: number;
  private _height: number;
  private _lastContentLine: number = 0;
  private cursorX: number = 0;
  private cursorY: number = 0;

  constructor(width: number, height: number) {
    this._width = width;
    this._height = height;
    this.current = new CellBuffer(width, height);
    this.pending = new CellBuffer(width, height);
    this.ansiGenerator = new ANSIGenerator();
  }

  /**
   * Get buffer dimensions
   */
  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  /**
   * Get the last line with content from the most recent flush
   * Returns 0-indexed line number
   */
  get lastContentLine(): number {
    return this._lastContentLine;
  }

  /**
   * Update pending buffer from a composite buffer
   */
  updateFromComposite(composite: CellBuffer): void {
    // IMPORTANT: Clear pending buffer first to remove old high-z-index content
    // Without this, old dropdown overlay content with high z-index won't be overwritten
    // because setCell() has z-index protection
    this.pending.clear();

    // Copy composite content to pending
    composite.forEach((cell, x, y) => {
      this.pending.setCell(x, y, cloneCell(cell));
    });
  }

  /**
   * Get pending buffer for direct modification
   */
  getPendingBuffer(): CellBuffer {
    return this.pending;
  }

  /**
   * Calculate diff between current and pending buffers
   */
  getDiff(): CellDiff[] {
    const diffs: CellDiff[] = [];

    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width; x++) {
        const currentCell = this.current.getCell(x, y);
        const pendingCell = this.pending.getCell(x, y);

        if (!currentCell || !pendingCell) continue;

        if (!cellsEqual(currentCell, pendingCell)) {
          diffs.push({
            x,
            y,
            oldCell: cloneCell(currentCell),
            newCell: cloneCell(pendingCell),
          });
        }
      }
    }

    return diffs;
  }

  /**
   * Flush entire pending buffer to terminal (full redraw)
   * Simple approach: clear screen, write from top, position cursor
   * @param stream - Output stream
   * @param clearFirst - Whether to clear screen first
   * @param finalCursorPos - Optional final cursor position
   */
  flush(
    stream: typeof process.stdout,
    _clearFirst: boolean = true,
    finalCursorPos?: { x: number; y: number }
  ): void {
    debug('[DisplayBuffer.flush] START', { time: Date.now() });
    // Build output lines
    const outputLines: string[] = [];
    let lastContentLine = 0;

    for (let y = 0; y < this._height; y++) {
      const line = this.generateLineOutput(y);
      outputLines.push(line);
      if (line.length > 0) {
        lastContentLine = y;
      }
    }

    // Track for external access
    this._lastContentLine = lastContentLine;

    // Only output up to the last content line + 1
    const linesToOutput = outputLines.slice(0, lastContentLine + 1);

    // Simple approach: always clear and redraw from top
    // This avoids all the complexity of eraseLines
    let output = '';

    // Hide cursor, clear screen, go to home
    output += cursorHide;
    output += eraseScreen;
    output += cursorHome;

    // Write all lines joined by newlines
    output += linesToOutput.join('\n');

    // Position cursor if specified (using absolute positioning)
    // We use cell-based cursor highlighting, so hide the terminal cursor
    // to avoid showing two cursors
    if (finalCursorPos && finalCursorPos.x >= 0) {
      output += cursorTo(finalCursorPos.x, finalCursorPos.y);
      debug('[DisplayBuffer] cursor position', { x: finalCursorPos.x, y: finalCursorPos.y });
      // Keep terminal cursor hidden - we use cell-based highlighting
      output += cursorHide;
    } else {
      // No focused input - keep cursor hidden
      output += cursorHide;
    }

    // Toggle a character on EVERY render to ensure output is always different
    // This prevents the terminal from optimizing away "identical" output
    bellDirtyToggle = !bellDirtyToggle;
    const lastX = this._width - 1;
    const lastY = this._height - 1;
    const cell = this.pending.getCell(lastX, lastY);
    if (cell) {
      cell.char = bellDirtyToggle ? '.' : ' ';
    }

    // Regenerate the last line with the toggled character
    if (lastContentLine >= lastY) {
      outputLines[lastY] = this.generateLineOutput(lastY);
      // Rebuild output with updated line
      const updatedLinesToOutput = outputLines.slice(0, lastContentLine + 1);
      output = cursorHide + eraseScreen + cursorHome + updatedLinesToOutput.join('\n');
      if (finalCursorPos && finalCursorPos.x >= 0) {
        output += cursorTo(finalCursorPos.x, finalCursorPos.y);
        output += cursorHide;
      } else {
        output += cursorHide;
      }
    }

    // Check for pending bell sounds
    const bellCountFull = consumePendingBells();
    if (bellCountFull > 0) {
      // Append bell characters to the output with spacing
      // Use cursor save/restore sequences between bells to add processing time
      // This encourages the terminal to play bells as distinct sounds
      const bellWithPadding = '\u0007\x1b7\x1b8'; // bell + cursor save + cursor restore
      output += bellWithPadding.repeat(bellCountFull);
      debug('[DisplayBuffer.flush] Writing with bells', {
        bellCount: bellCountFull,
        outputLength: output.length,
        time: Date.now(),
      });
    } else {
      debug('[DisplayBuffer.flush] Writing without bells', {
        outputLength: output.length,
        time: Date.now(),
      });
    }

    // Write everything in one operation
    // Track stdout handle state to understand buffering
    const handle = (stream as NodeJS.WriteStream & { _handle?: { writeQueueSize?: number } })
      ._handle;
    const queueSizeBefore = handle?.writeQueueSize ?? -1;

    debug('[DisplayBuffer.flush] Calling stream.write', {
      time: Date.now(),
      outputLength: output.length,
      queueSizeBefore,
      writableLength: stream.writableLength,
      writableHighWaterMark: stream.writableHighWaterMark,
    });

    const writeResult = stream.write(output);

    const queueSizeAfter = handle?.writeQueueSize ?? -1;
    debug('[DisplayBuffer.flush] stream.write returned', {
      time: Date.now(),
      result: writeResult,
      buffered: !writeResult,
      queueSizeAfter,
      writableLengthAfter: stream.writableLength,
    });

    // Sync current with pending
    this.syncCurrentWithPending();
  }

  /**
   * Flush only changed cells to terminal (diff-based update)
   */
  flushDiff(stream: typeof process.stdout): void {
    const diffs = this.getDiff();

    // Check for pending bells even if no visual changes
    const bellCount = consumePendingBells();

    if (diffs.length === 0 && bellCount === 0) {
      return; // Nothing changed and no bells
    }

    // If only bells (no visual changes), force a visual change by toggling a character
    // This ensures the terminal receives substantial output, not just the bell
    if (diffs.length === 0 && bellCount > 0) {
      // Toggle a space/dot in the bottom-right corner to force a diff
      bellDirtyToggle = !bellDirtyToggle;
      const dirtyChar = bellDirtyToggle ? '.' : ' ';
      const lastX = this._width - 1;
      const lastY = this._height - 1;

      // Create a minimal cell for the diff
      const baseCell: Cell = {
        char: '',
        foreground: null,
        background: null,
        bold: false,
        dim: false,
        italic: false,
        underline: false,
        strikethrough: false,
        inverse: false,
        zIndex: 0,
        layerId: '',
        nodeId: null,
        dirty: false,
      };

      // Create a fake diff for the corner cell
      diffs.push({
        x: lastX,
        y: lastY,
        oldCell: { ...baseCell, char: bellDirtyToggle ? ' ' : '.' },
        newCell: { ...baseCell, char: dirtyChar },
      });
    }

    // If more than 50% of cells changed, do full redraw
    const totalCells = this._width * this._height;
    if (diffs.length > totalCells * 0.5) {
      this.flush(stream, false);
      return;
    }

    let output = '';

    // Hide cursor during update
    output += '\x1b[?25l';

    let lastX = -1;
    let lastY = -1;
    let lastCell: Cell | null = null;

    // Sort diffs by position for efficient cursor movement
    diffs.sort((a, b) => {
      if (a.y !== b.y) return a.y - b.y;
      return a.x - b.x;
    });

    for (const diff of diffs) {
      // Move cursor if not at expected position
      if (diff.y !== lastY || diff.x !== lastX + 1) {
        output += `\x1b[${diff.y + 1};${diff.x + 1}H`;
      }

      // Generate cell output with transition optimization
      output += this.ansiGenerator.transitionCodes(lastCell, diff.newCell);
      output += diff.newCell.char || ' ';

      lastX = diff.x;
      lastY = diff.y;
      lastCell = diff.newCell;
    }

    // Reset styles after all updates
    output += '\x1b[0m';

    // Keep cursor hidden - we use cell-based cursor highlighting
    output += '\x1b[?25l';

    // Append any pending bells
    if (bellCount > 0) {
      output += '\u0007'.repeat(bellCount);
    }

    // Write to stream
    stream.write(output);

    // Sync current with pending
    this.syncCurrentWithPending();
  }

  /**
   * Generate output for a single line
   * Uses simple sequential output with spaces instead of cursor positioning
   */
  private generateLineOutput(y: number): string {
    let output = '';
    let lastCell: Cell | null = null;

    // Find the last column with content to avoid trailing spaces
    let lastContentX = -1;
    for (let x = this._width - 1; x >= 0; x--) {
      const cell = this.pending.getCell(x, y);
      if (cell && cell.char) {
        lastContentX = x;
        break;
      }
    }

    // If no content on this line, return empty string
    if (lastContentX < 0) {
      return '';
    }

    // Output from column 0 to last content column
    // Use spaces for empty cells instead of cursor positioning
    for (let x = 0; x <= lastContentX; x++) {
      const cell = this.pending.getCell(x, y);

      if (!cell || !cell.char) {
        // Empty cell - output a space (reset styles first if needed)
        if (lastCell !== null) {
          output += '\x1b[0m';
          lastCell = null;
        }
        output += ' ';
      } else {
        // Content cell - output with styles
        output += this.ansiGenerator.transitionCodes(lastCell, cell);
        output += cell.char;
        lastCell = cell;
      }
    }

    // Reset at end of line
    if (lastCell !== null) {
      output += '\x1b[0m';
    }

    return output;
  }

  /**
   * Sync current buffer with pending buffer
   */
  private syncCurrentWithPending(): void {
    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width; x++) {
        const pendingCell = this.pending.getCell(x, y);
        if (pendingCell) {
          this.current.setCell(x, y, cloneCell(pendingCell));
        }
      }
    }

    this.current.markClean();
    this.pending.markClean();
  }

  /**
   * Set cursor position for after flush
   */
  setCursor(x: number, y: number): void {
    this.cursorX = Math.max(0, Math.min(x, this._width - 1));
    this.cursorY = Math.max(0, Math.min(y, this._height - 1));
  }

  /**
   * Get cursor position
   */
  getCursor(): { x: number; y: number } {
    return { x: this.cursorX, y: this.cursorY };
  }

  /**
   * Resize buffers
   */
  resize(width: number, height: number): void {
    this._width = width;
    this._height = height;
    this.current.resize(width, height);
    this.pending.resize(width, height);
  }

  /**
   * Clear both buffers
   */
  clear(): void {
    this.current.clear();
    this.pending.clear();
  }

  /**
   * Generate ANSI escape sequence to move cursor
   */
  static moveCursor(x: number, y: number): string {
    return `\x1b[${y + 1};${x + 1}H`;
  }

  /**
   * Generate ANSI escape sequence to clear screen
   */
  static clearScreen(): string {
    return '\x1b[2J\x1b[H';
  }

  /**
   * Generate ANSI escape sequence to hide cursor
   */
  static hideCursor(): string {
    return '\x1b[?25l';
  }

  /**
   * Generate ANSI escape sequence to show cursor
   */
  static showCursor(): string {
    return '\x1b[?25h';
  }
}
