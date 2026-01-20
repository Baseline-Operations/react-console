/**
 * Option normalization utilities
 * Normalizes option values based on their type definitions
 */

import type { ParsedArgs } from './parser';
import type { ComponentMetadata } from './matcher';

/**
 * Normalize option values based on their type definitions
 * Converts string values to appropriate types (number, boolean, string[])
 * 
 * @param parsedArgs - Parsed arguments
 * @param metadata - Component metadata with option definitions
 * @returns ParsedArgs with normalized option values
 */
export function normalizeOptionValues(
  parsedArgs: ParsedArgs,
  metadata: ComponentMetadata
): ParsedArgs {
  if (!metadata.options) {
    return parsedArgs;
  }

  const normalized: ParsedArgs = {
    command: [...parsedArgs.command],
    options: { ...parsedArgs.options },
    params: [...parsedArgs.params],
  };

  // Normalize each option based on its type definition
  for (const [optionName, optionDef] of Object.entries(metadata.options)) {
    const value = normalized.options[optionName];
    
    if (value === undefined) {
      // Use default if available
      if (optionDef.default !== undefined) {
        normalized.options[optionName] = optionDef.default;
      }
      continue;
    }

    // Normalize based on type
    switch (optionDef.type) {
      case 'number':
        if (typeof value === 'string') {
          const num = parseFloat(value);
          normalized.options[optionName] = isNaN(num) ? value : num;
        }
        break;
      
      case 'boolean':
        if (typeof value === 'string') {
          const lower = value.toLowerCase();
          if (lower === 'true' || lower === '1' || lower === 'yes') {
            normalized.options[optionName] = true;
          } else if (lower === 'false' || lower === '0' || lower === 'no') {
            normalized.options[optionName] = false;
          }
        }
        break;
      
      case 'string[]':
        if (typeof value === 'string') {
          // Split comma-separated values or single value as array
          normalized.options[optionName] = value.includes(',') 
            ? value.split(',').map(v => v.trim())
            : [value];
        } else if (!Array.isArray(value)) {
          normalized.options[optionName] = [String(value)];
        }
        break;
      
      case 'string':
        // Already a string, no conversion needed
        break;
    }
  }

  return normalized;
}
