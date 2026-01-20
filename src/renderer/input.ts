/**
 * Input handling for interactive components
 */

import { enterRawMode, exitRawMode } from '../utils/terminal';
import type { KeyPress, MouseEvent } from '../types';
import { parseMouseEvent, isMouseEvent, enableMouseTracking, disableMouseTracking, supportsMouse } from '../utils/mouse';

let inputListener: ((chunk: string, key: KeyPress | null, mouse: MouseEvent | null) => void) | null = null;
let isRawModeActive = false;
let mouseTrackingEnabled = false;
let inputBuffer = ''; // Buffer for multi-byte sequences (like arrow keys)

/**
 * Parse keypress data into KeyPress object
 */
export function parseKeyPress(chunk: string): KeyPress {
  // Handle special sequences
  if (chunk === '\r' || chunk === '\n') {
    return {
      return: true,
      ctrl: false,
      meta: false,
      shift: false,
      escape: false,
      tab: false,
      backspace: false,
      delete: false,
      upArrow: false,
      downArrow: false,
      leftArrow: false,
      rightArrow: false,
    };
  }

  if (chunk === '\x1b') {
    // ESC key
    return {
      escape: true,
      ctrl: false,
      meta: false,
      shift: false,
      return: false,
      tab: false,
      backspace: false,
      delete: false,
      upArrow: false,
      downArrow: false,
      leftArrow: false,
      rightArrow: false,
    };
  }

  if (chunk === '\t') {
    return {
      tab: true,
      ctrl: false,
      meta: false,
      shift: false,
      return: false,
      escape: false,
      backspace: false,
      delete: false,
      upArrow: false,
      downArrow: false,
      leftArrow: false,
      rightArrow: false,
    };
  }

  if (chunk === '\x7f' || chunk === '\b') {
    // Backspace
    return {
      backspace: true,
      ctrl: false,
      meta: false,
      shift: false,
      return: false,
      escape: false,
      tab: false,
      delete: false,
      upArrow: false,
      downArrow: false,
      leftArrow: false,
      rightArrow: false,
    };
  }

  if (chunk === '\x1b[A') {
    // Up arrow
    return {
      upArrow: true,
      ctrl: false,
      meta: false,
      shift: false,
      return: false,
      escape: false,
      tab: false,
      backspace: false,
      delete: false,
      downArrow: false,
      leftArrow: false,
      rightArrow: false,
    };
  }

  if (chunk === '\x1b[B') {
    // Down arrow
    return {
      downArrow: true,
      ctrl: false,
      meta: false,
      shift: false,
      return: false,
      escape: false,
      tab: false,
      backspace: false,
      delete: false,
      upArrow: false,
      leftArrow: false,
      rightArrow: false,
    };
  }

  if (chunk === '\x1b[C') {
    // Right arrow
    return {
      rightArrow: true,
      ctrl: false,
      meta: false,
      shift: false,
      return: false,
      escape: false,
      tab: false,
      backspace: false,
      delete: false,
      upArrow: false,
      downArrow: false,
      leftArrow: false,
    };
  }

  if (chunk === '\x1b[D') {
    // Left arrow
    return {
      leftArrow: true,
      ctrl: false,
      meta: false,
      shift: false,
      return: false,
      escape: false,
      tab: false,
      backspace: false,
      delete: false,
      upArrow: false,
      downArrow: false,
      rightArrow: false,
    };
  }

  // Page Up: \x1b[5~
  if (chunk === '\x1b[5~') {
    return {
      pageUp: true,
      ctrl: false,
      meta: false,
      shift: false,
      return: false,
      escape: false,
      tab: false,
      backspace: false,
      delete: false,
      upArrow: false,
      downArrow: false,
      leftArrow: false,
      rightArrow: false,
    };
  }

  // Page Down: \x1b[6~
  if (chunk === '\x1b[6~') {
    return {
      pageDown: true,
      ctrl: false,
      meta: false,
      shift: false,
      return: false,
      escape: false,
      tab: false,
      backspace: false,
      delete: false,
      upArrow: false,
      downArrow: false,
      leftArrow: false,
      rightArrow: false,
    };
  }

  // Home: \x1b[H or \x1b[1~
  if (chunk === '\x1b[H' || chunk === '\x1b[1~') {
    return {
      home: true,
      ctrl: false,
      meta: false,
      shift: false,
      return: false,
      escape: false,
      tab: false,
      backspace: false,
      delete: false,
      upArrow: false,
      downArrow: false,
      leftArrow: false,
      rightArrow: false,
    };
  }

  // End: \x1b[F or \x1b[4~
  if (chunk === '\x1b[F' || chunk === '\x1b[4~') {
    return {
      end: true,
      ctrl: false,
      meta: false,
      shift: false,
      return: false,
      escape: false,
      tab: false,
      backspace: false,
      delete: false,
      upArrow: false,
      downArrow: false,
      leftArrow: false,
      rightArrow: false,
    };
  }

  // Regular character
  // Ctrl key combinations: Ctrl+A = 0x01, Ctrl+B = 0x02, Ctrl+C = 0x03, etc.
  // Ctrl+char produces a character with charCode < 32 (control characters)
  const charCode = chunk.length === 1 ? chunk.charCodeAt(0) : 0;
  const isCtrl = charCode < 32 && charCode !== 0;
  const isMeta = false; // Meta key detection would need platform-specific code
  
  // Map common Ctrl+key combinations to readable names for shortcut detection
  let char = chunk;
  if (isCtrl && charCode >= 0x01 && charCode <= 0x1A) {
    // Map control characters to their key names for shortcuts (Ctrl+A through Ctrl+Z)
    const ctrlMap: Record<number, string> = {
      0x01: 'a', // Ctrl+A
      0x02: 'b', // Ctrl+B
      0x03: 'c', // Ctrl+C
      0x04: 'd', // Ctrl+D
      0x05: 'e', // Ctrl+E
      0x06: 'f', // Ctrl+F
      0x07: 'g', // Ctrl+G
      0x08: 'h', // Ctrl+H (backspace)
      0x09: 'i', // Ctrl+I (tab)
      0x0A: 'j', // Ctrl+J (line feed)
      0x0B: 'k', // Ctrl+K
      0x0C: 'l', // Ctrl+L
      0x0D: 'm', // Ctrl+M (return)
      0x0E: 'n', // Ctrl+N
      0x0F: 'o', // Ctrl+O
      0x10: 'p', // Ctrl+P
      0x11: 'q', // Ctrl+Q
      0x12: 'r', // Ctrl+R
      0x13: 's', // Ctrl+S
      0x14: 't', // Ctrl+T
      0x15: 'u', // Ctrl+U
      0x16: 'v', // Ctrl+V
      0x17: 'w', // Ctrl+W
      0x18: 'x', // Ctrl+X
      0x19: 'y', // Ctrl+Y
      0x1A: 'z', // Ctrl+Z
    };
    // Store the mapped key name for shortcut detection (e.g., 'c' for Ctrl+C)
    char = ctrlMap[charCode] || chunk;
  }

  return {
    char: char,
    ctrl: isCtrl,
    meta: isMeta,
    shift: false,
    return: false,
    escape: false,
    tab: false,
    backspace: false,
    delete: false,
    upArrow: false,
    downArrow: false,
    leftArrow: false,
    rightArrow: false,
  };
}

/**
 * Start listening for input (keyboard and mouse)
 */
export function startInputListener(
  onInput: (chunk: string, key: KeyPress | null, mouse: MouseEvent | null) => void
): void {
  if (isRawModeActive) {
    stopInputListener();
  }

  inputListener = onInput;
  isRawModeActive = true;
  enterRawMode();

  // Enable mouse tracking if supported
  if (supportsMouse()) {
    enableMouseTracking();
    mouseTrackingEnabled = true;
  }

  // Remove any existing listeners to prevent duplicates
  process.stdin.removeAllListeners('data');

  // Set up input handling
  process.stdin.on('data', (chunk: Buffer) => {
    const str = chunk.toString();
    
    // Accumulate input buffer for multi-byte sequences
    inputBuffer += str;

    // Check if we have a complete sequence (mouse events or arrow keys can be multi-byte)
    // Mouse events: \x1b[<button;x;yM (SGR extended mode)
    // Arrow keys: \x1b[A, \x1b[B, \x1b[C, \x1b[D
    
    // Check for mouse events (can be multi-byte)
    if (inputBuffer.startsWith('\x1b[<')) {
      // Mouse event - wait for complete sequence (ends with M or m)
      // eslint-disable-next-line no-control-regex
      if (inputBuffer.match(/^\x1b\[<\d+;\d+;\d+[Mm]/)) {
        const mouseEvent = parseMouseEvent(inputBuffer);
        if (inputListener && mouseEvent) {
          inputListener(inputBuffer, null, mouseEvent);
        }
        inputBuffer = '';
        return;
      }
      // Incomplete mouse sequence, wait for more data
      return;
    }

    // Check for arrow keys or other escape sequences
    if (inputBuffer.startsWith('\x1b[')) {
      // Escape sequence - check if complete
      // eslint-disable-next-line no-control-regex
      if (inputBuffer.match(/^\x1b\[[ABCD]/)) {
        // Complete arrow key sequence
        const key = parseKeyPress(inputBuffer);
        if (inputListener) {
          inputListener(inputBuffer, key, null);
        }
        inputBuffer = '';
        return;
      }
      // eslint-disable-next-line no-control-regex
      if (inputBuffer.match(/^\x1b\[[56]~/)) {
        // Page Up (\x1b[5~) or Page Down (\x1b[6~)
        const key = parseKeyPress(inputBuffer);
        if (inputListener) {
          inputListener(inputBuffer, key, null);
        }
        inputBuffer = '';
        return;
      }
      // eslint-disable-next-line no-control-regex
      if (inputBuffer.match(/^\x1b\[[14]~/)) {
        // Home (\x1b[1~) or End (\x1b[4~)
        const key = parseKeyPress(inputBuffer);
        if (inputListener) {
          inputListener(inputBuffer, key, null);
        }
        inputBuffer = '';
        return;
      }
      if (inputBuffer === '\x1b[H' || inputBuffer === '\x1b[F') {
        // Home (\x1b[H) or End (\x1b[F)
        const key = parseKeyPress(inputBuffer);
        if (inputListener) {
          inputListener(inputBuffer, key, null);
        }
        inputBuffer = '';
        return;
      }
      // Incomplete escape sequence, wait for more data
      if (inputBuffer.length > 10) {
        // Safety: if buffer gets too long, reset it
        inputBuffer = '';
      }
      return;
    }

    // Single character or complete sequence
    // Check if it's a mouse event (legacy mode)
    if (isMouseEvent(inputBuffer)) {
      const mouseEvent = parseMouseEvent(inputBuffer);
      if (inputListener && mouseEvent) {
        inputListener(inputBuffer, null, mouseEvent);
      }
      inputBuffer = '';
      return;
    }

    // Regular keyboard input
    const key = parseKeyPress(inputBuffer);

    // Handle Ctrl+C - exit (only if not handled by component)
    // Note: Components can handle Ctrl+C via onKeyDown if they want custom behavior
    if (key.ctrl && inputBuffer === '\x03') {
      // Let the input listener handle it first (components can prevent default)
      if (inputListener) {
        inputListener(inputBuffer, key, null);
      }
      // If we get here, no component handled it, so exit
      stopInputListener();
      process.exit(0);
      return;
    }

    if (inputListener) {
      inputListener(inputBuffer, key, null);
    }
    
    // Clear buffer after processing
    inputBuffer = '';
  });
}

/**
 * Stop listening for input
 */
export function stopInputListener(): void {
  inputListener = null;
  inputBuffer = ''; // Clear input buffer
  if (isRawModeActive) {
    // Disable mouse tracking if enabled
    if (mouseTrackingEnabled) {
      disableMouseTracking();
      mouseTrackingEnabled = false;
    }

    // Remove all data listeners before exiting raw mode
    process.stdin.removeAllListeners('data');
    exitRawMode();
    isRawModeActive = false;
  }
}

/**
 * Check if input listener is active
 */
export function isInputListenerActive(): boolean {
  return isRawModeActive;
}
