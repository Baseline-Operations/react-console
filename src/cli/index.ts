/**
 * CLI Application Framework
 * Convenient exports for building CLI applications with React Console
 *
 * @example
 * ```tsx
 * import { CLIApp, CommandRouter, Command, Route, Default } from 'react-console/cli';
 *
 * function App() {
 *   return (
 *     <CLIApp name="my-app" version="1.0.0">
 *       <CommandRouter>
 *         <Default><HomeComponent /></Default>
 *         <Command name="build"><BuildComponent /></Command>
 *       </CommandRouter>
 *     </CLIApp>
 *   );
 * }
 * ```
 */

// Main CLI components
export { CLIApp } from './components/CLIApp';
export type { CLIAppProps } from './components/CLIApp';
export { CommandRouter, Router } from './components/CommandRouter';
export type { CommandRouterProps } from './components/CommandRouter';
export { Command } from './components/Command';
export type { CommandProps, CommandParam, CommandOption } from './components/Command';
export { Route } from './components/Route';
export type { RouteProps, RouteParam, RouteGuardFunction } from './components/Route';
export { Default } from './components/Default';
export type { DefaultProps, DefaultLifecycleHook } from './components/Default';

// Help system
export type {
  HelpProps,
  HelpAppInfo,
  HelpCommandInfo,
  HelpRouteInfo,
} from './components/HelpProps';

// Hooks
export {
  useCommand,
  useCommandPath,
  useCommandParams,
  useCommandParamsArray,
  useCommandOptions,
  useRoute,
  useRouteParams,
  usePath,
  useNavigate,
  useDefault,
  useConfig,
} from './hooks';

// Utilities
export { parseCommandLineArgs, extractPathParams, matchRoutePath } from './utils/parser';
export type { ParsedArgs } from './utils/parser';

// Enhanced parser (deprecated - features merged into base parser)
// @deprecated Use parseCommandLineArgs instead - all features are now in the base parser
export { parseCommandLineArgsEnhanced } from './utils/parserEnhanced';

export { validateCommandParams, formatValidationErrors } from './utils/paramValidator';
export type { ParamValidationError, ParamValidationResult } from './utils/paramValidator';

// Enhanced parameter validation (for advanced use cases)
export { validateCommandParamsEnhanced } from './utils/paramValidatorEnhanced';
export type {
  CustomValidator,
  ValidationConstraint,
  EnhancedParamDefinition,
  EnhancedOptionDefinition,
} from './utils/paramValidatorEnhanced';

export { findSimilarCommands, formatUnknownCommandError } from './utils/commandSuggestions';

export { resolveOptionAliases, findOptionByAlias } from './utils/optionResolver';

export { normalizeOptionValues } from './utils/optionNormalizer';

export { isVersionRequested, getAppVersion } from './utils/version';

export {
  generateCompletions,
  formatCompletions,
  generateCompletionScript,
} from './utils/completion';
export type { CompletionResult } from './utils/completion';

// Enhanced completion (for advanced use cases)
export {
  generateEnhancedCompletions,
  generateEnhancedCompletionScript,
} from './utils/completionEnhanced';
export type { CompletionContext, EnhancedCompletionOptions } from './utils/completionEnhanced';

export {
  addToHistory,
  getPreviousCommand,
  getNextCommand,
  getAllHistory,
  searchHistory,
  clearHistory,
  setHistoryMaxSize,
  resetHistoryIndex,
  commandHistory,
} from './utils/history';
export type { HistoryEntry } from './utils/history';

export {
  setDefaults,
  loadFromEnv,
  loadFromFile,
  setCLIConfig,
  getConfig,
  getConfigWithDefault,
  setConfig,
  hasConfig,
  getAllConfig,
} from './utils/config';
export type { Config, ConfigValue, ConfigSource, ConfigEntry } from './utils/config';

export {
  registerGlobalMiddleware,
  registerCommandMiddleware,
  executeMiddleware,
  middlewareRegistry,
} from './utils/middleware';
export type { CommandMiddleware } from './utils/middleware';

export {
  registerGlobalBeforeHook,
  registerGlobalAfterHook,
  registerBeforeHook,
  registerAfterHook,
  executeBeforeHooks,
  executeAfterHooks,
  lifecycleRegistry,
} from './utils/lifecycle';
export type { LifecycleHook } from './utils/lifecycle';

export {
  executeCommand,
  shouldExitAfterCommand,
  getCommandExitCode,
} from './utils/commandExecutor';
export type { CommandExecutionResult } from './utils/commandExecutor';

// Internal components (exported for advanced use cases)
export { VersionDisplay } from './utils/components/VersionDisplay';
export type { VersionDisplayProps } from './utils/components/VersionDisplay';
export { ValidationError } from './utils/components/ValidationError';
export type { ValidationErrorProps } from './utils/components/ValidationError';
export { UnknownCommandError } from './utils/components/UnknownCommandError';
export type { UnknownCommandErrorProps } from './utils/components/UnknownCommandError';
export { MiddlewareStopped } from './utils/components/MiddlewareStopped';
export type { MiddlewareStoppedProps } from './utils/components/MiddlewareStopped';
export { RouteBlocked } from './utils/components/RouteBlocked';
export type { RouteBlockedProps } from './utils/components/RouteBlocked';

// Interactive CLI utilities (for advanced use cases)
export {
  handleTabCompletion,
  handleHistoryNavigation,
  formatCommandForHistory,
} from './utils/interactive';
export type { InteractiveInputOptions } from './utils/interactive';
