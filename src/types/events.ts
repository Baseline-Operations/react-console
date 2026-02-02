/**
 * Event-related type definitions
 * Types for keyboard, mouse, and input events
 */

export interface KeyPress {
  name?: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
  return: boolean;
  escape: boolean;
  tab: boolean;
  backspace: boolean;
  delete: boolean;
  upArrow: boolean;
  downArrow: boolean;
  leftArrow: boolean;
  rightArrow: boolean;
  pageUp?: boolean; // Page Up key
  pageDown?: boolean; // Page Down key
  home?: boolean; // Home key
  end?: boolean; // End key
  char?: string; // Character typed (for regular keys or Ctrl+key combination name like 'c' for Ctrl+C)
}

export interface InputEvent {
  value: string | number | boolean | (string | number)[]; // Value can be different types depending on input type
  key: KeyPress;
}

export interface KeyboardEvent {
  key: KeyPress;
  preventDefault?: () => void;
  stopPropagation?: () => void;
  // Internal flag to track if propagation was stopped
  _propagationStopped?: boolean;
}

export interface MouseEvent {
  x: number;
  y: number;
  button?: number;
  ctrl?: boolean;
  shift?: boolean;
  meta?: boolean;
  // Drag event properties (set when dragging)
  isDragging?: boolean; // True if this is a drag event (not a click)
  startX?: number; // X position where drag started
  startY?: number; // Y position where drag started
  deltaX?: number; // Change in X since drag started (x - startX)
  deltaY?: number; // Change in Y since drag started (y - startY)
  // Event type indicator (for distinguishing press/move/release/wheel)
  eventType?: 'press' | 'drag' | 'release' | 'wheel';
  // Scroll wheel properties
  scrollDirection?: 'up' | 'down';
}

/**
 * Component event handlers (JSX-style)
 */
export interface ComponentEventHandlers {
  onClick?: (event: MouseEvent) => void;
  onPress?: (event: MouseEvent) => void; // React Native pattern (alias for onClick)
  onMouseDown?: (event: MouseEvent) => void;
  onMouseUp?: (event: MouseEvent) => void;
  onMouseMove?: (event: MouseEvent) => void;
  onMouseDrag?: (event: MouseEvent) => void; // Fired during mouse drag (when mouse moves while button is pressed)
  onKeyDown?: (event: KeyboardEvent) => void;
  onKeyUp?: (event: KeyboardEvent) => void;
  onKeyPress?: (event: KeyboardEvent) => void;
  onChange?: (event: InputEvent) => void;
  onSubmit?: (event: InputEvent) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}
