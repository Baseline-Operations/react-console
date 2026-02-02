/**
 * Command execution utilities
 * Provides utilities for executing commands and handling execution results
 */

import type { ParsedArgs } from './parser';
import type { ComponentMetadata } from './matcher';

/**
 * Command execution result
 */
export interface CommandExecutionResult {
  /** Whether execution was successful */
  success: boolean;
  /** Exit code (0 for success, non-zero for errors) */
  exitCode: number;
  /** Output message (if any) */
  message?: string;
  /** Error message (if execution failed) */
  error?: string;
}

/**
 * Execute a command and return result
 * This is a utility for non-interactive command execution
 *
 * @param _parsedArgs - Parsed command arguments
 * @param _metadata - Component metadata
 * @returns Execution result
 */
export function executeCommand(
  _parsedArgs: ParsedArgs,
  _metadata: ComponentMetadata
): CommandExecutionResult {
  // This is a placeholder for command execution logic
  // In a real implementation, this would execute the command handler
  // For now, it just returns success
  return {
    success: true,
    exitCode: 0,
  };
}

/**
 * Check if a command should exit after execution
 *
 * @param _metadata - Component metadata
 * @param parsedArgs - Parsed arguments
 * @returns True if command should exit
 */
export function shouldExitAfterCommand(
  _metadata: ComponentMetadata,
  parsedArgs: ParsedArgs
): boolean {
  // Commands with --exit flag should exit
  if (parsedArgs.options.exit || parsedArgs.options['--exit']) {
    return true;
  }

  // Non-interactive commands should exit
  const appMetadata =
    typeof global !== 'undefined' && global.__react_console_cli_app__
      ? global.__react_console_cli_app__
      : undefined;

  return appMetadata?.interactive === false;
}

/**
 * Get exit code for command execution
 *
 * @param _metadata - Component metadata
 * @param parsedArgs - Parsed arguments
 * @param executionResult - Execution result
 * @returns Exit code
 */
export function getCommandExitCode(
  _metadata: ComponentMetadata,
  parsedArgs: ParsedArgs,
  executionResult?: CommandExecutionResult
): number {
  // Use exit code from execution result if available
  if (executionResult) {
    return executionResult.exitCode;
  }

  // Use --exit-code option if provided
  const exitCodeOption = parsedArgs.options['exit-code'] || parsedArgs.options['exitCode'];
  if (typeof exitCodeOption === 'number') {
    return exitCodeOption;
  }
  if (typeof exitCodeOption === 'string') {
    const code = parseInt(exitCodeOption, 10);
    if (!isNaN(code)) {
      return code;
    }
  }

  // Use app-level exit code
  const appMetadata =
    typeof global !== 'undefined' && global.__react_console_cli_app__
      ? global.__react_console_cli_app__
      : undefined;

  return appMetadata?.exitCode ?? 0;
}
