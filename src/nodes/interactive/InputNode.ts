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
    const styledText = applyStyles(text, {
      color: textColor ?? undefined,
      backgroundColor: style.getBackgroundColor(),
    });
    
    // Add cursor if focused
    const cursor = this.focused ? '_' : '';
    const displayText = styledText + cursor;
    
    buffer.lines[y] = padToVisibleColumn(currentLine, x) + displayText;
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
