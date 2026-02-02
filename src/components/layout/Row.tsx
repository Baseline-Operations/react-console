/**
 * Row component - Horizontal container (shorthand for flex row)
 */

import { type ReactNode } from 'react';
import { createConsoleNode, mergeClassNameAndStyle } from '../utils';
import type { ComponentEventHandlers, StyleProps, ViewStyle } from '../../types';

export interface RowProps extends ComponentEventHandlers, StyleProps {
  children?: ReactNode;
  style?: ViewStyle;
  className?: string | string[]; // Class names for style libraries
  gap?: number;
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
}

/**
 * Row component - Horizontal flex container
 *
 * Shorthand for `<View style={{ display: 'flex', flexDirection: 'row' }}>`
 *
 * @example
 * ```tsx
 * <Row gap={2} alignItems="center">
 *   <Text>Item 1</Text>
 *   <Text>Item 2</Text>
 * </Row>
 * ```
 */
export function Row({
  children,
  style,
  className,
  gap,
  alignItems,
  justifyContent,
  ...handlers
}: RowProps) {
  // Merge className with style prop
  const mergedStyle = mergeClassNameAndStyle(className, {
    display: 'flex',
    flexDirection: 'row',
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
