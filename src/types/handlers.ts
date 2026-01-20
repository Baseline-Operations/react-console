/**
 * Generic type definitions for component handlers
 * Provides type-safe handler signatures and registry
 */

import type { ConsoleNode, KeyPress } from './index';

/**
 * Generic component handler type
 * All component handlers follow this signature
 */
export type ComponentHandler = (
  component: ConsoleNode,
  chunk: string,
  key: KeyPress,
  scheduleUpdate: () => void
) => void;

/**
 * Handler registry mapping component types to their handlers
 * Provides type-safe handler dispatch
 */
export type HandlerRegistry = {
  [K in ConsoleNode['type']]?: ComponentHandler;
};

/**
 * Type-safe handler lookup
 * Ensures handler exists for component type
 */
export function getHandler<T extends ConsoleNode['type']>(
  registry: HandlerRegistry,
  type: T
): ComponentHandler | undefined {
  return registry[type];
}

/**
 * Type-safe handler dispatch
 * Dispatches to appropriate handler based on component type
 */
export function dispatchHandler(
  registry: HandlerRegistry,
  component: ConsoleNode,
  chunk: string,
  key: KeyPress,
  scheduleUpdate: () => void
): void {
  const handler = registry[component.type];
  if (handler) {
    handler(component, chunk, key, scheduleUpdate);
  }
}
