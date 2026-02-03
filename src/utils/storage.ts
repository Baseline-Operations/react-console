/**
 * Application Storage - Encrypted, namespaced storage for terminal applications
 *
 * Provides persistent key-value storage similar to browser localStorage:
 * - Single shared encrypted file for all applications
 * - Application-level namespacing (each app has its own isolated namespace)
 * - Automatic initialization (no manual createStorage() needed)
 * - Encryption (AES-256-GCM) for security
 * - Efficient value types (string, number, boolean, null, object/array)
 * - Optional TTL (default: persist until explicitly removed)
 * - Optional clear on exit (default: false - persists across sessions)
 *
 * Storage is automatically created when first accessed (via render() or direct access).
 * Each application's data is isolated within the shared encrypted file.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { createHash, createCipheriv, createDecipheriv, randomBytes, pbkdf2Sync } from 'crypto';
import os from 'os';
import { createRequire } from 'node:module';
import { reportError, ErrorType } from './errors';

// Create require function for ESM compatibility (needed for dynamic imports to avoid circular deps)
const require = createRequire(import.meta.url);

/**
 * Supported storage value types
 * Optimized for speed and efficiency - primitive types are stored directly,
 * complex types are JSON stringified
 */
export type StorageValue = string | number | boolean | null | object | unknown[];

/**
 * Storage entry with optional expiration
 */
interface StorageEntry {
  value: StorageValue; // Stored in efficient format (primitives direct, objects JSON)
  expiresAt: number | null; // Timestamp in milliseconds, null = no expiration (default)
}

/**
 * Storage data structure for a single application namespace
 */
interface AppStorageData {
  [key: string]: StorageEntry;
}

/**
 * Shared storage file structure (all apps in one file)
 */
interface SharedStorageData {
  [appId: string]: AppStorageData;
}

/**
 * Storage options (for initialization)
 */
export interface StorageOptions {
  /**
   * Application ID/namespace (used to isolate storage per application)
   * If not provided, auto-generated from process.cwd()
   */
  appId?: string;

  /**
   * Encryption key (if not provided, derives from user home)
   * For production, provide a secure key
   */
  encryptionKey?: string;

  /**
   * Clear storage on application exit (default: false)
   * If true, storage is cleared when application exits
   */
  clearOnExit?: boolean;

  /**
   * Persist interval in milliseconds (default: 5000)
   * How often to persist changes to disk
   */
  persistInterval?: number;
}

/**
 * Storage Manager - Singleton that manages the shared encrypted storage file
 *
 * Manages a single encrypted file containing all applications' storage data.
 * Each application gets its own namespace within the shared file.
 *
 * Storage location priority:
 * 1. REACT_CONSOLE_STORAGE_PATH environment variable (if set) - allows custom location
 * 2. Script/command directory (default) - same directory as executing script + .react-console/
 * 3. System-wide location (OS-specific) - for global storage:
 *    - macOS: /Library/Application Support/react-console/
 *    - Windows: C:\ProgramData\react-console\
 *    - Linux/Unix: /var/lib/react-console/
 * 4. Fallback to user directory (~/.react-console/) if system location not accessible
 *
 * Each script/command gets its own encrypted storage file in its own directory.
 */
class StorageManager {
  private static instance: StorageManager | null = null;
  private filePath: string;
  private dirPath: string;
  private encryptionKey: Buffer;
  private sharedData: SharedStorageData = {};
  private persistIntervalMs: number;
  private dirty = false;
  private persistTimer: NodeJS.Timeout | null = null;
  private appInstances: Map<string, ApplicationStorage> = new Map();

  private constructor() {
    // Determine storage location based on priority
    this.dirPath = this.determineStorageLocation();
    this.filePath = join(this.dirPath, 'storage.enc');
    this.persistIntervalMs = 5000;

    // Derive encryption key from storage location (shared across all apps using same location)
    this.encryptionKey = this.deriveEncryptionKey();

    // Create directory if it doesn't exist
    if (!existsSync(this.dirPath)) {
      try {
        mkdirSync(this.dirPath, { recursive: true });
      } catch (error) {
        reportError(error, ErrorType.UNKNOWN, { context: 'storage:mkdir', path: this.dirPath });
      }
    }

    // Load existing data from disk
    this.loadFromDisk();

    // Start periodic persistence
    this.startPersistTimer();

    // Persist on process exit
    process.on('exit', () => {
      this.persistToDisk();
    });

    process.on('SIGINT', () => {
      this.persistToDisk();
      // Use Node.exit() for proper cleanup (cursor positioning, mouse tracking)
      try {
        const { Node } = require('../nodes/base/Node');
        Node.exit(0);
      } catch {
        process.exit(0);
      }
    });

    process.on('SIGTERM', () => {
      this.persistToDisk();
      // Use Node.exit() for proper cleanup (cursor positioning, mouse tracking)
      try {
        const { Node } = require('../nodes/base/Node');
        Node.exit(0);
      } catch {
        process.exit(0);
      }
    });
  }

  /**
   * Get singleton instance
   */
  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  /**
   * Determine storage location based on priority
   * 1. REACT_CONSOLE_STORAGE_PATH environment variable
   * 2. Script/command directory (where the executing script is located) - DEFAULT
   * 3. System-wide location (OS-specific)
   * 4. Fallback to user directory
   */
  private determineStorageLocation(): string {
    // Priority 1: Environment variable override
    const envPath = process.env.REACT_CONSOLE_STORAGE_PATH;
    if (envPath) {
      return envPath;
    }

    // Priority 2: Script/command directory (default - same directory as executing script)
    try {
      // Get the directory of the executing script
      const scriptPath = this.getScriptDirectory();
      if (scriptPath) {
        // Storage in same directory as script, in .react-console subdirectory
        const scriptStorage = join(scriptPath, '.react-console');
        // Check if script directory exists and is accessible
        if (existsSync(scriptPath)) {
          return scriptStorage;
        }
      }
    } catch {
      // Continue to next option
    }

    // Priority 3: System-wide location (OS-specific)
    try {
      const platform = process.platform;
      let systemPath: string;

      if (platform === 'darwin') {
        // macOS: /Library/Application Support/react-console/
        systemPath = '/Library/Application Support/react-console';
      } else if (platform === 'win32') {
        // Windows: C:\ProgramData\react-console\
        systemPath = join(process.env.ProgramData || 'C:\\ProgramData', 'react-console');
      } else {
        // Linux/Unix: /var/lib/react-console/
        systemPath = '/var/lib/react-console';
      }

      // Try to create system directory (may require permissions)
      if (!existsSync(systemPath)) {
        try {
          mkdirSync(systemPath, { recursive: true });
        } catch {
          // If we can't create system directory, fall back to user directory
          return this.getUserStoragePath();
        }
      }

      // Check if we can write to system directory
      try {
        const testFile = join(systemPath, '.test-write');
        writeFileSync(testFile, 'test');
        // Clean up test file
        try {
          unlinkSync(testFile);
        } catch {
          // Ignore cleanup errors
        }
        return systemPath;
      } catch {
        // Can't write to system directory, fall back to user directory
        return this.getUserStoragePath();
      }
    } catch {
      // Fall back to user directory
      return this.getUserStoragePath();
    }
  }

  /**
   * Get the directory of the executing script/command
   * Tries multiple methods to find the script location
   */
  private getScriptDirectory(): string | null {
    try {
      // Method 1: require.main.filename (most reliable for Node.js scripts)
      if (require.main?.filename) {
        return dirname(require.main.filename);
      }

      // Method 2: process.argv[1] (path to script being executed)
      if (process.argv[1]) {
        return dirname(process.argv[1]);
      }

      // Method 3: __filename (if available in module context)
      // Note: This won't work in the storage module itself, but included for completeness
      if (typeof __filename !== 'undefined') {
        return dirname(__filename);
      }

      return null;
    } catch {
      return null;
    }
  }

  /**
   * Get user directory storage path (fallback)
   */
  private getUserStoragePath(): string {
    const home = os.homedir();
    return join(home, '.react-console');
  }

  /**
   * Derive encryption key from storage location
   * Uses PBKDF2 for key derivation (shared key for all apps using same storage location)
   * This ensures the same encryption key is used for the same storage location,
   * allowing apps to share the same encrypted file.
   */
  private deriveEncryptionKey(): Buffer {
    // Use storage directory path as the basis for key derivation
    // This ensures consistent encryption for the same storage location
    const storagePath = this.dirPath;
    const salt = createHash('sha256')
      .update(storagePath + 'react-console-storage')
      .digest()
      .slice(0, 16);

    // Derive 32-byte key using PBKDF2
    return pbkdf2Sync('react-console-storage', salt, 10000, 32, 'sha256');
  }

  /**
   * Encrypt data using AES-256-GCM
   */
  private encrypt(data: string): string {
    const iv = randomBytes(16); // Initialization vector
    const cipher = createCipheriv('aes-256-gcm', this.encryptionKey, iv);

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    // Return IV + authTag + encrypted data (all hex encoded)
    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
  }

  /**
   * Decrypt data using AES-256-GCM
   */
  private decrypt(encryptedData: string): string {
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }

    const iv = Buffer.from(parts[0]!, 'hex');
    const authTag = Buffer.from(parts[1]!, 'hex');
    const encrypted = parts[2]!;

    const decipher = createDecipheriv('aes-256-gcm', this.encryptionKey, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Load shared storage data from disk
   * Only loads if file exists (doesn't create file)
   */
  private loadFromDisk(): void {
    if (!existsSync(this.filePath)) {
      this.sharedData = {};
      return;
    }

    try {
      const encryptedContent = readFileSync(this.filePath, 'utf-8');
      const decryptedContent = this.decrypt(encryptedContent);
      this.sharedData = JSON.parse(decryptedContent) || {};

      // Clean up expired entries during load
      const now = Date.now();
      for (const appId in this.sharedData) {
        const appData = this.sharedData[appId];
        if (!appData) continue;

        for (const key in appData) {
          const entry = appData[key];
          if (entry && entry.expiresAt !== null && entry.expiresAt <= now) {
            delete appData[key];
          }
        }
      }
    } catch (error) {
      // If file is corrupted or decryption fails, start fresh
      reportError(error, ErrorType.UNKNOWN, { context: 'storage:load', path: this.filePath });
      this.sharedData = {};
    }
  }

  /**
   * Persist shared storage data to disk
   * Creates file only if there's data to store, deletes file if storage is empty
   */
  persistToDisk(): void {
    // Clean up expired entries before persisting
    const now = Date.now();
    for (const appId in this.sharedData) {
      const appData = this.sharedData[appId];
      if (!appData) continue;

      for (const key in appData) {
        const entry = appData[key];
        if (entry && entry.expiresAt !== null && entry.expiresAt <= now) {
          delete appData[key];
        }
      }

      // Remove empty app namespaces
      if (Object.keys(appData).length === 0) {
        delete this.sharedData[appId];
      }
    }

    // Check if storage is empty
    const isEmpty = Object.keys(this.sharedData).length === 0;

    // If storage is empty and file exists, delete it
    if (isEmpty) {
      if (existsSync(this.filePath)) {
        try {
          unlinkSync(this.filePath);
        } catch (error) {
          reportError(error, ErrorType.UNKNOWN, { context: 'storage:delete', path: this.filePath });
        }
      }
      this.dirty = false;
      return;
    }

    // Only persist if there's data and it's dirty
    if (!this.dirty) {
      return;
    }

    try {
      // Encrypt before writing
      const jsonData = JSON.stringify(this.sharedData);
      const encryptedData = this.encrypt(jsonData);

      // Ensure directory exists before writing
      if (!existsSync(this.dirPath)) {
        mkdirSync(this.dirPath, { recursive: true });
      }

      // Write encrypted data to file (creates file if it doesn't exist)
      writeFileSync(this.filePath, encryptedData, 'utf-8');

      this.dirty = false;
    } catch (error) {
      reportError(error, ErrorType.UNKNOWN, { context: 'storage:persist', path: this.filePath });
    }
  }

  /**
   * Start periodic persistence timer
   */
  private startPersistTimer(): void {
    if (this.persistTimer) {
      clearInterval(this.persistTimer);
    }

    this.persistTimer = setInterval(() => {
      if (this.dirty) {
        this.persistToDisk();
      }
    }, this.persistIntervalMs);
  }

  /**
   * Get or create application storage instance
   */
  getAppStorage(appId: string, options?: StorageOptions): ApplicationStorage {
    if (this.appInstances.has(appId)) {
      return this.appInstances.get(appId)!;
    }

    const storage = new ApplicationStorage(appId, this, options);
    this.appInstances.set(appId, storage);
    return storage;
  }

  /**
   * Get app data from shared storage
   */
  getAppData(appId: string): AppStorageData {
    if (!this.sharedData[appId]) {
      this.sharedData[appId] = {};
      this.dirty = true;
    }
    return this.sharedData[appId]!;
  }

  /**
   * Mark storage as dirty (needs persistence)
   */
  markDirty(): void {
    this.dirty = true;
  }

  /**
   * Clear app data from shared storage
   */
  clearAppData(appId: string): void {
    if (this.sharedData[appId]) {
      delete this.sharedData[appId];
      this.dirty = true;
      this.persistToDisk();
    }
  }
}

/**
 * Application Storage class
 *
 * Provides storage API for a single application namespace within the shared file.
 * Each application instance has its own isolated storage namespace.
 *
 * Features:
 * - Access to shared encrypted file (via StorageManager)
 * - Application-level namespacing
 * - Efficient value types (primitives stored directly, objects JSON)
 * - Optional TTL (default: persist until removed)
 * - Optional clear on exit (default: false)
 */
export class ApplicationStorage {
  private readonly appId: string;
  private readonly manager: StorageManager;
  private readonly clearOnExit: boolean;
  private cache: Map<string, StorageEntry> = new Map();

  constructor(appId: string, manager: StorageManager, options: StorageOptions = {}) {
    this.appId = appId;
    this.manager = manager;
    this.clearOnExit = options.clearOnExit || false;

    // Load app data from shared storage
    const appData = manager.getAppData(appId);
    const now = Date.now();

    // Load entries and filter expired ones
    for (const [key, entry] of Object.entries(appData)) {
      if (entry.expiresAt !== null && entry.expiresAt <= now) {
        // Skip expired entries
        continue;
      }
      this.cache.set(key, entry);
    }

    // Handle process exit
    if (this.clearOnExit) {
      // Clear storage on exit if configured
      process.on('exit', () => {
        this.clear();
      });
      process.on('SIGINT', () => {
        this.clear();
        // Use Node.exit() for proper cleanup (cursor positioning, mouse tracking)
        try {
          const { Node } = require('../nodes/base/Node');
          Node.exit(0);
        } catch {
          process.exit(0);
        }
      });
      process.on('SIGTERM', () => {
        this.clear();
        // Use Node.exit() for proper cleanup (cursor positioning, mouse tracking)
        try {
          const { Node } = require('../nodes/base/Node');
          Node.exit(0);
        } catch {
          process.exit(0);
        }
      });
    }
  }

  /**
   * Clean up expired entries from cache
   */
  private cleanupExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt !== null && entry.expiresAt <= now) {
        this.cache.delete(key);
        this.manager.markDirty();
      }
    }
  }

  /**
   * Sync cache to shared storage
   */
  private syncToShared(): void {
    const appData = this.manager.getAppData(this.appId);
    const now = Date.now();

    // Update shared storage with cache contents
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt !== null && entry.expiresAt <= now) {
        delete appData[key];
      } else {
        appData[key] = entry;
      }
    }

    // Remove keys from shared storage that are not in cache
    for (const key in appData) {
      if (!this.cache.has(key)) {
        delete appData[key];
      }
    }

    this.manager.markDirty();
  }

  /**
   * Get a value from storage
   */
  getItem(key: string): StorageValue | null {
    this.cleanupExpired();

    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    // Check expiration
    if (entry.expiresAt !== null && entry.expiresAt <= Date.now()) {
      this.cache.delete(key);
      this.syncToShared();
      return null;
    }

    return entry.value;
  }

  /**
   * Set a value in storage
   * @param key - Storage key
   * @param value - Value to store
   * @param options - Optional storage options (TTL in milliseconds)
   */
  setItem<T extends StorageValue = StorageValue>(
    key: string,
    value: T,
    options?: { ttl?: number }
  ): void {
    const expiresAt = options?.ttl ? Date.now() + options.ttl : null;

    this.cache.set(key, {
      value,
      expiresAt,
    });

    this.syncToShared();
  }

  /**
   * Remove a value from storage
   */
  removeItem(key: string): void {
    if (this.cache.delete(key)) {
      this.syncToShared();
      // Notify storage deletion hooks
      try {
        const { notifyStorageDelete } = require('../hooks/lifecycle');
        notifyStorageDelete(key);
      } catch {
        // Hooks module may not be loaded yet, ignore
      }
    }
  }

  /**
   * Clear all storage for this application
   * This will delete the storage file if it becomes empty
   */
  clear(): void {
    const keys = Array.from(this.cache.keys());
    this.cache.clear();
    this.manager.clearAppData(this.appId);

    // Trigger persistence check (will delete file if storage is empty)
    this.manager.markDirty();
    this.manager.persistToDisk();

    // Notify storage deletion hooks for each deleted key
    try {
      const { notifyStorageDelete } = require('../hooks/lifecycle');
      keys.forEach((key) => notifyStorageDelete(key));
    } catch {
      // Hooks module may not be loaded yet, ignore
    }
  }

  /**
   * Get all storage keys
   */
  keys(): string[] {
    this.cleanupExpired();
    return Array.from(this.cache.keys());
  }

  /**
   * Get storage size (number of keys)
   */
  get length(): number {
    this.cleanupExpired();
    return this.cache.size;
  }

  /**
   * Check if a key exists in storage
   */
  hasItem(key: string): boolean {
    this.cleanupExpired();
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }
    // Check if expired
    if (entry.expiresAt !== null && entry.expiresAt <= Date.now()) {
      this.cache.delete(key);
      this.syncToShared();
      return false;
    }
    return true;
  }

  /**
   * Get storage file path
   */
  getStoragePath(): string {
    // Access private filePath via manager (shared file path)
    interface ManagerWithFilePath {
      filePath: string;
    }
    return (this.manager as unknown as ManagerWithFilePath).filePath;
  }

  /**
   * Get application ID
   */
  getAppId(): string {
    return this.appId;
  }
}

/**
 * Storage API interface with generic support
 */
export interface StorageAPI {
  /**
   * Get an item from storage
   * @param key - Storage key
   * @param defaultValue - Optional default value if key doesn't exist
   * @returns Stored value, default value, or null if not found
   */
  getItem<T extends StorageValue = StorageValue>(key: string, defaultValue?: T | null): T | null;

  /**
   * Set an item in storage
   * @param key - Storage key
   * @param value - Value to store
   * @param options - Optional storage options (TTL in milliseconds)
   */
  setItem<T extends StorageValue = StorageValue>(
    key: string,
    value: T,
    options?: { ttl?: number }
  ): void;

  removeItem(key: string): void;
  clear(): void;
  keys(): string[];
  readonly length: number;
  hasItem(key: string): boolean;
  getStoragePath(): string;
  getAppId(): string;
}

/**
 * Generate application ID from current working directory
 */
function generateAppId(): string {
  try {
    // Use hash of current working directory as app ID
    const cwd = process.cwd();
    return createHash('sha256').update(cwd).digest('hex').substring(0, 16);
  } catch {
    // Fallback to 'default' if can't determine app ID
    return 'default';
  }
}

/**
 * Current application storage instance (auto-created)
 *
 * Automatically initialized when first accessed.
 * Uses app ID derived from process.cwd() or can be set via initializeStorage().
 */
let currentAppStorage: ApplicationStorage | null = null;
let currentAppId: string | null = null;

/**
 * Initialize storage for the current application
 *
 * Called automatically by render() or can be called manually.
 * If appId is not provided, auto-generates from process.cwd().
 *
 * @param appId - Optional application ID (auto-generated if not provided)
 * @param options - Optional storage options
 * @returns ApplicationStorage instance
 *
 * @internal
 * This is called automatically by render() - users typically don't need to call this.
 */
export function initializeStorage(appId?: string, options?: StorageOptions): ApplicationStorage {
  const id = appId || generateAppId();

  // If already initialized with same app ID, return existing instance
  if (currentAppStorage && currentAppId === id) {
    return currentAppStorage;
  }

  const manager = StorageManager.getInstance();
  currentAppStorage = manager.getAppStorage(id, options);
  currentAppId = id;

  return currentAppStorage;
}

/**
 * Get current application storage instance
 *
 * Automatically initializes storage if not already initialized.
 * Uses app ID derived from process.cwd().
 *
 * @returns ApplicationStorage instance for current application
 *
 * @example
 * ```ts
 * import { storage } from 'react-console';
 *
 * // Use storage (automatically initialized)
 * storage.setItem('username', 'john');
 * const username = storage.getItem('username');
 * ```
 */
export function getStorage(): ApplicationStorage {
  if (!currentAppStorage) {
    return initializeStorage();
  }
  return currentAppStorage;
}

/**
 * Storage singleton - automatically initialized
 *
 * Automatically created when first accessed. Uses app ID derived from process.cwd().
 * Each application gets its own isolated namespace within the shared encrypted file.
 *
 * @example
 * ```ts
 * import { storage } from 'react-console';
 *
 * // Use storage (automatically initialized)
 * storage.setItem('username', 'john');
 * const username = storage.getItem('username');
 *
 * // Store with optional TTL
 * storage.setItem('token', 'abc123', { ttl: 3600000 });
 * ```
 */
export const storage: StorageAPI = new Proxy({} as StorageAPI, {
  get(_target, prop) {
    const instance = getStorage();
    const value = (instance as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === 'function'
      ? (value as (...args: unknown[]) => unknown).bind(instance)
      : value;
  },
});
