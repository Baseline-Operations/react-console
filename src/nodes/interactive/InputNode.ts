/**
 * Input node - text input field
 * Composed with Stylable, Renderable, and Interactive mixins
 */

import { Node } from '../base/Node';
import { Stylable, Renderable, Interactive, type OutputBuffer, type RenderContext, type RenderResult, type KeyboardEvent } from '../base/mixins';
import type { StyleMap, Dimensions } from '../base/types';
import { StyleMixinRegistry } from '../../style/mixins/registry';
import { measureText, padToVisibleColumn } from '../../utils/measure';
import { applyStyles } from '../../renderer/ansi';
import type { CellBuffer } from '../../buffer/CellBuffer';

/**
 * Input node - text input field
 */
export class InputNode extends Stylable(Renderable(Interactive(Node as any))) {
  private value: string = '';
  private placeholder: string = '';
  private maxLength: number | null = null;
  // Store multiline and maxLines for future use (accessed via getters when needed)
  private _multiline: boolean = false;
  private _maxLines: number | null = null;
  private mask: string | null = null;
  // Store inputType for future use (accessed via getters when needed)
  private _inputType: 'text' | 'number' = 'text';
  
  get multiline(): boolean { return this._multiline; }
  get maxLines(): number | null { return this._maxLines; }
  get inputType(): 'text' | 'number' { return this._inputType; }
  
  constructor(id?: string) {
    super(id);
    this.applyStyleMixin('BaseStyle');
  }
  
  getNodeType(): string {
    return 'input';
  }
  
  getDefaultStyle(): StyleMap {
    const baseStyle = StyleMixinRegistry.get('BaseStyle')?.getDefaultStyle() || {};
    return { ...baseStyle };
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
    
    const displayValue = this.getDisplayValue();
    const textWidth = measureText(displayValue || this.placeholder);
    const borderWidth = this.border.width;
    const totalWidth = textWidth + borderWidth.left + borderWidth.right + this.padding.left + this.padding.right + 1; // +1 for cursor
    const totalHeight = 1 + borderWidth.top + borderWidth.bottom + this.padding.top + this.padding.bottom;
    
    const dimensions: Dimensions = {
      width: totalWidth,
      height: totalHeight,
      contentWidth: textWidth + 1,
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
    
    // 2. Render input content
    const contentArea = this.getContentArea();
    const displayValue = this.getDisplayValue();
    const text = displayValue || this.placeholder;
    const textColor: string | null = displayValue ? (style.getColor() || null) : 'gray';
    
    this.renderInputText(buffer, text, textColor, style, contentArea.x, contentArea.y);
    
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
   * Render input to cell buffer (new buffer system)
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
    
    const displayValue = this.getDisplayValue();
    const text = displayValue || this.placeholder;
    const isPlaceholder = !displayValue;
    const isFocused = this.focused;
    const isDisabled = this.disabled;
    
    
    // Determine colors based on state
    let fgColor = isPlaceholder ? '#666666' : '#ffffff';
    let bgColor = '#222222';
    
    if (isDisabled) {
      fgColor = '#444444';
      bgColor = '#111111';
    } else if (isFocused) {
      fgColor = isPlaceholder ? '#888888' : '#ffffff';
      bgColor = '#333333';
    }
    
    // Render focus indicator prefix
    const prefix = isFocused ? '[ ' : '  ';
    const suffix = isFocused ? ' ]' : '  ';
    const prefixColor = isFocused ? '#00ff00' : undefined;
    
    let currentX = x;
    
    // Render prefix
    for (let i = 0; i < prefix.length && currentX < x + maxWidth; i++) {
      buffer.setCell(currentX, y, {
        char: prefix[i],
        foreground: prefixColor,
        background: bgColor,
        layerId,
        nodeId,
        zIndex,
      });
      currentX++;
    }
    
    // Render input text
    for (let i = 0; i < text.length && currentX < x + maxWidth - suffix.length; i++) {
      buffer.setCell(currentX, y, {
        char: text[i],
        foreground: fgColor,
        background: bgColor,
        layerId,
        nodeId,
        zIndex,
      });
      currentX++;
    }
    
    // Render cursor if focused
    if (isFocused && currentX < x + maxWidth - suffix.length) {
      buffer.setCell(currentX, y, {
        char: '█',
        foreground: '#00ff00',
        background: bgColor,
        layerId,
        nodeId,
        zIndex,
      });
      currentX++;
    }
    
    // Fill remaining space with background
    while (currentX < x + maxWidth - suffix.length) {
      buffer.setCell(currentX, y, {
        char: ' ',
        foreground: fgColor,
        background: bgColor,
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
        foreground: prefixColor,
        background: bgColor,
        layerId,
        nodeId,
        zIndex,
      });
      currentX++;
    }
  }
  
  private getDisplayValue(): string {
    if (this.mask && this.value) {
      return this.mask.repeat(this.value.length);
    }
    return this.value;
  }
  
  private renderInputText(
    buffer: OutputBuffer,
    text: string,
    textColor: string | null,
    style: any,
    x: number,
    y: number
  ): void {
    while (buffer.lines.length <= y) {
      buffer.lines.push('');
    }
    
    const currentLine = buffer.lines[y] || '';
    
    // Use different styling for focused vs unfocused
    const isFocused = this.focused;
    const bgColor = isFocused ? '#333333' : style.getBackgroundColor();
    const fgColor = isFocused ? (textColor || '#ffffff') : (textColor || 'gray');
    
    const styledText = applyStyles(text, {
      color: fgColor,
      backgroundColor: bgColor,
    });
    
    // Add blinking cursor block if focused, or just a space if not
    const cursor = isFocused ? applyStyles('█', { color: '#00ff00' }) : ' ';
    const displayText = styledText + cursor;
    
    // Add focus indicator brackets
    const prefix = isFocused ? applyStyles('[', { color: '#00ff00' }) : ' ';
    const suffix = isFocused ? applyStyles(']', { color: '#00ff00' }) : ' ';
    
    buffer.lines[y] = padToVisibleColumn(currentLine, x) + prefix + displayText + suffix;
  }
  
  // Override Interactive mixin methods for input-specific behavior
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (this.disabled) return;
    
    if (event.key.char) {
      this.handleCharacterInput(event.key.char);
    } else if (event.key.backspace) {
      this.handleBackspace();
    } else if (event.key.delete) {
      this.handleDelete();
    }
    
    super.handleKeyboardEvent(event);
  }
  
  private handleCharacterInput(char: string): void {
    if (this.maxLength && this.value.length >= this.maxLength) {
      return;
    }
    
    this.value += char;
    this.onChange?.({ value: this.value, target: this });
    this.onUpdate();
  }
  
  private handleBackspace(): void {
    if (this.value.length > 0) {
      this.value = this.value.slice(0, -1);
      this.onChange?.({ value: this.value, target: this });
      this.onUpdate();
    }
  }
  
  private handleDelete(): void {
    // Delete key behavior (similar to backspace for now)
    this.handleBackspace();
  }
  
  setValue(value: string): void {
    this.value = value;
    this.onUpdate();
  }
  
  getValue(): string {
    return this.value;
  }
  
  setPlaceholder(placeholder: string): void {
    this.placeholder = placeholder;
    this.onUpdate();
  }
  
  setMaxLength(maxLength: number | null): void {
    this.maxLength = maxLength;
  }
  
  setMultiline(multiline: boolean): void {
    this._multiline = multiline;
  }
  
  setMask(mask: string | null): void {
    this.mask = mask;
  }
  
  setInputType(inputType: 'text' | 'number'): void {
    this._inputType = inputType;
  }
}
