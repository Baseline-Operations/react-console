/**
 * Version flag utilities
 * Handles --version and -v flags to display application version
 * 
 * Note: Version display is handled by VersionDisplay component (TSX)
 * This file contains only utility functions for checking version flags
 */

import type { ParsedArgs } from './parser';

/**
 * Check if version flag is requested
 * 
 * @param parsedArgs - Parsed command-line arguments
 * @returns True if version flag is present
 */
export function isVersionRequested(parsedArgs: ParsedArgs): boolean {
  return !!(
    parsedArgs.options.version ||
    parsedArgs.options['--version'] ||
    parsedArgs.options.v ||
    parsedArgs.options['-v']
  );
}

/**
 * Get application version
 * 
 * @returns Application version string or undefined
 */
export function getAppVersion(): string | undefined {
  if (typeof global !== 'undefined' && global.__react_console_cli_app__) {
    return global.__react_console_cli_app__.version;
  }
  return undefined;
}
