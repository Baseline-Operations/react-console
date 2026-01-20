/**
 * Component matching logic for CommandRouter
 * Functions for finding and matching components based on parsed arguments
 */

import type { ReactNode } from 'react';
import type { ParsedArgs } from '../../../utils/cli/parser';
import type { ComponentMetadata } from '../../../utils/cli/matcher';

/**
 * Find command metadata by path
 * Recursively searches metadata tree to find command matching the given path
 * 
 * @param metadata - Component metadata array
 * @param path - Command path to match
 * @param index - Current index in path (for recursion)
 * @returns Matching metadata or null
 */
export function findCommandMetadata(
  metadata: ComponentMetadata[],
  path: string[],
  index: number = 0
): ComponentMetadata | null {
  if (index >= path.length) return null;
  
  const cmdName = path[index]!;
  for (const item of metadata) {
    if (item.type === 'command' && (item.name === cmdName || item.aliases?.includes(cmdName))) {
      if (index === path.length - 1) {
        return item;
      }
      if (item.children) {
        const subMatch = findCommandMetadata(item.children, path, index + 1);
        if (subMatch) return subMatch;
      }
      return item;
    }
  }
  return null;
}

/**
 * Find route metadata by path
 * Searches metadata array to find route matching the given path
 * 
 * @param metadata - Component metadata array
 * @param routePath - Route path to match
 * @returns Matching metadata or null
 */
export function findRouteMetadata(
  metadata: ComponentMetadata[],
  routePath: string
): ComponentMetadata | null {
  for (const item of metadata) {
    if (item.type === 'route' && item.path === routePath) {
      return item;
    }
  }
  return null;
}

/**
 * Get matched metadata for current command/route
 * 
 * @param matchResult - Result from matchComponent
 * @param parsedArgs - Parsed command-line arguments
 * @param metadata - All component metadata
 * @returns Matched metadata or null
 */
export function getMatchedMetadata(
  matchResult: { isDefault: boolean; component?: ReactNode; route?: string; routeParams?: Record<string, string> },
  parsedArgs: ParsedArgs,
  metadata: ComponentMetadata[]
): ComponentMetadata | null {
  if (matchResult.isDefault || !matchResult.component) {
    return null;
  }
  
  // Find the metadata that matches the current command/route
  if (parsedArgs.command.length > 0) {
    return findCommandMetadata(metadata, parsedArgs.command, 0);
  }
  
  if (matchResult.route) {
    return findRouteMetadata(metadata, matchResult.route);
  }
  
  return null;
}
