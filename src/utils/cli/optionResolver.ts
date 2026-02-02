/**
 * Option alias resolution
 * Resolves option aliases to their canonical names
 */

import type { ParsedArgs } from './parser';
import type { CommandOption } from '../../components/cli/Command';

/**
 * Resolve option aliases in parsed arguments
 * Maps aliases to their canonical option names
 *
 * @param parsedArgs - Parsed command-line arguments
 * @param allOptions - All available options (with aliases defined)
 * @returns ParsedArgs with aliases resolved to canonical names
 */
export function resolveOptionAliases(
  parsedArgs: ParsedArgs,
  allOptions: Record<string, CommandOption>
): ParsedArgs {
  const resolved: ParsedArgs = {
    command: [...parsedArgs.command],
    options: {},
    params: [...parsedArgs.params],
  };

  // Create alias-to-canonical mapping
  const aliasMap: Record<string, string> = {};
  for (const [canonicalName, optionDef] of Object.entries(allOptions)) {
    if (optionDef.aliases) {
      for (const alias of optionDef.aliases) {
        aliasMap[alias] = canonicalName;
      }
    }
  }

  // Resolve options
  for (const [key, value] of Object.entries(parsedArgs.options)) {
    // Check if this is an alias
    if (aliasMap[key]) {
      const canonicalName = aliasMap[key]!;
      // If canonical name already exists, merge (canonical takes precedence)
      if (!(canonicalName in resolved.options)) {
        resolved.options[canonicalName] = value;
      }
    } else if (allOptions[key]) {
      // Direct match to canonical name
      resolved.options[key] = value;
    } else {
      // Unknown option, keep as-is
      resolved.options[key] = value;
    }
  }

  return resolved;
}

/**
 * Find option name by alias
 *
 * @param alias - Alias to look up (e.g., 'h')
 * @param allOptions - All available options
 * @returns Canonical option name or undefined
 */
export function findOptionByAlias(
  alias: string,
  allOptions: Record<string, CommandOption>
): string | undefined {
  for (const [canonicalName, optionDef] of Object.entries(allOptions)) {
    if (canonicalName === alias) {
      return canonicalName;
    }
    if (optionDef.aliases?.includes(alias)) {
      return canonicalName;
    }
  }
  return undefined;
}
