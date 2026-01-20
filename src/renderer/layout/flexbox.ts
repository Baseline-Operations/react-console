/**
 * Flexbox layout rendering
 * Supports flexWrap, alignContent, alignSelf, flexGrow, flexShrink, flexBasis
 */

import type { ConsoleNode, ViewStyle } from '../../types';
import type { OutputBuffer } from '../output';
import { resolveWidth, resolveHeight } from '../../utils/responsive';
import { measureText } from '../../utils/measure';
import { renderNodeToBuffer } from './core';

interface ChildSize {
  width: number;
  height: number;
  flexGrow: number;
  flexShrink: number;
  flexBasis: number | undefined;
  alignSelf: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  order: number;
}

/**
 * Render flexbox layout with full flexbox support
 */
export function renderFlexboxLayout(
  node: ConsoleNode,
  buffer: OutputBuffer,
  x: number,
  y: number,
  maxWidth: number,
  maxHeight: number | undefined,
  style: ViewStyle | undefined
): { x: number; y: number } {
  if (!node.children || node.children.length === 0) {
    return { x, y };
  }

  const flexDirection = style?.flexDirection || 'row';
  const flexWrap = style?.flexWrap || 'nowrap';
  const justifyContent = style?.justifyContent || 'flex-start';
  const alignItems = style?.alignItems || 'stretch';
  const alignContent = style?.alignContent || 'stretch';
  const gap = style?.gap;
  const rowGap: number = style?.rowGap ?? (typeof gap === 'object' ? (gap.row ?? 0) : typeof gap === 'number' ? gap : 0);
  const columnGap: number = style?.columnGap ?? (typeof gap === 'object' ? (gap.column ?? 0) : typeof gap === 'number' ? gap : 0);

  const isRow = flexDirection === 'row' || flexDirection === 'row-reverse';
  const isReverse = flexDirection === 'row-reverse' || flexDirection === 'column-reverse';
  const wrapReverse = flexWrap === 'wrap-reverse';
  const shouldWrap = flexWrap === 'wrap' || flexWrap === 'wrap-reverse';

  // Get children and sort by order
  const children = [...node.children];
  const childData: Array<{ child: ConsoleNode; size: ChildSize }> = [];

  // First pass: measure children and collect flex properties
  for (const child of children) {
    const childStyle = child.style as ViewStyle | undefined;
    const childWidth = childStyle?.width || child.width;
    const childHeight = childStyle?.height || child.height;
    
    // Get flex properties
    const flex = childStyle?.flex;
    const flexGrow = childStyle?.flexGrow ?? (typeof flex === 'number' ? flex : 0);
    const flexShrink = childStyle?.flexShrink ?? (typeof flex === 'number' ? 1 : 1);
    const flexBasis = childStyle?.flexBasis;
    const alignSelf = childStyle?.alignSelf || 'auto';
    const order = childStyle?.order || 0;

    let width = 0;
    let height = 0;
    let basisWidth: number | undefined;
    let basisHeight: number | undefined;

    // Resolve flexBasis if specified
    if (flexBasis !== undefined) {
      if (isRow) {
        basisWidth = resolveWidth(flexBasis, maxWidth);
      } else {
        basisHeight = resolveHeight(flexBasis, maxHeight);
      }
    }

    if (isRow) {
      // Row direction - measure width
      if (childWidth !== undefined) {
        const resolved = resolveWidth(childWidth, maxWidth);
        width = resolved || 0;
      } else if (basisWidth !== undefined) {
        width = basisWidth;
      } else {
        // Auto width - measure content
        width = child.content ? measureText(String(child.content)) : 20; // Default width
      }
      height = childHeight !== undefined ? (resolveHeight(childHeight, maxHeight) || 1) : 1;
    } else {
      // Column direction - measure height
      width = childWidth !== undefined ? (resolveWidth(childWidth, maxWidth) || maxWidth) : maxWidth;
      if (childHeight !== undefined) {
        const resolved = resolveHeight(childHeight, maxHeight);
        height = resolved || 1;
      } else if (basisHeight !== undefined) {
        height = basisHeight;
      } else {
        // Auto height - measure content
        height = child.content ? Math.ceil(measureText(String(child.content)) / maxWidth) || 1 : 1;
      }
    }

    childData.push({
      child,
      size: {
        width,
        height,
        flexGrow,
        flexShrink,
        flexBasis: isRow ? basisWidth : basisHeight,
        alignSelf,
        order,
      },
    });
  }

  // Sort by order
  childData.sort((a, b) => a.size.order - b.size.order);

  // Reverse if needed
  if (isReverse) {
    childData.reverse();
  }

  // Group children into lines (for wrapping)
  const lines: Array<Array<typeof childData[0]>> = [];
  let currentLine: Array<typeof childData[0]> = [];
  let currentLineSize = 0;
  const availableMainSize = isRow ? maxWidth : (maxHeight || 1000);

  if (shouldWrap) {
    // Wrap children into multiple lines
    for (const item of childData) {
      const itemMainSize = isRow ? item.size.width : item.size.height;
      const gapSize = currentLine.length > 0 ? (isRow ? columnGap : rowGap) : 0;

      if (currentLine.length > 0 && currentLineSize + gapSize + itemMainSize > availableMainSize) {
        // Start new line
        lines.push(currentLine);
        currentLine = [item];
        currentLineSize = itemMainSize;
      } else {
        currentLine.push(item);
        currentLineSize += gapSize + itemMainSize;
      }
    }
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }
  } else {
    // Single line (nowrap)
    lines.push(childData);
  }

  // Reverse lines if wrap-reverse
  if (wrapReverse) {
    lines.reverse();
  }

  // Calculate flex sizing for each line
  for (const line of lines) {
    const lineMainSize = isRow
      ? line.reduce((sum, item) => sum + item.size.width, 0) + columnGap * (line.length - 1)
      : line.reduce((sum, item) => sum + item.size.height, 0) + rowGap * (line.length - 1);

    const freeSpace = availableMainSize - lineMainSize;
    const totalFlexGrow = line.reduce((sum, item) => sum + item.size.flexGrow, 0);
    const totalFlexShrink = line.reduce((sum, item) => sum + item.size.flexShrink, 0);

    // Apply flexGrow/flexShrink
    if (freeSpace > 0 && totalFlexGrow > 0) {
      // Grow items
      const growUnit = freeSpace / totalFlexGrow;
      for (const item of line) {
        if (item.size.flexGrow > 0) {
          if (isRow) {
            item.size.width += growUnit * item.size.flexGrow;
          } else {
            item.size.height += growUnit * item.size.flexGrow;
          }
        }
      }
    } else if (freeSpace < 0 && totalFlexShrink > 0) {
      // Shrink items
      const shrinkUnit = Math.abs(freeSpace) / totalFlexShrink;
      for (const item of line) {
        if (item.size.flexShrink > 0) {
          if (isRow) {
            item.size.width = Math.max(0, item.size.width - shrinkUnit * item.size.flexShrink);
          } else {
            item.size.height = Math.max(1, item.size.height - shrinkUnit * item.size.flexShrink);
          }
        }
      }
    }
  }

  // Render lines
  let currentY = y;
  let maxEndX = x;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex]!;
    
    // Calculate line cross size (max cross size of items in line)
    const lineCrossSize = isRow
      ? Math.max(...line.map(item => item.size.height), 0)
      : Math.max(...line.map(item => item.size.width), 0);

    // Calculate line main size (total main size of items in line)
    const lineMainSize = isRow
      ? line.reduce((sum, item) => sum + item.size.width, 0) + columnGap * (line.length - 1)
      : line.reduce((sum, item) => sum + item.size.height, 0) + rowGap * (line.length - 1);

    // Calculate justify content (main axis alignment)
    const availableMainSize = isRow ? maxWidth : (maxHeight || 1000);
    const freeSpace = availableMainSize - lineMainSize;
    
    let startPos = 0;
    let spacing = 0;
    
    switch (justifyContent) {
      case 'flex-end':
        startPos = freeSpace;
        break;
      case 'center':
        startPos = Math.floor(freeSpace / 2);
        break;
      case 'space-between':
        if (line.length > 1) {
          spacing = freeSpace / (line.length - 1);
        }
        break;
      case 'space-around':
        spacing = freeSpace / line.length;
        startPos = spacing / 2;
        break;
      case 'space-evenly':
        spacing = freeSpace / (line.length + 1);
        startPos = spacing;
        break;
      case 'flex-start':
      default:
        startPos = 0;
        break;
    }

    // Calculate align content (cross axis alignment of lines)
    const totalCrossSize = lines.reduce((sum, l) => {
      const lCrossSize = isRow
        ? Math.max(...l.map(item => item.size.height), 0)
        : Math.max(...l.map(item => item.size.width), 0);
      return sum + lCrossSize;
    }, 0) + rowGap * (lines.length - 1);

    const availableCrossSize = isRow ? (maxHeight || 1000) : maxWidth;
    const crossFreeSpace = availableCrossSize - totalCrossSize;

    let lineCrossOffset = 0;
    if (lines.length > 1 && crossFreeSpace > 0) {
      switch (alignContent) {
        case 'flex-end':
          lineCrossOffset = crossFreeSpace;
          break;
        case 'center':
          lineCrossOffset = Math.floor(crossFreeSpace / 2);
          break;
        case 'space-between':
          lineCrossOffset = (crossFreeSpace / (lines.length - 1)) * lineIndex;
          break;
        case 'space-around':
          lineCrossOffset = (crossFreeSpace / lines.length) * (lineIndex + 0.5);
          break;
        case 'space-around':
          // space-around is similar to space-evenly for alignContent
          lineCrossOffset = (crossFreeSpace / lines.length) * (lineIndex + 0.5);
          break;
        case 'stretch':
        case 'flex-start':
        default:
          lineCrossOffset = 0;
          break;
      }
    }

    // Render items in line
    let currentMainPos = startPos;

    for (let i = 0; i < line.length; i++) {
      const item = line[i]!;
      const child = item.child;
      const childSize = item.size;

      let childX = x;
      let childY = currentY;
      let childMaxWidth = childSize.width;
      let childMaxHeight = childSize.height;

      // Determine alignment (use alignSelf if set, otherwise use alignItems)
      const alignment = childSize.alignSelf !== 'auto' ? childSize.alignSelf : alignItems;

      if (isRow) {
        // Row layout
        childX = x + currentMainPos;
        childMaxWidth = childSize.width;
        childMaxHeight = childSize.height;

        // Align items (cross-axis alignment)
        switch (alignment) {
          case 'flex-end':
            childY = currentY + lineCrossOffset + (lineCrossSize - childSize.height);
            break;
          case 'center':
            childY = currentY + lineCrossOffset + Math.floor((lineCrossSize - childSize.height) / 2);
            break;
          case 'stretch':
            childY = currentY + lineCrossOffset;
            childMaxHeight = lineCrossSize;
            break;
          case 'flex-start':
          case 'baseline':
          default:
            childY = currentY + lineCrossOffset;
            break;
        }

        currentMainPos += childSize.width + columnGap + spacing;
      } else {
        // Column layout
        childY = currentY + lineCrossOffset + currentMainPos;
        childMaxWidth = childSize.width;
        childMaxHeight = childSize.height;

        // Align items (cross-axis alignment)
        switch (alignment) {
          case 'flex-end':
            childX = x + (maxWidth - childSize.width);
            break;
          case 'center':
            childX = x + Math.floor((maxWidth - childSize.width) / 2);
            break;
          case 'stretch':
            childX = x;
            childMaxWidth = maxWidth;
            break;
          case 'flex-start':
          case 'baseline':
          default:
            childX = x;
            break;
        }

        currentMainPos += childSize.height + rowGap + spacing;
      }

      const result = renderNodeToBuffer(child, buffer, childX, childY, childMaxWidth, childMaxHeight);
      maxEndX = Math.max(maxEndX, result.x);
    }

    // Move to next line
    if (isRow) {
      currentY += lineCrossSize + rowGap;
    } else {
      currentY += lineMainSize + rowGap;
    }
  }

  return { x: maxEndX, y: currentY - rowGap };
}
