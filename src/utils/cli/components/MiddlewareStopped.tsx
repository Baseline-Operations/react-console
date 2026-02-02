/**
 * MiddlewareStopped - Component for displaying middleware-stopped execution message
 * Renders message when command execution is stopped by middleware
 */

import { type ReactNode } from 'react';
import { Text } from '../../../components/primitives/Text';
import { Box } from '../../../components/primitives/Box';
import type { StyleProps } from '../../../types';

export interface MiddlewareStoppedProps extends StyleProps {
  /** Optional custom message */
  message?: string;
}

/**
 * MiddlewareStopped component
 * Displays message when command execution is stopped by middleware
 *
 * @example
 * ```tsx
 * <MiddlewareStopped message="Command execution was stopped by middleware" />
 * ```
 */
export function MiddlewareStopped({
  message = 'Command execution stopped by middleware.',
}: MiddlewareStoppedProps): ReactNode {
  return (
    <Box style={{ padding: 1 }}>
      <Text style={{ color: 'yellow' }}>{message}</Text>
    </Box>
  );
}
