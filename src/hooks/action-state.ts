/**
 * React 19 Action State Hook Integration
 * 
 * Provides utilities for using React 19's useActionState hook in terminal applications.
 * Useful for form submissions and actions that need to track pending/error states.
 */

import { useActionState } from 'react';

/**
 * Hook for action state management in terminal applications
 * 
 * Wraps React 19's `useActionState` hook with terminal-specific patterns.
 * Useful for form submissions and actions that need to track pending, error, and success states.
 * 
 * @template T - Type of the action state
 * @template P - Type of the action parameters
 * @param action - Async action function that takes parameters and returns state
 * @param initialState - Initial state value
 * @param permalink - Optional permalink (not used in terminal, can be undefined)
 * @returns Tuple of [state, formAction, isPending]
 * 
 * @example
 * ```tsx
 * async function submitForm(prevState: { message: string }, formData: FormData) {
 *   const name = formData.get('name');
 *   if (!name) {
 *     return { message: 'Name is required' };
 *   }
 *   await saveToStorage(name);
 *   return { message: 'Saved successfully' };
 * }
 * 
 * function FormComponent() {
 *   const [state, formAction, isPending] = useActionStateTerminal(
 *     submitForm,
 *     { message: '' }
 *   );
 *   
 *   return (
 *     <View>
 *       <Text>{state.message}</Text>
 *       {isPending && <Text>Saving...</Text>}
 *       <Input name="name" />
 *       <Button onClick={() => formAction(new FormData())}>
 *         Submit
 *       </Button>
 *     </View>
 *   );
 * }
 * ```
 */
export function useActionStateTerminal<T, P = FormData>(
  action: (prevState: T, params: P) => Promise<T> | T,
  initialState: T,
  permalink?: string
): [T, (params: P) => void, boolean] {
  // useActionState has two overloads:
  // 1. (action, initialState) -> dispatch takes no args
  // 2. (action, initialState, permalink) -> dispatch takes payload
  // We use the second overload with payload
  const [state, dispatch, isPending] = useActionState(
    (state: Awaited<T>, payload: P) => action(state as T, payload),
    initialState as Awaited<T>,
    permalink
  );
  
  // dispatch from useActionState with payload overload takes the payload
  return [state as T, dispatch as (params: P) => void, isPending];
}
