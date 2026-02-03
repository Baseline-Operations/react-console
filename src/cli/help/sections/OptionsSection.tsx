/**
 * Options section for help display
 * Shows all available options (from router and command path) plus help flag
 */

import { type ReactNode } from 'react';
import { Text } from '../../../components/primitives/Text';
import type { CommandOption } from '../../components/Command';

export interface OptionsSectionProps {
  options: Record<string, CommandOption>;
  helpAvailable: boolean;
}

/**
 * Options section component
 * Displays all available options with their parameters, aliases, defaults, and descriptions
 */
export function OptionsSection({ options, helpAvailable }: OptionsSectionProps): ReactNode {
  const hasOptions = Object.keys(options).length > 0 || helpAvailable;

  if (!hasOptions) {
    return null;
  }

  return (
    <>
      <Text>Options:</Text>
      {Object.entries(options).map(([name, opt], index) => (
        <Text key={index}>
          {'  '}
          --{name}
          {opt.aliases && opt.aliases.length > 0 && <>, -{opt.aliases.join(', -')}</>}
          {opt.type !== 'boolean' && <> &lt;{opt.type}&gt;</>}
          {opt.default !== undefined && <> (default: {String(opt.default)})</>}
          {opt.description && <> - {opt.description}</>}
        </Text>
      ))}
      {helpAvailable && <Text> --help, -h Show this help message</Text>}
    </>
  );
}
