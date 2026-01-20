/**
 * Command - Command definition component
 * Defines a CLI command with optional subcommands and default component
 */

import { type ReactNode } from 'react';
import type { StyleProps } from '../../types';

/**
 * Command parameter definition
 */
export interface CommandParam {
  /** Parameter name */
  name: string;
  /** Parameter type */
  type: 'string' | 'number' | 'boolean';
  /** Whether parameter is required */
  required?: boolean;
  /** Parameter description */
  description?: string;
}

/**
 * Command option definition
 */
export interface CommandOption {
  /** Option type */
  type: 'string' | 'number' | 'boolean' | 'string[]';
  /** Default value */
  default?: string | number | boolean | string[];
  /** Option description */
  description?: string;
  /** Aliases for the option (short flags) */
  aliases?: string[];
}

/**
 * Command middleware function type
 */
export type CommandMiddlewareFunction = (
  parsedArgs: import('../../utils/cli/parser').ParsedArgs,
  metadata: import('../../utils/cli/matcher').ComponentMetadata
) => import('../../utils/cli/parser').ParsedArgs | false | void;

/**
 * Command lifecycle hook function type
 */
export type CommandLifecycleHook = (
  parsedArgs: import('../../utils/cli/parser').ParsedArgs,
  metadata: import('../../utils/cli/matcher').ComponentMetadata
) => void | Promise<void>;

/**
 * Command props
 */
export interface CommandProps extends StyleProps {
  /** Command name (required) */
  name: string;
  /** Command aliases */
  aliases?: string[];
  /** Path for route-based access (optional, makes command accessible as route) */
  path?: string;
  /** Command description */
  description?: string;
  /** Custom help component (optional, receives HelpProps) */
  help?: ReactNode | ((props: import('./HelpProps').HelpProps) => ReactNode);
  /** Disable help for this specific command */
  noHelp?: boolean;
  /** Middleware functions (run before command execution) */
  middleware?: CommandMiddlewareFunction[];
  /** Before execution hook */
  before?: CommandLifecycleHook;
  /** After execution hook */
  after?: CommandLifecycleHook;
  /** Exit after execution (for non-interactive commands, default: false) */
  exitAfterExecution?: boolean;
  /** Exit code for this command (overrides app-level exit code) */
  exitCode?: number;
  /** Parameter definitions */
  params?: CommandParam[];
  /** Option definitions */
  options?: Record<string, CommandOption>;
  /** Command handler component (as child) */
  children?: ReactNode;
}

/**
 * Command component
 * Defines a CLI command with optional nested commands (subcommands)
 * 
 * @example
 * ```tsx
 * <Command name="build" description="Build project">
 *   <BuildComponent />
 *   <Command name="dev" description="Development build">
 *     <DevBuildComponent />
 *   </Command>
 *   <Default><DefaultBuildComponent /></Default>
 * </Command>
 * ```
 */
export function Command({
  name: _name,
  aliases: _aliases,
  path: _path,
  description: _description,
  help: _help,
  middleware: _middleware,
  before: _before,
  after: _after,
  exitAfterExecution: _exitAfterExecution,
  exitCode: _exitCode,
  params: _params,
  options: _options,
  children,
}: CommandProps): ReactNode {
  // Component identity is used by matcher to identify Command components
  // The actual matching and rendering is handled by CommandRouter
  // This component just wraps its children
  return children;
}

// Set displayName for component identification in matcher
Command.displayName = 'Command';
