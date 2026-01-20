/**
 * Animated component - Wrapper for animating any component
 * Provides animation capabilities for terminal components
 */

import { type ReactNode, useState, useEffect, useRef } from 'react';
import type { ViewStyle, TextStyle, StyleProps } from '../types';
import { createConsoleNode } from './utils';
import {
  type AnimationType,
  createAnimationConfig,
  calculateAnimationProgress,
  FrameRateController,
  easing,
} from '../utils/animations';
import { mergeClassNameAndStyle } from './utils';

export interface AnimatedProps extends StyleProps {
  children?: ReactNode;
  type?: AnimationType; // Animation type
  direction?: 'in' | 'out' | 'inOut'; // Animation direction
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
  
  const [, setProgress] = useState(0);
  const frameController = useRef(new FrameRateController(10)).current;
  const animationRef = useRef<{
    startTime: number;
    isRunning: boolean;
    started: boolean;
    completed: boolean;
  } | null>(null);
  
  // Calculate animated style based on type and progress
  const getAnimatedStyle = (): ViewStyle | TextStyle => {
    const baseStyle = mergeClassNameAndStyle(className, style, styleProps) || {};
    
    if (!animationRef.current?.isRunning) {
      return baseStyle;
    }
    
    const animatedProgress = calculateAnimationProgress(
      Date.now() - (animationRef.current?.startTime || 0),
      animationConfig
    );
    
    switch (type) {
      case 'fade':
        // Fade in/out using color intensity (dim property)
        return {
          ...baseStyle,
          dim: direction === 'out' ? animatedProgress > 0.5 : animatedProgress < 0.5,
        } as ViewStyle | TextStyle;
        
      case 'slide':
        // Slide animation (would need position changes - simplified here)
        return baseStyle;
        
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
      
      setProgress(currentProgress);
      
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
  }, [autoPlay]); // Only depend on autoPlay
  
  // Render children with animated style
  // In a full implementation, this would properly wrap the children
  // For now, we'll just return a box with the animated style
  return createConsoleNode('box', {
    style: getAnimatedStyle() as ViewStyle,
    children,
  });
}
