/**
 * React Hooks for Input State
 * 
 * Provides React hooks for managing input component state:
 * - Input value and cursor position
 * - Multiline input state
 */

import { useState, useEffect, useCallback } from 'react';
import type { ConsoleNode } from '../types';

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
    return inputRef?.type === 'input' ? (inputRef.value as string | number | null) ?? null : null;
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

  const setValue = useCallback((newValue: string | number | null) => {
    if (inputRef?.type === 'input') {
      inputRef.value = newValue as string | number | undefined;
      setValueState(newValue);
      // Update cursor position based on new value
      const newCursor = typeof newValue === 'string' ? newValue.length : 0;
      setCursorPositionState(newCursor);
    }
  }, [inputRef]);

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
