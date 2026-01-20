/**
 * Handler for Box components with onClick/onPress handlers
 * Used by Pressable and Focusable components
 */

import type { ConsoleNode, KeyPress } from '../../types';

/**
 * Handle input for Box component with onClick/onPress
 * Handles Enter/Space key presses for Pressable and Focusable components
 */
export function handleBoxComponent(
  component: ConsoleNode,
  _chunk: string,
  key: KeyPress,
  scheduleUpdate: () => void
): void {
  // Handle box component with onClick/onPress (Pressable, Focusable)
  if (key.return || key.char === ' ') {
    if (component.onClick) {
      component.onClick({ x: 0, y: 0 }); // Simplified mouse event
      scheduleUpdate();
    }
    if (component.onPress) {
      // onPress is alias for onClick (React Native pattern)
      component.onPress({ x: 0, y: 0 });
      scheduleUpdate();
    }
  }
}
