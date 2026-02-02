/**
 * Animation hooks for terminal animations
 * Provides hooks for animating values, colors, and styles
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  interpolate,
  interpolateColor,
  FrameRateController,
  type AnimationConfig,
  createAnimationConfig,
  calculateAnimationProgress,
  easing,
} from '../utils/animations';
import type { ViewStyle, TextStyle } from '../types';

// Import reconciler for discrete updates
// This ensures state updates trigger proper re-renders
interface ReconcilerMethods {
  flushSyncFromReconciler?: (fn: () => void) => void;
  discreteUpdates?: (fn: () => void) => void;
}
let reconciler: ReconcilerMethods | null = null;
try {
  reconciler = require('../renderer/reconciler').reconciler as ReconcilerMethods;
} catch {
  // Reconciler may not be available in all contexts
}

/**
 * Helper to update state with proper reconciler integration
 * Uses flushSyncFromReconciler to ensure state changes trigger immediate re-renders
 */
function updateState<T>(
  setter: (value: T | ((prev: T) => T)) => void,
  value: T | ((prev: T) => T)
): void {
  if (reconciler?.flushSyncFromReconciler) {
    reconciler.flushSyncFromReconciler(() => {
      setter(value);
    });
  } else if (reconciler?.discreteUpdates) {
    reconciler.discreteUpdates(() => {
      setter(value);
    });
  } else {
    setter(value);
  }
}

/**
 * Hook for animating numeric values
 *
 * @param from - Starting value
 * @param to - Ending value
 * @param config - Animation configuration
 * @returns Animated value and control functions
 *
 * @example
 * ```tsx
 * function AnimatedCounter() {
 *   const [value, start, stop, reset] = useAnimatedValue(0, 100, {
 *     duration: 2000,
 *     easing: easing.easeOut,
 *   });
 *
 *   useEffect(() => {
 *     start();
 *   }, []);
 *
 *   return <Text>{Math.round(value)}</Text>;
 * }
 * ```
 */
export function useAnimatedValue(
  from: number,
  to: number,
  config: Partial<AnimationConfig> = {}
): [number, () => void, () => void, () => void] {
  const animationConfig = createAnimationConfig(config);
  const [value, setValue] = useState(from);
  const frameController = useRef(new FrameRateController(10)).current;
  const animationRef = useRef<{
    startTime: number;
    isRunning: boolean;
    from: number;
    to: number;
  } | null>(null);

  const stop = useCallback(() => {
    animationRef.current = null;
    frameController.cancelAnimationFrame();
  }, [frameController]);

  const reset = useCallback(() => {
    stop();
    updateState(setValue, from);
  }, [from, stop]);

  const start = useCallback(() => {
    stop();

    animationRef.current = {
      startTime: Date.now(),
      isRunning: true,
      from: value, // Start from current value
      to,
    };

    const animate = (timestamp: number) => {
      if (!animationRef.current) return;

      const { startTime, from: startVal, to: endVal } = animationRef.current;
      const elapsed = timestamp - startTime;
      const progress = calculateAnimationProgress(elapsed, animationConfig);

      const eased = (animationConfig.easing || easing.linear)(progress);
      const newValue = interpolate(startVal, endVal, eased);

      updateState(setValue, newValue);

      // Continue animation if not complete
      if (progress < 1 || animationConfig.iterations === Infinity) {
        frameController.requestAnimationFrame(animate);
      } else {
        animationRef.current = null;
      }
    };

    frameController.requestAnimationFrame(animate);
  }, [to, animationConfig, frameController, stop, value]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return [value, start, stop, reset];
}

/**
 * Hook for animating colors
 *
 * @param from - Starting color
 * @param to - Ending color
 * @param config - Animation configuration
 * @returns Animated color and control functions
 *
 * @example
 * ```tsx
 * function ColorTransition() {
 *   const [color, start] = useAnimatedColor('red', 'blue', {
 *     duration: 1000,
 *     easing: easing.easeInOut,
 *   });
 *
 *   return (
 *     <Text style={{ color }} onClick={start}>
 *       Click to animate color
 *     </Text>
 *   );
 * }
 * ```
 */
export function useAnimatedColor(
  from: string,
  to: string,
  config: Partial<AnimationConfig> = {}
): [string, () => void, () => void, () => void] {
  const animationConfig = createAnimationConfig(config);
  const [color, setColor] = useState(from);
  const frameController = useRef(new FrameRateController(10)).current;
  const animationRef = useRef<{
    startTime: number;
    isRunning: boolean;
    from: string;
    to: string;
  } | null>(null);

  const stop = useCallback(() => {
    animationRef.current = null;
    frameController.cancelAnimationFrame();
  }, [frameController]);

  const reset = useCallback(() => {
    stop();
    updateState(setColor, from);
  }, [from, stop]);

  const start = useCallback(() => {
    stop();

    animationRef.current = {
      startTime: Date.now(),
      isRunning: true,
      from: color, // Start from current color
      to,
    };

    const animate = (timestamp: number) => {
      if (!animationRef.current) return;

      const { startTime, from: startColor, to: endColor } = animationRef.current;
      const elapsed = timestamp - startTime;
      const progress = calculateAnimationProgress(elapsed, animationConfig);

      const newColor = interpolateColor(startColor, endColor, progress, animationConfig.easing);
      updateState(setColor, newColor);

      // Continue animation if not complete
      if (progress < 1 || animationConfig.iterations === Infinity) {
        frameController.requestAnimationFrame(animate);
      } else {
        animationRef.current = null;
      }
    };

    frameController.requestAnimationFrame(animate);
  }, [to, animationConfig, frameController, stop, color]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return [color, start, stop, reset];
}

/**
 * Hook for animating style objects
 *
 * @param from - Starting style
 * @param to - Ending style
 * @param config - Animation configuration
 * @returns Animated style and control functions
 *
 * @example
 * ```tsx
 * function AnimatedBox() {
 *   const [style, start] = useAnimatedStyle(
 *     { width: 10, height: 5 },
 *     { width: 50, height: 20 },
 *     { duration: 1000 }
 *   );
 *
 *   return (
 *     <Box style={style} onClick={start}>
 *       <Text>Click to animate</Text>
 *     </Box>
 *   );
 * }
 * ```
 */
export function useAnimatedStyle(
  from: ViewStyle | TextStyle,
  to: ViewStyle | TextStyle,
  config: Partial<AnimationConfig> = {}
): [ViewStyle | TextStyle, () => void, () => void, () => void] {
  const animationConfig = createAnimationConfig(config);
  const [style, setStyle] = useState<ViewStyle | TextStyle>(from);
  const frameController = useRef(new FrameRateController(10)).current;
  const animationRef = useRef<{
    startTime: number;
    isRunning: boolean;
    from: ViewStyle | TextStyle;
    to: ViewStyle | TextStyle;
  } | null>(null);

  const stop = useCallback(() => {
    animationRef.current = null;
    frameController.cancelAnimationFrame();
  }, [frameController]);

  const reset = useCallback(() => {
    stop();
    updateState(setStyle, from);
  }, [from, stop]);

  const start = useCallback(() => {
    stop();

    animationRef.current = {
      startTime: Date.now(),
      isRunning: true,
      from: style, // Start from current style
      to,
    };

    const animate = (timestamp: number) => {
      if (!animationRef.current) return;

      const { startTime, from: startStyle, to: endStyle } = animationRef.current;
      const elapsed = timestamp - startTime;
      const progress = calculateAnimationProgress(elapsed, animationConfig);

      const eased = (animationConfig.easing || easing.linear)(progress);
      const newStyle: ViewStyle | TextStyle = {};

      // Interpolate numeric properties
      const allKeys = new Set([...Object.keys(startStyle), ...Object.keys(endStyle)]);
      for (const key of allKeys) {
        const startVal = (startStyle as Record<string, unknown>)[key];
        const endVal = (endStyle as Record<string, unknown>)[key];

        if (typeof startVal === 'number' && typeof endVal === 'number') {
          (newStyle as Record<string, unknown>)[key] = interpolate(startVal, endVal, eased);
        } else if (eased < 0.5) {
          (newStyle as Record<string, unknown>)[key] = startVal ?? endVal;
        } else {
          (newStyle as Record<string, unknown>)[key] = endVal ?? startVal;
        }
      }

      updateState(setStyle, newStyle);

      // Continue animation if not complete
      if (progress < 1 || animationConfig.iterations === Infinity) {
        frameController.requestAnimationFrame(animate);
      } else {
        animationRef.current = null;
      }
    };

    frameController.requestAnimationFrame(animate);
  }, [to, animationConfig, frameController, stop, style]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return [style, start, stop, reset];
}
