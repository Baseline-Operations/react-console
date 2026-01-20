/**
 * Command completion system
 * Generates tab completion suggestions for commands
 */

import type { ComponentMetadata } from './matcher';
import type { ParsedArgs } from './parser';

/**
 * Completion result
 */
export interface CompletionResult {
  /** Suggested completions */
  suggestions: string[];
  /** Whether the completion is complete (no more suggestions possible) */
  complete: boolean;
}

/**
 * Get all command names and aliases from metadata
 */
function getAllCommandNames(metadata: ComponentMetadata[]): string[] {
  const names: string[] = [];
  
  for (const item of metadata) {
    if (item.type === 'command') {
      if (item.name) {
        names.push(item.name);
      }
      if (item.aliases) {
        names.push(...item.aliases);
      }
      // Recursively get subcommand names
      if (item.children) {
        names.push(...getAllCommandNames(item.children));
      }
    }
  }
  
  return names;
}

/**
 * Generate completion suggestions for a command path
 * 
 * @param commandPath - Current command path (partial or complete)
 * @param metadata - Component metadata
 * @param parsedArgs - Parsed arguments (for context)
 * @returns Completion result with suggestions
 */
export function generateCompletions(
  commandPath: string[],
  metadata: ComponentMetadata[],
  _parsedArgs?: ParsedArgs
): CompletionResult {
  if (commandPath.length === 0) {
    // No command yet - suggest all top-level commands
    const topLevelCommands: string[] = [];
    for (const item of metadata) {
      if (item.type === 'command') {
        if (item.name) {
          topLevelCommands.push(item.name);
        }
        if (item.aliases) {
          topLevelCommands.push(...item.aliases);
        }
      }
    }
    return {
      suggestions: [...new Set(topLevelCommands)].sort(),
      complete: false,
    };
  }

  // Find matching command in metadata
  const findCommand = (md: ComponentMetadata[], path: string[], index: number): ComponentMetadata | null => {
    if (index >= path.length) return null;
    
    const cmdName = path[index]!;
    for (const item of md) {
      if (item.type === 'command' && (item.name === cmdName || item.aliases?.includes(cmdName))) {
        if (index === path.length - 1) {
          return item; // Found the command
        }
        if (item.children) {
          const subMatch = findCommand(item.children, path, index + 1);
          if (subMatch) return subMatch;
        }
        return item;
      }
    }
    return null;
  };

  const matchedCommand = findCommand(metadata, commandPath, 0);

  if (!matchedCommand) {
    // Command not found - suggest commands that start with the last part
    const lastPart = commandPath[commandPath.length - 1] || '';
    const allCommands = getAllCommandNames(metadata);
    const suggestions = allCommands.filter(cmd => 
      cmd.toLowerCase().startsWith(lastPart.toLowerCase())
    );
    return {
      suggestions: [...new Set(suggestions)].sort(),
      complete: false,
    };
  }

  // Command found - suggest subcommands or options
  if (matchedCommand.children) {
    const subcommands: string[] = [];
    for (const child of matchedCommand.children) {
      if (child.type === 'command') {
        if (child.name) {
          subcommands.push(child.name);
        }
        if (child.aliases) {
          subcommands.push(...child.aliases);
        }
      }
    }
    
    // If there's a partial subcommand, filter suggestions
    if (commandPath.length > 1) {
      const lastPart = commandPath[commandPath.length - 1] || '';
      const filtered = subcommands.filter(cmd => 
        cmd.toLowerCase().startsWith(lastPart.toLowerCase())
      );
      return {
        suggestions: [...new Set(filtered)].sort(),
        complete: filtered.length === 1 && filtered[0] === lastPart,
      };
    }
    
    return {
      suggestions: [...new Set(subcommands)].sort(),
      complete: false,
    };
  }

  // No subcommands - suggest options
  if (matchedCommand.options) {
    const options: string[] = [];
    for (const [name, opt] of Object.entries(matchedCommand.options)) {
      options.push(`--${name}`);
      if (opt.aliases) {
        options.push(...opt.aliases.map(alias => `-${alias}`));
      }
    }
    return {
      suggestions: [...new Set(options)].sort(),
      complete: false,
    };
  }

  // No suggestions
  return {
    suggestions: [],
    complete: true,
  };
}

/**
 * Format completions for shell output
 * 
 * @param result - Completion result
 * @returns Formatted string for shell completion
 */
export function formatCompletions(result: CompletionResult): string {
  return result.suggestions.join('\n');
}

/**
 * Generate bash/zsh completion script
 * 
 * @param appName - Application name
 * @param metadata - Component metadata
 * @returns Completion script content
 */
export function generateCompletionScript(
  appName: string,
  metadata: ComponentMetadata[]
): string {
  const allCommands = getAllCommandNames(metadata);
  const commandsList = allCommands.join(' ');
  
  // Collect all options with their aliases
  const getAllOptions = (md: ComponentMetadata[]): string[] => {
    const options: string[] = [];
    for (const item of md) {
      if (item.options) {
        for (const [name, opt] of Object.entries(item.options)) {
          options.push(`--${name}`);
          if (opt.aliases) {
            for (const alias of opt.aliases) {
              options.push(`-${alias}`);
            }
          }
        }
      }
      if (item.children) {
        options.push(...getAllOptions(item.children));
      }
    }
    return [...new Set(options)];
  };
  
  const allOptions = getAllOptions(metadata);
  const optionsList = ['--help', '-h', '--version', '-v', ...allOptions].join(' ');
  
  return `# ${appName} completion script
# Install: source <(${appName} completion)
# Or add to your .bashrc/.zshrc: source <(${appName} completion)

_${appName}() {
  local cur prev words cword
  COMPREPLY=()
  cur="\${COMP_WORDS[COMP_CWORD]}"
  prev="\${COMP_WORDS[COMP_CWORD-1]}"
  words=("\${COMP_WORDS[@]}")
  cword=\${COMP_CWORD}
  
  # Commands and options
  local commands="${commandsList}"
  local options="${optionsList}"
  
  # If current word starts with -, suggest options
  if [[ "\${cur}" == -* ]]; then
    COMPREPLY=( $(compgen -W "\${options}" -- "\${cur}") )
    return 0
  fi
  
  # If previous word is a command, suggest subcommands or options
  if [[ "\${prev}" == -* ]]; then
    # Option was used, suggest commands or more options
    COMPREPLY=( $(compgen -W "\${commands} \${options}" -- "\${cur}") )
    return 0
  fi
  
  # Otherwise, suggest commands
  COMPREPLY=( $(compgen -W "\${commands} \${options}" -- "\${cur}") )
  return 0
}

complete -F _${appName} ${appName}
`;
}
