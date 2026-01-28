/**
 * Stacking context - manages z-index and rendering order (like CSS)
 */

import type { Node } from '../nodes/base/Node';
import type { ComputedStyle } from '../nodes/base/mixins/Stylable';
import { Position as PositionEnum, DisplayMode as DisplayModeEnum } from '../nodes/base/types';

/**
 * Stacking context - manages z-index and rendering order (like CSS)
 */
export class StackingContext {
  readonly root: Node;
  readonly zIndex: number;
  
  private children: Array<{ node: Node; zIndex: number }> = [];
  parent: StackingContext | null = null;
  childContexts: StackingContext[] = [];
  
  constructor(root: Node, zIndex: number = 0) {
    this.root = root;
    this.zIndex = zIndex;
  }
  
  /**
   * Add node to this stacking context
   */
  addNode(node: Node, zIndex: number): void {
    this.children.push({ node, zIndex });
    this.sortChildren();
  }
  
  /**
   * Remove node from this stacking context
   */
  removeNode(node: Node): void {
    this.children = this.children.filter(c => c.node !== node);
  }
  
  /**
   * Add child stacking context
   */
  addChildContext(context: StackingContext): void {
    context.parent = this;
    this.childContexts.push(context);
    this.sortChildContexts();
  }
  
  /**
   * Get rendering order for all nodes in this context and child contexts
   * Follows CSS stacking context rules
   */
  getRenderingOrder(): Node[] {
    const order: Node[] = [];
    
    // 1. Background and borders of root
    order.push(this.root);
    
    // 2. Child stacking contexts with negative z-index
    const negativeContexts = this.childContexts
      .filter(c => c.zIndex < 0)
      .sort((a, b) => a.zIndex - b.zIndex);
    for (const context of negativeContexts) {
      order.push(...context.getRenderingOrder());
    }
    
    // 3. Non-positioned children
    const nonPositioned = this.children
      .filter(c => !this.isPositioned(c.node))
      .sort((a, b) => a.zIndex - b.zIndex);
    for (const child of nonPositioned) {
      order.push(child.node);
    }
    
    // 4. Child stacking contexts with z-index 0
    const zeroContexts = this.childContexts
      .filter(c => c.zIndex === 0);
    for (const context of zeroContexts) {
      order.push(...context.getRenderingOrder());
    }
    
    // 5. Positioned children with z-index 0
    const positionedZero = this.children
      .filter(c => this.isPositioned(c.node) && c.zIndex === 0);
    for (const child of positionedZero) {
      order.push(child.node);
    }
    
    // 6. Child stacking contexts with positive z-index
    const positiveContexts = this.childContexts
      .filter(c => c.zIndex > 0)
      .sort((a, b) => a.zIndex - b.zIndex);
    for (const context of positiveContexts) {
      order.push(...context.getRenderingOrder());
    }
    
    // 7. Positioned children with positive z-index
    const positionedPositive = this.children
      .filter(c => this.isPositioned(c.node) && c.zIndex > 0)
      .sort((a, b) => a.zIndex - b.zIndex);
    for (const child of positionedPositive) {
      order.push(child.node);
    }
    
    return order;
  }
  
  /**
   * Check if a stacking context should be created for a node
   * Follows CSS stacking context creation rules
   */
  static createsStackingContext(node: Node, style: ComputedStyle): boolean {
    if (!node.parent) {
      return true; // Root always creates stacking context
    }
    
    const position = style.getPosition();
    const zIndex = style.getZIndex();
    
    // Positioned element with z-index creates stacking context
    if ((position === PositionEnum.ABSOLUTE || position === PositionEnum.FIXED || 
         position === PositionEnum.RELATIVE || position === PositionEnum.STICKY) && 
        zIndex !== null && zIndex !== 0) {
      return true;
    }
    
    // Fixed or sticky positioning always creates stacking context
    if (position === PositionEnum.FIXED || position === PositionEnum.STICKY) {
      return true;
    }
    
    // Flex or grid container with z-index creates stacking context
    const display = style.getDisplay();
    if ((display === DisplayModeEnum.FLEX || display === DisplayModeEnum.GRID) && 
        zIndex !== null && zIndex !== 0) {
      return true;
    }
    
    return false;
  }
  
  /**
   * Check if node is positioned
   */
  private isPositioned(node: Node): boolean {
    const position = node.position;
    return position === PositionEnum.ABSOLUTE || 
           position === PositionEnum.FIXED || 
           position === PositionEnum.RELATIVE || 
           position === PositionEnum.STICKY;
  }
  
  /**
   * Sort children by z-index
   */
  private sortChildren(): void {
    this.children.sort((a, b) => a.zIndex - b.zIndex);
  }
  
  /**
   * Sort child contexts by z-index
   */
  private sortChildContexts(): void {
    this.childContexts.sort((a, b) => a.zIndex - b.zIndex);
  }
}

/**
 * Stacking context manager - manages all stacking contexts
 */
export class StackingContextManager {
  private contexts: Map<Node, StackingContext> = new Map();
  private rootContext: StackingContext | null = null;
  
  /**
   * Get or create stacking context for a node
   */
  getContext(node: Node, style: ComputedStyle): StackingContext {
    let context = this.contexts.get(node);
    if (!context) {
      const zIndex = style.getZIndex() || 0;
      context = new StackingContext(node, zIndex);
      this.contexts.set(node, context);
      
      if (node.parent) {
        const parentStyle = 'computeStyle' in node.parent 
          ? (node.parent as any).computeStyle() 
          : null;
        if (parentStyle) {
          const parentContext = this.getContext(node.parent, parentStyle);
          parentContext.addChildContext(context);
        }
      } else {
        this.rootContext = context;
      }
    }
    return context;
  }
  
  /**
   * Get root stacking context
   */
  getRootContext(): StackingContext | null {
    return this.rootContext;
  }
  
  /**
   * Get global rendering order (all nodes sorted by stacking)
   */
  getGlobalRenderingOrder(): Node[] {
    if (!this.rootContext) {
      return [];
    }
    return this.rootContext.getRenderingOrder();
  }
  
  /**
   * Clear all contexts
   */
  clear(): void {
    this.contexts.clear();
    this.rootContext = null;
  }
  
  /**
   * Get singleton instance
   */
  static get(): StackingContextManager {
    return this.instance || (this.instance = new StackingContextManager());
  }
  
  private static instance: StackingContextManager | null = null;
}
