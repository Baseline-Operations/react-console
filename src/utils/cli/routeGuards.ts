/**
 * Route guard utilities
 * Provides functionality for preventing navigation to certain routes
 */

import type { ParsedArgs } from './parser';
import type { ComponentMetadata } from './matcher';

/**
 * Route guard function type
 * Returns true if navigation should be allowed, false to block
 * Can return a redirect path to redirect instead of blocking
 */
export type RouteGuard = (
  from: string | undefined,
  to: string | undefined,
  parsedArgs: ParsedArgs,
  metadata: ComponentMetadata
) => boolean | string;

/**
 * Route guard registry
 * Stores guards for routes
 */
class RouteGuardRegistry {
  private guards: Map<string, RouteGuard[]> = new Map();

  /**
   * Register a guard for a route path
   */
  register(path: string, guard: RouteGuard): void {
    if (!this.guards.has(path)) {
      this.guards.set(path, []);
    }
    this.guards.get(path)!.push(guard);
  }

  /**
   * Check if navigation to a route is allowed
   * Returns true if allowed, false if blocked, or a redirect path
   */
  check(
    from: string | undefined,
    to: string | undefined,
    parsedArgs: ParsedArgs,
    metadata: ComponentMetadata
  ): boolean | string {
    if (!to) {
      return true; // No route to check
    }

    const guards = this.guards.get(to);
    if (!guards || guards.length === 0) {
      return true; // No guards, allow navigation
    }

    // Run all guards, first one that blocks or redirects wins
    for (const guard of guards) {
      const result = guard(from, to, parsedArgs, metadata);
      if (result !== true) {
        return result; // Blocked or redirect
      }
    }

    return true; // All guards passed
  }

  /**
   * Clear all guards
   */
  clear(): void {
    this.guards.clear();
  }

  /**
   * Remove guards for a specific path
   */
  remove(path: string): void {
    this.guards.delete(path);
  }
}

/**
 * Global route guard registry
 */
export const routeGuardRegistry = new RouteGuardRegistry();

/**
 * Register a route guard
 * 
 * @param path - Route path to guard
 * @param guard - Guard function that returns true to allow, false to block, or a redirect path
 * 
 * @example
 * ```ts
 * // Block access to admin routes
 * registerRouteGuard('/admin', (from, to, args, metadata) => {
 *   if (!args.options.admin) {
 *     return '/login'; // Redirect to login
 *   }
 *   return true; // Allow
 * });
 * ```
 */
export function registerRouteGuard(path: string, guard: RouteGuard): void {
  routeGuardRegistry.register(path, guard);
}

/**
 * Check if navigation to a route is allowed
 * 
 * @param from - Current route path
 * @param to - Target route path
 * @param parsedArgs - Parsed command-line arguments
 * @param metadata - Component metadata
 * @returns true if allowed, false if blocked, or redirect path
 */
export function checkRouteGuard(
  from: string | undefined,
  to: string | undefined,
  parsedArgs: ParsedArgs,
  metadata: ComponentMetadata
): boolean | string {
  return routeGuardRegistry.check(from, to, parsedArgs, metadata);
}
