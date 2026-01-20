/**
 * Help-specific matching utilities
 * Finds help for specific commands/routes with cascading fallback
 */

import { type ReactNode } from 'react';
import { extractComponentMetadata, type ComponentMetadata } from './matcher';
import type { ParsedArgs } from './parser';

/**
 * Find help for a specific command path
 * Cascades up the command tree if no help found
 */
export function findCommandHelp(
  commandPath: string[],
  metadata: ComponentMetadata[],
  currentIndex: number = 0
): ComponentMetadata | null {
  if (currentIndex >= commandPath.length) {
    return null;
  }

  const commandName = commandPath[currentIndex]!;

  // Find matching command
  for (const item of metadata) {
    if (item.type === 'command') {
      const nameMatch = item.name === commandName;
      const aliasMatch = item.aliases?.includes(commandName);

      if (nameMatch || aliasMatch) {
        // If this is the last command in path, check for help
        if (currentIndex === commandPath.length - 1) {
          // Return this command (has help prop or description for auto-generation)
          return item;
        }

        // Otherwise, recursively find help for subcommand
        if (item.children) {
          const subHelp = findCommandHelp(commandPath, item.children, currentIndex + 1);
          if (subHelp) {
            return subHelp;
          }
        }

        // If no subcommand help found, return this command's help
        return item;
      }
    }
  }

  return null;
}

/**
 * Find help for a specific route
 */
export function findRouteHelp(
  path: string,
  metadata: ComponentMetadata[]
): ComponentMetadata | null {
  for (const item of metadata) {
    if (item.type === 'route' && item.path) {
      // Try exact match
      if (item.path === path) {
        return item;
      }

      // Try pattern match (simplified - just check if path starts with route path)
      // Full pattern matching would use extractPathParams
      if (path.startsWith(item.path.split(':')[0]!)) {
        return item;
      }
    }
  }

  return null;
}

/**
 * Find help for current command/route based on parsed args
 * Returns the most specific help available with cascading fallback
 */
export function findHelp(
  parsedArgs: ParsedArgs,
  children: ReactNode
): ComponentMetadata | null {
  const metadata = extractComponentMetadata(children);

  // If there's a command path, try to find command help
  if (parsedArgs.command.length > 0) {
    const commandHelp = findCommandHelp(parsedArgs.command, metadata);
    if (commandHelp) {
      return commandHelp;
    }
  }

  // Try to find route help
  const pathFromCommand = parsedArgs.command.length > 0 ? '/' + parsedArgs.command.join('/') : undefined;
  if (pathFromCommand) {
    const routeHelp = findRouteHelp(pathFromCommand, metadata);
    if (routeHelp) {
      return routeHelp;
    }
  }

  // Check if first param looks like a route path
  if (parsedArgs.params.length > 0) {
    const firstParam = parsedArgs.params[0]!;
    if (firstParam.startsWith('/')) {
      const routeHelp = findRouteHelp(firstParam, metadata);
      if (routeHelp) {
        return routeHelp;
      }
    }
  }

  // No specific help found, return null (will use default/root help)
  return null;
}
