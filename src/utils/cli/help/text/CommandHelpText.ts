/**
 * Command help text generation (for string output)
 */

import type { ComponentMetadata } from '../types';
import type { HelpOptions } from '../types';

/**
 * Generate command help text (functional approach)
 */
export function generateCommandHelpText(
  metadata: ComponentMetadata,
  options: HelpOptions = {},
  depth: number = 0
): string[] {
  if (!metadata.name || metadata.type !== 'command') {
    return [];
  }

  const indent = '  '.repeat(depth);
  const commands = metadata.children?.filter((c) => c.type === 'command') || [];
  const defaults = metadata.children?.filter((c) => c.type === 'default') || [];
  const showNested = depth < (options.maxDepth ?? 10);
  const hasParams = metadata.params && metadata.params.length > 0;
  const hasOptions = metadata.options && Object.keys(metadata.options).length > 0;

  const commandLine = [
    metadata.name,
    options.showAliases && metadata.aliases && metadata.aliases.length > 0
      ? ` (aliases: ${metadata.aliases.join(', ')})`
      : '',
    options.showPaths && metadata.path ? ` [path: ${metadata.path}]` : '',
  ].join('');

  return [
    `${indent}${commandLine}`,
    ...(metadata.description ? [`${indent}  ${metadata.description}`] : []),
    ...(hasParams
      ? [
          `${indent}  Parameters:`,
          ...metadata.params!.flatMap((param) => [
            `${indent}    ${param.required ? '<' : '['}${param.name}:${param.type}${param.required ? '>' : ']'}${
              param.description ? ` - ${param.description}` : ''
            }`,
          ]),
        ]
      : []),
    ...(hasOptions
      ? [
          `${indent}  Options:`,
          ...Object.entries(metadata.options!).flatMap(([name, opt]) => [
            `${indent}    --${name}${
              opt.aliases && opt.aliases.length > 0 ? `, -${opt.aliases.join(', -')}` : ''
            }${opt.type !== 'boolean' ? ` <${opt.type}>` : ''}${
              opt.default !== undefined ? ` (default: ${String(opt.default)})` : ''
            }${opt.description ? ` - ${opt.description}` : ''}`,
          ]),
        ]
      : []),
    ...(showNested && commands.length > 0
      ? [
          `${indent}  Subcommands:`,
          ...commands.flatMap((cmd) => generateCommandHelpText(cmd, options, depth + 2)),
        ]
      : []),
    ...(showNested && defaults.length > 0 && defaults[0]?.description
      ? [`${indent}  Default: ${defaults[0].description}`]
      : []),
  ];
}
