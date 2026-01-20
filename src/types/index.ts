/**
 * Type definitions for React Console
 * 
 * This file re-exports all type definitions from organized subdirectories.
 * Type definitions are organized by category:
 * - core: Fundamental types (Color, Position, InputType, etc.)
 * - styles: Style-related types (StyleProps, ViewStyle, TextStyle, etc.)
 * - events: Event-related types (KeyPress, MouseEvent, KeyboardEvent, etc.)
 * - components: Component-related types (ConsoleNode, SelectOption, etc.)
 */

// Re-export core types
export type {
  Color,
  TextStyleName,
  ResponsiveSize,
  Position,
  InputType,
  RenderMode,
  TerminalDimensions,
} from './core';

// Re-export style types
export type {
  StyleProps,
  LayoutProps,
  ViewStyle,
  TextStyle,
  TerminalStyle,
} from './styles';

// Re-export event types
export type {
  KeyPress,
  InputEvent,
  KeyboardEvent,
  MouseEvent,
  ComponentEventHandlers,
} from './events';

// Re-export component types
export type {
  SelectOption,
  ConsoleNode,
} from './components';

// Re-export handler types for convenience
export type { ComponentHandler, HandlerRegistry } from './handlers';
export { getHandler, dispatchHandler } from './handlers';

// Re-export type guards
export {
  isStringArray,
  isNumberArray,
  isArrayValue,
  isPrimitiveValue,
  isInputNode,
  isButtonNode,
  isSelectionNode,
  isMultiSelectNode,
  isInteractiveNode,
  isLayoutNode,
  isClickableNode,
} from './guards';
