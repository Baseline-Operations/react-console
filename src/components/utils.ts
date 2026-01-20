/**
 * Component factory helpers
 * Generic utilities for creating ConsoleNode objects with proper types
 * Reduces need for `as unknown as ReactElement` assertions
 */

import type { ReactNode, ReactElement } from 'react';
import type { ConsoleNode, ViewStyle, TextStyle } from '../types';

/**
 * Convert ReactNode children to ConsoleNode[] array
 * Handles single child, array of children, or undefined
 */
function normalizeChildren(children?: ReactNode): ConsoleNode[] | undefined {
  if (!children) {
    return undefined;
  }
  if (Array.isArray(children)) {
    // Children are ReactNodes, reconciler will handle conversion
    // Type assertion needed: ReactNode[] -> ConsoleNode[]
    // React children may be various types, but we normalize to ConsoleNode[]
    return children as unknown as ConsoleNode[];
  }
  // Single child
  return [children] as unknown as ConsoleNode[];
}

/**
 * Create a ConsoleNode with type safety
 * Generic helper to create properly typed ConsoleNode objects
 * 
 * @template T - The ConsoleNode type (e.g., 'input', 'button', 'text')
 * @param type - The node type
 * @param props - Node properties (content, style, children, etc.)
 * @returns ReactElement for React reconciler compatibility
 * 
 * Note: The `as unknown as ReactElement` assertion is necessary because:
 * - React reconciler expects ReactElement type
 * - We're creating ConsoleNode objects (our host representation)
 * - This is a bridge between our host config and React's type system
 * - The reconciler's hostConfig handles the actual conversion
 */
export function createConsoleNode<T extends ConsoleNode['type']>(
  type: T,
  props: {
    content?: string;
    style?: ViewStyle | TextStyle;
    styles?: ConsoleNode['styles'];
    layout?: ConsoleNode['layout'];
    children?: ReactNode | ReactNode[];
    [key: string]: unknown;
  }
): ReactElement {
  const node: ConsoleNode = {
    type,
    children: normalizeChildren(props.children),
    ...Object.fromEntries(
      Object.entries(props).filter(([key]) => key !== 'children')
    ),
  } as ConsoleNode;

  // Type assertion required: ConsoleNode -> ReactElement bridge for reconciler
  // This is safe because hostConfig handles the actual conversion
  return node as unknown as ReactElement;
}

/**
 * Merge style arrays or objects into a single style object
 * Helper for components that accept style arrays (React Native pattern)
 * 
 * Note: This function is optimized for performance. For expensive style calculations,
 * consider using memoizeStyle from utils/memoization.
 */
export function mergeStyles<T extends ViewStyle | TextStyle>(
  styles: T | T[] | undefined,
  legacyProps?: Partial<T>
): T | undefined {
  if (!styles && !legacyProps) {
    return undefined;
  }

  const styleArray = Array.isArray(styles) ? styles : styles ? [styles] : [];
  const allStyles = legacyProps ? [...styleArray, legacyProps as T] : styleArray;

  if (allStyles.length === 0) {
    return undefined;
  }

  if (allStyles.length === 1) {
    return allStyles[0] as T;
  }

  return allStyles.reduce((merged, style) => ({ ...merged, ...style }), {} as T);
}

/**
 * Merge className with style prop
 * className styles are merged first, then style prop (which takes precedence)
 */
export function mergeClassNameAndStyle(
  className: string | string[] | undefined,
  style?: ViewStyle | TextStyle | (ViewStyle | TextStyle)[],
  ...additionalStyles: Array<ViewStyle | TextStyle | undefined | null>
): ViewStyle | TextStyle {
  const { mergeClassNameWithStyle } = require('../utils/className');
  const classNameStyle = mergeClassNameWithStyle(className, style);
  
  if (additionalStyles.length > 0) {
    const filteredStyles = additionalStyles.filter((s): s is ViewStyle | TextStyle => s != null);
    if (filteredStyles.length > 0) {
      return mergeStyles(classNameStyle, ...filteredStyles);
    }
  }
  
  return classNameStyle || {};
}
