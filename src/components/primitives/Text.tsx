/**
 * Text component - renders styled text to console
 * React Native-like pattern with nested Text support for inline styling
 */

import { memo } from 'react';
import type { ReactNode } from 'react';
import type { TextStyle } from '../../types';
import { createConsoleNode, mergeClassNameAndStyle } from '../utils';

/**
 * Props for the Text component
 *
 * Supports all text styling options including colors, background colors,
 * and text decorations (bold, italic, underline, etc.).
 *
 * @example
 * ```tsx
 * <Text color="red" bold>Important Text</Text>
 *
 * <Text style={{ color: 'cyan', bold: true, underline: true }}>
 *   Styled Text
 * </Text>
 *
 * // Nested Text for inline styling
 * <Text>
 *   Normal text <Text bold>bold text</Text> more normal
 * </Text>
 * ```
 */
export interface TextProps {
  children?: ReactNode;
  style?: TextStyle | TextStyle[]; // CSS-like style (similar to React Native)
  className?: string | string[]; // Class names for style libraries
  // Legacy props (for backward compatibility)
  color?: TextStyle['color'];
  backgroundColor?: TextStyle['backgroundColor'];
  bold?: TextStyle['bold'];
  dim?: TextStyle['dim'];
  italic?: TextStyle['italic'];
  underline?: TextStyle['underline'];
  strikethrough?: TextStyle['strikethrough'];
  inverse?: TextStyle['inverse'];
  textAlign?: TextStyle['textAlign'];
}

/**
 * Text component - Renders styled text to console
 *
 * Supports nested Text components for inline styling (React Native pattern).
 * Text naturally wraps based on terminal width and container constraints.
 *
 * @param props - Text component props
 * @returns React element representing styled text
 *
 * @example
 * ```tsx
 * // Simple styled text
 * <Text color="green" bold>Success!</Text>
 *
 * // With style prop
 * <Text style={{ color: 'yellow', italic: true }}>
 *   Italic yellow text
 * </Text>
 *
 * // Nested for inline styling
 * <Text>
 *   Welcome, <Text bold color="cyan">username</Text>!
 * </Text>
 * ```
 */
function TextComponent({ children, style, className, ...legacyProps }: TextProps) {
  // Merge className with style prop and legacy props (className < style < legacy props)
  const mergedStyle = mergeClassNameAndStyle(className, style, legacyProps);

  return createConsoleNode('text', {
    style: mergedStyle,
    children,
  });
}

// Memoize Text component for performance (stable component)
export const Text = memo(TextComponent);
