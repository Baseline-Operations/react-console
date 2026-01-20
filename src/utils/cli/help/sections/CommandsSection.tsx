/**
 * Commands section for help display
 */

import { type ReactNode, Fragment } from 'react';
import { Text } from '../../../../components/primitives/Text';
import { CommandHelp } from '../components/CommandHelp';
import type { ComponentMetadata } from '../types';
import type { HelpOptions } from '../types';

export interface CommandsSectionProps {
  commands: ComponentMetadata[];
  options?: HelpOptions;
}

/**
 * Commands section component
 * Displays all available commands
 */
export function CommandsSection({
  commands,
  options = {},
}: CommandsSectionProps): ReactNode {
  if (commands.length === 0) {
    return null;
  }

  return (
    <>
      <Text>Commands:</Text>
      <Text></Text>
      {commands.map((cmd, index) => (
        <Fragment key={index}>
          <CommandHelp metadata={cmd} options={options} depth={0} />
          <Text></Text>
        </Fragment>
      ))}
    </>
  );
}
