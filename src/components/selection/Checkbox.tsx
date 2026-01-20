/**
 * Checkbox component - multiple selection
 */

import { createConsoleNode, mergeClassNameAndStyle } from '../utils';
import type { ComponentEventHandlers, SelectOption, ConsoleNode, KeyPress, ViewStyle } from '../../types';
import type { StyleProps } from '../../types';
import { isArrayValue } from '../../types/guards';

/**
 * @deprecated Use SelectOption from '../../types' instead
 */
export type CheckboxOption = SelectOption;

/**
 * Props for the Checkbox component
 * 
 * Provides multiple-selection checkbox group functionality.
 * Supports keyboard navigation (arrow keys) and toggling (Enter/Space).
 * 
 * @example
 * ```tsx
 * const [values, setValues] = useState<string[]>([]);
 * 
 * <Checkbox
 *   value={values}
 *   onChange={(e) => setValues(e.value as string[])}
 *   options={[
 *     { label: 'Option 1', value: 'opt1' },
 *     { label: 'Option 2', value: 'opt2' },
 *   ]}
 * />
 * ```
 */
export interface CheckboxProps extends ComponentEventHandlers, StyleProps {
  style?: ViewStyle | ViewStyle[]; // CSS-like style (similar to React Native)
  value?: string[] | number[]; // Selected values (array for multiple)
  defaultValue?: string[] | number[];
  options: SelectOption[]; // Options to choose from
  disabled?: boolean;
  autoFocus?: boolean;
  tabIndex?: number;
  formatDisplay?: (option: SelectOption, selected: boolean) => string; // Format function for display
  // Display formatting
  displayFormat?: string; // Format string (e.g., "square", "checkmark", "bullet")
}

/**
 * Checkbox component - Multiple selection from options
 * 
 * Provides checkbox group functionality for selecting multiple options.
 * Supports keyboard navigation (arrow keys) and toggling (Enter/Space).
 * 
 * @param props - Checkbox component props
 * @returns React element representing a checkbox group
 * 
 * @example
 * ```tsx
 * <Checkbox
 *   value={selectedItems}
 *   onChange={(e) => setSelectedItems(e.value as string[])}
 *   options={[
 *     { label: 'Item 1', value: 'item1' },
 *     { label: 'Item 2', value: 'item2' },
 *   ]}
 * />
 * ```
 */
export function Checkbox({
  value,
  defaultValue,
  options,
  disabled = false,
  autoFocus = false,
  tabIndex,
  formatDisplay,
  displayFormat,
  onChange,
  onFocus,
  onBlur,
  className,
  style,
  ...styleProps
}: CheckboxProps) {
  // Merge className with style prop and legacy style props
  const mergedStyle = mergeClassNameAndStyle(className, style, styleProps);
  return createConsoleNode('checkbox', {
    inputType: 'checkbox',
    value: value ?? defaultValue ?? [],
    defaultValue: defaultValue ?? [],
    options,
    disabled,
    autoFocus,
    tabIndex,
    formatDisplay,
    displayFormat,
    onChange,
    onFocus,
    onBlur,
    style: mergedStyle,
    styles: mergedStyle,
  });
}

/**
 * Handle input for Checkbox component
 * Arrow keys to navigate, Space to toggle
 */
export function handleCheckboxComponent(
  component: ConsoleNode,
  _chunk: string,
  key: KeyPress,
  scheduleUpdate: () => void
): void {
  const options = component.options || [];
  if (options.length === 0) return;

  const rawValue = component.value ?? component.defaultValue;
  // Use type guard to safely extract array values
  const selectedValues: (string | number)[] = isArrayValue(rawValue) ? rawValue : [];
  
  // Track focused option index (stored in component or default to 0)
  const focusedIndex = component.focusedIndex ?? 0;
  let newFocusedIndex = focusedIndex;

  if (key.upArrow || key.downArrow) {
    // Navigate options
    if (key.upArrow) {
      newFocusedIndex = focusedIndex <= 0 ? options.length - 1 : focusedIndex - 1;
    } else {
      newFocusedIndex = focusedIndex >= options.length - 1 ? 0 : focusedIndex + 1;
    }
    component.focusedIndex = newFocusedIndex;
    scheduleUpdate();
  } else if (key.return || key.char === ' ') {
    // Toggle focused option
    const option = options[focusedIndex];
    if (!option) return;

    const isSelected = selectedValues.some(v => v === option.value);
    const newSelectedValues: (string | number)[] = isSelected
      ? selectedValues.filter(v => v !== option.value)
      : [...selectedValues, option.value];

    // Type assertion needed: (string | number)[] is not assignable to string[] | number[]
    // Runtime array may contain mixed types even though type system separates them
    component.value = newSelectedValues as string[] | number[];
    
    if (component.onChange) {
      component.onChange({
        value: newSelectedValues as string[] | number[],
        key,
      });
    }
    scheduleUpdate();
  }
}
