/**
 * Date and time formatting utilities
 * Provides date/time formatting functions for terminal applications
 */

/**
 * Format a date to a string
 * @param date - Date object or timestamp
 * @param format - Format string (default: 'YYYY-MM-DD')
 * @returns Formatted date string
 *
 * Format tokens:
 * - YYYY: 4-digit year
 * - YY: 2-digit year
 * - MM: 2-digit month (01-12)
 * - M: Month (1-12)
 * - DD: 2-digit day (01-31)
 * - D: Day (1-31)
 * - HH: 2-digit hour (00-23)
 * - H: Hour (0-23)
 * - mm: 2-digit minute (00-59)
 * - m: Minute (0-59)
 * - ss: 2-digit second (00-59)
 * - s: Second (0-59)
 * - SSS: 3-digit milliseconds
 * - S: Milliseconds
 */
export function formatDate(date: Date | number, format: string = 'YYYY-MM-DD'): string {
  const d = typeof date === 'number' ? new Date(date) : date;

  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();
  const milliseconds = d.getMilliseconds();

  return format
    .replace(/YYYY/g, String(year).padStart(4, '0'))
    .replace(/YY/g, String(year % 100).padStart(2, '0'))
    .replace(/MM/g, String(month).padStart(2, '0'))
    .replace(/M/g, String(month))
    .replace(/DD/g, String(day).padStart(2, '0'))
    .replace(/D/g, String(day))
    .replace(/HH/g, String(hours).padStart(2, '0'))
    .replace(/H/g, String(hours))
    .replace(/mm/g, String(minutes).padStart(2, '0'))
    .replace(/m/g, String(minutes))
    .replace(/ss/g, String(seconds).padStart(2, '0'))
    .replace(/s/g, String(seconds))
    .replace(/SSS/g, String(milliseconds).padStart(3, '0'))
    .replace(/S/g, String(milliseconds));
}

/**
 * Format a date to a human-readable relative time string
 * @param date - Date object or timestamp
 * @param format - Format style: 'short' or 'long' (default: 'short')
 * @returns Relative time string (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelativeTime(
  date: Date | number,
  format: 'short' | 'long' = 'short'
): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffSeconds = Math.floor(Math.abs(diffMs) / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  const isPast = diffMs < 0;
  const prefix = isPast ? '' : 'in ';
  const suffix = isPast ? ' ago' : '';

  if (diffSeconds < 60) {
    return format === 'short'
      ? `${prefix}${diffSeconds}s${suffix}`
      : `${prefix}${diffSeconds} second${diffSeconds !== 1 ? 's' : ''}${suffix}`;
  }

  if (diffMinutes < 60) {
    return format === 'short'
      ? `${prefix}${diffMinutes}m${suffix}`
      : `${prefix}${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}${suffix}`;
  }

  if (diffHours < 24) {
    return format === 'short'
      ? `${prefix}${diffHours}h${suffix}`
      : `${prefix}${diffHours} hour${diffHours !== 1 ? 's' : ''}${suffix}`;
  }

  if (diffDays < 7) {
    return format === 'short'
      ? `${prefix}${diffDays}d${suffix}`
      : `${prefix}${diffDays} day${diffDays !== 1 ? 's' : ''}${suffix}`;
  }

  if (diffWeeks < 4) {
    return format === 'short'
      ? `${prefix}${diffWeeks}w${suffix}`
      : `${prefix}${diffWeeks} week${diffWeeks !== 1 ? 's' : ''}${suffix}`;
  }

  if (diffMonths < 12) {
    return format === 'short'
      ? `${prefix}${diffMonths}mo${suffix}`
      : `${prefix}${diffMonths} month${diffMonths !== 1 ? 's' : ''}${suffix}`;
  }

  return format === 'short'
    ? `${prefix}${diffYears}y${suffix}`
    : `${prefix}${diffYears} year${diffYears !== 1 ? 's' : ''}${suffix}`;
}

/**
 * Format a date to a human-readable string
 * @param date - Date object or timestamp
 * @param format - Format style: 'short', 'medium', 'long', or 'full' (default: 'medium')
 * @returns Formatted date string
 */
export function formatDateHuman(
  date: Date | number,
  format: 'short' | 'medium' | 'long' | 'full' = 'medium'
): string {
  const d = typeof date === 'number' ? new Date(date) : date;

  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const monthNamesShort = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const monthName = monthNames[month - 1]!;
  const monthNameShort = monthNamesShort[month - 1]!;
  const dayName = dayNames[d.getDay()]!;

  switch (format) {
    case 'short':
      return `${month}/${day}/${year}`;
    case 'medium':
      return `${monthNameShort} ${day}, ${year}`;
    case 'long':
      return `${monthName} ${day}, ${year}`;
    case 'full':
      return `${dayName}, ${monthName} ${day}, ${year}`;
    default:
      return `${monthName} ${day}, ${year}`;
  }
}

/**
 * Format a time to a string
 * @param date - Date object or timestamp
 * @param format - Format: '12h' or '24h' (default: '12h')
 * @param includeSeconds - Include seconds (default: false)
 * @returns Formatted time string
 */
export function formatTime(
  date: Date | number,
  format: '12h' | '24h' = '12h',
  includeSeconds: boolean = false
): string {
  const d = typeof date === 'number' ? new Date(date) : date;

  let hours = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();
  const ampm = format === '12h' ? (hours >= 12 ? 'PM' : 'AM') : '';

  if (format === '12h') {
    hours = hours % 12 || 12;
  }

  const timeStr = includeSeconds
    ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    : `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

  return format === '12h' ? `${timeStr} ${ampm}` : timeStr;
}

/**
 * Parse a date string to a Date object
 * @param dateString - Date string to parse
 * @returns Date object or null if invalid
 */
export function parseDate(dateString: string): Date | null {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Get the start of day for a date
 * @param date - Date object or timestamp
 * @returns Date object set to start of day (00:00:00.000)
 */
export function startOfDay(date: Date | number): Date {
  const d = typeof date === 'number' ? new Date(date) : new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get the end of day for a date
 * @param date - Date object or timestamp
 * @returns Date object set to end of day (23:59:59.999)
 */
export function endOfDay(date: Date | number): Date {
  const d = typeof date === 'number' ? new Date(date) : new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Check if a date is today
 * @param date - Date object or timestamp
 * @returns True if date is today
 */
export function isToday(date: Date | number): boolean {
  const d = typeof date === 'number' ? new Date(date) : date;
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if a date is in the past
 * @param date - Date object or timestamp
 * @returns True if date is in the past
 */
export function isPast(date: Date | number): boolean {
  const d = typeof date === 'number' ? new Date(date) : date;
  return d.getTime() < Date.now();
}

/**
 * Check if a date is in the future
 * @param date - Date object or timestamp
 * @returns True if date is in the future
 */
export function isFuture(date: Date | number): boolean {
  const d = typeof date === 'number' ? new Date(date) : date;
  return d.getTime() > Date.now();
}
