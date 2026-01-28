/**
 * CompositeBuffer - Composites multiple layers into a single buffer
 * 
 * This handles the merging of multiple layers with proper z-index ordering,
 * background color inheritance, and transparency handling.
 */

import { CellBuffer } from './CellBuffer';
import { Layer, LayerManager } from './Layer';
import {
  Cell,
  BoundingBox,
  createEmptyCell,
  isCellTransparent,
} from './types';

/**
 * CompositeBuffer - Manages layer compositing
 */
export class CompositeBuffer {
  private layerManager: LayerManager;
  private compositeResult: CellBuffer;
  private _width: number;
  private _height: number;
  
  constructor(width: number, height: number) {
    this._width = width;
    this._height = height;
    this.layerManager = new LayerManager(width, height);
    this.compositeResult = new CellBuffer(width, height);
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
   * Get the layer manager
   */
  getLayerManager(): LayerManager {
    return this.layerManager;
  }
  
  /**
   * Create a new layer and return its buffer
   */
  createLayer(
    id: string,
    zIndex: number,
    bounds: BoundingBox,
    nodeId: string | null = null
  ): CellBuffer {
    const layer = this.layerManager.createLayer(id, zIndex, bounds, nodeId);
    return layer.getBuffer();
  }
  
  /**
   * Get a layer's buffer by ID
   */
  getLayerBuffer(id: string): CellBuffer | null {
    const layer = this.layerManager.getLayer(id);
    return layer ? layer.getBuffer() : null;
  }
  
  /**
   * Get the root layer's buffer
   */
  getRootBuffer(): CellBuffer {
    return this.layerManager.getRootLayer().getBuffer();
  }
  
  /**
   * Remove a layer
   */
  removeLayer(id: string): boolean {
    return this.layerManager.removeLayer(id);
  }
  
  /**
   * Clear all layers
   */
  clearAllLayers(): void {
    this.layerManager.clearAllLayers();
  }
  
  /**
   * Remove all layers except root
   */
  resetLayers(): void {
    this.layerManager.removeAllLayers();
  }
  
  /**
   * Composite all layers into the result buffer
   * 
   * Algorithm:
   * 1. Start with empty result buffer
   * 2. For each position (x, y):
   *    - Collect cells from all layers at this position (sorted by z-index)
   *    - Composite from bottom to top:
   *      - If cell has visible content, use it
   *      - If cell has background but transparent content, inherit background
   *      - Text styles come from the topmost visible content
   */
  composite(): void {
    const sortedLayers = this.layerManager.getSortedLayers();
    
    // Clear composite result
    this.compositeResult.clear();
    
    // For each position in the result buffer
    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width; x++) {
        const compositedCell = this.compositeAtPosition(x, y, sortedLayers);
        this.compositeResult.setCell(x, y, compositedCell);
      }
    }
    
    this.compositeResult.markAllDirty();
  }
  
  /**
   * Composite a specific region only (for partial updates)
   */
  compositeRegion(region: BoundingBox): void {
    const sortedLayers = this.layerManager.getSortedLayers();
    
    const startX = Math.max(0, region.x);
    const startY = Math.max(0, region.y);
    const endX = Math.min(this._width, region.x + region.width);
    const endY = Math.min(this._height, region.y + region.height);
    
    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const compositedCell = this.compositeAtPosition(x, y, sortedLayers);
        this.compositeResult.setCell(x, y, compositedCell);
      }
    }
  }
  
  /**
   * Composite cells at a specific position from all layers
   */
  private compositeAtPosition(x: number, y: number, layers: Layer[]): Cell {
    const result = createEmptyCell();
    
    // Process layers from bottom to top (lowest z-index first)
    for (const layer of layers) {
      if (!layer.visible) continue;
      
      // Check if this position is within the layer's bounds
      if (!layer.containsPoint(x, y)) continue;
      
      // Get the cell from this layer (convert to local coords)
      const local = layer.toLocalCoords(x, y);
      const layerCell = layer.getBuffer().getCell(local.x, local.y);
      
      if (!layerCell) continue;
      
      // Composite this cell with the result
      this.compositeCellInto(result, layerCell, layer.opacity);
    }
    
    return result;
  }
  
  /**
   * Composite a source cell into a destination cell
   */
  private compositeCellInto(dest: Cell, source: Cell, _opacity: number): void {
    // If source has visible content (non-transparent), use it
    if (!isCellTransparent(source)) {
      dest.char = source.char;
      dest.foreground = source.foreground;
      dest.bold = source.bold;
      dest.dim = source.dim;
      dest.italic = source.italic;
      dest.underline = source.underline;
      dest.strikethrough = source.strikethrough;
      dest.inverse = source.inverse;
      dest.zIndex = Math.max(dest.zIndex, source.zIndex);
      dest.layerId = source.layerId;
      dest.nodeId = source.nodeId;
    }
    
    // Background: source background takes precedence if set
    // This allows transparent content but colored background
    if (source.background !== null) {
      // Future: could blend colors based on opacity
      dest.background = source.background;
    }
  }
  
  /**
   * Get the composited result buffer
   */
  getCompositeBuffer(): CellBuffer {
    return this.compositeResult;
  }
  
  /**
   * Resize the composite buffer and all layers
   */
  resize(width: number, height: number): void {
    this._width = width;
    this._height = height;
    this.layerManager.resizeTerminal(width, height);
    this.compositeResult.resize(width, height);
  }
  
  /**
   * Get cell at position from composited result
   */
  getCell(x: number, y: number): Cell | null {
    return this.compositeResult.getCell(x, y);
  }
  
  /**
   * Check if compositing produced any dirty cells
   */
  isDirty(): boolean {
    return this.compositeResult.isDirty();
  }
  
  /**
   * Get dirty regions from composite result
   */
  getDirtyRegions(): BoundingBox[] {
    return this.compositeResult.getDirtyRegions();
  }
}

/**
 * Blend two colors (for future transparency support)
 */
export function blendColors(
  bottom: string | null,
  top: string | null,
  topOpacity: number
): string | null {
  if (topOpacity >= 1 || !bottom) {
    return top;
  }
  if (topOpacity <= 0 || !top) {
    return bottom;
  }
  
  // For now, just use top if opacity > 0.5, else bottom
  // Future: implement actual color blending
  return topOpacity >= 0.5 ? top : bottom;
}

/**
 * Composite an array of cells (sorted by z-index, lowest first)
 */
export function compositeCells(cells: Cell[]): Cell {
  const result = createEmptyCell();
  
  for (const cell of cells) {
    if (!isCellTransparent(cell)) {
      result.char = cell.char;
      result.foreground = cell.foreground;
      result.bold = cell.bold;
      result.dim = cell.dim;
      result.italic = cell.italic;
      result.underline = cell.underline;
      result.strikethrough = cell.strikethrough;
      result.inverse = cell.inverse;
      result.zIndex = Math.max(result.zIndex, cell.zIndex);
      result.layerId = cell.layerId;
      result.nodeId = cell.nodeId;
    }
    
    if (cell.background !== null) {
      result.background = cell.background;
    }
  }
  
  return result;
}
