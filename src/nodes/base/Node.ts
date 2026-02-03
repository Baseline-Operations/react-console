/**
 * Core base class for all nodes
 * Contains only essential functionality: identity, tree structure, box model
 */

import { createRequire } from 'node:module';
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
import type { ViewStyle, TextStyle } from '../../types';

// Create require function for ESM compatibility (needed for lazy loading to avoid circular deps)
const require = createRequire(import.meta.url);

// Note: Global state is now managed in RenderState.ts
// The globalThis pattern for ESM/CJS dual loading is handled there

// Types for dynamic node capabilities (exported for mixin type inference)
export interface RenderingInfo {
  layerId?: string;
  zIndex?: number;
}

export interface StackingContextInfo {
  zIndex: number;
  nodes: Node[];
}

export interface ViewportInfo {
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

// Note: FocusableNode interface is now defined in RenderEntry.ts

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

  // ============================================================
  // Static render state - delegated to RenderState.ts
  // These properties are kept for backwards compatibility
  // ============================================================

  /** @deprecated Use renderState from RenderState.ts */
  static get _onCommitCallback(): (() => void) | null {
    const { renderState } = require('../../renderer/RenderState');
    return renderState.onCommitCallback;
  }
  static set _onCommitCallback(callback: (() => void) | null) {
    const { renderState } = require('../../renderer/RenderState');
    renderState.onCommitCallback = callback;
  }

  /** @deprecated Use renderState from RenderState.ts */
  static get _rootFiber(): import('react-reconciler').FiberRoot | null {
    const { renderState } = require('../../renderer/RenderState');
    return renderState.rootFiber;
  }
  static set _rootFiber(fiber: import('react-reconciler').FiberRoot | null) {
    const { renderState } = require('../../renderer/RenderState');
    renderState.rootFiber = fiber;
  }

  /** @deprecated Use renderState from RenderState.ts */
  static get _rootContainer(): Node | null {
    const { renderState } = require('../../renderer/RenderState');
    return renderState.rootContainer;
  }
  static set _rootContainer(container: Node | null) {
    const { renderState } = require('../../renderer/RenderState');
    renderState.rootContainer = container;
  }

  /** @deprecated Use renderState from RenderState.ts */
  static get _currentElement(): import('react').ReactElement | null {
    const { renderState } = require('../../renderer/RenderState');
    return renderState.currentElement;
  }
  static set _currentElement(element: import('react').ReactElement | null) {
    const { renderState } = require('../../renderer/RenderState');
    renderState.currentElement = element;
  }

  /** @deprecated Use renderState from RenderState.ts */
  static get _isInteractive(): boolean {
    const { renderState } = require('../../renderer/RenderState');
    return renderState.isInteractive;
  }
  static set _isInteractive(value: boolean) {
    const { renderState } = require('../../renderer/RenderState');
    renderState.isInteractive = value;
  }

  /** @deprecated Use renderState from RenderState.ts */
  static get _resizeCleanup(): (() => void) | null {
    const { renderState } = require('../../renderer/RenderState');
    return renderState.resizeCleanup;
  }
  static set _resizeCleanup(cleanup: (() => void) | null) {
    const { renderState } = require('../../renderer/RenderState');
    renderState.resizeCleanup = cleanup;
  }

  /** @deprecated Use renderState from RenderState.ts */
  static get _renderCallback(): (() => void) | null {
    const { renderState } = require('../../renderer/RenderState');
    return renderState.renderCallback;
  }
  static set _renderCallback(callback: (() => void) | null) {
    const { renderState } = require('../../renderer/RenderState');
    renderState.renderCallback = callback;
  }

  /** @deprecated Use renderState from RenderState.ts */
  static get _wasInteractiveMode(): boolean {
    const { renderState } = require('../../renderer/RenderState');
    return renderState.wasInteractiveMode;
  }
  static set _wasInteractiveMode(value: boolean) {
    const { renderState } = require('../../renderer/RenderState');
    renderState.wasInteractiveMode = value;
  }

  // Getter to satisfy TypeScript's "never read" check
  static get wasInteractiveModeFlag(): boolean {
    return Node._wasInteractiveMode;
  }

  /**
   * Register a callback to be called after React commits changes
   * @deprecated Use setOnCommitCallback from RenderState.ts
   */
  static setOnCommitCallback(callback: (() => void) | null): void {
    const { setOnCommitCallback } = require('../../renderer/RenderState');
    setOnCommitCallback(callback);
  }

  /**
   * @deprecated Use createHostConfig() from src/renderer/HostConfig.ts instead
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static createHostConfig(): any {
    const { createHostConfig } = require('../../renderer/HostConfig');
    return createHostConfig();
  }

  /**
   * Navigation options for interactive mode
   * @deprecated Use renderState.navigationOptions from RenderState.ts
   */
  static get navigationOptions(): {
    arrowKeyNavigation?: boolean;
    verticalArrowNavigation?: boolean;
    horizontalArrowNavigation?: boolean;
  } {
    const { renderState } = require('../../renderer/RenderState');
    return renderState.navigationOptions;
  }
  static set navigationOptions(opts: {
    arrowKeyNavigation?: boolean;
    verticalArrowNavigation?: boolean;
    horizontalArrowNavigation?: boolean;
  }) {
    const { renderState } = require('../../renderer/RenderState');
    renderState.navigationOptions = opts;
  }

  // ============================================================
  // Render entry points - delegated to RenderEntry.ts
  // ============================================================

  /**
   * Main render entry point - renders React elements to console
   * This is the primary API for users
   *
   * @param element - The React element to render
   * @param options - Render options (mode, fullscreen, navigation, etc.)
   * @returns In static mode, returns the rendered output string; otherwise void
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
    const { render } = require('../../renderer/RenderEntry');
    return render(element, options);
  }

  /**
   * Unmount the rendered React application
   * Cleans up input listeners, resets terminal state, and positions cursor
   */
  static unmount(): void {
    const { unmount } = require('../../renderer/RenderEntry');
    unmount();
  }

  /**
   * Exit the application after rendering
   * Calls unmount and then exits the process
   *
   * @param exitCode - The exit code (default 0)
   */
  static exit(exitCode: number = 0): void {
    const { exit } = require('../../renderer/RenderEntry');
    exit(exitCode);
  }
}
