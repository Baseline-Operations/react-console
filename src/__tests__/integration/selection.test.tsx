/**
 * Integration tests for selection components
 * 
 * Tests that Radio, Checkbox, Dropdown, and List components render correctly.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderNodeToBuffer } from '../../renderer/layout';
import { createOutputBuffer } from '../../renderer/output';
import { mockTerminalDimensions, resetTerminalMocks } from '../utils/terminal-mock';
import type { ConsoleNode, SelectOption } from '../../types';

describe('Selection Components Integration', () => {
  beforeEach(() => {
    mockTerminalDimensions(80, 24);
  });

  afterEach(() => {
    resetTerminalMocks();
  });

  const testOptions: SelectOption[] = [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
    { label: 'Option 3', value: 'opt3' },
  ];

  describe('Radio component', () => {
    it('should render radio with options', () => {
      const node: ConsoleNode = {
        type: 'radio',
        options: testOptions,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      expect(buffer.lines.length).toBeGreaterThanOrEqual(3);
      expect(buffer.lines.some(line => line.includes('Option 1'))).toBe(true);
      expect(buffer.lines.some(line => line.includes('Option 2'))).toBe(true);
      expect(buffer.lines.some(line => line.includes('Option 3'))).toBe(true);
    });

    it('should render selected option with indicator', () => {
      const node: ConsoleNode = {
        type: 'radio',
        options: testOptions,
        value: 'opt2',
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      // Selected option should be styled (bold)
      const allText = buffer.lines.join('');
      expect(allText).toContain('Option 2');
    });

    it('should render focused option with focus indicator', () => {
      const node: ConsoleNode = {
        type: 'radio',
        options: testOptions,
        focused: true,
        focusedIndex: 1,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      // Focused option should have '> ' prefix
      const focusedLine = buffer.lines.find(line => line.includes('Option 2'));
      expect(focusedLine).toBeDefined();
      expect(focusedLine).toContain('>');
    });
  });

  describe('Checkbox component', () => {
    it('should render checkbox with options', () => {
      const node: ConsoleNode = {
        type: 'checkbox',
        options: testOptions,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      expect(buffer.lines.length).toBeGreaterThanOrEqual(3);
      expect(buffer.lines.some(line => line.includes('Option 1'))).toBe(true);
    });

    it('should render selected checkboxes', () => {
      const node: ConsoleNode = {
        type: 'checkbox',
        options: testOptions,
        value: ['opt1', 'opt3'],
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      // Selected options should be styled
      const allText = buffer.lines.join('');
      expect(allText).toContain('Option 1');
      expect(allText).toContain('Option 3');
    });

    it('should render focused checkbox option', () => {
      const node: ConsoleNode = {
        type: 'checkbox',
        options: testOptions,
        focused: true,
        focusedIndex: 0,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      // Focused option should have '> ' prefix
      const focusedLine = buffer.lines.find(line => line.includes('Option 1'));
      expect(focusedLine).toBeDefined();
      expect(focusedLine).toContain('>');
    });
  });

  describe('Dropdown component', () => {
    it('should render dropdown button with selected value', () => {
      const node: ConsoleNode = {
        type: 'dropdown',
        options: testOptions,
        value: 'opt2',
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      expect(buffer.lines[0]).toContain('Option 2');
      // Should have dropdown indicator
      expect(buffer.lines[0]).toMatch(/[▶▼]/);
    });

    it('should render dropdown with placeholder when no value', () => {
      const node: ConsoleNode = {
        type: 'dropdown',
        options: testOptions,
        placeholder: 'Select...',
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      expect(buffer.lines[0]).toContain('Select...');
    });

    it('should render dropdown options when open', () => {
      const node: ConsoleNode = {
        type: 'dropdown',
        options: testOptions,
        isOpen: true,
        focused: true,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      // Should render button and options
      expect(buffer.lines.length).toBeGreaterThan(1);
      // Options should be visible
      expect(buffer.lines.some(line => line.includes('Option 1'))).toBe(true);
    });

    it('should render focused dropdown option', () => {
      const node: ConsoleNode = {
        type: 'dropdown',
        options: testOptions,
        isOpen: true,
        focused: true,
        focusedIndex: 1,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      // Focused option should have '> ' prefix
      const focusedLine = buffer.lines.find(line => line.includes('Option 2'));
      expect(focusedLine).toBeDefined();
      expect(focusedLine).toContain('>');
    });

    it('should show closed indicator when not open', () => {
      const node: ConsoleNode = {
        type: 'dropdown',
        options: testOptions,
        isOpen: false,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      // Should show ▶ (closed) indicator
      expect(buffer.lines[0]).toContain('▶');
    });

    it('should show open indicator when open', () => {
      const node: ConsoleNode = {
        type: 'dropdown',
        options: testOptions,
        isOpen: true,
        focused: true,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      // Should show ▼ (open) indicator
      expect(buffer.lines[0]).toContain('▼');
    });
  });

  describe('List component', () => {
    it('should render list with options', () => {
      const node: ConsoleNode = {
        type: 'list',
        options: testOptions,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80, 10);

      expect(buffer.lines.length).toBeGreaterThan(0);
      expect(buffer.lines.some(line => line.includes('Option 1'))).toBe(true);
    });

    it('should render selected list item', () => {
      const node: ConsoleNode = {
        type: 'list',
        options: testOptions,
        value: 'opt2',
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80, 10);

      // Selected item should be styled
      const allText = buffer.lines.join('');
      expect(allText).toContain('Option 2');
    });

    it('should render focused list item', () => {
      const node: ConsoleNode = {
        type: 'list',
        options: testOptions,
        focused: true,
        focusedIndex: 1,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80, 10);

      // Focused item should have '> ' prefix
      const focusedLine = buffer.lines.find(line => line.includes('Option 2'));
      expect(focusedLine).toBeDefined();
      expect(focusedLine).toContain('>');
    });

    it('should handle scrolling for long lists', () => {
      const longOptions: SelectOption[] = Array.from({ length: 20 }, (_, i) => ({
        label: `Option ${i + 1}`,
        value: `opt${i + 1}`,
      }));

      const node: ConsoleNode = {
        type: 'list',
        options: longOptions,
        scrollTop: 5,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80, 10);

      // Should render visible items based on scrollTop (maxHeight = 10)
      // Plus scroll indicator if needed (adds 1 line)
      expect(buffer.lines.length).toBeLessThanOrEqual(11); // 10 items + 1 scroll indicator
      // Should show items starting from scrollTop (index 5 = Option 6)
      expect(buffer.lines.some(line => line.includes('Option 6'))).toBe(true);
    });

    it('should show scroll indicators', () => {
      const longOptions: SelectOption[] = Array.from({ length: 20 }, (_, i) => ({
        label: `Option ${i + 1}`,
        value: `opt${i + 1}`,
      }));

      const node: ConsoleNode = {
        type: 'list',
        options: longOptions,
        scrollTop: 10,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80, 10);

      // Should show scroll indicators (↑ or ↓)
      const allText = buffer.lines.join('');
      expect(allText).toMatch(/[↑↓]/);
    });
  });

  describe('Selection component styles', () => {
    it('should apply styles to selection components', () => {
      const node: ConsoleNode = {
        type: 'radio',
        options: testOptions,
        styles: {
          color: 'cyan',
          bold: true,
        },
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      // Should have ANSI codes for styling
      expect(buffer.lines[0]).toMatch(/\x1b\[/);
    });
  });
});
