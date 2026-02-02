/**
 * Interactive CLI utilities
 * Provides utilities for interactive CLI mode including tab completion and history navigation
 */

import type { ParsedArgs } from './parser';
import type { ComponentMetadata } from './matcher';
import { generateCompletions } from './completion';
import { getPreviousCommand, getNextCommand, resetHistoryIndex } from './history';

/**
 * Interactive input handler options
 */
export interface InteractiveInputOptions {
  /** Enable tab completion (default: true) */
  enableCompletion?: boolean;
  /** Enable history navigation (default: true) */
  enableHistory?: boolean;
  /** Custom completion handler */
  onCompletion?: (input: string, completions: string[]) => string | null;
  /** Custom history handler */
  onHistory?: (direction: 'up' | 'down', currentInput: string) => string | null;
}

/**
 * Handle tab completion for interactive input
 *
 * @param input - Current input line
 * @param cursorPosition - Current cursor position
 * @param metadata - Component metadata for command structure
 * @param parsedArgs - Current parsed arguments
 * @returns Completion result with suggestions and replacement
 */
export function handleTabCompletion(
  input: string,
  cursorPosition: number,
  metadata: ComponentMetadata[],
  parsedArgs?: ParsedArgs
): { suggestions: string[]; replacement?: string } | null {
  // Extract the word at cursor position
  const beforeCursor = input.slice(0, cursorPosition);
  // const afterCursor = input.slice(cursorPosition); // Not currently used

  // Find the last word boundary
  const lastSpace = beforeCursor.lastIndexOf(' ');
  const currentWord = beforeCursor.slice(lastSpace + 1);

  // Parse current input to get command path
  const words = beforeCursor.trim().split(/\s+/);
  const commandPath = words.filter((w) => !w.startsWith('-'));

  // Generate completions
  const result = generateCompletions(commandPath, metadata, parsedArgs);

  if (result.suggestions.length === 0) {
    return null;
  }

  // If only one suggestion and it's a complete match, return replacement
  if (result.suggestions.length === 1 && result.complete) {
    const suggestion = result.suggestions[0]!;
    if (suggestion.startsWith(currentWord)) {
      return {
        suggestions: [suggestion],
        replacement: suggestion.slice(currentWord.length),
      };
    }
  }

  return {
    suggestions: result.suggestions,
  };
}

/**
 * Handle history navigation for interactive input
 *
 * @param direction - Navigation direction ('up' for previous, 'down' for next)
 * @param currentInput - Current input line
 * @returns Previous or next command from history, or null
 */
export function handleHistoryNavigation(
  direction: 'up' | 'down',
  currentInput: string
): string | null {
  if (direction === 'up') {
    const previous = getPreviousCommand();
    if (previous) {
      return (
        previous.args.params.join(' ') +
        (previous.args.options && Object.keys(previous.args.options).length > 0
          ? ' ' +
            Object.entries(previous.args.options)
              .map(([k, v]) => {
                if (v === true) return `--${k}`;
                if (v === false) return `--no-${k}`;
                return `--${k}=${v}`;
              })
              .join(' ')
          : '')
      );
    }
  } else {
    const next = getNextCommand();
    if (next) {
      return (
        next.args.params.join(' ') +
        (next.args.options && Object.keys(next.args.options).length > 0
          ? ' ' +
            Object.entries(next.args.options)
              .map(([k, v]) => {
                if (v === true) return `--${k}`;
                if (v === false) return `--no-${k}`;
                return `--${k}=${v}`;
              })
              .join(' ')
          : '')
      );
    }
    // If no next, reset to current input
    resetHistoryIndex();
    return currentInput;
  }

  return null;
}

/**
 * Format command for history storage
 *
 * @param command - Command path
 * @param args - Parsed arguments
 * @returns Formatted command string
 */
export function formatCommandForHistory(
  command: string[],
  args: {
    options: Record<string, string | number | boolean | string[]>;
    params: (string | number | boolean)[];
  }
): string {
  const parts: string[] = [];

  // Add command path
  if (command.length > 0) {
    parts.push(...command);
  }

  // Add options
  if (args.options && Object.keys(args.options).length > 0) {
    for (const [key, value] of Object.entries(args.options)) {
      if (value === true) {
        parts.push(`--${key}`);
      } else if (value === false) {
        parts.push(`--no-${key}`);
      } else {
        parts.push(`--${key}=${String(value)}`);
      }
    }
  }

  // Add params
  if (args.params && args.params.length > 0) {
    parts.push(...args.params.map(String));
  }

  return parts.join(' ');
}
