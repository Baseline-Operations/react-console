/**
 * Box component - container for layout and styling
 * Terminal equivalent of a block-level container with support for borders, padding, flexbox, grid, and scrollbars
 */

import type { ReactNode } from 'react';
import type { ViewStyle } from '../../types';
import { createConsoleNode, mergeClassNameAndStyle } from '../utils';

/**
 * Props for the Box component
 * 
 * @example
 * ```tsx
 * <Box
 *   style={{ border: 'single', padding: 2, backgroundColor: 'blue' }}
 *   scrollable={true}
 *   scrollbarVisibility="auto"
 * >
 *   <Text>Content here</Text>
 * </Box>
 * ```
 */
export interface BoxProps {
  children?: ReactNode;
  style?: ViewStyle | ViewStyle[]; // CSS-like style (similar to React Native)
  className?: string | string[]; // Class names for style libraries
  fullscreen?: boolean; // Enable fullscreen mode for this container
  // Scrollbar props
  scrollable?: boolean; // Enable/disable scrolling for this Box
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
 * Box component - Container for layout and styling with full layout support
 * 
 * Similar to React Native's View component, provides a block-level container with:
 * - CSS-like styling (flexbox, grid, borders, padding, margins)
 * - Responsive sizing (percentages, viewport units)
 * - Scrollbar support (horizontal and vertical)
 * - Position support (absolute, relative, fixed)
 * 
 * @param props - Box component props
 * @returns React element representing a Box container
 * 
 * @example
 * ```tsx
 * // Basic box with border
 * <Box style={{ border: 'single', padding: 2 }}>
 *   <Text>Content</Text>
 * </Box>
 * 
 * // Scrollable box with scrollbars
 * <Box
 *   scrollable={true}
 *   scrollbarVisibility="auto"
 *   scrollTop={10}
 *   style={{ width: 50, height: 20 }}
 * >
 *   <Text>Long content that overflows</Text>
 * </Box>
 * 
 * // Flexbox layout
 * <Box style={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
 *   <Text>Item 1</Text>
 *   <Text>Item 2</Text>
 * </Box>
 * ```
 */
export function Box({ 
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
}: BoxProps) {
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
