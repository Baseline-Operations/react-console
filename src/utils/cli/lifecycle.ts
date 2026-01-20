/**
 * Command lifecycle hooks system
 * Provides before/after execution hooks for commands
 */

import type { ParsedArgs } from './parser';
import type { ComponentMetadata } from './matcher';

/**
 * Lifecycle hook function type
 */
export type LifecycleHook = (
  parsedArgs: ParsedArgs,
  metadata: ComponentMetadata
) => void | Promise<void>;

/**
 * Lifecycle hooks registry
 */
class LifecycleRegistry {
  private beforeHooks: Map<string, LifecycleHook[]> = new Map();
  private afterHooks: Map<string, LifecycleHook[]> = new Map();
  private globalBeforeHooks: LifecycleHook[] = [];
  private globalAfterHooks: LifecycleHook[] = [];

  /**
   * Register global before hook
   */
  registerGlobalBefore(hook: LifecycleHook): void {
    this.globalBeforeHooks.push(hook);
  }

  /**
   * Register global after hook
   */
  registerGlobalAfter(hook: LifecycleHook): void {
    this.globalAfterHooks.push(hook);
  }

  /**
   * Register before hook for a command
   */
  registerBefore(commandPath: string, hook: LifecycleHook): void {
    if (!this.beforeHooks.has(commandPath)) {
      this.beforeHooks.set(commandPath, []);
    }
    this.beforeHooks.get(commandPath)!.push(hook);
  }

  /**
   * Register after hook for a command
   */
  registerAfter(commandPath: string, hook: LifecycleHook): void {
    if (!this.afterHooks.has(commandPath)) {
      this.afterHooks.set(commandPath, []);
    }
    this.afterHooks.get(commandPath)!.push(hook);
  }

  /**
   * Execute before hooks
   */
  async executeBefore(
    commandPath: string[],
    parsedArgs: ParsedArgs,
    metadata: ComponentMetadata
  ): Promise<void> {
    // Execute global hooks first
    for (const hook of this.globalBeforeHooks) {
      await hook(parsedArgs, metadata);
    }

    // Execute command-specific hooks
    const pathKey = commandPath.join(' ');
    const hooks = this.beforeHooks.get(pathKey);
    if (hooks) {
      for (const hook of hooks) {
        await hook(parsedArgs, metadata);
      }
    }
  }

  /**
   * Execute after hooks
   */
  async executeAfter(
    commandPath: string[],
    parsedArgs: ParsedArgs,
    metadata: ComponentMetadata
  ): Promise<void> {
    // Execute command-specific hooks first
    const pathKey = commandPath.join(' ');
    const hooks = this.afterHooks.get(pathKey);
    if (hooks) {
      for (const hook of hooks) {
        await hook(parsedArgs, metadata);
      }
    }

    // Execute global hooks
    for (const hook of this.globalAfterHooks) {
      await hook(parsedArgs, metadata);
    }
  }

  /**
   * Clear all hooks
   */
  clear(): void {
    this.beforeHooks.clear();
    this.afterHooks.clear();
    this.globalBeforeHooks = [];
    this.globalAfterHooks = [];
  }
}

/**
 * Global lifecycle registry
 */
export const lifecycleRegistry = new LifecycleRegistry();

/**
 * Register global before hook
 */
export function registerGlobalBeforeHook(hook: LifecycleHook): void {
  lifecycleRegistry.registerGlobalBefore(hook);
}

/**
 * Register global after hook
 */
export function registerGlobalAfterHook(hook: LifecycleHook): void {
  lifecycleRegistry.registerGlobalAfter(hook);
}

/**
 * Register before hook for a command
 */
export function registerBeforeHook(
  commandPath: string,
  hook: LifecycleHook
): void {
  lifecycleRegistry.registerBefore(commandPath, hook);
}

/**
 * Register after hook for a command
 */
export function registerAfterHook(
  commandPath: string,
  hook: LifecycleHook
): void {
  lifecycleRegistry.registerAfter(commandPath, hook);
}

/**
 * Execute before hooks
 */
export async function executeBeforeHooks(
  commandPath: string[],
  parsedArgs: ParsedArgs,
  metadata: ComponentMetadata
): Promise<void> {
  await lifecycleRegistry.executeBefore(commandPath, parsedArgs, metadata);
}

/**
 * Execute after hooks
 */
export async function executeAfterHooks(
  commandPath: string[],
  parsedArgs: ParsedArgs,
  metadata: ComponentMetadata
): Promise<void> {
  await lifecycleRegistry.executeAfter(commandPath, parsedArgs, metadata);
}
