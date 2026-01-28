/**
 * CommandRouter - Root router for CLI applications
 * Handles command/route routing and parameter parsing
 * Router is an alias for CommandRouter
 */

import { type ReactNode, useMemo, createContext, useState, useEffect, useLayoutEffect, isValidElement, cloneElement } from 'react';
import { parseCommandLineArgs } from '../../utils/cli/parser';
import { matchComponent, extractComponentMetadata } from '../../utils/cli/matcher';
import { generateHelpComponent } from '../../utils/cli/help';
import { findHelp } from '../../utils/cli/helpMatcher';
import { isHelpAvailable } from '../../utils/cli/optionCollector';
import { findSimilarCommands } from '../../utils/cli/commandSuggestions';
import { addToHistory } from '../../utils/cli/history';
import { setDefaults, loadFromEnv, setCLIConfig } from '../../utils/cli/config';
import { resolveOptionAliases } from '../../utils/cli/optionResolver';
import { normalizeOptionValues } from '../../utils/cli/optionNormalizer';
import { collectCommandOptions } from '../../utils/cli/optionCollector';
import { shouldExitAfterCommand, getCommandExitCode } from '../../utils/cli/commandExecutor';
import { isVersionRequested, getAppVersion } from '../../utils/cli/version';
import { Node } from '../../nodes/base/Node';
const exit = Node.exit.bind(Node);
import { HelpWrapper } from '../../utils/cli/components/HelpWrapper';
import { VersionDisplay } from '../../utils/cli/components/VersionDisplay';
import { ValidationError } from '../../utils/cli/components/ValidationError';
import { UnknownCommandError } from '../../utils/cli/components/UnknownCommandError';
import { MiddlewareStopped } from '../../utils/cli/components/MiddlewareStopped';
import { RouteBlocked } from '../../utils/cli/components/RouteBlocked';
import { Text } from '../primitives/Text';
import type { StyleProps } from '../../types';
import type { ParsedArgs } from '../../utils/cli/parser';
import type { HelpProps } from './HelpProps';
import { createNavigateFunction } from './CommandRouter/routing';
import { getMatchedMetadata } from './CommandRouter/matching';
import { executeMiddlewareChain, executeBeforeHooksChain, executeAfterHooksChain, validateCommandParameters } from './CommandRouter/execution';
import { checkRouteGuards } from './CommandRouter/guards';
import type { ParamValidationResult } from '../../utils/cli/paramValidator';

/**
 * CommandRouter props
 */
export interface CommandRouterProps extends StyleProps {
  /** Router name/description */
  description?: string;
  /** Custom help component (optional, receives HelpProps) */
  help?: ReactNode | ((props: HelpProps) => ReactNode);
  /** Auto-exit after help is rendered (default: true) */
  helpAutoExit?: boolean;
  /** Exit code for help auto-exit (default: 0) */
  helpExitCode?: number;
  /** Disable help for this router and all children (cascades down) */
  noHelp?: boolean;
  /** Show error for unknown commands (default: true, only when commands are defined) */
  showUnknownCommandError?: boolean;
  /** Global options available to all commands */
  options?: Record<string, import('./Command').CommandOption>;
  /** Default configuration values */
  defaultConfig?: Record<string, import('../../utils/cli/config').ConfigValue>;
  /** Environment variable prefix for config (e.g., 'MYAPP' for MYAPP_DEBUG) */
  envPrefix?: string;
  /** Configuration file path (optional, user must load file themselves and pass to loadFromFile) */
  configFile?: string;
  /** Children (Command, Route, Default components) */
  children?: ReactNode;
}

/**
 * CLI State Context
 */
export interface CLIStateContextValue {
  command: string[];
  options: Record<string, string | number | boolean | string[]>;
  params: (string | number | boolean)[];
  namedParams: Record<string, string | number | boolean>; // Named params from command definition
  route?: string;
  routeParams?: Record<string, string>;
  isDefault: boolean;
  navigate: (path: string, navOptions?: {
    params?: Record<string, string>;
    options?: Record<string, string | number | boolean | string[]>;
    carryOver?: boolean;
  }) => void;
}

const CLIStateContext = createContext<CLIStateContextValue | null>(null);

/**
 * CommandRouter component
 * Root router that handles command/route routing and automatically selects components
 * based on parsed command-line arguments
 * 
 * @example
 * ```tsx
 * <CommandRouter description="Main application router">
 *   <Default><HomeComponent /></Default>
 *   <Command name="build"><BuildComponent /></Command>
 *   <Route path="/settings"><SettingsComponent /></Route>
 * </CommandRouter>
 * ```
 */
export function CommandRouter({
  description: _description, // Store for future use (help generation)
  help,
  helpAutoExit = true,
  helpExitCode = 0,
  noHelp: routerNoHelp,
  showUnknownCommandError = true,
  options: routerOptions,
  defaultConfig,
  envPrefix,
  children,
}: CommandRouterProps): ReactNode {
  // Initialize configuration (once on mount)
  useMemo(() => {
    if (defaultConfig) {
      setDefaults(defaultConfig);
    }
    if (typeof process !== 'undefined' && process.env) {
      loadFromEnv(process.env, envPrefix);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Parse command-line arguments on mount
  const [parsedArgs, setParsedArgs] = useState<ParsedArgs>(() => {
    if (typeof process !== 'undefined' && process.argv) {
      return parseCommandLineArgs(process.argv.slice(2));
    }
    return { command: [], options: {}, params: [] };
  });

  // Extract metadata once (with router-level noHelp cascading)
  const metadata = useMemo(() => extractComponentMetadata(children, routerNoHelp), [children, routerNoHelp]);

  // Match component based on parsed args (before alias resolution, as commands don't use aliases)
  const matchResult = useMemo(() => {
    return matchComponent(parsedArgs, children);
  }, [parsedArgs, children]);

  // Find matched metadata for validation and guards (use parsedArgs.command, not resolvedArgs, as commands don't use aliases)
  const matchedMetadata = useMemo(() => {
    return getMatchedMetadata(matchResult, parsedArgs, metadata);
  }, [matchResult, parsedArgs, metadata]);


  // Collect all options for alias resolution (use parsedArgs.command for matching, not resolvedArgs)
  const allOptions = useMemo(() => {
    if (parsedArgs.command.length > 0) {
      return collectCommandOptions(parsedArgs.command, metadata, routerOptions);
    }
    return routerOptions || {};
  }, [parsedArgs.command, metadata, routerOptions]);

  // Resolve option aliases (e.g., -h -> help)
  const resolvedArgs = useMemo(() => {
    return resolveOptionAliases(parsedArgs, allOptions);
  }, [parsedArgs, allOptions]);

  // Normalize option values (convert strings to numbers/booleans/arrays based on type definitions)
  const normalizedArgs = useMemo(() => {
    if (!matchedMetadata || matchResult.isDefault) {
      return resolvedArgs;
    }
    return normalizeOptionValues(resolvedArgs, matchedMetadata);
  }, [resolvedArgs, matchedMetadata, matchResult.isDefault]);

  // Set CLI config from normalized args (after alias resolution and normalization)
  useEffect(() => {
    if (normalizedArgs.options && Object.keys(normalizedArgs.options).length > 0) {
      setCLIConfig(normalizedArgs.options as Record<string, import('../../utils/cli/config').ConfigValue>);
    }
  }, [normalizedArgs.options]);

  // Execute middleware if matched metadata exists (using normalized args)
  const middlewareResult = useMemo(() => {
    return executeMiddlewareChain(matchedMetadata, normalizedArgs, matchResult.isDefault);
  }, [matchedMetadata, normalizedArgs, matchResult.isDefault]);

  // Execute before lifecycle hooks (synchronously before render)
  useLayoutEffect(() => {
    if (!matchedMetadata || middlewareResult.shouldStop) {
      return;
    }

    executeBeforeHooksChain(matchedMetadata, normalizedArgs, middlewareResult.args, matchResult.isDefault).catch(err => {
      console.error('Error in before hook:', err);
    });
  }, [matchedMetadata, normalizedArgs, middlewareResult.args, matchResult.isDefault, middlewareResult.shouldStop]);

  // Execute after lifecycle hooks (after render/unmount)
  useEffect(() => {
    if (!matchedMetadata || middlewareResult.shouldStop) {
      return;
    }

    // Return cleanup for after hook
    return () => {
      executeAfterHooksChain(matchedMetadata, normalizedArgs, middlewareResult.args, matchResult.isDefault).catch(err => {
        console.error('Error in after hook:', err);
      });
    };
  }, [matchedMetadata, normalizedArgs, middlewareResult.args, matchResult.isDefault, middlewareResult.shouldStop]);

  // Validate parameters if matched metadata exists (using middleware-modified and alias-resolved args)
  const validationResult = useMemo<ParamValidationResult | null>(() => {
    return validateCommandParameters(matchedMetadata, middlewareResult.args, matchResult.isDefault);
  }, [matchedMetadata, middlewareResult.args, matchResult.isDefault]);

  // Navigation function
  const navigate = useMemo(() => {
    return createNavigateFunction(parsedArgs, setParsedArgs);
  }, [parsedArgs, setParsedArgs]);

  // Check route guards and handle redirects (before creating context)
  const guardResult = useMemo(() => {
    return checkRouteGuards(matchedMetadata, matchResult, parsedArgs);
  }, [matchedMetadata, matchResult, parsedArgs]);

  // Check for unknown command error (only if commands are defined and a command was provided)
  // MUST be before any early returns (React hooks rule)
  const hasCommands = useMemo(() => metadata.some(m => m.type === 'command'), [metadata]);
  const hasUnknownCommand = resolvedArgs.command.length > 0 && matchResult.isDefault && hasCommands;

  // Add to history if command was executed (not help, not error, not default without commands)
  // MUST be before any early returns (React hooks rule)
  useEffect(() => {
    const appMetadata = typeof global !== 'undefined' && global.__react_console_cli_app__ ? global.__react_console_cli_app__ : undefined;
    const isInteractive = appMetadata?.interactive !== false;
    
    if (isInteractive && !middlewareResult.shouldStop && normalizedArgs.command.length > 0) {
      // Don't add help commands or errors to history
      const isHelp = normalizedArgs.options.help || 
                    normalizedArgs.options['--help'] || 
                    parsedArgs.options.h || 
                    parsedArgs.options['-h'];
      const hasError = (validationResult && !validationResult.valid) || 
                      (hasCommands && hasUnknownCommand && showUnknownCommandError);
      
      if (!isHelp && !hasError) {
        addToHistory(normalizedArgs.command, {
          options: middlewareResult.args.options,
          params: middlewareResult.args.params,
        });
      }
    }
  }, [normalizedArgs.command, middlewareResult.args, middlewareResult.shouldStop, validationResult, hasCommands, hasUnknownCommand, showUnknownCommandError, normalizedArgs.options, parsedArgs.options]);

  // Handle exit after execution for non-interactive commands
  // MUST be before any early returns (React hooks rule)
  useEffect(() => {
    if (!matchedMetadata || matchResult.isDefault || middlewareResult.shouldStop) {
      return;
    }

    const appMetadata = typeof global !== 'undefined' && global.__react_console_cli_app__ 
      ? global.__react_console_cli_app__ 
      : undefined;
    
    const isInteractive = appMetadata?.interactive !== false;
    const shouldExit = matchedMetadata.exitAfterExecution || 
                      (!isInteractive && shouldExitAfterCommand(matchedMetadata, normalizedArgs));
    
    if (shouldExit) {
      const exitCode = matchedMetadata.exitCode !== undefined 
        ? matchedMetadata.exitCode 
        : getCommandExitCode(matchedMetadata, normalizedArgs);
      
      // Exit after a short delay to allow rendering
      setTimeout(() => {
        exit(exitCode);
      }, 100);
    }
  }, [matchedMetadata, normalizedArgs, matchResult.isDefault, middlewareResult.shouldStop]);

  // Create named params from positional params based on command definition
  const namedParams = useMemo<Record<string, string | number | boolean>>(() => {
    const result: Record<string, string | number | boolean> = {};
    if (matchedMetadata?.params && normalizedArgs.params) {
      matchedMetadata.params.forEach((paramDef, index) => {
        if (index < normalizedArgs.params.length) {
          const value = normalizedArgs.params[index];
          if (value !== undefined) {
            result[paramDef.name] = value;
          }
        }
      });
    }
    return result;
  }, [matchedMetadata?.params, normalizedArgs.params]);

  // Create context value (use normalized args for options)
  const contextValue: CLIStateContextValue = {
    command: normalizedArgs.command,
    options: normalizedArgs.options,
    params: normalizedArgs.params,
    namedParams,
    route: matchResult.route,
    routeParams: matchResult.routeParams,
    isDefault: matchResult.isDefault,
    navigate,
  };

  // Handle redirect
  if (guardResult?.type === 'redirect') {
    const redirectPath = guardResult.path;
    // Update parsedArgs to navigate to redirect path
    const redirectArgs: ParsedArgs = {
      command: redirectPath.startsWith('/') ? redirectPath.slice(1).split('/').filter(Boolean) : [redirectPath],
      options: parsedArgs.options,
      params: parsedArgs.params,
    };
    setParsedArgs(redirectArgs);
    // Return early, will re-render with new args
    return null;
  }

  // Handle blocked route
  if (guardResult?.type === 'blocked') {
    return (
      <CLIStateContext.Provider value={contextValue}>
        <RouteBlocked route={matchResult.route} />
      </CLIStateContext.Provider>
    );
  }

  // Handle middleware stop
  if (middlewareResult.shouldStop) {
    return (
      <CLIStateContext.Provider value={contextValue}>
        <MiddlewareStopped />
      </CLIStateContext.Provider>
    );
  }

  // Prepare help props data
  const appMetadata = typeof global !== 'undefined' && global.__react_console_cli_app__ ? global.__react_console_cli_app__ : undefined;
  const commands = metadata.filter(m => m.type === 'command');
  const routes = metadata.filter(m => m.type === 'route');
  const defaults = metadata.filter(m => m.type === 'default');
  
  // Find specific help for current command/route (using normalized args)
  const specificHelp = findHelp(normalizedArgs, children);
  
  // Build command info if command exists
  const commandInfo: HelpProps['command'] | undefined = specificHelp?.type === 'command' && specificHelp.name ? {
    name: specificHelp.name,
    command: specificHelp.name,
    commandPath: normalizedArgs.command,
    aliases: specificHelp.aliases,
    path: specificHelp.path,
    description: specificHelp.description,
    subcommands: specificHelp.children?.filter(c => c.type === 'command'),
    defaultComponent: specificHelp.children?.find(c => c.type === 'default'),
  } : normalizedArgs.command.length > 0 ? {
    name: normalizedArgs.command[0],
    command: normalizedArgs.command[0],
    commandPath: normalizedArgs.command,
    description: specificHelp?.description,
  } : undefined;
  
  // Build route info if route exists
  const routeInfo: HelpProps['route'] | undefined = matchResult.route ? {
    route: matchResult.route,
    routeParams: matchResult.routeParams,
    description: specificHelp?.description,
  } : undefined;

  // Build help props
  const helpProps: HelpProps = {
    app: {
      name: appMetadata?.name,
      version: appMetadata?.version,
      description: appMetadata?.description || _description,
    },
    command: commandInfo,
    route: routeInfo,
    args: normalizedArgs,
    commands,
    routes,
    default: defaults[0] || undefined,
    isDefault: matchResult.isDefault,
    metadata,
    autoExit: helpAutoExit,
    exitCode: helpExitCode,
  };

  // Check for version flag (before help check)
  const versionRequested = isVersionRequested(normalizedArgs);
  if (versionRequested) {
    const appMetadata = typeof global !== 'undefined' && global.__react_console_cli_app__ 
      ? global.__react_console_cli_app__ 
      : undefined;
    const version = getAppVersion();
    
    if (version && appMetadata?.name) {
      return (
        <CLIStateContext.Provider value={contextValue}>
          <VersionDisplay appName={appMetadata.name} version={version} />
        </CLIStateContext.Provider>
      );
    } else if (version) {
      return (
        <CLIStateContext.Provider value={contextValue}>
          <Text>{version}</Text>
        </CLIStateContext.Provider>
      );
    }
    // If no version available, continue to normal flow
  }

  // Check if help is disabled (router-level or command-level)
  const helpAvailable = !routerNoHelp && isHelpAvailable(normalizedArgs, metadata);
  
  // If --help flag, render help component or auto-generated help (only if help is available)
  // Check both resolved name and common aliases
  // MUST compute before any early returns (used in useEffect)
  const helpRequested = normalizedArgs.options.help || 
                        normalizedArgs.options['--help'] || 
                        parsedArgs.options.h || 
                        parsedArgs.options['-h'];
  
  if (helpRequested && helpAvailable) {
    let helpComponent: ReactNode | null = null;
    
    // Check for custom help prop first (router level)
    if (help) {
      if (typeof help === 'function') {
        helpComponent = (help as (props: HelpProps) => ReactNode)(helpProps);
      } else if (isValidElement(help)) {
        // Clone element and pass help props
        // Help components should accept HelpProps
        helpComponent = cloneElement(help, helpProps as Partial<HelpProps>);
      } else {
        helpComponent = help;
      }
    }
    // Try to find specific help for current command/route
    else if (specificHelp?.help) {
      // Extract help from metadata (may be function or component)
      const helpValue = specificHelp.help;
      if (typeof helpValue === 'function') {
        helpComponent = (helpValue as (props: HelpProps) => ReactNode)(helpProps);
      } else if (isValidElement(helpValue)) {
        helpComponent = cloneElement(helpValue, helpProps as Partial<HelpProps>);
      } else {
        helpComponent = helpValue;
      }
    }
    
    // Auto-generate help if no custom help found
    if (!helpComponent) {
      if (specificHelp) {
        helpComponent = generateHelpComponent(
          specificHelp.component,
          appMetadata?.name,
          appMetadata?.version,
          specificHelp.description || appMetadata?.description || _description,
          {
            showAliases: true,
            showPaths: true,
          },
          normalizedArgs,
          routerOptions,
          routerNoHelp
        );
      } else {
        helpComponent = generateHelpComponent(
          children,
          appMetadata?.name,
          appMetadata?.version,
          appMetadata?.description || _description,
          {
            showAliases: true,
            showPaths: true,
          },
          normalizedArgs,
          routerOptions,
          routerNoHelp
        );
      }
    }
    
    // Handle auto-exit after rendering help
    // We'll use a HelpWrapper component to handle the exit logic
    // HelpWrapper wraps help and automatically exits after rendering (if autoExit is true)
    return (
      <CLIStateContext.Provider value={contextValue}>
        <HelpWrapper 
          help={helpComponent} 
          autoExit={helpAutoExit !== false} // Default to true if not explicitly set to false
          exitCode={helpExitCode} 
        />
      </CLIStateContext.Provider>
    );
  }

  // If validation failed, show error component
  if (validationResult && !validationResult.valid) {
    return (
      <CLIStateContext.Provider value={contextValue}>
        <ValidationError errors={validationResult.errors} />
      </CLIStateContext.Provider>
    );
  }
  
  if (hasUnknownCommand && showUnknownCommandError) {
    const appMetadata = typeof global !== 'undefined' && global.__react_console_cli_app__ ? global.__react_console_cli_app__ : undefined;
    const suggestions = findSimilarCommands(normalizedArgs.command[0]!, metadata);
    return (
      <CLIStateContext.Provider value={contextValue}>
        <UnknownCommandError
          unknownCommand={normalizedArgs.command[0]!}
          commandPath={normalizedArgs.command}
          suggestions={suggestions}
          appName={appMetadata?.name}
        />
      </CLIStateContext.Provider>
    );
  }

  // Update context with validated params/options if validation passed (use middleware-modified args)
  const validatedContextValue: CLIStateContextValue = validationResult && validationResult.valid
    ? {
        ...contextValue,
        command: normalizedArgs.command,
        options: validationResult.options,
        params: Object.values(validationResult.params),
      }
    : {
        ...contextValue,
        command: normalizedArgs.command,
        options: middlewareResult.args.options,
        params: middlewareResult.args.params,
      };

  // Render the matched component with context
  return (
    <CLIStateContext.Provider value={validatedContextValue}>
      {matchResult.component}
    </CLIStateContext.Provider>
  );
}

/**
 * Export context for hooks
 * Note: This is exported so hooks can import it
 */
export { CLIStateContext };

/**
 * Router - Alias for CommandRouter
 * For applications that use routes instead of commands
 */
export const Router = CommandRouter;
