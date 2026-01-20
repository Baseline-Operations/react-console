/**
 * Debug utilities for development and debugging
 * Provides debug mode flag, component tree inspection, and performance profiling
 */

let debugModeEnabled = false;

/**
 * Enable or disable debug mode
 * @param enabled - Whether debug mode should be enabled
 */
export function setDebugMode(enabled: boolean): void {
  debugModeEnabled = enabled;
  
  if (enabled) {
    console.log('[React Console] Debug mode enabled');
  }
}

/**
 * Check if debug mode is enabled
 * @returns True if debug mode is enabled
 */
export function isDebugMode(): boolean {
  return debugModeEnabled;
}

/**
 * Debug log function (only logs if debug mode is enabled)
 * @param message - Message to log
 * @param ...args - Additional arguments to log
 */
export function debugLog(message: string, ...args: unknown[]): void {
  if (debugModeEnabled) {
    console.log(`[React Console Debug] ${message}`, ...args);
  }
}

/**
 * Debug error function (always logs, but with debug prefix if enabled)
 * @param message - Error message
 * @param ...args - Additional arguments
 */
export function debugError(message: string, ...args: unknown[]): void {
  if (debugModeEnabled) {
    console.error(`[React Console Debug] ${message}`, ...args);
  } else {
    console.error(message, ...args);
  }
}

/**
 * Component tree inspector
 * Formats and logs component tree structure
 */
export function inspectComponentTree(
  node: { type: string; children?: unknown[] },
  indent = 0
): void {
  if (!debugModeEnabled) return;
  
  const indentStr = '  '.repeat(indent);
  const childrenCount = Array.isArray(node.children) ? node.children.length : 0;
  debugLog(`${indentStr}${node.type}${childrenCount > 0 ? ` (${childrenCount} children)` : ''}`);
  
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      if (child && typeof child === 'object' && 'type' in child) {
        inspectComponentTree(child as { type: string; children?: unknown[] }, indent + 1);
      }
    }
  }
}

/**
 * Performance profiler
 * Measures and logs performance metrics
 */
class PerformanceProfiler {
  private measurements: Map<string, number[]> = new Map();
  
  /**
   * Start timing an operation
   * @param label - Label for this timing operation
   */
  start(label: string): void {
    if (!debugModeEnabled) return;
    
    const key = `${label}_start`;
    this.measurements.set(key, [Date.now()]);
  }
  
  /**
   * End timing an operation and log the duration
   * @param label - Label for this timing operation
   * @returns Duration in milliseconds
   */
  end(label: string): number {
    if (!debugModeEnabled) return 0;
    
    const startKey = `${label}_start`;
    const startTime = this.measurements.get(startKey)?.[0];
    
    if (!startTime) {
      debugLog(`Performance: No start time found for "${label}"`);
      return 0;
    }
    
    const duration = Date.now() - startTime;
    this.measurements.delete(startKey);
    
    // Track duration for this operation
    const durations = this.measurements.get(label) || [];
    durations.push(duration);
    this.measurements.set(label, durations);
    
    debugLog(`Performance: "${label}" took ${duration}ms`);
    
    return duration;
  }
  
  /**
   * Get statistics for a timing operation
   * @param label - Label for the operation
   * @returns Statistics object or null
   */
  getStats(label: string): { count: number; total: number; average: number; min: number; max: number } | null {
    if (!debugModeEnabled) return null;
    
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
    if (!debugModeEnabled) return;
    
    const stats = this.getStats(label);
    if (!stats) {
      debugLog(`Performance: No stats available for "${label}"`);
      return;
    }
    
    debugLog(
      `Performance Stats for "${label}":`,
      `Count: ${stats.count},`,
      `Total: ${stats.total}ms,`,
      `Average: ${stats.average.toFixed(2)}ms,`,
      `Min: ${stats.min}ms,`,
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
