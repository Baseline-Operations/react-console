/**
 * CLIApp - Root wrapper component for CLI applications
 * Provides application metadata and initialization for CLI apps
 */

import { type ReactNode } from 'react';
import type { StyleProps } from '../../types';

/**
 * CLIApp props
 */
export interface CLIAppProps extends StyleProps {
  /** Application name */
  name: string;
  /** Application version */
  version?: string;
  /** Application description */
  description?: string;
  /** Children (should be CommandRouter/Router) */
  children?: ReactNode;
  /** Exit code for non-interactive mode (default: 0) */
  exitCode?: number;
  /** Interactive mode (default: true) */
  interactive?: boolean;
}

/**
 * CLIApp component
 * Root wrapper for CLI applications that provides metadata and initialization
 * 
 * @example
 * ```tsx
 * <CLIApp name="my-app" version="1.0.0" description="My CLI app">
 *   <CommandRouter>
 *     <Default><HomeComponent /></Default>
 *     <Command name="build"><BuildComponent /></Command>
 *   </CommandRouter>
 * </CLIApp>
 * ```
 */
export function CLIApp({
  name,
  version,
  description,
  children,
  exitCode = 0,
  interactive = true,
}: CLIAppProps): ReactNode {
  // Store app metadata globally for access by CLI system
  // This will be used by CommandRouter and hooks
  if (typeof global !== 'undefined' && !global.__react_console_cli_app__) {
    global.__react_console_cli_app__ = {
      name,
      version,
      description,
      exitCode,
      interactive,
    };
  }

  return children;
}
