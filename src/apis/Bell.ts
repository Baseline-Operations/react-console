/**
 * Bell API - Terminal audio feedback
 * Provides bell/beep sounds for terminal applications
 *
 * Uses the terminal bell character (BEL, \x07) which causes
 * the terminal to emit an audible or visual alert depending
 * on terminal settings.
 */

/**
 * Bell pattern for complex sounds
 */
export interface BellPattern {
  /** Number of beeps */
  count: number;
  /** Delay between beeps in ms (default: 100) */
  interval?: number;
}

/**
 * Bell options
 */
export interface BellOptions {
  /** Use visual bell instead of audible (if terminal supports it) */
  visual?: boolean;
}

class BellModule {
  private _enabled: boolean = true;
  private _currentTimeout: NodeJS.Timeout | null = null;

  /**
   * Ring the terminal bell once
   *
   * @example
   * ```tsx
   * // Simple beep
   * Bell.ring();
   *
   * // Visual bell (if supported)
   * Bell.ring({ visual: true });
   * ```
   */
  ring(options?: BellOptions): void {
    if (!this._enabled) return;

    if (options?.visual) {
      // Visual bell - flash the screen (reverse video briefly)
      // Not all terminals support this
      process.stdout.write('\x1b[?5h'); // Enable reverse video
      setTimeout(() => {
        process.stdout.write('\x1b[?5l'); // Disable reverse video
      }, 100);
    } else {
      // Audible bell
      process.stdout.write('\x07');
    }
  }

  /**
   * Ring the bell multiple times with a pattern
   *
   * @param pattern - Number of beeps or pattern object
   *
   * @example
   * ```tsx
   * // 3 quick beeps
   * Bell.beep(3);
   *
   * // Custom pattern
   * Bell.beep({ count: 2, interval: 200 });
   * ```
   */
  beep(pattern: number | BellPattern): void {
    if (!this._enabled) return;

    const count = typeof pattern === 'number' ? pattern : pattern.count;
    const interval = typeof pattern === 'number' ? 100 : (pattern.interval ?? 100);

    if (count <= 0) return;

    // Ring first bell immediately
    this.ring();

    if (count === 1) return;

    // Schedule remaining bells
    let remaining = count - 1;
    const ringNext = () => {
      if (remaining > 0 && this._enabled) {
        this.ring();
        remaining--;
        if (remaining > 0) {
          this._currentTimeout = setTimeout(ringNext, interval);
        }
      }
    };

    this._currentTimeout = setTimeout(ringNext, interval);
  }

  /**
   * Cancel any ongoing bell pattern
   */
  cancel(): void {
    if (this._currentTimeout) {
      clearTimeout(this._currentTimeout);
      this._currentTimeout = null;
    }
  }

  /**
   * Enable or disable bell sounds
   * Useful for "mute" functionality
   *
   * @param enabled - Whether bells are enabled
   */
  setEnabled(enabled: boolean): void {
    this._enabled = enabled;
    if (!enabled) {
      this.cancel();
    }
  }

  /**
   * Check if bells are enabled
   */
  isEnabled(): boolean {
    return this._enabled;
  }

  /**
   * Play an alert sound (3 quick beeps)
   * Convenience method for error/warning notifications
   */
  alert(): void {
    this.beep({ count: 3, interval: 80 });
  }

  /**
   * Play a success sound (2 beeps)
   * Convenience method for success notifications
   */
  success(): void {
    this.beep({ count: 2, interval: 150 });
  }

  /**
   * Play an error sound (1 long conceptual beep via multiple rapid beeps)
   * Convenience method for error notifications
   */
  error(): void {
    this.beep({ count: 5, interval: 50 });
  }
}

/**
 * Bell singleton instance
 */
export const Bell = new BellModule();

/**
 * Hook: useBell
 * React hook for bell functionality
 *
 * @returns Bell control functions
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const bell = useBell();
 *
 *   const handleError = () => {
 *     bell.error();
 *   };
 *
 *   const handleSuccess = () => {
 *     bell.success();
 *   };
 *
 *   return <Button onPress={handleSuccess}>Complete</Button>;
 * }
 * ```
 */
export function useBell() {
  return {
    ring: (options?: BellOptions) => Bell.ring(options),
    beep: (pattern: number | BellPattern) => Bell.beep(pattern),
    alert: () => Bell.alert(),
    success: () => Bell.success(),
    error: () => Bell.error(),
    cancel: () => Bell.cancel(),
    setEnabled: (enabled: boolean) => Bell.setEnabled(enabled),
    isEnabled: () => Bell.isEnabled(),
  };
}
