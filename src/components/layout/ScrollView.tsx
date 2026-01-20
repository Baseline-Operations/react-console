/**
 * ScrollView component - React Native-like scrollable container
 * Terminal equivalent of React Native's ScrollView component
 */

import type { ReactNode } from 'react';
import type { LayoutProps, StyleProps, ViewStyle } from '../../types';
import { createConsoleNode, mergeClassNameAndStyle } from '../utils';

/**
 * Props for the ScrollView component
 * 
 * React Native-like scrollable container for overflow content.
 * Functionally identical to Scrollable but with React Native naming.
 * Supports horizontal and vertical scrolling with scroll indicators.
 * 
 * @example
 * ```tsx
 * <ScrollView scrollTop={10} maxHeight={20} horizontal={false}>
 *   <Text>Long content that overflows</Text>
 * </ScrollView>
 * ```
 */
export interface ScrollViewProps extends LayoutProps, StyleProps {
  children?: ReactNode;
  style?: ViewStyle | ViewStyle[]; // CSS-like style (similar to React Native)
  scrollTop?: number; // Vertical scroll position (default: 0)
  scrollLeft?: number; // Horizontal scroll position (default: 0)
  maxHeight?: number; // Maximum visible height (constrains scrolling)
  maxWidth?: number; // Maximum visible width (constrains scrolling)
  horizontal?: boolean; // Scroll horizontally instead of vertically (default: false)
  showsScrollIndicator?: boolean; // Show scroll indicators (default: true)
}

/**
 * ScrollView component - React Native-like pattern for terminal
 * 
 * React Native-compatible scrollable container for overflow content.
 * Functionally identical to Scrollable but uses React Native naming conventions.
 * Supports horizontal and vertical scrolling with scroll position control.
 * 
 * @param props - ScrollView component props
 * @returns React element representing a scrollable container
 * 
 * @example
 * ```tsx
 * <ScrollView scrollTop={scrollPosition} maxHeight={20}>
 *   <Text>Long content that overflows</Text>
 * </ScrollView>
 * ```
 * 
 * @see Scrollable - For component with identical functionality
 */
export function ScrollView({
  children,
  scrollTop = 0,
  scrollLeft = 0,
  maxHeight,
  maxWidth,
  horizontal = false,
  showsScrollIndicator: _showsScrollIndicator = true,
  className,
  style,
  ...props
}: ScrollViewProps) {
  // Merge className with style prop and legacy props
  const mergedStyle = mergeClassNameAndStyle(className, style, props);
  
  // ScrollView is the same as Scrollable but with React Native naming
  return createConsoleNode('scrollable', {
    scrollTop: horizontal ? scrollLeft : scrollTop,
    scrollLeft: horizontal ? scrollTop : scrollLeft,
    maxHeight,
    maxWidth,
    style: mergedStyle as ViewStyle,
    layout: mergedStyle as LayoutProps,
    styles: mergedStyle,
    children,
  });
}
