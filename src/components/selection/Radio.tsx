/**
 * Radio component - single selection from options
 */

import { createConsoleNode, mergeClassNameAndStyle } from '../utils';
import type { ComponentEventHandlers, SelectOption, ConsoleNode, KeyPress, ViewStyle } from '../../types';
import type { StyleProps } from '../../types';

/**
 * @deprecated Use SelectOption from '../../types' instead
 */
export type RadioOption = SelectOption;

/**
 * Props for the Radio component
 * 
 * Provides single-selection radio button group functionality.
 * Supports keyboard navigation (arrow keys) and selection (Enter/Space).
 * 
 * @example
 * ```tsx
 * const [value, setValue] = useState('option1');
 * 
 * <Radio
 *   name="choice"
 *   value={value}
 *   onChange={(e) => setValue(e.value)}
 *   options={[
 *     { label: 'Option 1', value: 'option1' },
 *     { label: 'Option 2', value: 'option2' },
 *   ]}
 * />
 * ```
 */
export interface RadioProps extends ComponentEventHandlers, StyleProps {
  style?: ViewStyle | ViewStyle[]; // CSS-like style (similar to React Native)
  name?: string; // Radio group name
  value?: string | number; // Selected value
  defaultValue?: string | number;
  options: SelectOption[]; // Options to choose from
  disabled?: boolean;
  autoFocus?: boolean;
  tabIndex?: number;
  formatDisplay?: (option: SelectOption, selected: boolean) => string; // Format function for display
  // Display formatting
  displayFormat?: string; // Format string (e.g., "bullet", "number", "letter")
}

/**
 * Radio component - Single selection from options
 * 
 * Provides radio button group functionality for selecting one option from a list.
 * Supports keyboard navigation (arrow keys) and selection (Enter/Space).
 * 
 * @param props - Radio component props
 * @returns React element representing a radio button group
 * 
 * @example
 * ```tsx
 * <Radio
 *   name="theme"
 *   value={selectedTheme}
 *   onChange={(e) => setSelectedTheme(e.value)}
 *   options={[
 *     { label: 'Light', value: 'light' },
 *     { label: 'Dark', value: 'dark' },
 *   ]}
 * />
 * ```
 */
export function Radio({
  name,
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
}: RadioProps) {
  // Merge className with style prop and legacy style props
  const mergedStyle = mergeClassNameAndStyle(className, style, styleProps);
  return createConsoleNode('radio', {
    inputType: 'radio',
    name,
    value: value ?? defaultValue,
    defaultValue,
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
 * Handle input for Radio component
 * Arrow keys to navigate, Enter/Space to select
 */
export function handleRadioComponent(
  component: ConsoleNode,
  _chunk: string,
  key: KeyPress,
  scheduleUpdate: () => void
): void {
  const options = component.options || [];
  if (options.length === 0) return;

  const currentValue = component.value ?? component.defaultValue;
  const currentIndex = options.findIndex(opt => opt.value === currentValue);
  let newIndex = currentIndex;

  if (key.upArrow || key.downArrow) {
    // Navigate options
    if (key.upArrow) {
      newIndex = currentIndex <= 0 ? options.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex >= options.length - 1 ? 0 : currentIndex + 1;
    }
    
    const newValue = options[newIndex]!.value;
    component.value = newValue;
    
    if (component.onChange) {
      component.onChange({
        value: newValue,
        key,
      });
    }
    scheduleUpdate();
  } else if (key.return || key.char === ' ') {
    // Select current option
    const selectedValue = options[currentIndex >= 0 ? currentIndex : 0]!.value;
    component.value = selectedValue;
    
    if (component.onChange) {
      component.onChange({
        value: selectedValue,
        key,
      });
    }
    scheduleUpdate();
  }
}
