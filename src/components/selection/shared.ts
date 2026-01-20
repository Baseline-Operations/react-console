/**
 * Shared types and utilities for selection components (Radio, Checkbox, Dropdown, List)
 */

/**
 * Re-export SelectOption for convenience
 */
export type { SelectOption } from '../../types';

/**
 * Format display value for selection components
 * This is a shared utility that can be used by Radio, Checkbox, Dropdown, and List
 * Also used by the renderer for rendering selection components
 */
export function formatOptionDisplay(
  option: { label: string; value: string | number },
  selected: boolean,
  format?: string | ((option: { label: string; value: string | number }, selected: boolean, index?: number) => string),
  index?: number
): string {
  if (typeof format === 'function') {
    return format(option, selected, index);
  }

  switch (format) {
    case 'bullet':
      return selected ? `● ${option.label}` : `○ ${option.label}`;
    case 'checkmark':
      return selected ? `✓ ${option.label}` : `  ${option.label}`;
    case 'square':
      return selected ? `☑ ${option.label}` : `☐ ${option.label}`;
    case 'number':
      return selected ? `[${option.value}] ${option.label}` : ` ${option.value}  ${option.label}`;
    case 'arrow':
      return selected ? `→ ${option.label}` : `  ${option.label}`;
    default:
      return selected ? `(*) ${option.label}` : `( ) ${option.label}`;
  }
}
