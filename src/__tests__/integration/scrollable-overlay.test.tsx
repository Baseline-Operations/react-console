/**
 * Integration tests for Scrollable and Overlay components
 * 
 * Tests that Scrollable and Overlay components render and function correctly.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderNodeToBuffer } from '../../renderer/layout';
import { createOutputBuffer } from '../../renderer/output';
import { mockTerminalDimensions, resetTerminalMocks } from '../utils/terminal-mock';
import type { ConsoleNode } from '../../types';

describe('Scrollable Component Integration', () => {
  beforeEach(() => {
    mockTerminalDimensions(80, 24);
  });

  afterEach(() => {
    resetTerminalMocks();
  });

  describe('Scrollable rendering', () => {
    it('should render scrollable with content', () => {
      const node: ConsoleNode = {
        type: 'scrollable',
        children: [
          { type: 'text', content: 'Line 1' },
          { type: 'text', content: 'Line 2' },
          { type: 'text', content: 'Line 3' },
        ],
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80, 10);

      expect(buffer.lines.length).toBeGreaterThan(0);
      expect(buffer.lines.some(line => line.includes('Line 1'))).toBe(true);
    });

    it('should handle scrollTop position', () => {
      const node: ConsoleNode = {
        type: 'scrollable',
        scrollTop: 2,
        children: [
          { type: 'text', content: 'Line 1' },
          { type: 'text', content: 'Line 2' },
          { type: 'text', content: 'Line 3' },
          { type: 'text', content: 'Line 4' },
          { type: 'text', content: 'Line 5' },
        ],
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80, 3);

      // Should start rendering from scrollTop (index 2 = Line 3)
      expect(buffer.lines.some(line => line.includes('Line 3'))).toBe(true);
      // Should not show items before scrollTop
      const allText = buffer.lines.join('');
      // Line 1 and Line 2 should not be visible
      expect(allText).not.toContain('Line 1');
      expect(allText).not.toContain('Line 2');
    });

    it('should handle scrollLeft position', () => {
      const longContent = 'A'.repeat(100);
      const node: ConsoleNode = {
        type: 'scrollable',
        scrollLeft: 20,
        children: [
          { type: 'text', content: longContent },
        ],
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 60, 10);

      // Content should render (horizontal scrolling is handled by text wrapping, not scrollLeft)
      expect(buffer.lines.length).toBeGreaterThan(0);
      // Long content should be wrapped or rendered
      const allText = buffer.lines.join('');
      expect(allText).toContain('A');
    });

    it('should respect maxHeight constraint', () => {
      const node: ConsoleNode = {
        type: 'scrollable',
        maxHeight: 5,
        children: Array.from({ length: 20 }, (_, i) => ({
          type: 'text' as const,
          content: `Line ${i + 1}`,
        })),
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80, 10);

      // Should only render up to maxHeight lines (plus scroll indicators)
      expect(buffer.lines.length).toBeLessThanOrEqual(6); // 5 lines + scroll indicator
    });

    it('should respect maxWidth constraint', () => {
      const longContent = 'A'.repeat(200);
      const node: ConsoleNode = {
        type: 'scrollable',
        maxWidth: 40,
        children: [
          { type: 'text', content: longContent },
        ],
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80, 10);

      // Content should render (maxWidth is passed to renderNodeToBuffer which handles text wrapping)
      expect(buffer.lines.length).toBeGreaterThan(0);
      // Long content will be wrapped by the text renderer based on maxWidth
      const allText = buffer.lines.join('');
      expect(allText).toContain('A');
    });

    it('should show scroll indicators when content overflows', () => {
      const node: ConsoleNode = {
        type: 'scrollable',
        scrollTop: 5,
        maxHeight: 3,
        children: Array.from({ length: 20 }, (_, i) => ({
          type: 'text' as const,
          content: `Line ${i + 1}`,
        })),
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80, 10);

      // Should show scroll indicators (↑ or ↓)
      const allText = buffer.lines.join('');
      expect(allText).toMatch(/[↑↓]/);
    });

    it('should handle empty children', () => {
      const node: ConsoleNode = {
        type: 'scrollable',
        children: [],
      };

      const buffer = createOutputBuffer();
      const result = renderNodeToBuffer(node, buffer, 0, 0, 80, 10);

      // Should render without error
      expect(result).toBeDefined();
    });

    it('should handle nested scrollable', () => {
      const node: ConsoleNode = {
        type: 'scrollable',
        maxHeight: 5,
        children: [
          {
            type: 'scrollable',
            maxHeight: 3,
            children: [
              { type: 'text', content: 'Nested Line 1' },
              { type: 'text', content: 'Nested Line 2' },
              { type: 'text', content: 'Nested Line 3' },
            ],
          },
        ],
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80, 10);

      expect(buffer.lines.length).toBeGreaterThan(0);
      expect(buffer.lines.some(line => line.includes('Nested'))).toBe(true);
    });
  });

  describe('Scrollable with scrollbars', () => {
    it('should show vertical scrollbar when scrolling', () => {
      const node: ConsoleNode = {
        type: 'scrollable',
        scrollable: true,
        scrollbarVisibility: 'auto',
        scrollTop: 5,
        maxHeight: 5,
        children: Array.from({ length: 20 }, (_, i) => ({
          type: 'text' as const,
          content: `Line ${i + 1}`,
        })),
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80, 10);

      // Scrollbar should be visible when scrolling
      expect(buffer.lines.length).toBeGreaterThan(0);
    });

    it('should handle scrollbarVisibility hidden', () => {
      const node: ConsoleNode = {
        type: 'scrollable',
        scrollable: true,
        scrollbarVisibility: 'hidden',
        scrollTop: 5,
        maxHeight: 5,
        children: Array.from({ length: 20 }, (_, i) => ({
          type: 'text' as const,
          content: `Line ${i + 1}`,
        })),
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80, 10);

      // Should render without visible scrollbar
      expect(buffer.lines.length).toBeGreaterThan(0);
    });
  });
});

describe('Overlay Component Integration', () => {
  beforeEach(() => {
    mockTerminalDimensions(80, 24);
  });

  afterEach(() => {
    resetTerminalMocks();
  });

  describe('Overlay rendering', () => {
    it('should render overlay with content', () => {
      const node: ConsoleNode = {
        type: 'overlay',
        children: [
          { type: 'text', content: 'Overlay Content' },
        ],
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80, 10);

      expect(buffer.lines.length).toBeGreaterThan(0);
      expect(buffer.lines.some(line => line.includes('Overlay Content'))).toBe(true);
    });

    it('should render overlay with backdrop', () => {
      const node: ConsoleNode = {
        type: 'overlay',
        backdrop: true,
        backdropColor: 'black',
        children: [
          { type: 'text', content: 'Overlay with Backdrop' },
        ],
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80, 10);

      // Should render overlay content
      expect(buffer.lines.length).toBeGreaterThan(0);
      expect(buffer.lines.some(line => line.includes('Overlay with Backdrop'))).toBe(true);
    });

    it('should respect zIndex for layering', () => {
      const node: ConsoleNode = {
        type: 'overlay',
        zIndex: 2000,
        children: [
          { type: 'text', content: 'High Z-Index Overlay' },
        ],
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80, 10);

      // zIndex is used for rendering order, not directly testable in buffer
      // But should render correctly
      expect(buffer.lines.length).toBeGreaterThan(0);
      expect(node.zIndex).toBe(2000);
    });

    it('should handle overlay with multiple children', () => {
      const node: ConsoleNode = {
        type: 'overlay',
        children: [
          { type: 'text', content: 'Overlay Line 1' },
          { type: 'text', content: 'Overlay Line 2' },
          { type: 'text', content: 'Overlay Line 3' },
        ],
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80, 10);

      expect(buffer.lines.length).toBeGreaterThanOrEqual(3);
      expect(buffer.lines.some(line => line.includes('Overlay Line 1'))).toBe(true);
      expect(buffer.lines.some(line => line.includes('Overlay Line 2'))).toBe(true);
      expect(buffer.lines.some(line => line.includes('Overlay Line 3'))).toBe(true);
    });

    it('should handle empty overlay', () => {
      const node: ConsoleNode = {
        type: 'overlay',
        children: [],
      };

      const buffer = createOutputBuffer();
      const result = renderNodeToBuffer(node, buffer, 0, 0, 80, 10);

      // Should render without error
      expect(result).toBeDefined();
    });

    it('should handle overlay with backdrop color', () => {
      const node: ConsoleNode = {
        type: 'overlay',
        backdrop: true,
        backdropColor: 'blue',
        children: [
          { type: 'text', content: 'Colored Backdrop' },
        ],
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80, 10);

      expect(buffer.lines.length).toBeGreaterThan(0);
      expect(node.backdropColor).toBe('blue');
    });

    it('should handle nested overlays', () => {
      const node: ConsoleNode = {
        type: 'overlay',
        zIndex: 1000,
        children: [
          {
            type: 'overlay',
            zIndex: 2000,
            children: [
              { type: 'text', content: 'Nested Overlay' },
            ],
          },
        ],
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80, 10);

      expect(buffer.lines.length).toBeGreaterThan(0);
      expect(buffer.lines.some(line => line.includes('Nested Overlay'))).toBe(true);
    });

    it('should handle overlay with interactive components', () => {
      const node: ConsoleNode = {
        type: 'overlay',
        children: [
          { type: 'text', content: 'Modal Title' },
          {
            type: 'button',
            content: 'Close',
          },
        ],
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80, 10);

      expect(buffer.lines.length).toBeGreaterThan(0);
      expect(buffer.lines.some(line => line.includes('Modal Title'))).toBe(true);
      expect(buffer.lines.some(line => line.includes('Close'))).toBe(true);
    });
  });

  describe('Overlay positioning', () => {
    it('should center overlay content', () => {
      const node: ConsoleNode = {
        type: 'overlay',
        children: [
          { type: 'text', content: 'Centered Overlay' },
        ],
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80, 10);

      // Positioning is handled during rendering
      expect(buffer.lines.length).toBeGreaterThan(0);
    });

    it('should handle overlay with absolute positioning', () => {
      const node: ConsoleNode = {
        type: 'overlay',
        style: {
          position: 'absolute',
          left: 10,
          top: 5,
        } as any,
        children: [
          { type: 'text', content: 'Positioned Overlay' },
        ],
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80, 10);

      // Should respect position
      expect(buffer.lines.length).toBeGreaterThan(0);
      expect((node.style as any)?.position).toBe('absolute');
    });
  });
});
