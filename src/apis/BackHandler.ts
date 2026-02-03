/**
 * BackHandler API - React Native compatible back button handler
 * Handles "back" actions in terminal context
 *
 * In terminal context, back actions are triggered by:
 * - Escape key press
 * - Ctrl+[ key combination
 */

import { EventEmitter } from 'events';
import type { NativeEventSubscription } from './AppState';

/**
 * Back handler callback type
 * Return true to indicate the back action was handled
 * Return false to allow default behavior (or other handlers)
 */
export type BackHandlerCallback = () => boolean;

class BackHandlerModule extends EventEmitter {
  private _handlers: BackHandlerCallback[] = [];

  constructor() {
    super();
  }

  /**
   * Add a back handler
   * Handlers are called in reverse order (LIFO) until one returns true
   *
   * @param handler - Callback that returns true if back was handled
   * @returns Subscription with remove() method
   *
   * @example
   * ```tsx
   * useEffect(() => {
   *   const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
   *     if (canGoBack) {
   *       goBack();
   *       return true;
   *     }
   *     return false;
   *   });
   *
   *   return () => subscription.remove();
   * }, [canGoBack]);
   * ```
   */
  addEventListener(
    _eventType: 'hardwareBackPress',
    handler: BackHandlerCallback
  ): NativeEventSubscription {
    this._handlers.push(handler);

    return {
      remove: () => {
        const index = this._handlers.indexOf(handler);
        if (index >= 0) {
          this._handlers.splice(index, 1);
        }
      },
    };
  }

  /**
   * Remove a back handler (legacy)
   * @deprecated Use subscription.remove() instead
   */
  removeEventListener(_eventType: 'hardwareBackPress', handler: BackHandlerCallback): void {
    const index = this._handlers.indexOf(handler);
    if (index >= 0) {
      this._handlers.splice(index, 1);
    }
  }

  /**
   * Invoke back handlers
   * Called when back action is triggered (Escape key)
   * Returns true if any handler handled the back action
   */
  invokeDefaultBackPressHandler(): boolean {
    // Call handlers in reverse order (most recent first)
    for (let i = this._handlers.length - 1; i >= 0; i--) {
      const handler = this._handlers[i];
      if (handler && handler()) {
        return true;
      }
    }
    return false;
  }

  /**
   * Exit the app
   * In terminal context, this exits the process
   */
  exitApp(): void {
    // Allow cleanup handlers to run
    this.emit('exitApp');

    // Exit after a short delay to allow cleanup
    setTimeout(() => {
      process.exit(0);
    }, 100);
  }

  /**
   * Internal: trigger back press
   * Called by input handling when Escape is pressed
   */
  _triggerBackPress(): boolean {
    this.emit('hardwareBackPress');
    return this.invokeDefaultBackPressHandler();
  }
}

/**
 * BackHandler singleton instance
 */
export const BackHandler = new BackHandlerModule();

/**
 * Hook: useBackHandler
 * React hook for handling back button presses
 *
 * @param handler - Callback that returns true if back was handled
 *
 * @example
 * ```tsx
 * import { useBackHandler } from 'react-console/apis';
 *
 * function MyComponent() {
 *   useBackHandler(() => {
 *     if (modalVisible) {
 *       closeModal();
 *       return true;
 *     }
 *     return false;
 *   });
 *
 *   // ...
 * }
 * ```
 */
export function useBackHandler(_handler: BackHandlerCallback): void {
  // This would be implemented with useEffect in React
  // The actual hook implementation would be in the hooks file
}
