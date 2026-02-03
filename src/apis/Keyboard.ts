/**
 * Keyboard API - React Native compatible keyboard management
 * Handles keyboard events and visibility in terminal context
 *
 * In terminal context, the keyboard is always "visible" as input is always available.
 * This API provides event hooks for keyboard-related events.
 */

import { EventEmitter } from 'events';
import type { NativeEventSubscription } from './AppState';

/**
 * Keyboard event types (React Native compatible)
 */
export type KeyboardEventName =
  | 'keyboardWillShow'
  | 'keyboardDidShow'
  | 'keyboardWillHide'
  | 'keyboardDidHide'
  | 'keyboardWillChangeFrame'
  | 'keyboardDidChangeFrame';

/**
 * Keyboard metrics (React Native compatible)
 */
export interface KeyboardMetrics {
  screenX: number;
  screenY: number;
  width: number;
  height: number;
}

/**
 * Keyboard event (React Native compatible)
 */
export interface KeyboardEvent {
  duration: number;
  easing: string;
  endCoordinates: KeyboardMetrics;
  startCoordinates?: KeyboardMetrics;
}

/**
 * Android soft input modes (React Native compatible, no-op in terminal)
 */
export type AndroidSoftInputModes =
  | 'adjustNothing'
  | 'adjustPan'
  | 'adjustResize'
  | 'adjustUnspecified';

class KeyboardModule {
  private _emitter = new EventEmitter();
  private _isVisible: boolean = false;

  constructor() {
    // Initialize
  }

  /**
   * Add event listener for keyboard events
   * Note: In terminal, keyboard is always available
   */
  addListener(
    eventType: KeyboardEventName,
    listener: (event: KeyboardEvent) => void
  ): NativeEventSubscription {
    const wrappedListener = (event: KeyboardEvent) => listener(event);
    this._emitter.on(eventType, wrappedListener);

    return {
      remove: () => {
        this._emitter.off(eventType, wrappedListener);
      },
    };
  }

  /**
   * Remove event listener (legacy)
   * @deprecated Use subscription.remove() instead
   */
  removeListener(eventType: KeyboardEventName, listener: (event: KeyboardEvent) => void): void {
    this._emitter.off(eventType, listener);
  }

  /**
   * Remove all listeners for an event type
   */
  removeAllListeners(eventType?: KeyboardEventName): void {
    if (eventType) {
      this._emitter.removeAllListeners(eventType);
    } else {
      this._emitter.removeAllListeners();
    }
  }

  /**
   * Emit an event
   */
  emit(eventType: string, ...args: unknown[]): boolean {
    return this._emitter.emit(eventType, ...args);
  }

  /**
   * Dismiss the keyboard
   * In terminal context, this blurs the current focused input
   */
  dismiss(): void {
    // In terminal, we emit an event that can be caught by focused inputs
    this.emit('dismiss');
    this._setVisible(false);
  }

  /**
   * Whether keyboard is visible
   * In terminal, this typically means an input is focused
   */
  isVisible(): boolean {
    return this._isVisible;
  }

  /**
   * Get keyboard metrics (for compatibility)
   * Terminal doesn't have a software keyboard, so returns zeros
   */
  metrics(): KeyboardMetrics | undefined {
    if (!this._isVisible) return undefined;

    return {
      screenX: 0,
      screenY: 0,
      width: process.stdout.columns || 80,
      height: 0, // No keyboard height in terminal
    };
  }

  /**
   * Schedule layout animation (no-op in terminal)
   * React Native compatible
   */
  scheduleLayoutAnimation(_event: KeyboardEvent): void {
    // No-op in terminal - animations not supported
  }

  /**
   * Set Android soft input mode (no-op in terminal)
   * React Native compatible
   */
  setAndroidSoftInputMode(_mode: AndroidSoftInputModes): void {
    // No-op in terminal
  }

  /**
   * Internal: set keyboard visibility
   * Called when input gains/loses focus
   */
  _setVisible(visible: boolean): void {
    if (this._isVisible !== visible) {
      const oldVisible = this._isVisible;
      this._isVisible = visible;

      const event: KeyboardEvent = {
        duration: 0,
        easing: 'keyboard',
        endCoordinates: this.metrics() || { screenX: 0, screenY: 0, width: 0, height: 0 },
      };

      if (visible && !oldVisible) {
        this.emit('keyboardWillShow', event);
        this.emit('keyboardDidShow', event);
      } else if (!visible && oldVisible) {
        this.emit('keyboardWillHide', event);
        this.emit('keyboardDidHide', event);
      }
    }
  }
}

/**
 * Keyboard singleton instance
 */
export const Keyboard = new KeyboardModule();
