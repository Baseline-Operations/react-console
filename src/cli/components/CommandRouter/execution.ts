/**
 * Command execution flow for CommandRouter
 * Functions for executing middleware, lifecycle hooks, and validation
 */

import type { ParsedArgs } from '../../utils/parser';
import type { ComponentMetadata } from '../../utils/matcher';
import type { ParamValidationResult } from '../../utils/paramValidator';
import { executeMiddleware } from '../../utils/middleware';
import { executeBeforeHooks, executeAfterHooks } from '../../utils/lifecycle';
import { validateCommandParams } from '../../utils/paramValidator';

/**
 * Execute middleware chain
 * Runs command-specific middleware first, then global middleware
 *
 * @param matchedMetadata - Matched component metadata
 * @param normalizedArgs - Normalized parsed arguments
 * @param isDefault - Whether this is the default component
 * @returns Result with modified args and stop flag
 */
export function executeMiddlewareChain(
  matchedMetadata: ComponentMetadata | null,
  normalizedArgs: ParsedArgs,
  isDefault: boolean
): { args: ParsedArgs; shouldStop: boolean } {
  if (!matchedMetadata || isDefault || matchedMetadata.type !== 'command') {
    return { args: normalizedArgs, shouldStop: false };
  }

  // Execute command-specific middleware first
  if (matchedMetadata.middleware && matchedMetadata.middleware.length > 0) {
    let currentArgs = normalizedArgs;
    for (const middleware of matchedMetadata.middleware) {
      const result = middleware(currentArgs, matchedMetadata);
      if (result === false) {
        return { args: currentArgs, shouldStop: true };
      }
      if (result !== undefined) {
        currentArgs = result;
      }
    }
    return { args: currentArgs, shouldStop: false };
  }

  // Execute global middleware
  const globalResult = executeMiddleware(normalizedArgs.command, normalizedArgs, matchedMetadata);
  if (globalResult === false) {
    return { args: normalizedArgs, shouldStop: true };
  }
  return { args: globalResult, shouldStop: false };
}

/**
 * Execute before lifecycle hooks
 *
 * @param matchedMetadata - Matched component metadata
 * @param normalizedArgs - Normalized parsed arguments
 * @param middlewareArgs - Arguments after middleware processing
 * @param isDefault - Whether this is the default component
 */
export async function executeBeforeHooksChain(
  matchedMetadata: ComponentMetadata | null,
  normalizedArgs: ParsedArgs,
  middlewareArgs: ParsedArgs,
  _isDefault: boolean
): Promise<void> {
  if (!matchedMetadata) {
    return;
  }

  // Execute component-specific before hook (works for both commands and default)
  if (matchedMetadata.before) {
    const args = matchedMetadata.type === 'command' ? middlewareArgs : normalizedArgs;
    await executeBeforeHooks(normalizedArgs.command, args, matchedMetadata);
  }

  // Execute global before hooks (only for commands)
  if (matchedMetadata.type === 'command') {
    await executeBeforeHooks(normalizedArgs.command, middlewareArgs, matchedMetadata);
  }
}

/**
 * Execute after lifecycle hooks
 *
 * @param matchedMetadata - Matched component metadata
 * @param normalizedArgs - Normalized parsed arguments
 * @param middlewareArgs - Arguments after middleware processing
 * @param isDefault - Whether this is the default component
 */
export async function executeAfterHooksChain(
  matchedMetadata: ComponentMetadata | null,
  normalizedArgs: ParsedArgs,
  middlewareArgs: ParsedArgs,
  _isDefault: boolean
): Promise<void> {
  if (!matchedMetadata) {
    return;
  }

  // Execute component-specific after hook (works for both commands and default)
  if (matchedMetadata.after) {
    const args = matchedMetadata.type === 'command' ? middlewareArgs : normalizedArgs;
    await executeAfterHooks(normalizedArgs.command, args, matchedMetadata);
  }

  // Execute global after hooks (only for commands)
  if (matchedMetadata.type === 'command') {
    await executeAfterHooks(normalizedArgs.command, middlewareArgs, matchedMetadata);
  }
}

/**
 * Validate command parameters
 *
 * @param matchedMetadata - Matched component metadata
 * @param middlewareArgs - Arguments after middleware processing
 * @param isDefault - Whether this is the default component
 * @returns Validation result or null
 */
export function validateCommandParameters(
  matchedMetadata: ComponentMetadata | null,
  middlewareArgs: ParsedArgs,
  isDefault: boolean
): ParamValidationResult | null {
  if (!matchedMetadata || isDefault) {
    return null;
  }

  return validateCommandParams(middlewareArgs, matchedMetadata);
}
