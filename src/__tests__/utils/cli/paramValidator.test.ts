/**
 * Tests for CLI parameter validation utilities
 */

import { describe, it, expect } from 'vitest';
import {
  validateCommandParams,
  type ParamValidationResult,
} from '../../../utils/cli/paramValidator';
import { validateNumber, validateString } from '../../../utils/validation';
import type { ParsedArgs } from '../../../utils/cli/parser';
import type { ComponentMetadata } from '../../../utils/cli/matcher';

describe('validateNumber', () => {
  it('should validate valid number string', () => {
    expect(validateNumber('123')).toBe(123);
    expect(validateNumber('0')).toBe(0);
    expect(validateNumber('-42')).toBe(-42);
    expect(validateNumber('3.14')).toBe(3.14);
  });

  it('should return null for invalid number string', () => {
    expect(validateNumber('abc')).toBeNull();
    expect(validateNumber('')).toBeNull();
    expect(validateNumber('12abc')).toBeNull();
  });
});

describe('validateString', () => {
  it('should validate any string', () => {
    expect(validateString('hello')).toBe('hello');
    expect(validateString('')).toBe('');
    expect(validateString('123')).toBe('123');
  });
});

describe('validateCommandParams', () => {
  const createMetadata = (params?: ComponentMetadata['params'], options?: ComponentMetadata['options']): ComponentMetadata => ({
    type: 'command',
    name: 'test',
    params,
    options,
  });

  const createParsedArgs = (command: string[] = [], options: Record<string, string | boolean> = {}, params: string[] = []): ParsedArgs => ({
    command,
    options,
    params,
  });

  it('should validate command with no params or options', () => {
    const metadata = createMetadata();
    const args = createParsedArgs(['test']);
    const result = validateCommandParams(args, metadata);
    
    expect(result.valid).toBe(true);
    expect(result.params).toEqual({});
    expect(result.options).toEqual({});
  });

  it('should validate required string parameter', () => {
    const metadata = createMetadata([
      { name: 'name', type: 'string', required: true },
    ]);
    const args = createParsedArgs(['test'], {}, ['hello']);
    const result = validateCommandParams(args, metadata);
    
    expect(result.valid).toBe(true);
    expect(result.params).toEqual({ name: 'hello' });
  });

  it('should fail when required parameter is missing', () => {
    const metadata = createMetadata([
      { name: 'name', type: 'string', required: true },
    ]);
    const args = createParsedArgs(['test'], {}, []);
    const result = validateCommandParams(args, metadata);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]?.name).toBe('name');
    expect(result.errors[0]?.type).toBe('missing_required');
  });

  it('should validate optional parameter', () => {
    const metadata = createMetadata([
      { name: 'name', type: 'string', required: false },
    ]);
    const args = createParsedArgs(['test'], {}, []);
    const result = validateCommandParams(args, metadata);
    
    expect(result.valid).toBe(true);
    expect(result.params).toEqual({});
  });

  it('should validate number parameter', () => {
    const metadata = createMetadata([
      { name: 'count', type: 'number', required: true },
    ]);
    const args = createParsedArgs(['test'], {}, ['42']);
    const result = validateCommandParams(args, metadata);
    
    expect(result.valid).toBe(true);
    expect(result.params).toEqual({ count: 42 });
  });

  it('should fail when number parameter is invalid', () => {
    const metadata = createMetadata([
      { name: 'count', type: 'number', required: true },
    ]);
    const args = createParsedArgs(['test'], {}, ['abc']);
    const result = validateCommandParams(args, metadata);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]?.name).toBe('count');
    expect(result.errors[0]?.type).toBe('invalid_type');
  });

  it('should validate boolean option', () => {
    const metadata = createMetadata(undefined, {
      verbose: { type: 'boolean', default: false },
    });
    const args = createParsedArgs(['test'], { verbose: true });
    const result = validateCommandParams(args, metadata);
    
    expect(result.valid).toBe(true);
    expect(result.options).toEqual({ verbose: true });
  });

  it('should validate string option', () => {
    const metadata = createMetadata(undefined, {
      output: { type: 'string', default: 'dist' },
    });
    const args = createParsedArgs(['test'], { output: 'build' });
    const result = validateCommandParams(args, metadata);
    
    expect(result.valid).toBe(true);
    expect(result.options).toEqual({ output: 'build' });
  });

  it('should use default value for missing option', () => {
    const metadata = createMetadata(undefined, {
      output: { type: 'string', default: 'dist' },
    });
    const args = createParsedArgs(['test'], {});
    const result = validateCommandParams(args, metadata);
    
    expect(result.valid).toBe(true);
    expect(result.options).toEqual({ output: 'dist' });
  });

  it('should validate multiple parameters', () => {
    const metadata = createMetadata([
      { name: 'source', type: 'string', required: true },
      { name: 'target', type: 'string', required: true },
    ]);
    const args = createParsedArgs(['test'], {}, ['src', 'dist']);
    const result = validateCommandParams(args, metadata);
    
    expect(result.valid).toBe(true);
    expect(result.params).toEqual({ source: 'src', target: 'dist' });
  });

  it('should validate mixed params and options', () => {
    const metadata = createMetadata(
      [{ name: 'file', type: 'string', required: true }],
      { minify: { type: 'boolean', default: false } }
    );
    const args = createParsedArgs(['test'], { minify: true }, ['app.js']);
    const result = validateCommandParams(args, metadata);
    
    expect(result.valid).toBe(true);
    expect(result.params).toEqual({ file: 'app.js' });
    expect(result.options).toEqual({ minify: true });
  });
});
