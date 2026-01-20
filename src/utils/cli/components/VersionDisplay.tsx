/**
 * VersionDisplay - Component for displaying application version
 * Renders version information when --version or -v flag is used
 */

import { type ReactNode } from 'react';
import { Text } from '../../../components/primitives/Text';
import type { StyleProps } from '../../../types';

export interface VersionDisplayProps extends StyleProps {
  /** Application name */
  appName: string;
  /** Application version */
  version: string;
}

/**
 * VersionDisplay component
 * Displays formatted version string
 * 
 * @example
 * ```tsx
 * <VersionDisplay appName="my-app" version="1.0.0" />
 * ```
 */
export function VersionDisplay({
  appName,
  version,
  ...styleProps
}: VersionDisplayProps): ReactNode {
  return (
    <Text {...styleProps}>
      {appName} {version}
    </Text>
  );
}
