/**
 * App header section for help display
 */

import { type ReactNode } from 'react';
import { Text } from '../../../components/primitives/Text';

export interface AppHeaderProps {
  appName?: string;
  appVersion?: string;
  appDescription?: string;
}

/**
 * App header section component
 * Displays application name, version, and description
 */
export function AppHeader({ appName, appVersion, appDescription }: AppHeaderProps): ReactNode {
  return (
    <>
      {appName && (
        <>
          <Text>
            {appName}
            {appVersion && <> v{appVersion}</>}
          </Text>
          <Text></Text>
        </>
      )}

      {appDescription && (
        <>
          <Text>{appDescription}</Text>
          <Text></Text>
        </>
      )}
    </>
  );
}
