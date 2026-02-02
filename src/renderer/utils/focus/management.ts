/**
 * Focus management utilities
 * Functions for managing component focus state and overlays
 */

import type { ConsoleNode } from '../../../types';
import { terminal } from '../../../utils/globalTerminal';

// Interface for focusable nodes
interface FocusableNode {
  focused?: boolean;
  disabled?: boolean;
  tabIndex?: number;
  zIndex?: number;
  onFocus?: (event?: unknown) => void;
  onBlur?: () => void;
}

/**
 * Find all overlays in the component tree
 *
 * Recursively searches the component tree for all overlay nodes.
 * Returns array of overlay nodes sorted by z-index (highest first).
 * Useful for determining which overlay is topmost for focus trapping.
 *
 * @param root - Root ConsoleNode to search
 * @returns Array of overlay nodes sorted by z-index (highest first)
 *
 * @example
 * ```ts
 * const overlays = findAllOverlays(rootNode);
 * const topmost = overlays[0]; // Highest z-index overlay
 * ```
 */
export function findAllOverlays(
  root: import('../../../nodes/base/Node').Node
): import('../../../nodes/base/Node').Node[] {
  const overlays: Array<{ node: import('../../../nodes/base/Node').Node; zIndex: number }> = [];

  function traverse(node: import('../../../nodes/base/Node').Node): void {
    if (node.type === 'overlay') {
      const focusableNode = node as unknown as FocusableNode;
      const zIndex = focusableNode.zIndex ?? 0;
      overlays.push({ node, zIndex });
    }
    for (const child of node.children) {
      traverse(child);
    }
  }

  traverse(root);
  // Sort by z-index (highest first)
  overlays.sort((a, b) => b.zIndex - a.zIndex);
  return overlays.map((o) => o.node);
}

/**
 * Find the topmost overlay (highest z-index) in the component tree
 * Returns the overlay node if found, or null if no overlay exists
 */
export function findTopmostOverlay(
  root: import('../../../nodes/base/Node').Node
): import('../../../nodes/base/Node').Node | null {
  const overlays = findAllOverlays(root);
  return overlays.length > 0 ? overlays[0]! : null;
}

/**
 * Programmatically focus a component
 *
 * Blurs currently focused component and focuses the target component.
 * Updates global terminal focus state and triggers focus/blur events.
 * Skips disabled components (returns early if component is disabled).
 *
 * @param component - Component to focus (must not be disabled)
 * @param interactiveComponents - All interactive components (to blur currently focused one)
 * @param scheduleUpdate - Function to schedule re-render after focus change
 *
 * @example
 * ```ts
 * focusComponent(myButton, components, scheduleUpdate);
 * // myButton is now focused, previous focus blurred
 * ```
 */
export function focusComponent(
  component: import('../../../nodes/base/Node').Node,
  interactiveComponents: import('../../../nodes/base/Node').Node[],
  scheduleUpdate: () => void
): void {
  const focusable = component as unknown as FocusableNode;
  if (focusable.disabled) {
    return; // Don't focus disabled components
  }

  // Blur currently focused component
  const currentlyFocused = interactiveComponents.find((comp) => {
    const fc = comp as unknown as FocusableNode;
    return fc.focused;
  });
  if (currentlyFocused && currentlyFocused !== component) {
    const currentFocusable = currentlyFocused as unknown as FocusableNode;
    currentFocusable.focused = false;
    if (currentFocusable.onBlur) {
      currentFocusable.onBlur();
    }
  }

  // Focus target component
  focusable.focused = true;
  terminal.setFocusedComponent(component as unknown as ConsoleNode);
  if (focusable.onFocus) {
    focusable.onFocus();
  }
  scheduleUpdate();
}

/**
 * Programmatically enable a component
 *
 * Enables a disabled component by setting disabled to false.
 * Does nothing if component is already enabled.
 *
 * @param component - Component to enable (modified in place)
 * @param scheduleUpdate - Function to schedule re-render after enabling
 *
 * @example
 * ```ts
 * enableComponent(myButton, scheduleUpdate);
 * // myButton.disabled is now false
 * ```
 */
export function enableComponent(component: ConsoleNode, scheduleUpdate: () => void): void {
  if (!component.disabled) {
    return; // Already enabled
  }
  component.disabled = false;
  scheduleUpdate();
}

/**
 * Programmatically disable a component
 *
 * Disables a component by setting disabled to true.
 * If the component is currently focused, blurs it first and focuses the
 * next available component in tab order. Does nothing if component is already disabled.
 *
 * @param component - Component to disable (modified in place)
 * @param interactiveComponents - All interactive components (to find next focus target if needed)
 * @param scheduleUpdate - Function to schedule re-render after disabling
 *
 * @example
 * ```ts
 * disableComponent(myButton, components, scheduleUpdate);
 * // myButton.disabled is now true, focus moved to next component if it was focused
 * ```
 */
export function disableComponent(
  component: ConsoleNode,
  interactiveComponents: ConsoleNode[],
  scheduleUpdate: () => void
): void {
  if (component.disabled) {
    return; // Already disabled
  }

  // If component is focused, blur it
  if (component.focused) {
    component.focused = false;
    terminal.setFocusedComponent(null);
    component.onBlur?.();

    // Focus next available component
    const focusableComponents = interactiveComponents.filter(
      (comp) =>
        comp !== component && !comp.disabled && (comp.tabIndex === undefined || comp.tabIndex >= 0)
    );
    if (focusableComponents.length > 0) {
      const sorted = [...focusableComponents].sort((a, b) => (a.tabIndex || 0) - (b.tabIndex || 0));
      const next = sorted[0]!;
      next.focused = true;
      terminal.setFocusedComponent(next);
      next.onFocus?.();
    }
  }

  component.disabled = true;
  scheduleUpdate();
}
