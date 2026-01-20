/**
 * Class-based error handlers for React Console
 * Provides structured error handling patterns using classes
 */

import { ErrorType, type ErrorHandler } from './errors';

/**
 * Base error handler class
 * Provides common error handling functionality
 */
export abstract class BaseErrorHandler {
  protected context: Record<string, unknown> = {};

  /**
   * Handle an error
   */
  abstract handle(error: Error, type: ErrorType, context?: Record<string, unknown>): void;

  /**
   * Set handler context
   */
  setContext(context: Record<string, unknown>): this {
    this.context = { ...this.context, ...context };
    return this;
  }

  /**
   * Clear handler context
   */
  clearContext(): this {
    this.context = {};
    return this;
  }
}

/**
 * Console error handler
 * Logs errors to console with formatting
 */
export class ConsoleErrorHandler extends BaseErrorHandler {
  private includeStack: boolean;
  private includeContext: boolean;

  constructor(options: { includeStack?: boolean; includeContext?: boolean } = {}) {
    super();
    this.includeStack = options.includeStack ?? false;
    this.includeContext = options.includeContext ?? true;
  }

  handle(error: Error, type: ErrorType, context?: Record<string, unknown>): void {
    const allContext = { ...this.context, ...context };
    const contextStr = this.includeContext && Object.keys(allContext).length > 0
      ? ` ${JSON.stringify(allContext, null, 2)}`
      : '';
    const stackStr = this.includeStack && error.stack
      ? `\n${error.stack}`
      : '';

    console.error(`[React Console ${type} Error]${contextStr}: ${error.message}${stackStr}`);
  }
}

/**
 * Silent error handler
 * Suppresses error output (useful for testing)
 */
export class SilentErrorHandler extends BaseErrorHandler {
  handle(_error: Error, _type: ErrorType, _context?: Record<string, unknown>): void {
    // Do nothing - suppress errors
  }
}

/**
 * File error handler
 * Writes errors to a file (requires fs module)
 */
export class FileErrorHandler extends BaseErrorHandler {
  private filePath: string;
  private fs: typeof import('fs');

  constructor(filePath: string) {
    super();
    this.filePath = filePath;
    // Lazy load fs to avoid issues in environments without it
    this.fs = require('fs');
  }

  handle(error: Error, type: ErrorType, context?: Record<string, unknown>): void {
    const allContext = { ...this.context, ...context };
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      type,
      message: error.message,
      stack: error.stack,
      context: allContext,
    };

    try {
      const logLine = JSON.stringify(logEntry) + '\n';
      this.fs.appendFileSync(this.filePath, logLine, 'utf8');
    } catch (writeError) {
      // Fallback to console if file write fails
      console.error('[FileErrorHandler] Failed to write error log:', writeError);
      console.error(`[React Console ${type} Error]:`, error);
    }
  }
}

/**
 * Composite error handler
 * Combines multiple error handlers
 */
export class CompositeErrorHandler extends BaseErrorHandler {
  private handlers: BaseErrorHandler[];

  constructor(handlers: BaseErrorHandler[]) {
    super();
    this.handlers = handlers;
  }

  handle(error: Error, type: ErrorType, context?: Record<string, unknown>): void {
    const allContext = { ...this.context, ...context };
    for (const handler of this.handlers) {
      try {
        handler.handle(error, type, allContext);
      } catch (handlerError) {
        // If a handler fails, log it but continue with other handlers
        console.error('[CompositeErrorHandler] Handler failed:', handlerError);
      }
    }
  }

  /**
   * Add a handler
   */
  addHandler(handler: BaseErrorHandler): this {
    this.handlers.push(handler);
    return this;
  }

  /**
   * Remove a handler
   */
  removeHandler(handler: BaseErrorHandler): this {
    const index = this.handlers.indexOf(handler);
    if (index > -1) {
      this.handlers.splice(index, 1);
    }
    return this;
  }
}

/**
 * Error handler wrapper
 * Wraps a function with error handling using a class-based handler
 */
export function withErrorHandler<T extends (...args: unknown[]) => unknown>(
  fn: T,
  handler: BaseErrorHandler,
  type: ErrorType,
  context?: Record<string, unknown>,
  rethrow = false
): T {
  return ((...args: Parameters<T>) => {
    try {
      return fn(...args);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      handler.handle(err, type, { ...context, args });
      if (rethrow) {
        throw error;
      }
      return undefined as ReturnType<T>;
    }
  }) as T;
}

/**
 * Create a function wrapper with class-based error handling
 * Similar to withErrorHandling but uses class-based handlers
 */
export function createErrorHandlerWrapper(
  handler: BaseErrorHandler,
  defaultType: ErrorType = ErrorType.UNKNOWN
) {
  return <T extends (...args: unknown[]) => unknown>(
    fn: T,
    type: ErrorType = defaultType,
    context?: Record<string, unknown>,
    rethrow = false
  ): T => {
    return withErrorHandler(fn, handler, type, context, rethrow);
  };
}

/**
 * Set global error handler using a class-based handler
 */
export function setClassBasedErrorHandler(handler: BaseErrorHandler): void {
  const errorHandler: ErrorHandler = (error, type, context) => {
    handler.handle(error, type, context);
  };
  const { setErrorHandler } = require('./errors');
  setErrorHandler(errorHandler);
}
