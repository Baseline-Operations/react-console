/**
 * Generic validation utilities
 * Type-safe validation functions with generic result types
 * 
 * Provides type-safe validation for numbers and strings with constraints,
 * preserving type information through generics. Validators can be composed
 * for complex validation rules.
 */

/**
 * Validation result type
 * 
 * Generic type for validation results that preserve type information.
 * Returns both validation status and typed value (or null if invalid).
 * 
 * @template T - Type of validated value (e.g., `number`, `string`)
 * 
 * @example
 * ```ts
 * const result: ValidationResult<number> = validateNumber('123');
 * // { valid: true, value: 123, error: undefined }
 * ```
 */
export interface ValidationResult<T> {
  valid: boolean;
  value: T | null;
  error?: string;
}

/**
 * Validator function type
 * 
 * Generic validator function that takes input string and returns typed validation result.
 * All validators follow this signature for composability.
 * 
 * @template T - Type of validated value (e.g., `number`, `string`)
 * @param input - Input string to validate
 * @returns Validation result with valid flag and typed value
 * 
 * @example
 * ```ts
 * const validator: Validator<number> = (input) => validateNumber(input, { min: 0 });
 * ```
 */
export type Validator<T> = (input: string) => ValidationResult<T>;

/**
 * Number validation constraints
 * 
 * Constraints for validating number input:
 * - `min`/`max`: Value range constraints
 * - `step`: Value must be multiple of step
 * - `allowDecimals`: Whether to allow decimal numbers
 * - `decimalPlaces`: Number of decimal places to enforce
 */
export interface NumberConstraints {
  min?: number;
  max?: number;
  step?: number;
  allowDecimals?: boolean;
  decimalPlaces?: number;
}

/**
 * Generic number validator
 * 
 * Validates and parses number input with optional constraints (min, max, step, decimals).
 * Returns typed validation result with parsed number or validation error.
 * 
 * @param input - Input string to validate and parse
 * @param constraints - Optional number validation constraints
 * @returns Validation result with valid flag, parsed number, and error message (if invalid)
 * 
 * @example
 * ```ts
 * // Basic validation
 * const result = validateNumber('123.45');
 * // { valid: true, value: 123.45 }
 * 
 * // With constraints
 * const result2 = validateNumber('123.45', {
 *   min: 0,
 *   max: 1000,
 *   step: 0.1,
 *   decimalPlaces: 2,
 * });
 * // { valid: true, value: 123.45 }
 * 
 * // Invalid input
 * const result3 = validateNumber('abc');
 * // { valid: false, value: null, error: 'Invalid number format' }
 * ```
 */
export function validateNumber(
  input: string,
  constraints?: NumberConstraints
): ValidationResult<number> {
  // Remove non-numeric characters except decimal point and minus
  let cleaned = input.replace(/[^\d.-]/g, '');

  // Handle decimal places
  const allowDecimals = constraints?.allowDecimals !== false; // Default to true
  if (!allowDecimals) {
    cleaned = cleaned.replace(/\./g, '');
  } else if (constraints?.decimalPlaces !== undefined) {
    const parts = cleaned.split('.');
    if (parts.length > 1) {
      cleaned = parts[0] + '.' + parts[1]!.slice(0, constraints.decimalPlaces);
    }
  }

  // Try to parse as number
  const numValue = parseFloat(cleaned);
  const isValid = !isNaN(numValue) && cleaned !== '' && cleaned !== '-';

  if (!isValid) {
    return {
      valid: false,
      value: null,
      error: 'Invalid number format',
    };
  }

  // Apply min/max constraints
  let finalValue = numValue;
  if (constraints?.min !== undefined && finalValue < constraints.min) {
    finalValue = constraints.min;
  }
  if (constraints?.max !== undefined && finalValue > constraints.max) {
    finalValue = constraints.max;
  }

  // Apply step
  if (constraints?.step !== undefined && constraints.step > 0) {
    finalValue = Math.round(finalValue / constraints.step) * constraints.step;
  }

  return {
    valid: true,
    value: finalValue,
  };
}

/**
 * Generic string validator
 * 
 * Validates string input with optional constraints (minLength, maxLength, pattern).
 * Returns typed validation result with validated string or validation error.
 * 
 * Constraints:
 * - `minLength`/`maxLength`: String length constraints
 * - `pattern`: Regex pattern to match
 * 
 * @param input - Input string to validate
 * @param constraints - Optional string validation constraints
 * @returns Validation result with valid flag, validated string, and error message (if invalid)
 * 
 * @example
 * ```ts
 * // Basic validation
 * const result = validateString('hello');
 * // { valid: true, value: 'hello' }
 * 
 * // With constraints
 * const result2 = validateString('hello@example.com', {
 *   minLength: 5,
 *   maxLength: 50,
 *   pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
 * });
 * // { valid: true, value: 'hello@example.com' }
 * ```
 */
export interface StringConstraints {
  minLength?: number;
  maxLength?: number;
  pattern?: string | RegExp;
}

export function validateString(
  input: string,
  constraints?: StringConstraints
): ValidationResult<string> {
  // Check length constraints
  if (constraints?.minLength !== undefined && input.length < constraints.minLength) {
    return {
      valid: false,
      value: null,
      error: `Input must be at least ${constraints.minLength} characters`,
    };
  }

  if (constraints?.maxLength !== undefined && input.length > constraints.maxLength) {
    return {
      valid: false,
      value: null,
      error: `Input must be at most ${constraints.maxLength} characters`,
    };
  }

  // Check pattern
  if (constraints?.pattern) {
    const regex = typeof constraints.pattern === 'string' 
      ? new RegExp(constraints.pattern) 
      : constraints.pattern;
    
    if (!regex.test(input)) {
      return {
        valid: false,
        value: null,
        error: 'Input does not match required pattern',
      };
    }
  }

  return {
    valid: true,
    value: input,
  };
}

/**
 * Compose multiple validators
 * 
 * Combines multiple validators into a single validator that runs them in sequence.
 * Returns the first failure result or the last success result if all validators pass.
 * Useful for chaining validation rules (e.g., format check, then range check).
 * 
 * @template T - Type of validated value
 * @param validators - Array of validators to compose
 * @returns Composed validator function
 * 
 * @example
 * ```ts
 * const validator = composeValidators<number>(
 *   (input) => validateNumber(input, { min: 0 }),
 *   (input) => validateNumber(input, { max: 100 }),
 * );
 * 
 * const result = validator('50');
 * // Runs both validators, returns result from last validator if all pass
 * ```
 */
export function composeValidators<T>(
  ...validators: Array<Validator<T>>
): Validator<T> {
  return (input: string): ValidationResult<T> => {
    for (const validator of validators) {
      const result = validator(input);
      if (!result.valid) {
        return result;
      }
    }
    // All validators passed - return last result (or first if only one)
    return validators[validators.length - 1]!(input);
  };
}
