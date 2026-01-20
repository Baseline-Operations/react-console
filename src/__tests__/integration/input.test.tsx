/**
 * Integration tests for Input component
 * 
 * Tests that Input component renders and handles input correctly.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderNodeToBuffer } from '../../renderer/layout';
import { createOutputBuffer } from '../../renderer/output';
import { mockTerminalDimensions, resetTerminalMocks } from '../utils/terminal-mock';
import type { ConsoleNode } from '../../types';

describe('Input Component Integration', () => {
  beforeEach(() => {
    mockTerminalDimensions(80, 24);
  });

  afterEach(() => {
    resetTerminalMocks();
  });

  describe('Text input', () => {
    it('should render text input with value', () => {
      const node: ConsoleNode = {
        type: 'input',
        value: 'Hello',
        inputType: 'text',
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      expect(buffer.lines.length).toBeGreaterThan(0);
      expect(buffer.lines[0]).toContain('Hello');
    });

    it('should render text input with placeholder', () => {
      const node: ConsoleNode = {
        type: 'input',
        value: undefined,
        placeholder: 'Enter text...',
        inputType: 'text',
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      // Placeholder should show when not focused and no value
      expect(buffer.lines[0]).toContain('Enter text...');
    });

    it('should render focused input with cursor', () => {
      const node: ConsoleNode = {
        type: 'input',
        value: 'Test',
        inputType: 'text',
        focused: true,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      // Focused input should show cursor
      expect(buffer.lines[0]).toContain('_');
    });

    it('should render disabled input', () => {
      const node: ConsoleNode = {
        type: 'input',
        value: 'Disabled',
        inputType: 'text',
        disabled: true,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      expect(buffer.lines[0]).toContain('Disabled');
      // Disabled input should have dim styling
      expect(buffer.lines[0]).toMatch(/\x1b\[/); // Should have ANSI codes for dim
    });
  });

  describe('Number input', () => {
    it('should render number input with numeric value', () => {
      const node: ConsoleNode = {
        type: 'input',
        value: 123,
        inputType: 'number',
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      expect(buffer.lines[0]).toContain('123');
    });

    it('should render number input with decimal value', () => {
      const node: ConsoleNode = {
        type: 'input',
        value: 123.45,
        inputType: 'number',
        allowDecimals: true,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      expect(buffer.lines[0]).toContain('123.45');
    });
  });

  describe('Multiline input', () => {
    it('should render multiline input', () => {
      const node: ConsoleNode = {
        type: 'input',
        value: 'Line 1\nLine 2\nLine 3',
        inputType: 'text',
        multiline: true,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      // Should render multiple lines
      expect(buffer.lines.length).toBeGreaterThanOrEqual(3);
      expect(buffer.lines.some(line => line.includes('Line 1'))).toBe(true);
      expect(buffer.lines.some(line => line.includes('Line 2'))).toBe(true);
      expect(buffer.lines.some(line => line.includes('Line 3'))).toBe(true);
    });

    it('should respect maxLines for multiline input', () => {
      const node: ConsoleNode = {
        type: 'input',
        value: 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5',
        inputType: 'text',
        multiline: true,
        maxLines: 3,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      // Should only render up to maxLines
      expect(buffer.lines.length).toBeLessThanOrEqual(3);
    });
  });

  describe('Input validation', () => {
    it('should render invalid input with error styling', () => {
      const node: ConsoleNode = {
        type: 'input',
        value: 'invalid',
        inputType: 'text',
        invalid: true,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      // Invalid input should have red color
      expect(buffer.lines[0]).toMatch(/\x1b\[/); // Should have ANSI codes
    });

    it('should render validation error message when focused', () => {
      const node: ConsoleNode = {
        type: 'input',
        value: 'invalid',
        inputType: 'text',
        focused: true,
        validationError: 'This field is required',
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      // Should show error message
      expect(buffer.lines.some(line => line.includes('⚠'))).toBe(true);
      expect(buffer.lines.some(line => line.includes('This field is required'))).toBe(true);
    });
  });

  describe('Input masking', () => {
    it('should render masked input when focused', () => {
      const node: ConsoleNode = {
        type: 'input',
        value: 'password123',
        inputType: 'text',
        mask: '*',
        focused: true,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      // Should show mask characters instead of value
      expect(buffer.lines[0]).toContain('*');
      expect(buffer.lines[0]).not.toContain('password');
    });
  });

  describe('Input width constraints', () => {
    it('should truncate long input text', () => {
      const longValue = 'A'.repeat(200);
      const node: ConsoleNode = {
        type: 'input',
        value: longValue,
        inputType: 'text',
        maxWidth: 20,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      // Should truncate or wrap
      const firstLine = buffer.lines[0] || '';
      const visibleLength = firstLine.replace(/\x1b\[[0-9;]*m/g, '').length;
      expect(visibleLength).toBeLessThanOrEqual(25); // Some room for cursor and padding
    });
  });
});
