/**
 * Dropdown node - dropdown selection
 */

import { SelectionNode, type SelectionOption } from './SelectionNode';
import type { OutputBuffer, RenderContext, RenderResult } from '../base/mixins/Renderable';
import type { CellBuffer } from '../../buffer/CellBuffer';
import type { Dimensions } from '../base/types';
import type { KeyboardEvent } from '../../types/events';
import { debug } from '../../utils/debug';
import { getTerminalDimensions } from '../../utils/terminal';

// Default dropdown height (can be overridden via style)
const DEFAULT_DROPDOWN_HEIGHT = 6;

// Position preference for dropdown options
export type DropdownPosition = 'below' | 'above' | 'auto';

/**
 * Dropdown node - dropdown selection
 */
export class DropdownNode extends SelectionNode {
  // Declare inherited mixin properties for TypeScript
  declare focused: boolean;
  declare disabled: boolean;

  // State
  public isOpen: boolean = false;
  public focusedIndex: number = 0;
  public scrollOffset: number = 0; // For scrolling through many options
  public placeholder: string = 'Select...';

  // Interactive properties
  public autoFocus: boolean = false;
  public tabIndex?: number;
  public onChange?: (event: {
    value: string | number | (string | number)[];
    key?: unknown;
  }) => void;
  public onFocus?: (event?: unknown) => void;
  public onBlur?: (event?: unknown) => void;

  // Display properties
  public displayFormat?: string;
  public formatDisplay?: (option: SelectionOption, selected: boolean) => string;

  // Dropdown-specific styling
  public dropdownHeight?: number; // Max visible options (default: 6)
  public dropdownPosition: DropdownPosition = 'auto'; // Where to show options

  constructor(id?: string) {
    super(id);
  }

  getNodeType(): string {
    return 'dropdown';
  }

  computeLayout(
    _constraints: import('../base/mixins/Layoutable').LayoutConstraints
  ): import('../base/mixins/Layoutable').LayoutResult {
    // Dropdown button is always 1 line tall
    // Options are rendered as overlay (not part of layout flow)
    const options = this.options || [];
    let maxWidth = this.placeholder.length;
    for (const option of options) {
      const label = option.label || String(option.value);
      maxWidth = Math.max(maxWidth, label.length);
    }

    // Format: "> ▼ Label" = 4 chars prefix + label
    const prefixWidth = 4;
    const totalWidth = prefixWidth + maxWidth + 2;

    // Always height 1 - options are rendered as overlay
    const totalHeight = 1;

    const dimensions: Dimensions = {
      width: totalWidth,
      height: totalHeight,
      contentWidth: maxWidth,
      contentHeight: totalHeight,
    };

    this.bounds = {
      x: this.bounds?.x ?? 0,
      y: this.bounds?.y ?? 0,
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
   * Render dropdown to cell buffer
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
    // CRITICAL: Limit maxWidth to reasonable values to prevent infinite loops
    const maxWidth = Math.min(context.maxWidth, 1000);

    const options = this.options || [];
    const isFocused = this.focused;
    const isDisabled = this.disabled;
    const isOpen = this.isOpen;

    debug('[DropdownNode] renderToCellBuffer', {
      x,
      y,
      isFocused,
      isOpen,
      options: options.length,
    });

    // Colors - no background for dropdown button (like other selection components)
    const fgColor = isDisabled ? '#444444' : '#ffffff';
    const bgColor: string | null = null; // Transparent
    const arrowColor = isDisabled ? '#333333' : isFocused ? '#00ff00' : '#888888';
    const highlightColor = '#00ff00';

    // Get selected label
    const selectedOption = options.find((opt) => opt.value === this.value);
    const displayLabel =
      selectedOption?.label || String(selectedOption?.value || '') || this.placeholder;
    const isPlaceholder = !selectedOption;

    // Render main dropdown button (single line)
    let currentX = x;
    const currentY = y;

    // Focus indicator
    const prefix = isFocused ? '> ' : '  ';
    for (const char of prefix) {
      if (currentX < x + maxWidth) {
        buffer.setCell(currentX, currentY, {
          char,
          foreground: isFocused ? highlightColor : null,
          background: bgColor,
          layerId,
          nodeId,
          zIndex,
        });
        currentX++;
      }
    }

    // Arrow indicator
    const arrow = isOpen ? '▲ ' : '▼ ';
    for (const char of arrow) {
      if (currentX < x + maxWidth) {
        buffer.setCell(currentX, currentY, {
          char,
          foreground: arrowColor,
          background: bgColor,
          layerId,
          nodeId,
          zIndex,
        });
        currentX++;
      }
    }

    // Selected value/placeholder
    const labelColor = isPlaceholder ? '#666666' : fgColor;
    for (const char of displayLabel) {
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

    // Render dropdown options if open (as overlay with higher z-index)
    if (isOpen && options.length > 0) {
      const dims = getTerminalDimensions();

      // Calculate available space above and below
      const spaceBelow = dims.rows - y - 2; // -2 for button line and margin
      const spaceAbove = y - 1; // -1 for margin at top

      // Determine dropdown height (from style or default)
      const configuredHeight = this.dropdownHeight ?? DEFAULT_DROPDOWN_HEIGHT;

      // Determine position based on preference and available space
      let showAbove = false;
      if (this.dropdownPosition === 'above') {
        showAbove = true;
      } else if (this.dropdownPosition === 'below') {
        showAbove = false;
      } else {
        // 'auto' - use whichever side has more space
        showAbove = spaceAbove > spaceBelow;
      }

      // Calculate actual available height based on position
      const availableHeight = showAbove ? spaceAbove : spaceBelow;

      // Max visible is the minimum of: options count, configured height, available space
      const maxVisible = Math.min(options.length, configuredHeight, Math.max(1, availableHeight));

      // Calculate starting Y position for options
      const dropdownY = showAbove ? y - maxVisible : y + 1;

      // Ensure scroll offset is valid and keeps focused item visible
      if (this.scrollOffset > options.length - maxVisible) {
        this.scrollOffset = Math.max(0, options.length - maxVisible);
      }
      if (this.focusedIndex < this.scrollOffset) {
        this.scrollOffset = this.focusedIndex;
      } else if (this.focusedIndex >= this.scrollOffset + maxVisible) {
        this.scrollOffset = this.focusedIndex - maxVisible + 1;
      }

      // Higher z-index for overlay
      const overlayZIndex = zIndex + 100;
      const overlayBg = '#1a1a1a';
      const highlightBg = '#333333';

      // Calculate dropdown width
      let dropdownWidth = 0;
      for (const option of options) {
        const label = option.label || String(option.value);
        dropdownWidth = Math.max(dropdownWidth, label.length);
      }
      dropdownWidth = Math.max(dropdownWidth + 6, maxWidth); // +6 for prefix

      for (let i = 0; i < maxVisible; i++) {
        const optionIndex = this.scrollOffset + i;
        const option = options[optionIndex];
        if (!option) continue;

        const isSelected = this.isValueSelected(option.value);
        const isHighlighted = optionIndex === this.focusedIndex;
        const optionY = dropdownY + i;

        // Skip if out of screen bounds
        if (optionY < 0 || optionY >= dims.rows) continue;

        currentX = x;

        // Option background
        const optBg = isHighlighted ? highlightBg : overlayBg;

        // Highlight indicator
        const itemPrefix = isHighlighted ? '> ' : '  ';
        for (const char of itemPrefix) {
          buffer.setCell(currentX, optionY, {
            char,
            foreground: isHighlighted ? highlightColor : null,
            background: optBg,
            layerId,
            nodeId,
            zIndex: overlayZIndex,
          });
          currentX++;
        }

        // Selection checkmark
        const checkmark = isSelected ? '● ' : '  ';
        for (const char of checkmark) {
          buffer.setCell(currentX, optionY, {
            char,
            foreground: isSelected ? highlightColor : null,
            background: optBg,
            layerId,
            nodeId,
            zIndex: overlayZIndex,
          });
          currentX++;
        }

        // Option label
        const optionLabel = option.label || String(option.value);
        const optionColor = option.disabled ? '#666666' : fgColor;
        for (const char of optionLabel) {
          if (currentX < x + dropdownWidth) {
            buffer.setCell(currentX, optionY, {
              char,
              foreground: optionColor,
              background: optBg,
              layerId,
              nodeId,
              zIndex: overlayZIndex,
            });
            currentX++;
          }
        }

        // Fill remaining space
        while (currentX < x + dropdownWidth) {
          buffer.setCell(currentX, optionY, {
            char: ' ',
            background: optBg,
            layerId,
            nodeId,
            zIndex: overlayZIndex,
          });
          currentX++;
        }
      }

      // Show scroll indicators if needed
      const topOptionY = dropdownY;
      const bottomOptionY = dropdownY + maxVisible - 1;

      if (this.scrollOffset > 0 && topOptionY >= 0) {
        // Show up arrow at top
        buffer.setCell(x + dropdownWidth - 1, topOptionY, {
          char: '↑',
          foreground: '#888888',
          background: overlayBg,
          layerId,
          nodeId,
          zIndex: overlayZIndex,
        });
      }
      if (this.scrollOffset + maxVisible < options.length && bottomOptionY < dims.rows) {
        // Show down arrow at bottom
        buffer.setCell(x + dropdownWidth - 1, bottomOptionY, {
          char: '↓',
          foreground: '#888888',
          background: overlayBg,
          layerId,
          nodeId,
          zIndex: overlayZIndex,
        });
      }
    }
  }

  /**
   * Check if a value is selected (for multiselect)
   */
  private isValueSelected(optionValue: string | number): boolean {
    if (this.multiple && Array.isArray(this.value)) {
      return (this.value as (string | number)[]).includes(optionValue);
    }
    return this.value === optionValue;
  }

  /**
   * Handle keyboard events
   */
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (this.disabled) return;

    const key = event.key;
    const options = this.options || [];
    if (options.length === 0) return;

    if (key.return || key.char === ' ') {
      if (this.isOpen) {
        // Select/toggle the focused option
        const option = options[this.focusedIndex];
        if (option && !option.disabled) {
          if (this.multiple) {
            // Multiselect: toggle the option
            const currentValues: (string | number)[] = Array.isArray(this.value) ? this.value : [];
            const isSelected = currentValues.includes(option.value);
            const newValues = isSelected
              ? currentValues.filter((v) => v !== option.value)
              : [...currentValues, option.value];
            this.value = newValues;
            // Don't close dropdown in multiselect mode on selection
            if (this.onChange) {
              this.onChange({ value: newValues, key });
            }
          } else {
            // Single select: select and close
            this.value = option.value;
            this.isOpen = false;
            this.scrollOffset = 0;
            // Call onChange AFTER setting isOpen to false
            // to ensure the closed state is captured
            const selectedValue = option.value;
            if (this.onChange) {
              this.onChange({ value: selectedValue, key });
            }
          }
        }
      } else {
        // Open dropdown
        this.isOpen = true;
        // Set focused index to current selection
        if (this.multiple && Array.isArray(this.value) && this.value.length > 0) {
          const valueArr = this.value as (string | number)[];
          const firstSelected = options.findIndex((opt) => valueArr.includes(opt.value));
          this.focusedIndex = firstSelected >= 0 ? firstSelected : 0;
        } else if (!this.multiple) {
          const selectedIndex = options.findIndex((opt) => opt.value === this.value);
          this.focusedIndex = selectedIndex >= 0 ? selectedIndex : 0;
        } else {
          this.focusedIndex = 0;
        }
        // Adjust scroll to show focused item
        const maxVisible = this.dropdownHeight ?? DEFAULT_DROPDOWN_HEIGHT;
        this.scrollOffset = Math.max(0, this.focusedIndex - Math.floor(maxVisible / 2));
      }
      this.onUpdate();
    } else if (this.isOpen) {
      if (key.upArrow) {
        this.focusedIndex = this.focusedIndex <= 0 ? options.length - 1 : this.focusedIndex - 1;
        // Skip disabled options
        let attempts = 0;
        while (options[this.focusedIndex]?.disabled && attempts < options.length) {
          this.focusedIndex = this.focusedIndex <= 0 ? options.length - 1 : this.focusedIndex - 1;
          attempts++;
        }
        this.onUpdate();
      } else if (key.downArrow) {
        this.focusedIndex = this.focusedIndex >= options.length - 1 ? 0 : this.focusedIndex + 1;
        // Skip disabled options
        let attempts = 0;
        while (options[this.focusedIndex]?.disabled && attempts < options.length) {
          this.focusedIndex = this.focusedIndex >= options.length - 1 ? 0 : this.focusedIndex + 1;
          attempts++;
        }
        this.onUpdate();
      } else if (key.escape) {
        this.isOpen = false;
        this.scrollOffset = 0;
        this.onUpdate();
      }
    }
  }

  setOpen(open: boolean): void {
    this.isOpen = open;
    this.onUpdate();
  }
}
