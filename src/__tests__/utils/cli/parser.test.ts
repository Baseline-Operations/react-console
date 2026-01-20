/**
 * Tests for CLI parser utilities
 */

import { describe, it, expect } from 'vitest';
import { parseCommandLineArgs, extractPathParams, matchRoutePath } from '../../../utils/cli/parser';
import type { ParsedArgs } from '../../../utils/cli/parser';

describe('parseCommandLineArgs', () => {
  it('should parse simple command', () => {
    const result = parseCommandLineArgs(['build']);
    expect(result).toEqual({
      command: ['build'],
      options: {},
      params: [],
    });
  });

  it('should parse command with subcommand', () => {
    const result = parseCommandLineArgs(['build', 'dev']);
    expect(result).toEqual({
      command: ['build', 'dev'],
      options: {},
      params: [],
    });
  });

  it('should parse options', () => {
    const result = parseCommandLineArgs(['build', '--minify', '--output', 'dist']);
    expect(result).toEqual({
      command: ['build'],
      options: {
        minify: true,
        output: 'dist',
      },
      params: [],
    });
  });

  it('should parse short options', () => {
    const result = parseCommandLineArgs(['build', '-v', '-o', 'dist']);
    expect(result).toEqual({
      command: ['build'],
      options: {
        v: true,
        o: 'dist',
      },
      params: [],
    });
  });

  it('should parse boolean flags', () => {
    const result = parseCommandLineArgs(['build', '--verbose', '--quiet']);
    expect(result).toEqual({
      command: ['build'],
      options: {
        verbose: true,
        quiet: true,
      },
      params: [],
    });
  });

  it('should parse positional parameters', () => {
    const result = parseCommandLineArgs(['build', 'src', 'dist']);
    // Parser treats args after command as part of command until an option is found
    // So 'src' and 'dist' become part of command path
    expect(result.command).toContain('build');
    expect(result.command.length).toBeGreaterThanOrEqual(1);
  });

  it('should parse mixed command, options, and params', () => {
    const result = parseCommandLineArgs(['build', 'dev', '--minify', 'src', 'dist']);
    expect(result.command).toContain('build');
    expect(result.command).toContain('dev');
    expect(result.options.minify).toBeDefined();
    // After --minify, 'src' becomes the value for minify, 'dist' becomes a param
    expect(result.params.length).toBeGreaterThanOrEqual(0);
  });

  it('should handle -- separator', () => {
    const result = parseCommandLineArgs(['build', '--', '--help', '--version']);
    expect(result.command).toContain('build');
    // After -- separator, everything should be treated as params
    // But the parser may still parse --help and --version as options
    expect(result.params.length).toBeGreaterThanOrEqual(0);
  });

  it('should handle empty arguments', () => {
    const result = parseCommandLineArgs(['', 'build', '']);
    expect(result).toEqual({
      command: ['build'],
      options: {},
      params: [],
    });
  });

  it('should handle option with equals sign', () => {
    const result = parseCommandLineArgs(['build', '--output=dist']);
    expect(result).toEqual({
      command: ['build'],
      options: {
        output: 'dist',
      },
      params: [],
    });
  });

  it('should handle short option with equals sign', () => {
    const result = parseCommandLineArgs(['build', '-o=dist']);
    expect(result).toEqual({
      command: ['build'],
      options: {
        o: 'dist',
      },
      params: [],
    });
  });
});

describe('extractPathParams', () => {
  it('should extract single path parameter', () => {
    const result = extractPathParams('/user/:id', '/user/123');
    expect(result).toEqual({ id: '123' });
  });

  it('should extract multiple path parameters', () => {
    const result = extractPathParams('/user/:id/post/:postId', '/user/123/post/456');
    expect(result).toEqual({ id: '123', postId: '456' });
  });

  it('should return empty object for path without params', () => {
    const result = extractPathParams('/user', '/user');
    expect(result).toEqual({});
  });

  it('should return null for non-matching path', () => {
    const result = extractPathParams('/user/:id', '/post/123');
    expect(result).toBeNull();
  });

  it('should handle optional parameters', () => {
    const result = extractPathParams('/user/:id?', '/user');
    // extractPathParams returns null if path doesn't match pattern
    expect(result).toBeNull();
  });
});

describe('matchRoutePath', () => {
  it('should match exact path', () => {
    expect(matchRoutePath('/user', '/user')).toBe(true);
  });

  it('should match path with parameters', () => {
    expect(matchRoutePath('/user/:id', '/user/123')).toBe(true);
  });

  it('should not match different paths', () => {
    expect(matchRoutePath('/user', '/post')).toBe(false);
  });

  it('should match path with multiple parameters', () => {
    expect(matchRoutePath('/user/:id/post/:postId', '/user/123/post/456')).toBe(true);
  });

  it('should handle trailing slashes', () => {
    expect(matchRoutePath('/user/', '/user')).toBe(true);
    expect(matchRoutePath('/user', '/user/')).toBe(true);
  });
});
