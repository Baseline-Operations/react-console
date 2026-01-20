/**
 * Renderer tests for border rendering
 * 
 * Tests that border rendering functions work correctly.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getBorderInfo, getBorderChars, renderBorderLine, renderBorderChar } from '../../renderer/layout/borders';
import { createOutputBuffer } from '../../renderer/output';
import { mockTerminalDimensions, resetTerminalMocks } from '../utils/terminal-mock';
import type { ConsoleNode, ViewStyle } from '../../types';

describe('Border Rendering', () => {
  beforeEach(() => {
    mockTerminalDimensions(80, 24);
  });

  afterEach(() => {
    resetTerminalMocks();
  });

  describe('getBorderInfo', () => {
    it('should return no borders when border is not specified', () => {
      const style: ViewStyle = {};
      const info = getBorderInfo({ type: 'box' } as ConsoleNode, style);

      expect(info.show.top).toBe(false);
      expect(info.show.right).toBe(false);
      expect(info.show.bottom).toBe(false);
      expect(info.show.left).toBe(false);
      expect(info.width.top).toBe(0);
    });

    it('should show all borders when border is true', () => {
      const style: ViewStyle = { border: true };
      const info = getBorderInfo({ type: 'box' } as ConsoleNode, style);

      expect(info.show.top).toBe(true);
      expect(info.show.right).toBe(true);
      expect(info.show.bottom).toBe(true);
      expect(info.show.left).toBe(true);
      expect(info.width.top).toBe(1); // Default width
    });

    it('should show specific borders when border is object', () => {
      const style: ViewStyle = {
        border: {
          top: true,
          bottom: true,
        },
      };
      const info = getBorderInfo({ type: 'box' } as ConsoleNode, style);

      expect(info.show.top).toBe(true);
      expect(info.show.right).toBe(false);
      expect(info.show.bottom).toBe(true);
      expect(info.show.left).toBe(false);
    });

    it('should respect borderWidth when specified', () => {
      const style: ViewStyle = {
        border: true,
        borderWidth: 2,
      };
      const info = getBorderInfo({ type: 'box' } as ConsoleNode, style);

      expect(info.width.top).toBe(2);
      expect(info.width.right).toBe(2);
      expect(info.width.bottom).toBe(2);
      expect(info.width.left).toBe(2);
    });

    it('should respect per-side borderWidth', () => {
      const style: ViewStyle = {
        border: true,
        borderWidth: {
          top: 1,
          right: 2,
          bottom: 1,
          left: 2,
        },
      };
      const info = getBorderInfo({ type: 'box' } as ConsoleNode, style);

      expect(info.width.top).toBe(1);
      expect(info.width.right).toBe(2);
      expect(info.width.bottom).toBe(1);
      expect(info.width.left).toBe(2);
    });

    it('should use default border style when not specified', () => {
      const style: ViewStyle = { border: true };
      const info = getBorderInfo({ type: 'box' } as ConsoleNode, style);

      expect(info.style).toBe('single');
    });

    it('should respect borderStyle', () => {
      const style: ViewStyle = {
        border: true,
        borderStyle: 'double',
      };
      const info = getBorderInfo({ type: 'box' } as ConsoleNode, style);

      expect(info.style).toBe('double');
    });

    it('should include borderColor when specified', () => {
      const style: ViewStyle = {
        border: true,
        borderColor: 'red',
      };
      const info = getBorderInfo({ type: 'box' } as ConsoleNode, style);

      expect(info.color).toBe('red');
    });
  });

  describe('getBorderChars', () => {
    it('should return single border characters by default', () => {
      const chars = getBorderChars();

      expect(chars.horizontal).toBe('─');
      expect(chars.vertical).toBe('│');
      expect(chars.topLeft).toBe('┌');
      expect(chars.topRight).toBe('┐');
      expect(chars.bottomLeft).toBe('└');
      expect(chars.bottomRight).toBe('┛');
    });

    it('should return single border characters for single style', () => {
      const chars = getBorderChars('single');

      expect(chars.horizontal).toBe('─');
      expect(chars.vertical).toBe('│');
      expect(chars.topLeft).toBe('┌');
      expect(chars.topRight).toBe('┐');
    });

    it('should return double border characters for double style', () => {
      const chars = getBorderChars('double');

      expect(chars.horizontal).toBe('═');
      expect(chars.vertical).toBe('║');
      expect(chars.topLeft).toBe('╔');
      expect(chars.topRight).toBe('╗');
      expect(chars.bottomLeft).toBe('╚');
      expect(chars.bottomRight).toBe('╝');
    });

    it('should return thick border characters for thick style', () => {
      const chars = getBorderChars('thick');

      expect(chars.horizontal).toBe('━');
      expect(chars.vertical).toBe('┃');
      expect(chars.topLeft).toBe('┏');
      expect(chars.topRight).toBe('┓');
    });

    it('should return dashed border characters for dashed style', () => {
      const chars = getBorderChars('dashed');

      expect(chars.horizontal).toBe('┄');
      expect(chars.vertical).toBe('┊');
      expect(chars.topLeft).toBe('┌');
      expect(chars.topRight).toBe('┐');
    });

    it('should return dotted border characters for dotted style', () => {
      const chars = getBorderChars('dotted');

      expect(chars.horizontal).toBe('┈');
      expect(chars.vertical).toBe('┊');
      expect(chars.topLeft).toBe('┌');
      expect(chars.topRight).toBe('┐');
    });
  });

  describe('renderBorderLine', () => {
    it('should render top border line', () => {
      const buffer = createOutputBuffer();
      const style: ViewStyle = { border: true };
      
      renderBorderLine(buffer, 0, 0, 10, 'top', style);

      expect(buffer.lines.length).toBeGreaterThan(0);
      const line = buffer.lines[0] || '';
      expect(line).toContain('┌');
      expect(line).toContain('┐');
      expect(line).toContain('─');
    });

    it('should render bottom border line', () => {
      const buffer = createOutputBuffer();
      const style: ViewStyle = { border: true };
      
      renderBorderLine(buffer, 0, 0, 10, 'bottom', style);

      expect(buffer.lines.length).toBeGreaterThan(0);
      const line = buffer.lines[0] || '';
      expect(line).toContain('└');
      expect(line).toContain('┛');
      expect(line).toContain('─');
    });

    it('should render double border line', () => {
      const buffer = createOutputBuffer();
      const style: ViewStyle = {
        border: true,
        borderStyle: 'double',
      };
      
      renderBorderLine(buffer, 0, 0, 10, 'top', style);

      expect(buffer.lines.length).toBeGreaterThan(0);
      const line = buffer.lines[0] || '';
      expect(line).toContain('╔');
      expect(line).toContain('╗');
      expect(line).toContain('═');
    });

    it('should apply border color when specified', () => {
      const buffer = createOutputBuffer();
      const style: ViewStyle = {
        border: true,
        borderColor: 'red',
      };
      
      renderBorderLine(buffer, 0, 0, 10, 'top', style);

      expect(buffer.lines.length).toBeGreaterThan(0);
      const line = buffer.lines[0] || '';
      // Should contain ANSI color codes
      expect(line).toMatch(/\x1b\[/);
    });

    it('should handle zero width', () => {
      const buffer = createOutputBuffer();
      const style: ViewStyle = { border: true };
      
      renderBorderLine(buffer, 0, 0, 0, 'top', style);

      // Should still render corners even with zero width
      expect(buffer.lines.length).toBeGreaterThan(0);
    });
  });

  describe('renderBorderChar', () => {
    it('should render left border character at position', () => {
      const buffer = createOutputBuffer();
      const style: ViewStyle = { border: true };
      
      renderBorderChar(buffer, 5, 3, 'left', style);

      expect(buffer.lines.length).toBeGreaterThan(3);
      const line = buffer.lines[3] || '';
      // Should contain vertical border character
      expect(line).toContain('│');
      // Character should be at or after position 5 (padded)
      expect(line.length).toBeGreaterThanOrEqual(6); // At least position 5 + 1 char
    });

    it('should render right border character at position', () => {
      const buffer = createOutputBuffer();
      const style: ViewStyle = { border: true };
      
      renderBorderChar(buffer, 10, 3, 'right', style);

      expect(buffer.lines.length).toBeGreaterThan(3);
      const line = buffer.lines[3] || '';
      // Should contain vertical border character
      expect(line).toContain('│');
    });

    it('should apply border color when specified', () => {
      const buffer = createOutputBuffer();
      const style: ViewStyle = {
        border: true,
        borderColor: 'cyan',
      };
      
      renderBorderChar(buffer, 5, 3, 'left', style);

      expect(buffer.lines.length).toBeGreaterThan(3);
      const line = buffer.lines[3] || '';
      // Should contain ANSI color codes
      expect(line).toMatch(/\x1b\[/);
    });

    it('should use correct border style characters', () => {
      const buffer = createOutputBuffer();
      const style: ViewStyle = {
        border: true,
        borderStyle: 'double',
      };
      
      renderBorderChar(buffer, 5, 3, 'left', style);

      expect(buffer.lines.length).toBeGreaterThan(3);
      const line = buffer.lines[3] || '';
      // Should contain double border character (may be wrapped in ANSI codes)
      const lineWithoutAnsi = line.replace(/\x1b\[[0-9;]*m/g, '');
      expect(lineWithoutAnsi).toContain('║');
    });
  });
});
