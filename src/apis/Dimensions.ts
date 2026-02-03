/**
 * Dimensions API - React Native compatible screen/window dimensions
 * Provides terminal dimensions similar to React Native's Dimensions API
 */

import { EventEmitter } from 'events';
import type { NativeEventSubscription } from './AppState';

/**
 * Dimension data structure
 */
export interface ScaledSize {
  width: number;
  height: number;
  scale: number;
  fontScale: number;
}

/**
 * Dimensions change event
 */
export interface DimensionsChangeEvent {
  window: ScaledSize;
  screen: ScaledSize;
}

class DimensionsModule {
  private _emitter = new EventEmitter();
  private _window: ScaledSize;
  private _screen: ScaledSize;
  private _resizeHandler: (() => void) | null = null;

  constructor() {
    // Initialize with current terminal dimensions
    const dims = this._getTerminalDimensions();
    this._window = dims;
    this._screen = dims;

    // Set up resize listener
    this._setupResizeListener();
  }

  /**
   * Get terminal dimensions
   */
  private _getTerminalDimensions(): ScaledSize {
    return {
      width: process.stdout.columns || 80,
      height: process.stdout.rows || 24,
      scale: 1, // Terminal doesn't have pixel scaling
      fontScale: 1, // Terminal doesn't have font scaling
    };
  }

  /**
   * Set up listener for terminal resize events
   */
  private _setupResizeListener(): void {
    this._resizeHandler = () => {
      const newDims = this._getTerminalDimensions();
      const changed =
        newDims.width !== this._window.width || newDims.height !== this._window.height;

      if (changed) {
        this._window = newDims;
        this._screen = newDims;
        this._emitter.emit('change', {
          window: this._window,
          screen: this._screen,
        });
      }
    };

    process.stdout.on('resize', this._resizeHandler);
  }

  /**
   * Get dimensions for a specific dimension type
   *
   * @param dim - 'window' or 'screen' (both return terminal size)
   * @returns ScaledSize object with width, height, scale, fontScale
   *
   * @example
   * ```tsx
   * const { width, height } = Dimensions.get('window');
   * console.log(`Terminal is ${width}x${height}`);
   * ```
   */
  get(dim: 'window' | 'screen'): ScaledSize {
    // Refresh dimensions on each get (terminal may have resized)
    const current = this._getTerminalDimensions();
    this._window = current;
    this._screen = current;

    return dim === 'window' ? this._window : this._screen;
  }

  /**
   * Set dimensions (for testing or custom viewports)
   * Note: This doesn't actually resize the terminal
   *
   * @param dims - Object with window and/or screen dimensions
   */
  set(dims: { window?: ScaledSize; screen?: ScaledSize }): void {
    if (dims.window) {
      this._window = dims.window;
    }
    if (dims.screen) {
      this._screen = dims.screen;
    }
    this._emitter.emit('change', {
      window: this._window,
      screen: this._screen,
    });
  }

  /**
   * Add event listener for dimension changes
   *
   * @param type - Event type ('change')
   * @param handler - Callback function
   * @returns Subscription with remove() method
   *
   * @example
   * ```tsx
   * useEffect(() => {
   *   const subscription = Dimensions.addEventListener('change', ({ window }) => {
   *     console.log('New dimensions:', window.width, window.height);
   *   });
   *   return () => subscription.remove();
   * }, []);
   * ```
   */
  addEventListener(
    type: 'change',
    handler: (event: DimensionsChangeEvent) => void
  ): NativeEventSubscription {
    this._emitter.on(type, handler);

    return {
      remove: () => {
        this._emitter.off(type, handler);
      },
    };
  }

  /**
   * Remove event listener (legacy)
   * @deprecated Use subscription.remove() instead
   */
  removeEventListener(type: 'change', handler: (event: DimensionsChangeEvent) => void): void {
    this._emitter.off(type, handler);
  }

  /**
   * Clean up (for testing)
   */
  cleanup(): void {
    if (this._resizeHandler) {
      process.stdout.off('resize', this._resizeHandler);
    }
    this._emitter.removeAllListeners();
  }
}

/**
 * Dimensions singleton instance
 */
export const Dimensions = new DimensionsModule();

/**
 * Hook: useWindowDimensions
 * React hook for getting window dimensions with automatic updates
 *
 * @returns Current window dimensions
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { width, height } = useWindowDimensions();
 *
 *   return (
 *     <View style={{ width: width - 4 }}>
 *       <Text>Terminal is {width}x{height}</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useWindowDimensions(): ScaledSize {
  // This would use useState/useEffect in actual implementation
  // For now, return current dimensions
  return Dimensions.get('window');
}
