/**
 * ScrollView node - scrollable container
 * Extends BoxNode with scrolling capability and optional scrollbar
 */

import { Node } from '../base/Node';
import { Stylable, Renderable, Interactive, type RenderContext, type RenderResult, type KeyboardEvent } from '../base/mixins';
import type { StyleMap, Dimensions } from '../base/types';
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
 * ScrollView node - scrollable container with optional scrollbar
 */
export class ScrollViewNode extends Stylable(Renderable(Interactive(Node as any))) {
  // Scroll state
  private _scrollTop: number = 0;
  private _scrollLeft: number = 0;
  private _maxHeight: number | null = null;
  private _maxWidth: number | null = null;
  
  // Content dimensions (calculated during layout)
  private _contentHeight: number = 0;
  private _contentWidth: number = 0;
  
  // Scroll indicators
  private _showsVerticalScrollIndicator: boolean = true;
  private _showsHorizontalScrollIndicator: boolean = false;
  private _horizontal: boolean = false;
  
  // Scrollbar styling
  private _scrollbarStyle: ScrollbarStyle = {
    trackColor: '#333333',
    thumbColor: '#888888',
    width: 1,
    trackChar: '│',
    thumbChar: '█',
  };
  
  // Behavior
  private _scrollStep: number = 1;
  private _keyboardScrollEnabled: boolean = true;
  
  // Callback
  onScroll?: (scrollTop: number, scrollLeft: number) => void;
  
  constructor(id?: string) {
    super(id);
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
  get scrollTop(): number { return this._scrollTop; }
  set scrollTop(value: number) {
    const maxScroll = Math.max(0, this._contentHeight - (this._maxHeight || this._contentHeight));
    this._scrollTop = Math.max(0, Math.min(value, maxScroll));
  }
  
  get scrollLeft(): number { return this._scrollLeft; }
  set scrollLeft(value: number) {
    const maxScroll = Math.max(0, this._contentWidth - (this._maxWidth || this._contentWidth));
    this._scrollLeft = Math.max(0, Math.min(value, maxScroll));
  }
  
  get maxHeight(): number | null { return this._maxHeight; }
  set maxHeight(value: number | null) { this._maxHeight = value; }
  
  get maxWidth(): number | null { return this._maxWidth; }
  set maxWidth(value: number | null) { this._maxWidth = value; }
  
  get contentHeight(): number { return this._contentHeight; }
  get contentWidth(): number { return this._contentWidth; }
  
  get showsVerticalScrollIndicator(): boolean { return this._showsVerticalScrollIndicator; }
  set showsVerticalScrollIndicator(value: boolean) { this._showsVerticalScrollIndicator = value; }
  
  get showsHorizontalScrollIndicator(): boolean { return this._showsHorizontalScrollIndicator; }
  set showsHorizontalScrollIndicator(value: boolean) { this._showsHorizontalScrollIndicator = value; }
  
  get horizontal(): boolean { return this._horizontal; }
  set horizontal(value: boolean) { this._horizontal = value; }
  
  get scrollbarStyle(): ScrollbarStyle { return this._scrollbarStyle; }
  set scrollbarStyle(value: ScrollbarStyle) {
    this._scrollbarStyle = { ...this._scrollbarStyle, ...value };
  }
  
  get scrollStep(): number { return this._scrollStep; }
  set scrollStep(value: number) { this._scrollStep = value; }
  
  get keyboardScrollEnabled(): boolean { return this._keyboardScrollEnabled; }
  set keyboardScrollEnabled(value: boolean) { this._keyboardScrollEnabled = value; }
  
  /**
   * Check if content overflows and scrolling is needed
   */
  get canScrollVertically(): boolean {
    return this._maxHeight !== null && this._contentHeight > this._maxHeight;
  }
  
  get canScrollHorizontally(): boolean {
    return this._maxWidth !== null && this._contentWidth > this._maxWidth;
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
   * Handle keyboard events for scrolling
   */
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (!this._keyboardScrollEnabled || this.disabled) return;
    
    const key = event.key as any; // Cast to any for flexible key access
    
    if (this._horizontal) {
      if (key.left || key.leftArrow) {
        this.scrollBy(0, -this._scrollStep);
        event.preventDefault?.();
      } else if (key.right || key.rightArrow) {
        this.scrollBy(0, this._scrollStep);
        event.preventDefault?.();
      }
    } else {
      if (key.up || key.upArrow) {
        this.scrollBy(-this._scrollStep, 0);
        event.preventDefault?.();
      } else if (key.down || key.downArrow) {
        this.scrollBy(this._scrollStep, 0);
        event.preventDefault?.();
      } else if (key.pageUp) {
        const pageSize = (this._maxHeight || 10) - 1;
        this.scrollBy(-pageSize, 0);
        event.preventDefault?.();
      } else if (key.pageDown) {
        const pageSize = (this._maxHeight || 10) - 1;
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
  
  computeLayout(constraints: any): any {
    // First, calculate content dimensions by laying out children
    let contentWidth = 0;
    let contentHeight = 0;
    
    for (const child of this.children) {
      if ('computeLayout' in child) {
        const childLayout = (child as any).computeLayout(constraints);
        contentWidth = Math.max(contentWidth, childLayout.dimensions?.width || 0);
        contentHeight += childLayout.dimensions?.height || 0;
      }
    }
    
    this._contentWidth = contentWidth;
    this._contentHeight = contentHeight;
    
    // Calculate visible dimensions
    const visibleHeight = this._maxHeight !== null 
      ? Math.min(this._maxHeight, contentHeight)
      : contentHeight;
    const visibleWidth = this._maxWidth !== null
      ? Math.min(this._maxWidth, contentWidth)
      : contentWidth;
    
    // Add scrollbar width if showing
    const scrollbarWidth = (this._showsVerticalScrollIndicator && this.canScrollVertically) 
      ? (this._scrollbarStyle.width || 1) 
      : 0;
    
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
  
  render(_buffer: any, context: RenderContext): RenderResult {
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
    
    const visibleHeight = this._maxHeight !== null 
      ? Math.min(this._maxHeight, maxHeight)
      : maxHeight;
    const visibleWidth = this._maxWidth !== null
      ? Math.min(this._maxWidth, maxWidth)
      : maxWidth;
    
    const showScrollbar = this._showsVerticalScrollIndicator && this.canScrollVertically;
    const scrollbarWidth = showScrollbar ? (this._scrollbarStyle.width || 1) : 0;
    const contentAreaWidth = visibleWidth - scrollbarWidth;
    
    // Render children with scroll offset
    let childY = 0;
    for (const child of this.children) {
      if ('renderToCellBuffer' in child) {
        const childBounds = (child as any).bounds || { height: 1 };
        const childHeight = childBounds.height || 1;
        
        // Check if child is visible in scroll viewport
        const childTop = childY - this._scrollTop;
        const childBottom = childTop + childHeight;
        
        if (childBottom > 0 && childTop < visibleHeight) {
          // Render child at offset position
          const renderY = Math.max(0, childTop);
          const clipTop = childTop < 0 ? -childTop : 0;
          
          (child as any).renderToCellBuffer({
            buffer,
            x: x - this._scrollLeft,
            y: y + renderY,
            maxWidth: contentAreaWidth,
            maxHeight: Math.min(childHeight - clipTop, visibleHeight - renderY),
            layerId,
            nodeId,
            zIndex,
          });
        }
        
        childY += childHeight;
      }
    }
    
    // Render scrollbar if needed
    if (showScrollbar) {
      this.renderScrollbar(buffer, x + contentAreaWidth, y, scrollbarWidth, visibleHeight, layerId, nodeId, zIndex);
    }
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
    const scrollRatio = this._contentHeight > 0 
      ? height / this._contentHeight 
      : 1;
    const thumbHeight = Math.max(1, Math.floor(height * scrollRatio));
    const maxScroll = Math.max(1, this._contentHeight - (this._maxHeight || this._contentHeight));
    const thumbPosition = maxScroll > 0 
      ? Math.floor((this._scrollTop / maxScroll) * (height - thumbHeight))
      : 0;
    
    // Render track and thumb
    for (let row = 0; row < height; row++) {
      const isThumb = row >= thumbPosition && row < thumbPosition + thumbHeight;
      const char = isThumb ? (thumbChar || '█') : (trackChar || '│');
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
}
