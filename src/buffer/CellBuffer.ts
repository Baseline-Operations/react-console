/**
 * CellBuffer - Core 2D buffer of cells
 * 
 * This is the fundamental buffer class that stores a 2D grid of cells,
 * each containing character, color, and style information.
 */

import {
  Cell,
  PartialCell,
  DirtyRegion,
  BoundingBox,
  createEmptyCell,
  cloneCell,
  cellsEqual,
} from './types';

/**
 * CellBuffer - A 2D grid of cells with dirty region tracking
 */
export class CellBuffer {
  private cells: Cell[][];
  private _width: number;
  private _height: number;
  private dirtyRegions: Set<string>; // Set of "x,y" coordinates
  private fullyDirty: boolean;
  
  constructor(width: number, height: number) {
    this._width = Math.max(1, width);
    this._height = Math.max(1, height);
    this.cells = [];
    this.dirtyRegions = new Set();
    this.fullyDirty = true;
    
    this.initializeCells();
  }
  
  /**
   * Initialize all cells to empty state
   */
  private initializeCells(): void {
    this.cells = [];
    for (let y = 0; y < this._height; y++) {
      const row: Cell[] = [];
      for (let x = 0; x < this._width; x++) {
        row.push(createEmptyCell());
      }
      this.cells.push(row);
    }
  }
  
  /**
   * Get buffer width
   */
  get width(): number {
    return this._width;
  }
  
  /**
   * Get buffer height
   */
  get height(): number {
    return this._height;
  }
  
  /**
   * Check if coordinates are within bounds
   */
  isInBounds(x: number, y: number): boolean {
    // Ensure we use integer coordinates for array access
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    return ix >= 0 && ix < this._width && iy >= 0 && iy < this._height;
  }
  
  /**
   * Get cell at position
   */
  getCell(x: number, y: number): Cell | null {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    if (!this.isInBounds(ix, iy)) {
      return null;
    }
    return this.cells[iy]![ix]!;
  }
  
  /**
   * Set cell at position
   */
  setCell(x: number, y: number, cellData: PartialCell): void {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    if (!this.isInBounds(ix, iy)) {
      return;
    }
    
    const currentCell = this.cells[iy]![ix]!;
    const newCell: Cell = {
      ...currentCell,
      ...cellData,
      dirty: true,
    };
    
    // Only mark dirty if actually changed
    if (!cellsEqual(currentCell, newCell)) {
      this.cells[iy]![ix] = newCell;
      this.markCellDirty(ix, iy);
    } else {
      // Still update non-visual properties
      this.cells[iy]![ix] = newCell;
    }
  }
  
  /**
   * Set a character at position with optional style
   */
  setChar(
    x: number,
    y: number,
    char: string,
    foreground?: string | null,
    background?: string | null,
    styles?: {
      bold?: boolean;
      dim?: boolean;
      italic?: boolean;
      underline?: boolean;
      strikethrough?: boolean;
      inverse?: boolean;
    }
  ): void {
    this.setCell(x, y, {
      char,
      foreground: foreground ?? null,
      background: background ?? null,
      ...styles,
    });
  }
  
  /**
   * Fill a region with a cell value
   */
  fillRegion(
    x: number,
    y: number,
    width: number,
    height: number,
    cellData: PartialCell
  ): void {
    const startX = Math.max(0, Math.floor(x));
    const startY = Math.max(0, Math.floor(y));
    const endX = Math.min(this._width, Math.floor(x + width));
    const endY = Math.min(this._height, Math.floor(y + height));
    
    for (let cy = startY; cy < endY; cy++) {
      for (let cx = startX; cx < endX; cx++) {
        this.setCell(cx, cy, cellData);
      }
    }
  }
  
  /**
   * Fill a region with a background color
   * Also fills with space characters to fully overwrite any existing content
   */
  fillBackground(
    x: number,
    y: number,
    width: number,
    height: number,
    background: string | null,
    layerId?: string,
    nodeId?: string | null,
    zIndex?: number
  ): void {
    this.fillRegion(x, y, width, height, {
      char: ' ', // Fill with spaces to overwrite existing content
      background,
      layerId: layerId ?? 'root',
      nodeId: nodeId ?? null,
      zIndex: zIndex ?? 0,
    });
  }
  
  /**
   * Clear a region (reset to empty cells)
   */
  clearRegion(x: number, y: number, width: number, height: number): void {
    const startX = Math.max(0, Math.floor(x));
    const startY = Math.max(0, Math.floor(y));
    const endX = Math.min(this._width, Math.floor(x + width));
    const endY = Math.min(this._height, Math.floor(y + height));
    
    for (let cy = startY; cy < endY; cy++) {
      for (let cx = startX; cx < endX; cx++) {
        const emptyCell = createEmptyCell();
        this.cells[cy]![cx] = emptyCell;
        this.markCellDirty(cx, cy);
      }
    }
  }
  
  /**
   * Clear entire buffer
   */
  clear(): void {
    this.initializeCells();
    this.fullyDirty = true;
    this.dirtyRegions.clear();
  }
  
  /**
   * Resize buffer (preserving content where possible)
   */
  resize(newWidth: number, newHeight: number): void {
    if (newWidth === this._width && newHeight === this._height) {
      return;
    }
    
    newWidth = Math.max(1, newWidth);
    newHeight = Math.max(1, newHeight);
    
    const oldCells = this.cells;
    const oldWidth = this._width;
    const oldHeight = this._height;
    
    this._width = newWidth;
    this._height = newHeight;
    this.cells = [];
    
    for (let y = 0; y < newHeight; y++) {
      const row: Cell[] = [];
      for (let x = 0; x < newWidth; x++) {
        if (y < oldHeight && x < oldWidth) {
          // Preserve existing cell
          row.push(cloneCell(oldCells[y]![x]!));
        } else {
          // New cell
          row.push(createEmptyCell());
        }
      }
      this.cells.push(row);
    }
    
    this.fullyDirty = true;
    this.dirtyRegions.clear();
  }
  
  /**
   * Mark a single cell as dirty
   */
  private markCellDirty(x: number, y: number): void {
    this.dirtyRegions.add(`${x},${y}`);
  }
  
  /**
   * Mark a region as dirty
   */
  markDirty(x: number, y: number, width: number, height: number): void {
    const startX = Math.max(0, x);
    const startY = Math.max(0, y);
    const endX = Math.min(this._width, x + width);
    const endY = Math.min(this._height, y + height);
    
    for (let cy = startY; cy < endY; cy++) {
      for (let cx = startX; cx < endX; cx++) {
        this.markCellDirty(cx, cy);
        this.cells[cy]![cx]!.dirty = true;
      }
    }
  }
  
  /**
   * Mark entire buffer as dirty
   */
  markAllDirty(): void {
    this.fullyDirty = true;
    this.dirtyRegions.clear();
  }
  
  /**
   * Mark all cells as clean
   */
  markClean(): void {
    this.fullyDirty = false;
    this.dirtyRegions.clear();
    
    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width; x++) {
        this.cells[y]![x]!.dirty = false;
      }
    }
  }
  
  /**
   * Check if buffer has any dirty cells
   */
  isDirty(): boolean {
    return this.fullyDirty || this.dirtyRegions.size > 0;
  }
  
  /**
   * Get all dirty regions (optimized as bounding boxes)
   */
  getDirtyRegions(): DirtyRegion[] {
    if (this.fullyDirty) {
      return [{ x: 0, y: 0, width: this._width, height: this._height }];
    }
    
    if (this.dirtyRegions.size === 0) {
      return [];
    }
    
    // Convert set of coordinates to bounding regions
    // For now, return individual cells as regions (can be optimized later)
    const regions: DirtyRegion[] = [];
    for (const coord of this.dirtyRegions) {
      const [x, y] = coord.split(',').map(Number);
      regions.push({ x: x!, y: y!, width: 1, height: 1 });
    }
    
    return this.mergeRegions(regions);
  }
  
  /**
   * Merge adjacent dirty regions for efficiency
   */
  private mergeRegions(regions: DirtyRegion[]): DirtyRegion[] {
    if (regions.length <= 1) {
      return regions;
    }
    
    // Simple implementation: merge into row-based regions
    const rowRegions = new Map<number, { minX: number; maxX: number }>();
    
    for (const region of regions) {
      for (let y = region.y; y < region.y + region.height; y++) {
        const existing = rowRegions.get(y);
        if (existing) {
          existing.minX = Math.min(existing.minX, region.x);
          existing.maxX = Math.max(existing.maxX, region.x + region.width);
        } else {
          rowRegions.set(y, { minX: region.x, maxX: region.x + region.width });
        }
      }
    }
    
    const merged: DirtyRegion[] = [];
    for (const [y, { minX, maxX }] of rowRegions) {
      merged.push({ x: minX, y, width: maxX - minX, height: 1 });
    }
    
    return merged;
  }
  
  /**
   * Get dirty cells as an array
   */
  getDirtyCells(): Array<{ x: number; y: number; cell: Cell }> {
    const dirtyCells: Array<{ x: number; y: number; cell: Cell }> = [];
    
    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width; x++) {
        const cell = this.cells[y]![x]!;
        if (cell.dirty || this.fullyDirty) {
          dirtyCells.push({ x, y, cell });
        }
      }
    }
    
    return dirtyCells;
  }
  
  /**
   * Iterate over all cells
   */
  forEach(callback: (cell: Cell, x: number, y: number) => void): void {
    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width; x++) {
        callback(this.cells[y]![x]!, x, y);
      }
    }
  }
  
  /**
   * Iterate over a region
   */
  forEachInRegion(
    region: BoundingBox,
    callback: (cell: Cell, x: number, y: number) => void
  ): void {
    const startX = Math.max(0, region.x);
    const startY = Math.max(0, region.y);
    const endX = Math.min(this._width, region.x + region.width);
    const endY = Math.min(this._height, region.y + region.height);
    
    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        callback(this.cells[y]![x]!, x, y);
      }
    }
  }
  
  /**
   * Get a row of cells
   */
  getRow(y: number): Cell[] | null {
    if (y < 0 || y >= this._height) {
      return null;
    }
    return this.cells[y]!.map(cloneCell);
  }
  
  /**
   * Get a column of cells
   */
  getColumn(x: number): Cell[] | null {
    if (x < 0 || x >= this._width) {
      return null;
    }
    return this.cells.map(row => cloneCell(row[x]!));
  }
  
  /**
   * Copy a region from this buffer
   */
  copyRegion(region: BoundingBox): CellBuffer {
    const copy = new CellBuffer(region.width, region.height);
    
    for (let dy = 0; dy < region.height; dy++) {
      for (let dx = 0; dx < region.width; dx++) {
        const cell = this.getCell(region.x + dx, region.y + dy);
        if (cell) {
          copy.setCell(dx, dy, cloneCell(cell));
        }
      }
    }
    
    return copy;
  }
  
  /**
   * Paste a buffer into this buffer at position
   */
  pasteBuffer(source: CellBuffer, x: number, y: number): void {
    for (let sy = 0; sy < source.height; sy++) {
      for (let sx = 0; sx < source.width; sx++) {
        const cell = source.getCell(sx, sy);
        if (cell) {
          this.setCell(x + sx, y + sy, cell);
        }
      }
    }
  }
  
  /**
   * Write a string horizontally starting at position
   */
  writeString(
    x: number,
    y: number,
    text: string,
    foreground?: string | null,
    background?: string | null,
    styles?: {
      bold?: boolean;
      dim?: boolean;
      italic?: boolean;
      underline?: boolean;
      strikethrough?: boolean;
      inverse?: boolean;
    },
    options?: {
      layerId?: string;
      nodeId?: string | null;
      zIndex?: number;
    }
  ): number {
    let cx = x;
    
    for (const char of text) {
      if (!this.isInBounds(cx, y)) {
        break;
      }
      
      this.setCell(cx, y, {
        char,
        foreground: foreground ?? null,
        background: background ?? null,
        ...styles,
        layerId: options?.layerId ?? 'root',
        nodeId: options?.nodeId ?? null,
        zIndex: options?.zIndex ?? 0,
      });
      
      cx++;
    }
    
    return cx - x; // Return number of characters written
  }
  
  /**
   * Create a clone of this buffer
   */
  clone(): CellBuffer {
    const copy = new CellBuffer(this._width, this._height);
    
    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width; x++) {
        copy.cells[y]![x] = cloneCell(this.cells[y]![x]!);
      }
    }
    
    copy.fullyDirty = this.fullyDirty;
    copy.dirtyRegions = new Set(this.dirtyRegions);
    
    return copy;
  }
}
