/**
 * React 19 use Hook Integration for Async Operations
 * 
 * Provides utilities for using React 19's `use` hook in terminal applications.
 * Useful for loading async data, promises, and context values.
 */

import { use } from 'react';

/**
 * Hook for async data loading in terminal applications
 * 
 * Wraps React 19's `use` hook for loading async data in terminal context.
 * Useful for loading data from storage, network requests, or other async operations.
 * 
 * @template T - Type of the promise result
 * @param promise - Promise to unwrap
 * @returns Resolved value from promise
 * 
 * @example
 * ```tsx
 * function DataComponent() {
 *   const dataPromise = useMemo(() => loadDataFromStorage(), []);
 *   const data = useAsync(dataPromise);
 *   
 *   return (
 *     <View>
 *       <Text>Data: {data.name}</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useAsync<T>(promise: Promise<T>): T {
  return use(promise);
}

/**
 * Hook for async data loading with error handling
 * 
 * Wraps `use` hook with error boundary support for better error handling.
 * 
 * @template T - Type of the promise result
 * @param promise - Promise to unwrap
 * @param fallback - Fallback value if promise rejects
 * @returns Resolved value from promise or fallback if rejected
 * 
 * @example
 * ```tsx
 * function DataComponent() {
 *   const dataPromise = useMemo(() => loadDataFromStorage(), []);
 *   const data = useAsyncWithFallback(dataPromise, { name: 'Default' });
 *   
 *   return (
 *     <View>
 *       <Text>Data: {data.name}</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useAsyncWithFallback<T>(
  promise: Promise<T>,
  fallback: T
): T {
  try {
    return use(promise);
  } catch {
    return fallback;
  }
}
