/**
 * ScrollView node - scrollable container
 * Extends BoxNode with scrolling capability and optional scrollbar
 */

import { Node } from '../base/Node';
import {
  Stylable,
  Renderable,
  Interactive,
  Layoutable,
  type RenderContext,
  type RenderResult,
  type KeyboardEvent,
  type LayoutConstraints,
  type LayoutResult,
  type ChildLayout,
} from '../base/mixins';
import type { StyleMap, Dimensions, DisplayMode } from '../base/types';
import { DisplayMode as DisplayModeEnum } from '../base/types';
import {
  componentBoundsRegistry,
  createComponentBounds,
} from '../../renderer/utils/componentBounds';
import { StyleMixinRegistry } from '../../style/mixins/registry';
import type { CellBuffer } from '../../buffer/CellBuffer';
import { LayoutEngine } from '../../layout/LayoutEngine';
import { resolveHeight } from '../../utils/responsive';

/**
 * Scrollbar style configuration
 */
export interface ScrollbarStyle {
  trackColor?: string;
  thumbColor?: string;
  width?: number;
  trackChar?: string;
  thumbChar?: string;
}

/**
 * Scrollbar bounds for hit testing
 */
export interface ScrollbarBounds {
  x: number;
  y: number;
  width: number;
  height: number;
  thumbStart: number; // Y position of thumb start (relative to scrollbar)
  thumbHeight: number; // Height of thumb in rows
}

// Interface for renderable nodes
interface RenderableNode {
  renderToCellBuffer?(context: {
    buffer: CellBuffer;
    x: number;
    y: number;
    maxWidth: number;
    maxHeight?: number;
    clipRegion?: { x: number; y: number; width: number; height: number };
  }): void;
  handlesOwnChildren?: boolean;
  onClick?: (event: unknown) => void;
  onPress?: (event: unknown) => void;
  computeLayout?(constraints: LayoutConstraints): LayoutResult;
}

// Interface for key event
interface KeyEventData {
  upArrow?: boolean;
  downArrow?: boolean;
  pageUp?: boolean;
  pageDown?: boolean;
  home?: boolean;
  end?: boolean;
}

// Create the mixed-in base class with proper type handling
const ScrollViewNodeBase = Stylable(
  Renderable(Layoutable(Interactive(Node as unknown as import('../base/types').Constructor<Node>)))
);

/**
 * ScrollView node - scrollable container with optional scrollbar
 */
export class ScrollViewNode extends ScrollViewNodeBase {
  // Declare inherited mixin properties for TypeScript
  // Note: handleKeyboardEvent is overridden in this class, so no declare needed
  declare focused: boolean;
  declare disabled: boolean;
  declare display: DisplayMode;
  declare inlineStyle: StyleMap;

  // Flag to tell BufferRenderer that this node handles its own children rendering
  readonly handlesOwnChildren = true;

  // Scroll state - declared without initializers, set in constructor
  protected _scrollTop!: number;
  protected _scrollLeft!: number;
  // maxHeight and maxWidth are inherited from Node class - don't redeclare

  // Content dimensions (calculated during layout)
  protected _contentHeight!: number;
  protected _contentWidth!: number;

  // Child layouts from computeLayout (for flex support)
  protected _childLayouts: ChildLayout[] = [];

  // Original style height for percentage parsing
  protected _styleHeight: string | number | undefined;

  // Scroll indicators
  protected _showsVerticalScrollIndicator!: boolean;
  protected _showsHorizontalScrollIndicator!: boolean;
  protected _horizontal!: boolean;

  // Scrollbar styling
  protected _scrollbarStyle!: ScrollbarStyle;

  // Behavior
  protected _scrollStep!: number;
  protected _keyboardScrollEnabled!: boolean;
  protected _autoScrollToBottom!: boolean;
  protected _wasAtBottom!: boolean;

  // Scrollbar bounds for mouse interaction
  protected _scrollbarBounds: ScrollbarBounds | null = null;

  // Actual screen position (updated during rendering, accounts for parent scroll)
  protected _screenX: number = 0;
  protected _screenY: number = 0;
  protected _screenWidth: number = 0;
  protected _screenHeight: number = 0;

  // Callback
  onScroll?: (scrollTop: number, scrollLeft: number) => void;

  constructor(id?: string) {
    super(id);

    // Initialize scroll properties in constructor
    // Note: maxHeight and maxWidth are inherited from Node class
    this._scrollTop = 0;
    this._scrollLeft = 0;
    this._contentHeight = 0;
    this._contentWidth = 0;
    this._showsVerticalScrollIndicator = true;
    this._showsHorizontalScrollIndicator = false;
    this._horizontal = false;
    this._scrollbarStyle = {
      trackColor: '#333333',
      thumbColor: '#888888',
      width: 1,
      trackChar: '│',
      thumbChar: '█',
    };
    this._scrollStep = 1;
    this._keyboardScrollEnabled = true;
    this._autoScrollToBottom = false;
    this._wasAtBottom = true; // Start as "at bottom" since scroll is 0

    this.applyStyleMixin('BaseStyle');
    this.applyStyleMixin('BoxStyle');
  }

  getNodeType(): string {
    return 'scrollview';
  }

  getDefaultStyle(): StyleMap {
    const baseStyle = StyleMixinRegistry.get('BaseStyle')?.getDefaultStyle() || {};
    const boxStyle = StyleMixinRegistry.get('BoxStyle')?.getDefaultStyle() || {};
    return { ...baseStyle, ...boxStyle };
  }

  /**
   * Override setStyle to handle percentage heights for ScrollView
   * Percentage heights like '100%' or '50vh' are resolved to maxHeight
   */
  setStyle(style: StyleMap): void {
    // Store original height for percentage resolution
    if (style.height !== undefined) {
      this._styleHeight = style.height as string | number;
    }

    // Call parent setStyle (from Stylable mixin)
    // This will set this.inlineStyle and call updateBoxModelFromStyle
    const proto = Object.getPrototypeOf(Object.getPrototypeOf(this));
    if (proto && proto.setStyle) {
      proto.setStyle.call(this, style);
    } else {
      // Fallback: directly update inline style
      this.inlineStyle = { ...this.inlineStyle, ...style };
    }

    // Resolve percentage height to maxHeight
    if (this._styleHeight !== undefined) {
      if (typeof this._styleHeight === 'number') {
        // Numeric height - use directly as maxHeight
        this.maxHeight = this._styleHeight;
      } else if (typeof this._styleHeight === 'string') {
        // String height (percentage, vh, etc.) - resolve it
        const resolved = resolveHeight(this._styleHeight);
        if (resolved !== undefined) {
          this.maxHeight = resolved;
        }
      }
    }
  }

  // Getters and setters
  get scrollTop(): number {
    return this._scrollTop;
  }
  set scrollTop(value: number) {
    const maxScroll = Math.max(0, this._contentHeight - (this.maxHeight || this._contentHeight));
    this._scrollTop = Math.max(0, Math.min(value, maxScroll));
  }

  get scrollLeft(): number {
    return this._scrollLeft;
  }
  set scrollLeft(value: number) {
    const maxScroll = Math.max(0, this._contentWidth - (this.maxWidth || this._contentWidth));
    this._scrollLeft = Math.max(0, Math.min(value, maxScroll));
  }

  // maxHeight and maxWidth are inherited from Node class - no getter/setter needed

  get contentHeight(): number {
    return this._contentHeight;
  }
  get contentWidth(): number {
    return this._contentWidth;
  }

  get showsVerticalScrollIndicator(): boolean {
    return this._showsVerticalScrollIndicator;
  }
  set showsVerticalScrollIndicator(value: boolean) {
    this._showsVerticalScrollIndicator = value;
  }

  get showsHorizontalScrollIndicator(): boolean {
    return this._showsHorizontalScrollIndicator;
  }
  set showsHorizontalScrollIndicator(value: boolean) {
    this._showsHorizontalScrollIndicator = value;
  }

  get horizontal(): boolean {
    return this._horizontal;
  }
  set horizontal(value: boolean) {
    this._horizontal = value;
  }

  get scrollbarStyle(): ScrollbarStyle {
    return this._scrollbarStyle;
  }
  set scrollbarStyle(value: ScrollbarStyle) {
    this._scrollbarStyle = { ...this._scrollbarStyle, ...value };
  }

  get scrollStep(): number {
    return this._scrollStep;
  }
  set scrollStep(value: number) {
    this._scrollStep = value;
  }

  get keyboardScrollEnabled(): boolean {
    return this._keyboardScrollEnabled;
  }
  set keyboardScrollEnabled(value: boolean) {
    this._keyboardScrollEnabled = value;
  }

  get autoScrollToBottom(): boolean {
    return this._autoScrollToBottom;
  }
  set autoScrollToBottom(value: boolean) {
    this._autoScrollToBottom = value;
  }

  get scrollbarBounds(): ScrollbarBounds | null {
    return this._scrollbarBounds;
  }

  // Screen position getters (actual rendered position, accounting for parent scroll)
  get screenX(): number {
    return this._screenX;
  }
  get screenY(): number {
    return this._screenY;
  }
  get screenWidth(): number {
    return this._screenWidth;
  }
  get screenHeight(): number {
    return this._screenHeight;
  }

  /**
   * Check if scroll is at or near the bottom
   */
  get isAtBottom(): boolean {
    const maxScroll = Math.max(0, this._contentHeight - (this.maxHeight || this._contentHeight));
    return this._scrollTop >= maxScroll - 1; // Allow 1 row tolerance
  }

  /**
   * Check if content overflows and scrolling is needed
   */
  get canScrollVertically(): boolean {
    return this.maxHeight !== null && this._contentHeight > this.maxHeight;
  }

  get canScrollHorizontally(): boolean {
    return this.maxWidth !== null && this._contentWidth > this.maxWidth;
  }

  /**
   * Scroll by a delta amount
   */
  scrollBy(deltaY: number, deltaX: number = 0): void {
    const oldTop = this._scrollTop;
    const oldLeft = this._scrollLeft;

    this.scrollTop = this._scrollTop + deltaY;
    this.scrollLeft = this._scrollLeft + deltaX;

    if (this._scrollTop !== oldTop || this._scrollLeft !== oldLeft) {
      this.onScroll?.(this._scrollTop, this._scrollLeft);
      this.onUpdate();
    }
  }

  /**
   * Scroll to specific position
   */
  scrollTo(top: number, left: number = 0): void {
    const oldTop = this._scrollTop;
    const oldLeft = this._scrollLeft;

    this.scrollTop = top;
    this.scrollLeft = left;

    if (this._scrollTop !== oldTop || this._scrollLeft !== oldLeft) {
      this.onScroll?.(this._scrollTop, this._scrollLeft);
      this.onUpdate();
    }
  }

  /**
   * Get the content Y position of a descendant node
   * Returns the Y position within the scroll content, or -1 if not found
   */
  getContentPositionOf(targetNode: Node): number {
    let position = 0;

    const findNode = (node: Node, currentY: number): number => {
      if (node === targetNode) {
        return currentY;
      }

      // Check children
      if (!(node as unknown as RenderableNode).handlesOwnChildren && node.children.length > 0) {
        let childY = currentY;
        for (const child of node.children) {
          const result = findNode(child, childY);
          if (result >= 0) return result;
          childY += child.bounds?.height || 1;
        }
      }

      return -1;
    };

    // Search through direct children
    for (const child of this.children) {
      const result = findNode(child, position);
      if (result >= 0) return result;
      position += child.bounds?.height || 1;
    }

    return -1;
  }

  /**
   * Scroll to make a descendant node visible
   */
  scrollToNode(node: Node): void {
    const contentY = this.getContentPositionOf(node);
    if (contentY < 0) return;

    const nodeHeight = node.bounds?.height || 1;
    const visibleHeight = this.maxHeight || this._contentHeight;

    // Check if node is above visible area
    if (contentY < this._scrollTop) {
      this.scrollTo(contentY, 0);
    }
    // Check if node is below visible area
    else if (contentY + nodeHeight > this._scrollTop + visibleHeight) {
      this.scrollTo(contentY + nodeHeight - visibleHeight, 0);
    }
  }

  /**
   * Scroll to end of content
   */
  scrollToEnd(): void {
    if (this._horizontal) {
      this.scrollTo(0, this._contentWidth);
    } else {
      this.scrollTo(this._contentHeight, 0);
    }
  }

  /**
   * Handle scrollbar click - scroll page up/down based on click position
   * @param clickY - Y position of click (screen coordinates)
   */
  handleScrollbarClick(clickY: number): void {
    if (!this._scrollbarBounds) return;

    const relativeY = clickY - this._scrollbarBounds.y;
    const thumbStart = this._scrollbarBounds.thumbStart;
    const thumbEnd = thumbStart + this._scrollbarBounds.thumbHeight;

    // Click above thumb - page up
    if (relativeY < thumbStart) {
      const pageSize = (this.maxHeight || 10) - 1;
      this.scrollBy(-pageSize, 0);
    }
    // Click below thumb - page down
    else if (relativeY >= thumbEnd) {
      const pageSize = (this.maxHeight || 10) - 1;
      this.scrollBy(pageSize, 0);
    }
    // Click on thumb - do nothing (drag will handle it)
  }

  /**
   * Handle scrollbar drag - scroll proportionally based on thumb position
   * @param clickY - Y position of drag (screen coordinates)
   */
  handleScrollbarDrag(clickY: number): void {
    if (!this._scrollbarBounds) return;

    const scrollbarHeight = this._scrollbarBounds.height;
    const thumbHeight = this._scrollbarBounds.thumbHeight;
    const relativeY = clickY - this._scrollbarBounds.y;

    // Calculate scroll position based on thumb center
    const thumbCenter = relativeY;
    const trackHeight = scrollbarHeight - thumbHeight;

    if (trackHeight <= 0) return;

    // Calculate scroll ratio (0 to 1)
    const scrollRatio = Math.max(0, Math.min(1, (thumbCenter - thumbHeight / 2) / trackHeight));

    // Calculate target scroll position
    const maxScroll = Math.max(0, this._contentHeight - (this.maxHeight || this._contentHeight));
    const targetScroll = Math.round(scrollRatio * maxScroll);

    this.scrollTo(targetScroll, 0);
  }

  /**
   * Check if a point is on the scrollbar
   */
  isPointOnScrollbar(x: number, y: number): boolean {
    if (!this._scrollbarBounds) return false;

    const sb = this._scrollbarBounds;
    return x >= sb.x && x < sb.x + sb.width && y >= sb.y && y < sb.y + sb.height;
  }

  /**
   * Check if a point is on the scrollbar thumb
   */
  isPointOnThumb(x: number, y: number): boolean {
    if (!this._scrollbarBounds) return false;

    const sb = this._scrollbarBounds;
    const thumbY = sb.y + sb.thumbStart;
    const thumbEndY = thumbY + sb.thumbHeight;

    return x >= sb.x && x < sb.x + sb.width && y >= thumbY && y < thumbEndY;
  }

  /**
   * Handle keyboard events for scrolling
   */
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (!this._keyboardScrollEnabled || this.disabled) return;

    const key = event.key as KeyEventData;

    if (this._horizontal) {
      interface HorizontalKeyEvent extends KeyEventData {
        left?: boolean;
        leftArrow?: boolean;
        right?: boolean;
        rightArrow?: boolean;
      }
      const hKey = key as HorizontalKeyEvent;
      if (hKey.left || hKey.leftArrow) {
        this.scrollBy(0, -this._scrollStep);
        event.preventDefault?.();
      } else if (hKey.right || hKey.rightArrow) {
        this.scrollBy(0, this._scrollStep);
        event.preventDefault?.();
      }
    } else {
      interface VerticalKeyEvent extends KeyEventData {
        up?: boolean;
        down?: boolean;
      }
      const vKey = key as VerticalKeyEvent;
      if (vKey.up || vKey.upArrow) {
        this.scrollBy(-this._scrollStep, 0);
        event.preventDefault?.();
      } else if (vKey.down || vKey.downArrow) {
        this.scrollBy(this._scrollStep, 0);
        event.preventDefault?.();
      } else if (key.pageUp) {
        const pageSize = (this.maxHeight || 10) - 1;
        this.scrollBy(-pageSize, 0);
        event.preventDefault?.();
      } else if (key.pageDown) {
        const pageSize = (this.maxHeight || 10) - 1;
        this.scrollBy(pageSize, 0);
        event.preventDefault?.();
      } else if (key.home) {
        this.scrollTo(0, 0);
        event.preventDefault?.();
      } else if (key.end) {
        this.scrollToEnd();
        event.preventDefault?.();
      }
    }

    // Call parent class method via prototype (TypeScript doesn't see it due to mixin pattern)
    const parentProto = Object.getPrototypeOf(Object.getPrototypeOf(this));
    if (parentProto && typeof parentProto.handleKeyboardEvent === 'function') {
      parentProto.handleKeyboardEvent.call(this, event);
    }
  }

  computeLayout(constraints: LayoutConstraints): LayoutResult {
    // Track if we were at bottom before content update (for auto-scroll)
    const wasAtBottom = this.isAtBottom;
    const oldContentHeight = this._contentHeight;

    // Get computed style to check for flex display
    const style = this.computeStyle();
    this.display = style.getDisplay() as DisplayMode;

    // Calculate available content width (excluding scrollbar space)
    const availableWidth = constraints.maxWidth || constraints.availableWidth || 80;
    const showScrollbar = this._showsVerticalScrollIndicator;
    const scrollbarWidth = showScrollbar ? this._scrollbarStyle.width || 1 : 0;
    const contentAreaWidth = availableWidth - scrollbarWidth;

    // Content constraints for children - no height limit (content can be taller than viewport)
    const contentConstraints: LayoutConstraints = {
      maxWidth: contentAreaWidth,
      maxHeight: undefined, // No height limit for scrollable content
      availableWidth: contentAreaWidth,
      availableHeight: undefined,
    };

    // Use LayoutEngine for proper flex/block layout
    const layoutEngine = new LayoutEngine();
    let childLayouts: ChildLayout[] = [];

    if (this.display === DisplayModeEnum.FLEX) {
      // Use flexbox layout
      childLayouts = layoutEngine.layoutFlexbox(this as unknown as Node, contentConstraints);
    } else if (this.display === DisplayModeEnum.GRID) {
      // Use grid layout
      childLayouts = layoutEngine.layoutGrid(this as unknown as Node, contentConstraints);
    } else {
      // Default block layout (vertical stacking)
      childLayouts = layoutEngine.layoutBlock(this as unknown as Node, contentConstraints);
    }

    // Store child layouts for use in renderToCellBuffer
    // NOTE: We don't update child.bounds here because that would affect
    // how children calculate their own nested positions. Instead, we use
    // _childLayouts directly for positioning during rendering.
    this._childLayouts = childLayouts;

    // Calculate content dimensions from laid out children
    let contentWidth = 0;
    let contentHeight = 0;

    for (const childLayout of childLayouts) {
      const childRight = childLayout.bounds.x + childLayout.bounds.width;
      const childBottom = childLayout.bounds.y + childLayout.bounds.height;
      contentWidth = Math.max(contentWidth, childRight);
      contentHeight = Math.max(contentHeight, childBottom);
    }

    // Fallback: if no layouts returned, compute children manually
    if (childLayouts.length === 0 && this.children.length > 0) {
      let currentY = 0;
      for (const child of this.children) {
        if ('computeLayout' in child) {
          const childLayout = (child as unknown as RenderableNode).computeLayout!(
            contentConstraints
          );
          const childWidth = childLayout.dimensions?.width || 0;
          const childHeight = childLayout.dimensions?.height || 0;

          // Store layout for rendering
          this._childLayouts.push({
            node: child,
            bounds: { x: 0, y: currentY, width: childWidth, height: childHeight },
          });

          contentWidth = Math.max(contentWidth, childWidth);
          currentY += childHeight;
        }
      }
      contentHeight = currentY;
    }

    this._contentWidth = contentWidth;
    this._contentHeight = contentHeight;

    // Auto-scroll to bottom if content grew and we were at bottom
    if (this._autoScrollToBottom && wasAtBottom && contentHeight > oldContentHeight) {
      const maxScroll = Math.max(0, contentHeight - (this.maxHeight || contentHeight));
      this._scrollTop = maxScroll;
    }

    // Calculate visible dimensions
    // Height: use maxHeight if set, otherwise content height
    const visibleHeight =
      this.maxHeight !== null ? Math.min(this.maxHeight, this._contentHeight) : this._contentHeight;

    // Recalculate scrollbar visibility based on actual content
    const actualShowScrollbar =
      this._showsVerticalScrollIndicator && this._contentHeight > (this.maxHeight || Infinity);
    const actualScrollbarWidth = actualShowScrollbar ? this._scrollbarStyle.width || 1 : 0;

    // Calculate content area width using actual scrollbar presence (not speculative)
    // This ensures consistent width math without overflow
    const actualContentAreaWidth = availableWidth - actualScrollbarWidth;

    // Width: fill available space by default (like a block element)
    // Use contentAreaWidth (excluding scrollbar) for the content portion
    const visibleWidth =
      this.maxWidth !== null
        ? Math.min(this.maxWidth, actualContentAreaWidth)
        : actualContentAreaWidth;

    const dimensions: Dimensions = {
      width: visibleWidth + actualScrollbarWidth,
      height: visibleHeight,
      contentWidth: visibleWidth,
      contentHeight: visibleHeight,
    };

    this.bounds = {
      x: 0,
      y: 0,
      width: dimensions.width,
      height: dimensions.height,
    };

    return {
      dimensions,
      layout: {},
      bounds: this.bounds,
      children: this._childLayouts,
    };
  }

  render(
    _buffer: import('../base/mixins/Renderable').OutputBuffer,
    context: RenderContext
  ): RenderResult {
    const layout = this.computeLayout(context.constraints);
    return {
      endX: context.x + layout.dimensions.width,
      endY: context.y + layout.dimensions.height,
      width: layout.dimensions.width,
      height: layout.dimensions.height,
      bounds: layout.bounds,
    };
  }

  /**
   * Render to cell buffer with scrolling and scrollbar
   */
  renderToCellBuffer(context: {
    buffer: CellBuffer;
    x: number;
    y: number;
    maxWidth: number;
    maxHeight: number;
    layerId: string;
    nodeId: string | null;
    zIndex: number;
  }): void {
    const { buffer, x, y, maxWidth, maxHeight, layerId, nodeId, zIndex } = context;

    // Calculate visible dimensions - use maxHeight from props
    const visibleHeight = this.maxHeight !== null ? Math.min(this.maxHeight, maxHeight) : maxHeight;
    const visibleWidth = this.maxWidth !== null ? Math.min(this.maxWidth, maxWidth) : maxWidth;

    // Store actual screen position for hit testing
    this._screenX = x;
    this._screenY = y;
    this._screenWidth = visibleWidth;
    this._screenHeight = visibleHeight;

    const showScrollbar = this._showsVerticalScrollIndicator && this.canScrollVertically;
    const scrollbarWidth = showScrollbar ? this._scrollbarStyle.width || 1 : 0;
    const contentAreaWidth = visibleWidth - scrollbarWidth;

    // Use stored child layouts from computeLayout (respects flex positioning)
    if (this._childLayouts.length > 0) {
      // Render children using their computed layout positions
      for (const childLayout of this._childLayouts) {
        this.renderChildWithLayout(
          childLayout.node,
          childLayout.bounds,
          buffer,
          x, // viewport screen X
          y, // viewport screen Y
          contentAreaWidth,
          visibleHeight,
          layerId,
          zIndex
        );
      }
    } else {
      // Fallback: render children with simple vertical stacking
      let contentY = 0;
      for (const child of this.children) {
        const childHeight = this.renderChildWithScroll(
          child,
          buffer,
          x, // viewport screen X
          y, // viewport screen Y
          contentAreaWidth,
          visibleHeight,
          contentY, // Y position in content area
          0, // X position (default left)
          layerId,
          zIndex
        );
        contentY += childHeight;
      }
    }

    // Render scrollbar if needed
    if (showScrollbar) {
      this.renderScrollbar(
        buffer,
        x + contentAreaWidth,
        y,
        scrollbarWidth,
        visibleHeight,
        layerId,
        nodeId,
        zIndex
      );
    }
  }

  /**
   * Render a child using its computed layout bounds (for flex support)
   * Recursively renders all descendants since BoxNode.renderToCellBuffer doesn't render children
   */
  private renderChildWithLayout(
    node: Node,
    bounds: { x: number; y: number; width: number; height: number },
    buffer: CellBuffer,
    viewportX: number,
    viewportY: number,
    viewportWidth: number,
    viewportHeight: number,
    layerId: string,
    zIndex: number
  ): void {
    const nodeWidth = bounds.width;
    const nodeHeight = bounds.height;
    const contentX = bounds.x;
    const contentY = bounds.y;

    // Apply scroll offset to get position in visible viewport
    const scrolledY = contentY - this._scrollTop;
    const scrolledX = contentX - this._scrollLeft;

    // Check if node is visible in viewport
    if (scrolledY + nodeHeight <= 0 || scrolledY >= viewportHeight) {
      return; // Node is outside visible area
    }
    if (scrolledX + nodeWidth <= 0 || scrolledX >= viewportWidth) {
      return; // Node is outside visible area horizontally
    }

    // Calculate clipped render position and size
    const clipTop = scrolledY < 0 ? -scrolledY : 0;
    const clipLeft = scrolledX < 0 ? -scrolledX : 0;
    const renderY = viewportY + Math.max(0, scrolledY);
    const renderX = viewportX + Math.max(0, scrolledX);
    const renderHeight = Math.min(nodeHeight - clipTop, viewportHeight - Math.max(0, scrolledY));
    const renderWidth = Math.min(nodeWidth - clipLeft, viewportWidth - Math.max(0, scrolledX));

    if (renderHeight <= 0 || renderWidth <= 0) return;

    // Render the node's own content (background, border, text)
    const renderableNode = node as unknown as RenderableNode;

    if (renderableNode.renderToCellBuffer) {
      renderableNode.renderToCellBuffer({
        buffer,
        x: renderX,
        y: renderY,
        maxWidth: renderWidth,
        maxHeight: renderHeight,
        clipRegion: {
          x: renderX,
          y: renderY,
          width: renderWidth,
          height: renderHeight,
        },
      });
    }

    // Register interactive components for mouse event handling
    const isInteractive =
      renderableNode.onClick ||
      renderableNode.onPress ||
      node.type === 'button' ||
      node.type === 'input' ||
      node.type === 'checkbox' ||
      node.type === 'radio' ||
      node.type === 'dropdown' ||
      node.type === 'select';

    if (isInteractive) {
      componentBoundsRegistry.register(
        createComponentBounds(
          node as unknown as import('../../types').ConsoleNode,
          renderX,
          renderY,
          renderWidth,
          renderHeight
        )
      );
    }

    // Recursively render children - this is needed because BoxNode.renderToCellBuffer
    // doesn't render its children (it normally relies on BufferRenderer to walk the tree)
    if (!renderableNode.handlesOwnChildren && node.children.length > 0) {
      // Get node's content area offset (border + padding)
      const nodeContentOffsetX = (node.padding?.left || 0) + (node.border?.width?.left || 0);
      const nodeContentOffsetY = (node.padding?.top || 0) + (node.border?.width?.top || 0);

      for (const child of node.children) {
        // Use child's computed bounds (relative to parent's content area)
        const childBounds = child.bounds;
        if (childBounds) {
          // Child bounds are relative to parent's (0,0).
          // We need to add the parent's position (contentX, contentY) to get absolute position.
          this.renderChildWithLayout(
            child,
            {
              x: contentX + nodeContentOffsetX + childBounds.x,
              y: contentY + nodeContentOffsetY + childBounds.y,
              width: childBounds.width,
              height: childBounds.height,
            },
            buffer,
            viewportX,
            viewportY,
            viewportWidth,
            viewportHeight,
            layerId,
            zIndex
          );
        }
      }
    }
  }

  /**
   * Render a child with scroll offset, returns height consumed (legacy fallback)
   */
  private renderChildWithScroll(
    node: Node,
    buffer: CellBuffer,
    viewportX: number,
    viewportY: number,
    viewportWidth: number,
    viewportHeight: number,
    contentY: number,
    contentX: number,
    layerId: string,
    zIndex: number
  ): number {
    // Get node dimensions
    const nodeBounds = node.bounds;
    const nodeHeight = nodeBounds?.height || 1;
    const nodeWidth = nodeBounds?.width || viewportWidth;

    // Apply scroll offset to get position in visible viewport
    const scrolledY = contentY - this._scrollTop;
    const scrolledX = contentX - this._scrollLeft;

    // Check if node is visible in viewport
    if (scrolledY + nodeHeight <= 0 || scrolledY >= viewportHeight) {
      // Node is outside visible area, but still need to recurse for descendants
      // Return height so content tracking continues
      return nodeHeight;
    }

    // Calculate clipped render position and size
    const clipTop = scrolledY < 0 ? -scrolledY : 0;
    const clipLeft = scrolledX < 0 ? -scrolledX : 0;
    const renderY = viewportY + Math.max(0, scrolledY);
    const renderX = viewportX + Math.max(0, scrolledX);
    const renderHeight = Math.min(nodeHeight - clipTop, viewportHeight - Math.max(0, scrolledY));
    const renderWidth = Math.min(nodeWidth - clipLeft, viewportWidth - Math.max(0, scrolledX));

    if (renderHeight <= 0) return nodeHeight;

    // Render the node
    const renderableNode = node as unknown as RenderableNode;
    if (renderableNode.renderToCellBuffer) {
      renderableNode.renderToCellBuffer({
        buffer,
        x: renderX,
        y: renderY,
        maxWidth: renderWidth,
        maxHeight: renderHeight,
        clipRegion: {
          x: renderX,
          y: renderY,
          width: renderWidth,
          height: renderHeight,
        },
      });
    }

    // Register interactive components for mouse event handling
    const isInteractive =
      renderableNode.onClick ||
      renderableNode.onPress ||
      node.type === 'button' ||
      node.type === 'input' ||
      node.type === 'checkbox' ||
      node.type === 'radio' ||
      node.type === 'dropdown' ||
      node.type === 'select';

    if (isInteractive) {
      // Register with visible bounds (accounting for scroll and clipping)
      // Components should already have proper width from computeLayout (block behavior)
      componentBoundsRegistry.register(
        createComponentBounds(
          node as unknown as import('../../types').ConsoleNode,
          renderX,
          renderY,
          renderWidth,
          renderHeight
        )
      );
    }

    // Render children recursively with nested content tracking
    if (!renderableNode.handlesOwnChildren && node.children.length > 0) {
      let nestedY = contentY;
      for (const child of node.children) {
        const childHeight = this.renderChildWithScroll(
          child,
          buffer,
          viewportX,
          viewportY,
          viewportWidth,
          viewportHeight,
          nestedY,
          contentX,
          layerId,
          zIndex
        );
        nestedY += childHeight;
      }
    }

    return nodeHeight;
  }

  /**
   * Render the vertical scrollbar
   */
  private renderScrollbar(
    buffer: CellBuffer,
    x: number,
    y: number,
    width: number,
    height: number,
    layerId: string,
    nodeId: string | null,
    zIndex: number
  ): void {
    const { trackColor, thumbColor, trackChar, thumbChar } = this._scrollbarStyle;

    // Calculate thumb position and size
    const scrollRatio = this._contentHeight > 0 ? height / this._contentHeight : 1;
    const thumbHeight = Math.max(1, Math.floor(height * scrollRatio));
    const maxScroll = Math.max(1, this._contentHeight - (this.maxHeight || this._contentHeight));
    const thumbPosition =
      maxScroll > 0 ? Math.floor((this._scrollTop / maxScroll) * (height - thumbHeight)) : 0;

    // Store scrollbar bounds for mouse interaction
    this._scrollbarBounds = {
      x,
      y,
      width,
      height,
      thumbStart: thumbPosition,
      thumbHeight,
    };

    // Register scrollbar area for mouse events
    // We register the scrollview itself with scrollbar bounds so mouse handler can detect it
    componentBoundsRegistry.register(
      createComponentBounds(
        this as unknown as import('../../types').ConsoleNode,
        x,
        y,
        width,
        height,
        zIndex + 1 // Higher z-index so scrollbar is on top
      )
    );

    // Render track and thumb
    for (let row = 0; row < height; row++) {
      const isThumb = row >= thumbPosition && row < thumbPosition + thumbHeight;
      const char = isThumb ? thumbChar || '█' : trackChar || '│';
      const color = isThumb ? thumbColor : trackColor;

      for (let col = 0; col < width; col++) {
        buffer.setCell(x + col, y + row, {
          char,
          foreground: color,
          layerId,
          nodeId,
          zIndex: zIndex + 1, // Scrollbar on top
        });
      }
    }
  }

  /**
   * Called before content updates to track if we were at bottom
   */
  beforeContentUpdate(): void {
    this._wasAtBottom = this.isAtBottom;
  }

  /**
   * Called after content updates to auto-scroll if needed
   */
  afterContentUpdate(newContentHeight: number): void {
    // Check if content grew and we should auto-scroll
    if (this._autoScrollToBottom && this._wasAtBottom && newContentHeight > this._contentHeight) {
      // Content grew and we were at bottom - scroll to new bottom
      this._contentHeight = newContentHeight;
      this.scrollToEnd();
    }
  }
}
