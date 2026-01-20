/**
 * Terminal Dimensions Context Provider
 * 
 * Provides terminal dimensions context for components that need reactive terminal size.
 * Useful for components that need to adjust layout based on terminal dimensions.
 */

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { terminal, updateTerminalDimensions } from '../utils/globalTerminal';
import { onTerminalResizeDebounced } from '../utils/terminal';
import type { TerminalDimensions } from '../types';

interface TerminalDimensionsContextValue {
  dimensions: TerminalDimensions;
  columns: number;
  rows: number;
}

const TerminalDimensionsContext = createContext<TerminalDimensionsContextValue | null>(null);

/**
 * Terminal Dimensions Provider
 * 
 * Provides terminal dimensions context to child components.
 * Automatically updates when terminal is resized.
 * 
 * @param children - Child components
 * 
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <TerminalDimensionsProvider>
 *       <ResponsiveComponent />
 *     </TerminalDimensionsProvider>
 *   );
 * }
 * ```
 */
export function TerminalDimensionsProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [dimensions, setDimensions] = useState<TerminalDimensions>(() => {
    return terminal.dimensions;
  });

  useEffect(() => {
    const updateDims = () => {
      updateTerminalDimensions();
      setDimensions({ ...terminal.dimensions });
    };

    // Use debounced resize to prevent excessive updates
    const cleanup = onTerminalResizeDebounced(updateDims, 100);

    return cleanup;
  }, []);

  const value: TerminalDimensionsContextValue = {
    dimensions,
    columns: dimensions.columns,
    rows: dimensions.rows,
  };

  return (
    <TerminalDimensionsContext.Provider value={value}>
      {children}
    </TerminalDimensionsContext.Provider>
  );
}

/**
 * Hook to use terminal dimensions context
 * 
 * Returns terminal dimensions from the nearest TerminalDimensionsProvider.
 * 
 * @returns Terminal dimensions context value
 * @throws Error if used outside TerminalDimensionsProvider
 * 
 * @example
 * ```tsx
 * function ResponsiveComponent() {
 *   const { dimensions, columns, rows } = useTerminalDimensionsContext();
 *   
 *   return (
 *     <View>
 *       <Text>Size: {columns}x{rows}</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useTerminalDimensionsContext(): TerminalDimensionsContextValue {
  const context = useContext(TerminalDimensionsContext);
  if (!context) {
    throw new Error('useTerminalDimensionsContext must be used within TerminalDimensionsProvider');
  }
  return context;
}
