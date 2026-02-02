/**
 * Animation utilities for terminal animations
 * Provides easing functions, interpolation, and frame rate control
 */

export type EasingFunction = (t: number) => number;
export type AnimationType =
  | 'fade'
  | 'slide'
  | 'spin'
  | 'pulse'
  | 'bounce'
  | 'typewriter'
  | 'blink'
  | 'shake';
export type AnimationDirection = 'in' | 'out' | 'inOut';

/**
 * Easing functions for animations
 * All functions take a value t from 0 to 1 and return an eased value
 */
export const easing = {
  /** Linear interpolation (no easing) */
  linear: (t: number): number => t,

  /** Ease in (slow start) */
  easeIn: (t: number): number => t * t,

  /** Ease out (slow end) */
  easeOut: (t: number): number => t * (2 - t),

  /** Ease in-out (slow start and end) */
  easeInOut: (t: number): number => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),

  /** Cubic ease in */
  cubicIn: (t: number): number => t * t * t,

  /** Cubic ease out */
  cubicOut: (t: number): number => --t * t * t + 1,

  /** Cubic ease in-out */
  cubicInOut: (t: number): number =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

  /** Quadratic ease in */
  quadIn: (t: number): number => t * t,

  /** Quadratic ease out */
  quadOut: (t: number): number => t * (2 - t),

  /** Quadratic ease in-out */
  quadInOut: (t: number): number => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
};

/**
 * Interpolate between two numeric values
 * @param start - Starting value
 * @param end - Ending value
 * @param progress - Progress from 0 to 1
 * @param easingFn - Optional easing function (default: linear)
 * @returns Interpolated value
 */
export function interpolate(
  start: number,
  end: number,
  progress: number,
  easingFn: EasingFunction = easing.linear
): number {
  const eased = easingFn(Math.max(0, Math.min(1, progress)));
  return start + (end - start) * eased;
}

/**
 * Interpolate color between two color strings
 * Supports named colors and hex colors
 * @param start - Starting color (named or hex)
 * @param end - Ending color (named or hex)
 * @param progress - Progress from 0 to 1
 * @param easingFn - Optional easing function (default: linear)
 * @returns Interpolated color (simplified - returns closest named color)
 */
/**
 * Parse a color string to RGB values
 */
function parseColor(color: string): { r: number; g: number; b: number } | null {
  // Named colors
  const namedColors: Record<string, { r: number; g: number; b: number }> = {
    black: { r: 0, g: 0, b: 0 },
    red: { r: 255, g: 0, b: 0 },
    green: { r: 0, g: 255, b: 0 },
    yellow: { r: 255, g: 255, b: 0 },
    blue: { r: 0, g: 0, b: 255 },
    magenta: { r: 255, g: 0, b: 255 },
    cyan: { r: 0, g: 255, b: 255 },
    white: { r: 255, g: 255, b: 255 },
    gray: { r: 128, g: 128, b: 128 },
    grey: { r: 128, g: 128, b: 128 },
  };

  const lowerColor = color.toLowerCase();
  if (namedColors[lowerColor]) {
    return namedColors[lowerColor];
  }

  // Hex color (#RGB or #RRGGBB)
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    if (hex.length === 3) {
      return {
        r: parseInt(hex[0]! + hex[0], 16),
        g: parseInt(hex[1]! + hex[1], 16),
        b: parseInt(hex[2]! + hex[2], 16),
      };
    } else if (hex.length === 6) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
      };
    }
  }

  return null;
}

/**
 * Convert RGB to hex color string
 */
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) =>
    Math.round(Math.max(0, Math.min(255, n)))
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function interpolateColor(
  start: string,
  end: string,
  progress: number,
  easingFn: EasingFunction = easing.linear
): string {
  const eased = easingFn(Math.max(0, Math.min(1, progress)));

  const startRgb = parseColor(start);
  const endRgb = parseColor(end);

  if (!startRgb || !endRgb) {
    // Fallback: return end color if progress > 0.5, else start
    return eased >= 0.5 ? end : start;
  }

  // Linear interpolation in RGB space
  const r = startRgb.r + (endRgb.r - startRgb.r) * eased;
  const g = startRgb.g + (endRgb.g - startRgb.g) * eased;
  const b = startRgb.b + (endRgb.b - startRgb.b) * eased;

  return rgbToHex(r, g, b);
}

/**
 * Frame rate controller for terminal animations
 * Throttles animation updates to prevent excessive rendering
 */
export class FrameRateController {
  private frameInterval: number;
  private lastFrameTime: number = 0;
  private animationFrameId: number | null = null;

  constructor(targetFPS: number = 10) {
    // Terminal animations should be slower than browser (10-15 FPS is good)
    this.frameInterval = 1000 / targetFPS;
  }

  /**
   * Request next animation frame
   * @param callback - Function to call on next frame
   */
  requestAnimationFrame(callback: (timestamp: number) => void): void {
    // Cancel any pending frame
    if (this.animationFrameId !== null) {
      clearTimeout(this.animationFrameId);
    }

    const now = Date.now();
    const elapsed = now - this.lastFrameTime;
    const delay = Math.max(0, this.frameInterval - elapsed);

    // Always use setTimeout to ensure we don't block and allow React to process
    this.animationFrameId = setTimeout(() => {
      this.lastFrameTime = Date.now();
      this.animationFrameId = null;
      callback(Date.now());
    }, delay) as unknown as number;
  }

  /**
   * Cancel pending animation frame
   */
  cancelAnimationFrame(): void {
    if (this.animationFrameId !== null) {
      clearTimeout(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Set target FPS
   * @param fps - Frames per second (default: 10)
   */
  setTargetFPS(fps: number): void {
    this.frameInterval = 1000 / fps;
  }
}

/**
 * Animation configuration
 */
export interface AnimationConfig {
  duration: number; // Duration in milliseconds
  delay?: number; // Delay before starting (milliseconds)
  easing?: EasingFunction; // Easing function
  iterations?: number; // Number of iterations (Infinity for infinite)
  direction?: AnimationDirection; // Animation direction
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both'; // Fill mode
}

/**
 * Create animation config with defaults
 */
export function createAnimationConfig(config: Partial<AnimationConfig> = {}): AnimationConfig {
  return {
    duration: 1000,
    delay: 0,
    easing: easing.linear,
    iterations: 1,
    direction: 'in',
    fillMode: 'forwards',
    ...config,
  };
}

/**
 * Calculate animation progress
 * @param elapsed - Elapsed time since start (milliseconds)
 * @param config - Animation configuration
 * @returns Progress value from 0 to 1 (may exceed 1 for repeated animations)
 */
export function calculateAnimationProgress(elapsed: number, config: AnimationConfig): number {
  const delay = config.delay || 0;
  if (elapsed < delay) {
    return 0;
  }

  const adjustedElapsed = elapsed - delay;
  const duration = config.duration;
  const iterations = config.iterations || 1;

  if (iterations === Infinity) {
    return (adjustedElapsed % duration) / duration;
  }

  const totalDuration = duration * iterations;
  if (adjustedElapsed >= totalDuration) {
    return 1;
  }

  const progress = (adjustedElapsed % duration) / duration;

  // Handle direction
  if (config.direction === 'out') {
    return 1 - progress;
  } else if (config.direction === 'inOut') {
    const cycle = Math.floor(adjustedElapsed / duration) % 2;
    return cycle === 0 ? progress : 1 - progress;
  }

  return progress;
}
