/**
 * Enhanced parameter validation
 * Provides additional validation features like custom validators, ranges, and patterns
 */

import type { ParsedArgs } from './parser';
import type { ComponentMetadata } from './matcher';
import {
  validateCommandParams,
  type ParamValidationResult,
  type ParamValidationError,
} from './paramValidator';

/**
 * Custom validator function
 */
export type CustomValidator = (
  value: string | number | boolean | string[],
  paramName: string
) => { valid: boolean; error?: string; normalizedValue?: string | number | boolean | string[] };

/**
 * Validation constraint
 */
export interface ValidationConstraint {
  /** Minimum value (for numbers) */
  min?: number;
  /** Maximum value (for numbers) */
  max?: number;
  /** Minimum length (for strings/arrays) */
  minLength?: number;
  /** Maximum length (for strings/arrays) */
  maxLength?: number;
  /** Pattern to match (for strings, regex pattern) */
  pattern?: string | RegExp;
  /** Custom validator function */
  validator?: CustomValidator;
  /** Allowed values (enum) */
  enum?: (string | number | boolean)[];
}

/**
 * Enhanced parameter definition with validation constraints
 */
export interface EnhancedParamDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean';
  required?: boolean;
  description?: string;
  constraints?: ValidationConstraint;
}

/**
 * Enhanced option definition with validation constraints
 */
export interface EnhancedOptionDefinition {
  type: 'string' | 'number' | 'boolean' | 'string[]';
  default?: string | number | boolean | string[];
  description?: string;
  aliases?: string[];
  constraints?: ValidationConstraint;
}

/**
 * Validate value against constraints
 */
function validateConstraints(
  value: string | number | boolean | string[],
  constraints: ValidationConstraint,
  paramName: string
): { valid: boolean; error?: string; normalizedValue?: string | number | boolean | string[] } {
  // Custom validator
  if (constraints.validator) {
    const result = constraints.validator(value, paramName);
    if (!result.valid) {
      return result;
    }
    if (result.normalizedValue !== undefined) {
      value = result.normalizedValue;
    }
  }

  // Enum validation
  if (constraints.enum && !constraints.enum.includes(value as string)) {
    return {
      valid: false,
      error: `Value must be one of: ${constraints.enum.join(', ')}`,
    };
  }

  // Number constraints
  if (typeof value === 'number') {
    if (constraints.min !== undefined && value < constraints.min) {
      return {
        valid: false,
        error: `Value must be at least ${constraints.min}`,
      };
    }
    if (constraints.max !== undefined && value > constraints.max) {
      return {
        valid: false,
        error: `Value must be at most ${constraints.max}`,
      };
    }
  }

  // String/Array length constraints
  if (typeof value === 'string' || Array.isArray(value)) {
    const length = typeof value === 'string' ? value.length : value.length;
    if (constraints.minLength !== undefined && length < constraints.minLength) {
      return {
        valid: false,
        error: `Length must be at least ${constraints.minLength}`,
      };
    }
    if (constraints.maxLength !== undefined && length > constraints.maxLength) {
      return {
        valid: false,
        error: `Length must be at most ${constraints.maxLength}`,
      };
    }

    // Pattern validation (for strings)
    if (typeof value === 'string' && constraints.pattern) {
      const pattern =
        typeof constraints.pattern === 'string'
          ? new RegExp(constraints.pattern)
          : constraints.pattern;
      if (!pattern.test(value)) {
        return {
          valid: false,
          error: `Value does not match required pattern`,
        };
      }
    }
  }

  return { valid: true, normalizedValue: value };
}

/**
 * Enhanced parameter validation with constraints
 * Extends the base validation with additional constraint checking
 */
export function validateCommandParamsEnhanced(
  parsedArgs: ParsedArgs,
  metadata: ComponentMetadata,
  enhancedParams?: EnhancedParamDefinition[],
  enhancedOptions?: Record<string, EnhancedOptionDefinition>
): ParamValidationResult {
  // First run base validation
  const baseResult = validateCommandParams(parsedArgs, metadata);

  if (!baseResult.valid) {
    return baseResult;
  }

  const errors: ParamValidationError[] = [];
  const validatedParams: Record<string, string | number | boolean> = { ...baseResult.params };
  const validatedOptions: Record<string, string | number | boolean | string[]> = {
    ...baseResult.options,
  };

  // Validate enhanced params
  if (enhancedParams) {
    for (const paramDef of enhancedParams) {
      const paramValue = validatedParams[paramDef.name];

      if (paramValue === undefined) {
        continue; // Already validated by base validator
      }

      if (paramDef.constraints) {
        const constraintResult = validateConstraints(
          paramValue,
          paramDef.constraints,
          paramDef.name
        );
        if (!constraintResult.valid) {
          errors.push({
            name: paramDef.name,
            message: constraintResult.error || `Invalid value for parameter '${paramDef.name}'`,
            type: 'invalid_type',
          });
        } else if (constraintResult.normalizedValue !== undefined) {
          validatedParams[paramDef.name] = constraintResult.normalizedValue as
            | string
            | number
            | boolean;
        }
      }
    }
  }

  // Validate enhanced options
  if (enhancedOptions) {
    for (const [optionName, optionDef] of Object.entries(enhancedOptions)) {
      const optionValue = validatedOptions[optionName];

      if (optionValue === undefined) {
        continue; // Already validated by base validator
      }

      if (optionDef.constraints) {
        const constraintResult = validateConstraints(
          optionValue,
          optionDef.constraints,
          optionName
        );
        if (!constraintResult.valid) {
          errors.push({
            name: optionName,
            message: constraintResult.error || `Invalid value for option '--${optionName}'`,
            type: 'invalid_type',
          });
        } else if (constraintResult.normalizedValue !== undefined) {
          validatedOptions[optionName] = constraintResult.normalizedValue as
            | string
            | number
            | boolean
            | string[];
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors: [...baseResult.errors, ...errors],
    params: validatedParams,
    options: validatedOptions,
  };
}
