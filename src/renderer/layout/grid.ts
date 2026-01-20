/**
 * Grid layout rendering
 */

import type { ConsoleNode, ViewStyle, ResponsiveSize } from '../../types';
import type { OutputBuffer } from '../output';
import { resolveWidth, resolveHeight } from '../../utils/responsive';
import { renderNodeToBuffer } from './core';

/**
 * Render grid layout
 */
export function renderGridLayout(
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

  const gridTemplateColumns = style?.gridTemplateColumns;
  const gridTemplateRows = style?.gridTemplateRows;
  const gridAutoColumns = style?.gridAutoColumns;
  const gridAutoRows = style?.gridAutoRows;
  const gridAutoFlow = style?.gridAutoFlow || 'row';
  const gap = style?.gap || style?.gridGap;
  const rowGap: number = style?.rowGap ?? style?.gridRowGap ?? (typeof gap === 'object' ? (gap.row ?? 0) : typeof gap === 'number' ? gap : 0);
  const columnGap: number = style?.columnGap ?? style?.gridColumnGap ?? (typeof gap === 'object' ? (gap.column ?? 0) : typeof gap === 'number' ? gap : 0);

  // Parse grid template
  type ColumnSpec = { type: 'fixed'; value: number } | { type: 'fr'; value: number };
  type RowSpec = { type: 'fixed'; value: number } | { type: 'fr'; value: number };
  let columnSpecs: ColumnSpec[] = [];
  let rowSpecs: RowSpec[] = [];
  
  // Named grid lines registry
  const namedColumnLines: Map<string, number> = new Map();
  const namedRowLines: Map<string, number> = new Map();
  
  // Helper to resolve auto column/row size
  const resolveAutoSize = (autoSize: ResponsiveSize | ResponsiveSize[] | undefined, dimension: 'width' | 'height', maxSize: number): number => {
    if (!autoSize) return dimension === 'width' ? Math.floor(maxSize / 3) : 1;
    if (Array.isArray(autoSize)) {
      // Use first value as default, or average if multiple
      const resolved = dimension === 'width' 
        ? resolveWidth(autoSize[0] || 'auto', maxSize)
        : resolveHeight(autoSize[0] || 'auto', maxSize);
      return resolved || (dimension === 'width' ? Math.floor(maxSize / 3) : 1);
    }
    const resolved = dimension === 'width' 
      ? resolveWidth(autoSize, maxSize)
      : resolveHeight(autoSize, maxSize);
    return resolved || (dimension === 'width' ? Math.floor(maxSize / 3) : 1);
  };
  
  if (Array.isArray(gridTemplateColumns)) {
    columnSpecs = gridTemplateColumns.map(col => {
      const resolved = resolveWidth(col, maxWidth);
      return { type: 'fixed' as const, value: resolved || 0 };
    });
  } else if (typeof gridTemplateColumns === 'string') {
    // Parse template string like "1fr 2fr 1fr" or "[header-start] 1fr [header-end]"
    const parts = gridTemplateColumns.trim().split(/\s+/);
    let currentColIndex = 0;
    columnSpecs = [];
    
    for (const part of parts) {
      // Check for named line like [header-start] or [header-end]
      const namedLineMatch = part.match(/\[([^\]]+)\]/);
      if (namedLineMatch) {
        const lineName = namedLineMatch[1]!;
        namedColumnLines.set(lineName, currentColIndex);
        continue;
      }
      
      // Parse size spec
      if (part.endsWith('fr')) {
        columnSpecs.push({ type: 'fr' as const, value: parseFloat(part) || 1 });
      } else {
        const resolved = resolveWidth(part as ResponsiveSize, maxWidth);
        columnSpecs.push({ type: 'fixed' as const, value: resolved || 0 });
      }
      currentColIndex++;
    }
  } else {
    // Auto columns - use gridAutoColumns if specified, otherwise distribute evenly
    const autoColSize = resolveAutoSize(gridAutoColumns, 'width', maxWidth);
    const numColumns = Math.ceil(Math.sqrt(node.children.length));
    columnSpecs = Array(numColumns).fill({ type: 'fixed' as const, value: autoColSize });
  }
  
  if (Array.isArray(gridTemplateRows)) {
    rowSpecs = gridTemplateRows.map(row => {
      const resolved = resolveHeight(row, maxHeight);
      return { type: 'fixed' as const, value: resolved || 1 };
    });
  } else if (typeof gridTemplateRows === 'string') {
    // Parse template string with named lines like "[header-start] auto [header-end]"
    const parts = gridTemplateRows.trim().split(/\s+/);
    let currentRowIndex = 0;
    rowSpecs = [];
    
    for (const part of parts) {
      // Check for named line
      const namedLineMatch = part.match(/\[([^\]]+)\]/);
      if (namedLineMatch) {
        const lineName = namedLineMatch[1]!;
        namedRowLines.set(lineName, currentRowIndex);
        continue;
      }
      
      // Parse size spec
      if (part.endsWith('fr')) {
        rowSpecs.push({ type: 'fr' as const, value: parseFloat(part) || 1 });
      } else {
        const resolved = resolveHeight(part as ResponsiveSize, maxHeight);
        rowSpecs.push({ type: 'fixed' as const, value: resolved || 1 });
      }
      currentRowIndex++;
    }
  } else {
    // Auto rows - use gridAutoRows if specified, otherwise default to 1
    const autoRowSize = resolveAutoSize(gridAutoRows, 'height', maxHeight || 1);
    const numRows = Math.ceil(node.children.length / columnSpecs.length);
    rowSpecs = Array(numRows).fill({ type: 'fixed' as const, value: autoRowSize });
  }

  // Calculate actual column widths (resolve fractional units)
  const totalFixedCols = columnSpecs.reduce((sum, spec) => sum + (spec.type === 'fixed' ? spec.value : 0), 0);
  const totalFrCols = columnSpecs.reduce((sum, spec) => sum + (spec.type === 'fr' ? spec.value : 0), 0);
  const availableColSpace = maxWidth - totalFixedCols - columnGap * (columnSpecs.length - 1);
  
  const columns = columnSpecs.map(spec => {
    if (spec.type === 'fr') {
      return Math.floor((spec.value / totalFrCols) * availableColSpace);
    }
    return spec.value;
  });
  
  const rows = rowSpecs.map(spec => {
    if (spec.type === 'fr') {
      // For rows, we don't have a fixed height, so use the value as line count
      return spec.value;
    }
    return spec.value;
  });

  // Calculate column and row positions
  const colPositions: number[] = [x];
  for (let i = 0; i < columns.length - 1; i++) {
    colPositions.push(colPositions[i]! + columns[i]! + columnGap);
  }

  const rowPositions: number[] = [y];
  for (let i = 0; i < rows.length - 1; i++) {
    rowPositions.push(rowPositions[i]! + rows[i]! + rowGap);
  }

  // Parse gridAutoFlow
  const isRowFlow = gridAutoFlow === 'row' || gridAutoFlow === 'row dense';
  const isDense = gridAutoFlow === 'row dense' || gridAutoFlow === 'column dense';
  
  // Helper to parse grid placement (supports span syntax, named lines, and ranges)
  const parseGridPlacement = (
    value: number | string | undefined, 
    defaultIndex: number,
    namedLines: Map<string, number>,
    _isColumn: boolean
  ): { start: number; end: number } => {
    if (value === undefined) {
      return { start: defaultIndex, end: defaultIndex + 1 };
    }
    if (typeof value === 'number') {
      return { start: value - 1, end: value };
    }
    
    // Check for named line reference
    const namedLineMatch = value.match(/\[([^\]]+)\]/);
    if (namedLineMatch) {
      const lineName = namedLineMatch[1]!;
      const lineIndex = namedLines.get(lineName);
      if (lineIndex !== undefined) {
        return { start: lineIndex, end: lineIndex + 1 };
      }
    }
    
    // Check for named line range like "header-start / header-end"
    const namedRangeMatch = value.match(/\[([^\]]+)\]\s*\/\s*\[([^\]]+)\]/);
    if (namedRangeMatch) {
      const startName = namedRangeMatch[1]!;
      const endName = namedRangeMatch[2]!;
      const startIndex = namedLines.get(startName);
      const endIndex = namedLines.get(endName);
      if (startIndex !== undefined && endIndex !== undefined) {
        return { start: startIndex, end: endIndex };
      }
    }
    
    // Parse string like "1 / 3" or "span 2" or "1" or "header-start / 3"
    const spanMatch = value.match(/span\s+(\d+)/i);
    if (spanMatch) {
      const span = parseInt(spanMatch[1]!, 10);
      return { start: defaultIndex, end: defaultIndex + span };
    }
    const rangeMatch = value.match(/(\d+)\s*\/\s*(\d+)/);
    if (rangeMatch) {
      return { start: parseInt(rangeMatch[1]!, 10) - 1, end: parseInt(rangeMatch[2]!, 10) - 1 };
    }
    const singleMatch = value.match(/(\d+)/);
    if (singleMatch) {
      const index = parseInt(singleMatch[1]!, 10) - 1;
      return { start: index, end: index + 1 };
    }
    return { start: defaultIndex, end: defaultIndex + 1 };
  };
  
  // Track placed items for dense packing
  const placedItems: Array<{ colStart: number; colEnd: number; rowStart: number; rowEnd: number }> = [];
  
  // Render children in grid
  let maxEndY = y;
  
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i]!;
    const childStyle = child.style as ViewStyle | undefined;
    
    // Get grid placement
    let colIndex = isRowFlow ? (i % columns.length) : Math.floor(i / rows.length);
    let rowIndex = isRowFlow ? Math.floor(i / columns.length) : (i % rows.length);
    
    // Check for gridArea first (named area)
    let colPlacement: { start: number; end: number };
    let rowPlacement: { start: number; end: number };
    
    if (childStyle?.gridArea) {
      // gridArea can be a string like "header" or "1 / 3 / 2 / 4" (row-start / col-start / row-end / col-end)
      const areaValue = String(childStyle.gridArea);
      const areaParts = areaValue.split(/\s*\/\s*/);
      if (areaParts.length === 4) {
        // Four-part syntax: row-start / col-start / row-end / col-end
        rowPlacement = parseGridPlacement(areaParts[0], rowIndex, namedRowLines, false);
        colPlacement = parseGridPlacement(areaParts[1], colIndex, namedColumnLines, true);
        const rowEnd = parseGridPlacement(areaParts[2], rowIndex, namedRowLines, false);
        const colEnd = parseGridPlacement(areaParts[3], colIndex, namedColumnLines, true);
        rowPlacement.end = rowEnd.start;
        colPlacement.end = colEnd.start;
      } else {
        // Named area - would need area definitions, for now use default
        colPlacement = { start: colIndex, end: colIndex + 1 };
        rowPlacement = { start: rowIndex, end: rowIndex + 1 };
      }
    } else {
      // Check for explicit grid placement
      colPlacement = parseGridPlacement(childStyle?.gridColumn, colIndex, namedColumnLines, true);
      rowPlacement = parseGridPlacement(childStyle?.gridRow, rowIndex, namedRowLines, false);
    }
    
    // Support gridColumnStart/End and gridRowStart/End
    if (childStyle?.gridColumnStart !== undefined) {
      const start = typeof childStyle.gridColumnStart === 'number' 
        ? childStyle.gridColumnStart - 1 
        : parseInt(String(childStyle.gridColumnStart), 10) - 1;
      colPlacement.start = start;
    }
    if (childStyle?.gridColumnEnd !== undefined) {
      const end = typeof childStyle.gridColumnEnd === 'number' 
        ? childStyle.gridColumnEnd - 1 
        : parseInt(String(childStyle.gridColumnEnd), 10) - 1;
      colPlacement.end = end;
    }
    if (childStyle?.gridRowStart !== undefined) {
      const start = typeof childStyle.gridRowStart === 'number' 
        ? childStyle.gridRowStart - 1 
        : parseInt(String(childStyle.gridRowStart), 10) - 1;
      rowPlacement.start = start;
    }
    if (childStyle?.gridRowEnd !== undefined) {
      const end = typeof childStyle.gridRowEnd === 'number' 
        ? childStyle.gridRowEnd - 1 
        : parseInt(String(childStyle.gridRowEnd), 10) - 1;
      rowPlacement.end = end;
    }
    
    // Calculate span
    const colSpan = colPlacement.end - colPlacement.start;
    const rowSpan = rowPlacement.end - rowPlacement.start;
    
    // For dense packing, find first available position
    if (isDense) {
      let found = false;
      for (let tryRow = 0; tryRow < rows.length && !found; tryRow++) {
        for (let tryCol = 0; tryCol < columns.length && !found; tryCol++) {
          // Check if this position is available
          const overlaps = placedItems.some(placed => {
            return !(
              tryCol + colSpan <= placed.colStart ||
              tryCol >= placed.colEnd ||
              tryRow + rowSpan <= placed.rowStart ||
              tryRow >= placed.rowEnd
            );
          });
          if (!overlaps) {
            colPlacement.start = tryCol;
            colPlacement.end = tryCol + colSpan;
            rowPlacement.start = tryRow;
            rowPlacement.end = tryRow + rowSpan;
            found = true;
          }
        }
      }
    }
    
    // Ensure placement is within bounds
    colPlacement.start = Math.max(0, Math.min(colPlacement.start, columns.length - 1));
    colPlacement.end = Math.max(colPlacement.start + 1, Math.min(colPlacement.end, columns.length));
    rowPlacement.start = Math.max(0, Math.min(rowPlacement.start, rows.length - 1));
    rowPlacement.end = Math.max(rowPlacement.start + 1, Math.min(rowPlacement.end, rows.length));
    
    // Track placed item
    placedItems.push({
      colStart: colPlacement.start,
      colEnd: colPlacement.end,
      rowStart: rowPlacement.start,
      rowEnd: rowPlacement.end,
    });
    
    // Calculate child position and size (accounting for span)
    const childX = colPositions[colPlacement.start]!;
    const childY = rowPositions[rowPlacement.start]!;
    const childWidth = colPlacement.start < colPlacement.end
      ? colPositions[colPlacement.end - 1]! + columns[colPlacement.end - 1]! - childX
      : columns[colPlacement.start]!;
    const childHeight = rowPlacement.start < rowPlacement.end
      ? rowPositions[rowPlacement.end - 1]! + rows[rowPlacement.end - 1]! - childY
      : rows[rowPlacement.start]!;
    
    const result = renderNodeToBuffer(child, buffer, childX, childY, childWidth, childHeight);
    maxEndY = Math.max(maxEndY, result.y);
  }

  // Calculate total height
  const totalHeight = rowPositions[rowPositions.length - 1]! + rows[rows.length - 1]! - y;
  const totalWidth = colPositions[colPositions.length - 1]! + columns[columns.length - 1]! - x;

  return { x: x + totalWidth, y: y + totalHeight };
}
