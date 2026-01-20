/**
 * Advanced Hooks
 * Convenient exports for advanced React hooks
 * 
 * @example
 * ```tsx
 * import { useAsync, useOptimisticTerminal, useActionStateTerminal } from 'react-console/hooks';
 * ```
 */

// React 19 State Hooks Integration
export {
  useOptimisticTerminal,
  useOptimisticWithTransition,
} from './hooks/optimistic';

export {
  useActionStateTerminal,
} from './hooks/action-state';

export {
  useAsync,
  useAsyncWithFallback,
} from './hooks/async';

// Terminal State Hooks
export {
  useTerminalDimensions,
  useFocus,
  useTerminalConfig,
} from './hooks/terminal';

// Input State Hooks
export {
  useInputState,
} from './hooks/input';

// Lifecycle Events
export {
  onAppStart,
  onAppExit,
} from './hooks/lifecycle';

// Context Providers and hooks
export {
  TerminalDimensionsProvider,
  useTerminalDimensionsContext,
} from './context/TerminalDimensionsContext';

export {
  FocusProvider,
  useFocusContext,
} from './context/FocusContext';
