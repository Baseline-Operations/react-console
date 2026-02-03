/**
 * Pressable component - React Native-like pressable area
 * Terminal equivalent of React Native's Pressable component
 */

import type { ReactNode } from 'react';
import type {
  StyleProps,
  LayoutProps,
  ComponentEventHandlers,
  ViewStyle,
  GestureResponderEvent,
} from '../../types';
import { createConsoleNode, mergeClassNameAndStyle } from '../utils';
import type { InteractionState, StateStyle } from '../../utils/stateStyles';

/**
 * Children render prop for Pressable (React Native compatible)
 */
export type PressableStateCallbackType = (state: InteractionState) => ReactNode;

/**
 * Props for the Pressable component (React Native compatible)
 *
 * Provides pressable wrapper for any content. Supports keyboard (Enter/Space)
 * and mouse clicks (if terminal supports it). Similar to Button but can wrap any content.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Pressable onPress={() => handlePress()}>
 *   <Text>Press me!</Text>
 * </Pressable>
 *
 * // With state-based styling (React Native pattern)
 * <Pressable
 *   onPress={() => handlePress()}
 *   style={({ pressed, focused }) => ({
 *     backgroundColor: pressed ? 'blue' : focused ? 'gray' : 'white'
 *   })}
 * >
 *   {({ pressed }) => (
 *     <Text>{pressed ? 'Pressing...' : 'Press me'}</Text>
 *   )}
 * </Pressable>
 * ```
 */
export interface PressableProps
  extends
    StyleProps,
    LayoutProps,
    Omit<ComponentEventHandlers, 'onPress' | 'onPressIn' | 'onPressOut' | 'onLongPress'> {
  /** Children - can be ReactNode or render prop based on interaction state */
  children?: ReactNode | PressableStateCallbackType;
  /**
   * Style - can be static ViewStyle or function of interaction state
   * @example
   * style={({ pressed }) => ({ backgroundColor: pressed ? 'blue' : 'white' })}
   */
  style?: StateStyle<ViewStyle>;
  /** Disable pressable interaction (default: false) */
  disabled?: boolean;
  /** Tab order (auto-assigned if not set) */
  tabIndex?: number;
  /** Auto focus on mount */
  autoFocus?: boolean;

  // React Native compatible press events
  /** Called when the press is activated */
  onPress?: (event: GestureResponderEvent) => void;
  /** Called immediately when a press is activated, before onPressOut */
  onPressIn?: (event: GestureResponderEvent) => void;
  /** Called when a press gesture has been deactivated */
  onPressOut?: (event: GestureResponderEvent) => void;
  /** Called after delayLongPress has elapsed */
  onLongPress?: (event: GestureResponderEvent) => void;

  // Timing configuration (React Native compatible)
  /** Duration before onLongPress is called (default: 500ms) */
  delayLongPress?: number;
  /** Duration before onPressIn is called (default: 0) */
  delayPressIn?: number;
  /** Duration before onPressOut is called (default: 0) */
  delayPressOut?: number;

  // Visual feedback (React Native compatible)
  /** Called when the view starts responding to touches */
  unstable_pressDelay?: number;
  /** Android ripple effect config (ignored in terminal) */
  android_ripple?: {
    color?: string;
    borderless?: boolean;
    radius?: number;
  };

  // State style overrides
  /** Style applied when pressed */
  pressedStyle?: ViewStyle;
  /** Style applied when focused */
  focusedStyle?: ViewStyle;
  /** Style applied when hovered */
  hoveredStyle?: ViewStyle;
  /** Style applied when disabled */
  disabledStyle?: ViewStyle;
}

/**
 * Pressable component - React Native-like pattern for terminal
 *
 * Provides pressable wrapper for any content. Can be pressed via keyboard
 * (Enter/Space when focused) or mouse clicks (if terminal supports it).
 * Similar to Button but can wrap any content, not just text.
 *
 * Supports state-based styling where style can be a function that receives
 * the current interaction state ({ pressed, focused, hovered, disabled }).
 *
 * @param props - Pressable component props
 * @returns React element representing a pressable container
 *
 * @example
 * ```tsx
 * // Static style
 * <Pressable onPress={() => handlePress()} style={{ backgroundColor: 'blue' }}>
 *   <Text>Press me</Text>
 * </Pressable>
 *
 * // State-based style
 * <Pressable
 *   onPress={() => handlePress()}
 *   style={({ pressed, focused }) => ({
 *     backgroundColor: pressed ? 'darkblue' : focused ? 'lightblue' : 'blue',
 *     opacity: pressed ? 0.8 : 1
 *   })}
 * >
 *   {({ pressed }) => (
 *     <Text color={pressed ? 'gray' : 'white'}>
 *       {pressed ? 'Pressing...' : 'Press me'}
 *     </Text>
 *   )}
 * </Pressable>
 * ```
 */
export function Pressable({
  children,
  disabled = false,
  tabIndex,
  autoFocus,
  onClick,
  onPress,
  onPressIn,
  onPressOut,
  onLongPress,
  delayLongPress = 500,
  delayPressIn = 0,
  delayPressOut = 0,
  pressedStyle,
  focusedStyle,
  hoveredStyle,
  disabledStyle,
  className,
  style,
  ...props
}: PressableProps) {
  // onPress is the React Native pattern, onClick is web pattern
  // Support both
  const handlePress = onPress || onClick;

  // Merge className with style prop and legacy props
  // Note: State-based style resolution happens in the node/renderer
  const baseStyle = typeof style === 'function' ? undefined : style;
  const mergedStyle = mergeClassNameAndStyle(className, baseStyle, props);

  return createConsoleNode('box', {
    style: mergedStyle as ViewStyle,
    layout: mergedStyle as LayoutProps,
    styles: mergedStyle,
    // Pass through the original style for state-based resolution
    stateStyle: typeof style === 'function' ? style : undefined,
    disabled,
    tabIndex,
    autoFocus,
    // Press events
    onPress: disabled ? undefined : handlePress,
    onClick: disabled ? undefined : handlePress,
    onPressIn: disabled ? undefined : onPressIn,
    onPressOut: disabled ? undefined : onPressOut,
    onLongPress: disabled ? undefined : onLongPress,
    // Timing
    delayLongPress,
    delayPressIn,
    delayPressOut,
    // State style overrides
    pressedStyle,
    focusedStyle,
    hoveredStyle,
    disabledStyle,
    // Children - convert function children to node for now
    // The actual state-based rendering would happen in the node/renderer
    children: typeof children === 'function' ? null : children,
    childrenRenderProp: typeof children === 'function' ? children : undefined,
  });
}
