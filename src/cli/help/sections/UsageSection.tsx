/**
 * Usage section for help display
 */

import { type ReactNode } from 'react';
import { Text } from '../../../components/primitives/Text';
import type { ComponentMetadata } from '../types';

export interface UsageSectionProps {
  commands: ComponentMetadata[];
  appName?: string;
}

/**
 * Usage section component
 * Displays usage examples for commands
 */
export function UsageSection({ commands, appName }: UsageSectionProps): ReactNode {
  if (commands.length === 0) {
    return null;
  }

  return (
    <>
      <Text>Usage:</Text>
      {commands.length > 0 && commands[0]?.name && (
        <Text>
          {'  '}
          {appName || 'app'} {commands[0].name} [options]
        </Text>
      )}
      <Text></Text>
      <Text>For more information on a specific command, use:</Text>
      <Text>
        {'  '}
        {appName || 'app'} &lt;command&gt; --help
      </Text>
      <Text></Text>
    </>
  );
}
