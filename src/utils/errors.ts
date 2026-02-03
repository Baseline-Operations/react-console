/**
 * Error handling utilities for React Console
 * Provides error logging and graceful error handling
 */

import { createRequire } from 'node:module';

// Create require function for ESM compatibility
const require = createRequire(import.meta.url);

/**
 * Error types for different error categories
 */
export enum ErrorType {
  TERMINAL_INIT = 'TERMINAL_INIT',
  RENDER = 'RENDER',
  INPUT_PARSING = 'INPUT_PARSING',
  LAYOUT_CALCULATION = 'LAYOUT_CALCULATION',
  COMPONENT = 'COMPONENT',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Error handler function type
 */
export type ErrorHandler = (
  error: Error,
  type: ErrorType,
  context?: Record<string, unknown>
) => void;

/**
 * Common error messages for better developer experience
 */
export const ErrorMessages = {
  TERMINAL_INIT: (details?: string) =>
    `Terminal initialization failed.${details ? ` ${details}` : ''} Make sure you're running in a terminal environment.`,
  RENDER: (details?: string) =>
    `Rendering error occurred.${details ? ` ${details}` : ''} Check your component structure and props.`,
  INPUT_PARSING: (details?: string) =>
    `Failed to parse input.${details ? ` ${details}` : ''} Ensure input format is correct.`,
  LAYOUT_CALCULATION: (details?: string) =>
    `Layout calculation failed.${details ? ` ${details}` : ''} Check your layout styles and constraints.`,
  COMPONENT: (component?: string, details?: string) =>
    `Component error${component ? ` in ${component}` : ''}.${details ? ` ${details}` : ''} Check component props and implementation.`,
  UNKNOWN: (details?: string) => `An unexpected error occurred.${details ? ` ${details}` : ''}`,
};

/**
 * Helper to create helpful error messages
 */
function createHelpfulErrorMessage(
  error: Error,
  type: ErrorType,
  context?: Record<string, unknown>
): string {
  const baseMessage =
    ErrorMessages[type]?.(
      context?.component as string | undefined,
      context?.details as string | undefined
    ) || ErrorMessages.UNKNOWN(context?.details as string | undefined);

  const suggestions: string[] = [];

  // Add context-specific suggestions
  if (context?.component) {
    suggestions.push(`Component: ${context.component}`);
  }
  if (context?.prop) {
    suggestions.push(`Check the '${context.prop}' prop`);
  }
  if (context?.value !== undefined) {
    suggestions.push(`Value: ${JSON.stringify(context.value)}`);
  }

  const suggestionText = suggestions.length > 0 ? `\n  ${suggestions.join('\n  ')}` : '';

  return `${baseMessage}${suggestionText}\n  Original error: ${error.message}`;
}

/**
 * Default error handler - logs to console.error with helpful messages
 */
let errorHandler: ErrorHandler = (error, type, context) => {
  const helpfulMessage = createHelpfulErrorMessage(error, type, context);
  const contextStr = context ? `\n  Context: ${JSON.stringify(context, null, 2)}` : '';
  console.error(`[React Console ${type} Error] ${helpfulMessage}${contextStr}`);
  if (error.stack && process.env.DEBUG) {
    console.error(`\nStack trace:\n${error.stack}`);
  }
};

/**
 * Set custom error handler
 */
export function setErrorHandler(handler: ErrorHandler): void {
  errorHandler = handler;
}

/**
 * Get current error handler
 */
export function getErrorHandler(): ErrorHandler {
  return errorHandler;
}

/**
 * Report an error
 */
export function reportError(
  error: Error | unknown,
  type: ErrorType = ErrorType.UNKNOWN,
  context?: Record<string, unknown>
): void {
  const err = error instanceof Error ? error : new Error(String(error));
  errorHandler(err, type, context);
}

/**
 * Deprecation warning helper
 * Logs a warning when deprecated API is used
 */
const deprecationWarnings = new Set<string>();

export function deprecationWarning(oldAPI: string, newAPI: string, version?: string): void {
  const key = `${oldAPI}->${newAPI}`;
  if (deprecationWarnings.has(key)) {
    return; // Only warn once per deprecation
  }
  deprecationWarnings.add(key);

  const versionText = version ? ` (will be removed in v${version})` : '';
  console.warn(
    `[React Console Deprecation Warning] "${oldAPI}" is deprecated${versionText}. ` +
      `Please use "${newAPI}" instead.`
  );
}

/**
 * Wrap a function with error handling
 * Catches errors and reports them, then re-throws if needed
 */
export function withErrorHandling<T extends (...args: unknown[]) => unknown>(
  fn: T,
  type: ErrorType,
  context?: Record<string, unknown>,
  rethrow = false
): T {
  return ((...args: Parameters<T>) => {
    try {
      return fn(...args);
    } catch (error) {
      // Add function name to context if available
      const enhancedContext = {
        ...context,
        function: fn.name || 'anonymous',
        args: args.length > 0 ? args : undefined,
      };
      reportError(error, type, enhancedContext);
      if (rethrow) {
        throw error;
      }
      // Return undefined if not rethrowing and function expects return value
      return undefined as ReturnType<T>;
    }
  }) as T;
}

/**
 * Safe terminal dimensions getter with error handling
 */
export function safeGetTerminalDimensions(): { columns: number; rows: number } | null {
  try {
    // Import here to avoid circular dependencies
    const { getTerminalDimensions } = require('./terminal');
    return getTerminalDimensions();
  } catch (error) {
    reportError(error, ErrorType.TERMINAL_INIT);
    // Return default fallback dimensions
    return { columns: 80, rows: 24 };
  }
}

/**
 * Graceful degradation: Check if terminal supports required features
 */
export function checkTerminalSupport(): {
  supportsColor: boolean;
  supportsMouse: boolean;
  supportsRawMode: boolean;
  error?: Error;
} {
  try {
    // Import here to avoid circular dependencies
    const { supportsColor } = require('./terminal');
    const { supportsMouse } = require('./mouse');

    return {
      supportsColor: supportsColor(),
      supportsMouse: supportsMouse ? supportsMouse() : false,
      supportsRawMode: typeof process?.stdin?.setRawMode === 'function',
    };
  } catch (error) {
    reportError(error, ErrorType.TERMINAL_INIT);
    return {
      supportsColor: false,
      supportsMouse: false,
      supportsRawMode: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}
