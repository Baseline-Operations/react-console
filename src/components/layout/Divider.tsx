/**
 * Divider component - Horizontal or vertical line separator
 * Visual separator for grouping content in terminal layouts
 */

import React from 'react';
import { createConsoleNode } from '../utils';
import type { Color, ViewStyle } from '../../types';

/** Divider line style variants */
export type DividerStyle = 'solid' | 'dashed' | 'dotted' | 'double';

/** Divider orientation */
export type DividerOrientation = 'horizontal' | 'vertical';

/**
 * Character sets for different divider styles
 */
const DIVIDER_CHARS: Record<DividerStyle, { horizontal: string; vertical: string }> = {
  solid: { horizontal: '─', vertical: '│' },
  dashed: { horizontal: '╌', vertical: '╎' },
  dotted: { horizontal: '·', vertical: '·' },
  double: { horizontal: '═', vertical: '║' },
};

/**
 * Props for the Divider component
 */
export interface DividerProps {
  /** Orientation of the divider (default: 'horizontal') */
  orientation?: DividerOrientation;
  /** Visual style of the divider line (default: 'solid') */
  dividerStyle?: DividerStyle;
  /** Color of the divider line */
  color?: Color;
  /** Margin above and below (horizontal) or left and right (vertical) */
  margin?: number;
  /** Optional label to display in the center of the divider */
  label?: string;
  /** Color of the label text */
  labelColor?: Color;
  /** Additional style overrides */
  style?: ViewStyle;
  /** Width for horizontal dividers (default: '100%') */
  width?: number | string;
  /** Height for vertical dividers (default: 1) */
  height?: number;
}

/**
 * Divider component - Horizontal or vertical line separator
 *
 * Renders a visual separator for grouping content. Supports multiple line
 * styles (solid, dashed, dotted, double) and optional centered labels.
 *
 * @param props - Divider component props
 * @returns React element representing a divider line
 *
 * @example
 * ```tsx
 * // Simple horizontal divider
 * <Divider />
 *
 * // Styled divider with label
 * <Divider dividerStyle="dashed" color="gray" label="OR" />
 *
 * // Double line divider
 * <Divider dividerStyle="double" color="cyan" margin={1} />
 *
 * // Vertical divider in a Row
 * <Row>
 *   <Text>Left</Text>
 *   <Divider orientation="vertical" height={3} />
 *   <Text>Right</Text>
 * </Row>
 * ```
 */
export function Divider({
  orientation = 'horizontal',
  dividerStyle = 'solid',
  color,
  margin,
  label,
  labelColor,
  style,
  width,
  height,
}: DividerProps) {
  const chars = DIVIDER_CHARS[dividerStyle];
  const isVertical = orientation === 'vertical';

  if (isVertical) {
    // Vertical divider: render a column of vertical line characters
    const lineHeight = height ?? 1;
    const content = Array(lineHeight).fill(chars.vertical).join('\n');

    const verticalStyle: ViewStyle = {
      ...(margin !== undefined ? { marginLeft: margin, marginRight: margin } : {}),
      ...(color ? { color } : {}),
      ...style,
    };

    return createConsoleNode('text', {
      content,
      style: verticalStyle,
    });
  }

  // Horizontal divider
  if (label) {
    // Divider with centered label: ──── Label ────
    const containerStyle: ViewStyle = {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      width: width ?? '100%',
      ...(margin !== undefined ? { marginTop: margin, marginBottom: margin } : {}),
      ...style,
    };

    // Create the line segments and label as children
    const lineStyle: ViewStyle = {
      flex: 1,
      ...(color ? { color } : {}),
    };

    const labelStyle: ViewStyle = {
      ...(labelColor ? { color: labelColor } : color ? { color } : {}),
    };

    // Build as a box with text children for the lines and label
    return React.createElement(
      'box' as string,
      { style: containerStyle } as React.Attributes,
      React.createElement(
        'text' as string,
        {
          style: lineStyle,
          children: chars.horizontal.repeat(20),
        } as React.Attributes
      ),
      React.createElement(
        'text' as string,
        {
          style: labelStyle,
          children: ` ${label} `,
        } as React.Attributes
      ),
      React.createElement(
        'text' as string,
        {
          style: lineStyle,
          children: chars.horizontal.repeat(20),
        } as React.Attributes
      )
    );
  }

  // Simple horizontal divider (no label)
  const horizontalStyle: ViewStyle = {
    width: width ?? '100%',
    ...(margin !== undefined ? { marginTop: margin, marginBottom: margin } : {}),
    ...(color ? { color } : {}),
    ...style,
  };

  // Use a text node with repeated line character
  // Width handling will be done by the layout engine based on the width style
  return createConsoleNode('text', {
    content: chars.horizontal.repeat(200),
    style: {
      ...horizontalStyle,
      overflow: 'hidden',
    },
  });
}
