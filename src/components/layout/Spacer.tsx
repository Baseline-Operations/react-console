/**
 * Spacer component - Flexible spacing that expands to fill available space
 * Terminal equivalent of a flexible spacer in flex containers
 */

import { createConsoleNode } from '../utils';
import type { ViewStyle } from '../../types';

/**
 * Props for the Spacer component
 */
export interface SpacerProps {
  /** Fixed width in characters (overrides flex behavior) */
  width?: number;
  /** Fixed height in lines (overrides flex behavior) */
  height?: number;
  /** Flex value for proportional sizing (default: 1) */
  flex?: number;
}

/**
 * Spacer component - Flexible spacing for flex containers
 *
 * Expands to fill available space in a flex container. Useful for pushing
 * items apart or creating proportional spacing between elements.
 *
 * - When no props are provided, defaults to `flex: 1` (fills all available space)
 * - When `width` or `height` is provided, renders as a fixed-size empty box
 * - When `flex` is provided, uses proportional sizing
 *
 * Works in both `Row` (horizontal) and `Column` (vertical) containers.
 *
 * @param props - Spacer component props
 * @returns React element representing an empty spacer
 *
 * @example
 * ```tsx
 * // Push button to the right
 * <Row>
 *   <Text>Title</Text>
 *   <Spacer />
 *   <Button label="Action" />
 * </Row>
 *
 * // Even spacing between items
 * <Row>
 *   <Text>Left</Text>
 *   <Spacer />
 *   <Text>Center</Text>
 *   <Spacer />
 *   <Text>Right</Text>
 * </Row>
 *
 * // Fixed vertical spacing
 * <Column>
 *   <Text>Header</Text>
 *   <Spacer height={2} />
 *   <Text>Content</Text>
 * </Column>
 *
 * // Proportional spacing
 * <Row>
 *   <Text>A</Text>
 *   <Spacer flex={1} />
 *   <Text>B</Text>
 *   <Spacer flex={2} />
 *   <Text>C</Text>
 * </Row>
 * ```
 */
export function Spacer({ width, height, flex }: SpacerProps = {}) {
  const style: ViewStyle = {};

  if (width !== undefined) {
    style.width = width;
  }

  if (height !== undefined) {
    style.height = height;
  }

  // If no fixed dimensions are provided, use flex to fill space
  if (width === undefined && height === undefined) {
    style.flex = flex ?? 1;
  }

  return createConsoleNode('box', {
    style,
  });
}
