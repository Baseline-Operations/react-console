/**
 * Terminal utilities for detecting dimensions and capabilities
 */

import type { TerminalDimensions } from '../types';
import { debounce } from './debounce';

// Global render mode state
let currentRenderMode: 'static' | 'interactive' | 'fullscreen' = 'static';

/**
 * Set the current render mode (used by render.ts)
 */
export function setRenderMode(mode: 'static' | 'interactive' | 'fullscreen'): void {
  currentRenderMode = mode;
}

/**
 * Get the current render mode
 */
export function getRenderMode(): 'static' | 'interactive' | 'fullscreen' {
  return currentRenderMode;
}

/**
 * Check if we're in static render mode
 */
export function isStaticMode(): boolean {
  return currentRenderMode === 'static';
}

/**
 * Maximum height used for layout calculations in static mode.
 * In static mode, content can scroll beyond the visible terminal,
 * so layout should not be constrained to the terminal height.
 */
export const STATIC_LAYOUT_MAX_HEIGHT = 10000;

/**
 * Get terminal dimensions (columns and rows)
 *
 * Returns the actual terminal size. Falls back to 80x24 if dimensions
 * are not available (e.g., when not in a TTY).
 *
 * Always returns the real visual terminal dimensions regardless of render mode.
 *
 * @returns Terminal dimensions with columns and rows
 *
 * @example
 * ```ts
 * const dims = getTerminalDimensions();
 * console.log(`Terminal size: ${dims.columns}x${dims.rows}`);
 * ```
 */
export function getTerminalDimensions(): TerminalDimensions {
  const columns = process.stdout.columns ?? 80;
  const rows = process.stdout.rows ?? 24;
  return { columns, rows };
}

/**
 * Get the maximum height to use for layout calculations.
 *
 * In static mode, returns a large value so content is not constrained
 * to the visible terminal height (it can scroll). In interactive/fullscreen
 * mode, returns the actual terminal rows since content must fit the viewport.
 *
 * @returns Maximum height for layout constraints
 */
export function getLayoutMaxHeight(): number {
  if (currentRenderMode === 'static') {
    return STATIC_LAYOUT_MAX_HEIGHT;
  }
  return process.stdout.rows ?? 24;
}

/**
 * Check if terminal supports ANSI colors
 *
 * Checks environment variables and terminal type to determine color support.
 * Respects FORCE_COLOR environment variable if set.
 *
 * @returns True if terminal supports colors, false otherwise
 *
 * @example
 * ```ts
 * if (supportsColor()) {
 *   console.log('\x1b[31mRed text\x1b[0m');
 * }
 * ```
 */
export function supportsColor(): boolean {
  if (process.env.FORCE_COLOR === '0') return false;
  if (process.env.FORCE_COLOR !== undefined) return true;

  // Check if stdout is a TTY
  if (!process.stdout.isTTY) return false;

  // Platform-specific checks
  if (process.platform === 'win32') {
    // Windows 10+ supports ANSI
    return true;
  }

  // Check TERM environment variable
  const term = process.env.TERM;
  if (!term) return false;

  // xterm, xterm-256color, screen, etc. support colors
  return term !== 'dumb';
}

/**
 * Enter raw mode for terminal input (captures keypresses)
 *
 * Enables raw mode on stdin, allowing capture of individual keypresses
 * and special keys (arrows, function keys, etc.) instead of line buffering.
 * Required for interactive applications.
 *
 * @example
 * ```ts
 * enterRawMode(); // Now can capture individual keypresses
 * // ... handle input ...
 * exitRawMode(); // Restore normal input mode
 * ```
 */
export function enterRawMode(): void {
  if (!process.stdin.isTTY) return;

  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
}

/**
 * Exit raw mode
 *
 * Restores normal line-buffered input mode. Should be called when
 * interactive mode is no longer needed to restore normal terminal behavior.
 *
 * @example
 * ```ts
 * enterRawMode();
 * // ... interactive input handling ...
 * exitRawMode(); // Restore normal input
 * ```
 */
export function exitRawMode(): void {
  if (!process.stdin.isTTY) return;

  process.stdin.setRawMode(false);
  process.stdin.pause();
}

/**
 * Listen for terminal resize events
 *
 * Registers a callback that will be called whenever the terminal window is resized.
 * Returns a cleanup function to remove the listener.
 *
 * @param callback - Function to call on terminal resize
 * @returns Cleanup function to remove the resize listener
 *
 * @example
 * ```ts
 * const cleanup = onTerminalResize(() => {
 *   console.log('Terminal resized!');
 *   // Re-render UI with new dimensions
 * });
 *
 * // Later, cleanup
 * cleanup();
 * ```
 */
export function onTerminalResize(callback: () => void): () => void {
  if (!process.stdout.isTTY) {
    return () => {};
  }

  // Listen for resize events
  process.stdout.on('resize', callback);

  // Return cleanup function
  return () => {
    process.stdout.removeListener('resize', callback);
  };
}

/**
 * Listen for terminal resize events with debouncing
 *
 * Registers a debounced callback that will be called after terminal resize events.
 * Debounces rapid resize events to prevent excessive reconciliation.
 *
 * @param callback - Function to call on terminal resize (debounced)
 * @param delay - Debounce delay in milliseconds (default: 100)
 * @returns Cleanup function to remove the resize listener
 *
 * @example
 * ```ts
 * const cleanup = onTerminalResizeDebounced(() => {
 *   console.log('Terminal resized!');
 *   // Re-render UI with new dimensions
 * }, 100);
 *
 * // Later, cleanup
 * cleanup();
 * ```
 */
export function onTerminalResizeDebounced(callback: () => void, delay: number = 100): () => void {
  if (!process.stdout.isTTY) {
    return () => {};
  }

  const debouncedCallback = debounce(callback, delay);

  // Listen for resize events with debounced callback
  process.stdout.on('resize', debouncedCallback);

  // Return cleanup function
  return () => {
    process.stdout.removeListener('resize', debouncedCallback);
  };
}
