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
import { decodeHtmlEntities } from '../../utils/measure';
import { debug } from '../../utils/debug';
import type { ViewStyle, TextStyle } from '../../types';

// Types for dynamic node capabilities
interface RenderingInfo {
  layerId?: string;
  zIndex?: number;
}

interface StackingContextInfo {
  zIndex: number;
  nodes: Node[];
}

interface ViewportInfo {
  bounds: BoundingBox;
  scrollOffset?: { x: number; y: number };
}

// Extended node interface for mixin capabilities
interface RenderableNode {
  clearRenderingState?(): void;
  render?(buffer: unknown, context: unknown): void;
  computeLayout?(constraints: unknown): unknown;
  updateStackingContext?(): void;
  updateViewport?(): void;
  setStyle?(style: ViewStyle | TextStyle): void;
  setContent?(content: string): void;
  setValue?(value: unknown): void;
  setLabel?(label: string): void;
  onClick?: (event: unknown) => void;
  onPress?: (event: unknown) => void;
  onKeyDown?: (event: unknown) => void;
  onChange?: (event: unknown) => void;
  onFocus?: (event?: unknown) => void;
  onBlur?: () => void;
  onSubmit?: (event: unknown) => void;
  disabled?: boolean;
  tabIndex?: number;
  autoFocus?: boolean;
  componentId?: string;
  disabledStyle?: ViewStyle | TextStyle;
  focusedStyle?: ViewStyle | TextStyle;
  pressedStyle?: ViewStyle | TextStyle;
  hoveredStyle?: ViewStyle | TextStyle;
}

// Interface for interactive/focusable nodes
interface FocusableNode extends Node {
  focused?: boolean;
  disabled?: boolean;
  tabIndex?: number;
  autoFocus?: boolean;
  onFocus?: (event?: unknown) => void;
  onBlur?: () => void;
}

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
  renderingInfo: RenderingInfo | null = null;

  // Stacking Context (will be implemented in Phase 3)
  stackingContext: StackingContextInfo | null = null;
  createsStackingContext: boolean = false;

  // Viewport/Clipping (will be implemented in Phase 3)
  viewport: ViewportInfo | null = null;
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
  createComponentInstance(): import('../../tree/ComponentInstance').ComponentInstance | null {
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
      width:
        this.bounds.width -
        borderWidth.left -
        borderWidth.right -
        this.padding.left -
        this.padding.right,
      height:
        this.bounds.height -
        borderWidth.top -
        borderWidth.bottom -
        this.padding.top -
        this.padding.bottom,
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
    const width = elementWidth ?? this.bounds?.width ?? 0;
    const height = elementHeight ?? this.bounds?.height ?? 0;

    let x = flowX;
    let y = flowY;

    if (this.position === PositionEnum.RELATIVE) {
      // Relative: start from normal flow position, then apply offsets
      // Offsets move the element from where it would normally be
      if (this.left !== null) {
        const left =
          typeof this.left === 'number'
            ? this.left
            : this.resolveSize(this.left, 'width', parentWidth) || 0;
        x = flowX + left;
      } else if (this.right !== null) {
        const right =
          typeof this.right === 'number'
            ? this.right
            : this.resolveSize(this.right, 'width', parentWidth) || 0;
        x = flowX - right;
      }

      if (this.top !== null) {
        const top =
          typeof this.top === 'number'
            ? this.top
            : this.resolveSize(this.top, 'height', parentHeight) || 0;
        y = flowY + top;
      } else if (this.bottom !== null) {
        const bottom =
          typeof this.bottom === 'number'
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
        const left =
          typeof this.left === 'number'
            ? this.left
            : this.resolveSize(this.left, 'width', parentWidth) || 0;
        x = parentX + left;
      } else if (this.right !== null) {
        const right =
          typeof this.right === 'number'
            ? this.right
            : this.resolveSize(this.right, 'width', parentWidth) || 0;
        // Right offset: position so element's right edge is 'right' pixels from parent's right edge
        x = parentX + parentWidth - width - right;
      }

      if (this.top !== null) {
        const top =
          typeof this.top === 'number'
            ? this.top
            : this.resolveSize(this.top, 'height', parentHeight) || 0;
        y = parentY + top;
      } else if (this.bottom !== null) {
        const bottom =
          typeof this.bottom === 'number'
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
        x =
          typeof this.left === 'number'
            ? this.left
            : this.resolveSize(this.left, 'width', terminalDims.columns) || 0;
      } else if (this.right !== null) {
        const right =
          typeof this.right === 'number'
            ? this.right
            : this.resolveSize(this.right, 'width', terminalDims.columns) || 0;
        x = terminalDims.columns - width - right;
      }

      if (this.top !== null) {
        y =
          typeof this.top === 'number'
            ? this.top
            : this.resolveSize(this.top, 'height', terminalDims.rows) || 0;
      } else if (this.bottom !== null) {
        const bottom =
          typeof this.bottom === 'number'
            ? this.bottom
            : this.resolveSize(this.bottom, 'height', terminalDims.rows) || 0;
        y = terminalDims.rows - height - bottom;
      }
    } else if (this.position === PositionEnum.STICKY) {
      // Sticky: behaves like relative (full scroll implementation not available)
      if (this.left !== null) {
        const left =
          typeof this.left === 'number'
            ? this.left
            : this.resolveSize(this.left, 'width', parentWidth) || 0;
        x = flowX + left;
      }

      if (this.top !== null) {
        const top =
          typeof this.top === 'number'
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
  resolveSize(
    size: string | number,
    dimension: 'width' | 'height',
    reference: number
  ): number | null {
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
   * Automatically decodes HTML entities (e.g., &amp;apos; -> ')
   */
  setContent(content: string | null): void {
    this.content = content ? decodeHtmlEntities(content) : content;
    this.onUpdate();
  }

  /**
   * Orchestrate full render pipeline for this node tree
   * This method coordinates component tree, layout, stacking contexts, viewports, and rendering
   * Can be overridden by subclasses for custom orchestration
   */
  renderTree(buffer: import('./mixins/Renderable').OutputBuffer): void {
    // 0. Clear previous rendering state (if Renderable mixin is present)
    const renderableThis = this as unknown as RenderableNode;
    if (renderableThis.clearRenderingState) {
      renderableThis.clearRenderingState();
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
    if (renderableThis.render) {
      renderableThis.render(buffer, context);
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
    const renderableThis = this as unknown as RenderableNode;
    if (renderableThis.computeLayout) {
      const constraints = this.getLayoutConstraints();
      renderableThis.computeLayout(constraints);
    }
    // Don't recursively call calculateLayouts on children -
    // parent's computeLayout already handles child layout and sets their bounds
  }

  /**
   * Build stacking contexts (recursive)
   * Can be overridden for custom stacking context building
   */
  buildStackingContexts(): void {
    const renderableThis = this as unknown as RenderableNode;
    if (renderableThis.updateStackingContext) {
      renderableThis.updateStackingContext();
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
    const renderableThis = this as unknown as RenderableNode;
    if (renderableThis.updateViewport) {
      renderableThis.updateViewport();
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
  getLayoutConstraints(): {
    maxWidth: number;
    maxHeight: number;
    availableWidth: number;
    availableHeight: number;
  } {
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

  // Static render state (persists across render calls for unmount access)
  private static _rootFiber: import('react-reconciler').FiberRoot | null = null;
  private static _rootContainer: Node | null = null;
  private static _currentElement: import('react').ReactElement | null = null;
  private static _isInteractive: boolean = false;
  private static _resizeCleanup: (() => void) | null = null;
  private static _renderCallback: (() => void) | null = null;
  private static _lastRenderedHeight: number = 0;

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
  static createHostConfig(): import('react-reconciler').HostConfig<
    string,
    Record<string, unknown>,
    Node,
    Node,
    Node,
    Node,
    Node,
    Node,
    object,
    unknown[],
    unknown,
    number,
    number
  > {
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

    const prepareForCommit = (): void => {
      debug('[hostConfig] prepareForCommit');
    };
    const resetAfterCommit = (): void => {
      debug('[hostConfig] resetAfterCommit');
      // Call the registered callback to trigger screen rendering
      // This ensures state updates result in visible screen changes
      // We access Node dynamically to get the current callback value
      const NodeClass = require('./Node').Node;
      if (NodeClass._onCommitCallback) {
        NodeClass._onCommitCallback();
      }
    };

    const createInstance = (
      type: string | ((...args: unknown[]) => unknown),
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
        props: props as Record<string, unknown>,
      } as unknown as import('react').ReactElement;

      const node = NodeFactory.createNode(element);
      debug('[hostConfig] createInstance', {
        type: typeString,
        id: props.id,
        disabled: props.disabled,
      });
      return node;
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

    const appendInitialChild = (
      parentInstance: Node,
      child: Node | string | TextInstance
    ): void => {
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
      // Log significant prop changes (disabled, label, etc.)
      if (_oldProps.disabled !== _newProps.disabled) {
        debug('[hostConfig] prepareUpdate: disabled changed', {
          type: _type,
          oldDisabled: _oldProps.disabled,
          newDisabled: _newProps.disabled,
        });
      }
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

    const appendChildToContainer = (container: Node, child: Node | string): void => {
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
        const index = parentInstance.children.findIndex((c) => c.content === child);
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

    const removeChildFromContainer = (container: Node, child: Node | string): void => {
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

      const extInstance = instance as unknown as RenderableNode;
      debug('[hostConfig] commitUpdate', {
        type: instance.type,
        id: extInstance.componentId,
        disabled: newProps.disabled,
        oldDisabled: _oldProps.disabled,
      });

      if (newProps.style && extInstance.setStyle) {
        extInstance.setStyle(newProps.style as ViewStyle | TextStyle);
      }

      // Update event handlers
      if ('onClick' in newProps) {
        extInstance.onClick = newProps.onClick as ((event: unknown) => void) | undefined;
      }
      if ('onPress' in newProps) {
        extInstance.onPress = newProps.onPress as ((event: unknown) => void) | undefined;
      }
      if ('onKeyDown' in newProps) {
        extInstance.onKeyDown = newProps.onKeyDown as ((event: unknown) => void) | undefined;
      }
      if ('onChange' in newProps) {
        extInstance.onChange = newProps.onChange as ((event: unknown) => void) | undefined;
      }
      if ('onFocus' in newProps) {
        extInstance.onFocus = newProps.onFocus as (() => void) | undefined;
      }
      if ('onBlur' in newProps) {
        extInstance.onBlur = newProps.onBlur as (() => void) | undefined;
      }
      if ('onSubmit' in newProps) {
        extInstance.onSubmit = newProps.onSubmit as ((event: unknown) => void) | undefined;
      }

      // Update interactive properties (disabled, tabIndex, autoFocus)
      if ('disabled' in newProps) {
        extInstance.disabled = Boolean(newProps.disabled);
      }
      if ('tabIndex' in newProps) {
        extInstance.tabIndex = newProps.tabIndex as number | undefined;
      }
      if ('autoFocus' in newProps) {
        extInstance.autoFocus = Boolean(newProps.autoFocus);
      }

      // Update content for text nodes
      if (newProps.children !== undefined && extInstance.setContent) {
        // Handle array children (e.g., <Text>Hello, {name}!</Text> becomes ["Hello, ", name, "!"])
        if (Array.isArray(newProps.children)) {
          const textParts = (newProps.children as unknown[])
            .filter((child: unknown) => typeof child === 'string' || typeof child === 'number')
            .map((child: unknown) => String(child));
          extInstance.setContent(textParts.join(''));
        } else {
          extInstance.setContent(String(newProps.children));
        }
      }

      // Update input value
      if (newProps.value !== undefined && extInstance.setValue) {
        extInstance.setValue(newProps.value);
      }

      // Update label for buttons
      if ('label' in newProps && extInstance.setLabel) {
        extInstance.setLabel(newProps.label as string);
      }

      // Update state-specific styles for buttons
      if ('disabledStyle' in newProps) {
        extInstance.disabledStyle = newProps.disabledStyle as ViewStyle | TextStyle | undefined;
      }
      if ('focusedStyle' in newProps) {
        extInstance.focusedStyle = newProps.focusedStyle as ViewStyle | TextStyle | undefined;
      }
      if ('pressedStyle' in newProps) {
        extInstance.pressedStyle = newProps.pressedStyle as ViewStyle | TextStyle | undefined;
      }
      if ('hoveredStyle' in newProps) {
        extInstance.hoveredStyle = newProps.hoveredStyle as ViewStyle | TextStyle | undefined;
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
      isPrimaryRenderer: true,
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
   * Navigation options for interactive mode
   */
  static navigationOptions: {
    arrowKeyNavigation?: boolean;
    verticalArrowNavigation?: boolean;
    horizontalArrowNavigation?: boolean;
  } = {};

  /**
   * Main render entry point - renders React elements to console
   * This is the primary API for users
   */
  static render(
    element: import('react').ReactElement,
    options?: {
      mode?: 'static' | 'interactive' | 'fullscreen';
      fullscreen?: boolean;
      onUpdate?: () => void;
      appId?: string;
      navigation?: {
        arrowKeyNavigation?: boolean;
        verticalArrowNavigation?: boolean;
        horizontalArrowNavigation?: boolean;
      };
    }
  ): string | void {
    // Store navigation options
    Node.navigationOptions = options?.navigation || {};
    // Lazy imports to avoid circular dependency with reconciler
    // Note: reconciler.ts imports Node, creating a circular dependency.
    // We use require() here which handles circular deps at runtime.

    // Get reconciler with fallback path resolution for test environments
    interface ReconcilerModule {
      reconciler: import('react-reconciler').Reconciler<Node, Node, Node, Node, Node>;
    }
    let reconciler: ReconcilerModule['reconciler'];
    try {
      reconciler = (require('../../renderer/reconciler') as ReconcilerModule).reconciler;
    } catch (err: unknown) {
      // In test environments (Vitest), relative paths might not resolve correctly
      // Try using path from project root
      try {
        const path = require('path');
        const rootPath = path.resolve(process.cwd(), 'src/renderer/reconciler');
        reconciler = require(rootPath).reconciler;
      } catch {
        // If that fails, the module system might be ESM - but we can't use async import here
        // Re-throw original error with helpful message
        const errMessage = err instanceof Error ? err.message : String(err);
        throw new Error(
          `Failed to load reconciler from '../../renderer/reconciler'. ` +
            `Original error: ${errMessage}. ` +
            `This may be a module resolution issue in the test environment.`
        );
      }
    }

    const { getBufferRenderer, resetBufferRenderer } = require('../../buffer');
    const { showCursor } = require('../../renderer/ansi');
    const { startInputListener } = require('../../renderer/input');
    const {
      getTerminalDimensions,
      onTerminalResizeDebounced,
      setRenderMode,
    } = require('../../utils/terminal');
    const { reportError, ErrorType } = require('../../utils/errors');
    const { initializeStorage } = require('../../utils/storage');
    const { scheduleBatchedUpdate, flushBatchedUpdatesSync } = require('../../renderer/batching');
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
    Node._renderCallback = options?.onUpdate || null;

    // Set render mode early so terminal dimensions are correct
    setRenderMode(mode === 'static' ? 'static' : 'interactive');
    resetBufferRenderer(); // Reset buffer renderer with new dimensions

    initializeStorage(options?.appId);

    let previousFocusedComponent: Node | null = null;
    let overlayStack: Node[] = [];

    if (!Node._rootFiber) {
      try {
        // Dynamic import for optional lifecycle hooks
        import('../../hooks/lifecycle')
          .then((lifecycle) => {
            if (lifecycle?.notifyAppStart) {
              lifecycle.notifyAppStart();
            }
          })
          .catch(() => {
            // Hooks module may not be loaded yet
          });
      } catch {
        // Ignore
      }
    }

    Node._isInteractive = mode === 'interactive' || mode === 'fullscreen';
    Node._currentElement = element;

    // Create root container using new Node system
    if (!Node._rootContainer) {
      Node._rootContainer = new BoxNode() as unknown as Node;
      if (fullscreen || mode === 'fullscreen') {
        interface StylableRoot {
          setStyle?(style: Record<string, unknown>): void;
        }
        const stylableRoot = Node._rootContainer as unknown as StylableRoot;
        if (stylableRoot.setStyle) {
          stylableRoot.setStyle({ width: '100%', height: '100%' });
        }
      }
    }

    // Create reconciler container
    if (!Node._rootFiber) {
      // Use LegacyRoot (0) for all modes - ConcurrentRoot has scheduling issues
      const rootTag = 0;

      Node._rootFiber = reconciler.createContainer(
        Node._rootContainer,
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

    // Note: focusedNodeId is now stored in terminal.focusedNodeId
    // This allows focus set via mouse clicks in handleMouseEvent to survive re-renders

    // Get fresh interactive components from root
    const getInteractiveComponents = (rootNode: Node): Node[] => {
      const components: Node[] = [];
      collectInteractiveComponents(rootNode, components);
      assignTabIndexes(components);
      return components;
    };

    // Apply stored focus state to components after re-render
    const applyFocusState = (components: Node[]): void => {
      // First, clear focus from ALL components to ensure clean state
      for (const comp of components) {
        const focusableComp = comp as Node & { focused?: boolean };
        if ('focused' in focusableComp) {
          focusableComp.focused = false;
        }
      }

      if (terminal.focusedNodeId) {
        for (const comp of components) {
          if (comp.id === terminal.focusedNodeId) {
            const focusableComp = comp as Node & { focused?: boolean };
            focusableComp.focused = true;
            terminal.setFocusedComponent(comp as unknown as import('../../types').ConsoleNode);
            return;
          }
        }
        // ID not found, clear it
        terminal.focusedNodeId = null;
      }
    };

    // Update through React reconciliation
    const performRender = (): string | void => {
      if (Node._rootContainer) {
        try {
          // componentBoundsRegistry is cleared in BufferRenderer.render()

          const dims = getTerminalDimensions();
          terminal.dimensions = dims;

          const currentOverlays = findAllOverlays(Node._rootContainer);
          const previousOverlayCount = overlayStack.length;
          const currentOverlayCount = currentOverlays.length;

          if (currentOverlayCount > previousOverlayCount && previousFocusedComponent === null) {
            previousFocusedComponent = terminal.focusedComponent as Node | null;
          }

          if (currentOverlayCount < previousOverlayCount && previousFocusedComponent) {
            const interactiveComponents: Node[] = [];
            collectInteractiveComponents(Node._rootContainer, interactiveComponents);
            if (
              previousFocusedComponent &&
              interactiveComponents.includes(previousFocusedComponent)
            ) {
              focusComponent(previousFocusedComponent, interactiveComponents, scheduleUpdate);
            }
            previousFocusedComponent = null;
          }

          overlayStack = currentOverlays;

          // Build component tree, layouts, stacking contexts, and viewports
          const container = Node._rootContainer as Node;
          if (container.buildComponentTree) {
            container.buildComponentTree();
          }
          if (container.calculateLayouts) {
            container.calculateLayouts();
          }
          if (container.buildStackingContexts) {
            container.buildStackingContexts();
          }
          if (container.buildViewports) {
            container.buildViewports();
          }

          // Apply focus state to components after React updates
          if (terminal.focusedNodeId) {
            const components = getInteractiveComponents(Node._rootContainer);
            applyFocusState(components);
          }

          // Use the multi-buffer renderer
          // Always do fullRedraw in interactive mode to ensure focus changes render correctly
          // The diff-based rendering has issues with focus indicator characters
          const bufferRenderer = getBufferRenderer();
          bufferRenderer.render(Node._rootContainer, {
            mode: Node._isInteractive ? 'interactive' : 'static',
            fullRedraw: Node._isInteractive || isFirstRender,
            clearScreen: Node._isInteractive && isFirstRender,
          });

          // Compute cursor position AFTER render so componentBoundsRegistry has correct data
          // (componentBoundsRegistry.endRender() is called inside BufferRenderer.render())
          // Then position cursor separately
          if (terminal.focusedNodeId && Node._isInteractive) {
            const components = getInteractiveComponents(Node._rootContainer);
            const focusedComponent = components.find((c) => c.id === terminal.focusedNodeId);
            if (focusedComponent) {
              // Use componentBoundsRegistry for visible bounds (handles scroll offsets correctly)
              // Fall back to node.bounds if not in registry
              const registryBounds = componentBoundsRegistry.get(
                focusedComponent as unknown as import('../../types').ConsoleNode
              );

              // If not in registry, component is outside visible scroll area - don't position cursor
              if (!registryBounds) {
                // Component not visible in scrollview, skip cursor positioning
                debug('[performRender] focused component not in registry (not visible)', {
                  type: focusedComponent.type,
                  id: focusedComponent.id,
                });
              }

              let focusedBounds = registryBounds
                ? {
                    x: registryBounds.x,
                    y: registryBounds.y,
                    width: registryBounds.width,
                    height: registryBounds.height,
                  }
                : null; // Don't use node.bounds - it has wrong coordinates for scrolled content

              if (focusedBounds) {
                let cursorX: number;
                let cursorY: number = focusedBounds.y;

                if (focusedComponent.type === 'input') {
                  interface InputNodeState {
                    _cursorPos?: number;
                    _scrollOffset?: number;
                    _visibleWidth?: number;
                    _multiline?: boolean;
                    _cursorLine?: number;
                    _cursorCol?: number;
                    _scrollTop?: number;
                    _maxLines?: number;
                  }
                  const inputNode = focusedComponent as Node & InputNodeState;
                  const cursorPos = inputNode._cursorPos ?? 0;
                  const scrollOffset = inputNode._scrollOffset ?? 0;
                  const visibleWidth = inputNode._visibleWidth ?? 20;

                  if (inputNode._multiline) {
                    // Multiline: use cursor line and column
                    const cursorLine = inputNode._cursorLine ?? 0;
                    const cursorCol = inputNode._cursorCol ?? 0;
                    const scrollTop = inputNode._scrollTop ?? 0;

                    // Only show terminal cursor if cursor line is visible
                    const visibleLine = cursorLine - scrollTop;
                    if (visibleLine >= 0 && visibleLine < (inputNode._maxLines || 3)) {
                      cursorX = focusedBounds.x + 2 + Math.min(cursorCol, visibleWidth);
                      cursorY = focusedBounds.y + visibleLine;
                    } else {
                      // Cursor line not visible, hide terminal cursor
                      cursorX = -1;
                    }
                  } else {
                    // Single-line: position at actual cursor position (accounting for scroll)
                    const visibleCursorPos = cursorPos - scrollOffset;
                    if (visibleCursorPos >= 0 && visibleCursorPos <= visibleWidth) {
                      cursorX = focusedBounds.x + 2 + visibleCursorPos;
                    } else {
                      // Cursor not in visible area
                      cursorX = -1;
                    }
                  }
                } else if (focusedComponent.type === 'button') {
                  // Position cursor at button: x = bounds.x + prefix(2), y = bounds.y
                  cursorX = focusedBounds.x + 2; // +2 for "> " prefix
                } else {
                  // Default: position at start of component
                  cursorX = focusedBounds.x;
                }

                // Only set cursor position if valid
                if (cursorX >= 0) {
                  debug('[performRender] computed cursor position', { x: cursorX, y: cursorY });
                  // Position cursor after render
                  process.stdout.write(`\x1b[${cursorY + 1};${cursorX + 1}H`);
                }
              }
            }
          }

          // Track rendered height for proper cursor positioning on exit
          if (Node._rootContainer.bounds) {
            Node._lastRenderedHeight =
              Node._rootContainer.bounds.y + Node._rootContainer.bounds.height;
          }

          isFirstRender = false;

          // Cursor positioning and showing is now handled inside flush() as part of the same write

          if (Node._renderCallback) {
            Node._renderCallback();
          }
        } catch (error) {
          try {
            process.stdout.write('\n[Render Error: ' + String(error) + ']\n');
            process.stdout.write(showCursor());
          } catch {
            console.error('Render error:', error);
          }
          reportError(error, ErrorType.RENDER, {
            nodeType: Node._rootContainer.type,
          });
        }
      }
    };

    // Register the render callback for interactive mode
    // This ensures state updates trigger screen rendering
    if (Node._isInteractive) {
      Node.setOnCommitCallback(performRender);
    }

    let outputResult: string | void = undefined;

    try {
      // Use synchronous updates for both static and interactive modes
      // This ensures the render callback fires immediately
      interface ReconcilerExt {
        updateContainerSync?: (
          element: unknown,
          container: unknown,
          parent: unknown,
          callback: () => void
        ) => void;
        flushSyncWork?: () => void;
      }
      const extReconciler = reconciler as typeof reconciler & ReconcilerExt;
      if (typeof extReconciler.updateContainerSync === 'function') {
        extReconciler.updateContainerSync(element, Node._rootFiber, null, () => {
          outputResult = performRender();
        });
        if (typeof extReconciler.flushSyncWork === 'function') {
          extReconciler.flushSyncWork();
        }
      } else {
        // Fallback for older react-reconciler versions
        reconciler.updateContainer(element, Node._rootFiber, null, () => {
          outputResult = performRender();
        });
      }
    } catch (error) {
      reportError(error, ErrorType.RENDER);
      throw error;
    }

    // For static mode, return immediately
    if (mode === 'static' && !Node._isInteractive) {
      return outputResult;
    }

    // Set up terminal resize listener for interactive mode
    if (Node._resizeCleanup) {
      Node._resizeCleanup();
      Node._resizeCleanup = null;
    }
    Node._resizeCleanup = onTerminalResizeDebounced(() => {
      updateTerminalDimensions();

      if (Node._currentElement && Node._rootFiber) {
        reconciler.updateContainer(Node._currentElement, Node._rootFiber, null, () => {
          performRender();
        });
      }
    }, 100);

    // Schedule update function (defined before setupInputHandling so it can be used there)
    const scheduleUpdate = (): void => {
      debug('scheduleUpdate called');

      scheduleBatchedUpdate(() => {
        debug('scheduleBatchedUpdate callback - calling performRender');
        performRender();
      });
    };

    // Flush all pending React updates synchronously
    // This ensures the component tree is up-to-date before navigation
    const flushSyncReactUpdates = (): void => {
      // First flush our batched updates
      flushBatchedUpdatesSync();

      // Then force React to process any pending work synchronously
      if (Node._currentElement && Node._rootFiber) {
        interface ReconcilerExt {
          updateContainerSync?: (
            element: unknown,
            container: unknown,
            parent: unknown,
            callback: () => void
          ) => void;
          flushSyncWork?: () => void;
        }
        const extReconciler = reconciler as typeof reconciler & ReconcilerExt;
        if (typeof extReconciler.updateContainerSync === 'function') {
          extReconciler.updateContainerSync(Node._currentElement, Node._rootFiber, null, () => {});
          if (typeof extReconciler.flushSyncWork === 'function') {
            extReconciler.flushSyncWork();
          }
        } else {
          // Fallback: use regular updateContainer
          reconciler.updateContainer(Node._currentElement, Node._rootFiber, null, () => {});
        }

        // Perform a render to update node properties from React props
        performRender();
      }
    };

    // Setup input handling for interactive components
    const setupInputHandling = (root: Node): void => {
      const interactiveComponents = getInteractiveComponents(root);

      // Find first autoFocus component that is not disabled
      const firstAutoFocusComponent = interactiveComponents.find((comp) => {
        const focusable = comp as FocusableNode;
        return focusable.autoFocus && !focusable.disabled;
      });

      let needsRerender = false;

      if (firstAutoFocusComponent) {
        const focusable = firstAutoFocusComponent as FocusableNode;
        focusable.focused = true;
        terminal.setFocusedComponent(
          firstAutoFocusComponent as unknown as import('../../types').ConsoleNode
        );
        if (focusable.onFocus) {
          focusable.onFocus();
        }
        needsRerender = true;
      } else if (interactiveComponents.length > 0) {
        // If no autoFocus, focus the first focusable component
        const focusableComponents = interactiveComponents.filter((comp) => {
          const focusable = comp as FocusableNode;
          return (
            !focusable.disabled && (focusable.tabIndex === undefined || focusable.tabIndex >= 0)
          );
        });
        if (focusableComponents.length > 0) {
          // Only sort if any component has explicit tabIndex
          // Otherwise use document order (first in array)
          const anyHasTabIndex = focusableComponents.some(
            (comp) => (comp as FocusableNode).tabIndex !== undefined
          );

          let first: Node;
          if (anyHasTabIndex) {
            const sorted = [...focusableComponents].sort((a, b) => {
              const aTab = (a as FocusableNode).tabIndex ?? Infinity;
              const bTab = (b as FocusableNode).tabIndex ?? Infinity;
              return aTab - bTab;
            });
            first = sorted[0]!;
          } else {
            // No explicit tabIndexes - use document order
            first = focusableComponents[0]!;
          }

          const focusableFirst = first as FocusableNode;
          focusableFirst.focused = true;
          terminal.setFocusedComponent(first as unknown as import('../../types').ConsoleNode);
          if (focusableFirst.onFocus) {
            const focusEvent = { target: first, nativeEvent: { target: first } };
            focusableFirst.onFocus(focusEvent);
          }
          needsRerender = true;
        }
      }

      // Schedule a re-render to show focus state
      if (needsRerender) {
        scheduleUpdate();
      }

      interface KeyEvent {
        tab?: boolean;
        shift?: boolean;
        upArrow?: boolean;
        downArrow?: boolean;
        leftArrow?: boolean;
        rightArrow?: boolean;
        return?: boolean;
        space?: boolean;
        escape?: boolean;
        name?: string;
      }
      interface MouseEventData {
        x: number;
        y: number;
        button: number;
      }
      startInputListener((_chunk: string, key: KeyEvent | null, mouse: MouseEventData | null) => {
        try {
          // Re-collect components to get current instances after any React updates
          // Always use Node._rootContainer to get the latest tree structure
          const currentRoot = Node._rootContainer || root;
          const currentComponents = getInteractiveComponents(currentRoot);
          applyFocusState(currentComponents);

          if (mouse) {
            handleMouseEvent(mouse, currentComponents, scheduleUpdate, performRender, currentRoot);
            return;
          }

          if (key) {
            if (key.tab) {
              debug('[input] Tab key received', { shift: key.shift });
              // Flush all pending React updates to ensure component states are current
              flushSyncReactUpdates();

              // Re-collect components after flush to get updated states
              // Use Node._rootContainer to get the latest tree structure
              const freshRoot = Node._rootContainer || root;
              const freshComponents = getInteractiveComponents(freshRoot);
              applyFocusState(freshComponents);

              handleTabNavigation(freshComponents, key.shift, scheduleUpdate, freshRoot);
              // Update focusedNodeId after tab navigation
              const newFocused = freshComponents.find((comp) => (comp as FocusableNode).focused);
              terminal.focusedNodeId = newFocused?.id || null;
              debug('[input] Tab handled, new focused:', { id: terminal.focusedNodeId });
              return;
            }

            // Arrow key navigation (if enabled)
            // Skip arrow navigation if an input field is focused (arrow keys should control cursor)
            const focusedForArrowCheck = currentComponents.find(
              (comp) => (comp as FocusableNode).focused
            );
            const inputHasFocus = focusedForArrowCheck?.type === 'input';

            const navOpts = Node.navigationOptions;
            const arrowNav = navOpts.arrowKeyNavigation;
            const verticalNav = navOpts.verticalArrowNavigation ?? arrowNav;
            const horizontalNav = navOpts.horizontalArrowNavigation ?? arrowNav;

            // Don't use arrow keys for navigation when input is focused
            if (!inputHasFocus) {
              if (
                (key.upArrow || key.leftArrow) &&
                ((verticalNav && key.upArrow) || (horizontalNav && key.leftArrow))
              ) {
                // Flush all pending React updates to ensure component states are current
                flushSyncReactUpdates();
                const freshRoot = Node._rootContainer || root;
                const freshComponents = getInteractiveComponents(freshRoot);
                applyFocusState(freshComponents);

                // Navigate backwards (like Shift+Tab)
                handleTabNavigation(freshComponents, true, scheduleUpdate, freshRoot);
                const newFocused = freshComponents.find((comp) => (comp as FocusableNode).focused);
                terminal.focusedNodeId = newFocused?.id || null;
                return;
              }

              if (
                (key.downArrow || key.rightArrow) &&
                ((verticalNav && key.downArrow) || (horizontalNav && key.rightArrow))
              ) {
                // Flush all pending React updates to ensure component states are current
                flushSyncReactUpdates();
                const freshRoot = Node._rootContainer || root;
                const freshComponents = getInteractiveComponents(freshRoot);
                applyFocusState(freshComponents);

                // Navigate forwards (like Tab)
                handleTabNavigation(freshComponents, false, scheduleUpdate, freshRoot);
                const newFocused = freshComponents.find((comp) => (comp as FocusableNode).focused);
                terminal.focusedNodeId = newFocused?.id || null;
                return;
              }
            }

            if (key.escape) {
              for (const comp of currentComponents) {
                interface DropdownLikeNode {
                  isOpen?: boolean;
                }
                const dropdownComp = comp as unknown as DropdownLikeNode;
                if (comp.type === 'dropdown' && dropdownComp.isOpen) {
                  dropdownComp.isOpen = false;
                  scheduleUpdate();
                  return;
                }
              }
            }

            const focused = currentComponents.find((comp) => (comp as FocusableNode).focused);

            if (focused) {
              const focusedNode = focused as FocusableNode;
              if (!focusedNode.disabled) {
                interface KeyboardEventObj {
                  key: KeyEvent;
                  _propagationStopped: boolean;
                  stopPropagation: () => void;
                  preventDefault: () => void;
                }
                const keyboardEvent: KeyboardEventObj = {
                  key,
                  _propagationStopped: false,
                  stopPropagation: () => {
                    keyboardEvent._propagationStopped = true;
                  },
                  preventDefault: () => {},
                };

                if (focusedNode.onKeyDown) {
                  (focusedNode.onKeyDown as (event: KeyboardEventObj) => void)(keyboardEvent);
                }

                interface InteractiveNode extends FocusableNode {
                  handleKeyboardEvent?: (event: KeyboardEventObj) => void;
                  isOpen?: boolean;
                  submitButtonId?: string;
                  onClick?: (event: { target: unknown }) => void;
                }
                const interactiveNode = focused as unknown as InteractiveNode;

                if (!keyboardEvent._propagationStopped) {
                  if (interactiveNode.handleKeyboardEvent) {
                    // Track dropdown state before handling
                    const wasDropdownOpen = focused.type === 'dropdown' && interactiveNode.isOpen;

                    // Wrap the event handler in flushSyncFromReconciler so that
                    // any state updates (via onChange -> setState) are processed synchronously
                    interface ReconcilerExt {
                      flushSyncFromReconciler?: (fn: () => void) => void;
                    }
                    const extReconciler = reconciler as typeof reconciler & ReconcilerExt;
                    if (typeof extReconciler.flushSyncFromReconciler === 'function') {
                      extReconciler.flushSyncFromReconciler(() => {
                        interactiveNode.handleKeyboardEvent!(keyboardEvent);
                      });
                    } else {
                      interactiveNode.handleKeyboardEvent(keyboardEvent);
                    }

                    // If dropdown was open and Enter/Space was pressed, ensure it's closed
                    // and render IMMEDIATELY (not batched) so user sees the change
                    interface KeyWithChar extends KeyEvent {
                      char?: string;
                    }
                    if (
                      wasDropdownOpen &&
                      ((key as KeyWithChar).return || (key as KeyWithChar).char === ' ')
                    ) {
                      // Re-find the dropdown in case node was recreated
                      const freshRoot = Node._rootContainer || root;
                      const freshComponents = getInteractiveComponents(freshRoot);
                      const dropdown = freshComponents.find(
                        (c) => c.type === 'dropdown' && c.id === focused.id
                      );
                      if (dropdown) {
                        const dropdownNode = dropdown as unknown as InteractiveNode;
                        if (dropdownNode.isOpen) {
                          dropdownNode.isOpen = false;
                        }
                      }
                      // Force immediate render for dropdown close
                      flushBatchedUpdatesSync();
                      performRender();
                    } else {
                      // Schedule an update after handling keyboard input
                      scheduleUpdate();
                    }
                  }

                  // Handle submitButtonId on Enter for input components
                  if (key.tab === false && key.return && focused.type === 'input') {
                    const submitButtonId = interactiveNode.submitButtonId;
                    if (submitButtonId) {
                      // Find the button with the given ID and trigger its onClick
                      const submitButton = currentComponents.find(
                        (comp) => comp.type === 'button' && comp.id === submitButtonId
                      );
                      if (submitButton) {
                        const buttonNode = submitButton as unknown as InteractiveNode;
                        if (buttonNode.onClick && !buttonNode.disabled) {
                          buttonNode.onClick({ target: submitButton });
                        }
                      }
                    }
                  }
                }
              }
            }

            if (!focused && currentComponents.length > 0) {
              const focusableComponents = currentComponents.filter((comp) => {
                const focusable = comp as FocusableNode;
                return (
                  !focusable.disabled &&
                  (focusable.tabIndex === undefined || focusable.tabIndex >= 0)
                );
              });
              if (focusableComponents.length > 0) {
                const sorted = [...focusableComponents].sort((a, b) => {
                  const aFocusable = a as FocusableNode;
                  const bFocusable = b as FocusableNode;
                  return (aFocusable.tabIndex || 0) - (bFocusable.tabIndex || 0);
                });
                const first = sorted[0]!;
                const firstFocusable = first as FocusableNode;
                firstFocusable.focused = true;
                terminal.setFocusedComponent(first as unknown as import('../../types').ConsoleNode);
                if (firstFocusable.onFocus) {
                  const focusEvent = { target: first, nativeEvent: { target: first } };
                  firstFocusable.onFocus(focusEvent);
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
    // Use multiple setImmediate/setTimeout to ensure React has fully committed
    // and the tree is completely built before we collect components
    if (Node._isInteractive && Node._rootContainer) {
      const startInput = () => {
        // First ensure a render has happened to build the tree
        performRender();
        // Then setup input handling
        setupInputHandling(Node._rootContainer!);
      };
      // Use double defer to ensure React has finished all work
      if (typeof setImmediate !== 'undefined') {
        setImmediate(() => setImmediate(startInput));
      } else {
        setTimeout(() => setTimeout(startInput, 0), 0);
      }
    }
  }

  /**
   * Unmount the rendered React application
   */
  static unmount(): void {
    const { showCursor } = require('../../renderer/ansi');
    const { resetBufferRenderer } = require('../../buffer');
    const { clearBatchedUpdates } = require('../../renderer/batching');
    const { stopInputListener } = require('../../renderer/input');

    // FIRST: Prevent any more renders by clearing callback and batched updates
    // This must happen before anything else to avoid render artifacts
    Node.setOnCommitCallback(null);
    clearBatchedUpdates();

    // Stop input listener if interactive (prevents more input from triggering renders)
    if (Node._isInteractive) {
      stopInputListener();
    }

    // Clean up resize listener
    if (Node._resizeCleanup) {
      Node._resizeCleanup();
      Node._resizeCleanup = null;
    }

    // Store height before resetting state
    const lastHeight = Node._lastRenderedHeight;

    // Reset state BEFORE final output to prevent any late renders
    const hadRootFiber = Node._rootFiber !== null;
    const rootFiber = Node._rootFiber;
    const rootContainer = Node._rootContainer;

    Node._rootFiber = null;
    Node._rootContainer = null;
    Node._currentElement = null;
    Node._isInteractive = false;
    Node._renderCallback = null;
    Node._lastRenderedHeight = 0;

    // Reset buffer renderer
    resetBufferRenderer();

    // Unmount React tree (after our state is cleared to prevent render callbacks)
    if (hadRootFiber && rootFiber && rootContainer) {
      try {
        const { reconciler } = require('../../renderer/reconciler');
        reconciler.updateContainer(null, rootFiber, null, () => {});
      } catch {
        // Reconciler may not be available
      }
    }

    // Move cursor to end of rendered content
    // The cursor might be anywhere in the rendered area (at focused component)
    // We need to move to just past the last row of content
    let finalOutput = '';

    // Use ANSI escape to move cursor to specific row (just past content)
    // ESC[row;colH moves cursor to absolute position
    if (lastHeight > 0) {
      // Move cursor to row (lastHeight + 1), column 1
      finalOutput += `\x1b[${lastHeight + 1};1H`;
    }

    // Add one newline to ensure prompt appears on clean line
    finalOutput += '\n';

    // Show cursor - this uses \x1b[?25h which has [? not just [
    finalOutput += showCursor();

    // Write everything in one call
    process.stdout.write(finalOutput);
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
