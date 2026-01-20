/**
 * Routing logic for CommandRouter
 * Functions for handling navigation and route/command matching
 */

import type { ParsedArgs } from '../../../utils/cli/parser';

/**
 * Navigation options for programmatic navigation
 */
export interface NavigationOptions {
  params?: Record<string, string>;
  options?: Record<string, string | number | boolean | string[]>;
  carryOver?: boolean;
}

/**
 * Create navigation function
 * Returns a function that can be used to programmatically navigate to different commands/routes
 * 
 * @param parsedArgs - Current parsed arguments
 * @param setParsedArgs - State setter for parsed arguments
 * @returns Navigation function
 */
export function createNavigateFunction(
  parsedArgs: ParsedArgs,
  setParsedArgs: (args: ParsedArgs) => void
): (path: string, navOptions?: NavigationOptions) => void {
  return (path: string, navOptions?: NavigationOptions) => {
    // Parse the path and update parsedArgs
    const pathParts = path.split('/').filter(Boolean);
    
    // Convert typed options to strings for ParsedArgs (command line args are always strings)
    const convertOptionsToStrings = (opts: Record<string, string | number | boolean | string[]>): Record<string, string | boolean | string[]> => {
      const result: Record<string, string | boolean | string[]> = {};
      for (const [key, value] of Object.entries(opts)) {
        if (typeof value === 'number') {
          result[key] = String(value);
        } else {
          result[key] = value;
        }
      }
      return result;
    };
    
    const newOptions = navOptions?.carryOver 
      ? { ...parsedArgs.options, ...convertOptionsToStrings(navOptions.options || {}) }
      : navOptions?.options 
        ? convertOptionsToStrings(navOptions.options)
        : {};
    
    const newArgs: ParsedArgs = {
      command: pathParts,
      options: newOptions,
      params: navOptions?.params ? Object.values(navOptions.params) : [],
    };
    setParsedArgs(newArgs);
  };
}
