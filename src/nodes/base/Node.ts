/**
 * Core base class for all nodes
 * Contains only essential functionality: identity, tree structure, box model
 */

import type {
  BoundingBox,
  BorderInfo,
  ContentArea,
  Margin,
  NodeState,
  Padding,
  Position,
} from './types';
import { Position as PositionEnum, BorderStyle } from './types';

/**
 * Generate unique ID for nodes
 */
let nodeIdCounter = 0;
function generateId(): string {
  return `node_${++nodeIdCounter}_${Date.now()}`;
}

/**
 * Core base class for all nodes in the rendering tree
 * Includes complete box model support for all nodes
 */
export abstract class Node {
  // Identity
  readonly id: string;
  readonly type: string;
  parent: Node | null = null;
  children: Node[] = [];
  
  // Box Model (ALL nodes have this)
  // Dimensions
  width: number | null = null;
  height: number | null = null;
  minWidth: number = 0;
  maxWidth: number | null = null;
  minHeight: number = 0;
  maxHeight: number | null = null;
  
  // Positioning (CSS default is static)
  position: Position = PositionEnum.STATIC;
  top: number | string | null = null;
  left: number | string | null = null;
  right: number | string | null = null;
  bottom: number | string | null = null;
  zIndex: number = 0;
  
  // Box Model
  margin: Margin = { top: 0, right: 0, bottom: 0, left: 0 };
  border: BorderInfo = {
    show: { top: false, right: false, bottom: false, left: false },
    width: { top: 0, right: 0, bottom: 0, left: 0 },
    style: BorderStyle.SINGLE,
    color: null,
    backgroundColor: null,
  };
  padding: Padding = { top: 0, right: 0, bottom: 0, left: 0 };
  
  // Computed Box Model
  contentArea: ContentArea | null = null;
  bounds: BoundingBox | null = null;
  borderBounds: BoundingBox | null = null;
  marginBounds: BoundingBox | null = null;
  
  // State
  state: NodeState = {
    mounted: false,
    visible: true,
    enabled: true,
  };
  
  // Content
  content: string | null = null;
  
  // Component Tree Tracking
  // Public for mixin compatibility, but should be treated as internal
  _componentInstanceBacking: import('../../tree/ComponentInstance').ComponentInstance | null = null;
  
  get componentInstance(): import('../../tree/ComponentInstance').ComponentInstance | null {
    if (!this._componentInstanceBacking) {
      try {
        this._componentInstanceBacking = this.createComponentInstance();
      } catch {
        // ComponentTree may not be available in test environments
        this._componentInstanceBacking = null;
      }
    }
    return this._componentInstanceBacking;
  }
  
  set componentInstance(value: import('../../tree/ComponentInstance').ComponentInstance | null) {
    this._componentInstanceBacking = value;
  }
  
  // Rendering Tree Tracking (will be implemented in Phase 3)
  renderingInfo: any | null = null;
  
  // Stacking Context (will be implemented in Phase 3)
  stackingContext: any | null = null;
  createsStackingContext: boolean = false;
  
  // Viewport/Clipping (will be implemented in Phase 3)
  viewport: any | null = null;
  clippingArea: BoundingBox | null = null;
  
  // Multi-buffer system integration
  layerId: string | null = null;
  
  constructor(id?: string) {
    this.id = id || generateId();
    this.type = this.getNodeType();
    // Component instance is created lazily via getter
  }
  
  /**
   * Create component instance (lazy loaded to avoid circular dependency)
   * Public for mixin compatibility
   */
  createComponentInstance(): any {
    // Lazy import to avoid circular dependency
    const { ComponentTree } = require('../../tree/ComponentTree');
    return ComponentTree.createInstance(this);
  }
  
  // Node type - must be implemented by subclasses
  // Default implementation throws - subclasses must override
  getNodeType(): string {
    throw new Error(`getNodeType() must be implemented by ${this.constructor.name}`);
  }
  
  // Lifecycle hooks (public for mixin compatibility)
  onMount(): void {
    this.state.mounted = true;
  }
  
  onUpdate(): void {
    // Mark for update
  }
  
  onUnmount(): void {
    this.state.mounted = false;
  }
  
  // Box Model Methods
  
  /**
   * Calculate content area from box model
   * Content area = bounds - border - padding
   */
  calculateContentArea(): ContentArea {
    if (!this.bounds) {
      throw new Error('Node not laid out');
    }
    
    const borderWidth = this.border.width;
    
    return {
      x: this.bounds.x + borderWidth.left + this.padding.left,
      y: this.bounds.y + borderWidth.top + this.padding.top,
      width: this.bounds.width - borderWidth.left - borderWidth.right - this.padding.left - this.padding.right,
      height: this.bounds.height - borderWidth.top - borderWidth.bottom - this.padding.top - this.padding.bottom,
    };
  }
  
  /**
   * Get content area
   */
  getContentArea(): ContentArea {
    if (!this.contentArea) {
      this.contentArea = this.calculateContentArea();
    }
    return this.contentArea;
  }
  
  /**
   * Get bounding box
   */
  getBounds(): BoundingBox {
    if (!this.bounds) {
      throw new Error('Node not laid out');
    }
    return this.bounds;
  }
  
  /**
   * Calculate border bounds (including border)
   */
  calculateBorderBounds(): BoundingBox {
    if (!this.bounds) {
      throw new Error('Node not laid out');
    }
    return { ...this.bounds };
  }
  
  /**
   * Calculate margin bounds (including margin)
   */
  calculateMarginBounds(): BoundingBox {
    if (!this.bounds) {
      throw new Error('Node not laid out');
    }
    return {
      x: this.bounds.x - this.margin.left,
      y: this.bounds.y - this.margin.top,
      width: this.bounds.width + this.margin.left + this.margin.right,
      height: this.bounds.height + this.margin.top + this.margin.bottom,
    };
  }
  
  // Positioning Methods
  
  /**
   * Calculate position based on positioning mode
   * Full implementation with all positioning modes
   * 
   * Positioning modes:
   * - static/relative: Position in normal flow, then apply offset (relative only)
   * - absolute: Position relative to parent's content area
   * - fixed: Position relative to terminal viewport
   * - sticky: Behaves like relative (scroll handling not implemented)
   */
  calculatePosition(
    parentX: number,
    parentY: number,
    parentWidth: number,
    parentHeight: number,
    terminalDims: { columns: number; rows: number },
    normalFlowX?: number,
    normalFlowY?: number,
    elementWidth?: number,
    elementHeight?: number
  ): { x: number; y: number } {
    // Default normal flow position to parent position
    const flowX = normalFlowX ?? parentX;
    const flowY = normalFlowY ?? parentY;
    const width = elementWidth ?? (this.bounds?.width ?? 0);
    const height = elementHeight ?? (this.bounds?.height ?? 0);
    
    let x = flowX;
    let y = flowY;
    
    if (this.position === PositionEnum.RELATIVE) {
      // Relative: start from normal flow position, then apply offsets
      // Offsets move the element from where it would normally be
      if (this.left !== null) {
        const left = typeof this.left === 'number' 
          ? this.left 
          : this.resolveSize(this.left, 'width', parentWidth) || 0;
        x = flowX + left;
      } else if (this.right !== null) {
        const right = typeof this.right === 'number'
          ? this.right
          : this.resolveSize(this.right, 'width', parentWidth) || 0;
        x = flowX - right;
      }
      
      if (this.top !== null) {
        const top = typeof this.top === 'number'
          ? this.top
          : this.resolveSize(this.top, 'height', parentHeight) || 0;
        y = flowY + top;
      } else if (this.bottom !== null) {
        const bottom = typeof this.bottom === 'number'
          ? this.bottom
          : this.resolveSize(this.bottom, 'height', parentHeight) || 0;
        y = flowY - bottom;
      }
    } else if (this.position === PositionEnum.ABSOLUTE) {
      // Absolute: position relative to parent's content area
      // Start from parent's position (top-left of parent's content area)
      x = parentX;
      y = parentY;
      
      if (this.left !== null) {
        const left = typeof this.left === 'number' 
          ? this.left 
          : this.resolveSize(this.left, 'width', parentWidth) || 0;
        x = parentX + left;
      } else if (this.right !== null) {
        const right = typeof this.right === 'number'
          ? this.right
          : this.resolveSize(this.right, 'width', parentWidth) || 0;
        // Right offset: position so element's right edge is 'right' pixels from parent's right edge
        x = parentX + parentWidth - width - right;
      }
      
      if (this.top !== null) {
        const top = typeof this.top === 'number'
          ? this.top
          : this.resolveSize(this.top, 'height', parentHeight) || 0;
        y = parentY + top;
      } else if (this.bottom !== null) {
        const bottom = typeof this.bottom === 'number'
          ? this.bottom
          : this.resolveSize(this.bottom, 'height', parentHeight) || 0;
        // Bottom offset: position so element's bottom edge is 'bottom' pixels from parent's bottom edge
        y = parentY + parentHeight - height - bottom;
      }
    } else if (this.position === PositionEnum.FIXED) {
      // Fixed: position relative to terminal viewport (0, 0)
      x = 0;
      y = 0;
      
      if (this.left !== null) {
        x = typeof this.left === 'number' 
          ? this.left 
          : this.resolveSize(this.left, 'width', terminalDims.columns) || 0;
      } else if (this.right !== null) {
        const right = typeof this.right === 'number'
          ? this.right
          : this.resolveSize(this.right, 'width', terminalDims.columns) || 0;
        x = terminalDims.columns - width - right;
      }
      
      if (this.top !== null) {
        y = typeof this.top === 'number'
          ? this.top
          : this.resolveSize(this.top, 'height', terminalDims.rows) || 0;
      } else if (this.bottom !== null) {
        const bottom = typeof this.bottom === 'number'
          ? this.bottom
          : this.resolveSize(this.bottom, 'height', terminalDims.rows) || 0;
        y = terminalDims.rows - height - bottom;
      }
    } else if (this.position === PositionEnum.STICKY) {
      // Sticky: behaves like relative (full scroll implementation not available)
      if (this.left !== null) {
        const left = typeof this.left === 'number'
          ? this.left
          : this.resolveSize(this.left, 'width', parentWidth) || 0;
        x = flowX + left;
      }
      
      if (this.top !== null) {
        const top = typeof this.top === 'number'
          ? this.top
          : this.resolveSize(this.top, 'height', parentHeight) || 0;
        y = flowY + top;
      }
    }
    // For static position, use the normal flow position (flowX, flowY)
    
    return { x, y };
  }
  
  /**
   * Resolve size string to number
   * Handles percentage strings like "50%", "10vh", etc.
   * Delegates to BoxModel.resolveSize for consistency
   */
  resolveSize(size: string | number, dimension: 'width' | 'height', reference: number): number | null {
    const { resolveSize: resolveSizeUtil } = require('../../layout/BoxModel');
    return resolveSizeUtil(size, dimension, reference);
  }
  
  // Tree Methods
  
  /**
   * Append child node
   */
  appendChild(child: Node): void {
    if (child.parent) {
      child.parent.removeChild(child);
    }
    child.parent = this;
    this.children.push(child);
    child.onMount();
    this.onUpdate();
  }
  
  /**
   * Remove child node
   */
  removeChild(child: Node): void {
    const index = this.children.indexOf(child);
    if (index >= 0) {
      this.children.splice(index, 1);
      child.parent = null;
      child.onUnmount();
      this.onUpdate();
    }
  }
  
  /**
   * Get ancestor nodes
   */
  getAncestors(): Node[] {
    const ancestors: Node[] = [];
    let current: Node | null = this.parent;
    while (current) {
      ancestors.push(current);
      current = current.parent;
    }
    return ancestors;
  }
  
  /**
   * Get descendant nodes
   */
  getDescendants(): Node[] {
    const descendants: Node[] = [];
    for (const child of this.children) {
      descendants.push(child);
      descendants.push(...child.getDescendants());
    }
    return descendants;
  }
  
  /**
   * Set content (for text nodes, etc.)
   */
  setContent(content: string | null): void {
    this.content = content;
    this.onUpdate();
  }
  
  /**
   * Orchestrate full render pipeline for this node tree
   * This method coordinates component tree, layout, stacking contexts, viewports, and rendering
   * Can be overridden by subclasses for custom orchestration
   */
  renderTree(buffer: import('./mixins/Renderable').OutputBuffer): void {
    // 0. Clear previous rendering state (if Renderable mixin is present)
    if ('clearRenderingState' in this) {
      (this as any).clearRenderingState();
    }
    
    // 1. Build component tree
    this.buildComponentTree();
    
    // 2. Calculate layouts
    this.calculateLayouts();
    
    // 3. Build stacking contexts
    this.buildStackingContexts();
    
    // 4. Build viewports
    this.buildViewports();
    
    // 5. Get rendering order (sorted by stacking context)
    // Currently unused as we render recursively from root, but call to build contexts
    this.getRenderingOrder();
    
    // 6. Create initial render context
    const terminalDims = require('../../utils/terminal').getTerminalDimensions();
    const context: import('./mixins/Renderable').RenderContext = {
      buffer,
      x: 0,
      y: 0,
      constraints: {
        maxWidth: terminalDims.columns,
        maxHeight: terminalDims.rows,
        availableWidth: terminalDims.columns,
        availableHeight: terminalDims.rows,
      },
      parent: null,
      theme: null,
      viewport: null,
    };
    
    // 7. Render the root node
    // BoxNode.render() recursively renders children with proper child contexts,
    // so we only need to render the root here. Rendering all nodes with root
    // context would override the correct child contexts.
    if ('render' in this) {
      (this as any).render(buffer, context);
    }
  }
  
  /**
   * Build component tree (recursive)
   * Can be overridden for custom tree building
   */
  buildComponentTree(): void {
    const { ComponentTreeRegistry } = require('../../tree/ComponentTree');
    const componentTree = ComponentTreeRegistry.get();
    const instance = componentTree.getInstance(this);
    
    if (instance && !instance.mounted) {
      componentTree.mount(this, this.parent);
    }
    
    for (const child of this.children) {
      child.buildComponentTree();
    }
  }
  
  /**
   * Calculate layouts for all nodes
   * NOTE: computeLayout on parent nodes recursively computes and sets child bounds,
   * so we only need to call it on the root - no need for recursive calculateLayouts calls
   */
  calculateLayouts(): void {
    if ('computeLayout' in this) {
      const constraints = this.getLayoutConstraints();
      (this as any).computeLayout(constraints);
    }
    // Don't recursively call calculateLayouts on children - 
    // parent's computeLayout already handles child layout and sets their bounds
  }
  
  /**
   * Build stacking contexts (recursive)
   * Can be overridden for custom stacking context building
   */
  buildStackingContexts(): void {
    if ('updateStackingContext' in this) {
      (this as any).updateStackingContext();
    }
    
    for (const child of this.children) {
      child.buildStackingContexts();
    }
  }
  
  /**
   * Build viewports (recursive)
   * Can be overridden for custom viewport building
   */
  buildViewports(): void {
    if ('updateViewport' in this) {
      (this as any).updateViewport();
    }
    
    for (const child of this.children) {
      child.buildViewports();
    }
  }
  
  /**
   * Get rendering order (sorted by stacking context)
   * Can be overridden for custom rendering order
   */
  getRenderingOrder(): Node[] {
    const { StackingContextManager } = require('../../render/StackingContext');
    const stackingContextManager = StackingContextManager.get();
    return stackingContextManager.getGlobalRenderingOrder();
  }
  
  /**
   * Get layout constraints for this node
   * Can be overridden for custom constraint calculation
   */
  getLayoutConstraints(): any {
    const parent = this.parent;
    if (!parent) {
      const dims = require('../../utils/terminal').getTerminalDimensions();
      return {
        maxWidth: dims.columns,
        maxHeight: dims.rows,
        availableWidth: dims.columns,
        availableHeight: dims.rows,
      };
    }
    
    if ('getContentArea' in parent) {
      const parentContentArea = parent.getContentArea();
      return {
        maxWidth: parentContentArea.width,
        maxHeight: parentContentArea.height,
        availableWidth: parentContentArea.width,
        availableHeight: parentContentArea.height,
      };
    }
    
    return {
      maxWidth: 0,
      maxHeight: 0,
      availableWidth: 0,
      availableHeight: 0,
    };
  }
  
  // Static callback for post-commit rendering
  static _onCommitCallback: (() => void) | null = null;
  
  /**
   * Register a callback to be called after React commits changes
   * This is used to trigger screen rendering after state updates
   */
  static setOnCommitCallback(callback: (() => void) | null): void {
    Node._onCommitCallback = callback;
  }
  
  /**
   * Create React Reconciler host config
   * This is the interface between React and the Node system
   * Returns the host config object required by react-reconciler
   */
  static createHostConfig(): any {
    const { NodeFactory } = require('../NodeFactory');
    const now = (): number => Date.now();
    
    const getPublicInstance = (instance: Node): Node => instance;
    
    const getRootHostContext = (): { x: number; y: number; width: number } => {
      return {
        x: 0,
        y: 0,
        width: process.stdout.columns ?? 80,
      };
    };
    
    const getChildHostContext = (
      parentHostContext: { x: number; y: number; width: number },
      _type: string,
      _props: Record<string, unknown>
    ): { x: number; y: number; width: number } => {
      return parentHostContext;
    };
    
    const prepareForCommit = (): void => {};
    const resetAfterCommit = (): void => {
      // Call the registered callback to trigger screen rendering
      // This ensures state updates result in visible screen changes
      // We access Node dynamically to get the current callback value
      const NodeClass = require('./Node').Node;
      if (NodeClass._onCommitCallback) {
        NodeClass._onCommitCallback();
      }
    };
    
    const createInstance = (
      type: string | any,
      props: Record<string, unknown>,
      _rootContainerInstance: unknown,
      _hostContext: { x: number; y: number; width: number },
      _internalInstanceHandle: unknown
    ): Node => {
      // Handle different type formats
      let typeString: string;
      
      if (typeof type === 'string') {
        typeString = type;
      } else if (typeof type === 'function') {
        // Function component - try to get name, or default to Box
        typeString = type.name || type.displayName || 'Box';
      } else if (type && typeof type === 'object') {
        // Object type - could be React element or other object
        if ('type' in type) {
          // Has type property - could be React element
          const innerType = type.type;
          if (typeof innerType === 'string') {
            typeString = innerType;
          } else if (typeof innerType === 'function') {
            typeString = innerType.name || innerType.displayName || 'Box';
          } else {
            typeString = 'Box';
          }
        } else if ('$$typeof' in type) {
          // React element with $$typeof - extract type
          const elementType = type.type;
          if (typeof elementType === 'string') {
            typeString = elementType;
          } else if (typeof elementType === 'function') {
            typeString = elementType.name || elementType.displayName || 'Box';
          } else {
            typeString = 'Box';
          }
        } else {
          // Unknown object - default to Box
          typeString = 'Box';
        }
      } else {
        typeString = 'Box';
      }
      
      const element = {
        type: typeString,
        props: props as any,
      } as import('react').ReactElement;
      
      return NodeFactory.createNode(element);
    };
    
    // Text instance type - mutable so we can update text content
    interface TextInstance {
      text: string;
      parentNode: Node | null;
    }
    
    const createTextInstance = (
      text: string,
      _rootContainerInstance: unknown,
      _hostContext: { x: number; y: number; width: number },
      _internalInstanceHandle: unknown
    ): TextInstance => {
      return { text, parentNode: null };
    };
    
    const appendInitialChild = (parentInstance: Node, child: Node | string | TextInstance): void => {
      // Handle TextInstance objects
      if (child && typeof child === 'object' && 'text' in child && 'parentNode' in child) {
        const textInstance = child as TextInstance;
        textInstance.parentNode = parentInstance;
        
        // If parent is a TextNode, set its content
        if (parentInstance.type === 'text') {
          parentInstance.setContent(textInstance.text);
        } else {
          // Otherwise create a TextNode child
          const textElement = {
            type: 'Text',
            props: { children: textInstance.text },
          } as import('react').ReactElement;
          const textNode = NodeFactory.createNode(textElement, parentInstance);
          parentInstance.appendChild(textNode);
        }
        return;
      }
      
      if (typeof child === 'string') {
        // Legacy string handling (shouldn't happen with new TextInstance)
        if (parentInstance.type === 'text') {
          return;
        }
        const textElement = {
          type: 'Text',
          props: { children: child },
        } as import('react').ReactElement;
        const textNode = NodeFactory.createNode(textElement, parentInstance);
        parentInstance.appendChild(textNode);
      } else {
        // child is a Node at this point (TextInstance was handled above)
        const nodeChild = child as Node;
        nodeChild.parent = parentInstance;
        parentInstance.appendChild(nodeChild);
      }
    };
    
    const finalizeInitialChildren = (): boolean => false;
    
    const prepareUpdate = (
      _instance: Node,
      _type: string,
      _oldProps: Record<string, unknown>,
      _newProps: Record<string, unknown>,
      _rootContainerInstance: unknown,
      _hostContext: { x: number; y: number; width: number }
    ): Record<string, unknown> | null => {
      return _newProps;
    };
    
    const shouldSetTextContent = (_type: string, _props: Record<string, unknown>): boolean => {
      return false;
    };
    
    const getCurrentEventPriority = (): number => 0;
    
    let currentUpdatePriority: number = 0;
    
    const resolveUpdatePriority = (): number => currentUpdatePriority;
    const setCurrentUpdatePriority = (priority: number): void => {
      currentUpdatePriority = priority;
    };
    const getCurrentUpdatePriority = (): number => currentUpdatePriority;
    const resolveEventType = (): string => 'unknown';
    const resolveEventTimeStamp = (): number => now();
    
    // Use default scheduling from react-reconciler
    // Only define scheduleTimeout which ink also defines
    const requestPostPaintCallback = (_callback: () => void): void => {};
    
    const appendChild = (parentInstance: Node, child: Node | string): void => {
      appendInitialChild(parentInstance, child);
    };
    
    const appendChildToContainer = (
      container: Node,
      child: Node | string
    ): void => {
      appendInitialChild(container, child);
    };
    
    const insertBefore = (
      parentInstance: Node,
      child: Node | string,
      beforeChild: Node | string
    ): void => {
      if (typeof child === 'string') {
        const textElement = {
          type: 'Text',
          props: { children: child },
        } as import('react').ReactElement;
        const textNode = NodeFactory.createNode(textElement, parentInstance);
        const beforeIndex = parentInstance.children.indexOf(beforeChild as Node);
        if (beforeIndex >= 0) {
          parentInstance.children.splice(beforeIndex, 0, textNode);
        } else {
          parentInstance.appendChild(textNode);
        }
      } else {
        const beforeIndex = parentInstance.children.indexOf(beforeChild as Node);
        if (beforeIndex >= 0) {
          child.parent = parentInstance;
          parentInstance.children.splice(beforeIndex, 0, child);
        } else {
          appendInitialChild(parentInstance, child);
        }
      }
    };
    
    const insertInContainerBefore = (
      container: Node,
      child: Node | string,
      beforeChild: Node | string
    ): void => {
      insertBefore(container, child, beforeChild);
    };
    
    const removeChild = (parentInstance: Node, child: Node | string): void => {
      if (typeof child === 'string') {
        const index = parentInstance.children.findIndex(
          (c) => c.content === child
        );
        if (index >= 0) {
          parentInstance.children.splice(index, 1);
        }
      } else {
        const index = parentInstance.children.indexOf(child);
        if (index >= 0) {
          parentInstance.children.splice(index, 1);
          child.parent = null;
        }
      }
    };
    
    const removeChildFromContainer = (
      container: Node,
      child: Node | string
    ): void => {
      removeChild(container, child);
    };
    
    const commitTextUpdate = (
      textInstance: TextInstance,
      _oldText: string,
      newText: string
    ): void => {
      // Update the text instance
      textInstance.text = newText;
      
      // Update the parent node's content if it's a TextNode
      if (textInstance.parentNode && textInstance.parentNode.type === 'text') {
        textInstance.parentNode.setContent(newText);
      }
    };
    
    const commitUpdate = (
      instance: Node,
      _type: string,
      _oldProps: Record<string, unknown>,
      newProps: Record<string, unknown>,
      _internalHandle: unknown
    ): void => {
      // react-reconciler 0.31 passes: instance, type, oldProps, newProps, internalHandle
      // Note: the order is oldProps THEN newProps (opposite of what some docs suggest)
      
      if (newProps.style && 'setStyle' in instance) {
        (instance as any).setStyle(newProps.style);
      }
      
      if ('onClick' in newProps && 'onClick' in instance) {
        (instance as any).onClick = newProps.onClick;
      }
      if ('onPress' in newProps && 'onPress' in instance) {
        (instance as any).onPress = newProps.onPress;
      }
      if ('onKeyDown' in newProps && 'onKeyDown' in instance) {
        (instance as any).onKeyDown = newProps.onKeyDown;
      }
      if ('onChange' in newProps && 'onChange' in instance) {
        (instance as any).onChange = newProps.onChange;
      }
      if ('onFocus' in newProps && 'onFocus' in instance) {
        (instance as any).onFocus = newProps.onFocus;
      }
      if ('onBlur' in newProps && 'onBlur' in instance) {
        (instance as any).onBlur = newProps.onBlur;
      }
      
      if (newProps.children !== undefined && 'setContent' in instance) {
        (instance as any).setContent(String(newProps.children));
      }
      
      if (newProps.value !== undefined && 'setValue' in instance) {
        (instance as any).setValue(newProps.value);
      }
    };
    
    const hideInstance = (): void => {};
    const hideTextInstance = (): void => {};
    const unhideInstance = (): void => {};
    const unhideTextInstance = (): void => {};
    
    const clearContainer = (container: Node): void => {
      container.children = [];
    };
    
    const maySuspendCommit = (_type: string, _props: Record<string, unknown>): boolean => false;
    const preloadInstance = (_type: string, _props: Record<string, unknown>): void => {};
    const startSuspendingCommit = (): void => {};
    const suspendInstance = (_type: string, _props: Record<string, unknown>): void => {};
    const waitForCommitToBeReady = (): ((initiateCommit: () => void) => () => void) | null => null;
    
    // Called when a fiber is deleted to clean up any associated resources
    const detachDeletedInstance = (_instance: Node): void => {
      // Clean up any references or resources
      // This is called after the component has been unmounted
    };
    
    return {
      now,
      getPublicInstance,
      getRootHostContext,
      getChildHostContext,
      prepareForCommit,
      resetAfterCommit,
      createInstance,
      createTextInstance,
      appendInitialChild,
      finalizeInitialChildren,
      prepareUpdate,
      shouldSetTextContent,
      getCurrentEventPriority,
      resolveUpdatePriority,
      setCurrentUpdatePriority,
      getCurrentUpdatePriority,
      resolveEventType,
      resolveEventTimeStamp,
      // Let react-reconciler use default scheduling
      scheduleTimeout: setTimeout,
      cancelTimeout: clearTimeout,
      noTimeout: -1,
      appendChild,
      appendChildToContainer,
      insertBefore,
      insertInContainerBefore,
      removeChild,
      removeChildFromContainer,
      commitTextUpdate,
      commitUpdate,
      hideInstance,
      hideTextInstance,
      unhideInstance,
      unhideTextInstance,
      clearContainer,
      supportsMutation: true,
      supportsPersistence: false,
      supportsHydration: false,
      NotPendingTransition: null,
      HostTransitionContext: null,
      requestPostPaintCallback,
      shouldAttemptEagerTransition: () => false,
      resetFormInstance: () => {},
      maySuspendCommit,
      preloadInstance,
      startSuspendingCommit,
      suspendInstance,
      waitForCommitToBeReady,
      detachDeletedInstance,
      // Instance lifecycle callbacks
      beforeActiveInstanceBlur: () => {},
      afterActiveInstanceBlur: () => {},
      prepareScopeUpdate: () => {},
      getInstanceFromScope: () => null,
      getInstanceFromNode: () => null,
    };
  }
  
  /**
   * Main render entry point - renders React elements to console
   * This is the primary API for users
   */
  static render(
    element: any,
    options?: {
      mode?: 'static' | 'interactive' | 'fullscreen';
      fullscreen?: boolean;
      onUpdate?: () => void;
      appId?: string;
    }
  ): string | void {
    // Lazy imports to avoid circular dependency with reconciler
    // Note: reconciler.ts imports Node, creating a circular dependency.
    // We use require() here which handles circular deps at runtime.
    
    // Get reconciler with fallback path resolution for test environments
    let reconciler: any;
    try {
      reconciler = require('../../renderer/reconciler').reconciler;
    } catch (err: any) {
      // In test environments (Vitest), relative paths might not resolve correctly
      // Try using path from project root
      try {
        const path = require('path');
        const rootPath = path.resolve(process.cwd(), 'src/renderer/reconciler');
        reconciler = require(rootPath).reconciler;
      } catch {
        // If that fails, the module system might be ESM - but we can't use async import here
        // Re-throw original error with helpful message
        throw new Error(
          `Failed to load reconciler from '../../renderer/reconciler'. ` +
          `Original error: ${err?.message || err}. ` +
          `This may be a module resolution issue in the test environment.`
        );
      }
    }
    
    const { getBufferRenderer, resetBufferRenderer } = require('../../buffer');
    const { hideCursor, showCursor } = require('../../renderer/ansi');
    const { startInputListener } = require('../../renderer/input');
    const { getTerminalDimensions, onTerminalResizeDebounced, setRenderMode } = require('../../utils/terminal');
    const { reportError, ErrorType } = require('../../utils/errors');
    const { initializeStorage } = require('../../utils/storage');
    const { scheduleBatchedUpdate } = require('../../renderer/batching');
    const { BoxNode } = require('../primitives/BoxNode');
    const {
      collectInteractiveComponents,
      assignTabIndexes,
      handleTabNavigation,
      handleMouseEvent,
      focusComponent,
      findAllOverlays,
    } = require('../../renderer/utils/navigation');
    const { componentBoundsRegistry } = require('../../renderer/utils/componentBounds');
    const { terminal, updateTerminalDimensions } = require('../../utils/globalTerminal');
    
    const mode = options?.mode || 'static';
    const fullscreen = options?.fullscreen || false;
    let renderCallback: (() => void) | null = options?.onUpdate || null;
    
    // Set render mode early so terminal dimensions are correct
    setRenderMode(mode === 'static' ? 'static' : 'interactive');
    resetBufferRenderer(); // Reset buffer renderer with new dimensions
    
    initializeStorage(options?.appId);
    
    let rootFiber: any = null;
    let currentElement: import('react').ReactElement | null = null;
    let isInteractive = false;
    let resizeCleanup: (() => void) | null = null;
    let previousFocusedComponent: Node | null = null;
    let overlayStack: Node[] = [];
    
    if (!rootFiber) {
      try {
        // Dynamic import for optional lifecycle hooks
        import('../../hooks/lifecycle').then(lifecycle => {
          if (lifecycle?.notifyAppStart) {
            lifecycle.notifyAppStart();
          }
        }).catch(() => {
          // Hooks module may not be loaded yet
        });
      } catch {
        // Ignore
      }
    }
    
    isInteractive = mode === 'interactive' || mode === 'fullscreen';
    currentElement = element;
    
    // Create root container using new Node system
    let rootContainer: Node = new BoxNode() as unknown as Node;
    if (fullscreen || mode === 'fullscreen') {
      if ('setStyle' in rootContainer) {
        (rootContainer as any).setStyle({ width: '100%', height: '100%' });
      }
    }
    
    // Create reconciler container
    if (!rootFiber) {
      // Use LegacyRoot (0) for all modes - ConcurrentRoot has scheduling issues
      const rootTag = 0;
      
      rootFiber = reconciler.createContainer(
        rootContainer,
        rootTag,
        null,
        false,
        false,
        '',
        (error: Error) => {
          reportError(error, ErrorType.RENDER);
        },
        null
      );
    }
    
    // Track if this is first render
    let isFirstRender = true;
    
    // Update through React reconciliation
    const performRender = (): string | void => {
      if (rootContainer) {
        try {
          // Hide cursor during render
          process.stdout.write(hideCursor());
          
          componentBoundsRegistry.clear();
          
          const dims = getTerminalDimensions();
          terminal.dimensions = dims;
          
          const currentOverlays = findAllOverlays(rootContainer);
          const previousOverlayCount = overlayStack.length;
          const currentOverlayCount = currentOverlays.length;
          
          if (currentOverlayCount > previousOverlayCount && previousFocusedComponent === null) {
            previousFocusedComponent = terminal.focusedComponent as Node | null;
          }
          
          if (currentOverlayCount < previousOverlayCount && previousFocusedComponent) {
            const interactiveComponents: Node[] = [];
            collectInteractiveComponents(rootContainer, interactiveComponents);
            if (previousFocusedComponent && interactiveComponents.includes(previousFocusedComponent)) {
              focusComponent(previousFocusedComponent, interactiveComponents, scheduleUpdate);
            }
            previousFocusedComponent = null;
          }
          
          overlayStack = currentOverlays;
          
          // Build component tree, layouts, stacking contexts, and viewports
          if ('buildComponentTree' in rootContainer) {
            (rootContainer as any).buildComponentTree();
          }
          if ('calculateLayouts' in rootContainer) {
            (rootContainer as any).calculateLayouts();
          }
          if ('buildStackingContexts' in rootContainer) {
            (rootContainer as any).buildStackingContexts();
          }
          if ('buildViewports' in rootContainer) {
            (rootContainer as any).buildViewports();
          }
          
          // Use the multi-buffer renderer
          const bufferRenderer = getBufferRenderer();
          bufferRenderer.render(rootContainer, {
            mode: isInteractive ? 'interactive' : 'static',
            fullRedraw: isFirstRender,
            clearScreen: isInteractive && isFirstRender,
          });
          
          isFirstRender = false;
          
          // Show cursor after render
          process.stdout.write(showCursor());
          
          if (renderCallback) {
            renderCallback();
          }
        } catch (error) {
          try {
            process.stdout.write('\n[Render Error: ' + String(error) + ']\n');
            process.stdout.write(showCursor());
          } catch {
            console.error('Render error:', error);
          }
          reportError(error, ErrorType.RENDER, { 
            nodeType: rootContainer.type,
          });
        }
      }
    };
    
    // Register the render callback for interactive mode
    // This ensures state updates trigger screen rendering
    if (isInteractive) {
      Node.setOnCommitCallback(performRender);
    }
    
    let outputResult: string | void = undefined;
    
    try {
      // Use synchronous updates for both static and interactive modes
      // This ensures the render callback fires immediately
      if (typeof (reconciler as any).updateContainerSync === 'function') {
        (reconciler as any).updateContainerSync(element, rootFiber, null, () => {
          outputResult = performRender();
        });
        if (typeof (reconciler as any).flushSyncWork === 'function') {
          (reconciler as any).flushSyncWork();
        }
      } else {
        // Fallback for older react-reconciler versions
        reconciler.updateContainer(element, rootFiber, null, () => {
          outputResult = performRender();
        });
      }
    } catch (error) {
      reportError(error, ErrorType.RENDER);
      throw error;
    }
    
    // For static mode, return immediately
    if (mode === 'static' && !isInteractive) {
      return outputResult;
    }
    
    // Set up terminal resize listener for interactive mode
    const prevResizeCleanup = resizeCleanup as (() => void) | null;
    if (prevResizeCleanup) {
      prevResizeCleanup();
      resizeCleanup = null;
    }
    resizeCleanup = onTerminalResizeDebounced(() => {
      updateTerminalDimensions();
      
      if (currentElement && rootFiber) {
        reconciler.updateContainer(currentElement, rootFiber, null, () => {
          performRender();
        });
      }
    }, 100);
    
    // Schedule update function (defined before setupInputHandling so it can be used there)
    const scheduleUpdate = (): void => {
      scheduleBatchedUpdate(() => {
        if (currentElement && rootFiber) {
          reconciler.updateContainer(currentElement, rootFiber, null, () => {
            performRender();
          });
        } else if (rootContainer) {
          performRender();
        }
      });
    };
    
    // Setup input handling for interactive components
    const setupInputHandling = (root: Node): void => {
      const interactiveComponents: Node[] = [];
      collectInteractiveComponents(root, interactiveComponents);
      
      assignTabIndexes(interactiveComponents);
      
      const firstAutoFocusComponent = interactiveComponents.find(
        (comp) => ('autoFocus' in comp && (comp as any).autoFocus) && ('disabled' in comp && !(comp as any).disabled)
      );
      if (firstAutoFocusComponent) {
        (firstAutoFocusComponent as any).focused = true;
        terminal.setFocusedComponent(firstAutoFocusComponent as any);
        if ('onFocus' in firstAutoFocusComponent && (firstAutoFocusComponent as any).onFocus) {
          (firstAutoFocusComponent as any).onFocus();
        }
      }
      
      startInputListener((_chunk: string, key: any, mouse: any) => {
        try {
          if (mouse) {
            handleMouseEvent(mouse, interactiveComponents, scheduleUpdate);
            return;
          }
          
          if (key) {
            if (key.tab) {
              handleTabNavigation(interactiveComponents, key.shift, scheduleUpdate, root);
              return;
            }
            
            if (key.escape) {
              for (const comp of interactiveComponents) {
                if (comp.type === 'dropdown' && 'isOpen' in comp && (comp as any).isOpen) {
                  (comp as any).isOpen = false;
                  scheduleUpdate();
                  return;
                }
              }
            }
            
            const focused = interactiveComponents.find((comp) => 'focused' in comp && (comp as any).focused);
            
            if (focused) {
              if (!('disabled' in focused) || !(focused as any).disabled) {
                const keyboardEvent: any = {
                  key,
                  _propagationStopped: false,
                  stopPropagation: () => {
                    keyboardEvent._propagationStopped = true;
                  },
                  preventDefault: () => {},
                };
                
                if ('onKeyDown' in focused && (focused as any).onKeyDown) {
                  (focused as any).onKeyDown(keyboardEvent);
                }
                
                if (!keyboardEvent._propagationStopped) {
                  if ('handleKeyboardEvent' in focused) {
                    (focused as any).handleKeyboardEvent(key);
                  }
                }
              }
            }
            
            if (!focused && interactiveComponents.length > 0) {
              const focusableComponents = interactiveComponents.filter((comp) => {
                const disabled = 'disabled' in comp ? (comp as any).disabled : false;
                const tabIndex = 'tabIndex' in comp ? (comp as any).tabIndex : undefined;
                return !disabled && (tabIndex === undefined || tabIndex >= 0);
              });
              if (focusableComponents.length > 0) {
                const sorted = [...focusableComponents].sort((a, b) => {
                  const aTabIndex = 'tabIndex' in a ? (a as any).tabIndex : undefined;
                  const bTabIndex = 'tabIndex' in b ? (b as any).tabIndex : undefined;
                  return (aTabIndex || 0) - (bTabIndex || 0);
                });
                const first = sorted[0]!;
                (first as any).focused = true;
                terminal.setFocusedComponent(first as any);
                if ('onFocus' in first && (first as any).onFocus) {
                  (first as any).onFocus();
                }
                scheduleUpdate();
              }
            }
          }
        } catch (error) {
          reportError(error, ErrorType.INPUT_PARSING, {
            hasKey: !!key,
            hasMouse: !!mouse,
            chunkLength: _chunk?.length || 0,
          });
        }
      });
    };
    
    // Start input listener if interactive
    if (isInteractive) {
      setupInputHandling(rootContainer);
    }
  }
  
  /**
   * Unmount the rendered React application
   */
  static unmount(): void {
    // Implementation would need access to rootFiber and other state
    // For now, this is a placeholder
  }
  
  /**
   * Exit the application after rendering
   */
  static exit(exitCode: number = 0): void {
    try {
      const { notifyAppExit } = require('../../hooks/lifecycle');
      notifyAppExit();
    } catch {
      // Hooks module may not be loaded yet
    }
    
    Node.unmount();
    process.exit(exitCode);
  }
}
