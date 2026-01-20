/**
 * LineBreak component - explicit line break
 * React Native-like pattern for terminal-aware line breaks
 */

import { createConsoleNode } from '../utils';

/**
 * LineBreak component - Explicit line break for terminal rendering
 * 
 * Provides explicit line break functionality similar to React Native's `<br />`.
 * Terminal-aware: handles differently in static, interactive, and fullscreen modes.
 * 
 * - Static mode: Simple newline output
 * - Interactive mode: May trigger scroll or buffer management
 * - Fullscreen mode: May affect layout calculations
 * 
 * @returns React element representing a line break
 * 
 * @example
 * ```tsx
 * <Text>Line 1</Text>
 * <LineBreak />
 * <Text>Line 2</Text>
 * ```
 */
export function LineBreak() {
  return createConsoleNode('linebreak', {});
}
