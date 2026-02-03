/**
 * Terminal utilities for detecting dimensions and capabilities
 */

import { createRequire } from 'node:module';
import type { TerminalDimensions } from '../types';

// Create require function for ESM compatibility
const require = createRequire(import.meta.url);

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
 * Get terminal dimensions (columns and rows)
 *
 * Returns the current terminal size. Falls back to 80x24 if dimensions
 * are not available (e.g., when not in a TTY).
 *
 * For static mode, rows is set to a large value to allow unlimited height.
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
  // For static mode, allow unlimited height (use large number)
  // For interactive mode, use actual terminal rows
  const rows = currentRenderMode === 'static' ? 10000 : (process.stdout.rows ?? 24);
  return { columns, rows };
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

  // Import debounce here to avoid circular dependencies
  const { debounce } = require('./debounce');
  const debouncedCallback = debounce(callback, delay);

  // Listen for resize events with debounced callback
  process.stdout.on('resize', debouncedCallback);

  // Return cleanup function
  return () => {
    process.stdout.removeListener('resize', debouncedCallback);
  };
}
