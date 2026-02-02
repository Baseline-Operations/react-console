/**
 * Configuration file loader (Node.js only)
 *
 * NOTE: These are optional helper utilities for Node.js CLI applications.
 * Users can load configuration files themselves and pass the config object
 * to `loadFromFile()` from './config'. These utilities are provided for convenience
 * but are not required - the CLI framework works without them.
 *
 * These functions are Node.js-only and use Node.js APIs (fs, require).
 * For React Console applications, prefer loading config in your application code
 * and passing it to loadFromFile().
 */

import type { Config } from './config';
import { loadFromFile } from './config';

/**
 * Check if running in Node.js environment
 */
function isNodeJS(): boolean {
  return (
    typeof process !== 'undefined' && process.versions != null && process.versions.node != null
  );
}

/**
 * Load configuration from JSON file (Node.js only)
 *
 * @param filePath - Path to JSON configuration file
 * @returns Configuration object
 * @throws Error if not in Node.js environment or file cannot be loaded
 */
export async function loadConfigFromJSON(filePath: string): Promise<Config> {
  if (!isNodeJS()) {
    throw new Error(
      'loadConfigFromJSON is only available in Node.js environment. Load the file yourself and use loadFromFile() instead.'
    );
  }

  try {
    // Use dynamic import for modern Node.js (ESM)
    // Fallback to require for CommonJS
    let config: Config;

    // Try dynamic import first (ESM)
    try {
      const module = await import(filePath);
      config = module.default || module;
    } catch {
      // Fallback to require for CommonJS

      const fs = require('fs');
      const content = fs.readFileSync(filePath, 'utf8');
      config = JSON.parse(content);
    }

    loadFromFile(config);
    return config;
  } catch (error) {
    throw new Error(
      `Failed to load JSON config from ${filePath}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Load configuration from YAML file (Node.js only)
 * Requires yaml package to be installed: npm install yaml
 *
 * @param filePath - Path to YAML configuration file
 * @returns Configuration object
 * @throws Error if not in Node.js environment, yaml package not installed, or file cannot be loaded
 */
export async function loadConfigFromYAML(filePath: string): Promise<Config> {
  if (!isNodeJS()) {
    throw new Error(
      'loadConfigFromYAML is only available in Node.js environment. Load the file yourself and use loadFromFile() instead.'
    );
  }

  try {
    const yaml = require('yaml');

    const fs = require('fs');

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const config = yaml.parse(fileContent);
    loadFromFile(config);
    return config;
  } catch (error) {
    if (error instanceof Error && error.message.includes('Cannot find module')) {
      throw new Error(
        `Failed to load YAML config: 'yaml' package is required. Install it with: npm install yaml`
      );
    }
    throw new Error(
      `Failed to load YAML config from ${filePath}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Load configuration from TypeScript/JavaScript file (Node.js only)
 * Note: This requires the file to be compiled or use ts-node/tsx
 *
 * @param filePath - Path to TS/JS configuration file
 * @returns Configuration object
 * @throws Error if not in Node.js environment or file cannot be loaded
 */
export async function loadConfigFromTS(filePath: string): Promise<Config> {
  if (!isNodeJS()) {
    throw new Error(
      'loadConfigFromTS is only available in Node.js environment. Load the file yourself and use loadFromFile() instead.'
    );
  }

  try {
    let config: Config;

    // Try dynamic import first (ESM)
    try {
      const module = await import(filePath);
      config = module.default || module;
    } catch {
      // Fallback to require for CommonJS

      config = require(filePath);
      config = (config as Record<string, unknown>).default || config;
    }

    loadFromFile(config);
    return config;
  } catch (error) {
    throw new Error(
      `Failed to load config from ${filePath}. Make sure the file is compiled or use ts-node/tsx: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Auto-detect and load configuration file (Node.js only)
 * Tries JSON, YAML, and TS/JS in order
 *
 * @param filePath - Path to configuration file (without extension)
 * @param extensions - Extensions to try (default: ['json', 'yaml', 'yml', 'ts', 'js'])
 * @returns Configuration object
 * @throws Error if not in Node.js environment or no config file found
 */
export async function loadConfigFile(
  filePath: string,
  extensions: string[] = ['json', 'yaml', 'yml', 'ts', 'js']
): Promise<Config> {
  if (!isNodeJS()) {
    throw new Error(
      'loadConfigFile is only available in Node.js environment. Load the file yourself and use loadFromFile() instead.'
    );
  }

  const fs = require('fs');

  for (const ext of extensions) {
    const fullPath = `${filePath}.${ext}`;
    if (fs.existsSync(fullPath)) {
      if (ext === 'json') {
        return loadConfigFromJSON(fullPath);
      } else if (ext === 'yaml' || ext === 'yml') {
        return loadConfigFromYAML(fullPath);
      } else if (ext === 'ts' || ext === 'js') {
        return loadConfigFromTS(fullPath);
      }
    }
  }

  throw new Error(
    `No configuration file found at ${filePath} with extensions: ${extensions.join(', ')}`
  );
}
