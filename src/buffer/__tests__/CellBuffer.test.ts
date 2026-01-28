/**
 * Tests for CellBuffer class
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { CellBuffer } from '../CellBuffer';
import { createEmptyCell, isCellTransparent } from '../types';

describe('CellBuffer', () => {
  let buffer: CellBuffer;

  beforeEach(() => {
    buffer = new CellBuffer(10, 5);
  });

  describe('construction', () => {
    it('should create buffer with correct dimensions', () => {
      expect(buffer.width).toBe(10);
      expect(buffer.height).toBe(5);
    });

    it('should initialize all cells as empty', () => {
      const cell = buffer.getCell(0, 0);
      expect(cell).not.toBeNull();
      expect(cell?.char).toBe('');
      expect(cell?.foreground).toBeNull();
      expect(cell?.background).toBeNull();
    });

    it('should handle minimum dimensions', () => {
      const small = new CellBuffer(0, 0);
      expect(small.width).toBe(1);
      expect(small.height).toBe(1);
    });
  });

  describe('setCell', () => {
    it('should set cell properties', () => {
      buffer.setCell(0, 0, {
        char: 'A',
        foreground: 'red',
        background: 'blue',
        bold: true,
      });

      const cell = buffer.getCell(0, 0);
      expect(cell?.char).toBe('A');
      expect(cell?.foreground).toBe('red');
      expect(cell?.background).toBe('blue');
      expect(cell?.bold).toBe(true);
    });

    it('should ignore out of bounds coordinates', () => {
      buffer.setCell(-1, 0, { char: 'X' });
      buffer.setCell(100, 0, { char: 'X' });
      
      // Should not throw
      expect(buffer.getCell(-1, 0)).toBeNull();
      expect(buffer.getCell(100, 0)).toBeNull();
    });

    it('should mark cell as dirty when changed', () => {
      buffer.markClean();
      buffer.setCell(0, 0, { char: 'A' });
      
      expect(buffer.isDirty()).toBe(true);
    });
  });

  describe('setChar', () => {
    it('should set character with colors', () => {
      buffer.setChar(0, 0, 'X', 'green', 'yellow');
      
      const cell = buffer.getCell(0, 0);
      expect(cell?.char).toBe('X');
      expect(cell?.foreground).toBe('green');
      expect(cell?.background).toBe('yellow');
    });

    it('should set character with styles', () => {
      buffer.setChar(0, 0, 'X', null, null, {
        bold: true,
        italic: true,
      });
      
      const cell = buffer.getCell(0, 0);
      expect(cell?.bold).toBe(true);
      expect(cell?.italic).toBe(true);
    });
  });

  describe('fillRegion', () => {
    it('should fill a region with cell data', () => {
      buffer.fillRegion(1, 1, 3, 2, {
        char: '#',
        background: 'blue',
      });

      // Inside region
      expect(buffer.getCell(1, 1)?.char).toBe('#');
      expect(buffer.getCell(2, 1)?.char).toBe('#');
      expect(buffer.getCell(3, 1)?.char).toBe('#');
      expect(buffer.getCell(1, 2)?.char).toBe('#');

      // Outside region
      expect(buffer.getCell(0, 0)?.char).toBe('');
      expect(buffer.getCell(4, 1)?.char).toBe('');
    });

    it('should clip to buffer bounds', () => {
      buffer.fillRegion(-5, -5, 100, 100, { char: 'X' });
      
      // Should fill entire buffer
      expect(buffer.getCell(0, 0)?.char).toBe('X');
      expect(buffer.getCell(9, 4)?.char).toBe('X');
    });
  });

  describe('clearRegion', () => {
    it('should clear cells in region', () => {
      buffer.fillRegion(0, 0, 10, 5, { char: 'X' });
      buffer.clearRegion(1, 1, 2, 2);

      expect(buffer.getCell(0, 0)?.char).toBe('X');
      expect(buffer.getCell(1, 1)?.char).toBe('');
      expect(buffer.getCell(2, 2)?.char).toBe('');
      expect(buffer.getCell(3, 3)?.char).toBe('X');
    });
  });

  describe('clear', () => {
    it('should reset all cells', () => {
      buffer.fillRegion(0, 0, 10, 5, { char: 'X' });
      buffer.clear();

      buffer.forEach((cell) => {
        expect(cell.char).toBe('');
      });
    });
  });

  describe('resize', () => {
    it('should preserve existing content when growing', () => {
      buffer.setCell(0, 0, { char: 'A' });
      buffer.setCell(5, 3, { char: 'B' });
      
      buffer.resize(20, 10);
      
      expect(buffer.width).toBe(20);
      expect(buffer.height).toBe(10);
      expect(buffer.getCell(0, 0)?.char).toBe('A');
      expect(buffer.getCell(5, 3)?.char).toBe('B');
    });

    it('should truncate when shrinking', () => {
      buffer.setCell(9, 4, { char: 'Z' });
      
      buffer.resize(5, 3);
      
      expect(buffer.width).toBe(5);
      expect(buffer.height).toBe(3);
      expect(buffer.getCell(9, 4)).toBeNull();
    });
  });

  describe('writeString', () => {
    it('should write a horizontal string', () => {
      const written = buffer.writeString(1, 1, 'Hello', 'white', 'black');
      
      expect(written).toBe(5);
      expect(buffer.getCell(1, 1)?.char).toBe('H');
      expect(buffer.getCell(2, 1)?.char).toBe('e');
      expect(buffer.getCell(3, 1)?.char).toBe('l');
      expect(buffer.getCell(4, 1)?.char).toBe('l');
      expect(buffer.getCell(5, 1)?.char).toBe('o');
    });

    it('should truncate at buffer edge', () => {
      const written = buffer.writeString(8, 0, 'Hello');
      
      // Should only write 2 characters (positions 8 and 9)
      expect(written).toBe(2);
      expect(buffer.getCell(8, 0)?.char).toBe('H');
      expect(buffer.getCell(9, 0)?.char).toBe('e');
    });
  });

  describe('dirty tracking', () => {
    it('should start as dirty', () => {
      expect(buffer.isDirty()).toBe(true);
    });

    it('should be clean after markClean', () => {
      buffer.markClean();
      expect(buffer.isDirty()).toBe(false);
    });

    it('should track dirty regions', () => {
      buffer.markClean();
      buffer.setCell(2, 2, { char: 'X' });
      buffer.setCell(5, 3, { char: 'Y' });
      
      const regions = buffer.getDirtyRegions();
      expect(regions.length).toBeGreaterThan(0);
    });
  });

  describe('forEach', () => {
    it('should iterate over all cells', () => {
      let count = 0;
      buffer.forEach(() => count++);
      
      expect(count).toBe(50); // 10 x 5
    });
  });

  describe('clone', () => {
    it('should create an independent copy', () => {
      buffer.setCell(0, 0, { char: 'A' });
      
      const clone = buffer.clone();
      clone.setCell(0, 0, { char: 'B' });
      
      expect(buffer.getCell(0, 0)?.char).toBe('A');
      expect(clone.getCell(0, 0)?.char).toBe('B');
    });
  });
});

describe('Cell utilities', () => {
  describe('createEmptyCell', () => {
    it('should create cell with default values', () => {
      const cell = createEmptyCell();
      
      expect(cell.char).toBe('');
      expect(cell.foreground).toBeNull();
      expect(cell.background).toBeNull();
      expect(cell.bold).toBe(false);
      expect(cell.zIndex).toBe(0);
      expect(cell.layerId).toBe('root');
    });
  });

  describe('isCellTransparent', () => {
    it('should return true for empty char', () => {
      const cell = createEmptyCell();
      expect(isCellTransparent(cell)).toBe(true);
    });

    it('should return true for space char without styling', () => {
      const cell = createEmptyCell();
      cell.char = ' ';
      expect(isCellTransparent(cell)).toBe(true);
    });

    it('should return false for non-empty char', () => {
      const cell = createEmptyCell();
      cell.char = 'X';
      expect(isCellTransparent(cell)).toBe(false);
    });
    
    it('should return false for space with underline', () => {
      const cell = createEmptyCell();
      cell.char = ' ';
      cell.underline = true;
      expect(isCellTransparent(cell)).toBe(false);
    });
    
    it('should return false for space with bold', () => {
      const cell = createEmptyCell();
      cell.char = ' ';
      cell.bold = true;
      expect(isCellTransparent(cell)).toBe(false);
    });
    
    it('should return false for space with explicit foreground color', () => {
      const cell = createEmptyCell();
      cell.char = ' ';
      cell.foreground = 'red';
      expect(isCellTransparent(cell)).toBe(false);
    });
    
    it('should return true for space with inherit foreground', () => {
      const cell = createEmptyCell();
      cell.char = ' ';
      cell.foreground = 'inherit';
      expect(isCellTransparent(cell)).toBe(true);
    });
  });
});
