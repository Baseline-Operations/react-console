/**
 * Layoutable Mixin - Adds layout capabilities to nodes
 * Type-safe using generics
 */

import type { Constructor, DisplayMode, BoundingBox } from '../types';
import { DisplayMode as DisplayModeEnum } from '../types';
import { Node } from '../Node';
import { StackingContext, StackingContextManager } from '../../../render/StackingContext';
import { ViewportManager } from '../../../render/Viewport';

/**
 * Layout constraints type
 */
export interface LayoutConstraints {
  maxWidth: number;
  maxHeight?: number;
  availableWidth?: number; // undefined means shrink-to-fit (flex items)
  availableHeight?: number;
}

/**
 * Dimensions type (exported for use in other modules)
 */
export interface Dimensions {
  width: number;
  height: number;
  contentWidth: number;
  contentHeight: number;
}

/**
 * Layout result type
 */
export interface LayoutResult {
  dimensions: Dimensions;
  layout: Record<string, unknown>;
  bounds: { x: number; y: number; width: number; height: number };
  children?: ChildLayout[];
}

/**
 * Child layout type
 */
export interface ChildLayout {
  node: Node;
  bounds: { x: number; y: number; width: number; height: number };
}

/**
 * Mixin that adds layout capabilities to a node
 * Type-safe using generics
 */
export function Layoutable<TBase extends Constructor<Node>>(Base: TBase) {
  // Mixins return classes that extend Base, but the final composed class will implement abstract methods
  return class LayoutableNode extends Base {
    // Layout state
    layoutDirty: boolean = true;
    display: DisplayMode = DisplayModeEnum.BLOCK;

    /**
     * Compute layout for this node
     * This method must be implemented by classes using this mixin
     */
    computeLayout(_constraints: LayoutConstraints): LayoutResult {
      throw new Error('computeLayout() must be implemented by classes using Layoutable mixin');
    }

    /**
     * Layout children (called by computeLayout)
     */
    layoutChildren(_constraints: LayoutConstraints): void {
      // Default: no layout (override in subclasses)
    }

    /**
     * Measure node dimensions
     */
    measure(constraints: LayoutConstraints): Dimensions {
      const layout = this.computeLayout(constraints);
      return layout.dimensions;
    }

    /**
     * Update stacking context
     */
    updateStackingContext(): void {
      interface StylableNode {
        computeStyle(): unknown;
      }
      interface NodeWithStackingContext {
        stackingContext?: unknown;
      }
      if (!('computeStyle' in this)) {
        return;
      }

      const style = (this as unknown as StylableNode).computeStyle();

      this.createsStackingContext = StackingContext.createsStackingContext(this, style);

      if (this.createsStackingContext) {
        const manager = StackingContextManager.get();
        this.stackingContext = manager.getContext(this, style);
      } else if (this.parent) {
        // Inherit parent's stacking context
        this.stackingContext = (this.parent as unknown as NodeWithStackingContext).stackingContext;
      }
    }

    /**
     * Update viewport
     */
    updateViewport(): void {
      interface NodeWithViewport {
        viewport?: { clip(bounds: BoundingBox): BoundingBox };
      }
      // Skip if bounds not set yet (will be set during layout)
      if (!this.bounds) return;

      const bounds = this.bounds;
      const manager = ViewportManager.get();

      if (this.isScrollable()) {
        this.viewport = manager.createViewport(this, bounds);
      } else if (this.parent) {
        // Inherit parent's viewport
        this.viewport = (this.parent as unknown as NodeWithViewport).viewport;
      }

      if (this.viewport) {
        this.clippingArea = this.viewport.clip(bounds);
      } else {
        this.clippingArea = bounds;
      }
    }

    isScrollable(): boolean {
      // Override in ScrollableNode
      return false;
    }

    markChildrenLayoutDirty(): void {
      for (const child of this.children) {
        if ('layoutDirty' in child) {
          (child as LayoutableNode).layoutDirty = true;
          (child as LayoutableNode).markChildrenLayoutDirty();
        }
      }
    }
  };
}
