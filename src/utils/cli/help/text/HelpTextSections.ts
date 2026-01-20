/**
 * Help text section builders (for string output)
 * Functional composition approach for building help text
 */

import type { ComponentMetadata } from '../types';
import type { HelpOptions } from '../types';
import type { ParsedArgs } from '../../parser';
import type { CommandOption } from '../../../../components/cli/Command';
import { generateCommandHelpText } from './CommandHelpText';
import { collectCommandOptions, isHelpAvailable } from '../../optionCollector';

/**
 * Build app header section text
 */
export function buildAppHeaderText(
  appName?: string,
  appVersion?: string
): string[] {
  return appName ? [`${appName}${appVersion ? ` v${appVersion}` : ''}`, ''] : [];
}

/**
 * Build app description section text
 */
export function buildAppDescriptionText(appDescription?: string): string[] {
  return appDescription ? [appDescription, ''] : [];
}

/**
 * Build commands section text
 */
export function buildCommandsSectionText(
  commands: ComponentMetadata[],
  options: HelpOptions = {}
): string[] {
  return commands.length > 0 
    ? ['Commands:', '', ...commands.flatMap((cmd) => [...generateCommandHelpText(cmd, options, 0), ''])]
    : [];
}


/**
 * Build default section text
 */
export function buildDefaultSectionText(defaultComponent?: ComponentMetadata): string[] {
  return defaultComponent?.description
    ? ['Default:', `  ${defaultComponent.description}`, '']
    : [];
}

/**
 * Build usage section text
 */
export function buildUsageSectionText(
  commands: ComponentMetadata[],
  appName?: string
): string[] {
  return commands.length > 0
    ? [
        'Usage:',
        ...(commands.length > 0 && commands[0]?.name ? [`  ${appName || 'app'} ${commands[0].name} [options]`] : []),
        '',
        'For more information on a specific command, use:',
        `  ${appName || 'app'} <command> --help`,
        '',
      ]
    : [];
}

/**
 * Build options section text
 */
export function buildOptionsSectionText(
  allOptions: Record<string, CommandOption>,
  helpAvailable: boolean
): string[] {
  return (Object.keys(allOptions).length > 0 || helpAvailable)
    ? [
        'Options:',
        ...Object.entries(allOptions).map(([name, opt]) => {
          return `  --${name}${
            opt.aliases && opt.aliases.length > 0 ? `, -${opt.aliases.join(', -')}` : ''
          }${opt.type !== 'boolean' ? ` <${opt.type}>` : ''}${
            opt.default !== undefined ? ` (default: ${String(opt.default)})` : ''
          }${opt.description ? ` - ${opt.description}` : ''}`;
        }),
        ...(helpAvailable ? ['  --help, -h    Show this help message'] : []),
      ]
    : [];
}

/**
 * Build complete help text from all sections
 */
export function buildHelpText(
  metadata: ComponentMetadata[],
  appName?: string,
  appVersion?: string,
  appDescription?: string,
  options: HelpOptions = {},
  parsedArgs?: ParsedArgs,
  routerOptions?: Record<string, CommandOption>,
  routerNoHelp?: boolean
): string {
  const commands = metadata.filter(m => m.type === 'command');
  const defaults = metadata.filter(m => m.type === 'default');
  
  // Collect all options from command path + router
  const allOptions = parsedArgs && parsedArgs.command.length > 0
    ? collectCommandOptions(parsedArgs.command, metadata, routerOptions)
    : routerOptions || {};
  const helpAvailable = parsedArgs
    ? isHelpAvailable(parsedArgs, metadata) && !routerNoHelp
    : !routerNoHelp;

  // Compose all sections together functionally
  return [
    ...buildAppHeaderText(appName, appVersion),
    ...buildAppDescriptionText(appDescription),
    ...buildCommandsSectionText(commands, options),
    ...buildDefaultSectionText(defaults[0]),
    ...buildUsageSectionText(commands, appName),
    ...buildOptionsSectionText(allOptions, helpAvailable),
  ].join('\n');
}
