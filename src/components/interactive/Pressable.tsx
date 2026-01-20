/**
 * Pressable component - React Native-like pressable area
 * Terminal equivalent of React Native's Pressable component
 */

import type { ReactNode } from 'react';
import type { StyleProps, LayoutProps, ComponentEventHandlers, ViewStyle } from '../../types';
import { createConsoleNode, mergeClassNameAndStyle } from '../utils';

/**
 * Props for the Pressable component
 * 
 * Provides pressable wrapper for any content. Supports keyboard (Enter/Space)
 * and mouse clicks (if terminal supports it). Similar to Button but can wrap any content.
 * 
 * @example
 * ```tsx
 * <Pressable onClick={() => handlePress()}>
 *   <Text>Press me!</Text>
 * </Pressable>
 * ```
 */
export interface PressableProps extends StyleProps, LayoutProps, ComponentEventHandlers {
  children?: ReactNode;
  style?: ViewStyle | ViewStyle[]; // CSS-like style (similar to React Native)
  disabled?: boolean; // Disable pressable interaction (default: false)
  tabIndex?: number; // Tab order (auto-assigned if not set)
}

/**
 * Pressable component - React Native-like pattern for terminal
 * 
 * Provides pressable wrapper for any content. Can be pressed via keyboard
 * (Enter/Space when focused) or mouse clicks (if terminal supports it).
 * Similar to Button but can wrap any content, not just text.
 * 
 * `onPress` is an alias for `onClick` (React Native pattern).
 * 
 * @param props - Pressable component props
 * @returns React element representing a pressable container
 * 
 * @example
 * ```tsx
 * <Pressable onClick={() => handlePress()}>
 *   <Box style={{ border: 'single' }}>
 *     <Text>Pressable Content</Text>
 *   </Box>
 * </Pressable>
 * ```
 */
export function Pressable({ 
  children, 
  disabled = false, 
  tabIndex, 
  onClick, 
  onPress, 
  className,
  style,
  ...props 
}: PressableProps) {
  // Pressable is similar to Button but can wrap any content
  // onPress is an alias for onClick (React Native pattern)
  const handleClick = onClick || onPress;
  
  // Merge className with style prop and legacy props
  const mergedStyle = mergeClassNameAndStyle(className, style, props);

  return createConsoleNode('box', {
    style: mergedStyle as ViewStyle,
    layout: mergedStyle as LayoutProps,
    styles: mergedStyle,
    disabled,
    tabIndex,
    onClick: disabled ? undefined : handleClick,
    children,
  });
}
