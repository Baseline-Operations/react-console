/**
 * React 19 use Hook Integration for Async Operations
 *
 * Provides utilities for using React 19's `use` hook in terminal applications.
 * Useful for loading async data, promises, and context values.
 */

import { use, useState, useEffect, useRef } from 'react';

/**
 * Hook for async data loading in terminal applications
 *
 * Wraps React 19's `use` hook for loading async data in terminal context.
 * Useful for loading data from storage, network requests, or other async operations.
 *
 * Note: This hook suspends the component until the promise resolves.
 * Wrap your component in a Suspense boundary to handle the loading state.
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
 *
 * // Usage with Suspense:
 * <Suspense fallback={<Text>Loading...</Text>}>
 *   <DataComponent />
 * </Suspense>
 * ```
 */
export function useAsync<T>(promise: Promise<T>): T {
  return use(promise);
}

/**
 * Hook for async data loading with fallback value
 *
 * Unlike useAsync, this hook does NOT suspend. It returns the fallback value
 * immediately and updates to the resolved value when the promise completes.
 * This is useful when you want to show a default value while loading.
 *
 * @template T - Type of the promise result
 * @param promise - Promise to resolve
 * @param fallback - Initial/fallback value while promise is pending or on error
 * @returns Current value (fallback while loading, resolved value when complete)
 *
 * @example
 * ```tsx
 * function DataComponent() {
 *   const dataPromise = useMemo(() => loadDataFromStorage(), []);
 *   const data = useAsyncWithFallback(dataPromise, { name: 'Loading...' });
 *
 *   return (
 *     <View>
 *       <Text>Data: {data.name}</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useAsyncWithFallback<T>(promise: Promise<T>, fallback: T): T {
  const [value, setValue] = useState<T>(fallback);
  const promiseRef = useRef(promise);

  useEffect(() => {
    // Track if effect is still mounted
    let cancelled = false;

    // If promise changed, reset to fallback
    if (promiseRef.current !== promise) {
      promiseRef.current = promise;
      setValue(fallback);
    }

    // Resolve promise and update state
    promise
      .then((result) => {
        if (!cancelled) {
          setValue(result);
        }
      })
      .catch(() => {
        // On error, keep the fallback value
        // Optionally could add error state here
      });

    return () => {
      cancelled = true;
    };
  }, [promise, fallback]);

  return value;
}
