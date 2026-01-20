/**
 * Layout node renderers
 * Scrollable, Overlay
 */

import type { ConsoleNode } from '../../../types';
import type { OutputBuffer } from '../../output';
import { addLine } from '../../output';
import { getTerminalDimensions } from '../../../utils/terminal';
import { resolveWidth, resolveHeight } from '../../../utils/responsive';
import { applyStyles } from '../../ansi';
import { renderNodeToBuffer } from '../core';
import { componentBoundsRegistry, createComponentBounds } from '../../utils/componentBounds';

/**
 * Render scrollable node
 */
export function renderScrollableNode(
  node: ConsoleNode,
  buffer: OutputBuffer,
  x: number,
  y: number,
  maxWidth: number,
  maxHeight?: number
): { x: number; y: number } {
  const scrollTop = node.scrollTop || 0;
  let currentY = y;

  if (node.children) {
    // Render visible children based on scroll position
    let visibleStart = 0;
    let visibleCount = node.children.length;

    if (scrollTop > 0) {
      visibleStart = scrollTop;
    }

    if (maxHeight !== undefined) {
      visibleCount = Math.min(node.children.length - visibleStart, maxHeight);
    }

    for (let i = visibleStart; i < visibleStart + visibleCount; i++) {
      const child = node.children[i];
      if (child) {
        const result = renderNodeToBuffer(child, buffer, x, currentY, maxWidth);
        currentY = result.y;
      }
    }

    // Show scroll indicator if needed
    if (scrollTop > 0 || (maxHeight !== undefined && node.children.length > visibleCount + visibleStart)) {
      const indicator = scrollTop > 0 ? '↑' : '';
      const hasMore = maxHeight !== undefined && node.children.length > visibleCount + visibleStart ? '↓' : '';
      if (indicator || hasMore) {
        addLine(buffer, (indicator + hasMore).padStart(maxWidth - x));
        currentY++;
      }
    }
  }

  return { x, y: currentY };
}

/**
 * Render overlay node (like modal, popup)
 */
export function renderOverlayNode(
  node: ConsoleNode,
  buffer: OutputBuffer,
  _x: number,
  _y: number,
  maxWidth: number,
  maxHeight?: number
): { x: number; y: number } {
  const dims = getTerminalDimensions();
  // Resolve responsive width/height for overlay
  const resolvedWidth = node.width !== undefined 
    ? resolveWidth(node.width, Math.min(maxWidth, dims.columns))
    : undefined;
  const resolvedHeight = node.height !== undefined
    ? resolveHeight(node.height, maxHeight || dims.rows)
    : undefined;
  
  // Ensure overlayWidth and overlayHeight are always numbers (never undefined)
  const overlayWidth: number = resolvedWidth ?? maxWidth;
  const overlayHeight: number = resolvedHeight ?? (maxHeight ?? dims.rows);

  // Render backdrop if needed
  if (node.backdrop) {
    const backdropColor = node.backdropColor || 'black';
    const backdropChar = ' ';
    const backdropStyle = applyStyles(backdropChar, {
      backgroundColor: backdropColor,
    });

    for (let i = 0; i < dims.rows; i++) {
      while (buffer.lines.length <= i) {
        buffer.lines.push('');
      }
      const line = buffer.lines[i] || '';
      buffer.lines[i] = line + backdropStyle.repeat(dims.columns - line.length);
    }
  }

  // Calculate overlay position (center by default)
  const overlayX = Math.floor((dims.columns - overlayWidth) / 2);
  const overlayY = Math.floor((dims.rows - overlayHeight) / 2);

  let currentY = overlayY;

  // Render overlay content
  if (node.children) {
    for (const child of node.children) {
      const result = renderNodeToBuffer(child, buffer, overlayX, currentY, overlayWidth);
      currentY = result.y;
    }
  }

  // Register component bounds for hit testing (overlay covers entire screen)
  const bounds = createComponentBounds(node, 0, 0, dims.columns, dims.rows);
  bounds.zIndex = node.zIndex || 1000;
  componentBoundsRegistry.register(bounds);

  return { x: overlayX + overlayWidth, y: overlayY + overlayHeight };
}
