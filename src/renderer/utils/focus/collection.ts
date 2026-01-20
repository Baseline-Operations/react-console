/**
 * Focus collection utilities
 * Functions for collecting and organizing interactive components
 */

import type { ConsoleNode } from '../../../types';

/**
 * Collect all interactive components from tree
 * 
 * Recursively walks the component tree to find all interactive components
 * (input, button, radio, checkbox, dropdown, list, and boxes with onClick/onPress).
 * Used for tab navigation and focus management.
 * 
 * @param node - Root ConsoleNode to traverse
 * @param result - Array to populate with interactive components (modified in place)
 * 
 * @example
 * ```ts
 * const components: ConsoleNode[] = [];
 * collectInteractiveComponents(rootNode, components);
 * // components now contains all interactive components
 * ```
 */
export function collectInteractiveComponents(node: ConsoleNode, result: ConsoleNode[]): void {
  // Collect all interactive component types:
  // - input: Text/number inputs
  // - button: Clickable buttons
  // - radio: Radio button groups
  // - checkbox: Checkbox groups
  // - dropdown: Dropdown selects
  // - list: Selectable lists
  // - box: Boxes with onClick/onPress (Pressable, Focusable)
  if (
    node.type === 'input' ||
    node.type === 'button' ||
    node.type === 'radio' ||
    node.type === 'checkbox' ||
    node.type === 'dropdown' ||
    node.type === 'list' ||
    (node.type === 'box' && (node.onClick || node.onPress))
  ) {
    result.push(node);
  }

  if (node.children) {
    for (const child of node.children) {
      collectInteractiveComponents(child, result);
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
export function assignTabIndexes(components: ConsoleNode[]): void {
  // Filter out disabled components and those with negative tabIndex
  const focusableComponents = components.filter(
    (comp) => !comp.disabled && (comp.tabIndex === undefined || comp.tabIndex >= 0)
  );

  // Sort by existing tabIndex (if any), then by document order
  const withTabIndex = focusableComponents.filter((comp) => comp.tabIndex !== undefined);
  const withoutTabIndex = focusableComponents.filter((comp) => comp.tabIndex === undefined);

  // Sort components with explicit tabIndex
  withTabIndex.sort((a, b) => (a.tabIndex || 0) - (b.tabIndex || 0));

  // Auto-assign tab indexes starting from the highest explicit tabIndex + 1
  const maxTabIndex = withTabIndex.length > 0 
    ? Math.max(...withTabIndex.map((c) => c.tabIndex || 0)) 
    : -1;

  withoutTabIndex.forEach((comp, index) => {
    comp.tabIndex = maxTabIndex + 1 + index;
  });
}
