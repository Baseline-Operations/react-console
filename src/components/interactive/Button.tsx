/**
 * Button component - clickable action with JSX-style event handlers
 * React Native-like pattern for terminal
 */

import { memo } from 'react';
import type { ReactNode } from 'react';
import type { ComponentEventHandlers, ConsoleNode, KeyPress, ViewStyle } from '../../types';
import type { StyleProps } from '../../types';
import { createConsoleNode, mergeClassNameAndStyle } from '../utils';

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
 *   label="Submit"
 *   onClick={handleSubmit}
 *   disabled={!isValid}
 *   style={{ backgroundColor: 'blue', color: 'white' }}
 * />
 * ```
 */
export interface ButtonProps extends StyleProps, ComponentEventHandlers {
  children?: ReactNode;
  style?: ViewStyle | ViewStyle[]; // CSS-like style (similar to React Native)
  disabled?: boolean;
  label?: string; // Alternative to children for simple text buttons
  tabIndex?: number; // Tab order (auto-assigned if not set)
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
  label, 
  disabled = false, 
  tabIndex, 
  onClick, 
  className,
  style,
  ...styleProps 
}: ButtonProps) {
  const displayText = label || (typeof children === 'string' ? children : 'Button');
  
  // Merge className with style prop and legacy style props
  const mergedStyle = mergeClassNameAndStyle(className, style, styleProps);

  // This component is handled by the reconciler
  // The reconciler will call onClick when Enter/Space is pressed while focused
  // or when mouse is clicked on the button (if terminal supports mouse events)
  return createConsoleNode('button', {
    label: displayText,
    content: displayText,
    style: mergedStyle,
    styles: mergedStyle,
    disabled,
    tabIndex,
    onClick: disabled ? undefined : onClick,
  });
}

// Memoize Button component for performance (stable component)
export const Button = memo(ButtonComponent);

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
