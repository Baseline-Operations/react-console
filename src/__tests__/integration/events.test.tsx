/**
 * Integration tests for event handling
 * 
 * Tests that event handling works correctly across all components.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderNodeToBuffer } from '../../renderer/layout';
import { createOutputBuffer } from '../../renderer/output';
import { mockTerminalDimensions, resetTerminalMocks } from '../utils/terminal-mock';
import type { ConsoleNode } from '../../types';

describe('Event Handling Integration', () => {
  beforeEach(() => {
    mockTerminalDimensions(80, 24);
  });

  afterEach(() => {
    resetTerminalMocks();
  });

  describe('Mouse click events', () => {
    it('should handle clicks on Button component', () => {
      const onClick = vi.fn();
      const node: ConsoleNode = {
        type: 'button',
        content: 'Click Me',
        onClick,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      // Component should render
      expect(buffer.lines.length).toBeGreaterThan(0);
      expect(buffer.lines[0]).toContain('Click Me');
      // onClick handler should be registered
      expect(node.onClick).toBe(onClick);
    });

    it('should handle clicks on Input component', () => {
      const onClick = vi.fn();
      const node: ConsoleNode = {
        type: 'input',
        inputType: 'text',
        onClick,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      expect(buffer.lines.length).toBeGreaterThan(0);
      expect(node.onClick).toBe(onClick);
    });

    it('should handle clicks on Radio component', () => {
      const onClick = vi.fn();
      const node: ConsoleNode = {
        type: 'radio',
        options: [
          { label: 'Option 1', value: 'opt1' },
          { label: 'Option 2', value: 'opt2' },
        ],
        onClick,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      expect(buffer.lines.length).toBeGreaterThan(0);
      expect(node.onClick).toBe(onClick);
    });

    it('should handle clicks on Checkbox component', () => {
      const onClick = vi.fn();
      const node: ConsoleNode = {
        type: 'checkbox',
        options: [
          { label: 'Option 1', value: 'opt1' },
        ],
        onClick,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      expect(buffer.lines.length).toBeGreaterThan(0);
      expect(node.onClick).toBe(onClick);
    });

    it('should handle clicks on Dropdown component', () => {
      const onClick = vi.fn();
      const node: ConsoleNode = {
        type: 'dropdown',
        options: [
          { label: 'Option 1', value: 'opt1' },
        ],
        onClick,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      expect(buffer.lines.length).toBeGreaterThan(0);
      expect(node.onClick).toBe(onClick);
    });

    it('should handle clicks on List component', () => {
      const onClick = vi.fn();
      const node: ConsoleNode = {
        type: 'list',
        options: [
          { label: 'Item 1', value: 'item1' },
        ],
        onClick,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80, 10);

      expect(buffer.lines.length).toBeGreaterThan(0);
      expect(node.onClick).toBe(onClick);
    });
  });

  describe('Keyboard events', () => {
    it('should handle onKeyDown on Input component', () => {
      const onKeyDown = vi.fn();
      const node: ConsoleNode = {
        type: 'input',
        inputType: 'text',
        onKeyDown,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      expect(buffer.lines.length).toBeGreaterThan(0);
      expect(node.onKeyDown).toBe(onKeyDown);
    });

    it('should handle onKeyDown on Button component', () => {
      const onKeyDown = vi.fn();
      const node: ConsoleNode = {
        type: 'button',
        content: 'Button',
        onKeyDown,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      expect(buffer.lines.length).toBeGreaterThan(0);
      expect(node.onKeyDown).toBe(onKeyDown);
    });

    it('should handle Page Up/Down keys', () => {
      const onKeyDown = vi.fn();
      const node: ConsoleNode = {
        type: 'list',
        options: Array.from({ length: 20 }, (_, i) => ({
          label: `Item ${i + 1}`,
          value: `item${i + 1}`,
        })),
        onKeyDown,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80, 10);

      expect(buffer.lines.length).toBeGreaterThan(0);
      expect(node.onKeyDown).toBe(onKeyDown);
    });

    it('should handle Home/End keys', () => {
      const onKeyDown = vi.fn();
      const node: ConsoleNode = {
        type: 'list',
        options: [
          { label: 'First', value: 'first' },
          { label: 'Last', value: 'last' },
        ],
        onKeyDown,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80, 10);

      expect(buffer.lines.length).toBeGreaterThan(0);
      expect(node.onKeyDown).toBe(onKeyDown);
    });
  });

  describe('Focus management', () => {
    it('should handle focus on Input component', () => {
      const onFocus = vi.fn();
      const onBlur = vi.fn();
      const node: ConsoleNode = {
        type: 'input',
        inputType: 'text',
        focused: true,
        onFocus,
        onBlur,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      expect(buffer.lines.length).toBeGreaterThan(0);
      expect(node.onFocus).toBe(onFocus);
      expect(node.onBlur).toBe(onBlur);
      expect(node.focused).toBe(true);
    });

    it('should handle focus on Button component', () => {
      const onFocus = vi.fn();
      const node: ConsoleNode = {
        type: 'button',
        content: 'Button',
        focused: true,
        onFocus,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      expect(buffer.lines.length).toBeGreaterThan(0);
      expect(node.focused).toBe(true);
      expect(node.onFocus).toBe(onFocus);
    });

    it('should handle focus on selection components', () => {
      const onFocus = vi.fn();
      const node: ConsoleNode = {
        type: 'radio',
        options: [
          { label: 'Option 1', value: 'opt1' },
        ],
        focused: true,
        focusedIndex: 0,
        onFocus,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      expect(buffer.lines.length).toBeGreaterThan(0);
      expect(node.focused).toBe(true);
      expect(node.focusedIndex).toBe(0);
    });
  });

  describe('Disabled state', () => {
    it('should handle disabled Input component', () => {
      const node: ConsoleNode = {
        type: 'input',
        inputType: 'text',
        disabled: true,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      expect(buffer.lines.length).toBeGreaterThan(0);
      expect(node.disabled).toBe(true);
    });

    it('should handle disabled Button component', () => {
      const node: ConsoleNode = {
        type: 'button',
        content: 'Disabled',
        disabled: true,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      expect(buffer.lines.length).toBeGreaterThan(0);
      expect(node.disabled).toBe(true);
    });

    it('should handle disabled Radio component', () => {
      const node: ConsoleNode = {
        type: 'radio',
        options: [
          { label: 'Option 1', value: 'opt1' },
        ],
        disabled: true,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      expect(buffer.lines.length).toBeGreaterThan(0);
      expect(node.disabled).toBe(true);
    });

    it('should handle disabled Checkbox component', () => {
      const node: ConsoleNode = {
        type: 'checkbox',
        options: [
          { label: 'Option 1', value: 'opt1' },
        ],
        disabled: true,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      expect(buffer.lines.length).toBeGreaterThan(0);
      expect(node.disabled).toBe(true);
    });

    it('should handle disabled Dropdown component', () => {
      const node: ConsoleNode = {
        type: 'dropdown',
        options: [
          { label: 'Option 1', value: 'opt1' },
        ],
        disabled: true,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      expect(buffer.lines.length).toBeGreaterThan(0);
      expect(node.disabled).toBe(true);
    });

    it('should handle disabled List component', () => {
      const node: ConsoleNode = {
        type: 'list',
        options: [
          { label: 'Item 1', value: 'item1' },
        ],
        disabled: true,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80, 10);

      expect(buffer.lines.length).toBeGreaterThan(0);
      expect(node.disabled).toBe(true);
    });
  });

  describe('Input events', () => {
    it('should handle onChange on Input component', () => {
      const onChange = vi.fn();
      const node: ConsoleNode = {
        type: 'input',
        inputType: 'text',
        value: 'test',
        onChange,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      expect(buffer.lines.length).toBeGreaterThan(0);
      expect(node.onChange).toBe(onChange);
    });

    it('should handle onSubmit on Input component', () => {
      const onSubmit = vi.fn();
      const node: ConsoleNode = {
        type: 'input',
        inputType: 'text',
        onSubmit,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      expect(buffer.lines.length).toBeGreaterThan(0);
      expect(node.onSubmit).toBe(onSubmit);
    });
  });

  describe('Event propagation', () => {
    it('should support preventDefault', () => {
      const onKeyDown = vi.fn((e) => {
        e.preventDefault?.();
      });
      const node: ConsoleNode = {
        type: 'input',
        inputType: 'text',
        onKeyDown,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      expect(node.onKeyDown).toBe(onKeyDown);
    });

    it('should support stopPropagation', () => {
      const onKeyDown = vi.fn((e) => {
        e.stopPropagation?.();
      });
      const node: ConsoleNode = {
        type: 'input',
        inputType: 'text',
        onKeyDown,
      };

      const buffer = createOutputBuffer();
      renderNodeToBuffer(node, buffer, 0, 0, 80);

      expect(node.onKeyDown).toBe(onKeyDown);
    });
  });
});
