/**
 * Checkbox node - checkbox selection (multiple selection)
 */

import { SelectionNode, type SelectionOption } from './SelectionNode';
import type { OutputBuffer, RenderContext, RenderResult } from '../base/mixins/Renderable';
import type { CellBuffer } from '../../buffer/CellBuffer';
import type { Dimensions } from '../base/types';
import type { KeyboardEvent } from '../../types/events';
import { debug } from '../../utils/debug';

// Default checkbox indicator characters (Unicode squares)
const DEFAULT_CHECKBOX_CHECKED = '■'; // Filled square (or use ☑)
const DEFAULT_CHECKBOX_UNCHECKED = '□'; // Empty square (or use ☐)

/**
 * Checkbox node - checkbox selection (supports multiple selection)
 */
export class CheckboxNode extends SelectionNode {
  // Declare inherited mixin properties for TypeScript
  declare focused: boolean;
  declare disabled: boolean;

  // Interactive properties
  public autoFocus: boolean = false;
  public tabIndex?: number;
  public onChange?: (event: { value: (string | number)[]; key?: unknown }) => void;
  public onFocus?: (event?: unknown) => void;
  public onBlur?: (event?: unknown) => void;

  // Style properties
  public color?: string;
  public backgroundColor?: string;
  public checkedColor?: string;
  public highlightColor?: string;

  // Display properties
  public displayFormat?: string;
  public formatDisplay?: (option: SelectionOption, selected: boolean) => string;

  // Customizable indicator characters
  public checkedIndicator: string = DEFAULT_CHECKBOX_CHECKED;
  public uncheckedIndicator: string = DEFAULT_CHECKBOX_UNCHECKED;

  // Internal tracking for keyboard navigation
  private highlightedIndex: number = 0;

  constructor(id?: string) {
    super(id);
    this.multiple = true; // Checkboxes support multiple selection
    this.value = []; // Initialize as empty array for multiple selection
  }

  getNodeType(): string {
    return 'checkbox';
  }

  computeLayout(
    constraints: import('../base/mixins/Layoutable').LayoutConstraints
  ): import('../base/mixins/Layoutable').LayoutResult {
    // Use explicit width if set, otherwise use available width (like display: block in HTML)
    const availableWidth = constraints?.availableWidth || constraints?.maxWidth || 80;
    const explicitWidth = this.width;

    // Calculate minimum width based on longest option + checkbox indicator
    const options = this.options || [];
    let minContentWidth = 0;
    for (const option of options) {
      const label = option.label || String(option.value);
      minContentWidth = Math.max(minContentWidth, label.length);
    }

    // Format: "  ■ Label" or "> ■ Label"
    // Focus indicator: "> " or "  " = 2 chars
    // Checkbox indicator: "■ " or "□ " = 2 chars (indicator + space)
    const prefixWidth = 2 + 2;
    const minWidth = prefixWidth + minContentWidth;

    // Use explicit width, or fill available width (block behavior), but at least minWidth
    const totalWidth = explicitWidth ?? Math.max(minWidth, availableWidth);
    const totalHeight = options.length || 1;

    const dimensions: Dimensions = {
      width: totalWidth,
      height: totalHeight,
      contentWidth: minContentWidth,
      contentHeight: totalHeight,
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

  render(_buffer: OutputBuffer, context: RenderContext): RenderResult {
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
   * Check if a value is selected
   */
  private isValueSelected(optionValue: string | number): boolean {
    const selectedValues = this.getSelectedValues();
    return selectedValues.includes(optionValue);
  }

  /**
   * Get selected values as array
   */
  private getSelectedValues(): (string | number)[] {
    if (Array.isArray(this.value)) {
      return this.value as (string | number)[];
    }
    if (this.value !== null && this.value !== undefined) {
      return [this.value as string | number];
    }
    return [];
  }

  /**
   * Render checkbox to cell buffer
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

    const options = this.options || [];
    const isFocused = this.focused;
    const isDisabled = this.disabled;

    debug('[CheckboxNode] renderToCellBuffer', { x, y, isFocused, options: options.length });

    // Colors - no foreground/background by default - use terminal defaults for visibility on both light/dark backgrounds
    // Colors can be customized via style props if needed
    let fgColor: string | undefined = this.color || undefined; // Use terminal default unless styled
    let bgColor: string | undefined = this.backgroundColor || undefined;
    let checkedColor: string | undefined = this.checkedColor || undefined; // Use terminal default for checked
    const disabledColor: string | undefined = 'gray';
    let highlightColor: string | undefined = this.highlightColor || undefined; // Use terminal default for highlight

    if (isDisabled) {
      fgColor = 'gray';
      checkedColor = 'gray';
    }

    // Render each option on its own line
    for (let i = 0; i < options.length && i < maxHeight; i++) {
      const option = options[i]!;
      const isChecked = this.isValueSelected(option.value);
      const isHighlighted = isFocused && i === this.highlightedIndex;
      const optionDisabled = option.disabled || isDisabled;

      let currentX = x;
      const currentY = y + i;

      // Focus/highlight indicator prefix (only show when focused and highlighted)
      const prefix = isHighlighted ? '> ' : '  ';
      const prefixColor = isHighlighted ? highlightColor : null;

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

      // Checkbox indicator: ■ for checked, □ for unchecked (single char + space)
      const indicator = isChecked ? this.checkedIndicator : this.uncheckedIndicator;
      const checkboxColor = isChecked ? checkedColor : optionDisabled ? disabledColor : fgColor;

      // Render indicator character
      buffer.setCell(currentX, currentY, {
        char: indicator,
        foreground: checkboxColor,
        background: bgColor,
        layerId,
        nodeId,
        zIndex,
      });
      currentX++;

      // Space after indicator
      buffer.setCell(currentX, currentY, {
        char: ' ',
        background: bgColor,
        layerId,
        nodeId,
        zIndex,
      });
      currentX++;

      // Option label
      const label = this.formatDisplay
        ? this.formatDisplay(option, isChecked)
        : option.label || String(option.value);
      const labelColor = optionDisabled ? disabledColor : fgColor;

      for (const char of label) {
        if (currentX < x + maxWidth) {
          buffer.setCell(currentX, currentY, {
            char,
            foreground: labelColor,
            background: bgColor,
            layerId,
            nodeId,
            zIndex,
          });
          currentX++;
        }
      }

      // Fill remaining space
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

  /**
   * Handle keyboard events for checkbox navigation and toggling
   */
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (this.disabled) return;

    const key = event.key;
    const options = this.options || [];
    if (options.length === 0) return;

    // Ensure highlightedIndex is valid
    if (this.highlightedIndex < 0 || this.highlightedIndex >= options.length) {
      this.highlightedIndex = 0;
    }

    if (key.upArrow) {
      // Navigate up
      this.highlightedIndex =
        this.highlightedIndex <= 0 ? options.length - 1 : this.highlightedIndex - 1;
      // Skip disabled options
      let attempts = 0;
      while (options[this.highlightedIndex]?.disabled && attempts < options.length) {
        this.highlightedIndex =
          this.highlightedIndex <= 0 ? options.length - 1 : this.highlightedIndex - 1;
        attempts++;
      }
      this.onUpdate();
    } else if (key.downArrow) {
      // Navigate down
      this.highlightedIndex =
        this.highlightedIndex >= options.length - 1 ? 0 : this.highlightedIndex + 1;
      // Skip disabled options
      let attempts = 0;
      while (options[this.highlightedIndex]?.disabled && attempts < options.length) {
        this.highlightedIndex =
          this.highlightedIndex >= options.length - 1 ? 0 : this.highlightedIndex + 1;
        attempts++;
      }
      this.onUpdate();
    } else if (key.return || key.char === ' ') {
      // Toggle the highlighted option
      const option = options[this.highlightedIndex];
      if (option && !option.disabled) {
        const currentValues = this.getSelectedValues();
        const isSelected = currentValues.includes(option.value);

        let newValues: (string | number)[];
        if (isSelected) {
          // Remove from selection
          newValues = currentValues.filter((v) => v !== option.value);
        } else {
          // Add to selection
          newValues = [...currentValues, option.value];
        }

        this.value = newValues;

        if (this.onChange) {
          this.onChange({ value: newValues, key });
        }

        this.onUpdate();
      }
    }
  }

  /**
   * Set the highlighted index
   */
  setHighlightedIndex(index: number): void {
    if (index >= 0 && index < (this.options?.length || 0)) {
      this.highlightedIndex = index;
      this.onUpdate();
    }
  }

  /**
   * Get the current highlighted index
   */
  getHighlightedIndex(): number {
    return this.highlightedIndex;
  }
}
