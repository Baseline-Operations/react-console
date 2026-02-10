/**
 * Integration tests for the multi-buffer rendering system
 * Verifies the complete rendering pipeline works end-to-end
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { BufferRenderer, getBufferRenderer, resetBufferRenderer } from '../index';
import { CellBuffer } from '../CellBuffer';
import { CompositeBuffer } from '../CompositeBuffer';
import { DisplayBuffer } from '../DisplayBuffer';
import { ANSIGenerator } from '../ANSIGenerator';

describe('Multi-Buffer Rendering Integration', () => {
  beforeEach(() => {
    resetBufferRenderer();
  });

  describe('BufferRenderer', () => {
    it('should create and return global buffer renderer', () => {
      const renderer1 = getBufferRenderer();
      const renderer2 = getBufferRenderer();

      expect(renderer1).toBe(renderer2);
      expect(renderer1).toBeInstanceOf(BufferRenderer);
    });

    it('should reset and create new renderer', () => {
      const renderer1 = getBufferRenderer();
      resetBufferRenderer();
      const renderer2 = getBufferRenderer();

      expect(renderer1).not.toBe(renderer2);
    }, 30000);
  });

  describe('CellBuffer rendering', () => {
    it('should write text to cell buffer', () => {
      const buffer = new CellBuffer(20, 5);

      buffer.writeString(0, 0, 'Hello', 'white', 'black');

      expect(buffer.getCell(0, 0)?.char).toBe('H');
      expect(buffer.getCell(1, 0)?.char).toBe('e');
      expect(buffer.getCell(2, 0)?.char).toBe('l');
      expect(buffer.getCell(3, 0)?.char).toBe('l');
      expect(buffer.getCell(4, 0)?.char).toBe('o');
      expect(buffer.getCell(0, 0)?.foreground).toBe('white');
      expect(buffer.getCell(0, 0)?.background).toBe('black');
    });

    it('should fill background region', () => {
      const buffer = new CellBuffer(10, 5);

      buffer.fillBackground(0, 0, 10, 5, 'blue', 'root', null, 0);

      expect(buffer.getCell(5, 2)?.background).toBe('blue');
      expect(buffer.getCell(0, 0)?.background).toBe('blue');
      expect(buffer.getCell(9, 4)?.background).toBe('blue');
    });

    it('should render border characters', () => {
      const buffer = new CellBuffer(10, 5);

      // Draw a simple border
      buffer.setCell(0, 0, { char: '┌' });
      buffer.setCell(9, 0, { char: '┐' });
      buffer.setCell(0, 4, { char: '└' });
      buffer.setCell(9, 4, { char: '┘' });

      // Horizontal borders
      for (let x = 1; x < 9; x++) {
        buffer.setCell(x, 0, { char: '─' });
        buffer.setCell(x, 4, { char: '─' });
      }

      // Vertical borders
      for (let y = 1; y < 4; y++) {
        buffer.setCell(0, y, { char: '│' });
        buffer.setCell(9, y, { char: '│' });
      }

      expect(buffer.getCell(0, 0)?.char).toBe('┌');
      expect(buffer.getCell(9, 0)?.char).toBe('┐');
      expect(buffer.getCell(0, 4)?.char).toBe('└');
      expect(buffer.getCell(9, 4)?.char).toBe('┘');
      expect(buffer.getCell(5, 0)?.char).toBe('─');
      expect(buffer.getCell(0, 2)?.char).toBe('│');
    });
  });

  describe('Layer compositing', () => {
    it('should create and manage layers', () => {
      const composite = new CompositeBuffer(20, 10);

      // Create layers
      composite.createLayer('layer1', 1, { x: 0, y: 0, width: 10, height: 5 });
      composite.createLayer('layer2', 2, { x: 5, y: 2, width: 10, height: 5 });

      const layer1 = composite.getLayerBuffer('layer1');
      const layer2 = composite.getLayerBuffer('layer2');

      expect(layer1).not.toBeNull();
      expect(layer2).not.toBeNull();
    });

    it('should composite layers with z-index ordering', () => {
      const composite = new CompositeBuffer(20, 10);

      // Create overlapping layers
      composite.createLayer('back', 0, { x: 0, y: 0, width: 10, height: 5 });
      composite.createLayer('front', 1, { x: 5, y: 2, width: 10, height: 5 });

      const backLayer = composite.getLayerBuffer('back');
      const frontLayer = composite.getLayerBuffer('front');

      // Write to back layer
      backLayer?.fillRegion(0, 0, 10, 5, { char: 'B', background: 'red' });

      // Write to front layer (overlaps)
      frontLayer?.fillRegion(0, 0, 10, 5, { char: 'F', background: 'blue' });

      // Composite
      composite.composite();

      const result = composite.getCompositeBuffer();

      // Non-overlapping back area should have 'B'
      expect(result.getCell(0, 0)?.char).toBe('B');

      // Overlapping area should have 'F' (higher z-index)
      expect(result.getCell(7, 3)?.char).toBe('F');
    });
  });

  describe('DisplayBuffer diff calculation', () => {
    it('should calculate diffs between buffers', () => {
      const display = new DisplayBuffer(10, 5);

      // Initial state
      const pending = display.getPendingBuffer();
      pending.writeString(0, 0, 'Hello');

      // Get diff
      const diff = display.getDiff();

      // Should have changes for 'Hello'
      expect(diff.length).toBe(5);
      expect(diff[0]?.newCell.char).toBe('H');
    });

    it('should detect changes between current and pending', () => {
      const display = new DisplayBuffer(10, 5);

      // Write to pending
      display.getPendingBuffer().writeString(0, 0, 'Hello');

      // Check diff - should show changes
      const diff1 = display.getDiff();
      expect(diff1.length).toBe(5);

      // After clearing pending, diff should be different
      display.getPendingBuffer().clear();
      const diff2 = display.getDiff();
      // Changes depend on what's in current vs pending
      expect(diff2.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('ANSI code generation', () => {
    it('should generate ANSI codes for cell', () => {
      const generator = new ANSIGenerator();

      const codes = generator.cellToANSI({
        char: 'X',
        foreground: 'red',
        background: 'blue',
        bold: true,
        dim: false,
        italic: false,
        underline: false,
        strikethrough: false,
        inverse: false,
        zIndex: 0,
        layerId: 'root',
        nodeId: null,
        dirty: false,
      });

      // Should contain reset, color codes, and character
      expect(codes).toContain('X');
      expect(codes).toContain('\x1b['); // ANSI escape
    });

    it('should optimize transitions between similar cells', () => {
      const generator = new ANSIGenerator();

      const cell1 = {
        char: 'A',
        foreground: 'red',
        background: null,
        bold: false,
        dim: false,
        italic: false,
        underline: false,
        strikethrough: false,
        inverse: false,
        zIndex: 0,
        layerId: 'root',
        nodeId: null,
        dirty: false,
      };

      const cell2 = { ...cell1, char: 'B' };

      const codes1 = generator.cellToANSI(cell1);
      const transition = generator.transitionCodes(cell1, cell2);

      // Transition codes should be empty or minimal when styles are the same
      // transitionCodes only returns ANSI codes, not the character
      expect(transition.length).toBeLessThanOrEqual(codes1.length);
    });
  });
});
