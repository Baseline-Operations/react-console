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
 * Pad a line with spaces so it reaches the given visible column.
 * Uses visible (cell) width, not string length, so ANSI codes are handled correctly.
 * Use this when appending content at a specific column to avoid overwriting or corrupting ANSI.
 */
export function padToVisibleColumn(line: string, visibleCol: number): string {
  const need = Math.max(0, visibleCol - getVisibleLength(line));
  return need > 0 ? line + ' '.repeat(need) : line;
}

/**
 * Truncate to max visible length. Avoids (1) terminal wrap putting the 81st
 * visible at line start as stray "1","2","3", and (2) ending with a partial
 * \x1b[31 (no trailing 'm') which can show "1". Trim any trailing partial CSI.
 */
export function truncateToVisibleLength(text: string, maxVisible: number): string {
  if (getVisibleLength(text) <= maxVisible) return text;
  let visibleCount = 0;
  let result = '';
  let inAnsi = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i]!;
    if (c === '\x1b' && text[i + 1] === '[') inAnsi = true;
    else if (inAnsi) {
      result += c;
      if (c === 'm') inAnsi = false;
      continue;
    }
    result += c;
    visibleCount++;
    if (visibleCount >= maxVisible) break;
  }
  // Trim trailing partial \x1b[0-9;]* (missing 'm') so "1" from [31m doesn't show
  const partial = result.match(/\x1b\[[0-9;]*$/);
  if (partial) result = result.slice(0, -partial![0].length);
  return result;
}

/**
 * Substring from start up to (excluding) visible column col.
 * ANSI-aware. Never cuts in the middle of an ANSI sequence.
 */
export function substringToVisibleColumn(line: string, col: number): string {
  if (col <= 0) return '';
  let visCount = 0;
  let inAnsi = false;
  let ansiStartIdx = -1;
  for (let i = 0; i < line.length; i++) {
    const c = line[i]!;
    if (c === '\x1b' && line[i + 1] === '[') {
      inAnsi = true;
      ansiStartIdx = i;
    } else if (inAnsi) {
      if (c === 'm') {
        inAnsi = false;
        ansiStartIdx = -1;
      }
      continue;
    } else {
      visCount++;
      if (visCount >= col) {
        // If we're in the middle of an ANSI sequence, include it completely
        if (inAnsi && ansiStartIdx >= 0) {
          // Find where the ANSI ends (after 'm')
          let j = i;
          while (j < line.length && line[j] !== 'm') {
            j++;
          }
          if (j < line.length) {
            return line.slice(0, j + 1); // Include complete ANSI
          }
          return line.slice(0, ansiStartIdx); // ANSI incomplete, exclude it
        }
        return line.slice(0, i + 1);
      }
    }
  }
  return line;
}

/**
 * Substring from visible column col to the end.
 * ANSI-aware. Returns '' if col >= visible length.
 * Never cuts in the middle of an ANSI sequence - always includes complete sequences.
 */
export function substringFromVisibleColumn(line: string, col: number): string {
  if (col <= 0) return line;
  const vis = getVisibleLength(line);
  if (col >= vis) return '';
  let visCount = 0;
  let inAnsi = false;
  let ansiStartIdx = -1;
  for (let i = 0; i < line.length; i++) {
    const c = line[i]!;
    if (c === '\x1b' && line[i + 1] === '[') {
      inAnsi = true;
      ansiStartIdx = i;
    } else if (inAnsi) {
      if (c === 'm') {
        inAnsi = false;
        ansiStartIdx = -1;
      }
      continue;
    } else {
      visCount++;
      if (visCount > col) {
        // Found first visible char after col
        // If we're currently in an ANSI sequence, include it completely
        if (inAnsi && ansiStartIdx >= 0) {
          return line.slice(ansiStartIdx);
        }
        // Check backwards if we just finished an ANSI - if so, we're safe to slice at i
        // Otherwise, slice at i (the first visible char after col)
        return line.slice(i);
      }
    }
  }
  return '';
}

/**
 * Replace the visible character at the given column with ch.
 * ANSI-aware: finds the character by visible column, not string index.
 * When replacing at col 0, strips any leading ANSI codes that were styling
 * the replaced character (since the new content will have its own styling).
 */
export function replaceAtVisibleColumn(line: string, col: number, ch: string): string {
  const vis = getVisibleLength(line);
  if (col >= vis) return padToVisibleColumn(line, col) + ch;
  let visCount = 0;
  let start = -1;
  let end = -1;
  let inAnsi = false;
  let firstVisibleIndex = -1; // Track where the first visible character starts
  
  for (let i = 0; i < line.length; i++) {
    const c = line[i]!;
    if (c === '\x1b' && line[i + 1] === '[') inAnsi = true;
    else if (inAnsi) {
      if (c === 'm') inAnsi = false;
      continue;
    } else {
      if (firstVisibleIndex < 0) firstVisibleIndex = i;
      if (visCount === col) start = i;
      visCount++;
      if (visCount === col + 1) {
        end = i + 1;
        break;
      }
    }
  }
  if (start < 0) return padToVisibleColumn(line, col) + ch;
  if (end < 0) end = line.length;
  
  // If replacing at col 0 and there were leading ANSI codes,
  // don't preserve them - the new content brings its own styling
  if (col === 0 && firstVisibleIndex > 0) {
    return ch + line.slice(end);
  }
  
  return line.slice(0, start) + ch + line.slice(end);
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
