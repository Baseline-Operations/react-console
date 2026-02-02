/**
 * Centralized InputValidator class
 * Provides common validation rules and custom validator support
 */

import {
  validateNumber,
  validateString,
  type ValidationResult,
  type Validator,
  type NumberConstraints,
  type StringConstraints,
} from './validation';

/**
 * Common validation rule types
 */
export type ValidationRule =
  | 'required'
  | 'email'
  | 'url'
  | 'number'
  | 'integer'
  | 'positive'
  | 'negative'
  | 'min'
  | 'max'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'alphanumeric'
  | 'alphabetic'
  | 'numeric'
  | 'phone'
  | 'ip'
  | 'uuid';

/**
 * Validation rule configuration
 */
export interface ValidationRuleConfig {
  rule: ValidationRule;
  value?: number | string | RegExp; // Value for min, max, minLength, maxLength, pattern
  message?: string; // Custom error message
}

/**
 * InputValidator class
 * Centralized validator with common validation rules and custom validator support
 */
export class InputValidator {
  private rules: ValidationRuleConfig[] = [];
  private customValidators: Validator<string>[] = [];
  private numberConstraints?: NumberConstraints;
  private stringConstraints?: StringConstraints;

  /**
   * Add a validation rule
   * @param rule - Validation rule type
   * @param value - Optional value for rules that need it (min, max, minLength, maxLength, pattern)
   * @param message - Optional custom error message
   * @returns This validator instance for chaining
   */
  addRule(rule: ValidationRule, value?: number | string | RegExp, message?: string): this {
    this.rules.push({ rule, value, message });
    return this;
  }

  /**
   * Add a custom validator function
   * @param validator - Custom validator function
   * @returns This validator instance for chaining
   */
  addCustomValidator(validator: Validator<string>): this {
    this.customValidators.push(validator);
    return this;
  }

  /**
   * Set number validation constraints
   * @param constraints - Number constraints
   * @returns This validator instance for chaining
   */
  setNumberConstraints(constraints: NumberConstraints): this {
    this.numberConstraints = constraints;
    return this;
  }

  /**
   * Set string validation constraints
   * @param constraints - String constraints
   * @returns This validator instance for chaining
   */
  setStringConstraints(constraints: StringConstraints): this {
    this.stringConstraints = constraints;
    return this;
  }

  /**
   * Validate input string
   * @param input - Input string to validate
   * @returns Validation result
   */
  validate(input: string): ValidationResult<string | number> {
    // Check required first
    const requiredRule = this.rules.find((r) => r.rule === 'required');
    if (requiredRule) {
      if (!input || input.trim().length === 0) {
        return {
          valid: false,
          value: null,
          error: requiredRule.message || 'This field is required',
        };
      }
    }

    // If empty and not required, return valid
    if (!input || input.trim().length === 0) {
      return { valid: true, value: input };
    }

    // Apply string constraints if set
    if (this.stringConstraints) {
      const result = validateString(input, this.stringConstraints);
      if (!result.valid) {
        return result;
      }
    }

    // Apply number constraints if set
    if (this.numberConstraints) {
      const result = validateNumber(input, this.numberConstraints);
      if (!result.valid) {
        return result;
      }
      // If number validation passes, return number result
      if (result.value !== null) {
        return { valid: true, value: result.value };
      }
    }

    // Apply validation rules
    for (const ruleConfig of this.rules) {
      const result = this.applyRule(input, ruleConfig);
      if (!result.valid) {
        return result;
      }
    }

    // Apply custom validators
    for (const validator of this.customValidators) {
      const result = validator(input);
      if (!result.valid) {
        return result;
      }
    }

    // All validations passed
    return { valid: true, value: input };
  }

  /**
   * Apply a single validation rule
   * @param input - Input string
   * @param ruleConfig - Rule configuration
   * @returns Validation result
   */
  private applyRule(input: string, ruleConfig: ValidationRuleConfig): ValidationResult<string> {
    const { rule, value, message } = ruleConfig;

    switch (rule) {
      case 'required':
        // Already handled above
        return { valid: true, value: input };

      case 'email':
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(input)) {
          return {
            valid: false,
            value: null,
            error: message || 'Invalid email address',
          };
        }
        break;

      case 'url':
        try {
          new URL(input);
        } catch {
          return {
            valid: false,
            value: null,
            error: message || 'Invalid URL',
          };
        }
        break;

      case 'number':
        const numResult = validateNumber(input);
        if (!numResult.valid) {
          return {
            valid: false,
            value: null,
            error: message || numResult.error || 'Invalid number',
          };
        }
        break;

      case 'integer':
        if (!/^-?\d+$/.test(input)) {
          return {
            valid: false,
            value: null,
            error: message || 'Must be an integer',
          };
        }
        break;

      case 'positive':
        const posResult = validateNumber(input, { min: 0 });
        if (!posResult.valid || (posResult.value !== null && posResult.value <= 0)) {
          return {
            valid: false,
            value: null,
            error: message || 'Must be a positive number',
          };
        }
        break;

      case 'negative':
        const negResult = validateNumber(input);
        if (!negResult.valid || (negResult.value !== null && negResult.value >= 0)) {
          return {
            valid: false,
            value: null,
            error: message || 'Must be a negative number',
          };
        }
        break;

      case 'min':
        if (typeof value === 'number') {
          const minResult = validateNumber(input, { min: value });
          if (!minResult.valid || (minResult.value !== null && minResult.value < value)) {
            return {
              valid: false,
              value: null,
              error: message || `Must be at least ${value}`,
            };
          }
        }
        break;

      case 'max':
        if (typeof value === 'number') {
          const maxResult = validateNumber(input, { max: value });
          if (!maxResult.valid || (maxResult.value !== null && maxResult.value > value)) {
            return {
              valid: false,
              value: null,
              error: message || `Must be at most ${value}`,
            };
          }
        }
        break;

      case 'minLength':
        if (typeof value === 'number') {
          if (input.length < value) {
            return {
              valid: false,
              value: null,
              error: message || `Must be at least ${value} characters`,
            };
          }
        }
        break;

      case 'maxLength':
        if (typeof value === 'number') {
          if (input.length > value) {
            return {
              valid: false,
              value: null,
              error: message || `Must be at most ${value} characters`,
            };
          }
        }
        break;

      case 'pattern':
        if (value instanceof RegExp || typeof value === 'string') {
          const regex = value instanceof RegExp ? value : new RegExp(value);
          if (!regex.test(input)) {
            return {
              valid: false,
              value: null,
              error: message || 'Input does not match required pattern',
            };
          }
        }
        break;

      case 'alphanumeric':
        if (!/^[a-zA-Z0-9]+$/.test(input)) {
          return {
            valid: false,
            value: null,
            error: message || 'Must contain only letters and numbers',
          };
        }
        break;

      case 'alphabetic':
        if (!/^[a-zA-Z]+$/.test(input)) {
          return {
            valid: false,
            value: null,
            error: message || 'Must contain only letters',
          };
        }
        break;

      case 'numeric':
        if (!/^\d+$/.test(input)) {
          return {
            valid: false,
            value: null,
            error: message || 'Must contain only numbers',
          };
        }
        break;

      case 'phone':
        // Basic phone number validation (supports various formats)
        const phonePattern = /^[\d\s\-()+]+$/;
        if (!phonePattern.test(input) || input.replace(/\D/g, '').length < 10) {
          return {
            valid: false,
            value: null,
            error: message || 'Invalid phone number',
          };
        }
        break;

      case 'ip':
        // IPv4 and IPv6 validation
        const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
        const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
        if (!ipv4Pattern.test(input) && !ipv6Pattern.test(input)) {
          return {
            valid: false,
            value: null,
            error: message || 'Invalid IP address',
          };
        }
        break;

      case 'uuid':
        const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidPattern.test(input)) {
          return {
            valid: false,
            value: null,
            error: message || 'Invalid UUID',
          };
        }
        break;
    }

    return { valid: true, value: input };
  }

  /**
   * Clear all validation rules and validators
   */
  clear(): void {
    this.rules = [];
    this.customValidators = [];
    this.numberConstraints = undefined;
    this.stringConstraints = undefined;
  }

  /**
   * Create a validator from a preset configuration
   * @param preset - Preset name
   * @returns Configured validator
   */
  static createPreset(
    preset: 'email' | 'number' | 'url' | 'phone' | 'ip' | 'uuid'
  ): InputValidator {
    const validator = new InputValidator();

    switch (preset) {
      case 'email':
        validator.addRule('email');
        break;
      case 'number':
        validator.addRule('number');
        break;
      case 'url':
        validator.addRule('url');
        break;
      case 'phone':
        validator.addRule('phone');
        break;
      case 'ip':
        validator.addRule('ip');
        break;
      case 'uuid':
        validator.addRule('uuid');
        break;
    }

    return validator;
  }
}

/**
 * Common validation rules factory
 */
export const ValidationRules = {
  /**
   * Create a required validator
   */
  required(message?: string): InputValidator {
    return new InputValidator().addRule('required', undefined, message);
  },

  /**
   * Create an email validator
   */
  email(message?: string): InputValidator {
    return new InputValidator().addRule('email', undefined, message);
  },

  /**
   * Create a URL validator
   */
  url(message?: string): InputValidator {
    return new InputValidator().addRule('url', undefined, message);
  },

  /**
   * Create a number validator
   */
  number(message?: string): InputValidator {
    return new InputValidator().addRule('number', undefined, message);
  },

  /**
   * Create an integer validator
   */
  integer(message?: string): InputValidator {
    return new InputValidator().addRule('integer', undefined, message);
  },

  /**
   * Create a min length validator
   */
  minLength(min: number, message?: string): InputValidator {
    return new InputValidator().addRule('minLength', min, message);
  },

  /**
   * Create a max length validator
   */
  maxLength(max: number, message?: string): InputValidator {
    return new InputValidator().addRule('maxLength', max, message);
  },

  /**
   * Create a pattern validator
   */
  pattern(pattern: string | RegExp, message?: string): InputValidator {
    return new InputValidator().addRule('pattern', pattern, message);
  },

  /**
   * Create a phone number validator
   */
  phone(message?: string): InputValidator {
    return new InputValidator().addRule('phone', undefined, message);
  },

  /**
   * Create an IP address validator
   */
  ip(message?: string): InputValidator {
    return new InputValidator().addRule('ip', undefined, message);
  },

  /**
   * Create a UUID validator
   */
  uuid(message?: string): InputValidator {
    return new InputValidator().addRule('uuid', undefined, message);
  },
};
