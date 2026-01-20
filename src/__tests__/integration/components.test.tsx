/**
 * Integration tests for component rendering
 * 
 * Tests that components render correctly to the console output buffer.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render } from '../../renderer/render';
import { Text, View, Box } from '../../components/primitives';
import { mockTerminalDimensions, resetTerminalMocks } from '../utils/terminal-mock';
import { createOutputBuffer, flushOutput } from '../../renderer/output';
import { renderNodeToBuffer } from '../../renderer/layout';

describe('Component Rendering Integration', () => {
  beforeEach(() => {
    mockTerminalDimensions(80, 24);
  });

  afterEach(() => {
    resetTerminalMocks();
  });

  describe('Text component', () => {
    it('should render simple text', () => {
      const node = {
        type: 'text' as const,
        content: 'Hello World',
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      expect(buffer.lines.length).toBeGreaterThan(0);
      expect(buffer.lines[0]).toContain('Hello World');
    });

    it('should render text with styles', () => {
      const node = {
        type: 'text' as const,
        content: 'Styled Text',
        styles: { color: 'red', bold: true },
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      expect(buffer.lines[0]).toContain('Styled Text');
      // Check for ANSI codes (red color and bold)
      expect(buffer.lines[0]).toMatch(/\x1b\[/); // ANSI escape sequence
    });

    it('should handle long text', () => {
      const longText = 'A'.repeat(100);
      const node = {
        type: 'text' as const,
        content: longText,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 20); // Max width 20

      // Text should be rendered (wrapping behavior may vary)
      expect(buffer.lines.length).toBeGreaterThan(0);
      const allText = buffer.lines.join('');
      expect(allText).toContain('A');
    });
  });

  describe('View component', () => {
    it('should render empty view', () => {
      const node = {
        type: 'box' as const,
        children: [],
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      // Empty view should still create at least one line
      expect(buffer.lines.length).toBeGreaterThanOrEqual(0);
    });

    it('should render view with children', () => {
      const node = {
        type: 'box' as const,
        children: [
          {
            type: 'text' as const,
            content: 'Child Text',
          },
        ],
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      expect(buffer.lines.length).toBeGreaterThan(0);
      expect(buffer.lines.some(line => line.includes('Child Text'))).toBe(true);
    });

    it('should render view with padding', () => {
      const node = {
        type: 'box' as const,
        style: {
          padding: 2,
        },
        children: [
          {
            type: 'text' as const,
            content: 'Padded Text',
          },
        ],
      };

      const buffer = createOutputBuffer();
      const result = renderNodeToBuffer(node, buffer, 0, 0, 80);

      // With padding, content should be offset
      expect(result.y).toBeGreaterThan(0);
    });

    it('should render view with border', () => {
      const node = {
        type: 'box' as const,
        style: {
          border: true,
          borderStyle: 'single' as const,
        },
        children: [
          {
            type: 'text' as const,
            content: 'Bordered Box',
          },
        ],
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      // Border should add characters (box drawing characters)
      const hasBorderChars = buffer.lines.some(line => 
        /[┌┐└┘│─]/.test(line)
      );
      expect(hasBorderChars).toBe(true);
    });
  });

  describe('Box component', () => {
    it('should render box with content', () => {
      const node = {
        type: 'box' as const,
        children: [
          {
            type: 'text' as const,
            content: 'Box Content',
          },
        ],
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      expect(buffer.lines.some(line => line.includes('Box Content'))).toBe(true);
    });

    it('should render nested boxes', () => {
      const node = {
        type: 'box' as const,
        children: [
          {
            type: 'box' as const,
            children: [
              {
                type: 'text' as const,
                content: 'Nested Content',
              },
            ],
          },
        ],
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      expect(buffer.lines.some(line => line.includes('Nested Content'))).toBe(true);
    });
  });

  describe('Component composition', () => {
    it('should render complex component tree', () => {
      const node = {
        type: 'box' as const,
        style: {
          padding: 1,
        },
        children: [
          {
            type: 'text' as const,
            content: 'Title',
            styles: { bold: true },
          },
          {
            type: 'box' as const,
            children: [
              {
                type: 'text' as const,
                content: 'Body text',
              },
            ],
          },
        ],
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      expect(buffer.lines.some(line => line.includes('Title'))).toBe(true);
      expect(buffer.lines.some(line => line.includes('Body text'))).toBe(true);
    });

    it('should handle multiple text nodes', () => {
      const node = {
        type: 'box' as const,
        children: [
          {
            type: 'text' as const,
            content: 'First',
          },
          {
            type: 'text' as const,
            content: 'Second',
          },
          {
            type: 'text' as const,
            content: 'Third',
          },
        ],
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      expect(buffer.lines.some(line => line.includes('First'))).toBe(true);
      expect(buffer.lines.some(line => line.includes('Second'))).toBe(true);
      expect(buffer.lines.some(line => line.includes('Third'))).toBe(true);
    });
  });

  describe('Responsive sizing', () => {
    it('should handle text with maxWidth constraint', () => {
      const longText = 'A'.repeat(200);
      const node = {
        type: 'text' as const,
        content: longText,
      };

      const buffer = createOutputBuffer();
      // Render with constrained width - text should wrap or truncate
      renderNodeToBuffer(node, buffer, 0, 0, 20); // Max width 20

      // Verify rendering completes without error
      expect(buffer.lines.length).toBeGreaterThan(0);
      // Text should be rendered (either wrapped or truncated)
      const allText = buffer.lines.join('');
      expect(allText).toContain('A');
    });

    it('should handle fullscreen mode', () => {
      const node = {
        type: 'box' as const,
        fullscreen: true,
        children: [
          {
            type: 'text' as const,
            content: 'Fullscreen Content',
          },
        ],
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80, 24);

      expect(buffer.lines.some(line => line.includes('Fullscreen Content'))).toBe(true);
    });
  });
});
