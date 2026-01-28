/**
 * Button node - clickable button
 * Composed with Stylable, Renderable, and Interactive mixins
 */

import { Node } from '../base/Node';
import { Stylable, Renderable, Interactive, type OutputBuffer, type RenderContext, type RenderResult, type KeyboardEvent } from '../base/mixins';
import type { StyleMap, Dimensions } from '../base/types';
import type { MouseEvent } from '../base/mixins';
import { StyleMixinRegistry } from '../../style/mixins/registry';
import { measureText, padToVisibleColumn } from '../../utils/measure';
import { applyStyles } from '../../renderer/ansi';
import type { CellBuffer } from '../../buffer/CellBuffer';

/**
 * Button node - clickable button
 */
export class ButtonNode extends Stylable(Renderable(Interactive(Node as any))) {
  private label: string = '';
  private _isHovered: boolean = false;
  private _isPressed: boolean = false;
  
  constructor(id?: string) {
    super(id);
    this.applyStyleMixin('BaseStyle');
    // Default button styling
    this.padding = { top: 0, right: 1, bottom: 0, left: 1 };
  }
  
  getNodeType(): string {
    return 'button';
  }
  
  get isHovered(): boolean {
    return this._isHovered;
  }
  
  set isHovered(value: boolean) {
    this._isHovered = value;
  }
  
  get isPressed(): boolean {
    return this._isPressed;
  }
  
  set isPressed(value: boolean) {
    this._isPressed = value;
  }
  
  getDefaultStyle(): StyleMap {
    const baseStyle = StyleMixinRegistry.get('BaseStyle')?.getDefaultStyle() || {};
    return {
      ...baseStyle,
      backgroundColor: 'white',
      color: 'black',
    };
  }
  
  /**
   * Get the current style based on button state (normal, hovered, pressed)
   */
  getStateStyle(): { backgroundColor: string; color: string; bold: boolean } {
    if (this.disabled) {
      return { backgroundColor: 'gray', color: 'white', bold: false };
    }
    if (this._isPressed) {
      return { backgroundColor: 'blue', color: 'white', bold: true };
    }
    if (this._isHovered) {
      return { backgroundColor: 'cyan', color: 'black', bold: true };
    }
    // Normal state - use styled values or defaults
    // 'inherit' means no explicit color, so use button defaults
    const style = this.computeStyle();
    const bgColor = style.getBackgroundColor?.();
    const fgColor = style.getColor?.();
    return {
      backgroundColor: (bgColor && bgColor !== 'inherit') ? bgColor : 'white',
      color: (fgColor && fgColor !== 'inherit') ? fgColor : 'black',
      bold: style.getBold?.() || false,
    };
  }
  
  computeLayout(_constraints: any): any {
    if (this.bounds) {
      return {
        dimensions: {
          width: this.bounds.width,
          height: this.bounds.height,
          contentWidth: this.bounds.width,
          contentHeight: this.bounds.height,
        },
        layout: {},
        bounds: this.bounds,
      };
    }
    
    const text = this.label || this.content || '';
    const textWidth = measureText(text);
    const borderWidth = this.border.width;
    const totalWidth = textWidth + borderWidth.left + borderWidth.right + this.padding.left + this.padding.right;
    const totalHeight = 1 + borderWidth.top + borderWidth.bottom + this.padding.top + this.padding.bottom;
    
    const dimensions: Dimensions = {
      width: totalWidth,
      height: totalHeight,
      contentWidth: textWidth,
      contentHeight: 1,
    };
    
    this.bounds = {
      x: 0,
      y: 0,
      width: dimensions.width,
      height: dimensions.height,
    };
    
    this.contentArea = this.calculateContentArea();
    
    return {
      dimensions,
      layout: {},
      bounds: this.bounds,
    };
  }
  
  render(buffer: OutputBuffer, context: RenderContext): RenderResult {
    const style = this.computeStyle();
    const layout = this.computeLayout(context.constraints);
    
    // 1. Render background
    this.renderBackground(buffer, style, context);
    
    // 2. Render button text
    const contentArea = this.getContentArea();
    const text = this.label || this.content || '';
    this.renderButtonText(buffer, text, style, contentArea.x, contentArea.y);
    
    // 3. Render border
    this.renderBorder(buffer, style, context);
    
    // 4. Register rendering info
    const bufferRegion = {
      startX: context.x,
      startY: context.y,
      endX: context.x + layout.dimensions.width,
      endY: context.y + layout.dimensions.height,
      lines: [context.y],
    };
    
    this.registerRendering(
      bufferRegion,
      style.getZIndex() || 0,
      context.viewport
    );
    
    return {
      endX: context.x + layout.dimensions.width,
      endY: context.y + layout.dimensions.height,
      width: layout.dimensions.width,
      height: layout.dimensions.height,
      bounds: layout.bounds,
    };
  }
  
  /**
   * Render button to cell buffer (new buffer system)
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
    const stateStyle = this.getStateStyle();
    const text = this.label || this.content || '';
    
    // Calculate button width (text + padding)
    const textWidth = measureText(text);
    const buttonWidth = Math.min(maxWidth, textWidth + this.padding.left + this.padding.right);
    const buttonHeight = Math.min(maxHeight, 1 + this.padding.top + this.padding.bottom);
    
    // Fill background for entire button area
    buffer.fillBackground(
      x, y, buttonWidth, buttonHeight,
      stateStyle.backgroundColor,
      layerId,
      nodeId,
      zIndex
    );
    
    // Render button text with styling
    const textX = x + this.padding.left;
    const textY = y + this.padding.top;
    
    for (let i = 0; i < text.length && textX + i < x + maxWidth; i++) {
      buffer.setCell(textX + i, textY, {
        char: text[i],
        foreground: stateStyle.color,
        background: stateStyle.backgroundColor,
        bold: stateStyle.bold,
        layerId,
        nodeId,
        zIndex,
      });
    }
  }
  
  private renderButtonText(
    buffer: OutputBuffer,
    text: string,
    style: any,
    x: number,
    y: number
  ): void {
    while (buffer.lines.length <= y) {
      buffer.lines.push('');
    }
    
    const currentLine = buffer.lines[y] || '';
    const styledText = applyStyles(text, {
      color: style.getColor(),
      backgroundColor: style.getBackgroundColor(),
      bold: style.getBold(),
    });
    
    buffer.lines[y] = padToVisibleColumn(currentLine, x) + styledText;
  }
  
  // Override Interactive mixin methods for button-specific behavior
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (this.disabled) return;
    
    // Enter or Space activates button
    if (event.key.return || (event.key.char === ' ')) {
      this.handleClick({} as MouseEvent); // Create mock mouse event
      event.preventDefault();
    }
    
    super.handleKeyboardEvent(event);
  }
  
  /**
   * Handle mouse enter (hover start)
   */
  onMouseEnter(): void {
    if (this.disabled) return;
    this._isHovered = true;
    this.onUpdate();
  }
  
  /**
   * Handle mouse leave (hover end)
   */
  onMouseLeave(): void {
    this._isHovered = false;
    this._isPressed = false;
    this.onUpdate();
  }
  
  /**
   * Handle mouse down (press start)
   */
  onMouseDown(_event: MouseEvent): void {
    if (this.disabled) return;
    this._isPressed = true;
    this.onUpdate();
  }
  
  /**
   * Handle mouse up (press end / click)
   */
  onMouseUp(event: MouseEvent): void {
    if (this.disabled) return;
    
    const wasPressed = this._isPressed;
    this._isPressed = false;
    
    // Only trigger click if mouse was pressed on this button
    if (wasPressed && this.onClick) {
      this.onClick(event);
    }
    
    this.onUpdate();
  }
  
  setLabel(label: string): void {
    this.label = label;
    this.onUpdate();
  }
}
