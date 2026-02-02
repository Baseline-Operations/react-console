/**
 * Core type definitions for the new class-based node system
 * All enums and types used by nodes, mixins, and the rendering system
 */

/**
 * Position enum - CSS-like positioning
 */
export const Position = {
  STATIC: 'static', // Default - normal document flow
  RELATIVE: 'relative', // Normal flow + offset
  ABSOLUTE: 'absolute', // Out of flow, relative to positioned ancestor
  FIXED: 'fixed', // Out of flow, relative to viewport
  STICKY: 'sticky', // Relative until scroll threshold
} as const;

export type Position = (typeof Position)[keyof typeof Position];

/**
 * Display mode enum - Layout display modes
 */
export const DisplayMode = {
  BLOCK: 'block',
  FLEX: 'flex',
  GRID: 'grid',
  NONE: 'none',
} as const;

export type DisplayMode = (typeof DisplayMode)[keyof typeof DisplayMode];

/**
 * Border style enum - Border rendering styles
 */
export const BorderStyle = {
  SINGLE: 'single',
  DOUBLE: 'double',
  THICK: 'thick',
  DASHED: 'dashed',
  DOTTED: 'dotted',
} as const;

export type BorderStyle = (typeof BorderStyle)[keyof typeof BorderStyle];

/**
 * Text align enum - Text alignment options
 */
export const TextAlign = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
  JUSTIFY: 'justify',
} as const;

export type TextAlign = (typeof TextAlign)[keyof typeof TextAlign];

/**
 * Overflow enum - Overflow handling
 */
export const Overflow = {
  VISIBLE: 'visible',
  HIDDEN: 'hidden',
  SCROLL: 'scroll',
} as const;

export type Overflow = (typeof Overflow)[keyof typeof Overflow];

/**
 * Flex direction enum - Flexbox direction
 */
export const FlexDirection = {
  ROW: 'row',
  COLUMN: 'column',
  ROW_REVERSE: 'row-reverse',
  COLUMN_REVERSE: 'column-reverse',
} as const;

export type FlexDirection = (typeof FlexDirection)[keyof typeof FlexDirection];

/**
 * Justify content enum - Flexbox/Grid justify content
 */
export const JustifyContent = {
  FLEX_START: 'flex-start',
  FLEX_END: 'flex-end',
  CENTER: 'center',
  SPACE_BETWEEN: 'space-between',
  SPACE_AROUND: 'space-around',
  SPACE_EVENLY: 'space-evenly',
} as const;

export type JustifyContent = (typeof JustifyContent)[keyof typeof JustifyContent];

/**
 * Align items enum - Flexbox/Grid align items
 */
export const AlignItems = {
  FLEX_START: 'flex-start',
  FLEX_END: 'flex-end',
  CENTER: 'center',
  BASELINE: 'baseline',
  STRETCH: 'stretch',
} as const;

export type AlignItems = (typeof AlignItems)[keyof typeof AlignItems];

/**
 * Mouse button enum - Mouse button types
 */
export const MouseButton = {
  LEFT: 'left',
  RIGHT: 'right',
  MIDDLE: 'middle',
  WHEEL: 'wheel',
} as const;

export type MouseButton = (typeof MouseButton)[keyof typeof MouseButton];

/**
 * Mouse action enum - Mouse action types
 */
export const MouseAction = {
  PRESS: 'press',
  RELEASE: 'release',
  MOVE: 'move',
  WHEEL: 'wheel',
} as const;

export type MouseAction = (typeof MouseAction)[keyof typeof MouseAction];

/**
 * Margin definition - Spacing outside the border
 */
export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Padding definition - Spacing inside the border
 */
export interface Padding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Border width definition - Width of each border side
 */
export interface BorderWidth {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Border show definition - Which borders to display
 * Can be true for all sides, or an object specifying individual sides
 */
export type BorderShow =
  | true // Show all borders
  | {
      top?: boolean;
      right?: boolean;
      bottom?: boolean;
      left?: boolean;
    };

/**
 * Border configuration - Simplified border settings
 * border can be true (all sides) or an object specifying which sides
 * Other border properties are defined separately
 */
export interface BorderConfig {
  border?: BorderShow;
  borderWidth?: number | BorderWidth;
  borderStyle?: BorderStyle;
  borderColor?: string | null;
  borderBackgroundColor?: string | null;
}

/**
 * Border information - Internal border representation
 */
export interface BorderInfo {
  show: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  width: BorderWidth;
  style: BorderStyle;
  color: string | null;
  backgroundColor: string | null;
}

/**
 * Bounding box - Rectangle with position and size
 */
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Dimensions - Size information including content dimensions
 * Note: Also defined in Layoutable mixin - use Layoutable.Dimensions for mixin context
 */
export interface Dimensions {
  width: number;
  height: number;
  contentWidth: number;
  contentHeight: number;
}

/**
 * Content area - Position and size of content area (inside padding)
 */
export interface ContentArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Style map - Generic style object
 */
export type StyleMap = Record<string, unknown>;

/**
 * Color type - String color name or hex code
 */
export type Color = string;

/**
 * Spacing value - Number or object with individual sides
 */
export type Spacing = number | { top?: number; right?: number; bottom?: number; left?: number };

/**
 * Size value - Number, percentage string, or 'auto'
 */
export type Size = number | string | 'auto';

/**
 * Responsive size - Number or percentage string
 */
export type ResponsiveSize = number | string;

/**
 * Node state - Internal node state
 */
export interface NodeState {
  mounted: boolean;
  visible: boolean;
  enabled: boolean;
}

/**
 * Base constructor type for mixins
 * Supports both concrete and abstract classes
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type Constructor<T = {}> = new (...args: unknown[]) => T;

/**
 * Abstract constructor type for mixins that need to extend abstract classes
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type AbstractConstructor<T = {}> = abstract new (...args: unknown[]) => T;
