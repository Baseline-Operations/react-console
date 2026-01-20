/**
 * Default - Default component for unmatched commands/routes
 * Rendered when no command or route matches
 */

import { type ReactNode } from 'react';
import type { StyleProps } from '../../types';

/**
 * Default lifecycle hook function type
 */
export type DefaultLifecycleHook = (
  parsedArgs: import('../../utils/cli/parser').ParsedArgs,
  metadata: import('../../utils/cli/matcher').ComponentMetadata
) => void | Promise<void>;

/**
 * Default props
 */
export interface DefaultProps extends StyleProps {
  /** Default component description */
  description?: string;
  /** Custom help component (optional, receives HelpProps) */
  help?: ReactNode | ((props: import('./HelpProps').HelpProps) => ReactNode);
  /** Disable help for this specific default component */
  noHelp?: boolean;
  /** Before mount hook */
  before?: DefaultLifecycleHook;
  /** After unmount hook */
  after?: DefaultLifecycleHook;
  /** Default handler component (as child) */
  children?: ReactNode;
}

/**
 * Default component
 * Defines the default behavior when no command/route matches
 * 
 * @example
 * ```tsx
 * <CommandRouter>
 *   <Default description="Default application interface">
 *     <HomeComponent />
 *   </Default>
 *   <Command name="build"><BuildComponent /></Command>
 * </CommandRouter>
 * ```
 */
export function Default({
  description: _description,
  help: _help,
  children,
}: DefaultProps): ReactNode {
  // Component identity is used by matcher to identify Default components
  // The actual matching and rendering is handled by CommandRouter
  // This component just wraps its children
  return children;
}

// Set displayName for component identification in matcher
Default.displayName = 'Default';
