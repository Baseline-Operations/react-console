/**
 * Interactive Mixin - Adds interactive capabilities to nodes
 * Type-safe using generics
 */

import type { Constructor, AbstractConstructor, MouseButton, MouseAction } from '../types';
import { MouseButton as MouseButtonEnum, MouseAction as MouseActionEnum } from '../types';
import { Node } from '../Node';

/**
 * Keyboard event type
 */
export interface KeyboardEvent {
  key: {
    char?: string;
    name?: string;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
    return?: boolean;
    escape?: boolean;
    tab?: boolean;
    backspace?: boolean;
    delete?: boolean;
    up?: boolean;
    down?: boolean;
    left?: boolean;
    right?: boolean;
    home?: boolean;
    end?: boolean;
    pageUp?: boolean;
    pageDown?: boolean;
  };
  preventDefault(): void;
  stopPropagation(): void;
}

/**
 * Mouse event type
 */
export interface MouseEvent {
  x: number;
  y: number;
  button: MouseButton;
  action: MouseAction;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  preventDefault(): void;
  stopPropagation(): void;
}

/**
 * Input event type
 */
export interface InputEvent {
  value: string | number | boolean;
  target: Node;
}

/**
 * Mixin that adds interactive capabilities to a node
 * Type-safe using generics
 * Accepts both concrete and abstract constructors
 */
export function Interactive<TBase extends Constructor<Node> | AbstractConstructor<Node>>(
  Base: TBase
) {
  // Mixins return classes that extend Base, but the final composed class will implement abstract methods
  return class InteractiveNode extends (Base as Constructor<Node>) {
    // Interactive state
    focused: boolean = false;
    disabled: boolean = false;
    tabIndex: number = 0;

    // Event handlers
    onClick?: (event: MouseEvent) => void;
    onPress?: (event: MouseEvent) => void;
    onKeyDown?: (event: KeyboardEvent) => void;
    onKeyUp?: (event: KeyboardEvent) => void;
    onKeyPress?: (event: KeyboardEvent) => void;
    onChange?: (event: InputEvent) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    onMouseDown?: (event: MouseEvent) => void;
    onMouseUp?: (event: MouseEvent) => void;
    onMouseMove?: (event: MouseEvent) => void;
    onMouseEnter?: (event: MouseEvent) => void;
    onMouseLeave?: (event: MouseEvent) => void;

    /**
     * Focus this node
     */
    focus(): void {
      if (this.disabled) return;
      this.focused = true;
      this.onFocus?.();
    }

    /**
     * Blur this node
     */
    blur(): void {
      this.focused = false;
      this.onBlur?.();
    }

    /**
     * Handle click event
     */
    handleClick(event: MouseEvent): void {
      if (this.disabled) return;
      this.onClick?.(event);
      this.onPress?.(event);
    }

    /**
     * Handle keyboard event
     */
    handleKeyboardEvent(event: KeyboardEvent): void {
      if (this.disabled) return;

      if (event.key.return || event.key.char) {
        this.onKeyPress?.(event);
      }

      this.onKeyDown?.(event);
    }

    /**
     * Handle key up event
     */
    handleKeyUp(event: KeyboardEvent): void {
      if (this.disabled) return;
      this.onKeyUp?.(event);
    }

    /**
     * Handle mouse event
     */
    handleMouseEvent(event: MouseEvent): void {
      if (this.disabled) return;

      if (!this.containsPoint(event.x, event.y)) {
        return;
      }

      switch (event.action) {
        case MouseActionEnum.PRESS:
          this.onMouseDown?.(event);
          break;
        case MouseActionEnum.RELEASE:
          this.onMouseUp?.(event);
          if (event.button === MouseButtonEnum.LEFT) {
            this.onClick?.(event);
          }
          break;
        case MouseActionEnum.MOVE:
          this.onMouseMove?.(event);
          break;
      }
    }

    /**
     * Handle change event
     */
    handleChange(event: InputEvent): void {
      if (this.disabled) return;
      this.onChange?.(event);
    }

    /**
     * Check if point is within bounds
     */
    containsPoint(x: number, y: number): boolean {
      const bounds = this.getBounds();
      return (
        x >= bounds.x &&
        x < bounds.x + bounds.width &&
        y >= bounds.y &&
        y < bounds.y + bounds.height
      );
    }
  };
}
