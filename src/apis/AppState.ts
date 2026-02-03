/**
 * AppState API - React Native compatible app state management
 * Monitors application state (active, background, inactive)
 *
 * In terminal context:
 * - 'active': Terminal has focus and is running
 * - 'background': Process is suspended (SIGTSTP, Ctrl+Z)
 * - 'inactive': Not applicable in terminal (maps to 'active')
 */

import { EventEmitter } from 'events';

/**
 * App state values (React Native compatible)
 */
export type AppStateStatus = 'active' | 'background' | 'inactive' | 'unknown' | 'extension';

/**
 * App state change event
 */
export interface AppStateEvent {
  app_state: AppStateStatus;
}

/**
 * App state subscription
 */
export interface NativeEventSubscription {
  remove(): void;
}

class AppStateModule extends EventEmitter {
  private _currentState: AppStateStatus = 'active';
  private _isAvailable: boolean = true;
  private _handlers: Map<string, () => void> = new Map();

  constructor() {
    super();
    this._setupProcessListeners();
  }

  /**
   * Current app state
   */
  get currentState(): AppStateStatus {
    return this._currentState;
  }

  /**
   * Whether AppState is available
   */
  get isAvailable(): boolean {
    return this._isAvailable;
  }

  /**
   * Add event listener for app state changes
   * @param type - Event type ('change', 'memoryWarning', 'focus', 'blur')
   * @param handler - Callback function
   * @returns Subscription object with remove() method
   */
  addEventListener(
    type: 'change' | 'memoryWarning' | 'focus' | 'blur',
    handler: (state: AppStateStatus) => void
  ): NativeEventSubscription {
    const wrappedHandler = (state: AppStateStatus) => handler(state);
    this.on(type, wrappedHandler);

    return {
      remove: () => {
        this.off(type, wrappedHandler);
      },
    };
  }

  /**
   * Remove event listener (legacy method)
   * @deprecated Use the subscription's remove() method instead
   */
  removeEventListener(
    type: 'change' | 'memoryWarning' | 'focus' | 'blur',
    handler: (state: AppStateStatus) => void
  ): void {
    this.off(type, handler);
  }

  /**
   * Setup Node.js process signal listeners
   */
  private _setupProcessListeners(): void {
    // Handle SIGTSTP (Ctrl+Z) - process suspended
    const handleSuspend = () => {
      this._setAppState('background');
    };

    // Handle SIGCONT - process resumed
    const handleResume = () => {
      this._setAppState('active');
    };

    // Register handlers
    process.on('SIGTSTP', handleSuspend);
    process.on('SIGCONT', handleResume);

    // Store handlers for potential cleanup
    this._handlers.set('SIGTSTP', handleSuspend);
    this._handlers.set('SIGCONT', handleResume);

    // Memory warning - simulate via process memory check
    this._setupMemoryWarning();
  }

  /**
   * Setup memory warning detection
   */
  private _setupMemoryWarning(): void {
    // Check memory usage periodically
    const checkInterval = setInterval(() => {
      const memUsage = process.memoryUsage();
      const heapUsedPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;

      // Emit warning if heap usage is over 90%
      if (heapUsedPercent > 90) {
        this.emit('memoryWarning');
      }
    }, 30000); // Check every 30 seconds

    // Don't keep process alive just for memory checking
    checkInterval.unref();
  }

  /**
   * Set the current app state and emit change event
   */
  private _setAppState(state: AppStateStatus): void {
    if (this._currentState !== state) {
      this._currentState = state;
      this.emit('change', state);
    }
  }

  /**
   * Clean up listeners (for testing or shutdown)
   */
  cleanup(): void {
    for (const [signal, handler] of this._handlers) {
      process.off(signal as NodeJS.Signals, handler);
    }
    this._handlers.clear();
    this.removeAllListeners();
  }
}

/**
 * AppState singleton instance
 */
export const AppState = new AppStateModule();

/**
 * Hook: useAppState
 * React hook for subscribing to app state changes
 *
 * @example
 * ```tsx
 * import { useAppState } from '@baseline-operations/react-console/apis';
 *
 * function MyComponent() {
 *   const appState = useAppState();
 *
 *   return <Text>App is {appState}</Text>;
 * }
 * ```
 */
export function useAppState(): AppStateStatus {
  // This would need to be implemented with React hooks
  // For now, return the current state
  return AppState.currentState;
}
