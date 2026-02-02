/**
 * Component tree - tracks all component instances (like React's fiber tree)
 */

import type { Node } from '../nodes/base/Node';
import { ComponentInstance } from './ComponentInstance';

/**
 * Component tree - tracks all component instances (like React's fiber tree)
 */
export class ComponentTree {
  private instances: Map<Node, ComponentInstance> = new Map();
  private root: ComponentInstance | null = null;

  /**
   * Create or get component instance for a node
   */
  static createInstance(node: Node): ComponentInstance {
    const tree = ComponentTreeRegistry.get();
    let instance = tree.instances.get(node);
    if (!instance) {
      instance = new ComponentInstance(node);
      tree.instances.set(node, instance);
    }
    return instance;
  }

  /**
   * Mount a node to the tree
   */
  mount(node: Node, parent: Node | null): void {
    const instance = this.instances.get(node);
    if (!instance) return;

    const parentInstance = parent ? (this.instances.get(parent) ?? null) : null;
    instance.mount(parentInstance);

    if (!this.root && !parent) {
      this.root = instance;
    }
  }

  /**
   * Unmount a node from the tree
   */
  unmount(node: Node): void {
    const instance = this.instances.get(node);
    if (!instance) return;

    instance.unmount();

    if (this.root === instance) {
      this.root = null;
    }
  }

  /**
   * Get instance for a node
   */
  getInstance(node: Node): ComponentInstance | undefined {
    return this.instances.get(node);
  }

  /**
   * Get root instance
   */
  getRoot(): ComponentInstance | null {
    return this.root;
  }

  /**
   * Clear all instances
   */
  clear(): void {
    this.instances.clear();
    this.root = null;
  }
}

/**
 * Component tree registry - singleton instance
 */
class ComponentTreeRegistry {
  private static tree: ComponentTree = new ComponentTree();

  static get(): ComponentTree {
    return this.tree;
  }

  static reset(): void {
    this.tree = new ComponentTree();
  }
}

export { ComponentTreeRegistry };
