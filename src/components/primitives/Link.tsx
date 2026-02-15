/**
 * Link component - renders text as a terminal hyperlink (OSC 8).
 * Terminals that support OSC 8 will show clickable links.
 */

import { memo } from 'react';
import type { ReactNode } from 'react';
import type { TextStyle } from '../../types';
import { createConsoleNode, mergeClassNameAndStyle } from '../utils';

export interface LinkProps {
  /** URL for the link (required for clickable behavior) */
  href: string;
  children?: ReactNode;
  style?: TextStyle | TextStyle[];
  className?: string | string[];
  color?: TextStyle['color'];
  backgroundColor?: TextStyle['backgroundColor'];
  bold?: TextStyle['bold'];
  dim?: TextStyle['dim'];
  italic?: TextStyle['italic'];
  underline?: TextStyle['underline'];
}

/**
 * Link - Renders text as a terminal hyperlink (OSC 8).
 * Use for docs, repo URLs, or any clickable URL in the terminal.
 *
 * @example
 * ```tsx
 * <Link href="https://github.com/your/repo">Open repo</Link>
 * <Link href="https://example.com" color="cyan" underline>Example</Link>
 * ```
 */
function LinkComponent({
  href,
  children,
  style,
  className,
  color,
  backgroundColor,
  bold,
  dim,
  italic,
  underline,
}: LinkProps) {
  const styleOnly: TextStyle = {
    ...(color != null && { color }),
    ...(backgroundColor != null && { backgroundColor }),
    ...(bold != null && { bold }),
    ...(dim != null && { dim }),
    ...(italic != null && { italic }),
    ...(underline != null && { underline }),
  };
  const mergedStyle = mergeClassNameAndStyle(className, style, styleOnly);

  return createConsoleNode('link', {
    href,
    style: mergedStyle,
    children,
  });
}

export const Link = memo(LinkComponent);
