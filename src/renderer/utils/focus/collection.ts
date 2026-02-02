/**
 * Focus collection utilities
 * Functions for collecting and organizing interactive components
 * Updated to work with new Node architecture
 */

import type { Node } from '../../../nodes/base/Node';

/**
 * Collect all interactive components from tree
 *
 * Recursively walks the component tree to find all interactive components
 * (input, button, radio, checkbox, dropdown, list, and boxes with onClick/onPress).
 * Used for tab navigation and focus management.
 *
 * @param node - Root Node to traverse
 * @param result - Array to populate with interactive components (modified in place)
 *
 * @example
 * ```ts
 * const components: Node[] = [];
 * collectInteractiveComponents(rootNode, components);
 * // components now contains all interactive components
 * ```
 */
export function collectInteractiveComponents(node: Node, result: Node[], _depth: number = 0): void {
  // Collect all interactive component types
  const isInteractive =
    node.type === 'input' ||
    node.type === 'button' ||
    node.type === 'radio' ||
    node.type === 'checkbox' ||
    node.type === 'dropdown' ||
    node.type === 'list' ||
    node.type === 'scrollview' ||
    (node.type === 'box' &&
      ((node as unknown as { onClick?: unknown }).onClick ||
        (node as unknown as { onPress?: unknown }).onPress));

  if (isInteractive) {
    result.push(node);
  }

  // Recursively check all children
  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      collectInteractiveComponents(child, result, _depth + 1);
    }
  }
}

/**
 * Auto-assign tab indexes to interactive components
 *
 * Assigns tab indexes to interactive components that don't have explicit tabIndex.
 * Components without tabIndex get auto-assigned values starting from the highest
 * explicit tabIndex + 1 (or 0 if no explicit tabIndexes).
 * Components with explicit tabIndex keep their values.
 * Components with tabIndex < 0 are not focusable (skipped).
 *
 * @param components - Array of interactive components to assign tab indexes to (modified in place)
 *
 * @example
 * ```ts
 * const components = collectInteractiveComponents(rootNode, []);
 * assignTabIndexes(components);
 * // Components without explicit tabIndex now have auto-assigned values
 * ```
 */
export function assignTabIndexes(_components: Node[]): void {
  // Don't auto-assign tabIndexes - just use document order for navigation
  // This avoids issues with components being collected in different orders
  // on different renders. Navigation will use the array order directly.
  //
  // Components with explicit tabIndex will still be respected in navigation.ts
  // Components without tabIndex will navigate in document (tree) order.
}
