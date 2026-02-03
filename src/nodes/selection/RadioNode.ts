/**
 * Radio node - radio button selection
 */

import { SelectionNode, type SelectionOption } from './SelectionNode';
import type { OutputBuffer, RenderContext, RenderResult } from '../base/mixins/Renderable';
import type { CellBuffer } from '../../buffer/CellBuffer';
import type { Dimensions } from '../base/types';
import type { KeyboardEvent } from '../../types/events';
import { debug } from '../../utils/debug';

// Default radio indicator characters (Unicode circles)
const DEFAULT_RADIO_SELECTED = '●'; // Filled circle
const DEFAULT_RADIO_UNSELECTED = '○'; // Empty circle

/**
 * Radio node - radio button selection
 */
export class RadioNode extends SelectionNode {
  // Declare inherited mixin properties for TypeScript
  declare focused: boolean;
  declare disabled: boolean;

  // Interactive properties
  public autoFocus: boolean = false;
  public tabIndex?: number;
  public onChange?: (event: { value: string | number; key?: unknown }) => void;
  public onFocus?: (event?: unknown) => void;
  public onBlur?: (event?: unknown) => void;

  // Style properties
  public color?: string;
  public backgroundColor?: string;
  public selectedColor?: string;
  public highlightColor?: string;

  // Display properties
  public displayFormat?: string;
  public formatDisplay?: (option: SelectionOption, selected: boolean) => string;

  // Customizable indicator characters
  public selectedIndicator: string = DEFAULT_RADIO_SELECTED;
  public unselectedIndicator: string = DEFAULT_RADIO_UNSELECTED;

  // Internal tracking for keyboard navigation
  private highlightedIndex: number = -1;

  constructor(id?: string) {
    super(id);
  }

  getNodeType(): string {
    return 'radio';
  }

  computeLayout(
    _constraints: import('../base/mixins/Layoutable').LayoutConstraints
  ): import('../base/mixins/Layoutable').LayoutResult {
    const explicitWidth = this.width;

    // Calculate minimum width based on longest option + radio indicator
    const options = this.options || [];
    let minContentWidth = 0;
    for (const option of options) {
      const label = option.label || String(option.value);
      minContentWidth = Math.max(minContentWidth, label.length);
    }

    // Format: "  ● Label" or "> ● Label"
    // Focus indicator: "> " or "  " = 2 chars
    // Radio indicator: "● " or "○ " = 2 chars (indicator + space)
    const prefixWidth = 2 + 2;
    const minWidth = prefixWidth + minContentWidth;

    // Use explicit width if set, otherwise use content-based width (intrinsic sizing)
    // Radio buttons should NOT expand to fill available width - they are inline-like
    const totalWidth = explicitWidth ?? minWidth;
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
   * Render radio to cell buffer (new buffer system)
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
    const { buffer, x, y, layerId, nodeId, zIndex } = context;
    // CRITICAL: Limit maxWidth/maxHeight to reasonable values to prevent infinite loops
    const maxWidth = Math.min(context.maxWidth, 1000);
    const maxHeight = Math.min(context.maxHeight, 100);

    const options = this.options || [];
    const currentValue = this.value;
    const isFocused = this.focused;
    const isDisabled = this.disabled;

    debug('[RadioNode] renderToCellBuffer', {
      x,
      y,
      isFocused,
      options: options.length,
      value: currentValue,
    });

    // Determine colors based on state
    // No foreground/background by default - use terminal defaults for visibility on both light/dark backgrounds
    // Colors can be customized via style props if needed
    let fgColor: string | undefined = this.color || undefined; // Use terminal default unless styled
    let bgColor: string | undefined = this.backgroundColor || undefined;
    let selectedColor: string | undefined = this.selectedColor || undefined; // Use terminal default for selected
    const disabledColor: string | undefined = 'gray';
    let highlightColor: string | undefined = this.highlightColor || undefined; // Use terminal default for highlight

    if (isDisabled) {
      fgColor = 'gray';
      selectedColor = 'gray';
    }

    // Find the selected option index
    const selectedIndex = options.findIndex((opt) => opt.value === currentValue);

    // Update highlighted index based on selection
    if (this.highlightedIndex < 0 && selectedIndex >= 0) {
      this.highlightedIndex = selectedIndex;
    } else if (this.highlightedIndex < 0 && options.length > 0) {
      this.highlightedIndex = 0;
    }

    // Render each option on its own line
    for (let i = 0; i < options.length && i < maxHeight; i++) {
      const option = options[i]!;
      const isSelected = option.value === currentValue;
      const isHighlighted = isFocused && i === this.highlightedIndex;
      const optionDisabled = option.disabled || isDisabled;

      let currentX = x;
      const currentY = y + i;

      // Focus/highlight indicator prefix (only show when focused and highlighted)
      const prefix = isHighlighted ? '> ' : '  ';
      const prefixColor = isHighlighted ? highlightColor : null;

      // Render prefix
      for (let j = 0; j < prefix.length && currentX < x + maxWidth; j++) {
        buffer.setCell(currentX, currentY, {
          char: prefix[j],
          foreground: prefixColor,
          background: bgColor,
          layerId,
          nodeId,
          zIndex,
        });
        currentX++;
      }

      // Radio indicator: ● for selected, ○ for unselected (single char + space)
      const indicator = isSelected ? this.selectedIndicator : this.unselectedIndicator;
      const radioColor = isSelected ? selectedColor : optionDisabled ? disabledColor : fgColor;

      // Render indicator character
      buffer.setCell(currentX, currentY, {
        char: indicator,
        foreground: radioColor,
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
        ? this.formatDisplay(option, isSelected)
        : option.label || String(option.value);
      const labelColor = optionDisabled ? disabledColor : fgColor;

      for (let j = 0; j < label.length && currentX < x + maxWidth; j++) {
        buffer.setCell(currentX, currentY, {
          char: label[j],
          foreground: labelColor,
          background: bgColor,
          layerId,
          nodeId,
          zIndex,
        });
        currentX++;
      }

      // Fill remaining space with background
      while (currentX < x + maxWidth) {
        buffer.setCell(currentX, currentY, {
          char: ' ',
          foreground: fgColor,
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
   * Handle keyboard events for radio navigation and selection
   */
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (this.disabled) return;

    const key = event.key;
    const options = this.options || [];
    if (options.length === 0) return;

    // Ensure highlightedIndex is valid
    if (this.highlightedIndex < 0 || this.highlightedIndex >= options.length) {
      const selectedIndex = options.findIndex((opt) => opt.value === this.value);
      this.highlightedIndex = selectedIndex >= 0 ? selectedIndex : 0;
    }

    let newIndex = this.highlightedIndex;
    let valueChanged = false;

    if (key.upArrow) {
      // Navigate up
      newIndex = this.highlightedIndex <= 0 ? options.length - 1 : this.highlightedIndex - 1;
      // Skip disabled options
      let attempts = 0;
      while (options[newIndex]?.disabled && attempts < options.length) {
        newIndex = newIndex <= 0 ? options.length - 1 : newIndex - 1;
        attempts++;
      }
      this.highlightedIndex = newIndex;
      valueChanged = true;
    } else if (key.downArrow) {
      // Navigate down
      newIndex = this.highlightedIndex >= options.length - 1 ? 0 : this.highlightedIndex + 1;
      // Skip disabled options
      let attempts = 0;
      while (options[newIndex]?.disabled && attempts < options.length) {
        newIndex = newIndex >= options.length - 1 ? 0 : newIndex + 1;
        attempts++;
      }
      this.highlightedIndex = newIndex;
      valueChanged = true;
    } else if (key.return || key.char === ' ') {
      // Select the highlighted option
      const selectedOption = options[this.highlightedIndex];
      if (selectedOption && !selectedOption.disabled) {
        this.value = selectedOption.value;
        valueChanged = true;

        // Trigger onChange callback
        if (this.onChange) {
          this.onChange({
            value: selectedOption.value,
            key,
          });
        }
      }
    }

    // On navigation, also select the option (radio button behavior)
    if ((key.upArrow || key.downArrow) && options[newIndex] && !options[newIndex]!.disabled) {
      this.value = options[newIndex]!.value;

      // Trigger onChange callback
      if (this.onChange) {
        this.onChange({
          value: options[newIndex]!.value,
          key,
        });
      }
    }

    if (valueChanged) {
      this.onUpdate();
    }
  }

  /**
   * Set the highlighted index (for external control)
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
