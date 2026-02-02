/**
 * Storage System
 * Convenient exports for storage functionality
 *
 * @example
 * ```tsx
 * import { storage, useStorage, initializeStorage } from 'react-console/storage';
 * ```
 */

// Storage API
export { storage, getStorage, initializeStorage } from './utils/storage';
export type { StorageAPI, StorageValue, StorageOptions } from './utils/storage';

// Storage hooks
export { useStorage, useStorageWithTTL, useStorageListener, clearStorage } from './hooks/storage';

// Lifecycle hooks (storage-related)
export { useStorageDelete } from './hooks/lifecycle';
