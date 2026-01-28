/**
 * ScrollView component - React Native-like scrollable container
 * Terminal equivalent of React Native's ScrollView component
 */

import type { ReactNode } from 'react';
import type { LayoutProps, StyleProps, ViewStyle } from '../../types';
import { createConsoleNode, mergeClassNameAndStyle } from '../utils';

/**
 * Scrollbar style configuration
 */
export interface ScrollbarStyle {
  /** Scrollbar track color */
  trackColor?: string;
  /** Scrollbar thumb/indicator color */
  thumbColor?: string;
  /** Scrollbar width (1-3 characters, default: 1) */
  width?: number;
  /** Character to use for track (default: '│') */
  trackChar?: string;
  /** Character to use for thumb (default: '█') */
  thumbChar?: string;
}

/**
 * Props for the ScrollView component
 * 
 * React Native-like scrollable container for overflow content.
 * Extends View with scrolling capability and optional scrollbar.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <ScrollView maxHeight={20}>
 *   <Text>Long content that overflows</Text>
 * </ScrollView>
 * 
 * // With scrollbar styling
 * <ScrollView 
 *   maxHeight={20} 
 *   showsVerticalScrollIndicator
 *   scrollbarStyle={{ thumbColor: 'cyan', trackColor: 'gray' }}
 * >
 *   <Text>Scrollable content</Text>
 * </ScrollView>
 * 
 * // Controlled scroll position
 * <ScrollView scrollTop={scrollY} onScroll={setScrollY}>
 *   <Text>Content</Text>
 * </ScrollView>
 * ```
 */
export interface ScrollViewProps extends LayoutProps, StyleProps {
  children?: ReactNode;
  /** CSS-like style (similar to React Native) */
  style?: ViewStyle | ViewStyle[];
  /** Content container style */
  contentContainerStyle?: ViewStyle;
  
  // Scroll position
  /** Vertical scroll offset (default: 0) */
  scrollTop?: number;
  /** Horizontal scroll offset (default: 0) */
  scrollLeft?: number;
  /** Callback when scroll position changes */
  onScroll?: (scrollTop: number, scrollLeft: number) => void;
  
  // Constraints
  /** Maximum visible height (enables vertical scrolling) */
  maxHeight?: number;
  /** Maximum visible width (enables horizontal scrolling) */
  maxWidth?: number;
  
  // Scroll direction
  /** Enable horizontal scrolling (default: false) */
  horizontal?: boolean;
  
  // Scroll indicators (React Native compatible naming)
  /** Show vertical scroll indicator (default: true when content overflows) */
  showsVerticalScrollIndicator?: boolean;
  /** Show horizontal scroll indicator (default: true when content overflows) */
  showsHorizontalScrollIndicator?: boolean;
  /** Legacy: Show scroll indicator (maps to vertical/horizontal based on direction) */
  showsScrollIndicator?: boolean;
  
  // Scrollbar styling
  /** Custom scrollbar appearance */
  scrollbarStyle?: ScrollbarStyle;
  
  // Behavior
  /** Scroll to end when content changes (default: false) */
  scrollToEnd?: boolean;
  /** Enable keyboard scrolling when focused (default: true) */
  keyboardScrollEnabled?: boolean;
  /** Lines to scroll per key press (default: 1) */
  scrollStep?: number;
}

/**
 * ScrollView component - React Native-like pattern for terminal
 * 
 * Extends View with scrolling capability. Content that exceeds maxHeight/maxWidth
 * becomes scrollable. Supports both controlled (scrollTop prop) and uncontrolled modes.
 * 
 * @param props - ScrollView component props
 * @returns React element representing a scrollable container
 * 
 * @example
 * ```tsx
 * // Simple scrollable list
 * <ScrollView maxHeight={10}>
 *   {items.map(item => <Text key={item.id}>{item.name}</Text>)}
 * </ScrollView>
 * 
 * // With custom scrollbar
 * <ScrollView 
 *   maxHeight={15}
 *   showsVerticalScrollIndicator
 *   scrollbarStyle={{
 *     thumbColor: 'blue',
 *     trackColor: 'gray',
 *     thumbChar: '●',
 *     trackChar: '│'
 *   }}
 * >
 *   <Text>Content here...</Text>
 * </ScrollView>
 * ```
 */
export function ScrollView({
  children,
  style,
  contentContainerStyle,
  scrollTop = 0,
  scrollLeft = 0,
  onScroll,
  maxHeight,
  maxWidth,
  horizontal = false,
  showsVerticalScrollIndicator,
  showsHorizontalScrollIndicator,
  showsScrollIndicator = true,
  scrollbarStyle,
  scrollToEnd = false,
  keyboardScrollEnabled = true,
  scrollStep = 1,
  className,
  ...props
}: ScrollViewProps) {
  // Merge className with style prop and legacy props
  const mergedStyle = mergeClassNameAndStyle(className, style, props);
  
  // Determine which indicators to show
  const showVertical = showsVerticalScrollIndicator ?? (!horizontal && showsScrollIndicator);
  const showHorizontal = showsHorizontalScrollIndicator ?? (horizontal && showsScrollIndicator);
  
  return createConsoleNode('scrollview', {
    scrollTop: horizontal ? scrollLeft : scrollTop,
    scrollLeft: horizontal ? scrollTop : scrollLeft,
    onScroll,
    maxHeight,
    maxWidth,
    horizontal,
    showsVerticalScrollIndicator: showVertical,
    showsHorizontalScrollIndicator: showHorizontal,
    scrollbarStyle,
    scrollToEnd,
    keyboardScrollEnabled,
    scrollStep,
    contentContainerStyle,
    style: mergedStyle as ViewStyle,
    layout: mergedStyle as LayoutProps,
    styles: mergedStyle,
    children,
  });
}
