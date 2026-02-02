/**
 * Option collector utilities
 * Collects options from command path (current command + all parent commands)
 */

import type { ComponentMetadata } from './matcher';
import type { ParsedArgs } from './parser';

/**
 * Collect all options from command path (current + parents)
 * Returns merged options from all commands in the path
 */
export function collectCommandOptions(
  commandPath: string[],
  metadata: ComponentMetadata[],
  routerOptions?: Record<string, import('../../components/cli/Command').CommandOption>
): Record<string, import('../../components/cli/Command').CommandOption> {
  const allOptions: Record<string, import('../../components/cli/Command').CommandOption> = {};

  // Start with router-level global options
  if (routerOptions) {
    Object.assign(allOptions, routerOptions);
  }

  // Collect options from each command in the path
  let currentMetadata = metadata;
  for (let i = 0; i < commandPath.length; i++) {
    const commandName = commandPath[i]!;

    // Find matching command
    for (const item of currentMetadata) {
      if (item.type === 'command') {
        const nameMatch = item.name === commandName;
        const aliasMatch = item.aliases?.includes(commandName);

        if (nameMatch || aliasMatch) {
          // Merge this command's options
          if (item.options) {
            Object.assign(allOptions, item.options);
          }

          // Move to children for next iteration
          if (item.children) {
            currentMetadata = item.children;
          }
          break;
        }
      }
    }
  }

  return allOptions;
}

/**
 * Check if help is available for a command/route
 * Returns false if noHelp is set on the component or any parent
 */
export function isHelpAvailable(parsedArgs: ParsedArgs, metadata: ComponentMetadata[]): boolean {
  // If there's a command path, check the matched command
  if (parsedArgs.command.length > 0) {
    let currentMetadata = metadata;
    for (let i = 0; i < parsedArgs.command.length; i++) {
      const commandName = parsedArgs.command[i]!;

      for (const item of currentMetadata) {
        if (item.type === 'command') {
          const nameMatch = item.name === commandName;
          const aliasMatch = item.aliases?.includes(commandName);

          if (nameMatch || aliasMatch) {
            // Check parent's noHelp (cascades down) - if any parent has noHelp, help is disabled
            if (item.noHelp) {
              return false;
            }

            // If this is the last command, check its noHelp
            if (i === parsedArgs.command.length - 1) {
              return !item.noHelp;
            }

            // Move to children
            if (item.children) {
              currentMetadata = item.children;
            }
            break;
          }
        }
      }
    }
  }

  // At root level, help is available (router-level noHelp is checked separately)
  return true;
}
