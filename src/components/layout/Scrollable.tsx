/**
 * Scrollable component - container with scroll support for overflow content
 */

import type { ReactNode } from 'react';
import type { LayoutProps, StyleProps, ViewStyle } from '../../types';
import { createConsoleNode, mergeClassNameAndStyle } from '../utils';

/**
 * Props for the Scrollable component
 *
 * Provides scrollable container functionality for overflow content.
 * Supports vertical and horizontal scrolling with scroll position control.
 *
 * @example
 * ```tsx
 * <Scrollable scrollTop={10} maxHeight={20}>
 *   <Text>Long content that overflows</Text>
 * </Scrollable>
 * ```
 */
export interface ScrollableProps extends LayoutProps, StyleProps {
  children?: ReactNode;
  style?: ViewStyle | ViewStyle[]; // CSS-like style (similar to React Native)
  scrollTop?: number; // Vertical scroll position (default: 0)
  scrollLeft?: number; // Horizontal scroll position (default: 0)
  maxHeight?: number; // Maximum visible height (constrains scrolling)
  maxWidth?: number; // Maximum visible width (constrains scrolling)
}

/**
 * Scrollable component - Container with scroll support for overflow content
 *
 * Provides scrollable container for content that overflows visible area.
 * Supports vertical and horizontal scrolling with scroll position control.
 * Content beyond maxHeight/maxWidth is accessible via scrolling.
 *
 * @param props - Scrollable component props
 * @returns React element representing a scrollable container
 *
 * @example
 * ```tsx
 * <Scrollable scrollTop={scrollPosition} maxHeight={20}>
 *   <Text>Long content that overflows</Text>
 * </Scrollable>
 * ```
 */
export function Scrollable({
  children,
  scrollTop = 0,
  scrollLeft = 0,
  maxHeight,
  maxWidth,
  className,
  style,
  ...props
}: ScrollableProps) {
  // Merge className with style prop and legacy props
  const mergedStyle = mergeClassNameAndStyle(className, style, props);

  return createConsoleNode('scrollable', {
    scrollTop,
    scrollLeft,
    maxHeight,
    maxWidth,
    style: mergedStyle as ViewStyle,
    layout: mergedStyle as LayoutProps,
    styles: mergedStyle,
    children,
  });
}
