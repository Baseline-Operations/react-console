/**
 * Column component - Vertical container (shorthand for flex column)
 */

import { type ReactNode } from 'react';
import { createConsoleNode, mergeClassNameAndStyle } from '../utils';
import type { ComponentEventHandlers, StyleProps, ViewStyle } from '../../types';

export interface ColumnProps extends ComponentEventHandlers, StyleProps {
  children?: ReactNode;
  style?: ViewStyle;
  className?: string | string[]; // Class names for style libraries
  gap?: number;
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
}

/**
 * Column component - Vertical flex container
 * 
 * Shorthand for `<View style={{ display: 'flex', flexDirection: 'column' }}>`
 * 
 * @example
 * ```tsx
 * <Column gap={1} alignItems="stretch">
 *   <Text>Item 1</Text>
 *   <Text>Item 2</Text>
 * </Column>
 * ```
 */
export function Column({
  children,
  style,
  className,
  gap,
  alignItems,
  justifyContent,
  ...handlers
}: ColumnProps) {
  // Merge className with style prop
  const mergedStyle = mergeClassNameAndStyle(className, {
    display: 'flex',
    flexDirection: 'column',
    gap,
    alignItems,
    justifyContent,
    ...style,
  });
  
  return createConsoleNode('box', {
    children,
    style: mergedStyle,
    ...handlers,
  });
}
