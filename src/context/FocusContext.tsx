/**
 * Focus Context Provider
 *
 * Provides focus management context for components that need to track or manage focus.
 * Useful for components that need to know which component is currently focused.
 */

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { terminal } from '../utils/globalTerminal';
import type { ConsoleNode } from '../types';

interface FocusContextValue {
  focusedComponent: ConsoleNode | null;
  isFocused: (component: ConsoleNode | null) => boolean;
  setFocused: (component: ConsoleNode | null) => void;
}

const FocusContext = createContext<FocusContextValue | null>(null);

/**
 * Focus Provider
 *
 * Provides focus management context to child components.
 * Tracks the currently focused component and provides utilities to check/manage focus.
 *
 * @param children - Child components
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <FocusProvider>
 *       <FocusableComponent />
 *     </FocusProvider>
 *   );
 * }
 * ```
 */
export function FocusProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [focusedComponent, setFocusedComponentState] = useState<ConsoleNode | null>(() => {
    return terminal.focusedComponent;
  });

  useEffect(() => {
    // Check focus periodically (focus changes are handled by renderer)
    const checkFocus = () => {
      const current = terminal.focusedComponent;
      if (current !== focusedComponent) {
        setFocusedComponentState(current);
      }
    };

    const interval = setInterval(checkFocus, 50);

    return () => {
      clearInterval(interval);
    };
  }, [focusedComponent]);

  const isFocused = (component: ConsoleNode | null): boolean => {
    return focusedComponent === component;
  };

  const setFocused = (component: ConsoleNode | null): void => {
    terminal.focusedComponent = component;
    setFocusedComponentState(component);
  };

  const value: FocusContextValue = {
    focusedComponent,
    isFocused,
    setFocused,
  };

  return <FocusContext.Provider value={value}>{children}</FocusContext.Provider>;
}

/**
 * Hook to use focus context
 *
 * Returns focus management utilities from the nearest FocusProvider.
 *
 * @returns Focus context value
 * @throws Error if used outside FocusProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { focusedComponent, isFocused, setFocused } = useFocusContext();
 *   const [myNode, setMyNode] = useState<ConsoleNode | null>(null);
 *
 *   return (
 *     <View>
 *       <Text>Focused: {isFocused(myNode) ? 'Yes' : 'No'}</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useFocusContext(): FocusContextValue {
  const context = useContext(FocusContext);
  if (!context) {
    throw new Error('useFocusContext must be used within FocusProvider');
  }
  return context;
}
