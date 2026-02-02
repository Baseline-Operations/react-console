/**
 * Animated component - Wrapper for animating any component
 * Provides animation capabilities for terminal components
 */

import React, { type ReactNode, useEffect, useRef } from 'react';
import type { ViewStyle, TextStyle, StyleProps } from '../types';
import { createConsoleNode } from './utils';
import {
  type AnimationType,
  createAnimationConfig,
  calculateAnimationProgress,
  FrameRateController,
  easing,
  interpolateColor,
} from '../utils/animations';
import { mergeClassNameAndStyle } from './utils';

export interface AnimatedProps extends StyleProps {
  children?: ReactNode;
  type?: AnimationType; // Animation type
  direction?: 'in' | 'out' | 'inOut'; // Animation direction
  from?: 'left' | 'right' | 'top' | 'bottom'; // For slide: where to slide from
  distance?: number; // For slide: how far to slide (in characters)
  duration?: number; // Duration in milliseconds
  delay?: number; // Delay before starting
  iterations?: number; // Number of iterations (Infinity for infinite)
  easing?: (t: number) => number; // Easing function
  autoPlay?: boolean; // Start animation automatically (default: true)
  style?: ViewStyle | TextStyle | (ViewStyle | TextStyle)[]; // CSS-like style
  className?: string | string[]; // Class names for style libraries
  onAnimationStart?: () => void; // Called when animation starts
  onAnimationEnd?: () => void; // Called when animation ends
  onAnimationComplete?: () => void; // Called when animation completes all iterations
}

/**
 * Animated component - Wrapper for animating any component
 *
 * Provides animation capabilities for terminal components with support for
 * fade, slide, pulse, and other animation types.
 *
 * @example
 * ```tsx
 * <Animated type="fade" duration={1000} autoPlay>
 *   <Text>Fading in</Text>
 * </Animated>
 *
 * <Animated type="slide" direction="in" duration={500}>
 *   <Box>Sliding in</Box>
 * </Animated>
 * ```
 */
export function Animated({
  children,
  type = 'fade',
  direction = 'in',
  from = 'left',
  distance = 20,
  duration = 1000,
  delay = 0,
  iterations = 1,
  easing: easingFn = easing.linear,
  autoPlay = true,
  style,
  className,
  onAnimationStart,
  onAnimationEnd,
  onAnimationComplete,
  ...styleProps
}: AnimatedProps) {
  const animationConfig = createAnimationConfig({
    duration,
    delay,
    easing: easingFn,
    iterations,
    direction,
  });

  // Use React.useState directly to ensure we get the patched version
  // Store the computed style directly to avoid batching issues
  const [animatedState, setAnimatedState] = React.useState<{
    progress: number;
    style: ViewStyle | TextStyle;
  }>({ progress: 0, style: {} });
  const frameController = useRef(new FrameRateController(10)).current;
  const animationRef = useRef<{
    startTime: number;
    isRunning: boolean;
    started: boolean;
    completed: boolean;
  } | null>(null);

  const baseStyle = mergeClassNameAndStyle(className, style, styleProps) || {};

  // Compute style for a given progress value
  const computeStyleForProgress = (animatedProgress: number): ViewStyle | TextStyle => {
    switch (type) {
      case 'fade': {
        // Fade in/out using color interpolation
        // Note: calculateAnimationProgress already handles direction, so progress
        // goes 0->1 for 'in' and 1->0 for 'out'. We always interpolate dark->bright.
        const targetColor = (baseStyle as TextStyle).color || '#ffffff';
        const darkColor = '#000000';

        // Always interpolate from dark to target based on progress
        // For 'in': progress goes 0->1, so dark->bright
        // For 'out': progress goes 1->0 (inverted by calculateAnimationProgress), so bright->dark
        const finalColor = interpolateColor(darkColor, targetColor, animatedProgress);

        return {
          ...baseStyle,
          color: finalColor,
          // Use dim for low progress (dark colors) to enhance the effect
          dim: animatedProgress < 0.3,
        } as ViewStyle | TextStyle;
      }

      case 'slide': {
        // Slide animation using margin/position offsets
        // Note: calculateAnimationProgress already handles direction
        // For 'in': progress 0->1, so off-screen -> on-screen
        // For 'out': progress 1->0 (inverted), so on-screen -> off-screen

        // Calculate remaining distance: at progress=0 max distance, at progress=1 no distance
        const remainingDistance = Math.round(distance * (1 - animatedProgress));

        let marginLeft = 0;
        let marginTop = 0;

        switch (from) {
          case 'left':
            marginLeft = -remainingDistance;
            break;
          case 'right':
            marginLeft = remainingDistance;
            break;
          case 'top':
            marginTop = -remainingDistance;
            break;
          case 'bottom':
            marginTop = remainingDistance;
            break;
        }

        // Use position: relative with offsets for smooth sliding
        return {
          ...baseStyle,
          position: 'relative',
          left: marginLeft,
          top: marginTop,
          // Also fade during slide for a nicer effect
          dim: animatedProgress < 0.3,
        } as ViewStyle | TextStyle;
      }

      case 'pulse':
        // Pulse effect using dim/bright toggle
        const pulseProgress = animatedProgress % 1;
        return {
          ...baseStyle,
          dim: pulseProgress > 0.5,
        } as ViewStyle | TextStyle;

      case 'blink':
        // Blink effect
        const blinkProgress = animatedProgress % 1;
        return {
          ...baseStyle,
          dim: blinkProgress > 0.5,
        } as ViewStyle | TextStyle;

      default:
        return baseStyle;
    }
  };

  // Get the current animated style (uses stored state or computes initial/final state)
  const getAnimatedStyle = (): ViewStyle | TextStyle => {
    if (!animationRef.current?.isRunning) {
      // Check if animation completed - return final state
      // For 'in': completed at progress=1 (visible)
      // For 'out': completed at progress=0 (hidden) - but calculateAnimationProgress inverts it
      if (animationRef.current?.completed) {
        // For 'out', animation ends at progress=0 (from inverted 1->0)
        // For 'in', animation ends at progress=1
        return computeStyleForProgress(direction === 'out' ? 0 : 1);
      }

      // Initial state before animation starts
      // For 'out': start visible (progress=1 before inversion makes it look like 1)
      // For 'in': start hidden (progress=0)
      return computeStyleForProgress(direction === 'out' ? 1 : 0);
    }

    // Animation is running - use stored style from state
    return animatedState.style || baseStyle;
  };

  const startAnimation = () => {
    if (animationRef.current?.isRunning) return;

    animationRef.current = {
      startTime: Date.now(),
      isRunning: true,
      started: false,
      completed: false,
    };

    if (onAnimationStart) {
      onAnimationStart();
    }

    animationRef.current.started = true;

    const animate = (timestamp: number) => {
      if (!animationRef.current) return;

      const elapsed = timestamp - (animationRef.current.startTime || 0);
      const currentProgress = calculateAnimationProgress(elapsed, animationConfig);

      // Compute the animated style immediately with current progress
      const computedStyle = computeStyleForProgress(currentProgress);

      // Update state with both progress and computed style
      setAnimatedState({ progress: currentProgress, style: computedStyle });

      // Check if animation completed
      const iterations = animationConfig.iterations || 1;
      if (iterations !== Infinity && currentProgress >= 1 && !animationRef.current.completed) {
        animationRef.current.completed = true;
        if (onAnimationComplete) {
          onAnimationComplete();
        }
        if (onAnimationEnd) {
          onAnimationEnd();
        }
        animationRef.current.isRunning = false;
        return;
      }

      // Continue animation
      if (animationRef.current.isRunning) {
        frameController.requestAnimationFrame(animate);
      }
    };

    frameController.requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (autoPlay) {
      startAnimation();
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.isRunning = false;
      }
      frameController.cancelAnimationFrame();
    };
    // Intentionally only depend on autoPlay - startAnimation and frameController are stable
    // (frameController from useRef, startAnimation should not re-trigger on every prop change)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay]);

  // Get animated style
  const animatedStyle = getAnimatedStyle();

  // For fade animations, we need to apply color to all children
  // Clone children and inject the animated style
  const enhancedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return child;
    }

    // Clone ALL children with the animated color/dim properties
    // This ensures the animation affects Text elements and any custom components
    const childProps = child.props as Record<string, unknown>;
    const textStyle = animatedStyle as TextStyle;
    const mergedStyle = {
      ...((childProps.style as object) || {}),
      color: textStyle.color,
      dim: textStyle.dim,
    };

    return React.cloneElement(child, {
      ...childProps,
      style: mergedStyle,
      color: textStyle.color,
      dim: textStyle.dim,
    } as React.Attributes);
  });

  // Render children with animated style wrapper
  return createConsoleNode('box', {
    style: animatedStyle as ViewStyle,
    children: enhancedChildren,
  });
}
