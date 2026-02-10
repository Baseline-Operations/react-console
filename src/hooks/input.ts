/**
 * React Hooks for Input State
 *
 * Provides React hooks for managing input component state:
 * - Input value and cursor position
 * - Multiline input state
 * - Global input handling (useInput)
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { ConsoleNode, KeyPress } from '../types';

// Global input handlers registry - stored in globalThis for ESM/CJS compatibility
const GLOBAL_INPUT_HANDLERS_KEY = '__reactConsoleGlobalInputHandlers__';

type InputHandler = (input: string, key: KeyPress) => void;

interface GlobalInputHandlersRegistry {
  handlers: Map<string, InputHandler>;
  idCounter: number;
}

function getGlobalInputHandlers(): GlobalInputHandlersRegistry {
  let registry = (globalThis as Record<string, unknown>)[GLOBAL_INPUT_HANDLERS_KEY] as
    | GlobalInputHandlersRegistry
    | undefined;

  if (!registry) {
    registry = {
      handlers: new Map(),
      idCounter: 0,
    };
    (globalThis as Record<string, unknown>)[GLOBAL_INPUT_HANDLERS_KEY] = registry;
  }

  return registry;
}

/**
 * Register a global input handler
 * @internal - Used by useInput hook
 */
export function registerGlobalInputHandler(handler: InputHandler): string {
  const registry = getGlobalInputHandlers();
  const id = `input_handler_${++registry.idCounter}`;
  registry.handlers.set(id, handler);
  return id;
}

/**
 * Unregister a global input handler
 * @internal - Used by useInput hook
 */
export function unregisterGlobalInputHandler(id: string): void {
  const registry = getGlobalInputHandlers();
  registry.handlers.delete(id);
}

/**
 * Call all registered global input handlers
 * @internal - Called by the renderer's input listener
 */
export function callGlobalInputHandlers(input: string, key: KeyPress): void {
  const registry = getGlobalInputHandlers();
  for (const handler of registry.handlers.values()) {
    try {
      handler(input, key);
    } catch (error) {
      // Don't let one handler's error break others
      if (process.env.NODE_ENV !== 'production') {
        console.error('Global input handler error:', error);
      }
    }
  }
}

/**
 * Check if there are any global input handlers registered
 * @internal - Used by renderer to decide whether to propagate events
 */
export function hasGlobalInputHandlers(): boolean {
  const registry = getGlobalInputHandlers();
  return registry.handlers.size > 0;
}

/**
 * Hook for global keyboard input handling
 *
 * Receives all keyboard input regardless of focus state.
 * Useful for games, global shortcuts, and other scenarios
 * where you need to capture keyboard input at the app level.
 *
 * @param handler - Callback function that receives input string and key info
 * @param options - Options for input handling
 *
 * @example
 * ```tsx
 * function GameComponent() {
 *   const [position, setPosition] = useState({ x: 0, y: 0 });
 *
 *   useInput((input, key) => {
 *     if (key.upArrow) setPosition(p => ({ ...p, y: p.y - 1 }));
 *     if (key.downArrow) setPosition(p => ({ ...p, y: p.y + 1 }));
 *     if (key.leftArrow) setPosition(p => ({ ...p, x: p.x - 1 }));
 *     if (key.rightArrow) setPosition(p => ({ ...p, x: p.x + 1 }));
 *     if (input === 'q') process.exit(0);
 *   });
 *
 *   return <Text>Position: {position.x}, {position.y}</Text>;
 * }
 * ```
 */
export function useInput(handler: InputHandler, options: { isActive?: boolean } = {}): void {
  const { isActive = true } = options;
  const handlerRef = useRef(handler);
  const handlerIdRef = useRef<string | null>(null);

  // Keep handler ref up to date
  handlerRef.current = handler;

  useEffect(() => {
    if (!isActive) {
      // If we have a registered handler but are now inactive, unregister it
      if (handlerIdRef.current) {
        unregisterGlobalInputHandler(handlerIdRef.current);
        handlerIdRef.current = null;
      }
      return;
    }

    // Register a wrapper that calls the current handler ref
    const wrappedHandler: InputHandler = (input, key) => {
      handlerRef.current(input, key);
    };

    handlerIdRef.current = registerGlobalInputHandler(wrappedHandler);

    return () => {
      if (handlerIdRef.current) {
        unregisterGlobalInputHandler(handlerIdRef.current);
        handlerIdRef.current = null;
      }
    };
  }, [isActive]);
}

/**
 * Hook for managing input component state
 *
 * Returns the current input value, cursor position, and multiline state
 * for a specific input component. Useful for building custom input components
 * or accessing input state programmatically.
 *
 * @param inputRef - Reference to the input ConsoleNode
 * @returns Object with input state and helper functions
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const [inputNode, setInputNode] = useState<ConsoleNode | null>(null);
 *   const { value, cursorPosition, isMultiline, setValue, setCursorPosition } = useInputState(inputNode);
 *
 *   return (
 *     <View>
 *       <Input
 *         ref={setInputNode}
 *         value={value}
 *         onChange={(e) => setValue(e.value)}
 *       />
 *       <Text>Cursor at position: {cursorPosition}</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useInputState(inputRef: ConsoleNode | null | undefined): {
  value: string | number | null;
  cursorPosition: number;
  isMultiline: boolean;
  setValue: (value: string | number | null) => void;
  setCursorPosition: (position: number) => void;
} {
  const [value, setValueState] = useState<string | number | null>(() => {
    return inputRef?.type === 'input' ? ((inputRef.value as string | number | null) ?? null) : null;
  });

  const [cursorPosition, setCursorPositionState] = useState<number>(() => {
    // Cursor position is managed internally by the renderer
    // For now, we'll track it based on value length
    if (inputRef?.type === 'input') {
      const value = inputRef.value as string | number | null;
      if (typeof value === 'string') {
        return value.length;
      }
    }
    return 0;
  });

  const isMultiline = inputRef?.type === 'input' && inputRef.multiline === true;

  useEffect(() => {
    if (inputRef?.type === 'input') {
      const currentValue = (inputRef.value as string | number | null) ?? null;
      if (currentValue !== value) {
        setValueState(currentValue);
      }

      // Update cursor position based on value length
      const currentCursor = typeof currentValue === 'string' ? currentValue.length : 0;
      if (currentCursor !== cursorPosition) {
        setCursorPositionState(currentCursor);
      }
    }
  }, [inputRef, value, cursorPosition]);

  const setValue = useCallback(
    (newValue: string | number | null) => {
      if (inputRef?.type === 'input') {
        inputRef.value = newValue as string | number | undefined;
        setValueState(newValue);
        // Update cursor position based on new value
        const newCursor = typeof newValue === 'string' ? newValue.length : 0;
        setCursorPositionState(newCursor);
      }
    },
    [inputRef]
  );

  const setCursorPosition = useCallback((position: number) => {
    // Cursor position is managed internally by the renderer
    // This is a placeholder for future implementation
    // For now, we just update local state
    setCursorPositionState(position);
  }, []);

  return {
    value,
    cursorPosition,
    isMultiline: isMultiline ?? false,
    setValue,
    setCursorPosition,
  };
}
