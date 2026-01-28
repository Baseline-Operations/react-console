/**
 * UnknownCommandError - Component for displaying unknown command errors
 * Renders error message with command suggestions
 */

import { type ReactNode } from 'react';
import { Text } from '../../../components/primitives/Text';
import { Box } from '../../../components/primitives/Box';
import type { StyleProps } from '../../../types';

export interface UnknownCommandErrorProps extends StyleProps {
  /** Unknown command that was attempted */
  unknownCommand: string;
  /** Full command path */
  commandPath: string[];
  /** Suggested similar commands */
  suggestions: string[];
  /** Application name (optional) */
  appName?: string;
}

/**
 * UnknownCommandError component
 * Displays unknown command error with suggestions
 * 
 * @example
 * ```tsx
 * <UnknownCommandError
 *   unknownCommand="buidl"
 *   commandPath={['buidl']}
 *   suggestions={['build']}
 *   appName="my-app"
 * />
 * ```
 */
export function UnknownCommandError({
  unknownCommand: _unknownCommand,
  commandPath,
  suggestions,
  appName,
}: UnknownCommandErrorProps): ReactNode {
  const fullCommand = commandPath.join(' ');
  const appNameOrApp = appName || 'app';

  return (
    <Box style={{ padding: 1 }}>
      <Text style={{ color: 'red' }}>Error:</Text>
      <Text>Unknown command: &apos;{fullCommand}&apos;</Text>
      <Text></Text>
      
      {suggestions.length > 0 && (
        <>
          <Text>Did you mean one of these?</Text>
          {suggestions.map((suggestion, index) => (
            <Text key={index}>  {appNameOrApp} {suggestion}</Text>
          ))}
          <Text></Text>
        </>
      )}
      
      <Text>Use &apos;{appNameOrApp} --help&apos; to see all available commands.</Text>
    </Box>
  );
}
