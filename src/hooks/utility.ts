/**
 * Utility hooks - Common React hooks for terminal applications
 * React Native compatible patterns adapted for terminal use
 */

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Color scheme type
 */
export type ColorScheme = 'light' | 'dark' | 'no-preference';

/**
 * Hook: useColorScheme
 * Detect terminal color scheme (light/dark mode)
 *
 * Note: Terminal color scheme detection is limited. This hook checks
 * environment variables and terminal capabilities.
 *
 * @returns Current color scheme ('light', 'dark', or 'no-preference')
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const colorScheme = useColorScheme();
 *
 *   const bgColor = colorScheme === 'dark' ? '#1a1a1a' : '#ffffff';
 *
 *   return <View style={{ backgroundColor: bgColor }}>...</View>;
 * }
 * ```
 */
export function useColorScheme(): ColorScheme {
  const [colorScheme] = useState<ColorScheme>(() => {
    // Check environment variables
    const termProgram = process.env.TERM_PROGRAM;
    const colorfgbg = process.env.COLORFGBG;

    // Check COLORFGBG (format: "fg;bg" where high bg = light theme)
    if (colorfgbg) {
      const parts = colorfgbg.split(';');
      const bg = parseInt(parts[1] || '0', 10);
      // Background >= 8 typically indicates light theme
      if (bg >= 8) return 'light';
      if (bg >= 0) return 'dark';
    }

    // Check for known dark terminals
    if (termProgram === 'iTerm.app' || termProgram === 'Hyper') {
      // These default to dark but can be light
      return 'dark';
    }

    // Default to dark (most terminals are dark by default)
    return 'dark';
  });

  return colorScheme;
}

/**
 * Hook: useTimeout
 * setTimeout as a React hook with automatic cleanup
 *
 * @param callback - Function to call after delay
 * @param delay - Delay in milliseconds (null to disable)
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const [visible, setVisible] = useState(true);
 *
 *   // Hide after 3 seconds
 *   useTimeout(() => setVisible(false), 3000);
 *
 *   return visible ? <Text>Visible for 3 seconds</Text> : null;
 * }
 * ```
 */
export function useTimeout(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the timeout
  useEffect(() => {
    if (delay === null) return;

    const id = setTimeout(() => {
      savedCallback.current();
    }, delay);

    return () => clearTimeout(id);
  }, [delay]);
}

/**
 * Hook: useInterval
 * setInterval as a React hook with automatic cleanup
 *
 * @param callback - Function to call on each interval
 * @param delay - Interval in milliseconds (null to disable)
 *
 * @example
 * ```tsx
 * function Timer() {
 *   const [count, setCount] = useState(0);
 *
 *   // Increment every second
 *   useInterval(() => setCount(c => c + 1), 1000);
 *
 *   return <Text>Count: {count}</Text>;
 * }
 * ```
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => {
      savedCallback.current();
    }, delay);

    return () => clearInterval(id);
  }, [delay]);
}

/**
 * Hook: usePrevious
 * Get the previous value of a variable
 *
 * @param value - Current value
 * @returns Previous value (undefined on first render)
 *
 * @example
 * ```tsx
 * function MyComponent({ count }) {
 *   const prevCount = usePrevious(count);
 *
 *   return (
 *     <Text>
 *       Current: {count}, Previous: {prevCount ?? 'none'}
 *     </Text>
 *   );
 * }
 * ```
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

/**
 * Hook: useIsMounted
 * Check if component is still mounted (useful for async operations)
 *
 * @returns Function that returns true if mounted
 *
 * @example
 * ```tsx
 * function AsyncComponent() {
 *   const [data, setData] = useState(null);
 *   const isMounted = useIsMounted();
 *
 *   useEffect(() => {
 *     fetchData().then(result => {
 *       if (isMounted()) {
 *         setData(result);
 *       }
 *     });
 *   }, []);
 *
 *   return <Text>{data ?? 'Loading...'}</Text>;
 * }
 * ```
 */
export function useIsMounted(): () => boolean {
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return useCallback(() => mountedRef.current, []);
}

/**
 * Hook: useDebounce
 * Debounce a value - useful for search inputs
 *
 * @param value - Value to debounce
 * @param delay - Debounce delay in milliseconds
 * @returns Debounced value
 *
 * @example
 * ```tsx
 * function SearchComponent() {
 *   const [search, setSearch] = useState('');
 *   const debouncedSearch = useDebounce(search, 300);
 *
 *   useEffect(() => {
 *     // Only search after user stops typing for 300ms
 *     performSearch(debouncedSearch);
 *   }, [debouncedSearch]);
 *
 *   return <TextInput value={search} onChangeText={setSearch} />;
 * }
 * ```
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook: useToggle
 * Boolean toggle state
 *
 * @param initialValue - Initial boolean value
 * @returns [value, toggle, setValue]
 *
 * @example
 * ```tsx
 * function ToggleComponent() {
 *   const [isOn, toggle, setIsOn] = useToggle(false);
 *
 *   return (
 *     <Pressable onPress={toggle}>
 *       <Text>{isOn ? 'ON' : 'OFF'}</Text>
 *     </Pressable>
 *   );
 * }
 * ```
 */
export function useToggle(initialValue = false): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = useCallback(() => {
    setValue((v) => !v);
  }, []);

  return [value, toggle, setValue];
}
