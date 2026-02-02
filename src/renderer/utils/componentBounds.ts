/**
 * Component bounds tracking for hit testing and event handling
 * Tracks component positions and dimensions during rendering for mouse click detection
 */

import type { ConsoleNode } from '../../types';

/**
 * Component bounds information
 * Stores position and dimensions of a component for hit testing
 */
export interface ComponentBounds {
  component: ConsoleNode;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex?: number; // For layering (overlays, modals)
}

/**
 * Component bounds registry
 * Maps component references to their bounds for hit testing
 */
class ComponentBoundsRegistry {
  private bounds: Map<ConsoleNode, ComponentBounds> = new Map();
  private boundsByZIndex: ComponentBounds[] = []; // Sorted by z-index for hit testing

  // Double-buffer: staging area for new bounds during render
  private stagingBounds: Map<ConsoleNode, ComponentBounds> = new Map();
  private stagingByZIndex: ComponentBounds[] = [];
  private isRendering: boolean = false;

  /**
   * Start a new render cycle - subsequent registrations go to staging
   */
  beginRender(): void {
    this.isRendering = true;
    this.stagingBounds.clear();
    this.stagingByZIndex = [];
  }

  /**
   * End render cycle - swap staging to active (atomic operation)
   */
  endRender(): void {
    if (this.isRendering) {
      // Atomic swap - old bounds are available until this moment
      this.bounds = this.stagingBounds;
      this.boundsByZIndex = this.stagingByZIndex;
      this.stagingBounds = new Map();
      this.stagingByZIndex = [];
      this.isRendering = false;
    }
  }

  /**
   * Register component bounds
   * Called during rendering to track component positions
   */
  register(bounds: ComponentBounds): void {
    // During render, write to staging; otherwise write directly
    const targetBounds = this.isRendering ? this.stagingBounds : this.bounds;
    const targetByZIndex = this.isRendering ? this.stagingByZIndex : this.boundsByZIndex;

    targetBounds.set(bounds.component, bounds);

    // Update sorted array
    const index = targetByZIndex.findIndex((b) => b.component === bounds.component);
    if (index >= 0) {
      targetByZIndex[index] = bounds;
    } else {
      targetByZIndex.push(bounds);
    }

    // Sort by z-index (higher z-index on top)
    targetByZIndex.sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));
  }

  /**
   * Get bounds for a component
   */
  get(component: ConsoleNode): ComponentBounds | undefined {
    return this.bounds.get(component);
  }

  /**
   * Find component at mouse coordinates (hit testing)
   * Returns the topmost component (highest z-index) at the given coordinates
   */
  findAt(x: number, y: number): ConsoleNode | null {
    // Check components in reverse z-index order (topmost first)
    for (const bounds of this.boundsByZIndex) {
      if (this.isPointInBounds(x, y, bounds)) {
        return bounds.component;
      }
    }
    return null;
  }

  /**
   * Find all components at mouse coordinates
   * Returns all components at the given coordinates (for event propagation)
   */
  findAllAt(x: number, y: number): ConsoleNode[] {
    const components: ConsoleNode[] = [];
    for (const bounds of this.boundsByZIndex) {
      if (this.isPointInBounds(x, y, bounds)) {
        components.push(bounds.component);
      }
    }
    return components;
  }

  /**
   * Check if point is within component bounds
   */
  private isPointInBounds(x: number, y: number, bounds: ComponentBounds): boolean {
    return (
      x >= bounds.x && x < bounds.x + bounds.width && y >= bounds.y && y < bounds.y + bounds.height
    );
  }

  /**
   * Clear all bounds (called on re-render)
   * @deprecated Use beginRender()/endRender() for atomic updates
   */
  clear(): void {
    // Now just calls beginRender - actual clear happens at endRender
    this.beginRender();
  }

  /**
   * Get all registered bounds
   */
  getAll(): ComponentBounds[] {
    return Array.from(this.bounds.values());
  }
}

// Global registry instance
export const componentBoundsRegistry = new ComponentBoundsRegistry();

/**
 * Helper to create component bounds
 */
export function createComponentBounds(
  component: ConsoleNode,
  x: number,
  y: number,
  width: number,
  height: number,
  zIndex?: number
): ComponentBounds {
  return {
    component,
    x,
    y,
    width,
    height,
    zIndex: zIndex ?? component.zIndex,
  };
}
