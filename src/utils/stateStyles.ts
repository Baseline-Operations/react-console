/**
 * State-based styling system (React Native Pressable-style)
 *
 * Provides utilities for creating interactive styles that respond to
 * component state (pressed, focused, hovered, disabled).
 */

import type { ViewStyle, TextStyle } from '../types/styles';

/**
 * Interaction state for a component
 */
export interface InteractionState {
  /** Whether the component is currently pressed/activated */
  pressed: boolean;
  /** Whether the component has focus */
  focused: boolean;
  /** Whether the component is hovered (terminal mouse support) */
  hovered: boolean;
  /** Whether the component is disabled */
  disabled: boolean;
}

/**
 * Style that can be static or a function of interaction state
 * Similar to React Native's Pressable style prop
 */
export type StateStyle<T extends ViewStyle | TextStyle = ViewStyle> =
  | T
  | T[]
  | ((state: InteractionState) => T | T[]);

/**
 * Props for state-based styling (can be added to any component)
 */
export interface StateStyleProps<T extends ViewStyle | TextStyle = ViewStyle> {
  /**
   * Style that can be static or a function of interaction state
   * @example
   * ```tsx
   * <Pressable style={({ pressed, focused }) => ({
   *   backgroundColor: pressed ? 'blue' : focused ? 'gray' : 'white'
   * })} />
   * ```
   */
  style?: StateStyle<T>;

  /** Style applied when component is disabled */
  disabledStyle?: T;
  /** Style applied when component is pressed/activated */
  pressedStyle?: T;
  /** Style applied when component has focus */
  focusedStyle?: T;
  /** Style applied when component is hovered */
  hoveredStyle?: T;
}

/**
 * Priority order for state styles (lower index = higher priority)
 * 1. disabled (highest priority - always show disabled state when disabled)
 * 2. pressed (active interaction takes precedence)
 * 3. focused (keyboard/tab focus)
 * 4. hovered (mouse hover)
 * 5. default (base style)
 */
const STATE_PRIORITY: (keyof InteractionState)[] = ['disabled', 'pressed', 'focused', 'hovered'];

/**
 * Resolve state-based style to a concrete style object
 *
 * @param style - Static style, array of styles, or function returning style
 * @param state - Current interaction state
 * @param overrides - Optional per-state style overrides
 * @returns Resolved style object
 *
 * @example
 * ```ts
 * // Function style
 * const style = resolveStateStyle(
 *   ({ pressed }) => ({ backgroundColor: pressed ? 'blue' : 'white' }),
 *   { pressed: true, focused: false, hovered: false, disabled: false }
 * );
 *
 * // With overrides
 * const style = resolveStateStyle(
 *   { backgroundColor: 'white' },
 *   { pressed: false, focused: true, hovered: false, disabled: false },
 *   { focusedStyle: { backgroundColor: 'yellow' } }
 * );
 * ```
 */
export function resolveStateStyle<T extends ViewStyle | TextStyle = ViewStyle>(
  style: StateStyle<T> | undefined,
  state: InteractionState,
  overrides?: Partial<StateStyleProps<T>>
): T {
  // Start with empty style
  let resolvedStyle: T = {} as T;

  // Resolve base style (function or static)
  if (style !== undefined) {
    if (typeof style === 'function') {
      const result = style(state);
      resolvedStyle = Array.isArray(result) ? mergeStyles(result) : result;
    } else if (Array.isArray(style)) {
      resolvedStyle = mergeStyles(style);
    } else {
      resolvedStyle = { ...style };
    }
  }

  // Apply state-specific overrides in priority order (reversed so higher priority overwrites)
  // Start from lowest priority (hovered) to highest (disabled)
  const reversedPriority = [...STATE_PRIORITY].reverse();

  for (const stateName of reversedPriority) {
    if (!state[stateName]) continue;

    const overrideKey = `${stateName}Style` as keyof StateStyleProps<T>;
    const overrideStyle = overrides?.[overrideKey] as T | undefined;

    if (overrideStyle) {
      resolvedStyle = { ...resolvedStyle, ...overrideStyle };
    }
  }

  return resolvedStyle;
}

/**
 * Merge an array of styles into a single style object
 * Later styles override earlier styles
 */
function mergeStyles<T extends ViewStyle | TextStyle>(styles: T[]): T {
  return styles.reduce((acc, style) => ({ ...acc, ...style }), {} as T);
}

/**
 * Create a default interaction state (all false)
 */
export function createDefaultInteractionState(): InteractionState {
  return {
    pressed: false,
    focused: false,
    hovered: false,
    disabled: false,
  };
}

/**
 * Check if a style is a function (state-dependent)
 */
export function isStatefulStyle<T extends ViewStyle | TextStyle>(
  style: StateStyle<T> | undefined
): style is (state: InteractionState) => T | T[] {
  return typeof style === 'function';
}

/**
 * Create a stateful style function from base and state-specific styles
 * Useful for building reusable interactive styles
 *
 * @example
 * ```tsx
 * const buttonStyle = createStatefulStyle(
 *   { backgroundColor: 'blue', color: 'white' },
 *   {
 *     pressed: { backgroundColor: 'darkblue' },
 *     focused: { borderColor: 'yellow' },
 *     hovered: { backgroundColor: 'lightblue' },
 *     disabled: { backgroundColor: 'gray', color: 'darkgray' }
 *   }
 * );
 *
 * <Pressable style={buttonStyle}>Press Me</Pressable>
 * ```
 */
export function createStatefulStyle<T extends ViewStyle | TextStyle = ViewStyle>(
  baseStyle: T,
  stateStyles: {
    pressed?: Partial<T>;
    focused?: Partial<T>;
    hovered?: Partial<T>;
    disabled?: Partial<T>;
  }
): (state: InteractionState) => T {
  return (state: InteractionState): T => {
    let result = { ...baseStyle };

    // Apply in priority order (reversed - lower priority first)
    if (state.hovered && stateStyles.hovered) {
      result = { ...result, ...stateStyles.hovered };
    }
    if (state.focused && stateStyles.focused) {
      result = { ...result, ...stateStyles.focused };
    }
    if (state.pressed && stateStyles.pressed) {
      result = { ...result, ...stateStyles.pressed };
    }
    if (state.disabled && stateStyles.disabled) {
      result = { ...result, ...stateStyles.disabled };
    }

    return result;
  };
}
