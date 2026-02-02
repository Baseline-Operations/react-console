/**
 * Parameter validation for CLI commands
 * Validates parsed command-line arguments against parameter and option definitions
 * Supports custom validators, ranges, patterns, and enhanced validation constraints
 */

import { validateNumber, type ValidationResult } from '../validation';
import type { ParsedArgs } from './parser';
import type { ComponentMetadata } from './matcher';

/**
 * Parameter validation error
 */
export interface ParamValidationError {
  /** Parameter or option name */
  name: string;
  /** Error message */
  message: string;
  /** Error type */
  type: 'missing_required' | 'invalid_type' | 'invalid_value';
}

/**
 * Parameter validation result
 */
export interface ParamValidationResult {
  /** Whether validation passed */
  valid: boolean;
  /** Validation errors (if any) */
  errors: ParamValidationError[];
  /** Validated and typed parameters */
  params: Record<string, string | number | boolean>;
  /** Validated and typed options */
  options: Record<string, string | number | boolean | string[]>;
}

/**
 * Validate command parameters and options
 *
 * @param parsedArgs - Parsed command-line arguments
 * @param metadata - Component metadata with parameter/option definitions
 * @returns Validation result with errors and typed values
 */
export function validateCommandParams(
  parsedArgs: ParsedArgs,
  metadata: ComponentMetadata
): ParamValidationResult {
  const errors: ParamValidationError[] = [];
  const validatedParams: Record<string, string | number | boolean> = {};
  const validatedOptions: Record<string, string | number | boolean | string[]> = {};

  // Validate positional parameters
  if (metadata.params && metadata.params.length > 0) {
    for (let i = 0; i < metadata.params.length; i++) {
      const paramDef = metadata.params[i]!;
      const paramValue = parsedArgs.params[i];

      // Check required parameters
      if (paramDef.required && (paramValue === undefined || paramValue === '')) {
        errors.push({
          name: paramDef.name,
          message: `Required parameter '${paramDef.name}' is missing`,
          type: 'missing_required',
        });
        continue;
      }

      // Skip validation if parameter is optional and not provided
      if (!paramValue || paramValue === '') {
        continue;
      }

      // Type validation
      const typeResult = validateParamType(paramValue, paramDef.type, paramDef.name);
      if (!typeResult.valid) {
        errors.push({
          name: paramDef.name,
          message:
            typeResult.error ||
            `Invalid type for parameter '${paramDef.name}': expected ${paramDef.type}`,
          type: 'invalid_type',
        });
        continue;
      }

      // Store validated value
      validatedParams[paramDef.name] = typeResult.value as string | number | boolean;
    }
  }

  // Validate options/flags
  if (metadata.options) {
    for (const [optionName, optionDef] of Object.entries(metadata.options)) {
      const optionValue = parsedArgs.options[optionName];

      // Check if option is provided (or has default)
      if (optionValue === undefined && optionDef.default === undefined) {
        // Option not provided and no default - skip (options are optional by default)
        continue;
      }

      // Use default value if option not provided
      const valueToValidate = optionValue !== undefined ? optionValue : optionDef.default;

      // Type validation
      if (valueToValidate !== undefined) {
        // For string values, convert to appropriate type
        if (typeof valueToValidate === 'string') {
          const typeResult = validateOptionType(valueToValidate, optionDef.type, optionName);
          if (!typeResult.valid) {
            errors.push({
              name: optionName,
              message:
                typeResult.error ||
                `Invalid type for option '--${optionName}': expected ${optionDef.type}`,
              type: 'invalid_type',
            });
            continue;
          }

          // Store validated value
          validatedOptions[optionName] = typeResult.value as string | number | boolean | string[];
        } else {
          // Already typed (boolean or string[])
          validatedOptions[optionName] = valueToValidate;
        }
      }
    }
  }

  // Also validate options that were provided but not defined (warn but don't fail)
  for (const [optionName, optionValue] of Object.entries(parsedArgs.options)) {
    if (metadata.options && !(optionName in metadata.options)) {
      // Option provided but not defined - this is allowed but could be logged
      // Store as-is (will be string, boolean, or string[])
      validatedOptions[optionName] = optionValue;
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    params: validatedParams,
    options: validatedOptions,
  };
}

/**
 * Validate parameter type
 */
function validateParamType(
  value: string,
  expectedType: 'string' | 'number' | 'boolean',
  paramName: string
): ValidationResult<string | number | boolean> {
  switch (expectedType) {
    case 'string':
      return { valid: true, value };

    case 'number': {
      const result = validateNumber(value);
      if (!result.valid) {
        return {
          valid: false,
          value: null,
          error: `Parameter '${paramName}' must be a number`,
        };
      }
      return { valid: true, value: result.value };
    }

    case 'boolean': {
      // Accept 'true', 'false', '1', '0', 'yes', 'no'
      const lower = value.toLowerCase();
      if (lower === 'true' || lower === '1' || lower === 'yes') {
        return { valid: true, value: true };
      }
      if (lower === 'false' || lower === '0' || lower === 'no') {
        return { valid: true, value: false };
      }
      return {
        valid: false,
        value: null,
        error: `Parameter '${paramName}' must be a boolean (true/false, 1/0, yes/no)`,
      };
    }

    default:
      return {
        valid: false,
        value: null,
        error: `Unknown parameter type: ${expectedType}`,
      };
  }
}

/**
 * Validate option type
 */
function validateOptionType(
  value: string | boolean | string[],
  expectedType: 'string' | 'number' | 'boolean' | 'string[]',
  optionName: string
): ValidationResult<string | number | boolean | string[]> {
  switch (expectedType) {
    case 'string':
      if (typeof value === 'string') {
        return { valid: true, value };
      }
      return {
        valid: false,
        value: null,
        error: `Option '--${optionName}' must be a string`,
      };

    case 'number': {
      if (typeof value === 'string') {
        const result = validateNumber(value);
        if (!result.valid) {
          return {
            valid: false,
            value: null,
            error: `Option '--${optionName}' must be a number`,
          };
        }
        return { valid: true, value: result.value };
      }
      return {
        valid: false,
        value: null,
        error: `Option '--${optionName}' must be a number`,
      };
    }

    case 'boolean':
      if (typeof value === 'boolean') {
        return { valid: true, value };
      }
      // Try to parse string as boolean
      if (typeof value === 'string') {
        const lower = value.toLowerCase();
        if (lower === 'true' || lower === '1' || lower === 'yes') {
          return { valid: true, value: true };
        }
        if (lower === 'false' || lower === '0' || lower === 'no') {
          return { valid: true, value: false };
        }
      }
      return {
        valid: false,
        value: null,
        error: `Option '--${optionName}' must be a boolean`,
      };

    case 'string[]':
      if (Array.isArray(value)) {
        return { valid: true, value };
      }
      if (typeof value === 'string') {
        // Single string value - convert to array
        return { valid: true, value: [value] };
      }
      return {
        valid: false,
        value: null,
        error: `Option '--${optionName}' must be an array of strings`,
      };

    default:
      return {
        valid: false,
        value: null,
        error: `Unknown option type: ${expectedType}`,
      };
  }
}

/**
 * Format validation errors for display
 *
 * @deprecated Use ValidationError component instead (TSX)
 * This function is kept for backward compatibility but should not be used in new code
 */
export function formatValidationErrors(errors: ParamValidationError[]): string {
  if (errors.length === 0) {
    return '';
  }

  const lines = ['Parameter validation errors:'];
  for (const error of errors) {
    lines.push(`  • ${error.name}: ${error.message}`);
  }
  return lines.join('\n');
}
