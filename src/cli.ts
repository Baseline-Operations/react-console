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
export { CLIApp } from './components/cli/CLIApp';
export type { CLIAppProps } from './components/cli/CLIApp';
export { CommandRouter, Router } from './components/cli/CommandRouter';
export type { CommandRouterProps } from './components/cli/CommandRouter';
export { Command } from './components/cli/Command';
export type { CommandProps, CommandParam, CommandOption } from './components/cli/Command';
export { Route } from './components/cli/Route';
export type { RouteProps, RouteParam, RouteGuardFunction } from './components/cli/Route';
export { Default } from './components/cli/Default';
export type { DefaultProps, DefaultLifecycleHook } from './components/cli/Default';

// Help system
export type { HelpProps, HelpAppInfo, HelpCommandInfo, HelpRouteInfo } from './components/cli/HelpProps';

// Hooks
export {
  useCommand,
  useCommandPath,
  useCommandParams,
  useCommandOptions,
  useRoute,
  useRouteParams,
  usePath,
  useNavigate,
  useDefault,
  useConfig,
} from './hooks/cli';

// Utilities
export {
  parseCommandLineArgs,
  extractPathParams,
  matchRoutePath,
} from './utils/cli/parser';
export type { ParsedArgs } from './utils/cli/parser';

// Enhanced parser (deprecated - features merged into base parser)
// @deprecated Use parseCommandLineArgs instead - all features are now in the base parser
export {
  parseCommandLineArgsEnhanced,
} from './utils/cli/parserEnhanced';

export {
  validateCommandParams,
  formatValidationErrors,
} from './utils/cli/paramValidator';
export type { ParamValidationError, ParamValidationResult } from './utils/cli/paramValidator';

// Enhanced parameter validation (for advanced use cases)
export {
  validateCommandParamsEnhanced,
} from './utils/cli/paramValidatorEnhanced';
export type {
  CustomValidator,
  ValidationConstraint,
  EnhancedParamDefinition,
  EnhancedOptionDefinition,
} from './utils/cli/paramValidatorEnhanced';

export {
  findSimilarCommands,
  formatUnknownCommandError,
} from './utils/cli/commandSuggestions';

export {
  resolveOptionAliases,
  findOptionByAlias,
} from './utils/cli/optionResolver';

export {
  normalizeOptionValues,
} from './utils/cli/optionNormalizer';

export {
  isVersionRequested,
  getAppVersion,
} from './utils/cli/version';

export {
  generateCompletions,
  formatCompletions,
  generateCompletionScript,
} from './utils/cli/completion';
export type { CompletionResult } from './utils/cli/completion';

// Enhanced completion (for advanced use cases)
export {
  generateEnhancedCompletions,
  generateEnhancedCompletionScript,
} from './utils/cli/completionEnhanced';
export type {
  CompletionContext,
  EnhancedCompletionOptions,
} from './utils/cli/completionEnhanced';

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
} from './utils/cli/history';
export type { HistoryEntry } from './utils/cli/history';

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
} from './utils/cli/config';
export type { Config, ConfigValue, ConfigSource, ConfigEntry } from './utils/cli/config';

export {
  registerGlobalMiddleware,
  registerCommandMiddleware,
  executeMiddleware,
  middlewareRegistry,
} from './utils/cli/middleware';
export type { CommandMiddleware } from './utils/cli/middleware';

export {
  registerGlobalBeforeHook,
  registerGlobalAfterHook,
  registerBeforeHook,
  registerAfterHook,
  executeBeforeHooks,
  executeAfterHooks,
  lifecycleRegistry,
} from './utils/cli/lifecycle';
export type { LifecycleHook } from './utils/cli/lifecycle';

export {
  executeCommand,
  shouldExitAfterCommand,
  getCommandExitCode,
} from './utils/cli/commandExecutor';
export type { CommandExecutionResult } from './utils/cli/commandExecutor';

// Internal components (exported for advanced use cases)
export {
  VersionDisplay,
} from './utils/cli/components/VersionDisplay';
export type { VersionDisplayProps } from './utils/cli/components/VersionDisplay';
export {
  ValidationError,
} from './utils/cli/components/ValidationError';
export type { ValidationErrorProps } from './utils/cli/components/ValidationError';
export {
  UnknownCommandError,
} from './utils/cli/components/UnknownCommandError';
export type { UnknownCommandErrorProps } from './utils/cli/components/UnknownCommandError';
export {
  MiddlewareStopped,
} from './utils/cli/components/MiddlewareStopped';
export type { MiddlewareStoppedProps } from './utils/cli/components/MiddlewareStopped';
export {
  RouteBlocked,
} from './utils/cli/components/RouteBlocked';
export type { RouteBlockedProps } from './utils/cli/components/RouteBlocked';

// Interactive CLI utilities (for advanced use cases)
export {
  handleTabCompletion,
  handleHistoryNavigation,
  formatCommandForHistory,
} from './utils/cli/interactive';
export type { InteractiveInputOptions } from './utils/cli/interactive';
