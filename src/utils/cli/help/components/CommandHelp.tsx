/**
 * Command help component
 * Displays help for a single command with its parameters, options, and subcommands
 */

import { type ReactNode } from 'react';
import { Text } from '../../../../components/primitives/Text';
import type { ComponentMetadata } from '../types';
import type { HelpOptions } from '../types';

export interface CommandHelpProps {
  metadata: ComponentMetadata;
  options?: HelpOptions;
  depth?: number;
}

/**
 * Command help component
 * Renders help information for a command including name, description, params, options, and subcommands
 */
export function CommandHelp({
  metadata,
  options = {},
  depth = 0,
}: CommandHelpProps): ReactNode {
  if (!metadata.name || metadata.type !== 'command') {
    return null;
  }

  const indent = '  '.repeat(depth);
  const commands = metadata.children?.filter(c => c.type === 'command') || [];
  const defaults = metadata.children?.filter(c => c.type === 'default') || [];
  const showNested = depth < (options.maxDepth ?? 10);
  const hasParams = metadata.params && metadata.params.length > 0;
  const hasOptions = metadata.options && Object.keys(metadata.options).length > 0;

  return (
    <>
      <Text>
        {indent}
        {metadata.name}
        {options.showAliases && metadata.aliases && metadata.aliases.length > 0 && (
          <> (aliases: {metadata.aliases.join(', ')})</>
        )}
        {options.showPaths && metadata.path && <> [path: {metadata.path}]</>}
      </Text>
      {metadata.description && (
        <Text>
          {indent}  {metadata.description}
        </Text>
      )}
      {hasParams && (
        <>
          <Text>
            {indent}  Parameters:
          </Text>
          {metadata.params!.map((param, index) => (
            <Text key={index}>
              {indent}    {param.required ? '<' : '['}{param.name}:{param.type}{param.required ? '>' : ']'}
              {param.description && <> - {param.description}</>}
            </Text>
          ))}
        </>
      )}
      {hasOptions && (
        <>
          <Text>
            {indent}  Options:
          </Text>
          {Object.entries(metadata.options!).map(([name, opt], index) => (
            <Text key={index}>
              {indent}    --{name}
              {opt.aliases && opt.aliases.length > 0 && (
                <>, -{opt.aliases.join(', -')}</>
              )}
              {opt.type !== 'boolean' && <> &lt;{opt.type}&gt;</>}
              {opt.default !== undefined && <> (default: {String(opt.default)})</>}
              {opt.description && <> - {opt.description}</>}
            </Text>
          ))}
        </>
      )}
      {showNested && commands.length > 0 && (
        <>
          <Text>
            {indent}  Subcommands:
          </Text>
          {commands.map((cmd, index) => (
            <CommandHelp
              key={index}
              metadata={cmd}
              options={options}
              depth={depth + 2}
            />
          ))}
        </>
      )}
      {showNested && defaults.length > 0 && defaults[0]?.description && (
        <Text>
          {indent}  Default: {defaults[0].description}
        </Text>
      )}
    </>
  );
}
