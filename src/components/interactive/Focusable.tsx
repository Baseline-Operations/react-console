/**
 * Focusable component - React Native-like focusable wrapper
 * Terminal equivalent for making any component focusable with tab navigation
 */

import type { ReactNode } from 'react';
import type { StyleProps, LayoutProps, ComponentEventHandlers, ViewStyle } from '../../types';
import { createConsoleNode, mergeClassNameAndStyle } from '../utils';

/**
 * Props for the Focusable component
 * 
 * Provides focusable wrapper for any content. Makes content accessible via
 * Tab navigation and supports focus/blur events.
 * 
 * @example
 * ```tsx
 * <Focusable onFocus={() => console.log('Focused!')}>
 *   <Text>Focusable Content</Text>
 * </Focusable>
 * ```
 */
export interface FocusableProps extends StyleProps, LayoutProps, ComponentEventHandlers {
  children?: ReactNode;
  style?: ViewStyle | ViewStyle[]; // CSS-like style (similar to React Native)
  disabled?: boolean; // Disable focus interaction (default: false)
  tabIndex?: number; // Tab order (auto-assigned if not set)
}

/**
 * Focusable component - React Native-like pattern for terminal
 * 
 * Makes any content focusable and accessible via Tab navigation.
 * Wraps content in a focusable box that can receive keyboard focus and
 * supports focus/blur events. Useful for making non-interactive content
 * focusable or creating custom focusable components.
 * 
 * @param props - Focusable component props
 * @returns React element representing a focusable container
 * 
 * @example
 * ```tsx
 * <Focusable
 *   onFocus={() => console.log('Focused!')}
 *   onBlur={() => console.log('Blurred!')}
 * >
 *   <Box style={{ border: 'single' }}>
 *     <Text>Focusable Content</Text>
 *   </Box>
 * </Focusable>
 * ```
 */
export function Focusable({ 
  children, 
  disabled = false, 
  tabIndex, 
  className,
  style,
  ...props 
}: FocusableProps) {
  // Focusable wraps content in a focusable box
  // Merge className with style prop and legacy props
  const mergedStyle = mergeClassNameAndStyle(className, style, props);
  
  return createConsoleNode('box', {
    style: mergedStyle as ViewStyle,
    layout: mergedStyle as LayoutProps,
    styles: mergedStyle,
    disabled,
    tabIndex,
    children,
  });
}
