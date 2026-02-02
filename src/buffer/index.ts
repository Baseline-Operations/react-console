/**
 * Multi-Buffer Rendering System
 *
 * This module provides a cell-based multi-buffer rendering system for
 * terminal UI applications. It supports:
 *
 * - Cell-level styling and color tracking
 * - Z-index layering with proper compositing
 * - Diff-based updates for efficient rendering
 * - Background color inheritance
 * - Component tracking per cell
 *
 * @module buffer
 */

// Types
export {
  Cell,
  PartialCell,
  DirtyRegion,
  BoundingBox,
  CellDiff,
  LayerInfo,
  BufferRenderOptions,
  createEmptyCell,
  createCell,
  isCellTransparent,
  cellsEqual,
  cloneCell,
  mergeCells,
} from './types';

// Core Buffers
export { CellBuffer } from './CellBuffer';
export { Layer, LayerManager } from './Layer';
export { CompositeBuffer, blendColors, compositeCells } from './CompositeBuffer';
export { DisplayBuffer } from './DisplayBuffer';

// ANSI Generation
export { ANSIGenerator, fgColor, bgColor, reset } from './ANSIGenerator';

// Main Renderer
export {
  BufferRenderer,
  CellRenderContext,
  getBufferRenderer,
  resetBufferRenderer,
} from './BufferRenderer';
