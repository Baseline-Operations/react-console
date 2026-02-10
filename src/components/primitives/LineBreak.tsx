/**
 * LineBreak component - explicit line break
 * React Native-like pattern for terminal-aware line breaks
 */

import { createConsoleNode } from '../utils';

/**
 * Props for the LineBreak component
 */
export interface LineBreakProps {
  /** Number of line breaks to render (default: 1) */
  count?: number;
}

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
 * @param props - LineBreak component props
 * @returns React element representing one or more line breaks
 *
 * @example
 * ```tsx
 * // Single line break
 * <Text>Line 1</Text>
 * <LineBreak />
 * <Text>Line 2</Text>
 *
 * // Multiple line breaks
 * <Text>Section 1</Text>
 * <LineBreak count={3} />
 * <Text>Section 2</Text>
 * ```
 */
export function LineBreak({ count }: LineBreakProps = {}) {
  return createConsoleNode('linebreak', { count });
}
