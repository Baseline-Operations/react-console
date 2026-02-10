/**
 * TouchableOpacity - React Native compatibility alias for Pressable
 *
 * In terminal environments, opacity effects are not available, so this
 * is a direct re-export of Pressable for API compatibility with React Native code.
 */

import { Pressable } from './Pressable';
import type { PressableProps } from './Pressable';

/**
 * TouchableOpacity - React Native compatibility alias
 *
 * Identical to `Pressable` in terminal environments. Provided for compatibility
 * with React Native code that uses TouchableOpacity.
 *
 * Note: Terminal environments don't support true opacity effects. Use
 * state-based styling with `dim` for a similar visual effect.
 *
 * @example
 * ```tsx
 * <TouchableOpacity
 *   onPress={() => handlePress()}
 *   style={({ pressed }) => ({
 *     dim: pressed,
 *   })}
 * >
 *   <Text>Press me</Text>
 * </TouchableOpacity>
 * ```
 */
export const TouchableOpacity = Pressable;
export type TouchableOpacityProps = PressableProps;
