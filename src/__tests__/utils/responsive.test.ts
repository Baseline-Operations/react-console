/**
 * Unit tests for responsive sizing utilities
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { resolveSize, resolveWidth, resolveHeight } from '../../utils/responsive';
import { mockTerminalDimensions, resetTerminalMocks } from '../utils/terminal-mock';

describe('responsive utilities', () => {
  beforeEach(() => {
    resetTerminalMocks();
  });

  describe('resolveSize', () => {
    it('should return number as-is', () => {
      const result = resolveSize(50, 'width');
      expect(result).toBe(50);
    });

    it('should resolve percentage', () => {
      mockTerminalDimensions(100, 50);
      const result = resolveSize('50%', 'width', 100);
      expect(result).toBe(50);
    });

    it('should resolve viewport units', () => {
      mockTerminalDimensions(100, 50);
      const result = resolveSize('50vw', 'width', 100);
      expect(result).toBe(50);
    });

    it('should handle undefined', () => {
      const result = resolveSize(undefined, 'width');
      expect(result).toBeUndefined();
    });
  });

  describe('resolveWidth', () => {
    it('should resolve width correctly', () => {
      mockTerminalDimensions(100, 50);
      const result = resolveWidth('50%', 100);
      expect(result).toBe(50);
    });
  });

  describe('resolveHeight', () => {
    it('should resolve height correctly', () => {
      mockTerminalDimensions(100, 50);
      const result = resolveHeight('50%', 50);
      expect(result).toBe(25);
    });
  });
});
