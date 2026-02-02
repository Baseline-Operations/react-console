/**
 * Layer System - Manages rendering layers with z-index ordering
 *
 * Layers allow components to render at different z-levels,
 * with proper compositing to produce the final output.
 */

import { CellBuffer } from './CellBuffer';
import { LayerInfo, BoundingBox } from './types';

/**
 * Layer - A rendering layer with its own cell buffer
 */
export class Layer implements LayerInfo {
  readonly id: string;
  zIndex: number;
  visible: boolean;
  opacity: number;
  bounds: BoundingBox;
  nodeId: string | null;
  buffer: CellBuffer;

  constructor(id: string, zIndex: number, bounds: BoundingBox, nodeId: string | null = null) {
    this.id = id;
    this.zIndex = zIndex;
    this.visible = true;
    this.opacity = 1.0;
    this.bounds = { ...bounds };
    this.nodeId = nodeId;

    // Create buffer sized to the layer bounds
    this.buffer = new CellBuffer(bounds.width, bounds.height);
  }

  /**
   * Get the layer's cell buffer
   */
  getBuffer(): CellBuffer {
    return this.buffer;
  }

  /**
   * Clear the layer's buffer
   */
  clear(): void {
    this.buffer.clear();
  }

  /**
   * Resize the layer
   */
  resize(width: number, height: number): void {
    this.bounds.width = width;
    this.bounds.height = height;
    this.buffer.resize(width, height);
  }

  /**
   * Move the layer to a new position
   */
  moveTo(x: number, y: number): void {
    this.bounds.x = x;
    this.bounds.y = y;
  }

  /**
   * Check if a point is within this layer's bounds
   */
  containsPoint(x: number, y: number): boolean {
    return (
      x >= this.bounds.x &&
      x < this.bounds.x + this.bounds.width &&
      y >= this.bounds.y &&
      y < this.bounds.y + this.bounds.height
    );
  }

  /**
   * Convert global coordinates to layer-local coordinates
   */
  toLocalCoords(globalX: number, globalY: number): { x: number; y: number } {
    return {
      x: globalX - this.bounds.x,
      y: globalY - this.bounds.y,
    };
  }

  /**
   * Convert layer-local coordinates to global coordinates
   */
  toGlobalCoords(localX: number, localY: number): { x: number; y: number } {
    return {
      x: localX + this.bounds.x,
      y: localY + this.bounds.y,
    };
  }
}

/**
 * LayerManager - Manages all layers and their ordering
 */
export class LayerManager {
  private layers: Map<string, Layer> = new Map();
  private sortedLayers: Layer[] | null = null;
  private rootLayerId: string = 'root';

  constructor(terminalWidth: number, terminalHeight: number) {
    // Create root layer that covers entire terminal
    this.createLayer(this.rootLayerId, 0, {
      x: 0,
      y: 0,
      width: terminalWidth,
      height: terminalHeight,
    });
  }

  /**
   * Create a new layer
   */
  createLayer(
    id: string,
    zIndex: number,
    bounds: BoundingBox,
    nodeId: string | null = null
  ): Layer {
    if (this.layers.has(id)) {
      // Return existing layer
      const existing = this.layers.get(id)!;
      existing.zIndex = zIndex;
      existing.bounds = { ...bounds };
      existing.nodeId = nodeId;
      this.invalidateSortOrder();
      return existing;
    }

    const layer = new Layer(id, zIndex, bounds, nodeId);
    this.layers.set(id, layer);
    this.invalidateSortOrder();

    return layer;
  }

  /**
   * Remove a layer
   */
  removeLayer(id: string): boolean {
    if (id === this.rootLayerId) {
      return false; // Cannot remove root layer
    }

    const removed = this.layers.delete(id);
    if (removed) {
      this.invalidateSortOrder();
    }
    return removed;
  }

  /**
   * Get a layer by ID
   */
  getLayer(id: string): Layer | null {
    return this.layers.get(id) || null;
  }

  /**
   * Get the root layer
   */
  getRootLayer(): Layer {
    return this.layers.get(this.rootLayerId)!;
  }

  /**
   * Check if a layer exists
   */
  hasLayer(id: string): boolean {
    return this.layers.has(id);
  }

  /**
   * Set z-index for a layer
   */
  setZIndex(layerId: string, zIndex: number): void {
    const layer = this.layers.get(layerId);
    if (layer) {
      layer.zIndex = zIndex;
      this.invalidateSortOrder();
    }
  }

  /**
   * Bring a layer to the front (highest z-index)
   */
  bringToFront(layerId: string): void {
    const layer = this.layers.get(layerId);
    if (!layer) return;

    let maxZ = 0;
    for (const l of this.layers.values()) {
      if (l.zIndex > maxZ) {
        maxZ = l.zIndex;
      }
    }

    layer.zIndex = maxZ + 1;
    this.invalidateSortOrder();
  }

  /**
   * Send a layer to the back (lowest z-index)
   */
  sendToBack(layerId: string): void {
    const layer = this.layers.get(layerId);
    if (!layer || layerId === this.rootLayerId) return;

    let minZ = 0;
    for (const l of this.layers.values()) {
      if (l.id !== this.rootLayerId && l.zIndex < minZ) {
        minZ = l.zIndex;
      }
    }

    layer.zIndex = minZ - 1;
    this.invalidateSortOrder();
  }

  /**
   * Get layers sorted by z-index (lowest first)
   */
  getSortedLayers(): Layer[] {
    if (this.sortedLayers === null) {
      this.sortedLayers = Array.from(this.layers.values()).sort((a, b) => a.zIndex - b.zIndex);
    }
    return this.sortedLayers;
  }

  /**
   * Invalidate the cached sort order
   */
  invalidateSortOrder(): void {
    this.sortedLayers = null;
  }

  /**
   * Get all layers that contain a point
   */
  getLayersAtPoint(x: number, y: number): Layer[] {
    return this.getSortedLayers().filter((layer) => layer.visible && layer.containsPoint(x, y));
  }

  /**
   * Get all layer IDs
   */
  getLayerIds(): string[] {
    return Array.from(this.layers.keys());
  }

  /**
   * Clear all layers
   */
  clearAllLayers(): void {
    for (const layer of this.layers.values()) {
      layer.clear();
    }
  }

  /**
   * Remove all layers except root
   */
  removeAllLayers(): void {
    const rootLayer = this.layers.get(this.rootLayerId);
    this.layers.clear();
    if (rootLayer) {
      this.layers.set(this.rootLayerId, rootLayer);
      rootLayer.clear();
    }
    this.invalidateSortOrder();
  }

  /**
   * Resize all layers based on terminal resize
   */
  resizeTerminal(width: number, height: number): void {
    const rootLayer = this.getRootLayer();
    rootLayer.resize(width, height);
  }

  /**
   * Get layer count
   */
  get layerCount(): number {
    return this.layers.size;
  }
}
