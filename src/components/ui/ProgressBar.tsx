/**
 * ProgressBar component - Visual progress indicator
 */

import type { StyleProps, ViewStyle } from '../../types';
import { createConsoleNode, mergeClassNameAndStyle } from '../utils';

export interface ProgressBarProps extends StyleProps {
  style?: ViewStyle | ViewStyle[]; // CSS-like style (similar to React Native)
  value: number; // 0-100
  max?: number; // Maximum value (default: 100)
  width?: number | string;
  label?: string;
  showPercentage?: boolean;
  filledColor?: string;
  emptyColor?: string;
  filledChar?: string;
  emptyChar?: string;
  orientation?: 'horizontal' | 'vertical';
}

const DEFAULT_FILLED_CHAR = '█';
const DEFAULT_EMPTY_CHAR = '░';
const DEFAULT_FILLED_COLOR = 'green';
const DEFAULT_EMPTY_COLOR = 'gray';

/**
 * ProgressBar component - Visual progress indicator
 *
 * Displays a horizontal or vertical progress bar with customizable appearance.
 *
 * @param props - ProgressBar component props
 * @returns React element representing a progress bar
 *
 * @example
 * ```tsx
 * <ProgressBar value={75} label="Uploading..." />
 *
 * <ProgressBar
 *   value={50}
 *   width={40}
 *   filledColor="cyan"
 *   showPercentage
 * />
 * ```
 */
export function ProgressBar({
  value,
  max = 100,
  width = 20,
  label,
  showPercentage = false,
  filledColor = DEFAULT_FILLED_COLOR,
  emptyColor = DEFAULT_EMPTY_COLOR,
  filledChar = DEFAULT_FILLED_CHAR,
  emptyChar = DEFAULT_EMPTY_CHAR,
  orientation = 'horizontal',
  className,
  style,
  ...styleProps
}: ProgressBarProps): ReturnType<typeof createConsoleNode> {
  // Merge className with style prop and legacy style props
  const mergedStyle = mergeClassNameAndStyle(className, style, styleProps);
  // Clamp value between 0 and max
  const clampedValue = Math.max(0, Math.min(max, value));
  const percentage = (clampedValue / max) * 100;

  // Resolve width if it's a responsive value
  let barWidth = typeof width === 'number' ? width : 20;
  if (typeof width === 'string') {
    // Simple percentage parsing (could be enhanced)
    const match = width.match(/^(\d+)%$/);
    if (match) {
      // Would need terminal dimensions - use default for now
      barWidth = 20;
    }
  }

  // Store progress bar configuration in node properties
  // Actual rendering will be handled by renderer
  return createConsoleNode('box', {
    style: {
      ...(mergedStyle as ViewStyle),
      display: orientation === 'vertical' ? 'flex' : 'row',
      flexDirection: orientation === 'vertical' ? 'column-reverse' : 'row',
    } as ViewStyle,
    // Store progress bar configuration in node properties for renderer
    // Note: Custom renderer support needed for full progress bar rendering
    progressValue: clampedValue,
    progressMax: max,
    progressPercentage: percentage,
    progressWidth: barWidth,
    progressLabel: label,
    progressShowPercentage: showPercentage,
    progressFilledColor: filledColor,
    progressEmptyColor: emptyColor,
    progressFilledChar: filledChar,
    progressEmptyChar: emptyChar,
    progressOrientation: orientation,
  });
}
