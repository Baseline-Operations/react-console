/**
 * Help component props
 * Props passed to help components (custom or default) for displaying help information
 */

import type { ComponentMetadata } from '../../utils/cli/matcher';
import type { ParsedArgs } from '../../utils/cli/parser';
import type { ReactNode } from 'react';

/**
 * App metadata for help display
 */
export interface HelpAppInfo {
  /** Application name */
  name?: string;
  /** Application version */
  version?: string;
  /** Application description */
  description?: string;
}

/**
 * Command information for help display
 */
export interface HelpCommandInfo {
  /** Current command name */
  command?: string;
  /** Full command path */
  commandPath: string[];
  /** Command aliases */
  aliases?: string[];
  /** Command path (if command has path prop) */
  path?: string;
  /** Command description */
  description?: string;
  /** Nested commands (subcommands) */
  subcommands?: ComponentMetadata[];
  /** Default component for this command */
  defaultComponent?: ComponentMetadata;
}

/**
 * Route information for help display
 */
export interface HelpRouteInfo {
  /** Current route path */
  route?: string;
  /** Route description */
  description?: string;
  /** Route parameters (from path :param syntax) */
  routeParams?: Record<string, string>;
}

/**
 * Help component props
 * All data passed to help components for customizing help display
 */
export interface HelpProps {
  /** Application information */
  app: HelpAppInfo;
  /** Current command information (undefined if no command) */
  command?: HelpCommandInfo;
  /** Current route information (undefined if not using routes) */
  route?: HelpRouteInfo;
  /** Parsed command-line arguments */
  args: ParsedArgs;
  /** All available commands */
  commands: ComponentMetadata[];
  /** All available routes */
  routes: ComponentMetadata[];
  /** Default component metadata (if exists) */
  default?: ComponentMetadata;
  /** Whether currently in default component */
  isDefault: boolean;
  /** Full component metadata tree */
  metadata: ComponentMetadata[];
  /** Auto-exit after rendering (default: true) */
  autoExit?: boolean;
  /** Exit code for auto-exit (default: 0) */
  exitCode?: number;
  /** Children components (for nested help) */
  children?: ReactNode;
}
