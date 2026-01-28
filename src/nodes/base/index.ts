/**
 * Base node exports
 */

export { Node } from './Node';
// Export types but exclude Dimensions to avoid conflict
export type {
  Position,
  DisplayMode,
  BorderStyle,
  TextAlign,
  Overflow,
  FlexDirection,
  JustifyContent,
  AlignItems,
  MouseButton,
  MouseAction,
  Margin,
  Padding,
  BorderWidth,
  BorderShow,
  BorderConfig,
  BorderInfo,
  BoundingBox,
  ContentArea,
  StyleMap,
  Color,
  Spacing,
  Size,
  ResponsiveSize,
  NodeState,
  Constructor,
} from './types';
// Export Dimensions from Layoutable (primary source)
export type { Dimensions } from './mixins/Layoutable';
export * from './mixins';
