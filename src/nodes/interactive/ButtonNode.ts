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
 * State-specific style overrides
 */
interface ButtonStateStyle {
  color?: string;
  backgroundColor?: string;
  bold?: boolean;
}

/**
 * Button node - clickable button
 */
export class ButtonNode extends Stylable(Renderable(Interactive(Node as any))) {
  private label: string = '';
  private _isHovered: boolean = false;
  private _isPressed: boolean = false;
  
  // State-specific style overrides (customizable via props)
  public disabledStyle?: ButtonStateStyle;
  public focusedStyle?: ButtonStateStyle;
  public pressedStyle?: ButtonStateStyle;
  public hoveredStyle?: ButtonStateStyle;
  
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
    // +4 for focus indicators (prefix "> " or "  " = 2, suffix " <" or "  " = 2)
    const totalWidth = textWidth + borderWidth.left + borderWidth.right + this.padding.left + this.padding.right + 4;
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
    const { buffer, x, y, maxWidth, layerId, nodeId, zIndex } = context;
    const text = this.label || this.content || '';
    const isFocused = this.focused;
    const isDisabled = this.disabled;
    
    // Default colors for each state
    const defaultDisabledStyle = { color: '#666666', backgroundColor: '#222222', bold: false };
    const defaultPressedStyle = { color: '#ffffff', backgroundColor: '#005500', bold: true };
    const defaultFocusedStyle = { color: '#00ff00', backgroundColor: '#333333', bold: true };
    const defaultHoveredStyle = { color: '#00ffff', backgroundColor: '#222222', bold: false };
    
    // Determine colors based on state (with custom style overrides)
    let fgColor: string;
    let bgColor: string;
    let bold = false;
    
    if (isDisabled) {
      const style = { ...defaultDisabledStyle, ...this.disabledStyle };
      fgColor = style.color!;
      bgColor = style.backgroundColor!;
      bold = style.bold!;
    } else if (this._isPressed) {
      const style = { ...defaultPressedStyle, ...this.pressedStyle };
      fgColor = style.color!;
      bgColor = style.backgroundColor!;
      bold = style.bold!;
    } else if (isFocused) {
      const style = { ...defaultFocusedStyle, ...this.focusedStyle };
      fgColor = style.color!;
      bgColor = style.backgroundColor!;
      bold = style.bold!;
    } else if (this._isHovered) {
      const style = { ...defaultHoveredStyle, ...this.hoveredStyle };
      fgColor = style.color!;
      bgColor = style.backgroundColor!;
      bold = style.bold!;
    } else {
      // Normal state
      const stateStyle = this.getStateStyle();
      fgColor = stateStyle.color;
      bgColor = stateStyle.backgroundColor;
      bold = stateStyle.bold;
    }
    
    // Focus indicator prefix/suffix
    const prefix = isFocused ? '> ' : '  ';
    const suffix = isFocused ? ' <' : '  ';
    const indicatorColor = isFocused ? '#00ff00' : undefined;
    
    let currentX = x;
    
    // Render prefix
    for (let i = 0; i < prefix.length && currentX < x + maxWidth; i++) {
      buffer.setCell(currentX, y, {
        char: prefix[i],
        foreground: indicatorColor,
        background: bgColor,
        bold: isFocused,
        layerId,
        nodeId,
        zIndex,
      });
      currentX++;
    }
    
    // Render button text
    for (let i = 0; i < text.length && currentX < x + maxWidth - suffix.length; i++) {
      buffer.setCell(currentX, y, {
        char: text[i],
        foreground: fgColor,
        background: bgColor,
        bold,
        layerId,
        nodeId,
        zIndex,
      });
      currentX++;
    }
    
    // Render suffix
    for (let i = 0; i < suffix.length && currentX < x + maxWidth; i++) {
      buffer.setCell(currentX, y, {
        char: suffix[i],
        foreground: indicatorColor,
        background: bgColor,
        bold: isFocused,
        layerId,
        nodeId,
        zIndex,
      });
      currentX++;
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
    
    // Determine styling based on state: focused, hovered, pressed, disabled
    const isFocused = this.focused;
    const isHovered = this._isHovered;
    const isPressed = this._isPressed;
    const isDisabled = this.disabled;
    
    let bgColor = style.getBackgroundColor();
    let fgColor = style.getColor() || '#ffffff';
    let bold = style.getBold();
    
    if (isDisabled) {
      fgColor = 'gray';
      bgColor = undefined;
    } else if (isPressed) {
      bgColor = '#005500';
      fgColor = '#ffffff';
      bold = true;
    } else if (isFocused) {
      bgColor = '#333333';
      fgColor = '#00ff00';
      bold = true;
    } else if (isHovered) {
      bgColor = '#222222';
      fgColor = '#00ffff';
    }
    
    // Add focus indicator
    const prefix = isFocused ? applyStyles('> ', { color: '#00ff00', bold: true }) : '  ';
    const suffix = isFocused ? applyStyles(' <', { color: '#00ff00', bold: true }) : '  ';
    
    const styledText = applyStyles(text, {
      color: fgColor,
      backgroundColor: bgColor,
      bold,
    });
    
    buffer.lines[y] = padToVisibleColumn(currentLine, x) + prefix + styledText + suffix;
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
