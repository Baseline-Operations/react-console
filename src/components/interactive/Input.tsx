/**
 * Input component - text input field with JSX-style event handlers
 * React Native-like pattern for terminal
 */

import type { ComponentEventHandlers, ConsoleNode, KeyPress, ViewStyle } from '../../types';
import type { StyleProps } from '../../types';
import { createConsoleNode, mergeClassNameAndStyle } from '../utils';
import { validateNumberInput } from '../../utils/input';
import { getTerminalDimensions } from '../../utils/terminal';
import {
  handleCharacterDeletion,
  handleCharacterInput,
  convertToTypedValue,
  createInputEvent,
} from './inputHelpers';

/**
 * Input type - determines the behavior and validation of the input field
 */
export type InputType = 'text' | 'string' | 'number' | 'radio' | 'checkbox' | 'dropdown' | 'list';

/**
 * Props for the Input component
 *
 * Supports multiple input types (text, number) with validation, formatting, and multiline support.
 * All event handlers use JSX-style event objects similar to React Native.
 *
 * @example
 * ```tsx
 * // Text input
 * <Input
 *   value={name}
 *   onChange={(e) => setName(e.value)}
 *   placeholder="Enter your name"
 *   maxLength={50}
 * />
 *
 * // Number input with validation
 * <Input
 *   type="number"
 *   value={age}
 *   onChange={(e) => setAge(e.value)}
 *   min={18}
 *   max={120}
 *   step={1}
 *   allowDecimals={false}
 * />
 *
 * // Currency input with formatting
 * <Input
 *   type="number"
 *   value={price}
 *   onChange={(e) => setPrice(e.value)}
 *   formatDisplay={(v) => `$${v.toFixed(2)}`}
 *   decimalPlaces={2}
 * />
 *
 * // Multiline input
 * <Input
 *   multiline
 *   maxLines={5}
 *   value={description}
 *   onChange={(e) => setDescription(e.value)}
 * />
 * ```
 */
export interface InputProps extends ComponentEventHandlers, StyleProps {
  style?: ViewStyle | ViewStyle[]; // CSS-like style (similar to React Native)
  type?: InputType; // Input type (defaults to 'text')
  value?: string | number; // Value for text/number inputs
  defaultValue?: string | number; // Default value
  placeholder?: string;
  disabled?: boolean;
  mask?: string; // Character to mask input (e.g., '*' for password)
  maxLength?: number; // Maximum total character length
  maxWidth?: number; // Maximum input width (defaults to terminal width minus padding)
  multiline?: boolean; // Allow multiline input
  maxLines?: number; // Maximum number of lines for multiline input (defaults to available terminal height)
  autoFocus?: boolean;
  tabIndex?: number; // Tab order (auto-assigned if not set)
  // Number input specific
  step?: number; // Step value for number input (e.g., 0.1, 1, 10)
  min?: number; // Minimum value
  max?: number; // Maximum value
  allowDecimals?: boolean; // Allow decimal numbers (default: true for number type)
  decimalPlaces?: number; // Number of decimal places to enforce (e.g., 2 for currency)
  // Formatting
  formatDisplay?: (value: string | number) => string; // Format function for display (doesn't change actual value)
  formatValue?: (value: string | number) => string | number; // Format function for actual value
  // Validation
  pattern?: string | RegExp; // Regex pattern for validation
  // Display formatting
  displayFormat?: string; // Format string for display (e.g., "currency", "percentage", "date")
  // Submit behavior
  submitButtonId?: string; // ID of button to trigger on Enter (if not set, Enter doesn't trigger any button)
}

/**
 * Input component - Text input field with validation and formatting support
 *
 * Provides controlled/uncontrolled input similar to React Native's TextInput.
 * Supports text and number types with validation, formatting, multiline input,
 * and all standard event handlers (onChange, onKeyDown, onSubmit, etc.).
 *
 * @param props - Input component props
 * @returns React element representing an input field
 *
 * @example
 * ```tsx
 * const [value, setValue] = useState('');
 *
 * <Input
 *   value={value}
 *   onChange={(event) => setValue(event.value)}
 *   onKeyDown={(event) => {
 *     if (event.key.return) {
 *       handleSubmit();
 *     }
 *   }}
 *   placeholder="Type here..."
 *   autoFocus
 * />
 * ```
 */
export function Input({
  type = 'text',
  value,
  defaultValue,
  placeholder = '',
  disabled = false,
  mask,
  maxLength,
  maxWidth,
  multiline = false,
  maxLines,
  autoFocus = false,
  tabIndex,
  step,
  min,
  max,
  allowDecimals,
  decimalPlaces,
  formatDisplay,
  formatValue,
  pattern,
  displayFormat,
  submitButtonId,
  onChange,
  onKeyDown,
  onKeyUp,
  onKeyPress,
  onSubmit,
  onFocus,
  onBlur,
  className,
  style,
  ...styleProps
}: InputProps) {
  // Merge className with style prop and legacy style props
  const mergedStyle = mergeClassNameAndStyle(className, style, styleProps);

  // Input is handled by the reconciler - we just pass props through
  // The renderer will manage the actual input state and call event handlers
  return createConsoleNode('input', {
    inputType: type,
    value,
    defaultValue,
    placeholder,
    disabled,
    mask,
    maxLength,
    maxWidth,
    multiline,
    maxLines,
    autoFocus,
    tabIndex,
    step,
    min,
    max,
    allowDecimals,
    decimalPlaces,
    formatDisplay,
    formatValue,
    pattern,
    displayFormat,
    submitButtonId,
    onChange,
    onKeyDown,
    onKeyUp,
    onKeyPress,
    onSubmit,
    onFocus,
    onBlur,
    style: mergedStyle,
    styles: mergedStyle,
  });
}

/**
 * Handle input for Input component
 * Handles text/number input with validation and multiline support
 */
export function handleInputComponent(
  component: ConsoleNode,
  _chunk: string,
  key: KeyPress,
  scheduleUpdate: () => void
): void {
  // Handle input component
  const keyboardEvent = {
    key,
    preventDefault: () => {},
    stopPropagation: () => {},
  };

  // Call key events first
  if (component.onKeyDown) {
    component.onKeyDown(keyboardEvent);
  }

  if (component.onKeyPress) {
    component.onKeyPress(keyboardEvent);
  }

  if (component.onKeyUp) {
    component.onKeyUp(keyboardEvent);
  }

  // Ignore Page Up/Down/Home/End keys for text input (these should not affect input text)
  // These keys are handled by selection components (List, Dropdown) for scrolling
  if (key.pageUp || key.pageDown || key.home || key.end) {
    // These keys should not modify input value, just return early
    // They may still trigger onKeyDown/onKeyUp handlers above if user wants custom behavior
    return;
  }

  // Handle value changes
  const currentValue = component.value ?? component.defaultValue ?? '';
  const currentValueStr = typeof currentValue === 'string' ? currentValue : String(currentValue);
  let newValue: string | number | boolean | (string | number)[] = currentValue;
  let newValueStr = currentValueStr;
  let valueChanged = false;

  const inputType = component.inputType || 'text';
  const isMultiline = component.multiline || false;

  // Handle character input
  if (key.char && !key.ctrl && !key.meta && key.char.length === 1) {
    const maxLength = component.maxLength;

    const inputResult = handleCharacterInput(
      currentValueStr,
      key.char,
      inputType,
      component,
      maxLength
    );

    if (!inputResult.accepted) {
      // Invalid input - set validation error and visual indicator
      component.invalid = true;
      component.validationError =
        inputType === 'number' ? 'Invalid number format' : 'Invalid input';
      scheduleUpdate();
      return;
    }

    // Clear validation error on valid input
    if (component.invalid) {
      component.invalid = false;
      component.validationError = undefined;
    }

    newValueStr = inputResult.newValueStr;
    valueChanged = true;

    // Convert back to appropriate type
    const convertedValue = convertToTypedValue(newValueStr, inputType, component);
    if (typeof convertedValue === 'string' || typeof convertedValue === 'number') {
      newValue = convertedValue;
      if (inputType === 'number' && typeof convertedValue === 'number') {
        // Get formatted display value for number inputs
        const validation = validateNumberInput(newValueStr, component);
        if (validation.valid && validation.displayValue) {
          newValueStr = validation.displayValue;
        }
      }
    }
  }

  // Handle backspace
  if (key.backspace) {
    const deletionResult = handleCharacterDeletion(
      typeof currentValue === 'string' || typeof currentValue === 'number'
        ? currentValue
        : undefined,
      currentValueStr,
      inputType,
      component
    );
    if (deletionResult.valueChanged) {
      if (
        typeof deletionResult.newValue === 'string' ||
        typeof deletionResult.newValue === 'number'
      ) {
        newValue = deletionResult.newValue;
      }
      newValueStr = deletionResult.newValueStr;
      valueChanged = true;

      // Clear validation error if value is now valid
      if (component.invalid && newValueStr) {
        // Re-validate after deletion
        if (inputType === 'number') {
          const validation = validateNumberInput(newValueStr, component);
          if (validation.valid) {
            component.invalid = false;
            component.validationError = undefined;
          }
        } else {
          // For text inputs, clear error on any deletion (could become valid)
          component.invalid = false;
          component.validationError = undefined;
        }
      }
    }
  }

  // Handle delete (same as backspace for terminal input)
  if (key.delete) {
    const deletionResult = handleCharacterDeletion(
      typeof currentValue === 'string' || typeof currentValue === 'number'
        ? currentValue
        : undefined,
      currentValueStr,
      inputType,
      component
    );
    if (deletionResult.valueChanged) {
      if (
        typeof deletionResult.newValue === 'string' ||
        typeof deletionResult.newValue === 'number'
      ) {
        newValue = deletionResult.newValue;
      }
      newValueStr = deletionResult.newValueStr;
      valueChanged = true;

      // Clear validation error if value is now valid
      if (component.invalid && newValueStr) {
        // Re-validate after deletion
        if (inputType === 'number') {
          const validation = validateNumberInput(newValueStr, component);
          if (validation.valid) {
            component.invalid = false;
            component.validationError = undefined;
          }
        } else {
          // For text inputs, clear error on any deletion (could become valid)
          component.invalid = false;
          component.validationError = undefined;
        }
      }
    }
  }

  // Handle Enter for multiline input
  if (key.return && isMultiline) {
    const dims = getTerminalDimensions();
    const lines = currentValueStr.split('\n');
    const maxLines = component.maxLines || dims.rows;

    // Check if we can add another line
    if (lines.length < maxLines) {
      newValueStr = currentValueStr + '\n';
      newValue = newValueStr;
      valueChanged = true;
    }
  }

  // Call onChange if value changed
  if (valueChanged && component.onChange) {
    const inputEvent = createInputEvent(newValue, key);
    component.onChange(inputEvent);
    // Update the value in the component
    component.value = newValue;
  }

  // Handle submit on Enter (single-line only)
  if (key.return && !isMultiline && component.onSubmit) {
    const inputEvent = createInputEvent(newValue, key);
    component.onSubmit(inputEvent);
  }

  // Trigger re-render if anything happened
  if (valueChanged || key.return) {
    scheduleUpdate();
  }
}
