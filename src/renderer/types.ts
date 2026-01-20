/**
 * Shared types for renderer internals
 * Types used across renderer modules for internal operations
 */

import type { ConsoleNode } from '../types';

// Note: OutputBuffer is defined in output.ts to avoid circular dependencies

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
 * Type for functions that render a specific node type to a buffer
 */
// Note: OutputBuffer type is imported from output.ts where it's defined
import type { OutputBuffer } from './output';

/**
 * Node render function signature
 * Type for functions that render a specific node type to a buffer
 */
export type NodeRenderFunction = (
  node: ConsoleNode,
  buffer: OutputBuffer,
  x: number,
  y: number,
  maxWidth: number,
  maxHeight?: number
) => RenderPosition;
