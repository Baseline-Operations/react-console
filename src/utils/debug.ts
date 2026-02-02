/**
 * Debug utilities for development and debugging
 *
 * File-based logging is the primary debug mechanism.
 * Set FILE_DEBUG_ENABLED to true to enable logging to /tmp/react-debug.log
 * All debug calls are no-ops when disabled, so they can be left in the codebase.
 */

import * as fs from 'fs';

// ============================================================================
// Configuration
// ============================================================================

/**
 * Master toggle for all debug logging.
 * Set to true to enable file-based debug logging.
 */
const FILE_DEBUG_ENABLED = true;

const DEBUG_FILE_LOG_PATH = '/tmp/react-debug.log';

let fileDebugInitialized = false;

// ============================================================================
// Core Debug Functions
// ============================================================================

/**
 * Initialize debug logging - clears the log file if enabled.
 * Called automatically on first log, but can be called manually at app start.
 */
export function initDebug(): void {
  if (!FILE_DEBUG_ENABLED || fileDebugInitialized) return;

  try {
    fs.writeFileSync(
      DEBUG_FILE_LOG_PATH,
      `=== Debug session started at ${new Date().toISOString()} ===\n`
    );
    fileDebugInitialized = true;
  } catch {
    // Ignore errors - debug logging should never break the app
  }
}

/**
 * Log a debug message to file with timestamp.
 * No-op if FILE_DEBUG_ENABLED is false.
 *
 * @param message - The message to log
 * @param data - Optional data to include (will be JSON stringified)
 */
export function debug(message: string, data?: unknown): void {
  if (!FILE_DEBUG_ENABLED) return;

  if (!fileDebugInitialized) {
    initDebug();
  }

  try {
    const timestamp = Date.now();
    let logLine = `[${timestamp}] ${message}`;

    if (data !== undefined) {
      try {
        logLine += ` ${JSON.stringify(data)}`;
      } catch {
        logLine += ` [unserializable data]`;
      }
    }

    fs.appendFileSync(DEBUG_FILE_LOG_PATH, logLine + '\n');
  } catch {
    // Ignore errors - debug logging should never break the app
  }
}

/**
 * Log a debug message with a label/category.
 * Useful for filtering logs by component/area.
 *
 * @param label - Category label (e.g., 'InputNode', 'scheduleUpdate')
 * @param message - The message to log
 * @param data - Optional data to include
 */
export function debugLabeled(label: string, message: string, data?: unknown): void {
  debug(`[${label}] ${message}`, data);
}

/**
 * Log an error message
 * @param message - Error message
 * @param data - Optional error data
 */
export function debugError(message: string, data?: unknown): void {
  debug(`[ERROR] ${message}`, data);
}

/**
 * Check if debug logging is enabled
 */
export function isDebugEnabled(): boolean {
  return FILE_DEBUG_ENABLED;
}

/**
 * Get the debug log path
 */
export function getDebugLogPath(): string {
  return DEBUG_FILE_LOG_PATH;
}

// ============================================================================
// Legacy API compatibility (maps to file-based logging)
// ============================================================================

/**
 * @deprecated Use isDebugEnabled() instead
 */
export function setDebugMode(_enabled: boolean): void {
  // No-op - debug mode is controlled by FILE_DEBUG_ENABLED constant
  debug('setDebugMode called (no-op, use FILE_DEBUG_ENABLED constant)');
}

/**
 * @deprecated Use isDebugEnabled() instead
 */
export function isDebugMode(): boolean {
  return FILE_DEBUG_ENABLED;
}

/**
 * @deprecated Use debug() instead
 */
export function debugLog(message: string, ...args: unknown[]): void {
  debug(message, args.length > 0 ? args : undefined);
}

/**
 * Component tree inspector
 * Formats and logs component tree structure
 */
export function inspectComponentTree(
  node: { type: string; children?: unknown[] },
  indent = 0
): void {
  if (!FILE_DEBUG_ENABLED) return;

  const indentStr = '  '.repeat(indent);
  const childrenCount = Array.isArray(node.children) ? node.children.length : 0;
  debug(`${indentStr}${node.type}${childrenCount > 0 ? ` (${childrenCount} children)` : ''}`);

  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      if (child && typeof child === 'object' && 'type' in child) {
        inspectComponentTree(child as { type: string; children?: unknown[] }, indent + 1);
      }
    }
  }
}

// ============================================================================
// Performance Profiler
// ============================================================================

/**
 * Performance profiler
 * Measures and logs performance metrics to the debug log file
 */
class PerformanceProfiler {
  private measurements: Map<string, number[]> = new Map();

  /**
   * Start timing an operation
   * @param label - Label for this timing operation
   */
  start(label: string): void {
    if (!FILE_DEBUG_ENABLED) return;

    const key = `${label}_start`;
    this.measurements.set(key, [Date.now()]);
  }

  /**
   * End timing an operation and log the duration
   * @param label - Label for this timing operation
   * @returns Duration in milliseconds
   */
  end(label: string): number {
    if (!FILE_DEBUG_ENABLED) return 0;

    const startKey = `${label}_start`;
    const startTime = this.measurements.get(startKey)?.[0];

    if (!startTime) {
      debug(`Performance: No start time found for "${label}"`);
      return 0;
    }

    const duration = Date.now() - startTime;
    this.measurements.delete(startKey);

    // Track duration for this operation
    const durations = this.measurements.get(label) || [];
    durations.push(duration);
    this.measurements.set(label, durations);

    debug(`Performance: "${label}" took ${duration}ms`);

    return duration;
  }

  /**
   * Get statistics for a timing operation
   * @param label - Label for the operation
   * @returns Statistics object or null
   */
  getStats(
    label: string
  ): { count: number; total: number; average: number; min: number; max: number } | null {
    if (!FILE_DEBUG_ENABLED) return null;

    const durations = this.measurements.get(label);
    if (!durations || durations.length === 0) {
      return null;
    }

    const total = durations.reduce((sum, d) => sum + d, 0);
    const average = total / durations.length;
    const min = Math.min(...durations);
    const max = Math.max(...durations);

    return {
      count: durations.length,
      total,
      average,
      min,
      max,
    };
  }

  /**
   * Log statistics for a timing operation
   * @param label - Label for the operation
   */
  logStats(label: string): void {
    if (!FILE_DEBUG_ENABLED) return;

    const stats = this.getStats(label);
    if (!stats) {
      debug(`Performance: No stats available for "${label}"`);
      return;
    }

    debug(
      `Performance Stats for "${label}": ` +
        `Count: ${stats.count}, ` +
        `Total: ${stats.total}ms, ` +
        `Average: ${stats.average.toFixed(2)}ms, ` +
        `Min: ${stats.min}ms, ` +
        `Max: ${stats.max}ms`
    );
  }

  /**
   * Clear all measurements
   */
  clear(): void {
    this.measurements.clear();
  }
}

export const performanceProfiler = new PerformanceProfiler();
