/**
 * Primitive node renderers
 * Text, Box, View, Fragment, LineBreak
 */

import type { ConsoleNode, ViewStyle, TextStyle } from '../../../types';
import type { OutputBuffer } from '../../output';
import { applyStyles } from '../../ansi';
import { applyThemeToStyle } from '../../utils/themeResolution';
import { wrapText, measureText } from '../../../utils/measure';
import { addLine } from '../../output';
import { getTerminalDimensions } from '../../../utils/terminal';
import { resolveWidth, resolveHeight, resolveSize } from '../../../utils/responsive';
import { renderNodeToBuffer, getPadding } from '../core';
import { getBorderInfo, renderBorderLine, renderBorderChar } from '../borders';
import { renderFlexboxLayout } from '../flexbox';
import { renderGridLayout } from '../grid';
import { componentBoundsRegistry, createComponentBounds } from '../../utils/componentBounds';

/**
 * Render text node
 * Supports nested Text components for inline styling (React Native pattern)
 */
export function renderTextNode(
  node: ConsoleNode,
  buffer: OutputBuffer,
  x: number,
  y: number,
  maxWidth: number
): { x: number; y: number } {
  let currentX = x;
  let currentY = y;

  // If node has children (nested Text components), render them inline
  if (node.children && node.children.length > 0) {
    // Render children inline with current styles applied
    for (const child of node.children) {
      if (child.type === 'text') {
        // Nested Text - render with merged styles
        const parentStyle = (node.style as TextStyle | undefined) || node.styles;
        const childStyle = (child.style as TextStyle | undefined) || child.styles;
        const mergedStyles = { ...parentStyle, ...childStyle };
        const childWithMergedStyles = { ...child, style: mergedStyles };
        const result = renderNodeToBuffer(childWithMergedStyles, buffer, currentX, currentY, maxWidth);
        currentX = result.x;
        currentY = result.y;
      } else if (typeof child === 'object' && child.content) {
        // String content - render with current styles
        let content = String(child.content);
        const textStyle = (node.style as TextStyle | undefined) || node.styles;
        if (textStyle) {
          const resolvedStyle = applyThemeToStyle('text', textStyle);
          content = applyStyles(content, resolvedStyle);
        }
        const textWidth = measureText(content);
        if (currentX + textWidth <= maxWidth) {
          // Fit on current line
          while (buffer.lines.length <= currentY) {
            buffer.lines.push('');
          }
          const currentLine = buffer.lines[currentY] || '';
          buffer.lines[currentY] = currentLine.padEnd(currentX) + content;
          currentX += textWidth;
        } else {
          // Wrap to next line
          const wrapped = wrapText(content, maxWidth);
          for (const line of wrapped) {
            addLine(buffer, line);
            currentY++;
          }
          currentX = wrapped[wrapped.length - 1]?.length || 0;
        }
      }
    }
    return { x: currentX, y: currentY };
  }

  // Fallback: render as simple text content
  let content = node.content || '';
  // Use style prop if available, otherwise fall back to styles
  const textStyle = (node.style as TextStyle | undefined) || node.styles;
  if (textStyle) {
    const resolvedStyle = applyThemeToStyle('text', textStyle);
    content = applyStyles(content, resolvedStyle);
  }

  // Wrap text if needed
  const lines = wrapText(content, maxWidth - x);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    if (i === 0) {
      // First line - ensure we're at the right position
      while (buffer.lines.length <= y) {
        buffer.lines.push('');
      }
      const currentLine = buffer.lines[y] || '';
      // Pad with spaces if needed
      const padded = currentLine.padEnd(x) + line;
      buffer.lines[y] = padded;
      currentX = x + measureText(line);
    } else {
      // Subsequent lines
      addLine(buffer, line);
      currentY++;
      currentX = measureText(line);
    }
  }

  return { x: currentX, y: currentY };
}

/**
 * Render box node
 */
export function renderBoxNode(
  node: ConsoleNode,
  buffer: OutputBuffer,
  x: number,
  y: number,
  maxWidth: number,
  maxHeight?: number
): { x: number; y: number } {
  const dims = getTerminalDimensions();
  
  // Extract style (CSS-like) or fall back to legacy layout/styles
  const rawStyle = node.style as ViewStyle | undefined;
  // Apply theme resolution to style for border colors and background colors
  const style = rawStyle ? (applyThemeToStyle('box', rawStyle) as ViewStyle | undefined) : undefined;
  const layout = style || node.layout;
  
  // Handle positioning
  const position = style?.position || 'relative';
  let currentX = x;
  let currentY = y;
  
  if (position === 'absolute' || position === 'fixed') {
    // Absolute/fixed positioning
    // Fixed is relative to viewport (terminal), absolute is relative to positioned parent
    const referenceWidth = position === 'fixed' ? dims.columns : maxWidth;
    const referenceHeight = position === 'fixed' ? dims.rows : (maxHeight || dims.rows);
    
    if (style?.left !== undefined) {
      currentX = typeof style.left === 'number' 
        ? style.left 
        : resolveSize(style.left, 'width', referenceWidth) || 0;
    } else if (style?.right !== undefined) {
      const right = typeof style.right === 'number'
        ? style.right
        : resolveSize(style.right, 'width', referenceWidth) || 0;
      currentX = referenceWidth - right;
    }
    
    if (style?.top !== undefined) {
      currentY = typeof style.top === 'number'
        ? style.top
        : resolveSize(style.top, 'height', referenceHeight) || 0;
    } else if (style?.bottom !== undefined) {
      const bottom = typeof style.bottom === 'number'
        ? style.bottom
        : resolveSize(style.bottom, 'height', referenceHeight) || 0;
      currentY = referenceHeight - bottom;
    }
    
    // For fixed positioning, ensure it's relative to viewport origin (0,0)
    if (position === 'fixed') {
      // Fixed positioning is already relative to terminal viewport
      // No adjustment needed as we're using dims.columns/rows directly
    }
  } else if (position === 'sticky') {
    // Sticky positioning - acts like relative until scroll threshold, then becomes fixed
    // In terminal context, "sticky" means it sticks to viewport edges when scrolling
    // For now, treat similar to fixed but respect parent container bounds
    const stickyTop = style?.top;
    const stickyBottom = style?.bottom;
    const stickyLeft = style?.left;
    const stickyRight = style?.right;
    
    // Calculate if element should "stick" (in terminal, this is based on viewport position)
    // For simplicity, sticky elements stick to their specified edge when parent scrolls
    // This is a simplified implementation - full sticky would need scroll context
    if (stickyTop !== undefined) {
      const topValue = typeof stickyTop === 'number' 
        ? stickyTop 
        : resolveSize(stickyTop, 'height', dims.rows) || 0;
      // Sticky to top: use top value as minimum, but allow scrolling past
      currentY = Math.max(y, topValue);
    } else if (stickyBottom !== undefined) {
      const bottomValue = typeof stickyBottom === 'number'
        ? stickyBottom
        : resolveSize(stickyBottom, 'height', dims.rows) || 0;
      // Sticky to bottom: calculate from bottom of viewport
      currentY = Math.min(y, dims.rows - bottomValue);
    }
    
    if (stickyLeft !== undefined) {
      const leftValue = typeof stickyLeft === 'number'
        ? stickyLeft
        : resolveSize(stickyLeft, 'width', dims.columns) || 0;
      currentX = Math.max(x, leftValue);
    } else if (stickyRight !== undefined) {
      const rightValue = typeof stickyRight === 'number'
        ? stickyRight
        : resolveSize(stickyRight, 'width', dims.columns) || 0;
      currentX = Math.min(x, dims.columns - rightValue);
    }
  } else {
    // Relative positioning - adjust from current position
    if (style?.left !== undefined) {
      const left = typeof style.left === 'number'
        ? style.left
        : resolveSize(style.left, 'width', dims.columns) || 0;
      currentX = x + left;
    }
    
    if (style?.top !== undefined) {
      const top = typeof style.top === 'number'
        ? style.top
        : resolveSize(style.top, 'height', dims.rows) || 0;
      currentY = y + top;
    }
  }

  // Resolve responsive width/height from style or layout props
  const layoutWidth = style?.width || layout?.width;
  const layoutHeight = style?.height || layout?.height;
  const resolvedWidth = layoutWidth !== undefined ? resolveWidth(layoutWidth, maxWidth) : undefined;
  const resolvedHeight = layoutHeight !== undefined ? resolveHeight(layoutHeight, maxHeight) : undefined;

  // Apply resolved width/height constraints
  let effectiveMaxWidth = maxWidth;
  if (resolvedWidth !== undefined) {
    effectiveMaxWidth = Math.min(resolvedWidth, maxWidth - x, dims.columns - x);
  }

  let effectiveMaxHeight = maxHeight;
  if (resolvedHeight !== undefined) {
    effectiveMaxHeight = resolvedHeight;
    if (maxHeight !== undefined) {
      effectiveMaxHeight = Math.min(resolvedHeight, maxHeight);
    }
  }

  // Get border info
  const borderInfo = getBorderInfo(node, style);
  const borderWidth = borderInfo.width;
  const borderWidthTotal = borderWidth.left + borderWidth.right;
  const borderHeightTotal = borderWidth.top + borderWidth.bottom;

  // Get padding
  const finalPadding = getPadding(node);

  // Calculate content area (inside border and padding)
  const contentX = currentX + borderWidth.left + finalPadding.left;
  const contentY = currentY + borderWidth.top + finalPadding.top;
  const contentWidth = effectiveMaxWidth - borderWidthTotal - finalPadding.left - finalPadding.right;
  const contentHeight = effectiveMaxHeight !== undefined 
    ? effectiveMaxHeight - borderHeightTotal - finalPadding.top - finalPadding.bottom
    : undefined;

  // Render top border if needed
  const borderX = currentX;
  const borderY = currentY;
  if (borderInfo.show.top) {
    renderBorderLine(buffer, borderX, borderY, effectiveMaxWidth, 'top', style);
  }

  // Render children
  let childEndX = contentX;
  let childEndY = contentY;
  const display = style?.display || 'block';
  
  if (display === 'flex' && node.children && node.children.length > 0) {
    // Flexbox layout
    const flexResult = renderFlexboxLayout(node, buffer, contentX, contentY, contentWidth, contentHeight, style);
    childEndX = flexResult.x;
    childEndY = flexResult.y;
  } else if (display === 'grid' && node.children && node.children.length > 0) {
    // Grid layout
    const gridResult = renderGridLayout(node, buffer, contentX, contentY, contentWidth, contentHeight, style);
    childEndX = gridResult.x;
    childEndY = gridResult.y;
  } else if (display === 'none') {
    // Don't render children
    childEndX = contentX;
    childEndY = contentY;
  } else if (node.children) {
    // Default block layout (vertical stacking)
    for (const child of node.children) {
      const result = renderNodeToBuffer(child, buffer, childEndX, childEndY, contentWidth, contentHeight);
      childEndX = result.x;
      childEndY = result.y;
    }
  }

  // Calculate actual box height (content + padding)
  const boxHeight = Math.max(1, childEndY - contentY + finalPadding.top + finalPadding.bottom);

  // Render side borders
  if (borderInfo.show.left || borderInfo.show.right) {
    for (let i = 0; i < boxHeight; i++) {
      const lineY = borderY + borderWidth.top + i;
      if (borderInfo.show.left) {
        renderBorderChar(buffer, borderX, lineY, 'left', style);
      }
      if (borderInfo.show.right) {
        renderBorderChar(buffer, borderX + borderWidthTotal, lineY, 'right', style);
      }
    }
  }

  // Render bottom border if needed
  if (borderInfo.show.bottom) {
    renderBorderLine(buffer, borderX, borderY + borderWidth.top + boxHeight, borderWidthTotal, 'bottom', style);
  }

  // Apply bottom padding and border
  currentY += finalPadding.bottom + borderWidth.bottom;

  // Render scrollbars if scrollable is enabled
  if (node.scrollable && (node.scrollTop !== undefined || node.scrollLeft !== undefined)) {
    const scrollTop = node.scrollTop || 0;
    const scrollLeft = node.scrollLeft || 0;
    const scrollbarVisibility = node.scrollbarVisibility || 'auto';
    const verticalScrollbar = node.verticalScrollbar || scrollbarVisibility;
    const horizontalScrollbar = node.horizontalScrollbar || scrollbarVisibility;
    const scrollbarChar = node.scrollbarChar || '█';
    const scrollbarTrackChar = node.scrollbarTrackChar || '░';

    // Vertical scrollbar (right side)
    if (verticalScrollbar !== 'hidden' && contentHeight !== undefined && boxHeight > 1) {
      const scrollbarY = borderY + borderWidth.top;
      const scrollbarX = borderX + effectiveMaxWidth - 1;
      const scrollbarHeight = boxHeight;
      
      // Calculate scrollbar thumb position and size
      const totalHeight = Math.max(boxHeight, scrollTop + contentHeight);
      const thumbHeight = Math.max(1, Math.floor((contentHeight / totalHeight) * scrollbarHeight));
      const thumbPosition = Math.floor((scrollTop / (totalHeight - contentHeight)) * (scrollbarHeight - thumbHeight));
      
      for (let i = 0; i < scrollbarHeight; i++) {
        const lineY = scrollbarY + i;
        const currentLine = buffer.lines[lineY] || '';
        const char = i >= thumbPosition && i < thumbPosition + thumbHeight ? scrollbarChar : scrollbarTrackChar;
        // Replace character at scrollbarX position
        const before = currentLine.substring(0, scrollbarX);
        const after = currentLine.substring(scrollbarX + 1);
        buffer.lines[lineY] = before + char + after;
      }
    }

    // Horizontal scrollbar (bottom)
    if (horizontalScrollbar !== 'hidden' && contentWidth > 0) {
      const scrollbarY = borderY + borderWidth.top + boxHeight;
      const scrollbarX = borderX + borderWidth.left;
      const scrollbarWidth = effectiveMaxWidth - borderWidthTotal;
      
      // Calculate scrollbar thumb position and size
      const totalWidth = Math.max(contentWidth, scrollLeft + contentWidth);
      const thumbWidth = Math.max(1, Math.floor((contentWidth / totalWidth) * scrollbarWidth));
      const thumbPosition = Math.floor((scrollLeft / (totalWidth - contentWidth)) * (scrollbarWidth - thumbWidth));
      
      for (let i = 0; i < scrollbarWidth; i++) {
        const lineX = scrollbarX + i;
        if (i >= thumbPosition && i < thumbPosition + thumbWidth) {
          // Thumb
          buffer.lines[scrollbarY] = (buffer.lines[scrollbarY] || '').padEnd(lineX) + scrollbarChar;
        } else {
          // Track
          buffer.lines[scrollbarY] = (buffer.lines[scrollbarY] || '').padEnd(lineX) + scrollbarTrackChar;
        }
      }
    }
  }

  // Register component bounds for hit testing
  const bounds = createComponentBounds(
    node,
    currentX,
    currentY,
    effectiveMaxWidth,
    boxHeight + borderHeightTotal
  );
  bounds.zIndex = style?.zIndex || 0;
  componentBoundsRegistry.register(bounds);

  return { x: currentX + effectiveMaxWidth, y: currentY };
}

/**
 * Render fragment node (no-op container)
 */
export function renderFragmentNode(
  node: ConsoleNode,
  buffer: OutputBuffer,
  x: number,
  y: number,
  maxWidth: number
): { x: number; y: number } {
  let currentX = x;
  let currentY = y;

  if (node.children) {
    for (const child of node.children) {
      const result = renderNodeToBuffer(child, buffer, currentX, currentY, maxWidth);
      currentX = result.x;
      currentY = result.y;
    }
  }

  return { x: currentX, y: currentY };
}

/**
 * Render line break node
 */
export function renderLineBreakNode(
  _node: ConsoleNode,
  _buffer: OutputBuffer,
  _x: number,
  y: number
): { x: number; y: number } {
  // Line break moves to next line, resets X
  return { x: 0, y: y + 1 };
}
