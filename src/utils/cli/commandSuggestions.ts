/**
 * Command suggestion utilities
 * Provides suggestions for unknown commands based on available commands
 */

import type { ComponentMetadata } from './matcher';

/**
 * Calculate Levenshtein distance between two strings
 * Used for finding similar command names
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str2.length;
  const len2 = str1.length;
  const matrix: number[][] = [];

  // Initialize matrix
  for (let i = 0; i <= len2; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len1; j++) {
    matrix[0]![j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= len2; i++) {
    for (let j = 1; j <= len1; j++) {
      if (str1[j - 1] === str2[i - 1]) {
        matrix[i]![j] = matrix[i - 1]![j - 1]!;
      } else {
        matrix[i]![j] = Math.min(
          matrix[i - 1]![j]! + 1,     // deletion
          matrix[i]![j - 1]! + 1,     // insertion
          matrix[i - 1]![j - 1]! + 1  // substitution
        );
      }
    }
  }

  return matrix[len2]![len1]!;
}

/**
 * Get all available command names and aliases from metadata
 */
export function getAllCommandNames(metadata: ComponentMetadata[]): string[] {
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
 * Find similar commands to the given unknown command
 * Returns up to 3 most similar command names
 */
export function findSimilarCommands(
  unknownCommand: string,
  metadata: ComponentMetadata[]
): string[] {
  const allCommands = getAllCommandNames(metadata);
  
  if (allCommands.length === 0) {
    return [];
  }

  // Calculate distances and sort
  const distances = allCommands.map(cmd => ({
    name: cmd,
    distance: levenshteinDistance(unknownCommand.toLowerCase(), cmd.toLowerCase()),
  }));

  // Sort by distance and take top 3
  distances.sort((a, b) => a.distance - b.distance);
  
  // Filter to reasonable suggestions (distance <= 3 or prefix match)
  const suggestions = distances
    .filter(d => {
      const cmdLower = d.name.toLowerCase();
      const unknownLower = unknownCommand.toLowerCase();
      return d.distance <= 3 || cmdLower.startsWith(unknownLower.slice(0, Math.min(3, unknownLower.length)));
    })
    .slice(0, 3)
    .map(d => d.name);

  return suggestions;
}

/**
 * Format unknown command error message
 * 
 * @deprecated Use UnknownCommandError component instead (TSX)
 * This function is kept for backward compatibility but should not be used in new code
 */
export function formatUnknownCommandError(
  _unknownCommand: string,
  commandPath: string[],
  suggestions: string[],
  appName?: string
): string {
  const fullCommand = commandPath.join(' ');
  const lines: string[] = [];
  
  lines.push(`Unknown command: '${fullCommand}'`);
  lines.push('');
  
  if (suggestions.length > 0) {
    lines.push('Did you mean one of these?');
    for (const suggestion of suggestions) {
      lines.push(`  ${appName || 'app'} ${suggestion}`);
    }
    lines.push('');
  }
  
  lines.push(`Use '${appName || 'app'} --help' to see all available commands.`);
  
  return lines.join('\n');
}
