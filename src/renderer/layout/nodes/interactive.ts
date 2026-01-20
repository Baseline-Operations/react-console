/**
 * Interactive node renderers
 * Input, Button
 */

import type { ConsoleNode } from '../../../types';
import type { OutputBuffer } from '../../output';
import { applyStyles } from '../../ansi';
import { applyThemeToStyle } from '../../utils/themeResolution';
import { wrapText, measureText } from '../../../utils/measure';
import { addLine } from '../../output';
import { getTerminalDimensions } from '../../../utils/terminal';
import { valueToString } from '../../../utils/input';
import { componentBoundsRegistry, createComponentBounds } from '../../utils/componentBounds';

/**
 * Render input node
 */
export function renderInputNode(
  node: ConsoleNode,
  buffer: OutputBuffer,
  x: number,
  y: number,
  maxWidth: number
): { x: number; y: number } {
  const dims = getTerminalDimensions();
  const value = valueToString(node.value ?? node.defaultValue);
  const placeholder = node.placeholder || '';
  const multiline = node.multiline || false;
  
  // Calculate input width (respect maxWidth and terminal width)
  const inputMaxWidth = node.maxWidth 
    ? Math.min(node.maxWidth, maxWidth - x, dims.columns - x)
    : Math.min(maxWidth - x, dims.columns - x);
  
  // Calculate max lines for multiline input
  const inputMaxLines = node.maxLines 
    ? Math.min(node.maxLines, dims.rows - y)
    : dims.rows - y;

  let currentY = y;

  if (multiline && value) {
    // Multiline input - split by newlines and wrap if needed
    const lines = value.split('\n');
    const visibleLines = node.maxLines ? Math.min(lines.length, inputMaxLines) : lines.length;
    
    for (let i = 0; i < visibleLines; i++) {
      let line = lines[i]!;
      
      // Apply mask if needed
      if (node.mask && node.focused) {
        line = node.mask.repeat(line.length);
      }
      
      // Wrap long lines if needed
      if (measureText(line) > inputMaxWidth) {
        const wrapped = wrapText(line, inputMaxWidth);
        for (const wrappedLine of wrapped) {
          const cursor = node.focused && i === lines.length - 1 && wrappedLine === wrapped[wrapped.length - 1] ? '_' : '';
          let text = wrappedLine + cursor;
          
          if (node.styles) {
            const resolvedStyle = applyThemeToStyle('input', node.styles);
            text = applyStyles(text, resolvedStyle);
          }
          
          // Apply disabled styling
          if (node.disabled) {
            text = applyStyles(text, { dim: true, color: 'gray' });
          }
          
          if (node.focused && !node.disabled) {
            text = applyStyles(text, { underline: true });
          }
          
          addLine(buffer, text.padEnd(inputMaxWidth));
          currentY++;
        }
      } else {
        const cursor = node.focused && !node.disabled && i === lines.length - 1 ? '_' : '';
        let text = line + cursor;
        
        if (node.styles) {
          const resolvedStyle = applyThemeToStyle('input', node.styles);
          text = applyStyles(text, resolvedStyle);
        }
        
        // Apply disabled styling
        if (node.disabled) {
          text = applyStyles(text, { dim: true, color: 'gray' });
        }
        
        if (node.focused && !node.disabled) {
          text = applyStyles(text, { underline: true });
        }
        
        addLine(buffer, text.padEnd(inputMaxWidth));
        currentY++;
      }
    }
    
    // Show placeholder if no value
    if (!value && !node.focused) {
      const wrappedPlaceholder = wrapText(placeholder, inputMaxWidth);
      for (const line of wrappedPlaceholder) {
        let text = line;
        if (node.styles) {
          const resolvedStyle = applyThemeToStyle('input', node.styles);
          text = applyStyles(text, resolvedStyle);
        }
        addLine(buffer, text.padEnd(inputMaxWidth));
        currentY++;
      }
    }
    
    // Display validation error message below multiline input if present
    if (node.validationError && node.focused) {
      const errorText = applyStyles(`⚠ ${node.validationError}`, { color: 'red', dim: true });
      addLine(buffer, errorText.padEnd(inputMaxWidth));
      currentY++;
    }
  } else {
    // Single-line input
    let displayText: string;
    if (value) {
      // Apply mask if needed
      if (node.mask && node.focused) {
        displayText = node.mask.repeat(value.length);
      } else {
        displayText = value;
      }
      
      // Truncate if exceeds maxWidth
      if (measureText(displayText) > inputMaxWidth) {
        displayText = displayText.slice(0, inputMaxWidth - 3) + '...';
      }
    } else {
      // Show placeholder when not focused, empty when focused
      displayText = node.focused ? '' : placeholder;
      if (!node.focused && measureText(displayText) > inputMaxWidth) {
        displayText = displayText.slice(0, inputMaxWidth - 3) + '...';
      }
    }

    const cursor = node.focused && !node.disabled ? '_' : '';
    let text = displayText + cursor;

    // Apply styles
    if (node.styles) {
      const resolvedStyle = applyThemeToStyle('input', node.styles);
      text = applyStyles(text, resolvedStyle);
    }

    // Apply disabled styling (dimmed, grayed out)
    if (node.disabled) {
      text = applyStyles(text, { dim: true, color: 'gray' });
    }

    // Add input prompt style if focused (only if not disabled)
    if (node.focused && !node.disabled) {
      text = applyStyles(text, { underline: true });
    }

    // Add visual indicator for invalid input (red color)
    if (node.invalid && !node.disabled) {
      text = applyStyles(text, { color: 'red' });
    }

    addLine(buffer, text.padEnd(inputMaxWidth));
    currentY++;

    // Display validation error message below input if present
    if (node.validationError && node.focused) {
      const errorText = applyStyles(`⚠ ${node.validationError}`, { color: 'red', dim: true });
      addLine(buffer, errorText.padEnd(inputMaxWidth));
      currentY++;
    }
  }

  // Register component bounds for hit testing
  const width = inputMaxWidth;
  const height = currentY - y;
  componentBoundsRegistry.register(
    createComponentBounds(node, x, y, width, height)
  );

  return { x: x + inputMaxWidth, y: currentY };
}

/**
 * Render button node
 */
export function renderButtonNode(
  node: ConsoleNode,
  buffer: OutputBuffer,
  x: number,
  y: number,
  _maxWidth: number
): { x: number; y: number } {
  let text = node.content || 'Button';

  // Apply styles
  if (node.styles) {
    const resolvedStyle = applyThemeToStyle('button', node.styles);
    text = applyStyles(text, resolvedStyle);
  }

  // Apply disabled styling (dimmed, grayed out)
  if (node.disabled) {
    text = applyStyles(text, { dim: true, color: 'gray' });
  }

  // Add focus indicator (only if not disabled)
  if (node.focused && !node.disabled) {
    text = applyStyles(text, { bold: true, underline: true });
    text = '> ' + text;
  } else {
    text = '  ' + text;
  }

  addLine(buffer, text);

  // Register component bounds for hit testing
  const width = measureText(text);
  const height = 1;
  componentBoundsRegistry.register(
    createComponentBounds(node, x, y, width, height)
  );

  return { x, y: y + 1 };
}
