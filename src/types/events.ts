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
 * Press event (React Native compatible)
 */
export interface GestureResponderEvent {
  nativeEvent: {
    /** X coordinate relative to component */
    locationX: number;
    /** Y coordinate relative to component */
    locationY: number;
    /** X coordinate relative to screen/terminal */
    pageX: number;
    /** Y coordinate relative to screen/terminal */
    pageY: number;
    /** Timestamp of the event */
    timestamp: number;
    /** Unique touch identifier */
    identifier?: number;
  };
  /** Target component ID */
  target?: string | number;
  /** Current target component ID */
  currentTarget?: string | number;
}

/**
 * Layout event (React Native compatible)
 */
export interface LayoutChangeEvent {
  nativeEvent: {
    layout: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
}

/**
 * Focus event (React Native compatible)
 */
export interface NativeSyntheticEvent<T = unknown> {
  nativeEvent: T;
  target?: string | number;
  currentTarget?: string | number;
}

/**
 * Component event handlers (JSX-style)
 */
export interface ComponentEventHandlers {
  // Mouse/Press events
  onClick?: (event: MouseEvent) => void;
  onPress?: (event: GestureResponderEvent) => void; // React Native pattern
  onMouseDown?: (event: MouseEvent) => void;
  onMouseUp?: (event: MouseEvent) => void;
  onMouseMove?: (event: MouseEvent) => void;
  onMouseDrag?: (event: MouseEvent) => void; // Fired during mouse drag (when mouse moves while button is pressed)

  // React Native gesture events
  onPressIn?: (event: GestureResponderEvent) => void;
  onPressOut?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;

  // Hover events (terminal-specific, not in React Native)
  onHoverIn?: (event: GestureResponderEvent) => void;
  onHoverOut?: (event: GestureResponderEvent) => void;

  // Keyboard events
  onKeyDown?: (event: KeyboardEvent) => void;
  onKeyUp?: (event: KeyboardEvent) => void;
  onKeyPress?: (event: KeyboardEvent) => void;

  // Input events
  onChange?: (event: InputEvent) => void;
  onSubmit?: (event: InputEvent) => void;

  // Focus events
  onFocus?: (event?: NativeSyntheticEvent<{ target: number }>) => void;
  onBlur?: (event?: NativeSyntheticEvent<{ target: number }>) => void;

  // Layout event (React Native compatible)
  onLayout?: (event: LayoutChangeEvent) => void;

  // Long press configuration (React Native compatible)
  delayLongPress?: number; // Delay in ms before onLongPress fires (default: 500)
  delayPressIn?: number; // Delay in ms before onPressIn fires (default: 0)
  delayPressOut?: number; // Delay in ms before onPressOut fires (default: 0)

  // Accessibility (React Native compatible)
  disabled?: boolean;
}
