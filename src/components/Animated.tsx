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

// Grayscale colors for fade effect (dark to bright)
const FADE_COLORS = [
  '#1a1a1a', // Very dark gray (almost black)
  '#333333', // Dark gray
  '#4d4d4d', // Medium-dark gray
  '#666666', // Medium gray
  '#808080', // Gray
  '#999999', // Medium-light gray
  '#b3b3b3', // Light gray
  '#cccccc', // Very light gray
  '#e6e6e6', // Near white
  '#ffffff', // White
];

// Import reconciler for discrete updates
let reconciler: any = null;
try {
  reconciler = require('../renderer/reconciler').reconciler;
} catch {
  // Reconciler may not be available
}

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
  
  // Use React.useState directly to ensure we get the patched version
  const [, setProgress] = React.useState(0);
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
      case 'fade': {
        // Fade in/out using color interpolation
        // For fade-in: interpolate from dark (invisible) to the target color
        // For fade-out: interpolate from the target color to dark (invisible)
        const targetColor = (baseStyle as any).color || '#ffffff';
        const darkColor = '#000000'; // Start from black (invisible against dark bg)
        
        let fadeProgress = animatedProgress;
        if (direction === 'out') {
          fadeProgress = 1 - animatedProgress;
        } else if (direction === 'inOut') {
          // Fade in first half, fade out second half
          fadeProgress = animatedProgress < 0.5 
            ? animatedProgress * 2 
            : 2 - animatedProgress * 2;
        }
        
        // Use grayscale interpolation for a smoother fade effect
        const colorIndex = Math.min(
          FADE_COLORS.length - 1, 
          Math.floor(fadeProgress * FADE_COLORS.length)
        );
        const fadeColor = FADE_COLORS[colorIndex];
        
        // If there's a specific target color, interpolate towards it
        const finalColor = targetColor !== '#ffffff' && targetColor !== 'white'
          ? interpolateColor(darkColor, targetColor, fadeProgress)
          : fadeColor;
        
        return {
          ...baseStyle,
          color: finalColor,
          // Also use dim for very low progress to enhance the effect
          dim: fadeProgress < 0.3,
        } as ViewStyle | TextStyle;
      }
        
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
      
      // Just call setProgress - React.useState is already patched
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
  
  // Get animated style
  const animatedStyle = getAnimatedStyle();
  
  // For fade animations, we need to apply color to text children
  // Clone children and inject the animated style
  const enhancedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return child;
    }
    
    // For Text elements, merge the animated color/dim properties
    const childProps = child.props as Record<string, unknown>;
    const childType = child.type as { displayName?: string } | string;
    const typeName = typeof childType === 'string' 
      ? childType 
      : childType.displayName || (childType as any).name || '';
    
    if (typeName === 'Text' || typeName === 'text') {
      const mergedStyle = {
        ...(childProps.style || {}),
        color: (animatedStyle as any).color || (childProps.style as any)?.color,
        dim: (animatedStyle as any).dim,
      };
      return React.cloneElement(child, {
        ...childProps,
        style: mergedStyle,
        color: (animatedStyle as any).color || childProps.color,
        dim: (animatedStyle as any).dim !== undefined ? (animatedStyle as any).dim : childProps.dim,
      } as any);
    }
    
    // For other elements, just pass through
    return child;
  });
  
  // Render children with animated style wrapper
  return createConsoleNode('box', {
    style: animatedStyle as ViewStyle,
    children: enhancedChildren,
  });
}
