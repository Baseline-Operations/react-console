/**
 * Navigation utilities for interactive components
 * Global utilities used across all components for focus and tab navigation
 * 
 * This file re-exports all navigation utilities from organized subdirectories.
 * Navigation utilities are organized by category:
 * - focus/collection: Component collection and tab index assignment
 * - focus/management: Focus state management and overlay utilities
 * - focus/navigation: Tab navigation handling
 * - input/mouse: Mouse event handling and drag state
 */

// Re-export focus collection utilities
export {
  collectInteractiveComponents,
  assignTabIndexes,
} from './focus/collection';

// Re-export focus management utilities
export {
  findAllOverlays,
  findTopmostOverlay,
  focusComponent,
  enableComponent,
  disableComponent,
} from './focus/management';

// Re-export tab navigation utilities
export {
  handleTabNavigation,
} from './focus/navigation';

// Re-export mouse event handling
export {
  handleMouseEvent,
} from './input/mouse';
