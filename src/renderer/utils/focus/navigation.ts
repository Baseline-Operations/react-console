/**
 * Tab navigation utilities
 * Functions for handling keyboard-based focus navigation
 */

import { terminal } from '../../../utils/globalTerminal';
import { findTopmostOverlay } from './management';
import { collectInteractiveComponents } from './collection';
import { debug } from '../../../utils/debug';
import type { ConsoleNode } from '../../../types';

// Interface for focusable nodes
interface FocusableNode {
  id?: string;
  type?: string;
  focused?: boolean;
  disabled?: boolean;
  tabIndex?: number;
  onFocus?: (event?: unknown) => void;
  onBlur?: (event?: unknown) => void;
}

/**
 * Find the nearest ScrollView ancestor for a node
 */
function findScrollViewAncestor(
  node: import('../../../nodes/base/Node').Node | null
): import('../../../nodes/base/Node').Node | null {
  let current = node?.parent || null;
  while (current) {
    if (current.type === 'scrollview') {
      return current;
    }
    current = current.parent;
  }
  return null;
}

/**
 * Scroll a component into view within its parent ScrollView
 */
function scrollIntoView(component: import('../../../nodes/base/Node').Node): void {
  const scrollView = findScrollViewAncestor(component);
  if (!scrollView) return;

  // Use ScrollView's scrollToNode method if available
  interface ScrollViewWithMethod {
    scrollToNode?: (node: unknown) => void;
  }
  const sv = scrollView as ScrollViewWithMethod;
  if (sv.scrollToNode) {
    sv.scrollToNode(component);
  }
}

/**
 * Handle Tab key navigation between components
 *
 * Manages focus navigation between interactive components using Tab/Shift+Tab.
 * Supports focus trapping within overlays (only cycles through components within
 * topmost overlay). Automatically handles focus/blur events and updates global
 * terminal focus state.
 *
 * @param components - Array of all interactive components
 * @param shift - Whether Shift key is pressed (navigate backward if true)
 * @param scheduleUpdate - Function to schedule re-render after focus change
 * @param rootNode - Optional root node for finding overlays (for focus trapping)
 *
 * @example
 * ```ts
 * handleTabNavigation(components, false, scheduleUpdate, rootNode);
 * // Focuses next component, or first if none focused
 * ```
 */
export function handleTabNavigation(
  components: import('../../../nodes/base/Node').Node[],
  shift: boolean,
  scheduleUpdate: () => void,
  rootNode?: import('../../../nodes/base/Node').Node // Root node for finding overlays
): void {
  debug('[handleTabNavigation] START', { shift, componentCount: components.length });

  // Filter out disabled components and those with negative tabIndex
  // Disabled elements should be skipped in tab navigation (standard accessibility behavior)
  let focusableComponents = components.filter((comp) => {
    const focusable = comp as unknown as FocusableNode;
    // Skip if disabled or has negative tabIndex
    return !focusable.disabled && (focusable.tabIndex === undefined || focusable.tabIndex >= 0);
  });

  // Focus trapping: if there's a topmost overlay, only allow navigation within it
  if (rootNode) {
    const topmostOverlay = findTopmostOverlay(rootNode);
    if (topmostOverlay) {
      // Filter to only components within the overlay
      const overlayComponents: import('../../../nodes/base/Node').Node[] = [];
      collectInteractiveComponents(topmostOverlay, overlayComponents);
      focusableComponents = focusableComponents.filter((comp) => overlayComponents.includes(comp));
    }
  }

  if (focusableComponents.length === 0) return;

  // Check if any component has POSITIVE tabIndex (not 0 or undefined)
  // tabIndex=0 and tabIndex=undefined should both follow document order
  const anyHasPositiveTabIndex = focusableComponents.some((comp) => {
    const focusable = comp as unknown as FocusableNode;
    return focusable.tabIndex !== undefined && focusable.tabIndex > 0;
  });

  // Only sort if there are positive tabIndexes (like tabIndex=1, 2, 3...)
  // tabIndex=0 and undefined should use document order (like HTML behavior)
  let sorted: typeof focusableComponents;
  if (anyHasPositiveTabIndex) {
    // Stable sort: components with positive tabIndex come first (sorted by value),
    // then all others maintain document order
    sorted = [...focusableComponents].sort((a, b) => {
      const aFocusable = a as unknown as FocusableNode;
      const bFocusable = b as unknown as FocusableNode;

      // Treat undefined as 0
      const aVal = aFocusable.tabIndex ?? 0;
      const bVal = bFocusable.tabIndex ?? 0;

      // Positive tabIndex values come first, sorted by value
      // tabIndex=0 (and undefined treated as 0) maintain document order
      if (aVal > 0 && bVal > 0) {
        return aVal - bVal;
      }
      if (aVal > 0) return -1; // a has positive tabIndex, comes first
      if (bVal > 0) return 1; // b has positive tabIndex, comes first
      // Both are 0 or undefined - maintain document order
      return 0;
    });
  } else {
    // No positive tabIndexes - use document order as-is
    sorted = focusableComponents;
  }

  // Find currently focused component index
  const currentFocusedIndex = sorted.findIndex((comp) => {
    const focusable = comp as unknown as FocusableNode;
    return focusable.focused;
  });

  // Blur current component
  if (currentFocusedIndex >= 0) {
    const current = sorted[currentFocusedIndex]!;
    const currentFocusable = current as unknown as FocusableNode;
    currentFocusable.focused = false;
    terminal.setFocusedComponent(null);
    if (currentFocusable.onBlur) {
      // Create blur event similar to React Native
      const blurEvent = {
        target: current,
        nativeEvent: { target: current },
      };
      currentFocusable.onBlur(blurEvent);
    }
  }

  // Get next/previous component
  let nextIndex: number;
  if (currentFocusedIndex < 0) {
    // No focus, go to first (or last if shift)
    nextIndex = shift ? sorted.length - 1 : 0;
  } else {
    if (shift) {
      // Shift+Tab: previous
      nextIndex = currentFocusedIndex > 0 ? currentFocusedIndex - 1 : sorted.length - 1;
    } else {
      // Tab: next
      nextIndex = currentFocusedIndex < sorted.length - 1 ? currentFocusedIndex + 1 : 0;
    }
  }

  // Focus next component
  const next = sorted[nextIndex]!;
  const nextFocusable = next as unknown as FocusableNode;
  nextFocusable.focused = true;
  terminal.setFocusedComponent(next as unknown as ConsoleNode);
  debug('[handleTabNavigation] focusing', { nextType: next.type, nextId: nextFocusable.id });

  // Scroll the component into view if it's inside a ScrollView
  scrollIntoView(next);

  if (nextFocusable.onFocus) {
    // Create focus event similar to React Native
    const focusEvent = {
      target: next,
      nativeEvent: { target: next },
    };
    nextFocusable.onFocus(focusEvent);
  }
  debug('[handleTabNavigation] calling scheduleUpdate');
  scheduleUpdate();
  debug('[handleTabNavigation] END');
}
