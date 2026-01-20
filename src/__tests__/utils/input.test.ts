/**
 * Unit tests for input utilities
 */

import { describe, it, expect } from 'vitest';
import { valueToString, getValueLength, validateNumberInput, formatByType, validatePattern } from '../../utils/input';
import type { ConsoleNode } from '../../types';

describe('input utilities', () => {
  describe('valueToString', () => {
    it('should return string as-is', () => {
      expect(valueToString('hello')).toBe('hello');
    });

    it('should convert number to string', () => {
      expect(valueToString(123)).toBe('123');
      expect(valueToString(0)).toBe('0');
      expect(valueToString(-42)).toBe('-42');
    });

    it('should convert boolean to string', () => {
      expect(valueToString(true)).toBe('true');
      expect(valueToString(false)).toBe('false');
    });

    it('should convert array to comma-separated string', () => {
      expect(valueToString([1, 2, 3])).toBe('1, 2, 3');
      expect(valueToString(['a', 'b', 'c'])).toBe('a, b, c');
      expect(valueToString([])).toBe('');
    });

    it('should return empty string for undefined/null', () => {
      expect(valueToString(undefined)).toBe('');
      expect(valueToString(null as any)).toBe('');
    });
  });

  describe('getValueLength', () => {
    it('should return length of string value', () => {
      expect(getValueLength('hello')).toBe(5);
      expect(getValueLength('')).toBe(0);
    });

    it('should return length of number as string', () => {
      expect(getValueLength(123)).toBe(3);
      expect(getValueLength(0)).toBe(1);
      expect(getValueLength(-42)).toBe(3);
    });

    it('should return length of boolean as string', () => {
      expect(getValueLength(true)).toBe(4); // 'true'.length
      expect(getValueLength(false)).toBe(5); // 'false'.length
    });

    it('should return length of array as comma-separated string', () => {
      expect(getValueLength([1, 2, 3])).toBe(7); // '1, 2, 3'.length
      expect(getValueLength(['a', 'b'])).toBe(4); // 'a, b'.length
    });

    it('should return 0 for undefined/null', () => {
      expect(getValueLength(undefined)).toBe(0);
      expect(getValueLength(null as any)).toBe(0);
    });
  });

  describe('validateNumberInput', () => {
    it('should return valid for non-number input types', () => {
      const node: ConsoleNode = { type: 'input', inputType: 'text' };
      const result = validateNumberInput('hello', node);
      expect(result.valid).toBe(true);
      expect(result.value).toBeNull();
      expect(result.displayValue).toBe('hello');
    });

    it('should validate valid number input', () => {
      const node: ConsoleNode = { type: 'input', inputType: 'number' };
      const result = validateNumberInput('123', node);
      expect(result.valid).toBe(true);
      expect(result.value).toBe(123);
      expect(result.displayValue).toBe('123');
    });

    it('should handle decimal numbers', () => {
      const node: ConsoleNode = { type: 'input', inputType: 'number' };
      const result = validateNumberInput('123.45', node);
      expect(result.valid).toBe(true);
      expect(result.value).toBe(123.45);
    });

    it('should reject invalid number input', () => {
      const node: ConsoleNode = { type: 'input', inputType: 'number' };
      const result = validateNumberInput('abc', node);
      expect(result.valid).toBe(false);
      expect(result.value).toBeNull();
    });

    it('should handle min constraint', () => {
      const node: ConsoleNode = { type: 'input', inputType: 'number', min: 10 };
      const result = validateNumberInput('5', node);
      expect(result.valid).toBe(true);
      expect(result.value).toBe(10); // Clamped to min
    });

    it('should handle max constraint', () => {
      const node: ConsoleNode = { type: 'input', inputType: 'number', max: 100 };
      const result = validateNumberInput('150', node);
      expect(result.valid).toBe(true);
      expect(result.value).toBe(100); // Clamped to max
    });

    it('should handle step constraint', () => {
      const node: ConsoleNode = { type: 'input', inputType: 'number', step: 5 };
      const result = validateNumberInput('13', node);
      expect(result.valid).toBe(true);
      expect(result.value).toBe(15); // Rounded to nearest step
    });

    it('should handle decimal places', () => {
      const node: ConsoleNode = { type: 'input', inputType: 'number', decimalPlaces: 2 };
      const result = validateNumberInput('123.456', node);
      expect(result.valid).toBe(true);
      expect(result.value).toBe(123.45);
      expect(result.displayValue).toBe('123.45');
    });

    it('should handle no decimals when allowDecimals is false', () => {
      const node: ConsoleNode = { type: 'input', inputType: 'number', allowDecimals: false };
      const result = validateNumberInput('123.45', node);
      expect(result.valid).toBe(true);
      // When allowDecimals is false, dots are removed, so '123.45' becomes '12345'
      expect(result.value).toBe(12345);
    });

    it('should apply formatDisplay function', () => {
      const node: ConsoleNode = {
        type: 'input',
        inputType: 'number',
        formatDisplay: (val) => `$${val.toFixed(2)}`,
      };
      const result = validateNumberInput('123.45', node);
      expect(result.valid).toBe(true);
      expect(result.displayValue).toBe('$123.45');
    });

    it('should apply displayFormat string', () => {
      const node: ConsoleNode = { type: 'input', inputType: 'number', displayFormat: 'currency' };
      const result = validateNumberInput('123.45', node);
      expect(result.valid).toBe(true);
      expect(result.displayValue).toBe('$123.45');
    });
  });

  describe('formatByType', () => {
    it('should format as currency', () => {
      expect(formatByType(123.45, 'currency')).toBe('$123.45');
      expect(formatByType(0, 'currency')).toBe('$0.00');
    });

    it('should format as percentage', () => {
      expect(formatByType(0.75, 'percentage')).toBe('75.00%');
      expect(formatByType(0.5, 'percentage')).toBe('50.00%');
    });

    it('should format as number with locale', () => {
      const result = formatByType(1234, 'number');
      expect(result).toMatch(/1[,.]234/); // Locale-dependent
    });

    it('should return string as-is for non-number values', () => {
      expect(formatByType('hello', 'currency')).toBe('hello');
      expect(formatByType('test', 'percentage')).toBe('test');
    });

    it('should return string representation for unknown format', () => {
      expect(formatByType(123, 'unknown')).toBe('123');
      expect(formatByType('test', 'unknown')).toBe('test');
    });
  });

  describe('validatePattern', () => {
    it('should return true when no pattern provided', () => {
      expect(validatePattern('any string')).toBe(true);
    });

    it('should validate against regex pattern string', () => {
      expect(validatePattern('hello', '^[a-z]+$')).toBe(true);
      expect(validatePattern('HELLO', '^[a-z]+$')).toBe(false);
      expect(validatePattern('hello123', '^[a-z]+$')).toBe(false);
    });

    it('should validate against RegExp object', () => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(validatePattern('test@example.com', emailPattern)).toBe(true);
      expect(validatePattern('invalid-email', emailPattern)).toBe(false);
    });

    it('should handle complex patterns', () => {
      const pattern = /^\d{3}-\d{2}-\d{4}$/; // SSN format
      expect(validatePattern('123-45-6789', pattern)).toBe(true);
      expect(validatePattern('123456789', pattern)).toBe(false);
    });
  });
});
