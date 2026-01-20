/**
 * ValidationError - Component for displaying parameter validation errors
 * Renders validation error messages in a user-friendly format
 */

import { type ReactNode } from 'react';
import { Text } from '../../../components/primitives/Text';
import { Box } from '../../../components/primitives/Box';
import type { StyleProps } from '../../../types';
import type { ParamValidationError } from '../paramValidator';

export interface ValidationErrorProps extends StyleProps {
  /** Validation errors to display */
  errors: ParamValidationError[];
  /** Show help suggestion (default: true) */
  showHelpSuggestion?: boolean;
}

/**
 * ValidationError component
 * Displays validation errors with helpful messages
 * 
 * @example
 * ```tsx
 * <ValidationError errors={validationResult.errors} />
 * ```
 */
export function ValidationError({
  errors,
  showHelpSuggestion = true,
}: ValidationErrorProps): ReactNode {
  if (errors.length === 0) {
    return null;
  }

  return (
    <Box style={{ padding: 1 }}>
      <Text style={{ color: 'red' }}>Error:</Text>
      {errors.map((error, index) => (
        <Text key={index}>{error.message}</Text>
      ))}
      {showHelpSuggestion && (
        <>
          <Text></Text>
          <Text>Use --help for more information.</Text>
        </>
      )}
    </Box>
  );
}
