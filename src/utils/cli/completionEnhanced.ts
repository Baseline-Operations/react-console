/**
 * Enhanced completion system
 * Provides advanced completion features like context-aware suggestions and fuzzy matching
 */

import type { ComponentMetadata } from './matcher';
import type { ParsedArgs } from './parser';
import { generateCompletions, type CompletionResult } from './completion';

/**
 * Completion context
 */
export interface CompletionContext {
  /** Current word being completed */
  currentWord: string;
  /** Previous word (for context) */
  previousWord?: string;
  /** Full command path so far */
  commandPath: string[];
  /** Current option being completed (if any) */
  currentOption?: string;
  /** Whether we're in an option value */
  inOptionValue?: boolean;
}

/**
 * Enhanced completion options
 */
export interface EnhancedCompletionOptions {
  /** Enable fuzzy matching (default: true) */
  fuzzyMatch?: boolean;
  /** Maximum suggestions to return (default: 10) */
  maxSuggestions?: number;
  /** Include descriptions in suggestions (default: false) */
  includeDescriptions?: boolean;
  /** Filter suggestions by prefix (default: true) */
  filterByPrefix?: boolean;
}

/**
 * Generate enhanced completions with context awareness
 */
export function generateEnhancedCompletions(
  context: CompletionContext,
  metadata: ComponentMetadata[],
  parsedArgs?: ParsedArgs,
  options: EnhancedCompletionOptions = {}
): CompletionResult {
  const {
    fuzzyMatch = true,
    maxSuggestions = 10,
    // includeDescriptions could be used for richer completions in the future
    filterByPrefix = true,
  } = options;

  // Get base completions
  const baseResult = generateCompletions(context.commandPath, metadata, parsedArgs);

  if (baseResult.suggestions.length === 0) {
    return baseResult;
  }

  let suggestions = baseResult.suggestions;

  // Filter by prefix if enabled
  if (filterByPrefix && context.currentWord) {
    const prefix = context.currentWord.toLowerCase();
    suggestions = suggestions.filter((s) => s.toLowerCase().startsWith(prefix));
  }

  // Apply fuzzy matching if enabled
  if (fuzzyMatch && context.currentWord && suggestions.length === 0) {
    // Fallback to fuzzy matching if prefix match fails
    suggestions = fuzzyMatchSuggestions(context.currentWord, baseResult.suggestions);
  }

  // Limit suggestions
  if (suggestions.length > maxSuggestions) {
    suggestions = suggestions.slice(0, maxSuggestions);
  }

  return {
    suggestions,
    complete: baseResult.complete && suggestions.length === 1,
  };
}

/**
 * Fuzzy match suggestions using simple similarity
 */
function fuzzyMatchSuggestions(query: string, candidates: string[]): string[] {
  const queryLower = query.toLowerCase();
  const scores = candidates.map((candidate) => {
    const candidateLower = candidate.toLowerCase();

    // Exact prefix match gets highest score
    if (candidateLower.startsWith(queryLower)) {
      return { candidate, score: 100 };
    }

    // Contains match gets medium score
    if (candidateLower.includes(queryLower)) {
      return { candidate, score: 50 };
    }

    // Calculate character overlap
    let overlap = 0;
    for (const char of queryLower) {
      if (candidateLower.includes(char)) {
        overlap++;
      }
    }

    const score = (overlap / queryLower.length) * 30;
    return { candidate, score };
  });

  // Sort by score and return top matches
  scores.sort((a, b) => b.score - a.score);
  return scores
    .filter((s) => s.score > 0)
    .slice(0, 5)
    .map((s) => s.candidate);
}

/**
 * Generate completion script with enhanced features
 */
export function generateEnhancedCompletionScript(
  appName: string,
  metadata: ComponentMetadata[],
  _options: {
    includeDescriptions?: boolean;
    customCompletionFunction?: string;
  } = {}
): string {
  const baseScript = `
# ${appName} enhanced completion script
# Install: source <(${appName} completion)

_${appName}() {
  local cur prev words cword
  COMPREPLY=()
  cur="\${COMP_WORDS[COMP_CWORD]}"
  prev="\${COMP_WORDS[COMP_CWORD-1]}"
  words=("\${COMP_WORDS[@]}")
  cword=\${COMP_CWORD}
  
  # Commands and options
  local commands="${getAllCommands(metadata).join(' ')}"
  local options="${getAllOptions(metadata).join(' ')}"
  
  # Enhanced completion logic
  if [[ "\${cur}" == -* ]]; then
    COMPREPLY=( $(compgen -W "\${options}" -- "\${cur}") )
    return 0
  fi
  
  # Context-aware completion
  if [[ "\${prev}" == -* ]]; then
    COMPREPLY=( $(compgen -W "\${commands} \${options}" -- "\${cur}") )
    return 0
  fi
  
  # Default: suggest commands
  COMPREPLY=( $(compgen -W "\${commands} \${options}" -- "\${cur}") )
  return 0
}

complete -F _${appName} ${appName}
`;

  return baseScript.trim();
}

/**
 * Get all commands from metadata
 */
function getAllCommands(metadata: ComponentMetadata[]): string[] {
  const commands: string[] = [];
  for (const item of metadata) {
    if (item.type === 'command') {
      if (item.name) {
        commands.push(item.name);
      }
      if (item.aliases) {
        commands.push(...item.aliases);
      }
      if (item.children) {
        commands.push(...getAllCommands(item.children));
      }
    }
  }
  return [...new Set(commands)];
}

/**
 * Get all options from metadata
 */
function getAllOptions(metadata: ComponentMetadata[]): string[] {
  const options: string[] = [];
  for (const item of metadata) {
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
}
