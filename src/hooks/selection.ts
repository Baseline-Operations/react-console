/**
 * React Hooks for Selection Component State
 * 
 * Provides React hooks for managing selection component state:
 * - Radio, Checkbox, Dropdown, List state
 */

import { useState, useEffect, useCallback } from 'react';
import type { ConsoleNode } from '../types';

/**
 * Hook for managing selection component state
 * 
 * Returns the current selection state for radio, checkbox, dropdown, or list components.
 * Provides utilities to check selection state and update selections.
 * 
 * @param componentRef - Reference to the selection component ConsoleNode
 * @returns Object with selection state and helper functions
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const [radioNode, setRadioNode] = useState<ConsoleNode | null>(null);
 *   const { selected, isOpen, focusedIndex, select, open, close } = useSelection(radioNode);
 *   
 *   return (
 *     <View>
 *       <Radio
 *         ref={setRadioNode}
 *         options={['Option 1', 'Option 2']}
 *         selected={selected}
 *         onChange={(e) => select(e.value)}
 *       />
 *       <Text>Selected: {selected}</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useSelection(componentRef: ConsoleNode | null | undefined): {
  selected: string | number | (string | number)[] | null;
  isOpen: boolean;
  focusedIndex: number;
  select: (value: string | number | (string | number)[]) => void;
  open: () => void;
  close: () => void;
  setFocusedIndex: (index: number) => void;
} {
  const [selected, setSelectedState] = useState<string | number | (string | number)[] | null>(() => {
    if (!componentRef) return null;
    
    if (componentRef.type === 'radio' || componentRef.type === 'checkbox' || 
        componentRef.type === 'dropdown' || componentRef.type === 'list') {
      return componentRef.value as string | number | (string | number)[] | null;
    }
    
    return null;
  });

  const [isOpen, setIsOpenState] = useState<boolean>(() => {
    if (componentRef?.type === 'dropdown' || componentRef?.type === 'list') {
      return componentRef.isOpen === true;
    }
    return false;
  });

  const [focusedIndex, setFocusedIndexState] = useState<number>(() => {
    if (componentRef?.type === 'dropdown' || componentRef?.type === 'list') {
      return typeof componentRef.focusedIndex === 'number' ? componentRef.focusedIndex : -1;
    }
    return -1;
  });

  useEffect(() => {
    if (!componentRef) return;

    if (componentRef.type === 'radio' || componentRef.type === 'checkbox' || 
        componentRef.type === 'dropdown' || componentRef.type === 'list') {
      const currentValue = componentRef.value as string | number | (string | number)[] | null;
      if (currentValue !== selected) {
        setSelectedState(currentValue);
      }

      if (componentRef.type === 'dropdown' || componentRef.type === 'list') {
        const currentOpen = componentRef.isOpen === true;
        if (currentOpen !== isOpen) {
          setIsOpenState(currentOpen);
        }

        const currentIndex = typeof componentRef.focusedIndex === 'number' ? componentRef.focusedIndex : -1;
        if (currentIndex !== focusedIndex) {
          setFocusedIndexState(currentIndex);
        }
      }
    }
  }, [componentRef, selected, isOpen, focusedIndex]);

  const select = useCallback((value: string | number | (string | number)[]) => {
    if (componentRef && 
        (componentRef.type === 'radio' || componentRef.type === 'checkbox' || 
         componentRef.type === 'dropdown' || componentRef.type === 'list')) {
      // Type assertion needed because ConsoleNode.value accepts string[] | number[] separately
      // but we're using (string | number)[] which is compatible at runtime
      componentRef.value = value as string | number | string[] | number[] | boolean;
      setSelectedState(value);
    }
  }, [componentRef]);

  const open = useCallback(() => {
    if (componentRef && (componentRef.type === 'dropdown' || componentRef.type === 'list')) {
      componentRef.isOpen = true;
      setIsOpenState(true);
    }
  }, [componentRef]);

  const close = useCallback(() => {
    if (componentRef && (componentRef.type === 'dropdown' || componentRef.type === 'list')) {
      componentRef.isOpen = false;
      setIsOpenState(false);
    }
  }, [componentRef]);

  const setFocusedIndex = useCallback((index: number) => {
    if (componentRef && (componentRef.type === 'dropdown' || componentRef.type === 'list')) {
      componentRef.focusedIndex = index;
      setFocusedIndexState(index);
    }
  }, [componentRef]);

  return {
    selected,
    isOpen,
    focusedIndex,
    select,
    open,
    close,
    setFocusedIndex,
  };
}
