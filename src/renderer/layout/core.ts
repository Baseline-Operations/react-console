/**
 * Core layout utilities and main entry point
 */

import type { ConsoleNode, ViewStyle } from '../../types';
import type { OutputBuffer } from '../output';
import { reportError, ErrorType } from '../../utils/errors';
import { renderTextNode } from './nodes';
import { renderBoxNode } from './nodes';
import { renderFragmentNode } from './nodes';
import { renderLineBreakNode } from './nodes';
import { renderInputNode } from './nodes';
import { renderButtonNode } from './nodes';
import { renderRadioNode } from './nodes';
import { renderCheckboxNode } from './nodes';
import { renderDropdownNode } from './nodes';
import { renderListNode } from './nodes';
import { renderScrollableNode } from './nodes';
import { renderOverlayNode } from './nodes';
import { componentRegistry } from '../../utils/componentRegistry';
import { getTerminalDimensions } from '../../utils/terminal';

/**
 * Render a console node to output buffer
 * Main entry point for layout rendering
 * Wrapped with error handling for layout calculation errors
 */
export function renderNodeToBuffer(
  node: ConsoleNode,
  buffer: OutputBuffer,
  x: number,
  y: number,
  maxWidth: number,
  maxHeight?: number
): { x: number; y: number } {
  try {
    return renderNodeToBufferInternal(node, buffer, x, y, maxWidth, maxHeight);
  } catch (error) {
    reportError(error, ErrorType.LAYOUT_CALCULATION, {
      nodeType: node.type,
      position: { x, y },
      constraints: { maxWidth, maxHeight },
    });
    // Return safe fallback position
    return { x, y };
  }
}

/**
 * Internal render function without error handling wrapper
 */
function renderNodeToBufferInternal(
  node: ConsoleNode,
  buffer: OutputBuffer,
  x: number,
  y: number,
  maxWidth: number,
  maxHeight?: number
): { x: number; y: number } {
  // Check for custom renderer first
  if ('customType' in node && node.customType) {
    const customRenderer = componentRegistry.getRenderer(node.customType);
    if (customRenderer) {
      // Use custom renderer
      const output = customRenderer(node, {
        width: maxWidth,
        height: maxHeight || 1000,
        x,
        y,
      });
      
      // Write custom renderer output to buffer
      const lines = Array.isArray(output) ? output : output.split('\n');
      const dims = getTerminalDimensions();
      for (let i = 0; i < lines.length && (y + i) < dims.rows; i++) {
        const line = lines[i] || '';
        while (buffer.lines.length <= y + i) {
          buffer.lines.push('');
        }
        buffer.lines[y + i] = line;
      }
      
      return { x, y: y + lines.length };
    }
  }
  
  switch (node.type) {
    case 'text':
      return renderTextNode(node, buffer, x, y, maxWidth);
    case 'box':
      return renderBoxNode(node, buffer, x, y, maxWidth, maxHeight);
    case 'fragment':
      return renderFragmentNode(node, buffer, x, y, maxWidth);
    case 'newline':
    case 'linebreak':
      return renderLineBreakNode(node, buffer, x, y);
    case 'input':
      return renderInputNode(node, buffer, x, y, maxWidth);
    case 'button':
      return renderButtonNode(node, buffer, x, y, maxWidth);
    case 'radio':
      return renderRadioNode(node, buffer, x, y, maxWidth);
    case 'checkbox':
      return renderCheckboxNode(node, buffer, x, y, maxWidth);
    case 'dropdown':
      return renderDropdownNode(node, buffer, x, y, maxWidth);
    case 'list':
      return renderListNode(node, buffer, x, y, maxWidth, maxHeight);
    case 'scrollable':
      return renderScrollableNode(node, buffer, x, y, maxWidth, maxHeight);
    case 'overlay':
      return renderOverlayNode(node, buffer, x, y, maxWidth, maxHeight);
    default:
      return { x, y };
  }
}

/**
 * Get padding from node (checks style prop first, then layout)
 */
export function getPadding(node: ConsoleNode): { top: number; right: number; bottom: number; left: number } {
  const style = node.style as ViewStyle | undefined;
  const padding = style?.padding || node.layout?.padding;
  
  if (!padding) {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }

  if (typeof padding === 'number') {
    return {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding,
    };
  }

  return {
    top: padding.top ?? 0,
    right: padding.right ?? 0,
    bottom: padding.bottom ?? 0,
    left: padding.left ?? 0,
  };
}
