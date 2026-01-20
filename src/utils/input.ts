/**
 * Input utilities for formatting, validation, and type conversion
 * 
 * Utilities for converting input values to strings, validating input, and formatting
 * display values. Component-specific validation and formatting utilities.
 * 
 * Note: For generic validation utilities with type safety, see `validation.ts`
 */

import type { ConsoleNode } from '../types';

/**
 * Convert a value to a string for display
 * 
 * Converts various value types to string representation:
 * - Strings: returned as-is
 * - Numbers: converted to string
 * - Booleans: 'true' or 'false'
 * - Arrays: joined with ', '
 * - undefined/null: empty string
 * 
 * @param value - Value to convert (string, number, boolean, array, or undefined)
 * @returns String representation of value
 * 
 * @example
 * ```ts
 * valueToString('hello'); // 'hello'
 * valueToString(123); // '123'
 * valueToString(true); // 'true'
 * valueToString([1, 2, 3]); // '1, 2, 3'
 * valueToString(undefined); // ''
 * ```
 */
export function valueToString(value: string | number | boolean | string[] | number[] | undefined): string {
  if (value === undefined || value === null) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number') {
    return String(value);
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  return String(value);
}

/**
 * Get the string length of a value
 * 
 * Returns the length of the string representation of a value.
 * Convenience function that calls `valueToString` and returns its length.
 * 
 * @param value - Value to measure (string, number, boolean, array, or undefined)
 * @returns Length of string representation
 * 
 * @example
 * ```ts
 * getValueLength('hello'); // 5
 * getValueLength(123); // 3
 * getValueLength([1, 2, 3]); // 7 ('1, 2, 3'.length)
 * ```
 */
export function getValueLength(value: string | number | boolean | string[] | number[] | undefined): number {
  return valueToString(value).length;
}

/**
 * Validate and format number input
 * Uses generic validation utilities internally
 * 
 * @deprecated Consider using `validateNumber` from './validation' for generic validation
 * This function is kept for backward compatibility and includes display formatting
 */
export function validateNumberInput(
  input: string,
  node: ConsoleNode
): { valid: boolean; value: number | null; displayValue: string } {
  const inputType = node.inputType || 'text';
  
  if (inputType !== 'number') {
    return { valid: true, value: null, displayValue: input };
  }

  // Remove non-numeric characters except decimal point and minus
  let cleaned = input.replace(/[^\d.-]/g, '');
  
  // Handle decimal places
  const allowDecimals = node.allowDecimals !== false; // Default to true for number type
  if (!allowDecimals) {
    cleaned = cleaned.replace(/\./g, '');
  } else if (node.decimalPlaces !== undefined) {
    const parts = cleaned.split('.');
    if (parts.length > 1) {
      cleaned = parts[0] + '.' + parts[1]!.slice(0, node.decimalPlaces);
    }
  }

  // Try to parse as number
  const numValue = parseFloat(cleaned);
  const isValid = !isNaN(numValue) && cleaned !== '' && cleaned !== '-';

  if (!isValid) {
    return { valid: false, value: null, displayValue: input };
  }

  // Apply min/max constraints
  let finalValue = numValue;
  if (node.min !== undefined && finalValue < node.min) {
    finalValue = node.min;
  }
  if (node.max !== undefined && finalValue > node.max) {
    finalValue = node.max;
  }

  // Apply step
  if (node.step !== undefined && node.step > 0) {
    finalValue = Math.round(finalValue / node.step) * node.step;
  }

  // Format display value
  let displayValue = String(finalValue);
  if (node.decimalPlaces !== undefined) {
    displayValue = finalValue.toFixed(node.decimalPlaces);
  }

  // Apply formatDisplay if provided
  if (node.formatDisplay) {
    displayValue = node.formatDisplay(finalValue);
  } else if (node.displayFormat) {
    displayValue = formatByType(finalValue, node.displayFormat);
  }

  return { valid: true, value: finalValue, displayValue };
}

/**
 * Format value by display format type
 * 
 * Formats a value according to a predefined format type (currency, percentage, number).
 * Supports common display formats for numbers and strings.
 * 
 * @param value - Value to format (number or string)
 * @param format - Format type: 'currency', 'percentage', 'number'
 * @returns Formatted string
 * 
 * @example
 * ```ts
 * formatByType(123.45, 'currency'); // '$123.45'
 * formatByType(0.75, 'percentage'); // '75.00%'
 * formatByType(1234, 'number'); // '1,234' (with locale formatting)
 * ```
 */
export function formatByType(value: number | string, format: string): string {
  switch (format) {
    case 'currency':
      return typeof value === 'number' ? `$${value.toFixed(2)}` : value;
    case 'percentage':
      return typeof value === 'number' ? `${(value * 100).toFixed(2)}%` : value;
    case 'number':
      return typeof value === 'number' ? value.toLocaleString() : value;
    default:
      return String(value);
  }
}

/**
 * Validate input against regex pattern
 * 
 * Validates input string against a regex pattern (provided as string or RegExp).
 * Returns true if pattern matches or if no pattern provided.
 * 
 * @param input - Input string to validate
 * @param pattern - Regex pattern (string or RegExp) to match against
 * @returns True if input matches pattern (or no pattern provided), false otherwise
 * 
 * @example
 * ```ts
 * validatePattern('hello@example.com', /^[^\s@]+@[^\s@]+\.[^\s@]+$/); // true
 * validatePattern('invalid', '^[a-z]+$'); // true (matches pattern)
 * validatePattern('INVALID', '^[a-z]+$'); // false (doesn't match)
 * ```
 */
export function validatePattern(input: string, pattern?: string | RegExp): boolean {
  if (!pattern) {
    return true;
  }
  
  const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
  return regex.test(input);
}

/**
 * Re-export formatOptionDisplay from selection components shared utilities
 * @deprecated Import from '../components/selection/shared' instead
 */
export { formatOptionDisplay } from '../components/selection/shared';
