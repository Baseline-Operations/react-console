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
export function collectInteractiveComponents(node: Node, result: Node[]): void {
  // Collect all interactive component types:
  // - input: Text/number inputs
  // - button: Clickable buttons
  // - radio: Radio button groups
  // - checkbox: Checkbox groups
  // - dropdown: Dropdown selects
  // - list: Selectable lists
  // - box: Boxes with onClick/onPress (Pressable, Focusable)
  const isInteractive = 
    node.type === 'input' ||
    node.type === 'button' ||
    node.type === 'radio' ||
    node.type === 'checkbox' ||
    node.type === 'dropdown' ||
    node.type === 'list' ||
    (node.type === 'box' && (('onClick' in node && (node as any).onClick) || ('onPress' in node && (node as any).onPress)));
  
  if (isInteractive) {
    result.push(node);
  }

  for (const child of node.children) {
    collectInteractiveComponents(child, result);
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
export function assignTabIndexes(components: Node[]): void {
  // Filter out disabled components and those with negative tabIndex
  const focusableComponents = components.filter(
    (comp) => {
      const disabled = 'disabled' in comp ? (comp as any).disabled : false;
      const tabIndex = 'tabIndex' in comp ? (comp as any).tabIndex : undefined;
      return !disabled && (tabIndex === undefined || tabIndex >= 0);
    }
  );

  // Sort by existing tabIndex (if any), then by document order
  const withTabIndex = focusableComponents.filter((comp) => 
    'tabIndex' in comp && (comp as any).tabIndex !== undefined
  );
  const withoutTabIndex = focusableComponents.filter((comp) => 
    !('tabIndex' in comp) || (comp as any).tabIndex === undefined
  );

  // Sort components with explicit tabIndex
  withTabIndex.sort((a, b) => 
    (('tabIndex' in a ? (a as any).tabIndex : 0) || 0) - 
    (('tabIndex' in b ? (b as any).tabIndex : 0) || 0)
  );

  // Auto-assign tab indexes starting from the highest explicit tabIndex + 1
  const maxTabIndex = withTabIndex.length > 0 
    ? Math.max(...withTabIndex.map((c) => ('tabIndex' in c ? (c as any).tabIndex : 0) || 0)) 
    : -1;

  withoutTabIndex.forEach((comp, index) => {
    (comp as any).tabIndex = maxTabIndex + 1 + index;
  });
}
