/**
 * Switch component - Toggle switch (React Native compatible)
 * Terminal equivalent of React Native's Switch component
 */

import { useState, useEffect } from 'react';
import type { StyleProps, ViewStyle } from '../../types';
import { createConsoleNode, mergeClassNameAndStyle } from '../utils';

/**
 * Native switch change event (React Native compatible)
 */
export interface SwitchChangeEvent {
  nativeEvent: {
    value: boolean;
    target?: number;
  };
}

/**
 * Props for the Switch component (React Native compatible)
 *
 * @example
 * ```tsx
 * <Switch
 *   value={isEnabled}
 *   onValueChange={setIsEnabled}
 *   trackColor={{ false: '#767577', true: '#81b0ff' }}
 *   thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
 * />
 * ```
 */
export interface SwitchProps extends StyleProps {
  /** Whether the switch is on (controlled) */
  value?: boolean;
  /** Default value (uncontrolled) */
  defaultValue?: boolean;
  /** Callback when the value changes */
  onValueChange?: (value: boolean) => void;
  /** Whether the switch is disabled */
  disabled?: boolean;
  /** iOS-specific: color of the background when switch is off */
  ios_backgroundColor?: string;
  /** Color of the track (React Native compatible) */
  trackColor?: { false?: string; true?: string } | string;
  /** Color of the thumb (React Native compatible) */
  thumbColor?: string;
  /** Tab order for keyboard navigation */
  tabIndex?: number;
  /** Auto focus on mount */
  autoFocus?: boolean;
  /** Called when focus is received */
  onFocus?: () => void;
  /** Called when focus is lost */
  onBlur?: () => void;
  /** CSS-like style */
  style?: ViewStyle | ViewStyle[];
  /** Class names for style libraries */
  className?: string | string[];

  // Terminal-specific visual customization
  /** Character for on state (default: '●') */
  onChar?: string;
  /** Character for off state (default: '○') */
  offChar?: string;
  /** Track character when on (default: '━') */
  trackOnChar?: string;
  /** Track character when off (default: '─') */
  trackOffChar?: string;
  /** Label to show when on */
  onLabel?: string;
  /** Label to show when off */
  offLabel?: string;
}

// Default visual characters for terminal switch
const DEFAULT_ON_CHAR = '●';
const DEFAULT_OFF_CHAR = '○';
const DEFAULT_TRACK_ON_CHAR = '━';
const DEFAULT_TRACK_OFF_CHAR = '─';

/**
 * Switch component - Toggle switch (React Native compatible)
 *
 * A toggle switch that can be switched between on and off states.
 * Supports both controlled (value + onValueChange) and uncontrolled (defaultValue) modes.
 *
 * @param props - Switch component props
 * @returns React element representing a toggle switch
 *
 * @example
 * ```tsx
 * // Controlled
 * const [isEnabled, setIsEnabled] = useState(false);
 * <Switch value={isEnabled} onValueChange={setIsEnabled} />
 *
 * // With colors
 * <Switch
 *   value={isEnabled}
 *   onValueChange={setIsEnabled}
 *   trackColor={{ false: 'gray', true: 'green' }}
 *   thumbColor={isEnabled ? 'white' : 'lightgray'}
 * />
 *
 * // With labels
 * <Switch
 *   value={isEnabled}
 *   onValueChange={setIsEnabled}
 *   onLabel="ON"
 *   offLabel="OFF"
 * />
 * ```
 */
export function Switch({
  value,
  defaultValue = false,
  onValueChange,
  disabled = false,
  ios_backgroundColor,
  trackColor,
  thumbColor,
  tabIndex,
  autoFocus,
  onFocus,
  onBlur,
  className,
  style,
  onChar = DEFAULT_ON_CHAR,
  offChar = DEFAULT_OFF_CHAR,
  trackOnChar = DEFAULT_TRACK_ON_CHAR,
  trackOffChar = DEFAULT_TRACK_OFF_CHAR,
  onLabel,
  offLabel,
  ...styleProps
}: SwitchProps): ReturnType<typeof createConsoleNode> {
  // Support controlled and uncontrolled modes
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  // Sync internal state with controlled value
  useEffect(() => {
    if (isControlled) {
      setInternalValue(value);
    }
  }, [isControlled, value]);

  // Determine colors
  let trackColorResolved: string | undefined;
  if (typeof trackColor === 'string') {
    trackColorResolved = trackColor;
  } else if (trackColor) {
    trackColorResolved = currentValue ? trackColor.true : trackColor.false;
  }

  // Default colors
  const defaultTrackOnColor = '#4CAF50'; // Green
  const defaultTrackOffColor = ios_backgroundColor || '#767577'; // Gray
  const defaultThumbColor = currentValue ? '#ffffff' : '#f4f3f4';

  // Use track color for future visual enhancements
  // const effectiveTrackColor = trackColorResolved || (currentValue ? defaultTrackOnColor : defaultTrackOffColor);
  const effectiveThumbColor = thumbColor || defaultThumbColor;

  // Suppress unused variable warning (used for future enhancements)
  void (trackColorResolved || defaultTrackOnColor || defaultTrackOffColor);

  // Build visual representation
  // Format: [track][thumb][track] or with labels [offLabel][track][thumb][track][onLabel]
  const thumbChar = currentValue ? onChar : offChar;
  const trackChar = currentValue ? trackOnChar : trackOffChar;

  // Construct the switch visual
  // OFF state: ─○─── or ─○
  // ON state:  ━━━●━ or ●━
  let content = '';
  if (offLabel && !currentValue) {
    content += offLabel + ' ';
  }
  content += currentValue
    ? `${trackChar}${trackChar}${thumbChar}${trackChar}`
    : `${thumbChar}${trackChar}${trackChar}${trackChar}`;
  if (onLabel && currentValue) {
    content += ' ' + onLabel;
  }

  // Merge className with style prop and legacy style props
  const mergedStyle = mergeClassNameAndStyle(className, style, styleProps);

  // Handle toggle
  const handleToggle = () => {
    if (disabled) return;

    const newValue = !currentValue;

    // Update internal state for uncontrolled mode
    if (!isControlled) {
      setInternalValue(newValue);
    }

    // Call the callback
    onValueChange?.(newValue);
  };

  return createConsoleNode('box', {
    style: {
      ...mergedStyle,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    } as ViewStyle,
    disabled,
    tabIndex,
    autoFocus,
    onFocus,
    onBlur,
    onClick: handleToggle,
    onPress: handleToggle,
    children: [
      createConsoleNode('text', {
        content,
        style: {
          color: disabled ? '#666666' : effectiveThumbColor,
          backgroundColor: disabled ? '#333333' : undefined,
        },
      }),
    ],
  });
}
