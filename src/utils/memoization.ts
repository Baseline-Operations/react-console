/**
 * Memoization utilities for React Console
 * Provides memoization for expensive calculations like style merging and responsive size resolution
 */

import type { ViewStyle, TextStyle, ResponsiveSize } from '../types';
import { resolveWidth, resolveHeight } from './responsive';

/**
 * Cache for memoized style calculations
 * Uses WeakMap for automatic garbage collection
 */
const styleCache = new WeakMap<object, ViewStyle | TextStyle>();

/**
 * Cache for memoized responsive size calculations
 * Key: string representation of size + maxSize
 * Value: resolved number
 */
const responsiveSizeCache = new Map<string, number | undefined>();

/**
 * Memoize style object
 * Caches style objects to avoid recalculating merged styles
 *
 * @param style - Style object to memoize
 * @param key - Optional key for cache (if style is not an object)
 * @returns Cached or original style
 *
 * @example
 * ```ts
 * const memoizedStyle = memoizeStyle({ padding: 2, color: 'red' });
 * ```
 */
export function memoizeStyle<T extends ViewStyle | TextStyle>(
  style: T | undefined,
  key?: string
): T | undefined {
  if (!style) {
    return undefined;
  }

  // If style is an object, use WeakMap
  if (typeof style === 'object' && !Array.isArray(style)) {
    if (styleCache.has(style)) {
      return styleCache.get(style) as T;
    }
    styleCache.set(style, style);
    return style;
  }

  // For arrays or primitives, use Map with key
  if (key) {
    const cacheKey = key + JSON.stringify(style);
    if (responsiveSizeCache.has(cacheKey)) {
      return responsiveSizeCache.get(cacheKey) as T;
    }
    responsiveSizeCache.set(cacheKey, style as unknown as number);
  }

  return style;
}

/**
 * Memoize responsive size resolution
 * Caches resolved responsive sizes to avoid recalculating
 *
 * @param size - Responsive size to resolve
 * @param dimension - 'width' or 'height'
 * @param maxSize - Optional maximum size constraint
 * @returns Cached or newly resolved size
 *
 * @example
 * ```ts
 * const width = memoizeResponsiveSize('50%', 'width', 80);
 * ```
 */
export function memoizeResponsiveSize(
  size: ResponsiveSize | undefined,
  dimension: 'width' | 'height',
  maxSize?: number
): number | undefined {
  if (size === undefined) {
    return undefined;
  }

  const cacheKey = `${dimension}:${String(size)}:${maxSize ?? 'none'}`;

  if (responsiveSizeCache.has(cacheKey)) {
    return responsiveSizeCache.get(cacheKey);
  }

  const resolved =
    dimension === 'width' ? resolveWidth(size, maxSize) : resolveHeight(size, maxSize);

  responsiveSizeCache.set(cacheKey, resolved);
  return resolved;
}

/**
 * Clear memoization cache
 * Useful for testing or when terminal dimensions change significantly
 */
export function clearMemoizationCache(): void {
  responsiveSizeCache.clear();
  // WeakMap doesn't need clearing (automatic garbage collection)
}

/**
 * Get cache statistics (for debugging)
 */
export function getCacheStats(): {
  responsiveSizeCacheSize: number;
} {
  return {
    responsiveSizeCacheSize: responsiveSizeCache.size,
  };
}
