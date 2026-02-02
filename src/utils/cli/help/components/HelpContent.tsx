/**
 * Main help content component
 * Composes all help sections together
 */

import { type ReactNode } from 'react';
import { AppHeader } from '../sections/AppHeader';
import { CommandsSection } from '../sections/CommandsSection';
import { DefaultSection } from '../sections/DefaultSection';
import { UsageSection } from '../sections/UsageSection';
import { OptionsSection } from '../sections/OptionsSection';
import { collectCommandOptions, isHelpAvailable } from '../../optionCollector';
import type { ComponentMetadata } from '../types';
import type { HelpOptions } from '../types';
import type { ParsedArgs } from '../../parser';
import type { CommandOption } from '../../../../components/cli/Command';

export interface HelpContentProps {
  metadata: ComponentMetadata[];
  appName?: string;
  appVersion?: string;
  appDescription?: string;
  options?: HelpOptions;
  parsedArgs?: ParsedArgs;
  routerOptions?: Record<string, CommandOption>;
  routerNoHelp?: boolean;
}

/**
 * Help content component
 * Main component that composes all help sections
 */
export function HelpContent({
  metadata,
  appName,
  appVersion,
  appDescription,
  options = {},
  parsedArgs,
  routerOptions,
  routerNoHelp,
}: HelpContentProps): ReactNode {
  const commands = metadata.filter((m) => m.type === 'command');
  const defaults = metadata.filter((m) => m.type === 'default');

  // Collect all options from command path + router
  const allOptions =
    parsedArgs && parsedArgs.command.length > 0
      ? collectCommandOptions(parsedArgs.command, metadata, routerOptions)
      : routerOptions || {};
  const helpAvailable = parsedArgs
    ? isHelpAvailable(parsedArgs, metadata) && !routerNoHelp
    : !routerNoHelp;

  return (
    <>
      <AppHeader appName={appName} appVersion={appVersion} appDescription={appDescription} />
      <CommandsSection commands={commands} options={options} />
      <DefaultSection defaultComponent={defaults[0]} />
      <UsageSection commands={commands} appName={appName} />
      <OptionsSection options={allOptions} helpAvailable={helpAvailable} />
    </>
  );
}
