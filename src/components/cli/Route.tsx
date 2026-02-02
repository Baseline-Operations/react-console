/**
 * Route - Route definition component
 * Defines a route for path-based navigation
 */

import { type ReactNode } from 'react';
import type { StyleProps } from '../../types';

/**
 * Route parameter definition
 */
export interface RouteParam {
  /** Parameter name */
  name: string;
  /** Parameter type */
  type: 'string' | 'number';
  /** Whether parameter is required */
  required?: boolean;
  /** Parameter description */
  description?: string;
}

/**
 * Route guard function type
 * Returns true to allow navigation, false to block, or a redirect path
 */
export type RouteGuardFunction = (
  from: string | undefined,
  to: string,
  parsedArgs: import('../../utils/cli/parser').ParsedArgs,
  metadata: import('../../utils/cli/matcher').ComponentMetadata
) => boolean | string;

/**
 * Route props
 */
export interface RouteProps extends StyleProps {
  /** Route path pattern (supports :param syntax) */
  path: string;
  /** Route description */
  description?: string;
  /** Custom help component (optional, receives HelpProps) */
  help?: ReactNode | ((props: import('./HelpProps').HelpProps) => ReactNode);
  /** Disable help for this specific route */
  noHelp?: boolean;
  /** Route guard function (prevents navigation if returns false, redirects if returns string) */
  guard?: RouteGuardFunction;
  /** Redirect to this path (auto-redirect when route is accessed) */
  redirect?: string;
  /** Route parameter definitions (for path :param syntax) */
  params?: RouteParam[];
  /** Route handler component (as child) */
  children?: ReactNode;
}

/**
 * Route component
 * Defines a route for path-based navigation
 *
 * @example
 * ```tsx
 * <Route path="/settings" description="Settings page">
 *   <SettingsComponent />
 * </Route>
 *
 * <Route path="/profile/:id" description="User profile">
 *   <ProfileComponent />
 * </Route>
 * ```
 */
export function Route({
  path: _path,
  description: _description,
  help: _help,
  guard: _guard,
  redirect: _redirect,
  params: _params,
  children,
}: RouteProps): ReactNode {
  // Component identity is used by matcher to identify Route components
  // The actual matching and rendering is handled by CommandRouter
  // This component just wraps its children
  return children;
}

// Set displayName for component identification in matcher
Route.displayName = 'Route';
