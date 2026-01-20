/**
 * Selection node renderers
 * Radio, Checkbox, Dropdown, List
 */

import type { ConsoleNode } from '../../../types';
import type { OutputBuffer } from '../../output';
import { applyStyles } from '../../ansi';
import { applyThemeToStyle } from '../../utils/themeResolution';
import { measureText } from '../../../utils/measure';
import { addLine } from '../../output';
import { getTerminalDimensions } from '../../../utils/terminal';
import { valueToString } from '../../../utils/input';
import { formatOptionDisplay } from '../../../components/selection/shared';
import { isArrayValue } from '../../../types/guards';
import { componentBoundsRegistry, createComponentBounds } from '../../utils/componentBounds';

/**
 * Render radio node
 */
export function renderRadioNode(
  node: ConsoleNode,
  buffer: OutputBuffer,
  x: number,
  y: number,
  _maxWidth: number
): { x: number; y: number } {
  const options = node.options || [];
  const selectedValue = node.value ?? node.defaultValue;
  const focusedIndex = node.focusedIndex ?? options.findIndex(opt => opt.value === selectedValue);
  let currentY = y;

  for (let i = 0; i < options.length; i++) {
    const option = options[i]!;
    const selected = option.value === selectedValue;
    const isFocused = node.focused && i === focusedIndex;
    
    // formatDisplay for radio/checkbox expects (option, selected) signature
    // but node.formatDisplay might be (value) => string for Input components
    // So we use displayFormat string or create a wrapper
    const formatFn = node.displayFormat || (typeof node.formatDisplay === 'string' ? node.formatDisplay : undefined);
    const displayText = formatOptionDisplay(option, selected, formatFn, i);

    let text = displayText;
    if (node.styles) {
      const resolvedStyle = applyThemeToStyle('selection', node.styles);
      text = applyStyles(text, resolvedStyle);
    }

    if (isFocused) {
      text = applyStyles(text, { bold: true, underline: true });
      text = '> ' + text;
    } else if (selected) {
      text = applyStyles(text, { bold: true });
    }

    addLine(buffer, text);
    currentY++;
  }

  // Register component bounds for hit testing
  // Calculate max width from all options (reuse existing options variable)
  let maxOptionWidth = 0;
  for (const option of options) {
    const formatFn = node.displayFormat || (typeof node.formatDisplay === 'string' ? node.formatDisplay : undefined);
    const displayText = formatOptionDisplay(option, false, formatFn, 0);
    maxOptionWidth = Math.max(maxOptionWidth, measureText(displayText) + 2); // +2 for '> ' prefix
  }
  const width = maxOptionWidth || 20; // Default width if no options
  const height = currentY - y;
  componentBoundsRegistry.register(
    createComponentBounds(node, x, y, width, height)
  );

  return { x, y: currentY };
}

/**
 * Render checkbox node
 */
export function renderCheckboxNode(
  node: ConsoleNode,
  buffer: OutputBuffer,
  x: number,
  y: number,
  _maxWidth: number
): { x: number; y: number } {
  const options = node.options || [];
  const rawValue = node.value ?? node.defaultValue;
  // Use type guard to safely extract array values
  const selectedValues: (string | number)[] = isArrayValue(rawValue) ? rawValue : [];
  const focusedIndex = node.focusedIndex ?? 0;
  let currentY = y;

  for (let i = 0; i < options.length; i++) {
    const option = options[i]!;
    const selected = selectedValues.some((val: string | number) => val === option.value);
    const isFocused = node.focused && i === focusedIndex;
    
    // formatDisplay for radio/checkbox expects (option, selected) signature
    // but node.formatDisplay might be (value) => string for Input components
    // So we use displayFormat string or create a wrapper
    const formatFn = node.displayFormat || (typeof node.formatDisplay === 'string' ? node.formatDisplay : undefined);
    const displayText = formatOptionDisplay(option, selected, formatFn, i);

    let text = displayText;
    if (node.styles) {
      const resolvedStyle = applyThemeToStyle('selection', node.styles);
      text = applyStyles(text, resolvedStyle);
    }

    if (isFocused) {
      text = applyStyles(text, { bold: true, underline: true });
      text = '> ' + text;
    } else if (selected) {
      text = applyStyles(text, { bold: true });
    }

    addLine(buffer, text);
    currentY++;
  }

  // Register component bounds for hit testing
  // Calculate max width from all options (reuse existing options variable)
  let maxOptionWidth = 0;
  for (const option of options) {
    const formatFn = node.displayFormat || (typeof node.formatDisplay === 'string' ? node.formatDisplay : undefined);
    const displayText = formatOptionDisplay(option, false, formatFn, 0);
    maxOptionWidth = Math.max(maxOptionWidth, measureText(displayText) + 2); // +2 for '> ' prefix
  }
  const width = maxOptionWidth || 20; // Default width if no options
  const height = currentY - y;
  componentBoundsRegistry.register(
    createComponentBounds(node, x, y, width, height)
  );

  return { x, y: currentY };
}

/**
 * Render dropdown node
 */
export function renderDropdownNode(
  node: ConsoleNode,
  buffer: OutputBuffer,
  x: number,
  y: number,
  maxWidth: number
): { x: number; y: number } {
  const options = node.options || [];
  const selectedValue = node.value ?? node.defaultValue;
  const placeholder = node.placeholder || 'Select...';
  const isOpen = node.isOpen ?? false;
  const focusedIndex = node.focusedIndex ?? 0;
  
  let displayText: string;
  
  if (selectedValue !== undefined && selectedValue !== null && selectedValue !== '') {
    if (Array.isArray(selectedValue)) {
      // Multiple selection
      const selectedLabels = selectedValue
        .map((val) => options.find((opt) => opt.value === val)?.label)
        .filter(Boolean)
        .join(', ');
      displayText = selectedLabels || placeholder;
    } else {
      // Single selection
      const selectedOption = options.find(opt => opt.value === selectedValue);
      displayText = selectedOption ? selectedOption.label : valueToString(selectedValue as string | number | boolean);
    }
  } else {
    displayText = placeholder;
  }

  // Add dropdown indicator
  const indicator = isOpen ? '▼' : '▶';
  let text = `${indicator} ${displayText}`;

  if (node.styles) {
    const resolvedStyle = applyThemeToStyle('selection', node.styles);
    text = applyStyles(text, resolvedStyle);
  }

  if (node.focused) {
    text = applyStyles(text, { underline: true, bold: true });
  }

  // Truncate if too long
  if (measureText(text) > maxWidth - x) {
    text = text.slice(0, maxWidth - x - 3) + '...';
  }

  addLine(buffer, text.padEnd(maxWidth - x));
  let currentY = y + 1;

  // Render dropdown options when open
  if (isOpen && node.focused) {
    const dims = getTerminalDimensions();
    const maxVisible = Math.min(options.length, dims.rows - currentY - 1);
    const startIndex = Math.max(0, focusedIndex - maxVisible + 1);
    
    for (let i = startIndex; i < startIndex + maxVisible && i < options.length; i++) {
      const option = options[i]!;
      const selected = Array.isArray(selectedValue)
        ? (selectedValue as (string | number)[]).some(v => v === option.value)
        : option.value === selectedValue;
      const isFocused = i === focusedIndex;
      
      const formatFn = node.displayFormat || (typeof node.formatDisplay === 'string' ? node.formatDisplay : undefined);
      let optionText = formatOptionDisplay(option, selected, formatFn, i);
      
      if (isFocused) {
        optionText = applyStyles(optionText, { bold: true, underline: true });
        optionText = '> ' + optionText;
      } else if (selected) {
        optionText = applyStyles(optionText, { bold: true });
      }
      
      if (node.styles) {
        const resolvedStyle = applyThemeToStyle('selection', node.styles);
        optionText = applyStyles(optionText, resolvedStyle);
      }
      
      addLine(buffer, optionText.padEnd(maxWidth - x));
      currentY++;
    }
  }

  // Register component bounds for hit testing
  // Width is the dropdown button width, height includes open options if visible
  const width = maxWidth - x;
  const height = currentY - y;
  componentBoundsRegistry.register(
    createComponentBounds(node, x, y, width, height)
  );

  return { x, y: currentY };
}

/**
 * Render list node with virtual scrolling
 * Only renders visible items for efficient rendering of large lists
 */
export function renderListNode(
  node: ConsoleNode,
  buffer: OutputBuffer,
  x: number,
  y: number,
  maxWidth: number,
  maxHeight?: number
): { x: number; y: number } {
  const options = node.options || [];
  const selectedValue = node.value ?? node.defaultValue;
  const focusedIndex = node.focusedIndex ?? 0;
  const dims = getTerminalDimensions();
  
  // Calculate available height (reserve 1 line for scroll indicator if needed)
  const availableHeight = maxHeight || dims.rows - y;
  const reservedForIndicator = options.length > availableHeight ? 1 : 0;
  const visibleHeight = availableHeight - reservedForIndicator;
  
  // Virtual scrolling: calculate visible range
  // Ensure focused item is always visible
  let visibleStart = node.scrollTop || 0;
  
  // Adjust visibleStart to keep focused item visible
  if (focusedIndex < visibleStart) {
    visibleStart = focusedIndex;
  } else if (focusedIndex >= visibleStart + visibleHeight) {
    visibleStart = focusedIndex - visibleHeight + 1;
  }
  
  // Ensure visibleStart is within bounds
  visibleStart = Math.max(0, Math.min(visibleStart, Math.max(0, options.length - visibleHeight)));
  const visibleEnd = Math.min(visibleStart + visibleHeight, options.length);
  
  let currentY = y;
  
  // Render visible items only (virtual scrolling)
  for (let i = visibleStart; i < visibleEnd; i++) {
    const option = options[i]!;
    const selected = Array.isArray(selectedValue)
      ? (selectedValue as (string | number)[]).some(v => v === option.value)
      : option.value === selectedValue;
    const isFocused = node.focused && i === focusedIndex;
    
    const formatFn = node.displayFormat || (typeof node.formatDisplay === 'string' ? node.formatDisplay : undefined);
    let optionText = formatOptionDisplay(option, selected, formatFn, i);
    
    if (isFocused) {
      optionText = applyStyles(optionText, { bold: true, underline: true });
      optionText = '> ' + optionText;
    } else if (selected) {
      optionText = applyStyles(optionText, { bold: true });
    }
    
    if (node.styles) {
      const resolvedStyle = applyThemeToStyle('selection', node.styles);
      optionText = applyStyles(optionText, resolvedStyle);
    }
    
    addLine(buffer, optionText);
    currentY++;
  }
  
  // Show scroll indicator if needed
  if (options.length > visibleHeight) {
    let indicator = '';
    if (visibleStart > 0) {
      indicator += '↑';
    }
    if (visibleEnd < options.length) {
      indicator += '↓';
    }
    if (indicator) {
      addLine(buffer, indicator.padStart(maxWidth - x));
      currentY++;
    }
  }
  
  // Register component bounds for hit testing (only for visible items)
  // Calculate max width from visible options
  let maxOptionWidth = 0;
  for (let i = visibleStart; i < visibleEnd; i++) {
    const option = options[i]!;
    const formatFn = node.displayFormat || (typeof node.formatDisplay === 'string' ? node.formatDisplay : undefined);
    const displayText = formatOptionDisplay(option, false, formatFn, i);
    maxOptionWidth = Math.max(maxOptionWidth, measureText(displayText) + 2); // +2 for '> ' prefix
  }
  const width = maxOptionWidth || 20;
  const height = currentY - y;
  componentBoundsRegistry.register(
    createComponentBounds(node, x, y, width, height)
  );
  
  // Update scrollTop in node for persistence
  if (node.scrollTop !== visibleStart) {
    (node as { scrollTop?: number }).scrollTop = visibleStart;
  }
  
  return { x, y: currentY };
}
