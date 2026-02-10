/**
 * TouchableHighlight - React Native compatibility alias for Pressable
 *
 * In terminal environments, highlight overlay effects are not available, so this
 * is a direct re-export of Pressable for API compatibility with React Native code.
 */

import { Pressable } from './Pressable';
import type { PressableProps } from './Pressable';

/**
 * TouchableHighlight - React Native compatibility alias
 *
 * Identical to `Pressable` in terminal environments. Provided for compatibility
 * with React Native code that uses TouchableHighlight.
 *
 * Note: Terminal environments don't support true highlight overlay effects. Use
 * state-based styling with `inverse` or `backgroundColor` for a similar visual effect.
 *
 * @example
 * ```tsx
 * <TouchableHighlight
 *   onPress={() => handlePress()}
 *   style={({ pressed }) => ({
 *     inverse: pressed,
 *   })}
 * >
 *   <Text>Press me</Text>
 * </TouchableHighlight>
 * ```
 */
export const TouchableHighlight = Pressable;
export type TouchableHighlightProps = PressableProps;
