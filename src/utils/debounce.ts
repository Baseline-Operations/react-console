/**
 * Debounce utilities for React Console
 * Provides debouncing for events like terminal resize
 */

/**
 * Debounce a function call
 * Delays execution until after the specified delay has passed since the last invocation
 *
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds (default: 100)
 * @returns Debounced function
 *
 * @example
 * ```ts
 * const debouncedResize = debounce(() => {
 *   console.log('Resized');
 * }, 100);
 *
 * // Call multiple times rapidly
 * debouncedResize();
 * debouncedResize();
 * debouncedResize();
 * // Only executes once after 100ms of no calls
 * ```
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number = 100
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Debounce with immediate execution option
 * Can execute immediately on first call, then debounce subsequent calls
 *
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds (default: 100)
 * @param immediate - Execute immediately on first call (default: false)
 * @returns Debounced function
 *
 * @example
 * ```ts
 * const debounced = debounceImmediate(() => {
 *   console.log('Called');
 * }, 100, true);
 *
 * debounced(); // Executes immediately
 * debounced(); // Debounced
 * debounced(); // Debounced
 * ```
 */
export function debounceImmediate<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number = 100,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  let hasExecuted = false;

  return (...args: Parameters<T>) => {
    const callNow = immediate && !hasExecuted;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      if (!immediate || hasExecuted) {
        fn(...args);
      }
      timeoutId = null;
      hasExecuted = false;
    }, delay);

    if (callNow) {
      fn(...args);
      hasExecuted = true;
    }
  };
}

/**
 * Throttle a function call
 * Limits execution to at most once per specified delay period
 *
 * @param fn - Function to throttle
 * @param delay - Delay in milliseconds (default: 100)
 * @returns Throttled function
 *
 * @example
 * ```ts
 * const throttled = throttle(() => {
 *   console.log('Called');
 * }, 100);
 *
 * // Rapid calls
 * throttled(); // Executes
 * throttled(); // Ignored
 * throttled(); // Ignored
 * // After 100ms, next call executes
 * ```
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number = 100
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;

    if (timeSinceLastCall >= delay) {
      lastCall = now;
      fn(...args);
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        fn(...args);
        timeoutId = null;
      }, delay - timeSinceLastCall);
    }
  };
}
