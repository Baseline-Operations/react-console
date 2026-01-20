/**
 * Animation utilities for terminal animations
 * Provides easing functions, interpolation, and frame rate control
 */

export type EasingFunction = (t: number) => number;
export type AnimationType = 'fade' | 'slide' | 'spin' | 'pulse' | 'bounce' | 'typewriter' | 'blink' | 'shake';
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
  easeInOut: (t: number): number => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  
  /** Cubic ease in */
  cubicIn: (t: number): number => t * t * t,
  
  /** Cubic ease out */
  cubicOut: (t: number): number => --t * t * t + 1,
  
  /** Cubic ease in-out */
  cubicInOut: (t: number): number => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  
  /** Quadratic ease in */
  quadIn: (t: number): number => t * t,
  
  /** Quadratic ease out */
  quadOut: (t: number): number => t * (2 - t),
  
  /** Quadratic ease in-out */
  quadInOut: (t: number): number => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
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
export function interpolateColor(
  start: string,
  end: string,
  progress: number,
  easingFn: EasingFunction = easing.linear
): string {
  const eased = easingFn(Math.max(0, Math.min(1, progress)));
  
  // Simple color interpolation - maps to nearest named color
  // In a full implementation, this could do actual color space interpolation
  const colorMap: Record<string, number> = {
    black: 0, red: 1, green: 2, yellow: 3, blue: 4, magenta: 5, cyan: 6, white: 7,
    gray: 8, grey: 8,
  };
  
  const startIdx = colorMap[start.toLowerCase()] ?? 0;
  const endIdx = colorMap[end.toLowerCase()] ?? 7;
  
  if (eased < 0.5) {
    return Object.keys(colorMap).find(k => colorMap[k] === startIdx) || start;
  }
  return Object.keys(colorMap).find(k => colorMap[k] === endIdx) || end;
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
    const now = Date.now();
    const elapsed = now - this.lastFrameTime;
    
    if (elapsed >= this.frameInterval) {
      this.lastFrameTime = now - (elapsed % this.frameInterval);
      callback(now);
    } else {
      const delay = this.frameInterval - elapsed;
      this.animationFrameId = setTimeout(() => {
        this.lastFrameTime = Date.now();
        callback(Date.now());
      }, delay) as unknown as number;
    }
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
export function calculateAnimationProgress(
  elapsed: number,
  config: AnimationConfig
): number {
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
