/**
 * Unit tests for mouse utilities
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { supportsMouse, enableMouseTracking, disableMouseTracking, parseMouseEvent, isMouseEvent } from '../../utils/mouse';

describe('mouse utilities', () => {
  const originalEnv = process.env.TERM;
  const originalIsTTY = process.stdout.isTTY;
  const originalWrite = process.stdout.write;

  beforeEach(() => {
    // Mock stdout.write to capture output
    process.stdout.write = vi.fn() as any;
  });

  afterEach(() => {
    process.env.TERM = originalEnv;
    process.stdout.isTTY = originalIsTTY;
    process.stdout.write = originalWrite;
    vi.clearAllMocks();
  });

  describe('supportsMouse', () => {
    it('should return false when TERM is not set', () => {
      delete process.env.TERM;
      process.stdout.isTTY = true;
      expect(supportsMouse()).toBe(false);
    });

    it('should return false when TERM is "dumb"', () => {
      process.env.TERM = 'dumb';
      process.stdout.isTTY = true;
      expect(supportsMouse()).toBe(false);
    });

    it('should return false when not a TTY', () => {
      process.env.TERM = 'xterm-256color';
      process.stdout.isTTY = false;
      expect(supportsMouse()).toBe(false);
    });

    it('should return true for valid terminal', () => {
      process.env.TERM = 'xterm-256color';
      process.stdout.isTTY = true;
      expect(supportsMouse()).toBe(true);
    });

    it('should return true for screen terminal', () => {
      process.env.TERM = 'screen';
      process.stdout.isTTY = true;
      expect(supportsMouse()).toBe(true);
    });
  });

  describe('enableMouseTracking', () => {
    it('should not enable tracking if mouse not supported', () => {
      process.env.TERM = 'dumb';
      process.stdout.isTTY = false;
      enableMouseTracking();
      expect(process.stdout.write).not.toHaveBeenCalled();
    });

    it('should enable mouse tracking for supported terminals', () => {
      process.env.TERM = 'xterm-256color';
      process.stdout.isTTY = true;
      enableMouseTracking();
      expect(process.stdout.write).toHaveBeenCalledTimes(4);
      expect(process.stdout.write).toHaveBeenCalledWith('\x1b[?1006h');
      expect(process.stdout.write).toHaveBeenCalledWith('\x1b[?1000h');
      expect(process.stdout.write).toHaveBeenCalledWith('\x1b[?1002h');
      expect(process.stdout.write).toHaveBeenCalledWith('\x1b[?1003h'); // Move reporting for hover
    });
  });

  describe('disableMouseTracking', () => {
    it('should not disable tracking if mouse not supported', () => {
      process.env.TERM = 'dumb';
      process.stdout.isTTY = false;
      disableMouseTracking();
      expect(process.stdout.write).not.toHaveBeenCalled();
    });

    it('should disable mouse tracking for supported terminals', () => {
      process.env.TERM = 'xterm-256color';
      process.stdout.isTTY = true;
      disableMouseTracking();
      expect(process.stdout.write).toHaveBeenCalledTimes(4);
      expect(process.stdout.write).toHaveBeenCalledWith('\x1b[?1006l');
      expect(process.stdout.write).toHaveBeenCalledWith('\x1b[?1000l');
      expect(process.stdout.write).toHaveBeenCalledWith('\x1b[?1002l');
      expect(process.stdout.write).toHaveBeenCalledWith('\x1b[?1003l'); // Disable move reporting
    });
  });

  describe('parseMouseEvent', () => {
    it('should parse SGR extended mouse press event', () => {
      const event = parseMouseEvent('\x1b[<0;10;5M');
      expect(event).not.toBeNull();
      expect(event?.x).toBe(9); // 0-based
      expect(event?.y).toBe(4); // 0-based
      expect(event?.button).toBe(0); // left button
      expect(event?.eventType).toBe('press');
    });

    it('should parse SGR extended mouse release event', () => {
      const event = parseMouseEvent('\x1b[<0;10;5m');
      expect(event).not.toBeNull();
      expect(event?.x).toBe(9);
      expect(event?.y).toBe(4);
      expect(event?.button).toBe(0);
      expect(event?.eventType).toBe('release');
    });

    it('should parse middle button click', () => {
      const event = parseMouseEvent('\x1b[<1;10;5M');
      expect(event).not.toBeNull();
      expect(event?.button).toBe(1); // middle button
    });

    it('should parse right button click', () => {
      const event = parseMouseEvent('\x1b[<2;10;5M');
      expect(event).not.toBeNull();
      expect(event?.button).toBe(2); // right button
    });

    it('should parse mouse event with shift modifier', () => {
      const event = parseMouseEvent('\x1b[<4;10;5M'); // button 0 + shift (0x04)
      expect(event).not.toBeNull();
      expect(event?.button).toBe(0);
      expect(event?.shift).toBe(true);
      expect(event?.ctrl).toBe(false);
      expect(event?.meta).toBe(false);
    });

    it('should parse mouse event with ctrl modifier', () => {
      const event = parseMouseEvent('\x1b[<16;10;5M'); // button 0 + ctrl (0x10)
      expect(event).not.toBeNull();
      expect(event?.button).toBe(0);
      expect(event?.ctrl).toBe(true);
      expect(event?.shift).toBe(false);
    });

    it('should parse mouse event with meta modifier', () => {
      const event = parseMouseEvent('\x1b[<8;10;5M'); // button 0 + meta (0x08)
      expect(event).not.toBeNull();
      expect(event?.button).toBe(0);
      expect(event?.meta).toBe(true);
    });

    it('should parse legacy mouse event format', () => {
      // Legacy format: \x1b[Mbutton;x;y
      // The regex expects 3 characters after \x1b[M:
      // - button: 0x20-0x23 (space, !, ", #)
      // - x: 0x21-0x7e
      // - y: 0x21-0x7e
      // For button=0 (left), x=0, y=0:
      // - button char: 0x20 (space) = ' '
      // - x char: 0x21 (!) = '!'
      // - y char: 0x21 (!) = '!'
      // So the full sequence needs 3 chars after [M: \x1b[M !!
      // Construct it properly: \x1b + [M + space + ! + !
      const legacyEvent = String.fromCharCode(0x1b) + '[M' + String.fromCharCode(0x20) + String.fromCharCode(0x21) + String.fromCharCode(0x21);
      const event = parseMouseEvent(legacyEvent);
      expect(event).not.toBeNull();
      if (event) {
        expect(event.button).toBe(0);
        // x = charCode('!') - 0x21 = 33 - 33 = 0
        // y = charCode('!') - 0x21 = 33 - 33 = 0
        expect(event.x).toBe(0);
        expect(event.y).toBe(0);
      }
    });

    it('should return null for non-mouse sequences', () => {
      expect(parseMouseEvent('hello')).toBeNull();
      expect(parseMouseEvent('\x1b[31m')).toBeNull();
      expect(parseMouseEvent('')).toBeNull();
    });

    it('should handle invalid SGR format', () => {
      expect(parseMouseEvent('\x1b[<invalid')).toBeNull();
      expect(parseMouseEvent('\x1b[<0;10M')).toBeNull(); // Missing y coordinate
    });
  });

  describe('isMouseEvent', () => {
    it('should return true for valid mouse events', () => {
      expect(isMouseEvent('\x1b[<0;10;5M')).toBe(true);
      expect(isMouseEvent('\x1b[<0;10;5m')).toBe(true);
      // Legacy format requires 3 characters after \x1b[M
      // button: 0x20-0x23, x: 0x21-0x7e, y: 0x21-0x7e
      const legacyEvent = String.fromCharCode(0x1b) + '[M' + String.fromCharCode(0x20) + String.fromCharCode(0x21) + String.fromCharCode(0x21);
      expect(isMouseEvent(legacyEvent)).toBe(true);
    });

    it('should return false for non-mouse sequences', () => {
      expect(isMouseEvent('hello')).toBe(false);
      expect(isMouseEvent('\x1b[31m')).toBe(false);
      expect(isMouseEvent('')).toBe(false);
    });
  });
});
