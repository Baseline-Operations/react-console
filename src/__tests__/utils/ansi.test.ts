/**
 * Unit tests for ANSI utilities
 */

import { describe, it, expect } from 'vitest';
import { applyStyles, stripAnsiCodes, getVisibleLength } from '../../renderer/ansi';

describe('ansi utilities', () => {
  describe('applyStyles', () => {
    it('should apply foreground color', () => {
      const result = applyStyles('Hello', { color: 'red' });
      expect(result).toContain('\x1b[31m');
      expect(result).toContain('Hello');
    });

    it('should apply background color', () => {
      const result = applyStyles('Hello', { backgroundColor: 'blue' });
      expect(result).toContain('\x1b[44m');
    });

    it('should apply text styles', () => {
      const result = applyStyles('Hello', { bold: true, underline: true });
      expect(result).toContain('\x1b[1m'); // bold
      expect(result).toContain('\x1b[4m'); // underline
    });

    it('should reset styles at the end', () => {
      const result = applyStyles('Hello', { color: 'red' });
      expect(result).toContain('\x1b[0m');
    });
  });

  describe('stripAnsiCodes', () => {
    it('should remove ANSI codes from text', () => {
      const text = '\x1b[31mHello\x1b[0m';
      const result = stripAnsiCodes(text);
      expect(result).toBe('Hello');
    });

    it('should handle multiple ANSI codes', () => {
      const text = '\x1b[31m\x1b[1mHello\x1b[0m';
      const result = stripAnsiCodes(text);
      expect(result).toBe('Hello');
    });

    it('should return plain text unchanged', () => {
      const text = 'Hello';
      const result = stripAnsiCodes(text);
      expect(result).toBe('Hello');
    });
  });

  describe('getVisibleLength', () => {
    it('should return length without ANSI codes', () => {
      const text = '\x1b[31mHello\x1b[0m';
      const result = getVisibleLength(text);
      expect(result).toBe(5);
    });

    it('should handle plain text', () => {
      const text = 'Hello';
      const result = getVisibleLength(text);
      expect(result).toBe(5);
    });
  });
});
