/**
 * List component - scrollable list with selection
 */

import { createConsoleNode, mergeClassNameAndStyle } from '../utils';
import type {
  ComponentEventHandlers,
  SelectOption,
  ConsoleNode,
  KeyPress,
  ViewStyle,
} from '../../types';
import type { StyleProps } from '../../types';
import { getTerminalDimensions } from '../../utils/terminal';
import { isArrayValue } from '../../types/guards';

/**
 * @deprecated Use SelectOption from '../../types' instead
 */
export type ListOption = SelectOption;

/**
 * Props for the List component
 *
 * Provides scrollable list functionality for single or multiple selection.
 * Automatically scrolls to keep focused item visible. Supports keyboard
 * navigation (arrow keys, Page Up/Down, Home/End) and selection (Enter/Space).
 *
 * @example
 * ```tsx
 * const [value, setValue] = useState('option1');
 *
 * <List
 *   value={value}
 *   onChange={(e) => setValue(e.value)}
 *   options={Array.from({ length: 50 }, (_, i) => ({
 *     label: `Option ${i + 1}`,
 *     value: `option${i + 1}`,
 *   }))}
 *   style={{ height: 10 }}
 * />
 * ```
 */
export interface ListProps extends ComponentEventHandlers, StyleProps {
  style?: ViewStyle | ViewStyle[]; // CSS-like style (similar to React Native)
  value?: string | number | string[] | number[]; // Selected value(s)
  defaultValue?: string | number | string[] | number[];
  options: SelectOption[]; // Options to display
  multiple?: boolean; // Allow multiple selection
  disabled?: boolean;
  autoFocus?: boolean;
  tabIndex?: number;
  formatDisplay?: (option: SelectOption, selected: boolean, index: number) => string; // Format function for display
  // Display formatting
  displayFormat?: string; // Format string (e.g., "number", "bullet", "arrow")
}

/**
 * List component - Scrollable list with single or multiple selection
 *
 * Provides scrollable list functionality for selecting from many options.
 * Automatically handles scrolling to keep focused item visible. Supports
 * keyboard navigation (arrow keys, Page Up/Down, Home/End) and selection
 * (Enter for single, Space to toggle for multiple).
 *
 * @param props - List component props
 * @returns React element representing a scrollable list
 *
 * @example
 * ```tsx
 * <List
 *   value={selectedValue}
 *   onChange={(e) => setSelectedValue(e.value)}
 *   options={largeArrayOfOptions}
 *   multiple={false}
 *   style={{ height: 15 }}
 * />
 * ```
 */
export function List({
  value,
  defaultValue,
  options,
  multiple = false,
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
}: ListProps) {
  // Merge className with style prop and legacy style props
  const mergedStyle = mergeClassNameAndStyle(className, style, styleProps);
  return createConsoleNode('list', {
    inputType: 'list',
    value: value ?? defaultValue,
    defaultValue,
    options,
    multiple,
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
 * Handle input for List component
 * Arrow keys to navigate, Enter/Space to select
 */
export function handleListComponent(
  component: ConsoleNode,
  _chunk: string,
  key: KeyPress,
  scheduleUpdate: () => void
): void {
  const options = component.options || [];
  if (options.length === 0) return;

  const scrollTop = component.scrollTop || 0;
  const focusedIndex = component.focusedIndex ?? (scrollTop >= 0 ? scrollTop : 0);
  let newFocusedIndex = focusedIndex;
  let newScrollTop = scrollTop;

  // Get terminal dimensions for scroll calculation
  const dims = getTerminalDimensions();
  // Use a more reasonable visible height (account for UI overhead)
  const visibleHeight = Math.max(1, dims.rows - 2); // Reserve 2 lines for UI elements

  if (key.upArrow || key.downArrow) {
    // Navigate options
    if (key.upArrow) {
      newFocusedIndex = focusedIndex <= 0 ? options.length - 1 : focusedIndex - 1;
    } else {
      newFocusedIndex = focusedIndex >= options.length - 1 ? 0 : focusedIndex + 1;
    }

    // Improved scroll position tracking: ensure focused item is always visible
    // Scroll up if focused item is above visible area
    if (newFocusedIndex < newScrollTop) {
      newScrollTop = newFocusedIndex;
    }
    // Scroll down if focused item is below visible area
    else if (newFocusedIndex >= newScrollTop + visibleHeight) {
      newScrollTop = Math.max(0, newFocusedIndex - visibleHeight + 1);
    }

    // Ensure scrollTop doesn't exceed bounds
    newScrollTop = Math.max(0, Math.min(newScrollTop, Math.max(0, options.length - visibleHeight)));

    component.focusedIndex = newFocusedIndex;
    component.scrollTop = newScrollTop;
    scheduleUpdate();
  } else if (key.pageUp || key.pageDown) {
    // Page Up/Down: scroll by visible height
    if (key.pageUp) {
      newScrollTop = Math.max(0, scrollTop - visibleHeight);
      newFocusedIndex = newScrollTop;
    } else {
      newScrollTop = Math.min(options.length - visibleHeight, scrollTop + visibleHeight);
      newFocusedIndex = Math.min(options.length - 1, newScrollTop + visibleHeight - 1);
    }

    component.focusedIndex = newFocusedIndex;
    component.scrollTop = newScrollTop;
    scheduleUpdate();
  } else if (key.home || key.end) {
    // Home/End: jump to first/last option
    if (key.home) {
      newFocusedIndex = 0;
      newScrollTop = 0;
    } else {
      newFocusedIndex = options.length - 1;
      newScrollTop = Math.max(0, options.length - visibleHeight);
    }

    component.focusedIndex = newFocusedIndex;
    component.scrollTop = newScrollTop;
    scheduleUpdate();
  } else if (key.return || key.char === ' ') {
    // Select focused option
    const option = options[focusedIndex];
    if (!option) return;

    const newValue = component.multiple
      ? (() => {
          // Use type guard to safely extract array values
          const current: (string | number)[] = isArrayValue(component.value) ? component.value : [];
          const isSelected = current.some((v) => v === option.value);
          const result: (string | number)[] = isSelected
            ? current.filter((v) => v !== option.value)
            : [...current, option.value];
          return result;
        })()
      : option.value;

    // Type assertion needed: (string | number)[] is not assignable to string[] | number[]
    // Runtime array may contain mixed types even though type system separates them
    component.value = newValue as string | number | string[] | number[] | undefined;

    if (component.onChange) {
      component.onChange({
        value: newValue as string | number | string[] | number[],
        key,
      });
    }
    scheduleUpdate();
  }
}
