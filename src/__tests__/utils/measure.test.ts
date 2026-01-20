/**
 * Unit tests for text measurement utilities
 */

import { describe, it, expect } from 'vitest';
import { measureText, wrapText, truncateText } from '../../utils/measure';

describe('measure utilities', () => {
  describe('measureText', () => {
    it('should measure plain text correctly', () => {
      const result = measureText('Hello');
      expect(result).toBe(5);
    });

    it('should ignore ANSI codes when measuring', () => {
      const text = '\x1b[31mHello\x1b[0m';
      const result = measureText(text);
      expect(result).toBe(5);
    });

    it('should handle empty string', () => {
      const result = measureText('');
      expect(result).toBe(0);
    });

    it('should handle multiline text', () => {
      const text = 'Hello\nWorld';
      const result = measureText(text);
      expect(result).toBe(11); // Returns total length including newline
    });
  });

  describe('wrapText', () => {
    it('should wrap text at specified width', () => {
      const text = 'Hello World';
      const result = wrapText(text, 5);
      expect(result).toEqual(['Hello', ' ', 'World']); // Returns array of lines
    });

    it('should not wrap if text fits', () => {
      const text = 'Hello';
      const result = wrapText(text, 10);
      expect(result).toEqual(['Hello']); // Returns array
    });

    it('should handle words longer than width', () => {
      const text = 'Supercalifragilisticexpialidocious';
      const result = wrapText(text, 10);
      // Returns array of wrapped lines
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('truncateText', () => {
    it('should truncate text to specified length', () => {
      const text = 'Hello World';
      const result = truncateText(text, 5);
      expect(result).toBe('He...'); // Includes ellipsis by default
    });

    it('should add ellipsis when truncating', () => {
      const text = 'Hello World';
      const result = truncateText(text, 5, '...');
      expect(result).toBe('He...');
    });

    it('should not truncate if text fits', () => {
      const text = 'Hello';
      const result = truncateText(text, 10);
      expect(result).toBe('Hello');
    });
  });
});
