/**
 * CLI Configuration System
 * Provides configuration management for CLI applications
 */

/**
 * Configuration value type
 */
export type ConfigValue = string | number | boolean | string[] | Record<string, unknown> | null;

/**
 * Configuration object
 */
export interface Config {
  [key: string]: ConfigValue;
}

/**
 * Configuration source
 */
export type ConfigSource = 'default' | 'file' | 'env' | 'cli' | 'component';

/**
 * Configuration entry with source tracking
 */
export interface ConfigEntry {
  value: ConfigValue;
  source: ConfigSource;
}

/**
 * Configuration manager
 */
class ConfigManager {
  private config: Map<string, ConfigEntry> = new Map();
  private defaults: Config = {};
  private fileConfig: Config = {};
  private envConfig: Config = {};
  private cliConfig: Config = {};
  private componentConfig: Config = {};

  /**
   * Set default configuration
   */
  setDefaults(defaults: Config): void {
    this.defaults = { ...defaults };
    this.rebuild();
  }

  /**
   * Load configuration from file (JSON/YAML/TypeScript)
   */
  loadFromFile(config: Config): void {
    this.fileConfig = { ...config };
    this.rebuild();
  }

  /**
   * Load configuration from environment variables
   */
  loadFromEnv(env: Record<string, string | undefined>, prefix?: string): void {
    const prefixPattern = prefix ? new RegExp(`^${prefix}_`, 'i') : null;
    this.envConfig = {};

    for (const [key, value] of Object.entries(env)) {
      if (value === undefined) continue;

      let configKey = key;
      if (prefixPattern) {
        const match = key.match(prefixPattern);
        if (match) {
          configKey = key.replace(prefixPattern, '').toLowerCase();
        } else {
          continue; // Skip if doesn't match prefix
        }
      }

      // Convert to appropriate type
      let typedValue: ConfigValue = value;
      if (value === 'true') typedValue = true;
      else if (value === 'false') typedValue = false;
      else if (value === 'null' || value === '') typedValue = null;
      else if (/^-?\d+$/.test(value)) typedValue = parseInt(value, 10);
      else if (/^-?\d*\.\d+$/.test(value)) typedValue = parseFloat(value);
      else if (value.includes(',')) typedValue = value.split(',').map((v) => v.trim());

      this.envConfig[configKey] = typedValue;
    }

    this.rebuild();
  }

  /**
   * Set CLI-provided configuration (from command-line args)
   */
  setCLIConfig(config: Config): void {
    this.cliConfig = { ...config };
    this.rebuild();
  }

  /**
   * Set component-provided configuration
   */
  setComponentConfig(config: Config): void {
    this.componentConfig = { ...config };
    this.rebuild();
  }

  /**
   * Rebuild configuration with priority: CLI > Component > Env > File > Default
   */
  private rebuild(): void {
    this.config.clear();

    // Add defaults first
    for (const [key, value] of Object.entries(this.defaults)) {
      this.config.set(key, { value, source: 'default' });
    }

    // Override with file config
    for (const [key, value] of Object.entries(this.fileConfig)) {
      this.config.set(key, { value, source: 'file' });
    }

    // Override with env config
    for (const [key, value] of Object.entries(this.envConfig)) {
      this.config.set(key, { value, source: 'env' });
    }

    // Override with component config
    for (const [key, value] of Object.entries(this.componentConfig)) {
      this.config.set(key, { value, source: 'component' });
    }

    // Override with CLI config (highest priority)
    for (const [key, value] of Object.entries(this.cliConfig)) {
      this.config.set(key, { value, source: 'cli' });
    }
  }

  /**
   * Get configuration value
   */
  get<T extends ConfigValue = ConfigValue>(key: string): T | undefined {
    const entry = this.config.get(key);
    return entry ? (entry.value as T) : undefined;
  }

  /**
   * Get configuration value with default
   */
  getWithDefault<T extends ConfigValue = ConfigValue>(key: string, defaultValue: T): T {
    const value = this.get<T>(key);
    return value !== undefined ? value : defaultValue;
  }

  /**
   * Get configuration entry (with source)
   */
  getEntry(key: string): ConfigEntry | undefined {
    return this.config.get(key);
  }

  /**
   * Set configuration value (component source)
   */
  set(key: string, value: ConfigValue): void {
    this.componentConfig[key] = value;
    this.rebuild();
  }

  /**
   * Check if configuration key exists
   */
  has(key: string): boolean {
    return this.config.has(key);
  }

  /**
   * Get all configuration
   */
  getAll(): Config {
    const result: Config = {};
    for (const [key, entry] of this.config.entries()) {
      result[key] = entry.value;
    }
    return result;
  }

  /**
   * Clear all configuration
   */
  clear(): void {
    this.config.clear();
    this.defaults = {};
    this.fileConfig = {};
    this.envConfig = {};
    this.cliConfig = {};
    this.componentConfig = {};
  }
}

/**
 * Global configuration manager
 */
export const configManager = new ConfigManager();

/**
 * Set default configuration
 */
export function setDefaults(defaults: Config): void {
  configManager.setDefaults(defaults);
}

/**
 * Load configuration from environment variables
 */
export function loadFromEnv(env?: Record<string, string | undefined>, prefix?: string): void {
  const envVars = env || (typeof process !== 'undefined' && process.env ? process.env : {});
  configManager.loadFromEnv(envVars, prefix);
}

/**
 * Load configuration from file
 */
export function loadFromFile(config: Config): void {
  configManager.loadFromFile(config);
}

/**
 * Set CLI configuration
 */
export function setCLIConfig(config: Config): void {
  configManager.setCLIConfig(config);
}

/**
 * Get configuration value
 */
export function getConfig<T extends ConfigValue = ConfigValue>(key: string): T | undefined {
  return configManager.get<T>(key);
}

/**
 * Get configuration value with default
 */
export function getConfigWithDefault<T extends ConfigValue = ConfigValue>(
  key: string,
  defaultValue: T
): T {
  return configManager.getWithDefault<T>(key, defaultValue);
}

/**
 * Set configuration value
 */
export function setConfig(key: string, value: ConfigValue): void {
  configManager.set(key, value);
}

/**
 * Check if configuration exists
 */
export function hasConfig(key: string): boolean {
  return configManager.has(key);
}

/**
 * Get all configuration
 */
export function getAllConfig(): Config {
  return configManager.getAll();
}
