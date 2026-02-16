/**
 * Code component - renders text with code/syntax-style (monospace look, optional highlighting).
 * Uses dim + optional background for inline or block code.
 */

import { memo } from 'react';
import type { ReactNode } from 'react';
import type { TextStyle } from '../../types';
import { createConsoleNode, mergeClassNameAndStyle } from '../utils';

export interface CodeProps {
  children?: ReactNode;
  style?: TextStyle | TextStyle[];
  className?: string | string[];
  /** Inline code (single line) vs block (multi-line). Default: inline */
  block?: boolean;
  color?: TextStyle['color'];
  backgroundColor?: TextStyle['backgroundColor'];
  dim?: boolean;
}

const defaultCodeStyle: TextStyle = {
  dim: true,
  backgroundColor: 'gray',
};

/**
 * Code - Renders text with code-style (dim, optional background).
 * Use for inline code, file paths, or command snippets.
 *
 * @example
 * ```tsx
 * <Code>npm install</Code>
 * <Code block>const x = 1;</Code>
 * <Code backgroundColor="blue">file.ts</Code>
 * ```
 */
function CodeComponent({
  children,
  style,
  className,
  block: _block = false,
  dim = true,
  backgroundColor = 'gray',
  color,
}: CodeProps) {
  const styleOnly: TextStyle = {
    ...defaultCodeStyle,
    dim,
    backgroundColor,
    ...(color != null && { color }),
  };
  const mergedStyle = mergeClassNameAndStyle(className, style, styleOnly);

  return createConsoleNode('text', {
    style: mergedStyle,
    children,
  });
}

export const Code = memo(CodeComponent);
