/**
 * React Hooks for Terminal State
 *
 * Provides React hooks for terminal-specific state management:
 * - Terminal dimensions (reactive to resize)
 * - Focus state
 * - Terminal configuration
 */

import { useState, useEffect, useCallback } from 'react';
import { terminal, updateTerminalDimensions } from '../utils/globalTerminal';
import { supportsColor, onTerminalResizeDebounced } from '../utils/terminal';
import { supportsMouse } from '../utils/mouse';
import type { TerminalDimensions } from '../types';
import type { ConsoleNode } from '../types';

/**
 * Hook for reactive terminal dimensions
 *
 * Returns the current terminal dimensions and automatically updates
 * when the terminal is resized. Useful for responsive layouts.
 *
 * @returns Current terminal dimensions { columns, rows }
 *
 * @example
 * ```tsx
 * function ResponsiveComponent() {
 *   const dims = useTerminalDimensions();
 *
 *   return (
 *     <View>
 *       <Text>Terminal size: {dims.columns}x{dims.rows}</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useTerminalDimensions(): TerminalDimensions {
  const [dimensions, setDimensions] = useState<TerminalDimensions>(() => {
    return terminal.dimensions;
  });

  useEffect(() => {
    // Update dimensions when terminal resizes
    const updateDims = () => {
      updateTerminalDimensions();
      setDimensions({ ...terminal.dimensions });
    };

    // Listen to terminal resize events with debouncing to prevent excessive updates
    const cleanup = onTerminalResizeDebounced(updateDims, 100);

    return cleanup;
  }, []);

  return dimensions;
}

/**
 * Hook for managing component focus state
 *
 * Returns the currently focused component and provides utilities
 * to check if a specific component is focused.
 *
 * @param componentRef - Optional reference to a specific component to track
 * @returns Object with focused component and helper functions
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { focusedComponent, isFocused, focus } = useFocus();
 *
 *   return (
 *     <Button
 *       focused={isFocused}
 *       onClick={() => focus()}
 *     >
 *       Click to Focus
 *     </Button>
 *   );
 * }
 * ```
 */
export function useFocus(componentRef?: ConsoleNode | null): {
  focusedComponent: ConsoleNode | null;
  isFocused: boolean;
  focus: () => void;
  blur: () => void;
} {
  const [focusedComponent, setFocusedComponent] = useState<ConsoleNode | null>(() => {
    return terminal.focusedComponent;
  });

  useEffect(() => {
    // Update when focus changes
    // Since focus changes trigger re-renders via React reconciliation,
    // we can check focus on each render cycle
    // For more immediate updates, we could use a custom event system
    const checkFocus = () => {
      const current = terminal.focusedComponent;
      if (current !== focusedComponent) {
        setFocusedComponent(current);
      }
    };

    // Check focus periodically (focus changes are handled by renderer)
    // In a future enhancement, we could add a focus change event emitter
    const interval = setInterval(checkFocus, 50);

    return () => {
      clearInterval(interval);
    };
  }, [focusedComponent]);

  const isFocused = componentRef ? focusedComponent === componentRef : focusedComponent !== null;

  const focus = useCallback(() => {
    if (componentRef) {
      // Import dynamically to avoid circular dependencies
      import('../renderer/utils/navigation').then(({ focusComponent }) => {
        const interactiveComponents: ConsoleNode[] = [];
        // Collect interactive components (simplified - in real implementation would get from tree)
        // Cast ConsoleNode to Node since they are compatible
        focusComponent(
          componentRef as unknown as import('../nodes/base/Node').Node,
          interactiveComponents as unknown as import('../nodes/base/Node').Node[],
          () => {
            // Trigger re-render
            setFocusedComponent(terminal.focusedComponent);
          }
        );
      });
    }
  }, [componentRef]);

  const blur = useCallback(() => {
    if (componentRef && focusedComponent === componentRef) {
      terminal.focusedComponent = null;
      setFocusedComponent(null);
    }
  }, [componentRef, focusedComponent]);

  return {
    focusedComponent,
    isFocused,
    focus,
    blur,
  };
}

/**
 * Hook for terminal configuration and capabilities
 *
 * Returns terminal capabilities like color support, mouse support, etc.
 * Useful for conditionally enabling features based on terminal capabilities.
 *
 * @returns Terminal configuration object
 *
 * @example
 * ```tsx
 * function AdaptiveComponent() {
 *   const config = useTerminalConfig();
 *
 *   return (
 *     <View>
 *       {config.supportsColor && <Text color="red">Colored text</Text>}
 *       {config.supportsMouse && <Text>Mouse supported</Text>}
 *     </View>
 *   );
 * }
 * ```
 */
export function useTerminalConfig(): {
  supportsColor: boolean;
  supportsMouse: boolean;
  dimensions: TerminalDimensions;
} {
  const [config, setConfig] = useState(() => {
    return {
      supportsColor: supportsColor(),
      supportsMouse: supportsMouse(),
      dimensions: terminal.dimensions,
    };
  });

  useEffect(() => {
    // Update config when dimensions change
    const updateConfig = () => {
      setConfig({
        supportsColor: supportsColor(),
        supportsMouse: supportsMouse(),
        dimensions: { ...terminal.dimensions },
      });
    };

    // Listen to terminal resize events
    // Use debounced resize to prevent excessive updates
    const cleanup = onTerminalResizeDebounced(updateConfig, 100);

    return cleanup;
  }, []);

  return config;
}
