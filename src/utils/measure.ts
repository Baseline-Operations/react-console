/**
 * Text measurement utilities (ANSI-aware)
 * 
 * Utilities for measuring and manipulating text in terminal, accounting for
 * ANSI escape codes that don't contribute to visible width.
 */

import { getVisibleLength } from '../renderer/ansi';

/**
 * Measure text width (accounting for ANSI codes)
 * 
 * Returns the visible width of text in characters, ignoring ANSI escape codes.
 * Useful for layout calculations where ANSI codes shouldn't affect spacing.
 * 
 * @param text - Text to measure (may contain ANSI escape codes)
 * @returns Visible width in characters (ANSI codes excluded)
 * 
 * @example
 * ```ts
 * measureText('Hello'); // 5
 * measureText('\x1b[31mRed\x1b[0m'); // 3 (ANSI codes ignored)
 * measureText('Hello\nWorld'); // 5 (only first line measured)
 * ```
 */
export function measureText(text: string): number {
  return getVisibleLength(text);
}

/**
 * Wrap text to fit within a given width
 * 
 * Wraps text at word boundaries to fit within specified width, preserving
 * ANSI escape codes. Handles multiple lines (separated by `\n`) and wraps
 * each line independently.
 * 
 * @param text - Text to wrap (may contain ANSI codes and newlines)
 * @param width - Maximum width in characters for each line
 * @returns Array of wrapped lines (each line fits within width)
 * 
 * @example
 * ```ts
 * wrapText('Hello world', 5); // ['Hello', 'world']
 * wrapText('Long text here', 8); // ['Long', 'text', 'here']
 * wrapText('\x1b[31mRed\x1b[0m text', 10); // ['\x1b[31mRed\x1b[0m text'] (ANSI preserved)
 * ```
 */
export function wrapText(text: string, width: number): string[] {
  const lines: string[] = [];
  const textLines = text.split('\n');

  for (const line of textLines) {
    const visibleLength = measureText(line);
    if (visibleLength <= width) {
      lines.push(line);
      continue;
    }

    // Need to wrap this line
    let currentLine = '';
    let currentVisibleLength = 0;
    const words = line.split(/(\s+)/);

    for (const word of words) {
      const wordLength = measureText(word);
      if (currentVisibleLength + wordLength <= width) {
        currentLine += word;
        currentVisibleLength += wordLength;
      } else {
        if (currentLine) {
          lines.push(currentLine);
        }
        currentLine = word;
        currentVisibleLength = wordLength;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }
  }

  return lines;
}

/**
 * Truncate text to fit width with ellipsis
 * 
 * Truncates text to fit within specified width, appending ellipsis if truncated.
 * Preserves ANSI escape codes and ensures total width (including ellipsis) fits.
 * 
 * @param text - Text to truncate (may contain ANSI codes)
 * @param width - Maximum width in characters
 * @param ellipsis - Ellipsis string to append when truncated (default: '...')
 * @returns Truncated text with ellipsis if needed
 * 
 * @example
 * ```ts
 * truncateText('Hello world', 5); // 'He...'
 * truncateText('Short', 10); // 'Short' (not truncated)
 * truncateText('\x1b[31mRed\x1b[0m text', 8); // '\x1b[31mRed\x1b[0m ...' (ANSI preserved)
 * ```
 */
export function truncateText(text: string, width: number, ellipsis = '...'): string {
  const visibleLength = measureText(text);
  if (visibleLength <= width) return text;

  const ellipsisLength = measureText(ellipsis);
  const targetLength = width - ellipsisLength;

  if (targetLength <= 0) return ellipsis;

  // Truncate visible characters
  let visibleCount = 0;
  let result = '';
  let inAnsiCode = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i]!;

    if (char === '\x1b' && text[i + 1] === '[') {
      // Start of ANSI code
      inAnsiCode = true;
      result += char;
    } else if (inAnsiCode) {
      result += char;
      if (char === 'm') {
        inAnsiCode = false;
      }
    } else {
      result += char;
      visibleCount++;
      if (visibleCount >= targetLength) {
        break;
      }
    }
  }

  return result + ellipsis;
}
