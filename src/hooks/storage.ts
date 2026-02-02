/**
 * React Hooks for Storage - Async state system for React Console storage
 *
 * Provides React hooks for working with storage as reactive state.
 * Storage changes trigger React re-renders automatically.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { storage, type StorageValue } from '../utils/storage';

/**
 * Storage change event emitter
 * Used to notify React components when storage values change
 */
class StorageEventEmitter {
  private listeners: Map<string, Set<() => void>> = new Map();
  private allListeners: Set<() => void> = new Set();

  /**
   * Subscribe to changes for a specific key
   */
  on(key: string, callback: () => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);

    // Return unsubscribe function
    return () => {
      const keyListeners = this.listeners.get(key);
      if (keyListeners) {
        keyListeners.delete(callback);
        if (keyListeners.size === 0) {
          this.listeners.delete(key);
        }
      }
    };
  }

  /**
   * Subscribe to all storage changes
   */
  onAll(callback: () => void): () => void {
    this.allListeners.add(callback);
    return () => {
      this.allListeners.delete(callback);
    };
  }

  /**
   * Emit change event for a specific key
   */
  emit(key: string): void {
    const keyListeners = this.listeners.get(key);
    if (keyListeners) {
      keyListeners.forEach((callback) => callback());
    }
    this.allListeners.forEach((callback) => callback());
  }

  /**
   * Emit change event for all keys (e.g., on clear)
   */
  emitAll(): void {
    this.listeners.forEach((listeners) => {
      listeners.forEach((callback) => callback());
    });
    this.allListeners.forEach((callback) => callback());
  }
}

// Global storage event emitter
const storageEvents = new StorageEventEmitter();

/**
 * Hook to use storage as reactive state
 *
 * Similar to useState, but persists to storage and syncs across components.
 * Storage changes trigger re-renders automatically.
 *
 * @param key - Storage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns [value, setValue, removeValue] tuple
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const [username, setUsername] = useStorage('username', 'guest');
 *
 *   return (
 *     <View>
 *       <Text>Hello, {username}!</Text>
 *       <Input
 *         value={username}
 *         onChange={(e) => setUsername(e.value)}
 *       />
 *     </View>
 *   );
 * }
 * ```
 */
export function useStorage<T extends StorageValue>(
  key: string,
  defaultValue: T | null = null
): [T | null, (value: T | null) => void, () => void] {
  const [value, setValueState] = useState<T | null>(() => {
    const stored = storage.getItem(key);
    return stored !== null ? (stored as T) : defaultValue;
  });

  // Track if this is the initial mount
  const isInitialMount = useRef(true);

  useEffect(() => {
    // On mount, sync with storage (in case it changed externally)
    const stored = storage.getItem(key);
    if (stored !== null) {
      setValueState(stored as T);
    } else if (defaultValue !== null) {
      setValueState(defaultValue);
    }

    isInitialMount.current = false;

    // Subscribe to storage changes for this key
    const unsubscribe = storageEvents.on(key, () => {
      const updated = storage.getItem(key);
      setValueState(updated !== null ? (updated as T) : defaultValue);
    });

    return unsubscribe;
  }, [key, defaultValue]);

  const setValue = useCallback(
    (newValue: T | null) => {
      if (newValue === null) {
        storage.removeItem(key);
      } else {
        (
          storage.setItem as <T extends StorageValue>(
            key: string,
            value: T,
            options?: { ttl?: number }
          ) => void
        )(key, newValue);
      }
      setValueState(newValue);
      storageEvents.emit(key);
    },
    [key]
  );

  const removeValue = useCallback(() => {
    storage.removeItem(key);
    setValueState(defaultValue);
    storageEvents.emit(key);
  }, [key, defaultValue]);

  return [value, setValue, removeValue];
}

/**
 * Hook to use storage with TTL (time-to-live)
 *
 * Similar to useStorage, but with automatic expiration.
 *
 * @param key - Storage key
 * @param defaultValue - Default value if key doesn't exist
 * @param ttl - Time to live in milliseconds
 * @returns [value, setValue, removeValue] tuple
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const [token, setToken] = useStorageWithTTL('token', null, 3600000); // 1 hour
 *
 *   return (
 *     <View>
 *       <Text>Token expires in 1 hour</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useStorageWithTTL<T extends StorageValue>(
  key: string,
  defaultValue: T | null = null,
  ttl: number
): [T | null, (value: T | null) => void, () => void] {
  const [value, setValueState] = useState<T | null>(() => {
    const stored = storage.getItem(key);
    return stored !== null ? (stored as T) : defaultValue;
  });

  useEffect(() => {
    const stored = storage.getItem<T>(key, defaultValue);
    if (stored !== null) {
      setValueState(stored);
    } else if (defaultValue !== null) {
      setValueState(defaultValue);
    }

    const unsubscribe = storageEvents.on(key, () => {
      const updated = storage.getItem<T>(key, defaultValue);
      setValueState(updated !== null ? updated : defaultValue);
    });

    return unsubscribe;
  }, [key, defaultValue]);

  const setValue = useCallback(
    (newValue: T | null) => {
      if (newValue === null) {
        storage.removeItem(key);
      } else {
        storage.setItem<T>(key, newValue, { ttl });
      }
      setValueState(newValue);
      storageEvents.emit(key);
    },
    [key, ttl]
  );

  const removeValue = useCallback(() => {
    storage.removeItem(key);
    setValueState(defaultValue);
    storageEvents.emit(key);
  }, [key, defaultValue]);

  return [value, setValue, removeValue];
}

/**
 * Hook to listen to all storage changes
 *
 * Useful for debugging or syncing external state.
 *
 * @param callback - Callback called when any storage value changes
 *
 * @example
 * ```tsx
 * function DebugComponent() {
 *   useStorageListener(() => {
 *     console.log('Storage changed:', storage.keys());
 *   });
 *
 *   return <Text>Storage listener active</Text>;
 * }
 * ```
 */
export function useStorageListener(callback: () => void): void {
  useEffect(() => {
    const unsubscribe = storageEvents.onAll(callback);
    return unsubscribe;
  }, [callback]);
}

/**
 * Clear all storage
 *
 * Clears all storage for the current application and triggers re-renders
 * in all components using storage hooks.
 *
 * @example
 * ```tsx
 * function SettingsComponent() {
 *   return (
 *     <View>
 *       <Button onClick={() => clearStorage()}>
 *         Clear All Data
 *       </Button>
 *     </View>
 *   );
 * }
 * ```
 */
export function clearStorage(): void {
  storage.clear();
  storageEvents.emitAll();
}

/**
 * Internal function to notify storage hooks of changes
 * Called by storage system when values change externally
 *
 * @internal
 */
export function notifyStorageChange(key: string): void {
  storageEvents.emit(key);
}

/**
 * Internal function to notify storage hooks of clear
 * Called by storage system when storage is cleared
 *
 * @internal
 */
export function notifyStorageClear(): void {
  storageEvents.emitAll();
}
