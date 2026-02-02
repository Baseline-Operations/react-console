/**
 * Command middleware system
 * Provides pre-execution hooks for commands
 */

import type { ParsedArgs } from './parser';
import type { ComponentMetadata } from './matcher';

/**
 * Middleware function type
 * Can return false to stop execution, or modify parsedArgs
 */
export type CommandMiddleware = (
  parsedArgs: ParsedArgs,
  metadata: ComponentMetadata
) => ParsedArgs | false | void;

/**
 * Middleware registry
 * Stores middleware for commands
 */
class MiddlewareRegistry {
  private middleware: Map<string, CommandMiddleware[]> = new Map();
  private globalMiddleware: CommandMiddleware[] = [];

  /**
   * Register global middleware (runs for all commands)
   */
  registerGlobal(middleware: CommandMiddleware): void {
    this.globalMiddleware.push(middleware);
  }

  /**
   * Register middleware for a specific command path
   */
  register(commandPath: string, middleware: CommandMiddleware): void {
    if (!this.middleware.has(commandPath)) {
      this.middleware.set(commandPath, []);
    }
    this.middleware.get(commandPath)!.push(middleware);
  }

  /**
   * Execute middleware chain for a command
   * Returns modified parsedArgs or false if execution should stop
   */
  execute(
    commandPath: string[],
    parsedArgs: ParsedArgs,
    metadata: ComponentMetadata
  ): ParsedArgs | false {
    let currentArgs = parsedArgs;

    // Execute global middleware first
    for (const middleware of this.globalMiddleware) {
      const result = middleware(currentArgs, metadata);
      if (result === false) {
        return false; // Stop execution
      }
      if (result !== undefined) {
        currentArgs = result; // Use modified args
      }
    }

    // Execute command-specific middleware
    const pathKey = commandPath.join(' ');
    const commandMiddleware = this.middleware.get(pathKey);
    if (commandMiddleware) {
      for (const middleware of commandMiddleware) {
        const result = middleware(currentArgs, metadata);
        if (result === false) {
          return false; // Stop execution
        }
        if (result !== undefined) {
          currentArgs = result; // Use modified args
        }
      }
    }

    return currentArgs;
  }

  /**
   * Clear all middleware
   */
  clear(): void {
    this.middleware.clear();
    this.globalMiddleware = [];
  }

  /**
   * Remove middleware for a specific command
   */
  remove(commandPath: string): void {
    this.middleware.delete(commandPath);
  }
}

/**
 * Global middleware registry
 */
export const middlewareRegistry = new MiddlewareRegistry();

/**
 * Register global middleware
 *
 * @param middleware - Middleware function
 *
 * @example
 * ```ts
 * registerGlobalMiddleware((args, metadata) => {
 *   console.log(`Executing command: ${args.command.join(' ')}`);
 * });
 * ```
 */
export function registerGlobalMiddleware(middleware: CommandMiddleware): void {
  middlewareRegistry.registerGlobal(middleware);
}

/**
 * Register middleware for a command
 *
 * @param commandPath - Command path (e.g., 'build' or 'build dev')
 * @param middleware - Middleware function
 *
 * @example
 * ```ts
 * registerCommandMiddleware('build', (args, metadata) => {
 *   if (!args.options.prod) {
 *     console.log('Building in development mode');
 *   }
 * });
 * ```
 */
export function registerCommandMiddleware(
  commandPath: string,
  middleware: CommandMiddleware
): void {
  middlewareRegistry.register(commandPath, middleware);
}

/**
 * Execute middleware chain
 *
 * @param commandPath - Command path array
 * @param parsedArgs - Parsed arguments
 * @param metadata - Component metadata
 * @returns Modified parsedArgs or false if execution should stop
 */
export function executeMiddleware(
  commandPath: string[],
  parsedArgs: ParsedArgs,
  metadata: ComponentMetadata
): ParsedArgs | false {
  return middlewareRegistry.execute(commandPath, parsedArgs, metadata);
}
