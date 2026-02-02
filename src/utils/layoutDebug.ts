/**
 * Layout debugging utilities
 * Provides tools for inspecting computed layouts and component positions
 */

import type { ConsoleNode } from '../types';
import { componentBoundsRegistry } from '../renderer/utils/componentBounds';

export interface LayoutDebugInfo {
  node: ConsoleNode;
  type: string;
  position: { x: number; y: number; width: number; height: number } | null;
  style: unknown;
  children: LayoutDebugInfo[];
}

/**
 * Get debug information for a node and its children
 */
export function getLayoutDebugInfo(node: ConsoleNode): LayoutDebugInfo {
  // Find bounds by searching all registered bounds
  const allBounds = componentBoundsRegistry.getAll();
  const bounds = allBounds.find((b) => b.component === node);

  return {
    node,
    type: node.type,
    position: bounds
      ? {
          x: bounds.x,
          y: bounds.y,
          width: bounds.width,
          height: bounds.height,
        }
      : null,
    style: node.style,
    children: node.children?.map(getLayoutDebugInfo) || [],
  };
}

/**
 * Format layout debug info as a string
 */
export function formatLayoutDebugInfo(info: LayoutDebugInfo, indent = 0): string {
  const indentStr = '  '.repeat(indent);
  const posStr = info.position
    ? `@(${info.position.x},${info.position.y}) ${info.position.width}x${info.position.height}`
    : '(not rendered)';

  let result = `${indentStr}${info.type} ${posStr}\n`;

  if (info.children.length > 0) {
    for (const child of info.children) {
      result += formatLayoutDebugInfo(child, indent + 1);
    }
  }

  return result;
}

/**
 * Print layout debug info to console
 */
export function printLayoutDebugInfo(rootNode: ConsoleNode): void {
  const info = getLayoutDebugInfo(rootNode);
  console.log(formatLayoutDebugInfo(info));
}

/**
 * Get all component bounds from registry
 */
export function getAllComponentBounds(): Array<{
  node: ConsoleNode;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}> {
  return componentBoundsRegistry.getAll().map((bounds) => ({
    node: bounds.component,
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    zIndex: bounds.zIndex || 0,
  }));
}

/**
 * Visual layout inspector - returns a string representation showing component positions
 */
export function getVisualLayoutInspector(
  width: number,
  height: number,
  highlightNode?: ConsoleNode
): string {
  const bounds = getAllComponentBounds();
  const grid: string[][] = Array(height)
    .fill(null)
    .map(() => Array(width).fill(' '));

  // Fill grid with component indicators
  for (const bound of bounds) {
    const char = highlightNode && bound.node === highlightNode ? '█' : '░';
    for (let y = bound.y; y < bound.y + bound.height && y < height; y++) {
      for (let x = bound.x; x < bound.x + bound.width && x < width; x++) {
        if (x >= 0 && y >= 0 && x < width && y < height) {
          grid[y]![x] = char;
        }
      }
    }
  }

  // Add border
  const lines = grid.map((row) => '│' + row.join('') + '│');
  const topBorder = '┌' + '─'.repeat(width) + '┐';
  const bottomBorder = '└' + '─'.repeat(width) + '┘';

  return [topBorder, ...lines, bottomBorder].join('\n');
}

/**
 * Visual grid overlay - shows grid lines and cells
 */
export function getVisualGridOverlay(node: ConsoleNode, width: number, height: number): string {
  const style = node.style as
    | { gridTemplateColumns?: unknown; gridTemplateRows?: unknown }
    | undefined;
  if (!style || (!style.gridTemplateColumns && !style.gridTemplateRows)) {
    return '';
  }

  const grid: string[][] = Array(height)
    .fill(null)
    .map(() => Array(width).fill(' '));

  // Draw grid lines (simplified - would need actual grid calculation)
  // For now, show a basic grid pattern
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x % 10 === 0 || y % 5 === 0) {
        grid[y]![x] = x % 10 === 0 && y % 5 === 0 ? '┼' : x % 10 === 0 ? '│' : '─';
      }
    }
  }

  const lines = grid.map((row) => row.join(''));
  return lines.join('\n');
}

/**
 * Visual flexbox overlay - shows flex container and items
 */
export function getVisualFlexboxOverlay(node: ConsoleNode, width: number, height: number): string {
  const style = node.style as { display?: string; flexDirection?: string } | undefined;
  if (!style || style.display !== 'flex') {
    return '';
  }

  const grid: string[][] = Array(height)
    .fill(null)
    .map(() => Array(width).fill(' '));
  const flexDirection = style.flexDirection || 'row';
  const isRow = flexDirection === 'row' || flexDirection === 'row-reverse';

  // Draw flex direction indicator
  if (isRow) {
    // Horizontal arrow
    for (let x = 0; x < Math.min(width, 20); x++) {
      grid[0]![x] = x === 0 ? '▶' : '─';
    }
  } else {
    // Vertical arrow
    for (let y = 0; y < Math.min(height, 10); y++) {
      grid[y]![0] = y === 0 ? '▼' : '│';
    }
  }

  const lines = grid.map((row) => row.join(''));
  return lines.join('\n');
}

/**
 * Layout warning types
 */
export type LayoutWarning =
  | { type: 'overflow'; node: ConsoleNode; message: string }
  | { type: 'negative-size'; node: ConsoleNode; message: string }
  | { type: 'invalid-grid'; node: ConsoleNode; message: string }
  | { type: 'invalid-flex'; node: ConsoleNode; message: string }
  | { type: 'missing-size'; node: ConsoleNode; message: string };

/**
 * Check for layout warnings
 */
export function checkLayoutWarnings(node: ConsoleNode): LayoutWarning[] {
  const warnings: LayoutWarning[] = [];
  const bounds = getAllComponentBounds();
  const nodeBounds = bounds.find((b) => b.node === node);

  if (nodeBounds) {
    // Check for negative or zero sizes
    if (nodeBounds.width <= 0) {
      warnings.push({
        type: 'negative-size',
        node,
        message: `Node has invalid width: ${nodeBounds.width}`,
      });
    }
    if (nodeBounds.height <= 0) {
      warnings.push({
        type: 'negative-size',
        node,
        message: `Node has invalid height: ${nodeBounds.height}`,
      });
    }

    // Check for overflow (would need terminal dimensions)
    const { width: termWidth, height: termHeight } =
      require('../utils/terminal').getTerminalDimensions();
    if (nodeBounds.x + nodeBounds.width > termWidth) {
      warnings.push({
        type: 'overflow',
        node,
        message: `Node overflows terminal width: ${nodeBounds.x + nodeBounds.width} > ${termWidth}`,
      });
    }
    if (nodeBounds.y + nodeBounds.height > termHeight) {
      warnings.push({
        type: 'overflow',
        node,
        message: `Node overflows terminal height: ${nodeBounds.y + nodeBounds.height} > ${termHeight}`,
      });
    }
  }

  const style = node.style as
    | {
        display?: string;
        gridTemplateColumns?: unknown;
        gridTemplateRows?: unknown;
        flexDirection?: unknown;
      }
    | undefined;

  // Check grid-specific warnings
  if (style?.display === 'grid') {
    if (!style.gridTemplateColumns && !style.gridTemplateRows) {
      warnings.push({
        type: 'invalid-grid',
        node,
        message: 'Grid container has no template columns or rows defined',
      });
    }
  }

  // Check flexbox-specific warnings
  if (style?.display === 'flex') {
    if (!node.children || node.children.length === 0) {
      warnings.push({
        type: 'invalid-flex',
        node,
        message: 'Flex container has no children',
      });
    }
  }

  // Check for missing size on positioned elements
  if (
    style &&
    'position' in style &&
    style.position !== 'static' &&
    style.position !== 'relative'
  ) {
    const hasSize = 'width' in style || 'height' in style;
    if (!hasSize && !node.content) {
      warnings.push({
        type: 'missing-size',
        node,
        message: `Positioned element (${style.position}) should have explicit width or height`,
      });
    }
  }

  // Recursively check children
  if (node.children) {
    for (const child of node.children) {
      warnings.push(...checkLayoutWarnings(child));
    }
  }

  return warnings;
}

/**
 * Format layout warnings as string
 */
export function formatLayoutWarnings(warnings: LayoutWarning[]): string {
  if (warnings.length === 0) {
    return 'No layout warnings';
  }

  return warnings.map((w) => `[${w.type}] ${w.message}`).join('\n');
}

/**
 * Print layout warnings to console
 */
export function printLayoutWarnings(rootNode: ConsoleNode): void {
  const warnings = checkLayoutWarnings(rootNode);
  if (warnings.length > 0) {
    console.warn('Layout Warnings:\n' + formatLayoutWarnings(warnings));
  }
}
