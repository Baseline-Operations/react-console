/**
 * React 19 Optimistic Updates Hook Integration
 * 
 * Provides utilities for using React 19's useOptimistic hook in terminal applications.
 * Useful for optimistic UI updates when performing actions that may take time or fail.
 */

import { useOptimistic, useTransition } from 'react';

/**
 * Hook for optimistic updates in terminal applications
 * 
 * Wraps React 19's `useOptimistic` hook with terminal-specific patterns.
 * Useful for optimistic UI updates when performing actions like form submissions,
 * data saving, or network requests that may take time or fail.
 * 
 * @template T - Type of the state value
 * @template O - Type of the optimistic update value
 * @param state - Current state value
 * @param updateFn - Function to compute optimistic state from current state and update
 * @returns Tuple of [optimisticState, addOptimisticUpdate]
 * 
 * @example
 * ```tsx
 * function SaveButton() {
 *   const [data, setData] = useState('initial');
 *   const [optimisticData, addOptimisticUpdate] = useOptimisticTerminal(
 *     data,
 *     (current, update) => update
 *   );
 *   
 *   const handleSave = async () => {
 *     addOptimisticUpdate('saving...');
 *     try {
 *       await saveToStorage(data);
 *       setData('saved');
 *     } catch {
 *       // Optimistic update will revert on error
 *     }
 *   };
 *   
 *   return (
 *     <Button onClick={handleSave}>
 *       {optimisticData}
 *     </Button>
 *   );
 * }
 * ```
 */
export function useOptimisticTerminal<T, O = T>(
  state: T,
  updateFn: (current: T, update: O) => T
): [T, (update: O) => void] {
  return useOptimistic(state, updateFn);
}

/**
 * Hook for optimistic updates with transition
 * 
 * Combines `useOptimistic` with `useTransition` for better UX during async operations.
 * Shows pending state while optimistic update is in progress.
 * 
 * @template T - Type of the state value
 * @template O - Type of the optimistic update value
 * @param state - Current state value
 * @param updateFn - Function to compute optimistic state from current state and update
 * @returns Object with optimisticState, addOptimisticUpdate, isPending, and startTransition
 * 
 * @example
 * ```tsx
 * function FormComponent() {
 *   const [formData, setFormData] = useState({ name: '' });
 *   const { optimisticData, addOptimisticUpdate, isPending, startTransition } = useOptimisticWithTransition(
 *     formData,
 *     (current, update) => update
 *   );
 *   
 *   const handleSubmit = async () => {
 *     startTransition(async () => {
 *       addOptimisticUpdate({ name: 'Saving...' });
 *       await submitForm(formData);
 *       setFormData({ name: 'Saved' });
 *     });
 *   };
 *   
 *   return (
 *     <View>
 *       <Text>{optimisticData.name}</Text>
 *       {isPending && <Text>Processing...</Text>}
 *     </View>
 *   );
 * }
 * ```
 */
export function useOptimisticWithTransition<T, O = T>(
  state: T,
  updateFn: (current: T, update: O) => T
): {
  optimisticState: T;
  addOptimisticUpdate: (update: O) => void;
  isPending: boolean;
  startTransition: (callback: () => void | Promise<void>) => void;
} {
  const [optimisticState, addOptimisticUpdate] = useOptimistic(state, updateFn);
  const [isPending, startTransition] = useTransition();

  return {
    optimisticState,
    addOptimisticUpdate,
    isPending,
    startTransition,
  };
}
