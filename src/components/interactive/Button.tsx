/**
 * Button component - clickable action with JSX-style event handlers
 * React Native-like pattern for terminal
 */

import type { ReactNode } from 'react';
import type { ComponentEventHandlers, ConsoleNode, KeyPress, ViewStyle } from '../../types';
import type { StyleProps } from '../../types';
import { createConsoleNode, mergeClassNameAndStyle } from '../utils';
import { debug } from '../../utils/debug';

/**
 * Props for the Button component
 *
 * Supports both mouse clicks (if terminal supports it) and keyboard activation
 * (Enter/Space keys when focused).
 *
 * @example
 * ```tsx
 * <Button onClick={() => console.log('Clicked!')}>
 *   Click Me
 * </Button>
 *
 * <Button
 *   id="submit-btn"
 *   label="Submit"
 *   onClick={handleSubmit}
 *   disabled={!isValid}
 *   style={{ backgroundColor: 'blue', color: 'white' }}
 *   disabledStyle={{ color: 'gray', backgroundColor: 'darkGray' }}
 * />
 * ```
 */
export interface ButtonProps extends StyleProps, ComponentEventHandlers {
  children?: ReactNode;
  id?: string; // Unique identifier for the button (used with submitButtonId)
  style?: ViewStyle | ViewStyle[]; // CSS-like style (similar to React Native)
  disabled?: boolean;
  label?: string; // Alternative to children for simple text buttons
  tabIndex?: number; // Tab order (auto-assigned if not set)
  // State-specific styles (override default styles for each state)
  disabledStyle?: ViewStyle; // Style when disabled
  focusedStyle?: ViewStyle; // Style when focused
  pressedStyle?: ViewStyle; // Style when pressed
  hoveredStyle?: ViewStyle; // Style when hovered
}

/**
 * Button component - Clickable action button with keyboard and mouse support
 *
 * Supports both keyboard activation (Enter/Space when focused) and mouse clicks
 * (if terminal supports mouse events). Automatically disabled when `disabled` prop is true.
 *
 * @param props - Button component props
 * @returns React element representing a button
 *
 * @example
 * ```tsx
 * <Button onClick={() => handleSubmit()}>
 *   Submit
 * </Button>
 *
 * <Button
 *   label="Cancel"
 *   disabled={isLoading}
 *   onClick={handleCancel}
 *   style={{ color: 'red' }}
 * />
 * ```
 */
function ButtonComponent({
  children,
  id,
  label,
  disabled = false,
  tabIndex,
  onClick,
  disabledStyle,
  focusedStyle,
  pressedStyle,
  hoveredStyle,
  className,
  style,
  ...styleProps
}: ButtonProps) {
  debug('[ButtonComponent] render', { id, disabled });
  const displayText = label || (typeof children === 'string' ? children : 'Button');

  // Merge className with style prop and legacy style props
  const mergedStyle = mergeClassNameAndStyle(className, style, styleProps);

  // This component is handled by the reconciler
  // The reconciler will call onClick when Enter/Space is pressed while focused
  // or when mouse is clicked on the button (if terminal supports mouse events)
  return createConsoleNode('button', {
    id,
    label: displayText,
    content: displayText,
    style: mergedStyle,
    styles: mergedStyle,
    disabled,
    tabIndex,
    disabledStyle,
    focusedStyle,
    pressedStyle,
    hoveredStyle,
    onClick: disabled ? undefined : onClick,
  });
}

// Export Button component directly (memo removed for debugging)
export const Button = ButtonComponent;

/**
 * Handle input for Button component
 */
export function handleButtonComponent(
  component: ConsoleNode,
  _chunk: string,
  key: KeyPress,
  scheduleUpdate: () => void
): void {
  // Handle button component
  if (key.return || key.char === ' ') {
    if (component.onClick) {
      component.onClick({ x: 0, y: 0 }); // Simplified mouse event
      scheduleUpdate();
    }
  }
}
