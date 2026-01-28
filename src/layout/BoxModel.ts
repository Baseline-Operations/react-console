/**
 * Box Model calculations and utilities
 * Handles content area, border bounds, margin bounds, and responsive size resolution
 */

import type {
  BoundingBox,
  BorderInfo,
  BorderWidth,
  ContentArea,
  Dimensions,
  Margin,
  Padding,
  ResponsiveSize,
} from '../nodes/base/types';

/**
 * Terminal dimensions
 */
export interface TerminalDimensions {
  columns: number;
  rows: number;
}

/**
 * Resolve responsive size to actual number
 * Handles percentage strings, viewport units, and character units
 */
export function resolveSize(
  size: ResponsiveSize | null | undefined,
  dimension: 'width' | 'height',
  reference: number,
  terminalDims?: TerminalDimensions
): number | null {
  if (size === null || size === undefined) {
    return null;
  }
  
  if (typeof size === 'number') {
    return size;
  }
  
  if (typeof size === 'string') {
    // Handle percentage
    if (size.endsWith('%')) {
      const percent = parseFloat(size);
      if (!isNaN(percent)) {
        return Math.round((percent / 100) * reference);
      }
    }
    
    // Handle viewport units
    if (size.endsWith('vw') || size.endsWith('vh')) {
      if (!terminalDims) {
        return null;
      }
      const value = parseFloat(size);
      if (!isNaN(value)) {
        const viewportSize = dimension === 'width' ? terminalDims.columns : terminalDims.rows;
        return Math.round((value / 100) * viewportSize);
      }
    }
    
    // Handle character units
    if (size.endsWith('ch')) {
      const value = parseFloat(size);
      if (!isNaN(value)) {
        return Math.round(value);
      }
    }
    
    // Handle pixel-like units (treat as characters in terminal)
    if (size.endsWith('px')) {
      const value = parseFloat(size);
      if (!isNaN(value)) {
        return Math.round(value);
      }
    }
  }
  
  return null;
}

/**
 * Calculate content area from box model
 * Content area = bounds - border - padding
 */
export function calculateContentArea(
  bounds: BoundingBox,
  borderWidth: BorderWidth,
  padding: Padding
): ContentArea {
  return {
    x: bounds.x + borderWidth.left + padding.left,
    y: bounds.y + borderWidth.top + padding.top,
    width: bounds.width - borderWidth.left - borderWidth.right - padding.left - padding.right,
    height: bounds.height - borderWidth.top - borderWidth.bottom - padding.top - padding.bottom,
  };
}

/**
 * Calculate border bounds (including border)
 * Border bounds = content bounds (border is inside the bounds)
 */
export function calculateBorderBounds(bounds: BoundingBox): BoundingBox {
  return { ...bounds };
}

/**
 * Calculate margin bounds (including margin)
 * Margin bounds = bounds + margin
 */
export function calculateMarginBounds(bounds: BoundingBox, margin: Margin): BoundingBox {
  return {
    x: bounds.x - margin.left,
    y: bounds.y - margin.top,
    width: bounds.width + margin.left + margin.right,
    height: bounds.height + margin.top + margin.bottom,
  };
}

/**
 * Calculate total box dimensions including margin, border, and padding
 */
export function calculateTotalDimensions(
  contentWidth: number,
  contentHeight: number,
  borderWidth: BorderWidth,
  padding: Padding,
  margin: Margin
): Dimensions {
  const totalWidth = contentWidth + 
    borderWidth.left + borderWidth.right + 
    padding.left + padding.right + 
    margin.left + margin.right;
  
  const totalHeight = contentHeight + 
    borderWidth.top + borderWidth.bottom + 
    padding.top + padding.bottom + 
    margin.top + margin.bottom;
  
  return {
    width: totalWidth,
    height: totalHeight,
    contentWidth,
    contentHeight,
  };
}

/**
 * Normalize spacing value (number or object) to Margin or Padding
 */
export function normalizeSpacing<T extends Margin | Padding>(
  spacing: number | Partial<T>,
  defaultValue: T
): T {
  if (typeof spacing === 'number') {
    return {
      top: spacing,
      right: spacing,
      bottom: spacing,
      left: spacing,
    } as T;
  }
  
  return {
    ...defaultValue,
    ...spacing,
  };
}

/**
 * Normalize border width (number or object) to BorderWidth
 */
export function normalizeBorderWidth(
  borderWidth: number | Partial<BorderWidth> | undefined,
  defaultWidth: BorderWidth
): BorderWidth {
  if (borderWidth === undefined) {
    return defaultWidth;
  }
  
  if (typeof borderWidth === 'number') {
    return {
      top: borderWidth,
      right: borderWidth,
      bottom: borderWidth,
      left: borderWidth,
    };
  }
  
  return {
    ...defaultWidth,
    ...borderWidth,
  };
}

/**
 * Check if border is shown on any side
 */
export function hasBorder(border: BorderInfo): boolean {
  return border.show.top || border.show.right || border.show.bottom || border.show.left;
}

/**
 * Get effective border width (0 if border not shown, otherwise use border width)
 */
export function getEffectiveBorderWidth(border: BorderInfo): BorderWidth {
  return {
    top: border.show.top ? border.width.top : 0,
    right: border.show.right ? border.width.right : 0,
    bottom: border.show.bottom ? border.width.bottom : 0,
    left: border.show.left ? border.width.left : 0,
  };
}
