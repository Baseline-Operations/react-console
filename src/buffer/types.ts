/**
 * Multi-Buffer System Type Definitions
 *
 * This module defines all types for the cell-based multi-buffer rendering system.
 */

/**
 * Cell - The fundamental unit of the buffer system
 * Each cell represents a single character position in the terminal with full metadata
 */
export interface Cell {
  // Content
  char: string; // Single character (or empty string '' for transparent)

  // Colors
  foreground: string | null; // ANSI color name, hex (#RRGGBB), or rgb(r,g,b)
  background: string | null; // ANSI color name, hex (#RRGGBB), or rgb(r,g,b)

  // Text Styles (ANSI attributes)
  bold: boolean;
  dim: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  inverse: boolean;

  // Layer/Z-Index Information
  zIndex: number; // Z-index for layer ordering (higher = on top)
  layerId: string; // ID of the layer that owns this cell

  // Component Tracking
  nodeId: string | null; // ID of the node/component that rendered this cell

  // Dirty Tracking
  dirty: boolean; // Whether this cell needs to be re-rendered to terminal
}

/**
 * Partial cell for updates - all fields optional except we preserve the structure
 */
export type PartialCell = Partial<Cell>;

/**
 * Dirty Region - Tracks areas that need re-rendering
 */
export interface DirtyRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Bounding Box - Standard rectangle type
 */
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Cell Diff - Represents a change between old and new cell state
 */
export interface CellDiff {
  x: number;
  y: number;
  oldCell: Cell | null;
  newCell: Cell;
}

/**
 * Layer - A rendering layer with its own buffer and z-index
 */
export interface LayerInfo {
  id: string;
  zIndex: number;
  visible: boolean;
  opacity: number; // 0-1, for future transparency support
  bounds: BoundingBox; // Layer's position and size
  nodeId: string | null; // Associated node ID
}

/**
 * Render Options for the buffer renderer
 */
export interface BufferRenderOptions {
  mode: 'static' | 'interactive' | 'fullscreen';
  fullRedraw: boolean;
  clearScreen: boolean;
  /** Final cursor position to set after rendering (combined with flush to avoid artifacts) */
  cursorPosition?: { x: number; y: number };
}

/**
 * Create an empty/default cell
 */
export function createEmptyCell(): Cell {
  return {
    char: '',
    foreground: null,
    background: null,
    bold: false,
    dim: false,
    italic: false,
    underline: false,
    strikethrough: false,
    inverse: false,
    zIndex: 0,
    layerId: 'root',
    nodeId: null,
    dirty: true,
  };
}

/**
 * Create a cell with specified values, using defaults for unspecified fields
 */
export function createCell(partial: PartialCell): Cell {
  return {
    ...createEmptyCell(),
    ...partial,
  };
}

/**
 * Check if a cell is "transparent" (has no visible content)
 * A cell with text styles (underline, bold, etc.) is NOT transparent
 * even if the character is a space - the styling is visible.
 */
export function isCellTransparent(cell: Cell): boolean {
  // Empty char is always transparent
  if (cell.char === '') return true;

  // Space with no styling is transparent
  if (cell.char === ' ') {
    // Check for any text styles that make the space "visible"
    const hasTextStyle =
      cell.bold || cell.dim || cell.italic || cell.underline || cell.strikethrough || cell.inverse;
    // Check for explicit foreground color (not null/inherit)
    const hasExplicitForeground = cell.foreground !== null && cell.foreground !== 'inherit';
    // Check for explicit background color (makes the space visible)
    const hasExplicitBackground = cell.background !== null && cell.background !== 'inherit';

    // Space is only transparent if it has no styling (including background)
    return !hasTextStyle && !hasExplicitForeground && !hasExplicitBackground;
  }

  // Non-space characters are never transparent
  return false;
}

/**
 * Check if two cells are visually equivalent
 */
export function cellsEqual(a: Cell, b: Cell): boolean {
  return (
    a.char === b.char &&
    a.foreground === b.foreground &&
    a.background === b.background &&
    a.bold === b.bold &&
    a.dim === b.dim &&
    a.italic === b.italic &&
    a.underline === b.underline &&
    a.strikethrough === b.strikethrough &&
    a.inverse === b.inverse
  );
}

/**
 * Clone a cell (deep copy)
 */
export function cloneCell(cell: Cell): Cell {
  return { ...cell };
}

/**
 * Merge two cells (for compositing)
 * The `top` cell takes precedence for non-transparent content
 */
export function mergeCells(bottom: Cell, top: Cell): Cell {
  // If top has visible content, use it
  if (!isCellTransparent(top)) {
    return {
      ...top,
      // If top has no background, inherit from bottom
      background: top.background ?? bottom.background,
      dirty: true,
    };
  }

  // Top is transparent, use bottom but potentially override background
  return {
    ...bottom,
    // If top has a background color (even if transparent char), use it
    background: top.background ?? bottom.background,
    // Update z-index to highest
    zIndex: Math.max(bottom.zIndex, top.zIndex),
    dirty: true,
  };
}
