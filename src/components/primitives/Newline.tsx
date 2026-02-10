/**
 * Newline component - explicit line break
 *
 * @deprecated Use LineBreak component instead. Newline is kept for backward compatibility.
 */

import { createConsoleNode } from '../utils';

/**
 * Props for the Newline component
 */
export interface NewlineProps {
  /** Number of line breaks to render (default: 1) */
  count?: number;
}

/**
 * Newline component - Explicit line break (legacy)
 *
 * Provides explicit line break functionality. This is a legacy component
 * kept for backward compatibility. Use `LineBreak` instead for better naming.
 *
 * @deprecated Use `LineBreak` component instead. Functionally identical.
 *
 * @param props - Newline component props
 * @returns React element representing one or more line breaks
 *
 * @example
 * ```tsx
 * <Text>Line 1</Text>
 * <Newline /> // Use LineBreak instead
 * <Text>Line 2</Text>
 *
 * // Multiple line breaks
 * <Newline count={2} />
 * ```
 */
export function Newline({ count }: NewlineProps = {}) {
  return createConsoleNode('linebreak', { count });
}
