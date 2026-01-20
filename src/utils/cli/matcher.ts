/**
 * CLI component matcher
 * Matches commands/routes to components based on parsed arguments
 */

import { type ReactNode, Children, isValidElement } from 'react';
import { extractPathParams } from './parser';
import type { ParsedArgs } from './parser';

/**
 * Component metadata extracted from React tree
 */
export interface ComponentMetadata {
  type: 'command' | 'route' | 'default';
  name?: string; // Command name
  path?: string; // Route path or command path
  aliases?: string[];
  component: ReactNode;
  children?: ComponentMetadata[];
  description?: string;
  help?: ReactNode;
  noHelp?: boolean; // Disable help for this component (or cascades from parent)
  guard?: (from: string | undefined, to: string | undefined, parsedArgs: import('./parser').ParsedArgs, metadata: ComponentMetadata) => boolean | string; // Route guard function
  redirect?: string; // Redirect path
  middleware?: Array<(parsedArgs: import('./parser').ParsedArgs, metadata: ComponentMetadata) => import('./parser').ParsedArgs | false | void>; // Command middleware
  before?: (parsedArgs: import('./parser').ParsedArgs, metadata: ComponentMetadata) => void | Promise<void>; // Before hook (for commands and default)
  after?: (parsedArgs: import('./parser').ParsedArgs, metadata: ComponentMetadata) => void | Promise<void>; // After hook (for commands and default)
  exitAfterExecution?: boolean; // Exit after execution (for commands)
  exitCode?: number; // Command-specific exit code
  params?: Array<{
    name: string;
    type: 'string' | 'number' | 'boolean';
    required?: boolean;
    description?: string;
  }>;
  options?: Record<string, {
    type: 'string' | 'number' | 'boolean' | 'string[]';
    default?: string | number | boolean | string[];
    description?: string;
    aliases?: string[];
  }>;
}

/**
 * Match result
 */
export interface MatchResult {
  component: ReactNode | null;
  route?: string;
  routeParams?: Record<string, string>;
  isDefault: boolean;
}

/**
 * Extract component metadata from React children
 * Recursively traverses the component tree to find Command, Route, and Default components
 * @param parentNoHelp - If true, cascades noHelp to all children (from router)
 */
export function extractComponentMetadata(children: ReactNode, parentNoHelp?: boolean): ComponentMetadata[] {
  const metadata: ComponentMetadata[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }

    const { type, props } = child;
    const typedProps = props as Record<string, unknown>;

    // Check if it's a Command component
    // Use displayName or function name to identify component type
    let componentName: string | undefined;
    if (type && typeof type === 'object' && 'displayName' in type) {
      componentName = (type as { displayName?: string }).displayName;
    } else if (type && typeof type === 'function') {
      componentName = (type as { displayName?: string; name?: string }).displayName || (type as { name?: string }).name;
    }
    
    if (componentName === 'Command') {
      const noHelp = parentNoHelp || (typedProps.noHelp as boolean | undefined);
      const commandMetadata: ComponentMetadata = {
        type: 'command',
        name: typedProps.name as string | undefined,
        path: typedProps.path as string | undefined,
        aliases: typedProps.aliases as string[] | undefined,
        component: child,
        description: typedProps.description as string | undefined,
        help: typedProps.help as ReactNode | undefined,
        noHelp,
        middleware: typedProps.middleware as ComponentMetadata['middleware'],
        before: typedProps.before as ComponentMetadata['before'],
        after: typedProps.after as ComponentMetadata['after'],
        exitAfterExecution: typedProps.exitAfterExecution as ComponentMetadata['exitAfterExecution'],
        exitCode: typedProps.exitCode as ComponentMetadata['exitCode'],
        params: typedProps.params as ComponentMetadata['params'],
        options: typedProps.options as ComponentMetadata['options'],
        children: typedProps.children ? extractComponentMetadata(typedProps.children as ReactNode, noHelp) : undefined,
      };
      metadata.push(commandMetadata);
    }
    // Check if it's a Route component
    else if (componentName === 'Route') {
      const noHelp = parentNoHelp || (typedProps.noHelp as boolean | undefined);
      const routeMetadata: ComponentMetadata = {
        type: 'route',
        path: typedProps.path as string | undefined,
        component: child,
        description: typedProps.description as string | undefined,
        help: typedProps.help as ReactNode | undefined,
        noHelp,
        guard: typedProps.guard as ComponentMetadata['guard'],
        redirect: typedProps.redirect as string | undefined,
        children: typedProps.children ? extractComponentMetadata(typedProps.children as ReactNode, noHelp) : undefined,
      };
      metadata.push(routeMetadata);
    }
    // Check if it's a Default component
    else if (componentName === 'Default') {
      const noHelp = parentNoHelp || (typedProps.noHelp as boolean | undefined);
      const defaultMetadata: ComponentMetadata = {
        type: 'default',
        component: child,
        description: typedProps.description as string | undefined,
        help: typedProps.help as ReactNode | undefined,
        noHelp,
        before: typedProps.before as ComponentMetadata['before'],
        after: typedProps.after as ComponentMetadata['after'],
        children: typedProps.children ? extractComponentMetadata(typedProps.children as ReactNode, noHelp) : undefined,
      };
      metadata.push(defaultMetadata);
    }
    // Skip HelpWrapper (internal component)
    else if (componentName === 'HelpWrapper') {
      // HelpWrapper is an internal component, don't extract its metadata
      // But recursively check its help prop (the actual help component)
      if (typedProps.help && typeof typedProps.help === 'object') {
        const nestedMetadata = extractComponentMetadata(typedProps.help as ReactNode);
        metadata.push(...nestedMetadata);
      }
      // Also check children if HelpWrapper has them
      if (typedProps.children) {
        const nestedMetadata = extractComponentMetadata(typedProps.children as ReactNode);
        metadata.push(...nestedMetadata);
      }
      return; // Don't process HelpWrapper itself
    }
    // Recursively check children if it's a container component
    else if (typedProps && typedProps.children) {
      const nestedMetadata = extractComponentMetadata(typedProps.children as ReactNode);
      metadata.push(...nestedMetadata);
    }
  });

  return metadata;
}

/**
 * Match command to component metadata
 * Recursively matches command path to nested commands
 */
function matchCommand(
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
      // Check if name or alias matches
      const nameMatch = item.name === commandName;
      const aliasMatch = item.aliases?.includes(commandName);

      if (nameMatch || aliasMatch) {
        // If this is the last command in path, return it
        if (currentIndex === commandPath.length - 1) {
          return item;
        }

        // Otherwise, recursively match subcommands
        if (item.children) {
          const subMatch = matchCommand(commandPath, item.children, currentIndex + 1);
          if (subMatch) {
            return subMatch;
          }
        }

        // If no subcommand matched, return this command (it may have a Default child)
        return item;
      }
    }
  }

  return null;
}

/**
 * Match route to component metadata
 */
function matchRoute(
  path: string,
  metadata: ComponentMetadata[]
): { metadata: ComponentMetadata; routeParams: Record<string, string> } | null {
  for (const item of metadata) {
    if (item.type === 'route' && item.path) {
      // Try exact match first
      if (item.path === path) {
        return { metadata: item, routeParams: {} };
      }

      // Try pattern match (with :param syntax)
      const routeParams = extractPathParams(item.path, path);
      if (routeParams !== null) {
        return { metadata: item, routeParams };
      }
    }
  }

  return null;
}

/**
 * Find default component in metadata
 */
function findDefault(metadata: ComponentMetadata[]): ComponentMetadata | null {
  for (const item of metadata) {
    if (item.type === 'default') {
      return item;
    }
  }
  return null;
}

/**
 * Match parsed arguments to component
 * Returns the component that should be rendered based on command/route matching
 */
export function matchComponent(
  parsedArgs: ParsedArgs,
  children: ReactNode
): MatchResult {
  const metadata = extractComponentMetadata(children);

  // If there's a command path, try to match commands
  if (parsedArgs.command.length > 0) {
    const commandMatch = matchCommand(parsedArgs.command, metadata);
    if (commandMatch) {
      // Check if matched command has a path and we should treat it as a route
      if (commandMatch.path) {
        const routePath = commandMatch.path;
        return {
          component: commandMatch.component,
          route: routePath,
          isDefault: false,
        };
      }

      // Return command component
      return {
        component: commandMatch.component,
        isDefault: false,
      };
    }
  }

  // Try to match routes (if command path looks like a route path)
  const pathFromCommand = parsedArgs.command.length > 0 ? '/' + parsedArgs.command.join('/') : undefined;
  if (pathFromCommand) {
    const routeMatch = matchRoute(pathFromCommand, metadata);
    if (routeMatch) {
      return {
        component: routeMatch.metadata.component,
        route: routeMatch.metadata.path,
        routeParams: routeMatch.routeParams,
        isDefault: false,
      };
    }
  }

  // Check if first param looks like a route path
  if (parsedArgs.params.length > 0) {
    const firstParam = parsedArgs.params[0]!;
    if (firstParam.startsWith('/')) {
      const routeMatch = matchRoute(firstParam, metadata);
      if (routeMatch) {
        return {
          component: routeMatch.metadata.component,
          route: routeMatch.metadata.path,
          routeParams: routeMatch.routeParams,
          isDefault: false,
        };
      }
    }
  }

  // No match found, return default component
  const defaultComponent = findDefault(metadata);
  return {
    component: defaultComponent?.component || null,
    isDefault: true,
  };
}
