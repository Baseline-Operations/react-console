/**
 * Tests for CLI command suggestion utilities
 */

import { describe, it, expect } from 'vitest';
import {
  findSimilarCommands,
  getAllCommandNames,
  levenshteinDistance,
} from '../../../utils/cli/commandSuggestions';
import type { ComponentMetadata } from '../../../utils/cli/matcher';

describe('levenshteinDistance', () => {
  it('should calculate distance for identical strings', () => {
    expect(levenshteinDistance('build', 'build')).toBe(0);
  });

  it('should calculate distance for similar strings', () => {
    expect(levenshteinDistance('build', 'buil')).toBe(1);
    expect(levenshteinDistance('build', 'builx')).toBe(2);
  });

  it('should calculate distance for different strings', () => {
    expect(levenshteinDistance('build', 'serve')).toBe(5);
  });

  it('should handle empty strings', () => {
    expect(levenshteinDistance('', 'build')).toBe(5);
    expect(levenshteinDistance('build', '')).toBe(5);
    expect(levenshteinDistance('', '')).toBe(0);
  });

  it('should be case-sensitive', () => {
    expect(levenshteinDistance('build', 'Build')).toBe(1);
  });
});

describe('getAllCommandNames', () => {
  it('should extract command names from metadata', () => {
    const metadata: ComponentMetadata[] = [
      {
        type: 'command',
        name: 'build',
        aliases: ['b'],
      },
      {
        type: 'command',
        name: 'serve',
        aliases: ['s'],
      },
    ];

    const names = getAllCommandNames(metadata);
    expect(names).toContain('build');
    expect(names).toContain('serve');
    expect(names).toContain('b');
    expect(names).toContain('s');
  });

  it('should extract nested command names', () => {
    const metadata: ComponentMetadata[] = [
      {
        type: 'command',
        name: 'build',
        children: [
          {
            type: 'command',
            name: 'dev',
          },
          {
            type: 'command',
            name: 'prod',
          },
        ],
      },
    ];

    const names = getAllCommandNames(metadata);
    expect(names).toContain('build');
    expect(names).toContain('dev');
    expect(names).toContain('prod');
  });

  it('should handle empty metadata', () => {
    const names = getAllCommandNames([]);
    expect(names).toEqual([]);
  });

  it('should skip non-command metadata', () => {
    const metadata: ComponentMetadata[] = [
      {
        type: 'route',
        path: '/home',
      },
      {
        type: 'command',
        name: 'build',
      },
    ];

    const names = getAllCommandNames(metadata);
    expect(names).toEqual(['build']);
  });
});

describe('findSimilarCommands', () => {
  it('should find similar commands', () => {
    const metadata: ComponentMetadata[] = [
      {
        type: 'command',
        name: 'build',
      },
      {
        type: 'command',
        name: 'serve',
      },
      {
        type: 'command',
        name: 'deploy',
      },
    ];

    const suggestions = findSimilarCommands('buil', metadata);
    expect(suggestions).toContain('build');
  });

  it('should limit number of suggestions', () => {
    const metadata: ComponentMetadata[] = [
      {
        type: 'command',
        name: 'build',
      },
      {
        type: 'command',
        name: 'build-dev',
      },
      {
        type: 'command',
        name: 'build-prod',
      },
      {
        type: 'command',
        name: 'build-test',
      },
    ];

    const suggestions = findSimilarCommands('buil', metadata);
    // findSimilarCommands returns up to 3 suggestions by default
    expect(suggestions.length).toBeLessThanOrEqual(3);
  });

  it('should return empty array for no matches', () => {
    const metadata: ComponentMetadata[] = [
      {
        type: 'command',
        name: 'build',
      },
    ];

    const suggestions = findSimilarCommands('xyz', metadata);
    expect(suggestions).toEqual([]);
  });

  it('should include aliases in suggestions', () => {
    const metadata: ComponentMetadata[] = [
      {
        type: 'command',
        name: 'build',
        aliases: ['b'],
      },
    ];

    const suggestions = findSimilarCommands('b', metadata);
    expect(suggestions.length).toBeGreaterThan(0);
  });
});
