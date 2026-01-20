/**
 * Dropdown/Select component - single or multiple selection dropdown
 */

import { createConsoleNode, mergeClassNameAndStyle } from '../utils';
import type { ComponentEventHandlers, SelectOption, ConsoleNode, KeyPress, ViewStyle } from '../../types';
import type { StyleProps } from '../../types';
import { isArrayValue } from '../../types/guards';

/**
 * @deprecated Use SelectOption from '../../types' instead
 */
export type DropdownOption = SelectOption;

/**
 * Props for the Dropdown component
 * 
 * Provides dropdown/select functionality for single or multiple selection.
 * Opens/closes with Space/Enter, navigates with arrow keys, selects with Enter/Space.
 * 
 * @example
 * ```tsx
 * const [value, setValue] = useState('option1');
 * 
 * <Dropdown
 *   value={value}
 *   onChange={(e) => setValue(e.value)}
 *   options={[
 *     { label: 'Option 1', value: 'option1' },
 *     { label: 'Option 2', value: 'option2' },
 *   ]}
 * />
 * ```
 */
export interface DropdownProps extends ComponentEventHandlers, StyleProps {
  style?: ViewStyle | ViewStyle[]; // CSS-like style (similar to React Native)
  value?: string | number | string[] | number[]; // Selected value(s)
  defaultValue?: string | number | string[] | number[];
  options: SelectOption[]; // Options to choose from
  multiple?: boolean; // Allow multiple selection
  disabled?: boolean;
  placeholder?: string; // Placeholder when nothing selected
  autoFocus?: boolean;
  tabIndex?: number;
  formatDisplay?: (option: SelectOption, selected: boolean) => string; // Format function for display
  // Display formatting
  displayFormat?: string; // Format string (e.g., "arrow", "select", "menu")
}

/**
 * Dropdown component - Single or multiple selection dropdown
 * 
 * Provides dropdown menu functionality with keyboard and mouse support.
 * Opens/closes with Space or Enter, navigates options with arrow keys,
 * selects with Enter/Space, closes with Escape or clicking outside.
 * 
 * @param props - Dropdown component props
 * @returns React element representing a dropdown menu
 * 
 * @example
 * ```tsx
 * <Dropdown
 *   value={selectedValue}
 *   onChange={(e) => setSelectedValue(e.value)}
 *   options={[
 *     { label: 'Apple', value: 'apple' },
 *     { label: 'Banana', value: 'banana' },
 *   ]}
 * />
 * ```
 */
export function Dropdown({
  value,
  defaultValue,
  options,
  multiple = false,
  disabled = false,
  placeholder = 'Select...',
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
}: DropdownProps) {
  // Merge className with style prop and legacy style props
  const mergedStyle = mergeClassNameAndStyle(className, style, styleProps);
  return createConsoleNode('dropdown', {
    inputType: 'dropdown',
    value: value ?? defaultValue,
    defaultValue,
    options,
    multiple,
    disabled,
    placeholder,
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
 * Handle input for Dropdown component
 * Arrow keys when open, Enter/Space to toggle/open
 */
export function handleDropdownComponent(
  component: ConsoleNode,
  _chunk: string,
  key: KeyPress,
  scheduleUpdate: () => void
): void {
  const options = component.options || [];
  if (options.length === 0) return;

  const isOpen = component.isOpen ?? false;
  const focusedIndex = component.focusedIndex ?? 0;
  let newFocusedIndex = focusedIndex;

  if (key.return || key.char === ' ') {
    // Toggle dropdown or select option
    if (isOpen) {
      const option = options[focusedIndex];
      if (option) {
        const newValue = component.multiple
          ? (() => {
              // Use type guard to safely extract array values
              const current: (string | number)[] = isArrayValue(component.value) ? component.value : [];
              const isSelected = current.some(v => v === option.value);
              const result: (string | number)[] = isSelected
                ? current.filter(v => v !== option.value)
                : [...current, option.value];
              return result;
            })()
          : option.value;
        
        // Type assertion needed: (string | number)[] is not assignable to string[] | number[]
        // Runtime array may contain mixed types even though type system separates them
        component.value = newValue as string | number | string[] | number[] | undefined;
        component.isOpen = false;
        
        if (component.onChange) {
          component.onChange({
            value: newValue as string | number | string[] | number[],
            key,
          });
        }
      }
    } else {
      component.isOpen = true;
    }
    scheduleUpdate();
  } else if (isOpen && (key.upArrow || key.downArrow)) {
    // Navigate options when open
    if (key.upArrow) {
      newFocusedIndex = focusedIndex <= 0 ? options.length - 1 : focusedIndex - 1;
    } else {
      newFocusedIndex = focusedIndex >= options.length - 1 ? 0 : focusedIndex + 1;
    }
    component.focusedIndex = newFocusedIndex;
    scheduleUpdate();
  } else if (isOpen && (key.pageUp || key.pageDown)) {
    // Page Up/Down: jump by visible height (approximate 10 options)
    const pageSize = 10;
    if (key.pageUp) {
      newFocusedIndex = Math.max(0, focusedIndex - pageSize);
    } else {
      newFocusedIndex = Math.min(options.length - 1, focusedIndex + pageSize);
    }
    component.focusedIndex = newFocusedIndex;
    scheduleUpdate();
  } else if (isOpen && (key.home || key.end)) {
    // Home/End: jump to first/last option
    if (key.home) {
      newFocusedIndex = 0;
    } else {
      newFocusedIndex = options.length - 1;
    }
    component.focusedIndex = newFocusedIndex;
    scheduleUpdate();
  } else if (isOpen && key.escape) {
    // Close dropdown
    component.isOpen = false;
    scheduleUpdate();
  }
}
