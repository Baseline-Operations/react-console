/**
 * Component instance - tracks component in the tree (like React fibers)
 */

import type { Node } from '../nodes/base/Node';
import type { RenderingInfo } from '../nodes/base/mixins/Renderable';

/**
 * Component instance - tracks component in the tree (like React fibers)
 */
export class ComponentInstance {
  readonly node: Node;

  parent: ComponentInstance | null = null;
  children: ComponentInstance[] = [];
  sibling: ComponentInstance | null = null;

  mounted: boolean = false;
  updated: boolean = false;
  rendered: boolean = false;
  renderingInfo: RenderingInfo | null = null;

  needsUpdate: boolean = false;
  updatePriority: number = 0;

  constructor(node: Node) {
    this.node = node;
  }

  /**
   * Mount this instance to the tree
   */
  mount(parent: ComponentInstance | null): void {
    this.parent = parent;
    if (parent) {
      if (parent.children.length > 0) {
        const lastSibling = parent.children[parent.children.length - 1]!;
        lastSibling.sibling = this;
      }
      parent.children.push(this);
    }
    this.mounted = true;
  }

  /**
   * Unmount this instance from the tree
   */
  unmount(): void {
    if (this.parent) {
      const index = this.parent.children.indexOf(this);
      if (index >= 0) {
        this.parent.children.splice(index, 1);
      }
      if (index > 0) {
        const prevSibling = this.parent.children[index - 1];
        if (prevSibling) {
          prevSibling.sibling = this.sibling;
        }
      }
    }
    this.parent = null;
    this.sibling = null;
    this.mounted = false;
  }

  /**
   * Mark this instance for update
   */
  markForUpdate(priority: number = 0): void {
    this.needsUpdate = true;
    this.updatePriority = priority;
  }

  /**
   * Get all descendant instances
   */
  getDescendants(): ComponentInstance[] {
    const descendants: ComponentInstance[] = [];
    for (const child of this.children) {
      descendants.push(child);
      descendants.push(...child.getDescendants());
    }
    return descendants;
  }

  /**
   * Get all ancestor instances
   */
  getAncestors(): ComponentInstance[] {
    const ancestors: ComponentInstance[] = [];
    let current: ComponentInstance | null = this.parent;
    while (current) {
      ancestors.push(current);
      current = current.parent;
    }
    return ancestors;
  }
}
