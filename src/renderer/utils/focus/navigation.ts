/**
 * Tab navigation utilities
 * Functions for handling keyboard-based focus navigation
 */

import { terminal } from '../../../utils/globalTerminal';
import { findTopmostOverlay } from './management';
import { collectInteractiveComponents } from './collection';

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
  let focusableComponents = components.filter((comp) => {
    const disabled = 'disabled' in comp ? (comp as any).disabled : false;
    const tabIndex = 'tabIndex' in comp ? (comp as any).tabIndex : undefined;
    return !disabled && (tabIndex === undefined || tabIndex >= 0);
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

  // Sort by tabIndex
  const sorted = [...focusableComponents].sort((a, b) => {
    const aTabIndex = 'tabIndex' in a ? (a as any).tabIndex : undefined;
    const bTabIndex = 'tabIndex' in b ? (b as any).tabIndex : undefined;
    return (aTabIndex || 0) - (bTabIndex || 0);
  });

  // Find currently focused component index
  const currentFocusedIndex = sorted.findIndex((comp) => 
    'focused' in comp && (comp as any).focused
  );

  // Blur current component
  if (currentFocusedIndex >= 0) {
    const current = sorted[currentFocusedIndex]!;
    (current as any).focused = false;
    terminal.setFocusedComponent(null);
    if ('onBlur' in current && (current as any).onBlur) {
      (current as any).onBlur();
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
  (next as any).focused = true;
  terminal.setFocusedComponent(next as any);
  if ('onFocus' in next && (next as any).onFocus) {
    (next as any).onFocus();
  }
  scheduleUpdate();
}
