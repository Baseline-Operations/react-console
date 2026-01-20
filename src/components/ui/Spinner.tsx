/**
 * Spinner component - Animated loading indicator
 */

import { useEffect, useState } from 'react';
import type { StyleProps, TextStyle } from '../../types';
import { createConsoleNode, mergeClassNameAndStyle } from '../utils';

export type SpinnerStyle = 'dots' | 'line' | 'pulse' | 'spinner' | 'arrow';

export interface SpinnerProps extends StyleProps {
  spinnerStyle?: SpinnerStyle; // Spinner animation style (renamed to avoid conflict)
  style?: TextStyle | TextStyle[]; // CSS-like style (similar to React Native)
  className?: string | string[]; // Class names for style libraries
  label?: string;
  speed?: number; // Animation speed in ms (lower = faster)
  color?: string;
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
 * Spinner component - Animated loading indicator
 * 
 * Displays an animated spinner with different styles and optional label.
 * Automatically animates when rendered.
 * 
 * @param props - Spinner component props
 * @returns React element representing a spinner
 * 
 * @example
 * ```tsx
 * <Spinner label="Loading..." />
 * 
 * <Spinner style="dots" color="cyan" speed={80} />
 * ```
 */
export function Spinner({
  spinnerStyle = 'dots',
  className,
  style: cssStyle,
  label,
  speed = DEFAULT_SPEED,
  color = 'cyan',
  ...styleProps
}: SpinnerProps): ReturnType<typeof createConsoleNode> {
  const frames = SPINNER_FRAMES[spinnerStyle];
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    if (frames.length === 0) return;

    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, speed);

    return () => clearInterval(interval);
  }, [frames.length, speed]);

  const currentFrame = frames[frameIndex] || frames[0] || ' ';
  const content = label ? `${currentFrame} ${label}` : currentFrame;

  // Merge className with style prop and legacy style props
  const mergedStyle = mergeClassNameAndStyle(className, cssStyle, { color, ...styleProps }) as TextStyle;

  return createConsoleNode('text', {
    content,
    style: mergedStyle,
  });
}
