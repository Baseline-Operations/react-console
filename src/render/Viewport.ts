/**
 * Viewport - represents a visible area (like browser viewport)
 */

import type { BoundingBox } from '../nodes/base/types';

/**
 * Viewport - represents a visible area (like browser viewport)
 */
export class Viewport {
  readonly bounds: BoundingBox;
  scrollX: number = 0;
  scrollY: number = 0;
  clippingArea: BoundingBox;
  parent: Viewport | null = null;
  children: Viewport[] = [];
  
  constructor(bounds: BoundingBox, parent: Viewport | null = null) {
    this.bounds = bounds;
    this.clippingArea = bounds;
    this.parent = parent;
    if (parent) {
      parent.children.push(this);
    }
  }
  
  /**
   * Check if point is within viewport
   */
  containsPoint(x: number, y: number): boolean {
    return (
      x >= this.clippingArea.x &&
      x < this.clippingArea.x + this.clippingArea.width &&
      y >= this.clippingArea.y &&
      y < this.clippingArea.y + this.clippingArea.height
    );
  }
  
  /**
   * Check if region intersects with viewport
   */
  intersects(region: BoundingBox): boolean {
    return !(
      region.x + region.width <= this.clippingArea.x ||
      this.clippingArea.x + this.clippingArea.width <= region.x ||
      region.y + region.height <= this.clippingArea.y ||
      this.clippingArea.y + this.clippingArea.height <= region.y
    );
  }
  
  /**
   * Clip region to viewport bounds
   */
  clip(region: BoundingBox): BoundingBox | null {
    if (!this.intersects(region)) {
      return null;
    }
    
    return {
      x: Math.max(region.x, this.clippingArea.x),
      y: Math.max(region.y, this.clippingArea.y),
      width: Math.min(
        region.x + region.width,
        this.clippingArea.x + this.clippingArea.width
      ) - Math.max(region.x, this.clippingArea.x),
      height: Math.min(
        region.y + region.height,
        this.clippingArea.y + this.clippingArea.height
      ) - Math.max(region.y, this.clippingArea.y),
    };
  }
  
  /**
   * Set scroll position
   */
  setScroll(x: number, y: number): void {
    this.scrollX = x;
    this.scrollY = y;
    this.updateClippingArea();
  }
  
  /**
   * Update clipping area based on scroll and parent viewport
   */
  private updateClippingArea(): void {
    this.clippingArea = { ...this.bounds };
    this.clippingArea.x -= this.scrollX;
    this.clippingArea.y -= this.scrollY;
    
    if (this.parent) {
      const parentClipped = this.parent.clip(this.clippingArea);
      if (parentClipped) {
        this.clippingArea = parentClipped;
      } else {
        this.clippingArea = { x: 0, y: 0, width: 0, height: 0 };
      }
    }
    
    // Update child viewports
    for (const child of this.children) {
      child.updateClippingArea();
    }
  }
}

/**
 * Viewport manager - manages all viewports
 */
export class ViewportManager {
  private viewports: Map<any, Viewport> = new Map();
  private rootViewport: Viewport | null = null;
  
  /**
   * Create viewport for a node
   */
  createViewport(node: any, bounds: BoundingBox): Viewport {
    const parent = node.parent;
    const parentViewport = parent ? this.viewports.get(parent) : null;
    
    const viewport = new Viewport(bounds, parentViewport);
    this.viewports.set(node, viewport);
    
    if (!parent) {
      this.rootViewport = viewport;
    }
    
    return viewport;
  }
  
  /**
   * Get viewport for a node
   */
  getViewport(node: any): Viewport | undefined {
    return this.viewports.get(node);
  }
  
  /**
   * Get root viewport
   */
  getRootViewport(): Viewport | null {
    return this.rootViewport;
  }
  
  /**
   * Clear all viewports
   */
  clear(): void {
    this.viewports.clear();
    this.rootViewport = null;
  }
  
  /**
   * Get singleton instance
   */
  static get(): ViewportManager {
    return this.instance || (this.instance = new ViewportManager());
  }
  
  private static instance: ViewportManager | null = null;
}
