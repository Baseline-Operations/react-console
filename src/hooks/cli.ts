/**
 * CLI hooks for accessing command/route state and navigation
 */

import { useContext } from 'react';
import { CLIStateContext } from '../components/cli/CommandRouter';

/**
 * Hook to access CLI state context
 * Used by child components to access routing state
 */
export function useCLIContext() {
  const context = useContext(CLIStateContext);
  if (!context) {
    throw new Error('CLI hooks must be used within a CommandRouter component');
  }
  return context;
}

/**
 * Hook to get current command name
 * Returns undefined if no commands are being used
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const command = useCommand(); // 'build' or undefined
 *   return <Text>Command: {command || 'none'}</Text>;
 * }
 * ```
 */
export function useCommand(): string | undefined {
  const { command } = useCLIContext();
  return command.length > 0 ? command[0] : undefined;
}

/**
 * Hook to get current command path (all command names in sequence)
 * Returns empty array if no commands
 */
export function useCommandPath(): string[] {
  const { command } = useCLIContext();
  return command;
}

/**
 * Hook to get parsed command parameters (positional args)
 * Returns empty array if no commands or no parameters
 * Parameters are typed based on command definition (string, number, boolean)
 */
export function useCommandParams(): (string | number | boolean)[] {
  const { params } = useCLIContext();
  return params;
}

/**
 * Hook to get parsed command options/flags
 * Returns empty object if no commands or no options
 * Options are typed based on command definition (string, number, boolean, string[])
 */
export function useCommandOptions(): Record<string, string | number | boolean | string[]> {
  const { options } = useCLIContext();
  return options;
}

/**
 * Hook to get current route path
 * Returns undefined if not using routes
 */
export function useRoute(): string | undefined {
  const { route } = useCLIContext();
  return route;
}

/**
 * Hook to get route parameters (from path :param syntax)
 * Returns empty object if no routes or no route params
 */
export function useRouteParams(): Record<string, string> {
  const { routeParams = {} } = useCLIContext();
  return routeParams;
}

/**
 * Hook to get current path (works for both commands with path and routes)
 */
export function usePath(): string | undefined {
  const context = useCLIContext();
  return context.route || (context.command.length > 0 ? '/' + context.command.join('/') : undefined);
}

/**
 * Hook to check if currently in default component
 * Returns true if no command/route matched
 */
export function useDefault(): boolean {
  const { isDefault } = useCLIContext();
  return isDefault;
}

/**
 * Hook to navigate to different routes/commands
 * React-based navigation (triggers re-render)
 */
export function useNavigate() {
  const { navigate } = useCLIContext();
  return navigate;
}

/**
 * Hook to access CLI configuration
 * Returns configuration value or undefined
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const debug = useConfig('debug'); // Get config value
 *   const port = useConfig('port', 3000); // Get with default
 *   return <Text>Debug: {debug ? 'on' : 'off'}</Text>;
 * }
 * ```
 */
export function useConfig<T extends import('../utils/cli/config').ConfigValue = import('../utils/cli/config').ConfigValue>(
  key: string,
  defaultValue?: T
): T | undefined {
  // Use dynamic import to avoid circular dependencies
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getConfig, getConfigWithDefault } = require('../utils/cli/config') as typeof import('../utils/cli/config');
  if (defaultValue !== undefined) {
    return getConfigWithDefault(key, defaultValue) as T;
  }
  return getConfig(key) as T | undefined;
}
