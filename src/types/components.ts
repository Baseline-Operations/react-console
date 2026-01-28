/**
 * Component-related type definitions
 * Types for component props and node structures
 */

import type { ResponsiveSize, InputType } from './core';
import type { StyleProps, ViewStyle, TextStyle, LayoutProps } from './styles';
import type { MouseEvent, KeyboardEvent, InputEvent } from './events';

/**
 * Shared option type for Radio, Checkbox, Dropdown, and List components
 */
export interface SelectOption {
  label: string;
  value: string | number;
}

export interface ConsoleNode {
  type: 'text' | 'box' | 'fragment' | 'newline' | 'linebreak' | 'input' | 'button' | 'scrollable' | 'scrollview' | 'overlay' | 'radio' | 'checkbox' | 'dropdown' | 'list';
  customType?: string; // For custom registered components
  content?: string;
  styles?: StyleProps; // Legacy - use style prop instead
  style?: ViewStyle | TextStyle; // CSS-like style object (similar to React Native)
  layout?: LayoutProps; // Legacy - use style prop instead
  children?: ConsoleNode[];
  x?: number; // Calculated position (internal)
  y?: number; // Calculated position (internal)
  width?: ResponsiveSize;
  height?: ResponsiveSize;
  // Interactive props
  value?: string | number | boolean | string[] | number[]; // Value can be string, number, boolean, or array (for multi-select)
  defaultValue?: string | number | boolean | string[] | number[];
  placeholder?: string;
  focused?: boolean;
  disabled?: boolean;
  mask?: string;
  maxLength?: number;
  maxWidth?: number; // Maximum input width (defaults to terminal width)
  multiline?: boolean; // Allow multiline input
  maxLines?: number; // Maximum number of lines for multiline input (defaults to terminal height)
  autoFocus?: boolean;
  tabIndex?: number; // Tab order (0 = first, negative = not focusable, auto-assigned if not set)
  // Input type and validation
  inputType?: InputType; // Type of input (text, number, radio, checkbox, dropdown, list)
  // Number input specific
  step?: number; // Step value for number input
  min?: number; // Minimum value for number input
  max?: number; // Maximum value for number input
  allowDecimals?: boolean; // Allow decimal numbers
  decimalPlaces?: number; // Number of decimal places to enforce (e.g., 2 for currency)
  // Formatting
  formatDisplay?: (value: string | number | boolean) => string; // Format function for display (doesn't change actual value)
  formatValue?: (value: string | number | boolean) => string | number; // Format function for actual value
  // Validation
  pattern?: string | RegExp; // Regex pattern for validation
  validationError?: string; // Validation error message (set by component handler)
  invalid?: boolean; // Visual indicator for invalid input (for styling)
  // Radio/Checkbox/Dropdown/List specific
  options?: Array<{ label: string; value: string | number }>; // Options for radio, checkbox, dropdown, list
  selected?: string | number | string[]; // Selected value(s) for radio, checkbox, dropdown, list
  multiple?: boolean; // Allow multiple selection (for dropdown/list)
  name?: string; // Name for radio groups
  // Display formatting
  displayFormat?: string; // Format string for display (e.g., "currency", "percentage", "date", "bullet", "checkmark")
  // Event handlers
  onClick?: (event: MouseEvent) => void;
  onPress?: (event: MouseEvent) => void;
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
  // Scrollable props
  scrollTop?: number;
  scrollLeft?: number;
  maxHeight?: number; // Used by Scrollable and other components
  // Note: maxWidth above is also used for Input component
  // Scrollbar props (for Box/View components)
  scrollable?: boolean; // Enable/disable scrolling for Box/View
  scrollbarVisibility?: 'auto' | 'always' | 'hidden'; // Scrollbar visibility mode ('auto' = show when scrolling, 'always' = always show, 'hidden' = never show)
  horizontalScrollbar?: 'auto' | 'always' | 'hidden'; // Horizontal scrollbar visibility (overrides scrollbarVisibility if set)
  verticalScrollbar?: 'auto' | 'always' | 'hidden'; // Vertical scrollbar visibility (overrides scrollbarVisibility if set)
  scrollbarChar?: string; // Character to use for scrollbar thumb (default: '█')
  scrollbarTrackChar?: string; // Character to use for scrollbar track (default: '░')
  // Overlay props
  zIndex?: number;
  backdrop?: boolean;
  backdropColor?: string;
  // Fullscreen props
  fullscreen?: boolean;
  // Internal component state (for selection components)
  // These are managed by the component handlers and renderer
  focusedIndex?: number; // Focused option index for radio/checkbox/dropdown/list
  isOpen?: boolean; // Open/closed state for dropdown
}
