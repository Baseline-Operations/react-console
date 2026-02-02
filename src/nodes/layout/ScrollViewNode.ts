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
} from '../base/mixins';
import type { StyleMap, Dimensions } from '../base/types';
import {
  componentBoundsRegistry,
  createComponentBounds,
} from '../../renderer/utils/componentBounds';
import { StyleMixinRegistry } from '../../style/mixins/registry';
import type { CellBuffer } from '../../buffer/CellBuffer';

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

/**
 * ScrollView node - scrollable container with optional scrollbar
 */
export class ScrollViewNode extends Stylable(
  Renderable(Layoutable(Interactive(Node as import('../base/types').Constructor<Node>)))
) {
  // Flag to tell BufferRenderer that this node handles its own children rendering
  readonly handlesOwnChildren = true;

  // Scroll state - declared without initializers, set in constructor
  protected _scrollTop!: number;
  protected _scrollLeft!: number;
  // maxHeight and maxWidth are inherited from Node class - don't redeclare

  // Content dimensions (calculated during layout)
  protected _contentHeight!: number;
  protected _contentWidth!: number;

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

    super.handleKeyboardEvent(event);
  }

  computeLayout(constraints: LayoutConstraints): LayoutResult {
    // Track if we were at bottom before content update (for auto-scroll)
    const wasAtBottom = this.isAtBottom;
    const oldContentHeight = this._contentHeight;

    // Calculate content dimensions by laying out children
    // Don't modify child bounds - they use absolute coordinates set by their own computeLayout
    // renderToCellBuffer converts absolute to relative using ScrollView's position
    let contentWidth = 0;
    let contentHeight = 0;

    for (const child of this.children) {
      if ('computeLayout' in child) {
        const childLayout = (child as unknown as RenderableNode).computeLayout!({
          ...constraints,
          // Don't limit maxHeight for children - they can be taller than visible area
          maxHeight: undefined,
        });

        const childWidth = childLayout.dimensions?.width || 0;
        const childHeight = childLayout.dimensions?.height || 0;

        contentWidth = Math.max(contentWidth, childWidth);
        contentHeight += childHeight;
      }
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
    // Width: fill available space by default (like a block element)
    const availableWidth = constraints.maxWidth || constraints.availableWidth || contentWidth;
    const visibleWidth =
      this.maxWidth !== null ? Math.min(this.maxWidth, availableWidth) : availableWidth;

    // Add scrollbar width if content overflows
    const showScrollbar =
      this._showsVerticalScrollIndicator && this._contentHeight > (this.maxHeight || Infinity);
    const scrollbarWidth = showScrollbar ? this._scrollbarStyle.width || 1 : 0;

    const dimensions: Dimensions = {
      width: visibleWidth + scrollbarWidth,
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

    // Track current content Y position as we render children
    let contentY = 0;

    // Render children with scroll offset and clipping
    for (const child of this.children) {
      const childHeight = this.renderChildWithScroll(
        child,
        buffer,
        x, // viewport screen X
        y, // viewport screen Y
        contentAreaWidth,
        visibleHeight,
        contentY, // Y position in content area
        layerId,
        zIndex
      );
      contentY += childHeight;
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
   * Render a child with scroll offset, returns height consumed
   */
  private renderChildWithScroll(
    node: Node,
    buffer: CellBuffer,
    viewportX: number,
    viewportY: number,
    viewportWidth: number,
    viewportHeight: number,
    contentY: number,
    layerId: string,
    zIndex: number
  ): number {
    // Get node dimensions
    const nodeBounds = node.bounds;
    const nodeHeight = nodeBounds?.height || 1;
    const nodeWidth = nodeBounds?.width || viewportWidth;

    // Apply scroll offset to get position in visible viewport
    const scrolledY = contentY - this._scrollTop;

    // Check if node is visible in viewport
    if (scrolledY + nodeHeight <= 0 || scrolledY >= viewportHeight) {
      // Node is outside visible area, but still need to recurse for descendants
      // Return height so content tracking continues
      return nodeHeight;
    }

    // Calculate clipped render position and size
    const clipTop = scrolledY < 0 ? -scrolledY : 0;
    const renderY = viewportY + Math.max(0, scrolledY);
    const renderHeight = Math.min(nodeHeight - clipTop, viewportHeight - Math.max(0, scrolledY));

    if (renderHeight <= 0) return nodeHeight;

    // Render the node
    const renderableNode = node as unknown as RenderableNode;
    if (renderableNode.renderToCellBuffer) {
      renderableNode.renderToCellBuffer({
        buffer,
        x: viewportX,
        y: renderY,
        maxWidth: Math.min(nodeWidth, viewportWidth),
        maxHeight: renderHeight,
        clipRegion: {
          x: viewportX,
          y: renderY,
          width: Math.min(nodeWidth, viewportWidth),
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
          viewportX,
          renderY,
          Math.min(nodeWidth, viewportWidth),
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
