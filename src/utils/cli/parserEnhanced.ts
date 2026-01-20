/**
 * Enhanced command-line argument parser
 * 
 * @deprecated This file is deprecated. All enhanced features (quoted strings, escaped characters)
 * have been merged into the base parser.ts. Use `parseCommandLineArgs` from './parser' instead.
 * 
 * This file is kept for backward compatibility but will be removed in a future version.
 */

import type { ParsedArgs } from './parser';

/**
 * Enhanced command-line argument parser
 * 
 * @deprecated Use `parseCommandLineArgs` from './parser' instead. All features have been merged.
 * 
 * @param args - Command-line arguments array (typically process.argv.slice(2))
 * @returns Parsed arguments with command path, options, and params
 */
export function parseCommandLineArgsEnhanced(args: string[]): ParsedArgs {
  // Re-export from base parser (now includes all enhanced features)
  const { parseCommandLineArgs } = require('./parser');
  return parseCommandLineArgs(args);
}
