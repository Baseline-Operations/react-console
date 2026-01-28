/**
 * Rendering tree - tracks what's in the buffer for each component
 */

import type { Node } from '../nodes/base/Node';
import type { BufferRegion, RenderingInfo } from '../nodes/base/mixins/Renderable';

/**
 * Rendering tree - tracks what's in the buffer for each component
 */
export class RenderingTree {
  private renderingInfo: Map<Node, RenderingInfo> = new Map();
  private root: RenderingInfo | null = null;
  
  /**
   * Register rendering info for a component
   */
  register(info: RenderingInfo): void {
    this.renderingInfo.set(info.component, info);
    
    const parent = info.component.parent;
    if (parent) {
      const parentInfo = this.renderingInfo.get(parent);
      if (parentInfo) {
        parentInfo.children.push(info);
      }
    } else {
      this.root = info;
    }
  }
  
  /**
   * Get rendering info for a component
   */
  get(component: Node): RenderingInfo | undefined {
    return this.renderingInfo.get(component);
  }
  
  /**
   * Get all components in a buffer region
   */
  getComponentsInRegion(region: BufferRegion): Node[] {
    const components: Node[] = [];
    for (const info of this.renderingInfo.values()) {
      if (this.regionsIntersect(info.bufferRegion, region)) {
        components.push(info.component);
      }
    }
    return components;
  }
  
  /**
   * Get all visible components
   */
  getVisibleComponents(): Node[] {
    const visible: Node[] = [];
    for (const info of this.renderingInfo.values()) {
      if (info.visible && !info.clipped) {
        visible.push(info.component);
      }
    }
    return visible;
  }
  
  /**
   * Get components sorted by z-index
   */
  getComponentsByZIndex(): Node[] {
    const sorted = Array.from(this.renderingInfo.values())
      .sort((a, b) => a.zIndex - b.zIndex);
    return sorted.map(info => info.component);
  }
  
  /**
   * Get root rendering info
   */
  getRoot(): RenderingInfo | null {
    return this.root;
  }
  
  /**
   * Clear all rendering info
   */
  clear(): void {
    this.renderingInfo.clear();
    this.root = null;
  }
  
  /**
   * Check if two buffer regions intersect
   */
  private regionsIntersect(a: BufferRegion, b: BufferRegion): boolean {
    return !(
      a.endX <= b.startX ||
      b.endX <= a.startX ||
      a.endY <= b.startY ||
      b.endY <= a.startY
    );
  }
}

/**
 * Rendering tree registry - singleton instance
 */
class RenderingTreeRegistry {
  private static tree: RenderingTree = new RenderingTree();
  
  static get(): RenderingTree {
    return this.tree;
  }
  
  static reset(): void {
    this.tree = new RenderingTree();
  }
}

export { RenderingTreeRegistry };
