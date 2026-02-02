/**
 * Text formatting utilities
 * Provides text formatting, padding, alignment, and number formatting utilities
 * Note: Text truncation is in measure.ts (ANSI-aware version)
 */

/**
 * Pad a string to a specific width
 * @param text - Text to pad
 * @param width - Target width
 * @param align - Alignment: 'left', 'right', or 'center'
 * @param fill - Fill character (default: ' ')
 * @returns Padded string
 */
export function padText(
  text: string,
  width: number,
  align: 'left' | 'right' | 'center' = 'left',
  fill: string = ' '
): string {
  if (text.length >= width) {
    return text.slice(0, width);
  }

  const padding = width - text.length;

  switch (align) {
    case 'left':
      return text + fill.repeat(padding);
    case 'right':
      return fill.repeat(padding) + text;
    case 'center':
      const leftPad = Math.floor(padding / 2);
      const rightPad = padding - leftPad;
      return fill.repeat(leftPad) + text + fill.repeat(rightPad);
    default:
      return text;
  }
}

/**
 * Wrap text to multiple lines at word boundaries
 * @param text - Text to wrap
 * @param width - Maximum line width
 * @param indent - Indentation for wrapped lines (default: 0)
 * @returns Array of wrapped lines
 */
export function wrapTextLines(text: string, width: number, indent: number = 0): string[] {
  if (width <= 0) {
    return [text];
  }

  const indentStr = ' '.repeat(indent);
  const effectiveWidth = width - indent;

  if (text.length <= effectiveWidth) {
    return [text];
  }

  const lines: string[] = [];
  const words = text.split(/\s+/);
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;

    if (testLine.length <= effectiveWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }

      // If word itself is longer than width, break it
      if (word.length > effectiveWidth) {
        let remaining = word;
        while (remaining.length > effectiveWidth) {
          lines.push(remaining.slice(0, effectiveWidth));
          remaining = remaining.slice(effectiveWidth);
        }
        currentLine = remaining;
      } else {
        currentLine = word;
      }
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  // Add indentation to wrapped lines (except first)
  return lines.map((line, index) => (index === 0 ? line : indentStr + line));
}

/**
 * Format a number with thousands separator
 * @param num - Number to format
 * @param separator - Thousands separator (default: ',')
 * @returns Formatted number string
 */
export function formatNumber(num: number, separator: string = ','): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

/**
 * Format a percentage value
 * @param value - Value (0-1 or 0-100)
 * @param decimals - Number of decimal places (default: 0)
 * @param format - Format: 'decimal' (0.5) or 'percent' (50%) (default: 'percent')
 * @returns Formatted percentage string
 */
export function formatPercentage(
  value: number,
  decimals: number = 0,
  format: 'decimal' | 'percent' = 'percent'
): string {
  const percentage = format === 'percent' ? value * 100 : value;
  return `${percentage.toFixed(decimals)}${format === 'percent' ? '%' : ''}`;
}

/**
 * Format a duration in milliseconds to human-readable format
 * @param ms - Duration in milliseconds
 * @param format - Format style: 'short' or 'long' (default: 'short')
 * @returns Formatted duration string
 */
export function formatDuration(ms: number, format: 'short' | 'long' = 'short'): string {
  if (ms < 1000) {
    return format === 'short' ? `${ms}ms` : `${ms} milliseconds`;
  }

  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) {
    return format === 'short' ? `${seconds}s` : `${seconds} seconds`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes < 60) {
    if (format === 'short') {
      return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
    }
    return remainingSeconds > 0
      ? `${minutes} minutes ${remainingSeconds} seconds`
      : `${minutes} minutes`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (format === 'short') {
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }
  return remainingMinutes > 0 ? `${hours} hours ${remainingMinutes} minutes` : `${hours} hours`;
}

/**
 * Format a file size in bytes to human-readable format
 * @param bytes - Size in bytes
 * @param format - Format style: 'short' or 'long' (default: 'short')
 * @returns Formatted size string
 */
export function formatFileSize(bytes: number, format: 'short' | 'long' = 'short'): string {
  if (bytes === 0) {
    return format === 'short' ? '0 B' : '0 bytes';
  }

  const k = 1024;
  const sizes =
    format === 'short'
      ? ['B', 'KB', 'MB', 'GB', 'TB']
      : ['bytes', 'kilobytes', 'megabytes', 'gigabytes', 'terabytes'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  const unit = sizes[i] || sizes[sizes.length - 1];

  return `${value.toFixed(2)} ${unit}`;
}

/**
 * Repeat a string a certain number of times
 * @param str - String to repeat
 * @param count - Number of times to repeat
 * @returns Repeated string
 */
export function repeat(str: string, count: number): string {
  if (count <= 0) return '';
  return str.repeat(count);
}

/**
 * Create a progress bar string
 * @param current - Current value
 * @param total - Total value
 * @param width - Bar width in characters (default: 20)
 * @param filledChar - Character for filled portion (default: '█')
 * @param emptyChar - Character for empty portion (default: '░')
 * @returns Progress bar string
 */
export function createProgressBar(
  current: number,
  total: number,
  width: number = 20,
  filledChar: string = '█',
  emptyChar: string = '░'
): string {
  const percentage = Math.min(1, Math.max(0, current / total));
  const filled = Math.round(width * percentage);
  const empty = width - filled;

  return filledChar.repeat(filled) + emptyChar.repeat(empty);
}
