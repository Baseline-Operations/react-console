/**
 * Global terminal object - similar to `window` in browsers
 * Stores terminal-related variables that are globally available without imports
 * This provides a consistent API for accessing terminal state across the application
 */

import type { TerminalDimensions, ConsoleNode } from '../types';
import { getTerminalDimensions as getDims } from './terminal';

/**
 * Global terminal object interface
 *
 * Similar to `window` in browsers, provides global access to terminal state and utilities.
 * Available without imports via `terminal` or `globalThis.terminal`.
 *
 * @example
 * ```ts
 * // Access terminal dimensions globally
 * const { columns, rows } = terminal.dimensions;
 *
 * // Access currently focused component
 * const focused = terminal.focusedComponent;
 *
 * // Update focused component
 * terminal.setFocusedComponent(myComponent);
 * ```
 */
export interface GlobalTerminal {
  /**
   * Current terminal dimensions (columns, rows)
   * Automatically updated on resize
   */
  dimensions: TerminalDimensions;

  /**
   * Currently focused component (if any)
   */
  focusedComponent: ConsoleNode | null;

  /**
   * ID of the currently focused node (survives across re-renders)
   */
  focusedNodeId: string | null;

  /**
   * Get current terminal dimensions
   * @returns Terminal dimensions (columns, rows)
   */
  getDimensions(): TerminalDimensions;

  /**
   * Set the currently focused component
   * @param component - Component to focus (or null to unfocus)
   */
  setFocusedComponent(component: ConsoleNode | null): void;

  /**
   * Get the currently focused component
   * @returns Currently focused component or null
   */
  getFocusedComponent(): ConsoleNode | null;
}

/**
 * Global terminal object instance
 * This is the single source of truth for terminal state
 * Similar to how `window` works in browsers
 */
class GlobalTerminalImpl implements GlobalTerminal {
  private _dimensions: TerminalDimensions;
  private _focusedComponent: ConsoleNode | null = null;
  private _focusedNodeId: string | null = null;

  constructor() {
    // Initialize with current terminal dimensions
    this._dimensions = getDims();
  }

  get dimensions(): TerminalDimensions {
    return this._dimensions;
  }

  set dimensions(value: TerminalDimensions) {
    this._dimensions = value;
  }

  get focusedComponent(): ConsoleNode | null {
    return this._focusedComponent;
  }

  get focusedNodeId(): string | null {
    return this._focusedNodeId;
  }

  set focusedNodeId(id: string | null) {
    this._focusedNodeId = id;
  }

  setFocusedComponent(component: ConsoleNode | null): void {
    this._focusedComponent = component;
    // Also update focusedNodeId when component is set
    this._focusedNodeId = (component as unknown as { id?: string | null })?.id ?? null;
  }

  getFocusedComponent(): ConsoleNode | null {
    return this._focusedComponent;
  }

  getDimensions(): TerminalDimensions {
    return this._dimensions;
  }
}

/**
 * Global terminal object instance (singleton)
 *
 * This is exported as a global-like object accessible without imports.
 * Similar to `window` in browsers, provides global access to terminal state.
 *
 * Attached to `globalThis` for global access: `terminal.dimensions`, `terminal.focusedComponent`
 *
 * @example
 * ```ts
 * // Use directly (available globally)
 * const dims = terminal.dimensions;
 * const focused = terminal.focusedComponent;
 * ```
 */
export const terminal: GlobalTerminal = new GlobalTerminalImpl();

// Attach terminal to globalThis so it's available globally without imports
// This makes it accessible as `globalThis.terminal` or just `terminal` (in Node.js/global scope)
declare global {
  var terminal: GlobalTerminal | undefined;
}
if (typeof globalThis !== 'undefined') {
  globalThis.terminal = terminal;
}

/**
 * Update terminal dimensions (called on resize)
 *
 * Updates the global terminal object with current terminal dimensions.
 * Called automatically on terminal resize, but can be called manually if needed.
 *
 * @example
 * ```ts
 * // Manual update (usually not needed - auto-updates on resize)
 * updateTerminalDimensions();
 * const dims = terminal.dimensions;
 * ```
 */
export function updateTerminalDimensions(): void {
  terminal.dimensions = getDims();
}
