/**
 * Shared types for renderer internals
 * Types used across renderer modules for internal operations
 */

import type { ConsoleNode } from '../types';
import type { CellBuffer } from '../buffer';

/**
 * Render position result
 * Returned by layout functions to indicate where to render next
 */
export interface RenderPosition {
  x: number;
  y: number;
}

/**
 * Layout constraints for rendering
 * Defines available space for layout calculations
 */
export interface LayoutConstraints {
  maxWidth: number;
  maxHeight?: number;
  x: number;
  y: number;
}

/**
 * Computed layout information for a node
 * Stores calculated position and dimensions
 */
export interface ComputedLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Layout calculation context
 * Passed through layout functions for context
 */
export interface LayoutContext {
  terminalWidth: number;
  terminalHeight: number;
  parentWidth?: number;
  parentHeight?: number;
  parentX?: number;
  parentY?: number;
}

/**
 * Node render function signature
 * Type for functions that render a specific node type to a CellBuffer
 */
export type NodeRenderFunction = (
  node: ConsoleNode,
  buffer: CellBuffer,
  x: number,
  y: number,
  maxWidth: number,
  maxHeight?: number
) => RenderPosition;
