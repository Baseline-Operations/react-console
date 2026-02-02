/**
 * Newline component - explicit line break
 *
 * @deprecated Use LineBreak component instead. Newline is kept for backward compatibility.
 */

import { createConsoleNode } from '../utils';

/**
 * Newline component - Explicit line break (legacy)
 *
 * Provides explicit line break functionality. This is a legacy component
 * kept for backward compatibility. Use `LineBreak` instead for better naming.
 *
 * @deprecated Use `LineBreak` component instead. Functionally identical.
 *
 * @returns React element representing a line break
 *
 * @example
 * ```tsx
 * <Text>Line 1</Text>
 * <Newline /> // Use LineBreak instead
 * <Text>Line 2</Text>
 * ```
 */
export function Newline() {
  // The reconciler handles newline as a special node type
  return createConsoleNode('newline', {});
}
