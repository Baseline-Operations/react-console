/**
 * Application Lifecycle Events
 *
 * Provides event listeners for application start, exit, and storage deletion events.
 * These can be used outside of React components as regular event listeners.
 */

import { useEffect } from 'react';

/**
 * Lifecycle event emitter
 * Used to notify React components of application lifecycle events
 */
class LifecycleEventEmitter {
  private startListeners: Set<() => void> = new Set();
  private exitListeners: Set<() => void> = new Set();
  private storageDeleteListeners: Set<(key: string) => void> = new Set();

  /**
   * Subscribe to application start event
   */
  onStart(callback: () => void): () => void {
    this.startListeners.add(callback);
    return () => {
      this.startListeners.delete(callback);
    };
  }

  /**
   * Subscribe to application exit event
   */
  onExit(callback: () => void): () => void {
    this.exitListeners.add(callback);
    return () => {
      this.exitListeners.delete(callback);
    };
  }

  /**
   * Subscribe to storage deletion event
   */
  onStorageDelete(callback: (key: string) => void): () => void {
    this.storageDeleteListeners.add(callback);
    return () => {
      this.storageDeleteListeners.delete(callback);
    };
  }

  /**
   * Emit application start event
   */
  emitStart(): void {
    this.startListeners.forEach((callback) => callback());
  }

  /**
   * Emit application exit event
   */
  emitExit(): void {
    this.exitListeners.forEach((callback) => callback());
  }

  /**
   * Emit storage deletion event
   */
  emitStorageDelete(key: string): void {
    this.storageDeleteListeners.forEach((callback) => callback(key));
  }
}

// Global lifecycle event emitter
const lifecycleEvents = new LifecycleEventEmitter();

/**
 * Register a callback to be called when the application starts
 *
 * This can be called outside of React components. The callback is called once
 * when the application is first rendered.
 *
 * @param callback - Callback function called on application start
 * @returns Unsubscribe function to remove the listener
 *
 * @example
 * ```ts
 * // Outside of components
 * import { onAppStart } from '@baseline-operations/react-console';
 *
 * onAppStart(() => {
 *   console.log('Application started!');
 *   // Load saved preferences, initialize services, etc.
 * });
 * ```
 *
 * @example
 * ```tsx
 * // Can also be used in components
 * function App() {
 *   useEffect(() => {
 *     const unsubscribe = onAppStart(() => {
 *       console.log('Application started!');
 *     });
 *     return unsubscribe;
 *   }, []);
 *
 *   return <View>My App</View>;
 * }
 * ```
 */
export function onAppStart(callback: () => void): () => void {
  return lifecycleEvents.onStart(callback);
}

/**
 * Register a callback to be called when the application exits
 *
 * This can be called outside of React components. The callback is called when
 * exit() is called or the process receives exit signals.
 *
 * @param callback - Callback function called on application exit
 * @returns Unsubscribe function to remove the listener
 *
 * @example
 * ```ts
 * // Outside of components
 * import { onAppExit } from '@baseline-operations/react-console';
 *
 * onAppExit(() => {
 *   console.log('Application exiting...');
 *   // Save state, close connections, cleanup resources
 * });
 * ```
 *
 * @example
 * ```tsx
 * // Can also be used in components
 * function App() {
 *   useEffect(() => {
 *     const unsubscribe = onAppExit(() => {
 *       console.log('Application exiting...');
 *     });
 *     return unsubscribe;
 *   }, []);
 *
 *   return <View>My App</View>;
 * }
 * ```
 */
export function onAppExit(callback: () => void): () => void {
  return lifecycleEvents.onExit(callback);
}

/**
 * Hook called when a storage key is deleted
 *
 * This hook is called when a storage item is removed via removeItem() or clear().
 *
 * Note: This only detects deletions made through the storage API.
 * External file deletions cannot be detected without file watching,
 * which is not implemented to avoid background processes.
 *
 * @param callback - Callback function called when storage is deleted
 * @param key - Optional specific key to listen for (if not provided, listens to all deletions)
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   useStorageDelete((deletedKey) => {
 *     console.log(`Storage key deleted: ${deletedKey}`);
 *   });
 *
 *   // Or listen to specific key:
 *   useStorageDelete(() => {
 *     console.log('User preferences deleted');
 *   }, 'userPreferences');
 *
 *   return <View>My Component</View>;
 * }
 * ```
 */
export function useStorageDelete(callback: (key: string) => void, key?: string): void {
  useEffect(() => {
    const unsubscribe = lifecycleEvents.onStorageDelete((deletedKey) => {
      if (key === undefined || deletedKey === key) {
        callback(deletedKey);
      }
    });
    return unsubscribe;
  }, [callback, key]);
}

/**
 * Internal function to notify lifecycle hooks of application start
 * Called by render() when application starts
 *
 * @internal
 */
export function notifyAppStart(): void {
  lifecycleEvents.emitStart();
}

/**
 * Internal function to notify lifecycle hooks of application exit
 * Called by exit() when application exits
 *
 * @internal
 */
export function notifyAppExit(): void {
  lifecycleEvents.emitExit();
}

/**
 * Internal function to notify lifecycle hooks of storage deletion
 * Called by storage.removeItem() when storage is deleted
 *
 * @internal
 */
export function notifyStorageDelete(key: string): void {
  lifecycleEvents.emitStorageDelete(key);
}
