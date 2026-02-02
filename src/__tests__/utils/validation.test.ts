/**
 * Unit tests for validation utilities
 */

import { describe, it, expect } from 'vitest';
import { validateNumber, validateString, composeValidators } from '../../utils/validation';

describe('validation utilities', () => {
  describe('validateNumber', () => {
    it('should validate number within range', () => {
      const result = validateNumber('50', { min: 0, max: 100 });
      expect(result.valid).toBe(true);
      expect(result.value).toBe(50);
    });

    it('should reject number below min', () => {
      const result = validateNumber('10', { min: 20, max: 100 });
      expect(result.valid).toBe(true); // validateNumber clamps to min
      expect(result.value).toBe(20);
    });

    it('should reject number above max', () => {
      const result = validateNumber('150', { min: 0, max: 100 });
      expect(result.valid).toBe(true); // validateNumber clamps to max
      expect(result.value).toBe(100);
    });

    it('should validate step constraint', () => {
      const result = validateNumber('15', { step: 5 });
      expect(result.valid).toBe(true);
      expect(result.value).toBe(15);
    });

    it('should round to step', () => {
      const result = validateNumber('17', { step: 5 });
      expect(result.valid).toBe(true);
      expect(result.value).toBe(15); // Rounded to nearest step
    });
  });

  describe('validateString', () => {
    it('should validate string with pattern', () => {
      const result = validateString('hello', { pattern: /^[a-z]+$/ });
      expect(result.valid).toBe(true);
    });

    it('should reject string that does not match pattern', () => {
      const result = validateString('hello123', { pattern: /^[a-z]+$/ });
      expect(result.valid).toBe(false);
    });

    it('should validate minLength', () => {
      const result = validateString('hello', { minLength: 3 });
      expect(result.valid).toBe(true);
    });

    it('should reject string below minLength', () => {
      const result = validateString('hi', { minLength: 3 });
      expect(result.valid).toBe(false);
    });
  });

  describe('composeValidators', () => {
    it('should combine multiple validators', () => {
      const validator1 = (value: number) => ({
        valid: value > 0,
        value,
        error: value <= 0 ? 'Must be positive' : undefined,
      });
      const validator2 = (value: number) => ({
        valid: value < 100,
        value,
        error: value >= 100 ? 'Must be less than 100' : undefined,
      });

      const composed = composeValidators(validator1, validator2);
      const result = composed(50);

      expect(result.valid).toBe(true);
    });

    it('should fail if any validator fails', () => {
      const validator1 = (value: number) => ({
        valid: value > 0,
        value,
        error: value <= 0 ? 'Must be positive' : undefined,
      });
      const validator2 = (value: number) => ({
        valid: value < 100,
        value,
        error: value >= 100 ? 'Must be less than 100' : undefined,
      });

      const composed = composeValidators(validator1, validator2);
      const result = composed(150);

      expect(result.valid).toBe(false);
    });
  });
});
