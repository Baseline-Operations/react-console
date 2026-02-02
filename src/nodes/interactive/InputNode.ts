/**
 * Input node - text input field
 * Composed with Stylable, Renderable, and Interactive mixins
 */

import { Node } from '../base/Node';
import {
  Stylable,
  Renderable,
  Interactive,
  type OutputBuffer,
  type RenderContext,
  type RenderResult,
  type KeyboardEvent,
} from '../base/mixins';
import type { StyleMap, Dimensions } from '../base/types';
import { StyleMixinRegistry } from '../../style/mixins/registry';
import { padToVisibleColumn } from '../../utils/measure';
import { applyStyles } from '../../renderer/ansi';
import type { CellBuffer } from '../../buffer/CellBuffer';
import { debug } from '../../utils/debug';

// Default visible width for input fields (not including focus indicators)
const DEFAULT_INPUT_WIDTH = 20;

// Create the mixed-in base class with proper type handling
const InputNodeBase = Stylable(
  Renderable(Interactive(Node as unknown as import('../base/types').Constructor<Node>))
);

// Interface to declare mixed-in properties for TypeScript
interface InputNodeMixins {
  // From Interactive mixin
  focused: boolean;
  disabled: boolean;
  tabIndex: number;
  onClick?: (event: unknown) => void;
  onChange?: (event: { value: unknown; target: unknown }) => void;
  handleKeyboardEvent(event: KeyboardEvent): void;
  // From Renderable mixin
  renderBackground(
    buffer: OutputBuffer,
    style: import('../base/mixins/Stylable').ComputedStyle,
    context: RenderContext
  ): void;
  renderBorder(
    buffer: OutputBuffer,
    style: import('../base/mixins/Stylable').ComputedStyle,
    context: RenderContext
  ): void;
  registerRendering(
    bufferRegion: import('../base/mixins').BufferRegion,
    zIndex: number,
    viewport: import('../base/mixins/Renderable').Viewport | null
  ): void;
  // From Stylable mixin
  inlineStyle: import('../base/types').StyleMap;
  computeStyle(): import('../base/mixins/Stylable').ComputedStyle;
  setStyle(style: import('../base/types').StyleMap): void;
  applyStyleMixin(mixinName: string): void;
}

/**
 * Input node - text input field
 */
export class InputNode extends InputNodeBase implements InputNodeMixins {
  // Declare mixed-in properties for TypeScript (they exist at runtime via mixins)
  // Note: Methods that are overridden in this class should not be declared here
  declare focused: boolean;
  declare disabled: boolean;
  declare tabIndex: number;
  declare onClick?: (event: unknown) => void;
  declare onChange?: (event: { value: unknown; target: unknown }) => void;
  // handleKeyboardEvent is overridden in this class, so no declare needed
  declare renderBackground: (
    buffer: OutputBuffer,
    style: import('../base/mixins/Stylable').ComputedStyle,
    context: RenderContext
  ) => void;
  declare renderBorder: (
    buffer: OutputBuffer,
    style: import('../base/mixins/Stylable').ComputedStyle,
    context: RenderContext
  ) => void;
  declare registerRendering: (
    bufferRegion: import('../base/mixins').BufferRegion,
    zIndex: number,
    viewport: import('../base/mixins/Renderable').Viewport | null
  ) => void;
  declare inlineStyle: import('../base/types').StyleMap;
  declare computeStyle: () => import('../base/mixins/Stylable').ComputedStyle;
  declare setStyle: (style: import('../base/types').StyleMap) => void;
  declare applyStyleMixin: (mixinName: string) => void;

  private value: string = '';
  private placeholder: string = '';
  private maxLength: number | null = null;
  // Store multiline and maxLines for future use (accessed via getters when needed)
  private _multiline: boolean = false;
  private _maxLines: number | null = null;
  private mask: string | null = null;
  // Store inputType for future use (accessed via getters when needed)
  private _inputType: 'text' | 'number' = 'text';

  // Cursor position and scroll state
  private _cursorPos: number = 0; // Position in the text
  private _scrollOffset: number = 0; // Horizontal scroll offset
  private _visibleWidth: number = DEFAULT_INPUT_WIDTH; // Visible text area width

  // For multiline: line and column
  private _cursorLine: number = 0;
  private _cursorCol: number = 0;
  private _scrollTop: number = 0; // Vertical scroll offset for multiline

  get multiline(): boolean {
    return this._multiline;
  }
  get maxLines(): number | null {
    return this._maxLines;
  }
  get inputType(): 'text' | 'number' {
    return this._inputType;
  }
  get cursorPos(): number {
    return this._cursorPos;
  }

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

  computeLayout(
    _constraints: import('../base/mixins/Layoutable').LayoutConstraints
  ): import('../base/mixins/Layoutable').LayoutResult {
    const borderWidth = this.border.width;

    // Check if width is explicitly set via style
    const styleWidth = this.inlineStyle?.width;
    const hasExplicitWidth = styleWidth !== undefined && styleWidth !== null;

    // Use fixed width - input scrolls horizontally, doesn't grow
    // +4 for focus indicators "[ " and " ]"
    const paddingWidth =
      borderWidth.left + borderWidth.right + this.padding.left + this.padding.right;

    let totalWidth: number;
    let totalHeight: number;
    let contentHeight: number;

    if (hasExplicitWidth && typeof styleWidth === 'number') {
      // Use explicit width from style
      totalWidth = styleWidth;
      this._visibleWidth = styleWidth - 4 - paddingWidth; // Subtract focus indicators and padding
    } else {
      // Use default fixed width
      this._visibleWidth = DEFAULT_INPUT_WIDTH;
      totalWidth = this._visibleWidth + 4 + paddingWidth;
    }

    if (this._multiline) {
      // Multiline: use maxLines for height
      const lines = this._maxLines || 3;
      totalHeight =
        lines + borderWidth.top + borderWidth.bottom + this.padding.top + this.padding.bottom;
      contentHeight = lines;
    } else {
      // Single line
      totalHeight =
        1 + borderWidth.top + borderWidth.bottom + this.padding.top + this.padding.bottom;
      contentHeight = 1;
    }

    const dimensions: Dimensions = {
      width: totalWidth,
      height: totalHeight,
      contentWidth: totalWidth - paddingWidth,
      contentHeight,
    };

    // Keep x,y from existing bounds if set (for positioning), but update dimensions
    this.bounds = {
      x: this.bounds?.x ?? 0,
      y: this.bounds?.y ?? 0,
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
    const textColor: string | null = displayValue ? style.getColor() || null : 'gray';

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

    this.registerRendering(bufferRegion, style.getZIndex() || 0, context.viewport ?? null);

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
    const { buffer, x, y, maxWidth, maxHeight, layerId, nodeId, zIndex } = context;

    const displayValue = this.getDisplayValue();
    const isPlaceholder = !displayValue;
    const isFocused = this.focused;
    const isDisabled = this.disabled;
    const isMultiline = this._multiline;

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

    const prefixColor = isFocused ? '#00ff00' : undefined;

    debug('[InputNode] renderToCellBuffer', { x, y, isFocused, isMultiline, maxHeight });

    if (isMultiline) {
      // Multiline rendering with vertical and horizontal scrolling
      const text = displayValue || '';
      const lines = text.split('\n');
      const numVisibleLines = this._maxLines || 3;
      const visibleWidth = this._visibleWidth;

      // Ensure scroll top keeps cursor visible (vertical scrolling)
      if (this._cursorLine < this._scrollTop) {
        this._scrollTop = this._cursorLine;
      } else if (this._cursorLine >= this._scrollTop + numVisibleLines) {
        this._scrollTop = this._cursorLine - numVisibleLines + 1;
      }

      // Calculate horizontal scroll offset to keep cursor visible
      let hScrollOffset = 0;
      if (this._cursorCol >= visibleWidth) {
        hScrollOffset = this._cursorCol - visibleWidth + 1;
      }

      // Render each visible line
      for (
        let visLineIdx = 0;
        visLineIdx < numVisibleLines && visLineIdx < maxHeight;
        visLineIdx++
      ) {
        const actualLineIdx = this._scrollTop + visLineIdx;
        const line = lines[actualLineIdx] || '';
        const currentY = y + visLineIdx;
        let currentX = x;

        // Focus indicator at start of first visible line only
        if (visLineIdx === 0) {
          const prefix = isFocused ? '[ ' : '  ';
          for (const char of prefix) {
            if (currentX < x + maxWidth) {
              buffer.setCell(currentX, currentY, {
                char,
                foreground: prefixColor,
                background: bgColor,
                layerId,
                nodeId,
                zIndex,
              });
              currentX++;
            }
          }
        } else {
          // Indent subsequent lines
          for (let i = 0; i < 2 && currentX < x + maxWidth; i++) {
            buffer.setCell(currentX, currentY, {
              char: ' ',
              background: bgColor,
              layerId,
              nodeId,
              zIndex,
            });
            currentX++;
          }
        }

        // Determine what text to show
        const showPlaceholder = visLineIdx === 0 && !displayValue && actualLineIdx === 0;
        const lineText = showPlaceholder ? this.placeholder : line;
        const lineColor = showPlaceholder ? '#666666' : fgColor;

        // Render line content with cursor highlighting
        const isCursorLine = isFocused && !isPlaceholder && actualLineIdx === this._cursorLine;

        // Calculate line-specific horizontal scroll if cursor is on this line
        const lineHScroll = isCursorLine ? hScrollOffset : 0;

        for (let i = 0; i < visibleWidth && currentX < x + maxWidth - 2; i++) {
          const textIdx = lineHScroll + i;
          const char = lineText[textIdx] || ' ';
          const isCursorHere = isCursorLine && textIdx === this._cursorCol;

          buffer.setCell(currentX, currentY, {
            char,
            foreground: lineColor,
            background: isCursorHere ? '#ffffff' : bgColor,
            inverse: isCursorHere,
            layerId,
            nodeId,
            zIndex,
          });
          currentX++;
        }

        // Fill remaining with background
        while (currentX < x + maxWidth - 2) {
          buffer.setCell(currentX, currentY, {
            char: ' ',
            background: bgColor,
            layerId,
            nodeId,
            zIndex,
          });
          currentX++;
        }

        // Closing indicator on first visible line only
        if (visLineIdx === 0) {
          const suffix = isFocused ? ' ]' : '  ';
          for (const char of suffix) {
            if (currentX < x + maxWidth) {
              buffer.setCell(currentX, currentY, {
                char,
                foreground: prefixColor,
                background: bgColor,
                layerId,
                nodeId,
                zIndex,
              });
              currentX++;
            }
          }
        } else {
          // Fill end of subsequent lines
          while (currentX < x + maxWidth) {
            buffer.setCell(currentX, currentY, {
              char: ' ',
              background: bgColor,
              layerId,
              nodeId,
              zIndex,
            });
            currentX++;
          }
        }
      }
    } else {
      // Single-line rendering with horizontal scrolling
      const text = displayValue || this.placeholder || '';
      const textColor = isPlaceholder ? '#666666' : fgColor;
      const prefix = isFocused ? '[ ' : '  ';
      const suffix = isFocused ? ' ]' : '  ';

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

      // Calculate visible portion of text based on scroll offset
      const visibleWidth = this._visibleWidth;
      const scrollOffset = isPlaceholder ? 0 : this._scrollOffset;
      const visibleText = text.slice(scrollOffset, scrollOffset + visibleWidth);

      // Render visible portion of input text
      for (let i = 0; i < visibleText.length && currentX < x + maxWidth - suffix.length; i++) {
        const charIdx = scrollOffset + i;
        // Show cursor at current position in value, OR at position 0 when placeholder shown
        const isCursorHere =
          isFocused &&
          ((!isPlaceholder && charIdx === this._cursorPos) || (isPlaceholder && i === 0));

        buffer.setCell(currentX, y, {
          char: visibleText[i],
          foreground: textColor,
          background: isCursorHere ? '#ffffff' : bgColor, // Highlight cursor position
          inverse: isCursorHere,
          layerId,
          nodeId,
          zIndex,
        });
        currentX++;
      }

      // If cursor is at end of text (or empty input with no placeholder), show cursor
      const showEndCursor =
        isFocused &&
        !isPlaceholder &&
        this._cursorPos === text.length &&
        this._cursorPos >= scrollOffset &&
        this._cursorPos <= scrollOffset + visibleWidth;
      // Also show cursor for empty input with no text to display
      const showEmptyCursor = isFocused && text.length === 0;

      if (showEndCursor || showEmptyCursor) {
        if (currentX <= x + maxWidth - suffix.length) {
          buffer.setCell(currentX, y, {
            char: ' ',
            foreground: fgColor,
            background: '#ffffff',
            inverse: true,
            layerId,
            nodeId,
            zIndex,
          });
          currentX++;
        }
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
    style: import('../base/mixins/Stylable').ComputedStyle,
    x: number,
    y: number
  ): void {
    while (buffer.lines.length <= y) {
      buffer.lines.push('');
    }

    const currentLine = buffer.lines[y] || '';

    // Use different styling for focused vs unfocused
    const isFocused = this.focused;
    const bgColor = isFocused ? '#333333' : (style.getBackgroundColor() ?? undefined);
    const fgColor = isFocused ? textColor || '#ffffff' : textColor || 'gray';

    const styledText = applyStyles(text, {
      color: fgColor,
      backgroundColor: bgColor,
    });

    // Don't add cursor character - terminal cursor is positioned by performRender()
    const displayText = styledText;

    // Add focus indicator brackets (always same width for consistent layout)
    const prefix = isFocused ? applyStyles('[ ', { color: '#00ff00' }) : '  ';
    const suffix = isFocused ? applyStyles(' ]', { color: '#00ff00' }) : '  ';

    debug('[InputNode] renderInputText (legacy)', {
      x,
      y,
      isFocused,
      prefix: isFocused ? '[ ' : '  ',
    });

    buffer.lines[y] = padToVisibleColumn(currentLine, x) + prefix + displayText + suffix;
  }

  // Override Interactive mixin methods for input-specific behavior
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (this.disabled) return;

    // Extended key interface for runtime properties
    interface ExtendedKey {
      char?: string;
      backspace?: boolean;
      delete?: boolean;
      leftArrow?: boolean;
      left?: boolean;
      rightArrow?: boolean;
      right?: boolean;
      upArrow?: boolean;
      up?: boolean;
      downArrow?: boolean;
      down?: boolean;
      home?: boolean;
      end?: boolean;
      return?: boolean;
      ctrl?: boolean;
    }
    const key = event.key as ExtendedKey;

    if (key.char) {
      this.handleCharacterInput(key.char);
    } else if (key.backspace) {
      this.handleBackspace();
    } else if (key.delete) {
      this.handleDelete();
    } else if (key.leftArrow || key.left) {
      this.moveCursorLeft();
    } else if (key.rightArrow || key.right) {
      this.moveCursorRight();
    } else if ((key.upArrow || key.up) && this._multiline) {
      this.moveCursorUp();
    } else if ((key.downArrow || key.down) && this._multiline) {
      this.moveCursorDown();
    } else if (key.return && this._multiline) {
      this.handleNewline();
    } else if (key.home) {
      this.moveCursorToStart();
    } else if (key.end) {
      this.moveCursorToEnd();
    }

    // Update scroll to keep cursor visible
    this.ensureCursorVisible();

    // Call parent class method via prototype (TypeScript doesn't see it due to mixin pattern)
    const parentProto = Object.getPrototypeOf(Object.getPrototypeOf(this));
    if (parentProto && typeof parentProto.handleKeyboardEvent === 'function') {
      parentProto.handleKeyboardEvent.call(this, event);
    }
  }

  private handleNewline(): void {
    if (!this._multiline) return;

    // maxLines only controls VISIBLE height, not total lines allowed
    // Users can have unlimited lines - the input will scroll
    // Insert newline at cursor position
    const before = this.value.slice(0, this._cursorPos);
    const after = this.value.slice(this._cursorPos);
    this.value = before + '\n' + after;
    this._cursorPos++;
    this.updateCursorLineCol();
    this.ensureCursorVisible();
    this.onChange?.({ value: this.value, target: this });
    this.onUpdate();
  }

  private handleCharacterInput(char: string): void {
    if (this.maxLength && this.value.length >= this.maxLength) {
      return;
    }

    // Insert at cursor position
    const before = this.value.slice(0, this._cursorPos);
    const after = this.value.slice(this._cursorPos);
    this.value = before + char + after;
    this._cursorPos++;
    this.updateCursorLineCol();
    this.onChange?.({ value: this.value, target: this });
    this.onUpdate();
  }

  private handleBackspace(): void {
    if (this._cursorPos > 0) {
      const before = this.value.slice(0, this._cursorPos - 1);
      const after = this.value.slice(this._cursorPos);
      this.value = before + after;
      this._cursorPos--;
      this.updateCursorLineCol();
      this.onChange?.({ value: this.value, target: this });
      this.onUpdate();
    }
  }

  private handleDelete(): void {
    if (this._cursorPos < this.value.length) {
      const before = this.value.slice(0, this._cursorPos);
      const after = this.value.slice(this._cursorPos + 1);
      this.value = before + after;
      this.onChange?.({ value: this.value, target: this });
      this.onUpdate();
    }
  }

  private moveCursorLeft(): void {
    if (this._cursorPos > 0) {
      this._cursorPos--;
      this.updateCursorLineCol();
      this.onUpdate();
    }
  }

  private moveCursorRight(): void {
    if (this._cursorPos < this.value.length) {
      this._cursorPos++;
      this.updateCursorLineCol();
      this.onUpdate();
    }
  }

  private moveCursorUp(): void {
    if (this._cursorLine > 0) {
      const lines = this.value.split('\n');
      const prevLine = lines[this._cursorLine - 1] || '';
      const newCol = Math.min(this._cursorCol, prevLine.length);

      // Calculate new cursor position
      let pos = 0;
      for (let i = 0; i < this._cursorLine - 1; i++) {
        pos += (lines[i]?.length || 0) + 1; // +1 for newline
      }
      pos += newCol;

      this._cursorPos = pos;
      this.updateCursorLineCol();
      this.onUpdate();
    }
  }

  private moveCursorDown(): void {
    const lines = this.value.split('\n');
    if (this._cursorLine < lines.length - 1) {
      const nextLine = lines[this._cursorLine + 1] || '';
      const newCol = Math.min(this._cursorCol, nextLine.length);

      // Calculate new cursor position
      let pos = 0;
      for (let i = 0; i <= this._cursorLine; i++) {
        pos += (lines[i]?.length || 0) + 1; // +1 for newline
      }
      pos += newCol;

      this._cursorPos = pos;
      this.updateCursorLineCol();
      this.onUpdate();
    }
  }

  private moveCursorToStart(): void {
    if (this._multiline) {
      // Move to start of current line
      const lines = this.value.split('\n');
      let pos = 0;
      for (let i = 0; i < this._cursorLine; i++) {
        pos += (lines[i]?.length || 0) + 1;
      }
      this._cursorPos = pos;
    } else {
      this._cursorPos = 0;
    }
    this._scrollOffset = 0;
    this.updateCursorLineCol();
    this.onUpdate();
  }

  private moveCursorToEnd(): void {
    if (this._multiline) {
      // Move to end of current line
      const lines = this.value.split('\n');
      let pos = 0;
      for (let i = 0; i <= this._cursorLine; i++) {
        pos += lines[i]?.length || 0;
        if (i < this._cursorLine) pos++; // Add newline char
      }
      this._cursorPos = pos;
    } else {
      this._cursorPos = this.value.length;
    }
    this.updateCursorLineCol();
    this.onUpdate();
  }

  private updateCursorLineCol(): void {
    if (!this._multiline) {
      this._cursorLine = 0;
      this._cursorCol = this._cursorPos;
      return;
    }

    // Calculate line and column from cursor position
    const textBefore = this.value.slice(0, this._cursorPos);
    const lines = textBefore.split('\n');
    this._cursorLine = lines.length - 1;
    this._cursorCol = lines[lines.length - 1]?.length || 0;
  }

  private ensureCursorVisible(): void {
    if (this._multiline) {
      // Vertical scrolling for multiline
      const maxVisibleLines = this._maxLines || 3;
      if (this._cursorLine < this._scrollTop) {
        this._scrollTop = this._cursorLine;
      } else if (this._cursorLine >= this._scrollTop + maxVisibleLines) {
        this._scrollTop = this._cursorLine - maxVisibleLines + 1;
      }
    } else {
      // Horizontal scrolling for single line
      if (this._cursorPos < this._scrollOffset) {
        this._scrollOffset = this._cursorPos;
      } else if (this._cursorPos > this._scrollOffset + this._visibleWidth) {
        this._scrollOffset = this._cursorPos - this._visibleWidth;
      }
    }
  }

  setValue(value: string): void {
    const oldValue = this.value;
    this.value = value;

    // Only move cursor if value was completely replaced (not incremental edit)
    // This preserves cursor position during normal typing
    if (oldValue === '' && value.length > 0) {
      // Initial value set - cursor to end
      this._cursorPos = value.length;
    } else if (Math.abs(value.length - oldValue.length) > 1) {
      // Value changed by more than 1 char (likely a paste or reset)
      this._cursorPos = value.length;
    }
    // Otherwise keep cursor where it is, but clamp to valid range
    if (this._cursorPos > value.length) {
      this._cursorPos = value.length;
    }

    this.updateCursorLineCol();
    this.ensureCursorVisible();
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
    // Clear bounds to force recalculation with correct height
    this.bounds = null;
  }

  setMaxLines(maxLines: number | null): void {
    this._maxLines = maxLines;
    // Clear bounds to force recalculation with correct height
    this.bounds = null;
  }

  setMask(mask: string | null): void {
    this.mask = mask;
  }

  setInputType(inputType: 'text' | 'number'): void {
    this._inputType = inputType;
  }
}
