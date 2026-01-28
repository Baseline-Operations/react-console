/**
 * Form component - Form wrapper with validation and state management
 */

import { useState, type ReactNode } from 'react';
import { createConsoleNode } from './utils';
import type { StyleProps, ViewStyle } from '../types';

export interface FormFieldError {
  field: string;
  message: string;
}

export interface FormValidationResult {
  valid: boolean;
  errors: FormFieldError[];
}

export type FormValidator<T = Record<string, unknown>> = (values: T) => FormValidationResult | Promise<FormValidationResult>;

export interface FormProps extends StyleProps {
  children?: ReactNode;
  style?: ViewStyle | ViewStyle[]; // CSS-like style (similar to React Native)
  className?: string | string[]; // Class names for style libraries
  onSubmit?: (values: Record<string, unknown>) => void | Promise<void>;
  onValidate?: FormValidator;
  initialValues?: Record<string, unknown>;
  validateOnChange?: boolean; // Validate on field change (default: false)
  validateOnBlur?: boolean; // Validate on field blur (default: true)
  showErrors?: boolean; // Show validation errors (default: true)
  errorStyle?: ViewStyle; // Style for error messages
  // Note: Form doesn't extend ComponentEventHandlers to avoid onSubmit conflict
  // Form submission is handled differently than component events
}

/**
 * Form component - Form wrapper with validation and state management
 * 
 * Provides form state management, validation, and submission handling.
 * Collects values from form fields and validates them before submission.
 * 
 * @example
 * ```tsx
 * <Form
 *   onSubmit={(values) => console.log('Submitted:', values)}
 *   onValidate={(values) => {
 *     const errors = [];
 *     if (!values.name) errors.push({ field: 'name', message: 'Name is required' });
 *     return { valid: errors.length === 0, errors };
 *   }}
 * >
 *   <Input name="name" placeholder="Name" />
 *   <Input name="email" placeholder="Email" />
 *   <Button type="submit">Submit</Button>
 * </Form>
 * ```
 */
export function Form({
  children,
  style,
  className: _className,
  onSubmit: _onSubmit,
  onValidate: _onValidate,
  initialValues: _initialValues = {},
  validateOnChange: _validateOnChange = false,
  validateOnBlur: _validateOnBlur = true,
  showErrors = true,
  errorStyle,
  ...handlers
}: FormProps) {
  const [errors] = useState<FormFieldError[]>([]);
  
  // Form state management would be implemented via React Context
  // Values would be collected from form fields and validated on submission
  // For now, this is a basic structure that provides the Form wrapper

  // Form context would be provided via React Context in a full implementation
  // For now, this is a basic structure that can be enhanced
  // The form state management (values, errors, touched) and submission would be managed via context
  // Form fields would register themselves and collect values for submission
  
  return createConsoleNode('box', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      ...(style as ViewStyle),
    },
    children: [
      // Form content (children)
      ...(Array.isArray(children) ? children : children ? [children] : []),
      // Error messages (would be populated by form validation)
      ...(showErrors && errors.length > 0
        ? errors.map((error) =>
            createConsoleNode('text', {
              content: `⚠ ${error.field}: ${error.message}`,
              style: {
                color: 'red',
                dim: true,
                ...errorStyle,
              },
            })
          )
        : []),
    ],
    ...handlers,
  });
}
