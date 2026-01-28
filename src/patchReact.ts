/**
 * Patches React's useState and useReducer to work with the console reconciler
 * 
 * This patch ensures state updates trigger immediate re-renders in console apps.
 * It works by wrapping the state setters with flushSyncFromReconciler.
 * 
 * NOTE: Due to how JavaScript module imports work, users should either:
 * 1. Import from this library BEFORE importing from 'react', OR
 * 2. Use the re-exported useState/useReducer from this library
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const React = require('react');

let patched = false;
const originalUseState = React.useState;
const originalUseReducer = React.useReducer;

// Lazy load reconciler to avoid circular dependencies
let reconcilerModule: any = null;
function getReconciler() {
  if (!reconcilerModule) {
    try {
      reconcilerModule = require('./renderer/reconciler').reconciler;
    } catch {
      // Reconciler may not be available yet
    }
  }
  return reconcilerModule;
}

/**
 * Patched useState that ensures state updates trigger re-renders
 */
function patchedUseState<T>(initialState: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, originalSetState] = originalUseState(initialState);
  
  const wrappedSetState = (value: T | ((prev: T) => T)) => {
    const rec = getReconciler();
    // Use flushSyncFromReconciler to ensure state updates trigger re-renders
    if (rec?.flushSyncFromReconciler) {
      rec.flushSyncFromReconciler(() => {
        originalSetState(value as any);
      });
    } else {
      originalSetState(value as any);
    }
  };
  
  return [state, wrappedSetState];
}

/**
 * Patched useReducer that ensures dispatches trigger re-renders
 */
function patchedUseReducer<S, A>(
  reducer: (state: S, action: A) => S,
  initialArg: S,
  init?: (arg: S) => S
): [S, (action: A) => void] {
  const [state, originalDispatch] = init 
    ? originalUseReducer(reducer, initialArg, init)
    : originalUseReducer(reducer, initialArg);
  
  const wrappedDispatch = (action: A) => {
    const rec = getReconciler();
    if (rec?.flushSyncFromReconciler) {
      rec.flushSyncFromReconciler(() => {
        originalDispatch(action);
      });
    } else {
      originalDispatch(action);
    }
  };
  
  return [state, wrappedDispatch];
}

/**
 * Apply the React hooks patch
 */
function applyPatch(): void {
  if (patched) return;
  
  // Replace React.useState and React.useReducer with patched versions
  React.useState = patchedUseState;
  React.useReducer = patchedUseReducer;
  
  patched = true;
}

/**
 * Remove the React hooks patch
 */
export function removePatch(): void {
  if (!patched) return;
  
  React.useState = originalUseState;
  React.useReducer = originalUseReducer;
  
  patched = false;
}

/**
 * Check if the patch has been applied
 */
export function isPatched(): boolean {
  return patched;
}

// Export the patched hooks for users who want to import them directly
export const useState = patchedUseState;
export const useReducer = patchedUseReducer;

// Apply patch immediately when module is loaded
applyPatch();
