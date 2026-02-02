/**
 * Unit tests for terminal utilities
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getTerminalDimensions,
  supportsColor,
  enterRawMode,
  exitRawMode,
  onTerminalResize,
  setRenderMode,
} from '../../utils/terminal';

describe('terminal utilities', () => {
  const originalEnv = process.env;
  const originalColumns = process.stdout.columns;
  const originalRows = process.stdout.rows;
  const originalIsTTY = process.stdout.isTTY;
  const originalStdinIsTTY = process.stdin.isTTY;
  const originalSetRawMode = process.stdin.setRawMode;
  const originalResume = process.stdin.resume;
  const originalPause = process.stdin.pause;
  const originalSetEncoding = process.stdin.setEncoding;
  const originalOn = process.stdout.on;
  const originalRemoveListener = process.stdout.removeListener;

  beforeEach(() => {
    process.env = { ...originalEnv };
    vi.clearAllMocks();
    // Set to interactive mode to get actual terminal dimensions in tests
    setRenderMode('interactive');
  });

  afterEach(() => {
    process.env = originalEnv;
    process.stdout.columns = originalColumns;
    process.stdout.rows = originalRows;
    process.stdout.isTTY = originalIsTTY;
    process.stdin.isTTY = originalStdinIsTTY;
    process.stdin.setRawMode = originalSetRawMode;
    process.stdin.resume = originalResume;
    process.stdin.pause = originalPause;
    process.stdin.setEncoding = originalSetEncoding;
    process.stdout.on = originalOn;
    process.stdout.removeListener = originalRemoveListener;
    // Reset to static mode (default)
    setRenderMode('static');
  });

  describe('getTerminalDimensions', () => {
    it('should return actual terminal dimensions when available in interactive mode', () => {
      process.stdout.columns = 120;
      process.stdout.rows = 40;
      const dims = getTerminalDimensions();
      expect(dims.columns).toBe(120);
      expect(dims.rows).toBe(40);
    });

    it('should return default dimensions when columns not available in interactive mode', () => {
      process.stdout.columns = undefined;
      process.stdout.rows = 24;
      const dims = getTerminalDimensions();
      expect(dims.columns).toBe(80);
      expect(dims.rows).toBe(24);
    });

    it('should return default dimensions when rows not available in interactive mode', () => {
      process.stdout.columns = 80;
      process.stdout.rows = undefined;
      const dims = getTerminalDimensions();
      expect(dims.columns).toBe(80);
      expect(dims.rows).toBe(24);
    });

    it('should return default dimensions when both not available in interactive mode', () => {
      process.stdout.columns = undefined;
      process.stdout.rows = undefined;
      const dims = getTerminalDimensions();
      expect(dims.columns).toBe(80);
      expect(dims.rows).toBe(24);
    });

    it('should return large row count in static mode', () => {
      setRenderMode('static');
      process.stdout.columns = 80;
      process.stdout.rows = 24;
      const dims = getTerminalDimensions();
      expect(dims.columns).toBe(80);
      expect(dims.rows).toBe(10000); // Static mode allows unlimited height
    });
  });

  describe('supportsColor', () => {
    it('should return false when FORCE_COLOR is "0"', () => {
      process.env.FORCE_COLOR = '0';
      expect(supportsColor()).toBe(false);
    });

    it('should return true when FORCE_COLOR is set to non-zero', () => {
      process.env.FORCE_COLOR = '1';
      expect(supportsColor()).toBe(true);
      process.env.FORCE_COLOR = 'true';
      expect(supportsColor()).toBe(true);
    });

    it('should return false when not a TTY', () => {
      delete process.env.FORCE_COLOR;
      process.stdout.isTTY = false;
      expect(supportsColor()).toBe(false);
    });

    it('should return true for Windows platform', () => {
      delete process.env.FORCE_COLOR;
      process.stdout.isTTY = true;
      const originalPlatform = process.platform;
      Object.defineProperty(process, 'platform', { value: 'win32', writable: true });
      expect(supportsColor()).toBe(true);
      Object.defineProperty(process, 'platform', { value: originalPlatform, writable: true });
    });

    it('should return false when TERM is "dumb"', () => {
      delete process.env.FORCE_COLOR;
      process.env.TERM = 'dumb';
      process.stdout.isTTY = true;
      const originalPlatform = process.platform;
      Object.defineProperty(process, 'platform', { value: 'linux', writable: true });
      expect(supportsColor()).toBe(false);
      Object.defineProperty(process, 'platform', { value: originalPlatform, writable: true });
    });

    it('should return true for xterm terminals', () => {
      delete process.env.FORCE_COLOR;
      process.env.TERM = 'xterm-256color';
      process.stdout.isTTY = true;
      const originalPlatform = process.platform;
      Object.defineProperty(process, 'platform', { value: 'linux', writable: true });
      expect(supportsColor()).toBe(true);
      Object.defineProperty(process, 'platform', { value: originalPlatform, writable: true });
    });
  });

  describe('enterRawMode', () => {
    it('should not enter raw mode when not a TTY', () => {
      process.stdin.isTTY = false;
      process.stdin.setRawMode = vi.fn() as typeof process.stdin.setRawMode;
      process.stdin.resume = vi.fn() as typeof process.stdin.resume;
      process.stdin.setEncoding = vi.fn() as typeof process.stdin.setEncoding;

      enterRawMode();

      expect(process.stdin.setRawMode).not.toHaveBeenCalled();
    });

    it('should enter raw mode when TTY is available', () => {
      process.stdin.isTTY = true;
      process.stdin.setRawMode = vi.fn() as typeof process.stdin.setRawMode;
      process.stdin.resume = vi.fn() as typeof process.stdin.resume;
      process.stdin.setEncoding = vi.fn() as typeof process.stdin.setEncoding;

      enterRawMode();

      expect(process.stdin.setRawMode).toHaveBeenCalledWith(true);
      expect(process.stdin.resume).toHaveBeenCalled();
      expect(process.stdin.setEncoding).toHaveBeenCalledWith('utf8');
    });
  });

  describe('exitRawMode', () => {
    it('should not exit raw mode when not a TTY', () => {
      process.stdin.isTTY = false;
      process.stdin.setRawMode = vi.fn() as typeof process.stdin.setRawMode;
      process.stdin.pause = vi.fn() as typeof process.stdin.pause;

      exitRawMode();

      expect(process.stdin.setRawMode).not.toHaveBeenCalled();
    });

    it('should exit raw mode when TTY is available', () => {
      process.stdin.isTTY = true;
      process.stdin.setRawMode = vi.fn() as typeof process.stdin.setRawMode;
      process.stdin.pause = vi.fn() as typeof process.stdin.pause;

      exitRawMode();

      expect(process.stdin.setRawMode).toHaveBeenCalledWith(false);
      expect(process.stdin.pause).toHaveBeenCalled();
    });
  });

  describe('onTerminalResize', () => {
    it('should return no-op cleanup when not a TTY', () => {
      process.stdout.isTTY = false;
      const cleanup = onTerminalResize(() => {});
      expect(typeof cleanup).toBe('function');
      cleanup(); // Should not throw
    });

    it('should register resize listener when TTY is available', () => {
      process.stdout.isTTY = true;
      const mockOn = vi.fn();
      const mockRemoveListener = vi.fn();
      process.stdout.on = mockOn as typeof process.stdout.on;
      process.stdout.removeListener = mockRemoveListener as typeof process.stdout.removeListener;

      const callback = vi.fn();
      const cleanup = onTerminalResize(callback);

      expect(mockOn).toHaveBeenCalledWith('resize', callback);
      expect(typeof cleanup).toBe('function');

      cleanup();

      expect(mockRemoveListener).toHaveBeenCalledWith('resize', callback);
    });
  });
});
