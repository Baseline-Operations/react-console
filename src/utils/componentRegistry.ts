/**
 * Component registry system for extensibility
 * Allows registering custom component types and renderers
 */

import type { ConsoleNode } from '../types';

/**
 * Custom renderer function for registered components
 */
export type CustomRenderer = (
  node: ConsoleNode,
  options: {
    width: number;
    height: number;
    x: number;
    y: number;
  }
) => string;

/**
 * Component registration
 */
export interface ComponentRegistration {
  /** Component type name */
  type: string;
  /** Custom renderer function */
  renderer: CustomRenderer;
  /** Component metadata */
  metadata?: {
    description?: string;
    props?: Record<string, unknown>;
  };
}

/**
 * Component registry
 * Stores custom component types and their renderers
 */
class ComponentRegistryClass {
  private registry: Map<string, ComponentRegistration> = new Map();

  /**
   * Register a custom component type
   * @param registration - Component registration
   */
  register(registration: ComponentRegistration): void {
    if (this.registry.has(registration.type)) {
      console.warn(
        `[React Console] Component type "${registration.type}" is already registered. Overwriting previous registration.`
      );
    }
    this.registry.set(registration.type, registration);
  }

  /**
   * Unregister a custom component type
   * @param type - Component type name
   */
  unregister(type: string): void {
    this.registry.delete(type);
  }

  /**
   * Get renderer for a component type
   * @param type - Component type name
   * @returns Custom renderer or undefined
   */
  getRenderer(type: string): CustomRenderer | undefined {
    return this.registry.get(type)?.renderer;
  }

  /**
   * Check if a component type is registered
   * @param type - Component type name
   * @returns True if registered
   */
  isRegistered(type: string): boolean {
    return this.registry.has(type);
  }

  /**
   * Get registration for a component type
   * @param type - Component type name
   * @returns Component registration or undefined
   */
  getRegistration(type: string): ComponentRegistration | undefined {
    return this.registry.get(type);
  }

  /**
   * Get all registered component types
   * @returns Array of registered type names
   */
  getRegisteredTypes(): string[] {
    return Array.from(this.registry.keys());
  }

  /**
   * Clear all registrations
   */
  clear(): void {
    this.registry.clear();
  }
}

export const componentRegistry = new ComponentRegistryClass();

/**
 * Register a custom component type
 * @param registration - Component registration
 * 
 * @example
 * ```ts
 * registerComponent({
 *   type: 'custom-widget',
 *   renderer: (node, options) => {
 *     // Custom rendering logic
 *     return 'Custom widget content';
 *   },
 *   metadata: {
 *     description: 'A custom widget component',
 *   },
 * });
 * ```
 */
export function registerComponent(registration: ComponentRegistration): void {
  componentRegistry.register(registration);
}

/**
 * Unregister a custom component type
 * @param type - Component type name
 */
export function unregisterComponent(type: string): void {
  componentRegistry.unregister(type);
}

/**
 * Get renderer for a component type
 * @param type - Component type name
 * @returns Custom renderer or undefined
 */
export function getComponentRenderer(type: string): CustomRenderer | undefined {
  return componentRegistry.getRenderer(type);
}

/**
 * Check if a component type is registered
 * @param type - Component type name
 * @returns True if registered
 */
export function isComponentRegistered(type: string): boolean {
  return componentRegistry.isRegistered(type);
}
