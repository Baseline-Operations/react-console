/**
 * Shared input handling helpers
 * Common utilities for input components to reduce duplication
 */

import type { ConsoleNode, KeyPress, InputEvent } from '../../types';
import { validateNumberInput } from '../../utils/input';

/**
 * Result of character deletion operation
 */
export interface DeletionResult {
  newValue: string | number;
  newValueStr: string;
  valueChanged: boolean;
}

/**
 * Handle character deletion (backspace or delete)
 * Shared logic for removing characters from input value
 *
 * @param currentValue - Current input value
 * @param currentValueStr - Current input value as string
 * @param inputType - Input type ('text', 'number', etc.)
 * @param component - ConsoleNode component (for validation)
 * @returns Deletion result with new value and changed flag
 */
export function handleCharacterDeletion(
  currentValue: string | number | undefined,
  currentValueStr: string,
  inputType: string,
  component: ConsoleNode
): DeletionResult {
  if (currentValueStr.length === 0) {
    return {
      newValue: currentValue || '',
      newValueStr: currentValueStr,
      valueChanged: false,
    };
  }

  const newValueStr = currentValueStr.slice(0, -1);
  let newValue: string | number;

  // Convert back to appropriate type
  if (inputType === 'number') {
    const validation = validateNumberInput(newValueStr, component);
    if (validation.valid && validation.value !== null) {
      newValue = validation.value;
      // Use display value if validation changed it
      // Note: displayValue might be longer than newValueStr if formatting is applied
      // For now, use newValueStr as it represents the raw input
    } else {
      newValue = '';
    }
  } else {
    newValue = newValueStr;
  }

  return {
    newValue,
    newValueStr: typeof newValue === 'number' ? String(newValue) : newValue,
    valueChanged: true,
  };
}

/**
 * Handle character input with validation
 * Shared logic for adding characters to input value
 *
 * @param currentValueStr - Current input value as string
 * @param inputChar - Character to add
 * @param inputType - Input type ('text', 'number', etc.)
 * @param component - ConsoleNode component (for validation and constraints)
 * @param maxLength - Maximum length constraint
 * @returns Object with new value string and whether input should be accepted
 */
export function handleCharacterInput(
  currentValueStr: string,
  inputChar: string,
  inputType: string,
  component: ConsoleNode,
  maxLength?: number
): { newValueStr: string; accepted: boolean; displayChar?: string } {
  // Check length constraint
  if (maxLength !== undefined && currentValueStr.length >= maxLength) {
    return { newValueStr: currentValueStr, accepted: false };
  }

  let processedChar = inputChar;

  // For number input, validate character
  if (inputType === 'number') {
    const testInput = currentValueStr + inputChar;
    const validation = validateNumberInput(testInput, component);
    if (!validation.valid) {
      // Invalid character for number input
      return { newValueStr: currentValueStr, accepted: false };
    }
    // Use display value if validation changed it (for formatting)
    processedChar = validation.displayValue.slice(currentValueStr.length);
  }

  // Validate against pattern if provided
  if (component.pattern) {
    const testInput = currentValueStr + processedChar;
    const { validatePattern } = require('../../utils/input');
    if (!validatePattern(testInput, component.pattern)) {
      return { newValueStr: currentValueStr, accepted: false };
    }
  }

  return {
    newValueStr: currentValueStr + processedChar,
    accepted: true,
    displayChar: processedChar,
  };
}

/**
 * Convert input string to typed value based on input type
 * Shared logic for type conversion after input changes
 *
 * @param valueStr - Input value as string
 * @param inputType - Input type ('text', 'number', etc.)
 * @param component - ConsoleNode component (for validation)
 * @returns Typed value (string or number)
 */
export function convertToTypedValue(
  valueStr: string,
  inputType: string,
  component: ConsoleNode
): string | number {
  if (inputType === 'number') {
    const validation = validateNumberInput(valueStr, component);
    if (validation.valid && validation.value !== null) {
      return validation.value;
    }
    return valueStr; // Return string if invalid (will be cleared or handled by caller)
  }
  return valueStr;
}

/**
 * Create input event object
 * Helper for creating consistent InputEvent objects
 *
 * @param value - New input value
 * @param key - KeyPress event
 * @returns InputEvent object
 */
export function createInputEvent(
  value: string | number | boolean | (string | number)[],
  key: KeyPress
): InputEvent {
  return { value, key };
}
