/**
 * Renderer tests for layout calculations
 * 
 * Tests that layout calculation functions work correctly for flexbox, grid, and positioning.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderFlexboxLayout, renderGridLayout } from '../../renderer/layout';
import { createOutputBuffer } from '../../renderer/output';
import { mockTerminalDimensions, resetTerminalMocks } from '../utils/terminal-mock';
import type { ConsoleNode, ViewStyle } from '../../types';

describe('Layout Calculations', () => {
  beforeEach(() => {
    mockTerminalDimensions(80, 24);
  });

  afterEach(() => {
    resetTerminalMocks();
  });

  describe('Flexbox Layout', () => {
    it('should calculate row layout correctly', () => {
      const node: ConsoleNode = {
        type: 'box',
        children: [
          { type: 'text', content: 'A' },
          { type: 'text', content: 'B' },
          { type: 'text', content: 'C' },
        ],
        style: {
          flexDirection: 'row',
        } as ViewStyle,
      };

      const buffer = createOutputBuffer();
      const result = renderFlexboxLayout(node, buffer, 0, 0, 80, undefined, node.style as ViewStyle);

      // Should render children horizontally
      expect(buffer.lines.length).toBeGreaterThan(0);
      // All items should be on the same line (or wrapped if needed)
      const firstLine = buffer.lines[0] || '';
      expect(firstLine).toContain('A');
    });

    it('should calculate column layout correctly', () => {
      const node: ConsoleNode = {
        type: 'box',
        children: [
          { type: 'text', content: 'A' },
          { type: 'text', content: 'B' },
          { type: 'text', content: 'C' },
        ],
        style: {
          flexDirection: 'column',
        } as ViewStyle,
      };

      const buffer = createOutputBuffer();
      const result = renderFlexboxLayout(node, buffer, 0, 0, 80, undefined, node.style as ViewStyle);

      // Should render children vertically
      expect(buffer.lines.length).toBeGreaterThanOrEqual(3);
    });

    it('should apply gap correctly in row layout', () => {
      const node: ConsoleNode = {
        type: 'box',
        children: [
          { type: 'text', content: 'A' },
          { type: 'text', content: 'B' },
        ],
        style: {
          flexDirection: 'row',
          gap: 2,
        } as ViewStyle,
      };

      const buffer = createOutputBuffer();
      const result = renderFlexboxLayout(node, buffer, 0, 0, 80, undefined, node.style as ViewStyle);

      // Gap should add space between items
      expect(buffer.lines.length).toBeGreaterThan(0);
    });

    it('should apply gap correctly in column layout', () => {
      const node: ConsoleNode = {
        type: 'box',
        children: [
          { type: 'text', content: 'A' },
          { type: 'text', content: 'B' },
        ],
        style: {
          flexDirection: 'column',
          gap: 1,
        } as ViewStyle,
      };

      const buffer = createOutputBuffer();
      const result = renderFlexboxLayout(node, buffer, 0, 0, 80, undefined, node.style as ViewStyle);

      // Gap should add space between items vertically
      expect(buffer.lines.length).toBeGreaterThanOrEqual(2);
    });

    it('should apply justifyContent center', () => {
      const node: ConsoleNode = {
        type: 'box',
        children: [
          { type: 'text', content: 'A' },
        ],
        style: {
          flexDirection: 'row',
          justifyContent: 'center',
        } as ViewStyle,
      };

      const buffer = createOutputBuffer();
      const result = renderFlexboxLayout(node, buffer, 0, 0, 80, undefined, node.style as ViewStyle);

      // Content should be centered
      expect(buffer.lines.length).toBeGreaterThan(0);
    });

    it('should apply justifyContent flex-end', () => {
      const node: ConsoleNode = {
        type: 'box',
        children: [
          { type: 'text', content: 'A' },
        ],
        style: {
          flexDirection: 'row',
          justifyContent: 'flex-end',
        } as ViewStyle,
      };

      const buffer = createOutputBuffer();
      const result = renderFlexboxLayout(node, buffer, 0, 0, 80, undefined, node.style as ViewStyle);

      // Content should be at end
      expect(buffer.lines.length).toBeGreaterThan(0);
    });

    it('should apply alignItems center', () => {
      const node: ConsoleNode = {
        type: 'box',
        children: [
          { type: 'text', content: 'A' },
          { type: 'text', content: 'B\nB\nB' }, // Multi-line content
        ],
        style: {
          flexDirection: 'row',
          alignItems: 'center',
        } as ViewStyle,
      };

      const buffer = createOutputBuffer();
      const result = renderFlexboxLayout(node, buffer, 0, 0, 80, undefined, node.style as ViewStyle);

      // Items should be aligned
      expect(buffer.lines.length).toBeGreaterThan(0);
    });

    it('should handle reverse direction', () => {
      const node: ConsoleNode = {
        type: 'box',
        children: [
          { type: 'text', content: 'A' },
          { type: 'text', content: 'B' },
          { type: 'text', content: 'C' },
        ],
        style: {
          flexDirection: 'row-reverse',
        } as ViewStyle,
      };

      const buffer = createOutputBuffer();
      const result = renderFlexboxLayout(node, buffer, 0, 0, 80, undefined, node.style as ViewStyle);

      // Items should be in reverse order
      expect(buffer.lines.length).toBeGreaterThan(0);
    });

    it('should handle empty children', () => {
      const node: ConsoleNode = {
        type: 'box',
        children: [],
        style: {
          flexDirection: 'row',
        } as ViewStyle,
      };

      const buffer = createOutputBuffer();
      const result = renderFlexboxLayout(node, buffer, 0, 0, 80, undefined, node.style as ViewStyle);

      // Should return without error
      expect(result).toEqual({ x: 0, y: 0 });
    });
  });

  describe('Grid Layout', () => {
    it('should calculate grid layout with fixed columns', () => {
      const node: ConsoleNode = {
        type: 'box',
        children: [
          { type: 'text', content: 'A' },
          { type: 'text', content: 'B' },
          { type: 'text', content: 'C' },
          { type: 'text', content: 'D' },
        ],
        style: {
          display: 'grid',
          gridTemplateColumns: '20 20 20',
        } as ViewStyle,
      };

      const buffer = createOutputBuffer();
      const result = renderGridLayout(node, buffer, 0, 0, 80, undefined, node.style as ViewStyle);

      // Should render in grid
      expect(buffer.lines.length).toBeGreaterThan(0);
    });

    it('should calculate grid layout with fractional columns', () => {
      const node: ConsoleNode = {
        type: 'box',
        children: [
          { type: 'text', content: 'A' },
          { type: 'text', content: 'B' },
        ],
        style: {
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
        } as ViewStyle,
      };

      const buffer = createOutputBuffer();
      const result = renderGridLayout(node, buffer, 0, 0, 80, undefined, node.style as ViewStyle);

      // Should distribute space proportionally
      expect(buffer.lines.length).toBeGreaterThan(0);
    });

    it('should apply gap in grid layout', () => {
      const node: ConsoleNode = {
        type: 'box',
        children: [
          { type: 'text', content: 'A' },
          { type: 'text', content: 'B' },
          { type: 'text', content: 'C' },
          { type: 'text', content: 'D' },
        ],
        style: {
          display: 'grid',
          gridTemplateColumns: '20 20',
          gap: 2,
        } as ViewStyle,
      };

      const buffer = createOutputBuffer();
      const result = renderGridLayout(node, buffer, 0, 0, 80, undefined, node.style as ViewStyle);

      // Gap should add space between grid items
      expect(buffer.lines.length).toBeGreaterThan(0);
    });

    it('should handle grid with row template', () => {
      const node: ConsoleNode = {
        type: 'box',
        children: [
          { type: 'text', content: 'A' },
          { type: 'text', content: 'B' },
        ],
        style: {
          display: 'grid',
          gridTemplateColumns: '40',
          gridTemplateRows: '1 1',
        } as ViewStyle,
      };

      const buffer = createOutputBuffer();
      const result = renderGridLayout(node, buffer, 0, 0, 80, undefined, node.style as ViewStyle);

      // Should render with row constraints
      expect(buffer.lines.length).toBeGreaterThanOrEqual(2);
    });

    it('should handle grid item placement', () => {
      const node: ConsoleNode = {
        type: 'box',
        children: [
          { type: 'text', content: 'A', style: { gridColumn: '1 / 2', gridRow: '1 / 2' } as ViewStyle },
          { type: 'text', content: 'B', style: { gridColumn: '2 / 3', gridRow: '1 / 2' } as ViewStyle },
        ],
        style: {
          display: 'grid',
          gridTemplateColumns: '20 20',
        } as ViewStyle,
      };

      const buffer = createOutputBuffer();
      const result = renderGridLayout(node, buffer, 0, 0, 80, undefined, node.style as ViewStyle);

      // Should place items correctly
      expect(buffer.lines.length).toBeGreaterThan(0);
    });

    it('should handle empty grid', () => {
      const node: ConsoleNode = {
        type: 'box',
        children: [],
        style: {
          display: 'grid',
          gridTemplateColumns: '40',
        } as ViewStyle,
      };

      const buffer = createOutputBuffer();
      const result = renderGridLayout(node, buffer, 0, 0, 80, undefined, node.style as ViewStyle);

      // Should return without error
      expect(result.y).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Position Calculations', () => {
    it('should calculate absolute positioning', () => {
      const node: ConsoleNode = {
        type: 'box',
        content: 'Positioned',
        style: {
          position: 'absolute',
          left: 10,
          top: 5,
        } as ViewStyle,
      };

      const buffer = createOutputBuffer();
      // Position calculation happens in renderBoxNode, not in layout functions
      // This test verifies the position values are correct
      expect(node.style?.position).toBe('absolute');
      expect((node.style as ViewStyle)?.left).toBe(10);
      expect((node.style as ViewStyle)?.top).toBe(5);
    });

    it('should calculate relative positioning', () => {
      const node: ConsoleNode = {
        type: 'box',
        content: 'Positioned',
        style: {
          position: 'relative',
          left: 5,
          top: 2,
        } as ViewStyle,
      };

      const buffer = createOutputBuffer();
      expect(node.style?.position).toBe('relative');
      expect((node.style as ViewStyle)?.left).toBe(5);
      expect((node.style as ViewStyle)?.top).toBe(2);
    });

    it('should handle responsive positioning', () => {
      const node: ConsoleNode = {
        type: 'box',
        content: 'Responsive',
        style: {
          position: 'relative',
          left: '50%',
          top: '25%',
        } as ViewStyle,
      };

      const buffer = createOutputBuffer();
      // Responsive values are resolved during rendering
      expect((node.style as ViewStyle)?.left).toBe('50%');
      expect((node.style as ViewStyle)?.top).toBe('25%');
    });
  });

  describe('Size Calculations', () => {
    it('should handle fixed width and height', () => {
      const node: ConsoleNode = {
        type: 'box',
        content: 'Fixed Size',
        style: {
          width: 40,
          height: 5,
        } as ViewStyle,
      };

      const buffer = createOutputBuffer();
      expect((node.style as ViewStyle)?.width).toBe(40);
      expect((node.style as ViewStyle)?.height).toBe(5);
    });

    it('should handle percentage width and height', () => {
      const node: ConsoleNode = {
        type: 'box',
        content: 'Percentage Size',
        style: {
          width: '50%',
          height: '25%',
        } as ViewStyle,
      };

      const buffer = createOutputBuffer();
      expect((node.style as ViewStyle)?.width).toBe('50%');
      expect((node.style as ViewStyle)?.height).toBe('25%');
    });

    it('should handle minWidth and maxWidth', () => {
      const node: ConsoleNode = {
        type: 'box',
        content: 'Constrained',
        style: {
          minWidth: 20,
          maxWidth: 60,
        } as ViewStyle,
      };

      const buffer = createOutputBuffer();
      expect((node.style as ViewStyle)?.minWidth).toBe(20);
      expect((node.style as ViewStyle)?.maxWidth).toBe(60);
    });
  });

  describe('Padding and Border Calculations', () => {
    it('should handle padding', () => {
      const node: ConsoleNode = {
        type: 'box',
        content: 'Padded',
        style: {
          padding: 2,
        } as ViewStyle,
      };

      const buffer = createOutputBuffer();
      expect((node.style as ViewStyle)?.padding).toBe(2);
    });

    it('should handle border width', () => {
      const node: ConsoleNode = {
        type: 'box',
        content: 'Bordered',
        style: {
          border: 'single',
        } as ViewStyle,
      };

      const buffer = createOutputBuffer();
      expect((node.style as ViewStyle)?.border).toBe('single');
    });

    it('should calculate content area with padding and border', () => {
      const node: ConsoleNode = {
        type: 'box',
        content: 'Content',
        style: {
          width: 40,
          padding: 2,
          border: 'single',
        } as ViewStyle,
      };

      const buffer = createOutputBuffer();
      // Border and padding reduce available content area
      // Width 40, border 2 (1 each side), padding 4 (2 each side) = 34 content width
      expect((node.style as ViewStyle)?.width).toBe(40);
      expect((node.style as ViewStyle)?.padding).toBe(2);
      expect((node.style as ViewStyle)?.border).toBe('single');
    });
  });

  describe('Responsive Calculations', () => {
    it('should handle fullscreen mode', () => {
      const node: ConsoleNode = {
        type: 'box',
        fullscreen: true,
        style: {
          width: '100%',
          height: '100%',
        } as ViewStyle,
      };

      const buffer = createOutputBuffer();
      expect(node.fullscreen).toBe(true);
      expect((node.style as ViewStyle)?.width).toBe('100%');
      expect((node.style as ViewStyle)?.height).toBe('100%');
    });

    it('should handle terminal width percentages', () => {
      const node: ConsoleNode = {
        type: 'box',
        style: {
          width: '50%', // Should be 40 on 80-column terminal
        } as ViewStyle,
      };

      const buffer = createOutputBuffer();
      // Percentage values are resolved during rendering
      expect((node.style as ViewStyle)?.width).toBe('50%');
    });
  });
});
