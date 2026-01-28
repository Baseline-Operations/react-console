/**
 * DisplayBuffer - Manages terminal output with diff-based updates
 * 
 * This buffer tracks what's currently displayed on the terminal and
 * calculates the minimal set of changes needed for updates.
 */

import { CellBuffer } from './CellBuffer';
import { Cell, CellDiff, cellsEqual, cloneCell } from './types';
import { ANSIGenerator } from './ANSIGenerator';

/**
 * DisplayBuffer - Terminal output manager with double buffering
 */
export class DisplayBuffer {
  private current: CellBuffer;       // What's currently on the terminal
  private pending: CellBuffer;       // What should be displayed
  private ansiGenerator: ANSIGenerator;
  private _width: number;
  private _height: number;
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
   * Update pending buffer from a composite buffer
   */
  updateFromComposite(composite: CellBuffer): void {
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
   */
  flush(stream: typeof process.stdout, clearFirst: boolean = true): void {
    let output = '';
    
    // Hide cursor during update
    output += '\x1b[?25l';
    
    if (clearFirst) {
      // Clear screen and move to home
      output += '\x1b[2J\x1b[H';
    } else {
      // Just move to home
      output += '\x1b[H';
    }
    
    // Generate output line by line
    for (let y = 0; y < this._height; y++) {
      if (y > 0) {
        output += '\n';
      }
      
      output += this.generateLineOutput(y);
    }
    
    // Move cursor to stored position
    output += `\x1b[${this.cursorY + 1};${this.cursorX + 1}H`;
    
    // Show cursor
    output += '\x1b[?25h';
    
    // Write to stream
    stream.write(output);
    
    // Sync current with pending
    this.syncCurrentWithPending();
  }
  
  /**
   * Flush only changed cells to terminal (diff-based update)
   */
  flushDiff(stream: typeof process.stdout): void {
    const diffs = this.getDiff();
    
    if (diffs.length === 0) {
      return; // Nothing changed
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
    
    // Move cursor to stored position
    output += `\x1b[${this.cursorY + 1};${this.cursorX + 1}H`;
    
    // Show cursor
    output += '\x1b[?25h';
    
    // Write to stream
    stream.write(output);
    
    // Sync current with pending
    this.syncCurrentWithPending();
  }
  
  /**
   * Generate output for a single line
   */
  private generateLineOutput(y: number): string {
    let output = '';
    let lastCell: Cell | null = null;
    
    for (let x = 0; x < this._width; x++) {
      const cell = this.pending.getCell(x, y);
      if (!cell) continue;
      
      // Generate transition codes
      output += this.ansiGenerator.transitionCodes(lastCell, cell);
      output += cell.char || ' ';
      
      lastCell = cell;
    }
    
    // Reset at end of line
    output += '\x1b[0m';
    
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
