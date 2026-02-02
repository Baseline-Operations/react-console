/**
 * View component - React Native-like container for layout and styling
 * Terminal equivalent of React Native's View component
 *
 * Note: View is functionally identical to Box. Use Box for more explicit naming,
 * or View for React Native compatibility.
 */

import { memo } from 'react';
import type { ReactNode } from 'react';
import type { ViewStyle } from '../../types';
import { createConsoleNode, mergeClassNameAndStyle } from '../utils';

/**
 * Props for the View component
 *
 * View is an alias for Box with the same functionality. See BoxProps for details.
 *
 * @example
 * ```tsx
 * <View style={{ padding: 2, backgroundColor: 'cyan' }}>
 *   <Text>Content</Text>
 * </View>
 * ```
 */
export interface ViewProps {
  children?: ReactNode;
  style?: ViewStyle | ViewStyle[]; // CSS-like style (similar to React Native)
  className?: string | string[]; // Class names for style libraries
  fullscreen?: boolean; // Enable fullscreen mode for this container
  // Scrollbar props
  scrollable?: boolean; // Enable/disable scrolling for this View
  scrollbarVisibility?: 'auto' | 'always' | 'hidden'; // Scrollbar visibility mode ('auto' = show when scrolling, 'always' = always show, 'hidden' = never show)
  horizontalScrollbar?: 'auto' | 'always' | 'hidden'; // Horizontal scrollbar visibility (overrides scrollbarVisibility if set)
  verticalScrollbar?: 'auto' | 'always' | 'hidden'; // Vertical scrollbar visibility (overrides scrollbarVisibility if set)
  scrollbarChar?: string; // Character to use for scrollbar thumb (default: '█')
  scrollbarTrackChar?: string; // Character to use for scrollbar track (default: '░')
  scrollTop?: number; // Vertical scroll position
  scrollLeft?: number; // Horizontal scroll position
  // Legacy props (for backward compatibility)
  color?: ViewStyle['color'];
  backgroundColor?: ViewStyle['backgroundColor'];
  padding?: ViewStyle['padding'];
  margin?: ViewStyle['margin'];
  width?: ViewStyle['width'];
  height?: ViewStyle['height'];
  position?: ViewStyle['position'];
  top?: ViewStyle['top'];
  left?: ViewStyle['left'];
  right?: ViewStyle['right'];
  bottom?: ViewStyle['bottom'];
  zIndex?: ViewStyle['zIndex'];
}

/**
 * View component - React Native-like pattern for terminal
 * Block-level container for layout (functionally identical to Box)
 *
 * Use View for React Native compatibility, or Box for more explicit naming.
 * Both components have identical functionality and props.
 *
 * @param props - View component props (same as BoxProps)
 * @returns React element representing a View container
 *
 * @example
 * ```tsx
 * <View style={{ padding: 2 }}>
 *   <Text>Hello World</Text>
 * </View>
 * ```
 *
 * @see Box - For component with identical functionality
 */
function ViewComponent({
  children,
  style,
  className,
  fullscreen,
  scrollable,
  scrollbarVisibility,
  horizontalScrollbar,
  verticalScrollbar,
  scrollbarChar,
  scrollbarTrackChar,
  scrollTop,
  scrollLeft,
  ...legacyProps
}: ViewProps) {
  // Merge className with style prop and legacy props (className < style < legacy props)
  const mergedStyle = mergeClassNameAndStyle(className, style, legacyProps);

  return createConsoleNode('box', {
    style: mergedStyle,
    fullscreen,
    scrollable,
    scrollbarVisibility,
    horizontalScrollbar,
    verticalScrollbar,
    scrollbarChar,
    scrollbarTrackChar,
    scrollTop,
    scrollLeft,
    children,
  });
}

// Memoize View component for performance (stable component)
export const View = memo(ViewComponent);
