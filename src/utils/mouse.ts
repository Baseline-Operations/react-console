/**
 * Mouse event handling for terminals that support mouse input
 * 
 * Utilities for enabling/disabling mouse tracking and parsing mouse events
 * from ANSI escape sequences in terminals that support SGR mouse mode.
 */

import type { MouseEvent } from '../types';

/**
 * Check if terminal supports mouse events
 * 
 * Determines if the current terminal supports mouse events by checking:
 * - TERM environment variable (not 'dumb')
 * - stdout is a TTY
 * 
 * @returns True if terminal supports mouse events, false otherwise
 * 
 * @example
 * ```ts
 * if (supportsMouse()) {
 *   enableMouseTracking();
 * }
 * ```
 */
export function supportsMouse(): boolean {
  // Check TERM environment variable for terminals that support mouse
  const term = process.env.TERM;
  if (!term) return false;

  // Many modern terminals support mouse (xterm, screen, tmux, etc.)
  // We can enable mouse support via ANSI escape codes
  return term !== 'dumb' && process.stdout.isTTY;
}

/**
 * Enable mouse tracking in terminal
 * 
 * Enables SGR extended mouse mode which reports mouse clicks, drags, and movement
 * via ANSI escape sequences. Must be called before mouse events can be received.
 * 
 * Enables:
 * - SGR extended mode (`\x1b[?1006h`) - Reports coordinates in decimal
 * - Click reporting (`\x1b[?1000h`) - Reports mouse clicks
 * - Drag reporting (`\x1b[?1002h`) - Reports mouse drags
 * 
 * @example
 * ```ts
 * if (supportsMouse()) {
 *   enableMouseTracking();
 *   // Mouse events now available
 * }
 * ```
 */
export function enableMouseTracking(): void {
  if (!supportsMouse()) return;

  // Enable mouse tracking (SGR mode - reports coordinates)
  // \x1b[?1000h - Enable mouse click reporting
  // \x1b[?1002h - Enable mouse drag reporting
  // \x1b[?1003h - Enable mouse move reporting
  // \x1b[?1006h - Enable SGR extended mouse mode
  process.stdout.write('\x1b[?1006h'); // SGR extended mode
  process.stdout.write('\x1b[?1000h'); // Click reporting
  process.stdout.write('\x1b[?1002h'); // Drag reporting
}

/**
 * Disable mouse tracking in terminal
 * 
 * Disables mouse tracking and returns terminal to normal mode.
 * Should be called when mouse events are no longer needed (e.g., on cleanup).
 * 
 * @example
 * ```ts
 * enableMouseTracking();
 * // ... use mouse events ...
 * disableMouseTracking(); // Cleanup
 * ```
 */
export function disableMouseTracking(): void {
  if (!supportsMouse()) return;

  // Disable mouse tracking
  process.stdout.write('\x1b[?1006l'); // Disable SGR extended mode
  process.stdout.write('\x1b[?1000l'); // Disable click reporting
  process.stdout.write('\x1b[?1002l'); // Disable drag reporting
}

/**
 * Parse mouse event from ANSI escape sequence
 * 
 * Parses mouse events from SGR extended mouse mode or legacy mouse mode ANSI sequences.
 * Supports both SGR extended format (`\x1b[<button;x;yM` or `\x1b[<button;x;ym`) and
 * legacy format (`\x1b[Mbutton;x;y`).
 * 
 * SGR extended mode:
 * - `M` = mouse button pressed or moved while pressed (can indicate drag)
 * - `m` = mouse button released
 * - Button encoding includes modifiers (shift, ctrl, meta)
 * 
 * @param sequence - ANSI escape sequence from stdin
 * @returns Parsed MouseEvent object or null if not a mouse event
 * 
 * @example
 * ```ts
 * const event = parseMouseEvent('\x1b[<0;10;5M');
 * // { x: 9, y: 4, button: 0, ctrl: false, shift: false, meta: false, eventType: 'press' }
 * ```
 */
export function parseMouseEvent(sequence: string): MouseEvent | null {
  // SGR extended mouse mode: \x1b[<button;x;yM or \x1b[<button;x;ym
  // M = mouse button pressed or moved while pressed (can indicate drag)
  // m = mouse button released
  // eslint-disable-next-line no-control-regex
  const sgrMatch = sequence.match(/^\x1b\[<(\d+);(\d+);(\d+)([Mm])$/);
  if (sgrMatch) {
    const button = parseInt(sgrMatch[1]!, 10);
    const x = parseInt(sgrMatch[2]!, 10) - 1; // Convert to 0-based
    const y = parseInt(sgrMatch[3]!, 10) - 1; // Convert to 0-based
    const eventType = sgrMatch[4] === 'M' ? 'press' : 'release'; // M = press/move, m = release

    // Button encoding:
    // 0 = left, 1 = middle, 2 = right
    // 32 = left with shift, 33 = middle with shift, 34 = right with shift
    // 64 = left with ctrl, 65 = middle with ctrl, 66 = right with ctrl
    const buttonNumber = button & 0x03; // Extract button (0-2)
    const hasShift = (button & 0x04) !== 0;
    const hasCtrl = (button & 0x10) !== 0;
    const hasMeta = (button & 0x08) !== 0;

    return {
      x,
      y,
      button: buttonNumber,
      ctrl: hasCtrl,
      shift: hasShift,
      meta: hasMeta,
      eventType, // 'press' for M, 'release' for m
    };
  }

  // Legacy mouse mode: \x1b[Mbutton;x;y
  // eslint-disable-next-line no-control-regex
  const legacyMatch = sequence.match(/^\x1b\[M([\x20-\x23])([\x21-\x7e])([\x21-\x7e])$/);
  if (legacyMatch) {
    const button = legacyMatch[1]!.charCodeAt(0) - 0x20;
    const x = legacyMatch[2]!.charCodeAt(0) - 0x21;
    const y = legacyMatch[3]!.charCodeAt(0) - 0x21;

    return {
      x,
      y,
      button: button & 0x03,
      ctrl: false,
      shift: false,
      meta: false,
    };
  }

  return null;
}

/**
 * Check if a sequence is a mouse event
 * 
 * Quick check to determine if an ANSI sequence represents a mouse event.
 * Useful for filtering input before parsing.
 * 
 * @param sequence - ANSI escape sequence to check
 * @returns True if sequence is a mouse event, false otherwise
 * 
 * @example
 * ```ts
 * if (isMouseEvent(sequence)) {
 *   const event = parseMouseEvent(sequence);
 *   // Handle mouse event
 * }
 * ```
 */
export function isMouseEvent(sequence: string): boolean {
  return parseMouseEvent(sequence) !== null;
}
