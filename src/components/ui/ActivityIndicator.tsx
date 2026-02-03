/**
 * ActivityIndicator component - Animated loading indicator (React Native compatible)
 */

import { useEffect, useState } from 'react';
import type { StyleProps, TextStyle } from '../../types';
import { createConsoleNode, mergeClassNameAndStyle } from '../utils';

/**
 * Animation style type for the terminal spinner
 */
export type SpinnerStyle = 'dots' | 'line' | 'pulse' | 'spinner' | 'arrow';

/**
 * React Native compatible ActivityIndicator props
 */
export interface ActivityIndicatorProps extends StyleProps {
  // React Native compatible props
  /** Whether to show the indicator (React Native compatible) */
  animating?: boolean;
  /** Color of the spinner (React Native compatible) */
  color?: string;
  /** Size of the indicator - 'small' | 'large' (React Native compatible, maps to animation styles) */
  size?: 'small' | 'large' | number;
  /** Whether to hide the indicator when not animating (React Native compatible) */
  hidesWhenStopped?: boolean;

  // Terminal-specific props
  /** Spinner animation style */
  spinnerStyle?: SpinnerStyle;
  /** CSS-like style (similar to React Native) */
  style?: TextStyle | TextStyle[];
  /** Class names for style libraries */
  className?: string | string[];
  /** Label to display next to spinner */
  label?: string;
  /** Animation speed in ms (lower = faster) */
  speed?: number;
}

const SPINNER_FRAMES: Record<SpinnerStyle, string[]> = {
  dots: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
  line: ['-', '\\', '|', '/'],
  pulse: ['●', '○', '○', '○'],
  spinner: ['◐', '◓', '◑', '◒'],
  arrow: ['←', '↖', '↑', '↗', '→', '↘', '↓', '↙'],
};

const DEFAULT_SPEED = 100;

/**
 * ActivityIndicator component - Animated loading indicator
 *
 * React Native compatible loading indicator. Displays an animated spinner
 * with different styles and optional label. Automatically animates when rendered.
 *
 * @param props - ActivityIndicator component props
 * @returns React element representing a loading indicator
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ActivityIndicator />
 *
 * // With color and size
 * <ActivityIndicator color="#00ff00" size="large" />
 *
 * // With label (terminal-specific)
 * <ActivityIndicator label="Loading..." color="cyan" />
 *
 * // Conditional display
 * <ActivityIndicator animating={isLoading} />
 * ```
 */
export function ActivityIndicator({
  animating = true,
  color = 'cyan',
  size = 'small',
  hidesWhenStopped = true,
  spinnerStyle,
  className,
  style: cssStyle,
  label,
  speed = DEFAULT_SPEED,
  ...styleProps
}: ActivityIndicatorProps): ReturnType<typeof createConsoleNode> | null {
  // Map size to spinner style if not explicitly set
  const effectiveStyle = spinnerStyle ?? (size === 'large' ? 'dots' : 'line');
  const frames = SPINNER_FRAMES[effectiveStyle];

  // Hooks must be called unconditionally (before any early returns)
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    if (!animating || frames.length === 0) return;

    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, speed);

    return () => clearInterval(interval);
  }, [animating, frames.length, speed]);

  // Hide when not animating if hidesWhenStopped is true
  if (!animating && hidesWhenStopped) {
    return null;
  }

  const currentFrame = animating ? frames[frameIndex] || frames[0] || ' ' : frames[0] || ' ';
  const content = label ? `${currentFrame} ${label}` : currentFrame;

  // Merge className with style prop and legacy style props
  const mergedStyle = mergeClassNameAndStyle(className, cssStyle, {
    color,
    ...styleProps,
  }) as TextStyle;

  return createConsoleNode('text', {
    content,
    style: mergedStyle,
  });
}

// Backwards compatibility aliases
/** @deprecated Use ActivityIndicator instead */
export const Spinner = ActivityIndicator;
/** @deprecated Use ActivityIndicatorProps instead */
export type SpinnerProps = ActivityIndicatorProps;
