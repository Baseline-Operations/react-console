/**
 * Command-line argument parser
 * Parses command-line arguments into commands, options, and parameters
 * Supports quoted strings, escaped characters, and preserves whitespace in quotes
 */

/**
 * Parsed command-line arguments
 */
export interface ParsedArgs {
  /** Command path (array of command names) */
  command: string[];
  /** Parsed options/flags (key-value pairs) - may contain numbers after normalization */
  options: Record<string, string | number | boolean | string[]>;
  /** Positional arguments (after command and options) */
  params: string[];
}

/**
 * Parse quoted string
 * Handles single quotes, double quotes, and escaped characters
 *
 * @param input - Input string to parse
 * @param startIndex - Starting index in input
 * @returns Parsed value and new index
 */
function parseQuotedString(
  input: string,
  startIndex: number
): { value: string; endIndex: number } | null {
  const quote = input[startIndex];
  if (quote !== '"' && quote !== "'") {
    return null;
  }

  let value = '';
  let i = startIndex + 1;
  let escaped = false;

  while (i < input.length) {
    const char = input[i]!;

    if (escaped) {
      if (char === 'n') {
        value += '\n';
      } else if (char === 't') {
        value += '\t';
      } else if (char === 'r') {
        value += '\r';
      } else if (char === '\\') {
        value += '\\';
      } else if (char === quote) {
        value += quote;
      } else {
        value += char;
      }
      escaped = false;
    } else if (char === '\\') {
      escaped = true;
    } else if (char === quote) {
      return { value, endIndex: i + 1 };
    } else {
      value += char;
    }

    i++;
  }

  // Unclosed quote - return what we have
  return { value, endIndex: i };
}

/**
 * Parse command-line arguments
 * Converts process.argv array into structured command, options, and params
 * Supports quoted strings, escaped characters, and preserves whitespace in quotes
 *
 * @param args - Command-line arguments array (typically process.argv.slice(2))
 * @returns Parsed arguments with command path, options, and params
 *
 * @example
 * ```ts
 * // Input: ['build', '--minify', '--output', 'dist', 'prod']
 * // Output: {
 * //   command: ['build'],
 * //   options: { minify: true, output: 'dist' },
 * //   params: ['prod']
 * // }
 *
 * // Quoted strings:
 * // Input: ['build', '--message', '"Hello World"']
 * // Output: { command: ['build'], options: { message: 'Hello World' }, params: [] }
 * ```
 */
export function parseCommandLineArgs(args: string[]): ParsedArgs {
  const result: ParsedArgs = {
    command: [],
    options: {},
    params: [],
  };

  let i = 0;
  let collectingCommand = true;

  while (i < args.length) {
    let arg = args[i]!;

    // Skip empty arguments
    if (!arg || arg.trim() === '') {
      i++;
      continue;
    }

    // Handle quoted strings in arguments
    if ((arg.startsWith('"') || arg.startsWith("'")) && arg.length > 1) {
      const parsed = parseQuotedString(arg, 0);
      if (parsed) {
        arg = parsed.value;
      }
    }

    // Check if it's an option (starts with -- or -)
    if (arg.startsWith('--')) {
      collectingCommand = false;
      const optionName = arg.slice(2);

      // Handle empty option name (just --)
      if (optionName === '') {
        // Treat as positional argument (common pattern: -- to stop option parsing)
        collectingCommand = false;
        i++;
        continue;
      }

      // Handle --option=value syntax (with quoted values)
      if (optionName.includes('=')) {
        const [name, value] = optionName.split('=', 2);
        if (name) {
          // Parse quoted value if present
          let parsedValue: string = value || '';
          if (value && (value.startsWith('"') || value.startsWith("'")) && value.length > 1) {
            const parsed = parseQuotedString(value, 0);
            if (parsed) {
              parsedValue = parsed.value;
            }
          }
          result.options[name] = parsedValue || true;
        }
      } else {
        // Check if next arg is a value (not an option)
        const nextArg = args[i + 1];
        if (nextArg && !nextArg.startsWith('-') && nextArg !== '--') {
          // Parse quoted value if present
          let parsedValue: string = nextArg;
          if ((nextArg.startsWith('"') || nextArg.startsWith("'")) && nextArg.length > 1) {
            const parsed = parseQuotedString(nextArg, 0);
            if (parsed) {
              parsedValue = parsed.value;
            }
          }
          result.options[optionName] = parsedValue;
          i++; // Skip next arg as it's the value
        } else {
          // Boolean flag
          result.options[optionName] = true;
        }
      }
    } else if (arg.startsWith('-') && arg.length > 1) {
      collectingCommand = false;
      // Short option (-f or -f value)
      const optionName = arg.slice(1);

      // Handle -abc as multiple boolean flags
      if (optionName.length > 1 && !optionName.includes('=')) {
        for (const char of optionName) {
          result.options[char] = true;
        }
      } else if (optionName.includes('=')) {
        const [name, value] = optionName.split('=', 2);
        if (name) {
          // Parse quoted value if present
          let parsedValue: string = value || '';
          if (value && (value.startsWith('"') || value.startsWith("'")) && value.length > 1) {
            const parsed = parseQuotedString(value, 0);
            if (parsed) {
              parsedValue = parsed.value;
            }
          }
          result.options[name] = parsedValue || true;
        }
      } else {
        const nextArg = args[i + 1];
        if (nextArg && !nextArg.startsWith('-') && nextArg !== '--') {
          // Parse quoted value if present
          let parsedValue: string = nextArg;
          if ((nextArg.startsWith('"') || nextArg.startsWith("'")) && nextArg.length > 1) {
            const parsed = parseQuotedString(nextArg, 0);
            if (parsed) {
              parsedValue = parsed.value;
            }
          }
          result.options[optionName] = parsedValue;
          i++; // Skip next arg
        } else {
          result.options[optionName] = true;
        }
      }
    } else {
      // Positional argument
      // Parse quoted value if present
      let parsedArg: string = arg;
      if ((arg.startsWith('"') || arg.startsWith("'")) && arg.length > 1) {
        const parsed = parseQuotedString(arg, 0);
        if (parsed) {
          parsedArg = parsed.value;
        }
      }

      if (collectingCommand && !parsedArg.includes('/')) {
        // Treat as command if still collecting and not a path
        result.command.push(parsedArg);
      } else {
        collectingCommand = false;
        result.params.push(parsedArg);
      }
    }

    i++;
  }

  return result;
}

/**
 * Extract path parameters from a route path
 *
 * @param routePath - Route path pattern (e.g., '/profile/:id')
 * @param actualPath - Actual path to match (e.g., '/profile/123')
 * @returns Object with extracted parameters or null if no match
 *
 * @example
 * ```ts
 * extractPathParams('/profile/:id', '/profile/123')
 * // { id: '123' }
 * ```
 */
export function extractPathParams(
  routePath: string,
  actualPath: string
): Record<string, string> | null {
  const routeParts = routePath.split('/').filter(Boolean);
  const actualParts = actualPath.split('/').filter(Boolean);

  if (routeParts.length !== actualParts.length) {
    return null;
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < routeParts.length; i++) {
    const routePart = routeParts[i]!;
    const actualPart = actualParts[i]!;

    if (routePart.startsWith(':')) {
      // Parameter
      const paramName = routePart.slice(1);
      params[paramName] = actualPart;
    } else if (routePart !== actualPart) {
      // Static part doesn't match
      return null;
    }
  }

  return params;
}

/**
 * Match a route path pattern against an actual path
 *
 * @param routePath - Route path pattern (supports :param syntax)
 * @param actualPath - Actual path to match
 * @returns True if path matches pattern
 */
export function matchRoutePath(routePath: string, actualPath: string): boolean {
  return extractPathParams(routePath, actualPath) !== null;
}
