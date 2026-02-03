/**
 * Animation Components and Utilities
 * Convenient exports for animation functionality
 *
 * @example
 * ```tsx
 * import { Animated, useAnimatedValue, easing } from '@baseline-operations/react-console/animations';
 * ```
 */

// Animation component
export { Animated } from './components/Animated';
export type { AnimatedProps } from './components/Animated';

// Animation utilities
export {
  easing,
  interpolate,
  interpolateColor,
  FrameRateController,
  createAnimationConfig,
  calculateAnimationProgress,
} from './utils/animations';
export type {
  EasingFunction,
  AnimationType,
  AnimationDirection,
  AnimationConfig,
} from './utils/animations';

// Animation hooks
export { useAnimatedValue, useAnimatedColor, useAnimatedStyle } from './hooks/animations';
