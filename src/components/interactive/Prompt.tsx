/**
 * Prompt component - Question/answer prompts with validation
 */

import { useState, useEffect } from 'react';
import { createConsoleNode, mergeClassNameAndStyle } from '../utils';
import type { StyleProps, ViewStyle, TextStyle, InputEvent } from '../../types';

export interface PromptProps extends StyleProps {
  /** Question text to display */
  question: string;
  /** Default value for the input */
  defaultValue?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Validation function - returns error message if invalid, undefined if valid */
  validate?: (value: string) => string | undefined;
  /** Callback when prompt is submitted (Enter key) */
  onSubmit?: (value: string) => void;
  /** Callback when prompt is cancelled (Escape key) */
  onCancel?: () => void;
  /** Whether the prompt is required (non-empty) */
  required?: boolean;
  /** Input type (text, password, number, etc.) */
  type?: 'text' | 'password' | 'number' | 'email';
  /** Mask character for password inputs */
  mask?: string;
  /** Maximum length */
  maxLength?: number;
  /** Custom styling */
  style?: ViewStyle;
  /** Question text styling */
  questionStyle?: TextStyle;
  /** Input styling */
  inputStyle?: ViewStyle;
  /** Error message styling */
  errorStyle?: TextStyle;
  /** Show validation errors */
  showErrors?: boolean;
}

/**
 * Prompt component - Question/answer prompts with validation
 *
 * Displays a question and an input field. Validates input and shows errors.
 * Supports Enter to submit, Escape to cancel.
 *
 * @example
 * ```tsx
 * <Prompt
 *   question="Enter your name:"
 *   validate={(value) => value.length < 3 ? "Name must be at least 3 characters" : undefined}
 *   onSubmit={(value) => console.log(`Hello, ${value}!`)}
 *   required
 * />
 * ```
 */
export function Prompt({
  question,
  defaultValue = '',
  placeholder,
  validate,
  onSubmit,
  onCancel,
  required = false,
  type = 'text',
  mask,
  maxLength,
  questionStyle,
  inputStyle,
  errorStyle,
  showErrors = true,
  className,
  style: promptStyle,
}: PromptProps) {
  // Merge className with style prop
  const mergedStyle = mergeClassNameAndStyle(className, promptStyle) as ViewStyle;
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState<string | undefined>(undefined);
  const [touched, setTouched] = useState(false);

  // Validate on value change
  useEffect(() => {
    if (touched || value !== defaultValue) {
      if (required && !value.trim()) {
        setError('This field is required');
      } else if (validate) {
        setError(validate(value));
      } else {
        setError(undefined);
      }
    }
  }, [value, required, validate, touched, defaultValue]);

  const handleChange = (event: InputEvent) => {
    const newValue = String(event.value);
    setValue(newValue);
    setTouched(true);
  };

  const handleSubmit = (event: InputEvent) => {
    const submitValue = String(event.value);

    // Final validation
    if (required && !submitValue.trim()) {
      setError('This field is required');
      setTouched(true);
      return;
    }

    if (validate) {
      const validationError = validate(submitValue);
      if (validationError) {
        setError(validationError);
        setTouched(true);
        return;
      }
    }

    // Valid - submit
    setError(undefined);
    onSubmit?.(submitValue);
  };

  const handleKeyDown = (event: { key: { escape: boolean } }) => {
    if (event.key.escape) {
      onCancel?.();
    }
  };

  return createConsoleNode('box', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      ...mergedStyle,
    },
    children: [
      createConsoleNode('text', {
        content: question,
        style: {
          color: questionStyle?.color || 'white',
          bold: questionStyle?.bold ?? true,
          ...questionStyle,
        },
      }),
      createConsoleNode('textinput', {
        inputType: type === 'number' ? 'number' : 'text',
        value,
        placeholder,
        mask: type === 'password' ? mask || '•' : undefined,
        secureTextEntry: type === 'password',
        maxLength,
        invalid: !!error && touched,
        validationError: error && touched ? error : undefined,
        onChange: handleChange,
        onSubmit: handleSubmit,
        onKeyDown: handleKeyDown,
        autoFocus: true,
        style: inputStyle,
      }),
      ...(error && touched && showErrors
        ? [
            createConsoleNode('text', {
              content: `⚠ ${error}`,
              style: {
                color: errorStyle?.color || 'red',
                dim: errorStyle?.dim ?? true,
                ...errorStyle,
              },
            }),
          ]
        : []),
    ],
  });
}
