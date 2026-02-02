/**
 * Type guards for runtime type checking
 * Provides type-safe runtime checks for ConsoleNode and value types
 */

import type { ConsoleNode, SelectOption, ViewStyle, TextStyle } from './index';

/**
 * Type guard: Check if value is a string array
 */
export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

/**
 * Type guard: Check if value is a number array
 */
export function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'number');
}

/**
 * Type guard: Check if value is an array (string[] or number[])
 */
export function isArrayValue(value: unknown): value is string[] | number[] {
  return isStringArray(value) || isNumberArray(value);
}

/**
 * Type guard: Check if value is a primitive (string, number, boolean)
 */
export function isPrimitiveValue(value: unknown): value is string | number | boolean {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
}

/**
 * Type guard: Check if node is an input component
 */
export function isInputNode(node: ConsoleNode): node is ConsoleNode & { type: 'input' } {
  return node.type === 'input';
}

/**
 * Type guard: Check if node is a button component
 */
export function isButtonNode(node: ConsoleNode): node is ConsoleNode & { type: 'button' } {
  return node.type === 'button';
}

/**
 * Type guard: Check if node is a selection component (radio, checkbox, dropdown, list)
 */
export function isSelectionNode(node: ConsoleNode): node is ConsoleNode & {
  type: 'radio' | 'checkbox' | 'dropdown' | 'list';
  options?: SelectOption[];
} {
  return (
    node.type === 'radio' ||
    node.type === 'checkbox' ||
    node.type === 'dropdown' ||
    node.type === 'list'
  );
}

/**
 * Type guard: Check if node supports multi-select (checkbox, dropdown, list with multiple)
 */
export function isMultiSelectNode(node: ConsoleNode): node is ConsoleNode & { multiple?: boolean } {
  return (
    (node.type === 'checkbox' || node.type === 'dropdown' || node.type === 'list') &&
    node.multiple === true
  );
}

/**
 * Type guard: Check if node is interactive (supports focus and input)
 */
export function isInteractiveNode(node: ConsoleNode): node is ConsoleNode & {
  type: 'input' | 'button' | 'radio' | 'checkbox' | 'dropdown' | 'list';
  focused?: boolean;
  disabled?: boolean;
  tabIndex?: number;
} {
  return (
    node.type === 'input' ||
    node.type === 'button' ||
    node.type === 'radio' ||
    node.type === 'checkbox' ||
    node.type === 'dropdown' ||
    node.type === 'list'
  );
}

/**
 * Type guard: Check if node is a layout component
 */
export function isLayoutNode(
  node: ConsoleNode
): node is ConsoleNode & { type: 'box' | 'scrollable' | 'overlay' } {
  return node.type === 'box' || node.type === 'scrollable' || node.type === 'overlay';
}

/**
 * Type guard: Check if node has click/press handlers
 */
export function isClickableNode(node: ConsoleNode): node is ConsoleNode & {
  onClick?: (event: { x: number; y: number }) => void;
  onPress?: (event: { x: number; y: number }) => void;
} {
  return !!(node.onClick || node.onPress);
}

/**
 * Type guard: Check if value is a valid SelectOption
 */
export function isSelectOption(value: unknown): value is SelectOption {
  return (
    typeof value === 'object' &&
    value !== null &&
    'label' in value &&
    'value' in value &&
    typeof (value as SelectOption).label === 'string' &&
    (typeof (value as SelectOption).value === 'string' ||
      typeof (value as SelectOption).value === 'number')
  );
}

/**
 * Type guard: Check if value is an array of SelectOptions
 */
export function isSelectOptionArray(value: unknown): value is SelectOption[] {
  return Array.isArray(value) && value.every(isSelectOption);
}

/**
 * Type guard: Check if node has options (selection component)
 */
export function hasOptions(node: ConsoleNode): node is ConsoleNode & { options: SelectOption[] } {
  return (
    isSelectionNode(node) &&
    Array.isArray(node.options) &&
    node.options.length > 0 &&
    node.options.every(isSelectOption)
  );
}

/**
 * Type guard: Check if node is a text node
 */
export function isTextNode(
  node: ConsoleNode
): node is ConsoleNode & { type: 'text'; content?: string } {
  return node.type === 'text';
}

/**
 * Type guard: Check if node is a box/container node
 */
export function isBoxNode(node: ConsoleNode): node is ConsoleNode & { type: 'box' } {
  return node.type === 'box';
}

/**
 * Type guard: Check if node has a value property
 */
export function hasValue(node: ConsoleNode): node is ConsoleNode & { value?: unknown } {
  return 'value' in node;
}

/**
 * Type guard: Check if node has a disabled property
 */
export function isDisabledNode(node: ConsoleNode): node is ConsoleNode & { disabled: boolean } {
  return isInteractiveNode(node) && node.disabled === true;
}

/**
 * Type guard: Check if node is focused
 */
export function isFocusedNode(node: ConsoleNode): node is ConsoleNode & { focused: boolean } {
  return isInteractiveNode(node) && node.focused === true;
}

/**
 * Type guard: Check if node has children
 */
export function hasChildren(node: ConsoleNode): node is ConsoleNode & { children: ConsoleNode[] } {
  return Array.isArray(node.children) && node.children.length > 0;
}

/**
 * Type guard: Check if style is a ViewStyle
 */
export function isViewStyle(style: unknown): style is ViewStyle {
  // Check if it has view-specific properties
  return (
    typeof style === 'object' && style !== null && !('textAlign' in style) // TextStyle has textAlign, ViewStyle doesn't
  );
}

/**
 * Type guard: Check if style is a TextStyle
 */
export function isTextStyle(style: unknown): style is TextStyle {
  return typeof style === 'object' && style !== null && 'textAlign' in style;
}

/**
 * Type guard: Check if value is a valid ConsoleNode
 */
export function isConsoleNode(value: unknown): value is ConsoleNode {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    typeof (value as { type: unknown }).type === 'string'
  );
}

/**
 * Type guard: Check if value is a valid color (string)
 */
export function isColor(value: unknown): value is string {
  if (typeof value !== 'string') return false;

  // Named colors
  const namedColors = [
    'black',
    'red',
    'green',
    'yellow',
    'blue',
    'magenta',
    'cyan',
    'white',
    'gray',
    'grey',
    'brightBlack',
    'brightRed',
    'brightGreen',
    'brightYellow',
    'brightBlue',
    'brightMagenta',
    'brightCyan',
    'brightWhite',
  ];
  if (namedColors.includes(value.toLowerCase())) return true;

  // Hex color (#RRGGBB or #RGB)
  if (/^#[0-9A-Fa-f]{3}$|^#[0-9A-Fa-f]{6}$/.test(value)) return true;

  // RGB color (rgb(r, g, b))
  if (/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(value)) return true;

  return false;
}

/**
 * Type assertion helper: Assert value is a specific type
 */
export function assertIsType<T>(
  value: unknown,
  guard: (val: unknown) => val is T,
  errorMessage?: string
): asserts value is T {
  if (!guard(value)) {
    throw new Error(errorMessage || `Expected value to match type guard, but it doesn't`);
  }
}

/**
 * Type assertion helper: Assert value is a ConsoleNode
 */
export function assertIsConsoleNode(
  value: unknown,
  errorMessage?: string
): asserts value is ConsoleNode {
  assertIsType(value, isConsoleNode, errorMessage || 'Expected value to be a ConsoleNode');
}

/**
 * Type assertion helper: Assert value is an array
 */
export function assertIsArray<T>(value: unknown, errorMessage?: string): asserts value is T[] {
  if (!Array.isArray(value)) {
    throw new Error(errorMessage || 'Expected value to be an array');
  }
}
