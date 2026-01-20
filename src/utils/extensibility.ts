/**
 * Extensibility and Plugin System
 * Provides component registry, custom renderers, and plugin API
 */

import type { ConsoleNode, ViewStyle, TextStyle } from '../types';

/**
 * Custom renderer function type
 * Renderer functions take a node and return rendered output (buffer/lines)
 */
export type CustomRenderer = (
  node: ConsoleNode,
  context: {
    width: number;
    height: number;
    x: number;
    y: number;
    [key: string]: unknown;
  }
) => string[] | string; // Returns array of lines or single string

/**
 * Component registry entry
 */
export interface ComponentRegistryEntry {
  type: string;
  renderer?: CustomRenderer;
  defaultStyle?: ViewStyle | TextStyle;
  validator?: (node: ConsoleNode) => boolean;
}

/**
 * Component Registry
 * Allows registering custom component types with custom renderers
 */
class ComponentRegistry {
  private registry: Map<string, ComponentRegistryEntry> = new Map();
  
  /**
   * Register a custom component type
   * @param entry - Component registry entry
   */
  register(entry: ComponentRegistryEntry): void {
    if (!entry.type) {
      throw new Error('Component type is required');
    }
    this.registry.set(entry.type, entry);
  }
  
  /**
   * Register a component type with a custom renderer
   * @param type - Component type name
   * @param renderer - Custom renderer function
   * @param options - Optional additional options
   */
  registerComponent(
    type: string,
    renderer: CustomRenderer,
    options?: {
      defaultStyle?: ViewStyle | TextStyle;
      validator?: (node: ConsoleNode) => boolean;
    }
  ): void {
    this.register({
      type,
      renderer,
      ...options,
    });
  }
  
  /**
   * Get registry entry for a component type
   * @param type - Component type name
   * @returns Registry entry or undefined
   */
  get(type: string): ComponentRegistryEntry | undefined {
    return this.registry.get(type);
  }
  
  /**
   * Check if a component type is registered
   * @param type - Component type name
   * @returns True if registered
   */
  has(type: string): boolean {
    return this.registry.has(type);
  }
  
  /**
   * Unregister a component type
   * @param type - Component type name
   */
  unregister(type: string): void {
    this.registry.delete(type);
  }
  
  /**
   * Get all registered component types
   * @returns Array of registered type names
   */
  getAllTypes(): string[] {
    return Array.from(this.registry.keys());
  }
  
  /**
   * Clear all registrations
   */
  clear(): void {
    this.registry.clear();
  }
}

/**
 * Plugin configuration
 */
export interface PluginConfig {
  name: string;
  version?: string;
  components?: ComponentRegistryEntry[];
  renderers?: Record<string, CustomRenderer>;
  onRegister?: () => void;
  onUnregister?: () => void;
}

/**
 * Plugin API
 * Provides plugin lifecycle and registration
 */
class PluginAPI {
  private plugins: Map<string, PluginConfig> = new Map();
  private componentRegistry: ComponentRegistry;
  
  constructor(registry: ComponentRegistry) {
    this.componentRegistry = registry;
  }
  
  /**
   * Register a plugin
   * @param config - Plugin configuration
   */
  registerPlugin(config: PluginConfig): void {
    if (!config.name) {
      throw new Error('Plugin name is required');
    }
    
    if (this.plugins.has(config.name)) {
      console.warn(`Plugin "${config.name}" is already registered. Overwriting.`);
    }
    
    // Register plugin components
    if (config.components) {
      for (const component of config.components) {
        this.componentRegistry.register(component);
      }
    }
    
    // Register plugin renderers
    if (config.renderers) {
      for (const [type, renderer] of Object.entries(config.renderers)) {
        this.componentRegistry.registerComponent(type, renderer);
      }
    }
    
    // Call plugin onRegister hook
    if (config.onRegister) {
      try {
        config.onRegister();
      } catch (error) {
        console.error(`Error in plugin "${config.name}" onRegister hook:`, error);
      }
    }
    
    this.plugins.set(config.name, config);
  }
  
  /**
   * Unregister a plugin
   * @param name - Plugin name
   */
  unregisterPlugin(name: string): void {
    const plugin = this.plugins.get(name);
    if (!plugin) {
      console.warn(`Plugin "${name}" is not registered.`);
      return;
    }
    
    // Call plugin onUnregister hook
    if (plugin.onUnregister) {
      try {
        plugin.onUnregister();
      } catch (error) {
        console.error(`Error in plugin "${name}" onUnregister hook:`, error);
      }
    }
    
    // Unregister plugin components
    if (plugin.components) {
      for (const component of plugin.components) {
        this.componentRegistry.unregister(component.type);
      }
    }
    
    if (plugin.renderers) {
      for (const type of Object.keys(plugin.renderers)) {
        this.componentRegistry.unregister(type);
      }
    }
    
    this.plugins.delete(name);
  }
  
  /**
   * Get plugin configuration
   * @param name - Plugin name
   * @returns Plugin configuration or undefined
   */
  getPlugin(name: string): PluginConfig | undefined {
    return this.plugins.get(name);
  }
  
  /**
   * Get all registered plugins
   * @returns Array of plugin names
   */
  getAllPlugins(): string[] {
    return Array.from(this.plugins.keys());
  }
  
  /**
   * Check if a plugin is registered
   * @param name - Plugin name
   * @returns True if registered
   */
  hasPlugin(name: string): boolean {
    return this.plugins.has(name);
  }
}

// Export singleton instances
export const componentRegistry = new ComponentRegistry();
export const pluginAPI = new PluginAPI(componentRegistry);

/**
 * Register a custom component type
 * Convenience function for component registry
 * @param type - Component type name
 * @param renderer - Custom renderer function
 * @param options - Optional additional options
 */
export function registerComponent(
  type: string,
  renderer: CustomRenderer,
  options?: {
    defaultStyle?: ViewStyle | TextStyle;
    validator?: (node: ConsoleNode) => boolean;
  }
): void {
  componentRegistry.registerComponent(type, renderer, options);
}

/**
 * Register a plugin
 * Convenience function for plugin API
 * @param config - Plugin configuration
 */
export function registerPlugin(config: PluginConfig): void {
  pluginAPI.registerPlugin(config);
}

/**
 * Unregister a plugin
 * Convenience function for plugin API
 * @param name - Plugin name
 */
export function unregisterPlugin(name: string): void {
  pluginAPI.unregisterPlugin(name);
}
