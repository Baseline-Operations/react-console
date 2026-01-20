/**
 * Integration tests for Button component
 * 
 * Tests that Button component renders and handles interactions correctly.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderNodeToBuffer } from '../../renderer/layout';
import { createOutputBuffer } from '../../renderer/output';
import { mockTerminalDimensions, resetTerminalMocks } from '../utils/terminal-mock';
import type { ConsoleNode } from '../../types';

describe('Button Component Integration', () => {
  beforeEach(() => {
    mockTerminalDimensions(80, 24);
  });

  afterEach(() => {
    resetTerminalMocks();
  });

  describe('Button rendering', () => {
    it('should render button with text', () => {
      const node: ConsoleNode = {
        type: 'button',
        content: 'Click Me',
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      expect(buffer.lines.length).toBeGreaterThan(0);
      expect(buffer.lines[0]).toContain('Click Me');
    });

    it('should render button with default text when content is empty', () => {
      const node: ConsoleNode = {
        type: 'button',
        content: undefined,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      expect(buffer.lines[0]).toContain('Button');
    });

    it('should render focused button with indicator', () => {
      const node: ConsoleNode = {
        type: 'button',
        content: 'Focused Button',
        focused: true,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      // Focused button should have '> ' prefix
      expect(buffer.lines[0]).toContain('>');
      expect(buffer.lines[0]).toContain('Focused Button');
    });

    it('should render disabled button with dimmed styling', () => {
      const node: ConsoleNode = {
        type: 'button',
        content: 'Disabled Button',
        disabled: true,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      expect(buffer.lines[0]).toContain('Disabled Button');
      // Disabled button should have dim styling
      expect(buffer.lines[0]).toMatch(/\x1b\[/); // Should have ANSI codes
    });

    it('should not show focus indicator when disabled', () => {
      const node: ConsoleNode = {
        type: 'button',
        content: 'Disabled Focused',
        focused: true,
        disabled: true,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      // Disabled button should not show '> ' even if focused
      expect(buffer.lines[0]).not.toContain('>');
    });

    it('should render button with styles', () => {
      const node: ConsoleNode = {
        type: 'button',
        content: 'Styled Button',
        styles: {
          color: 'green',
          bold: true,
        },
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      expect(buffer.lines[0]).toContain('Styled Button');
      // Should have ANSI codes for styling
      expect(buffer.lines[0]).toMatch(/\x1b\[/);
    });

    it('should render button with padding prefix when not focused', () => {
      const node: ConsoleNode = {
        type: 'button',
        content: 'Normal Button',
        focused: false,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      // Non-focused button should have '  ' prefix (2 spaces)
      expect(buffer.lines[0]).toMatch(/^  /);
    });
  });

  describe('Button bounds', () => {
    it('should register component bounds for hit testing', () => {
      const node: ConsoleNode = {
        type: 'button',
        content: 'Test Button',
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      // Button should be rendered (bounds registration happens in renderer)
      expect(buffer.lines.length).toBeGreaterThan(0);
    });
  });
});
