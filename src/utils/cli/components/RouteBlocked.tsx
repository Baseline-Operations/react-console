/**
 * RouteBlocked - Component for displaying route guard blocked messages
 * Renders message when route access is blocked by a guard
 */

import { type ReactNode } from 'react';
import { Text } from '../../../components/primitives/Text';
import { Box } from '../../../components/primitives/Box';
import type { StyleProps } from '../../../types';

export interface RouteBlockedProps extends StyleProps {
  /** Route path that was blocked */
  route?: string;
  /** Optional custom message */
  message?: string;
}

/**
 * RouteBlocked component
 * Displays message when route access is blocked
 *
 * @example
 * ```tsx
 * <RouteBlocked route="/admin" message="Access denied" />
 * ```
 */
export function RouteBlocked({ route, message }: RouteBlockedProps): ReactNode {
  const displayMessage =
    message || (route ? `Access to route '${route}' is blocked.` : 'Route access is blocked.');

  return (
    <Box style={{ padding: 1 }}>
      <Text style={{ color: 'red' }}>Error:</Text>
      <Text>{displayMessage}</Text>
    </Box>
  );
}
