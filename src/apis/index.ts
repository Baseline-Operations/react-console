/**
 * React Native Compatible APIs for Terminal
 *
 * These APIs provide React Native-like functionality adapted for terminal/console applications.
 *
 * @example
 * ```tsx
 * import { AppState, Keyboard, BackHandler, Clipboard, Alert } from '@baseline-operations/react-console/apis';
 *
 * // Monitor app state
 * AppState.addEventListener('change', (state) => {
 *   console.log('App state changed to:', state);
 * });
 *
 * // Handle back button
 * BackHandler.addEventListener('hardwareBackPress', () => {
 *   if (canGoBack) {
 *     goBack();
 *     return true;
 *   }
 *   return false;
 * });
 *
 * // Copy to clipboard
 * await Clipboard.setString('Hello!');
 *
 * // Show alert
 * Alert.alert('Title', 'Message', [
 *   { text: 'Cancel', style: 'cancel' },
 *   { text: 'OK', onPress: () => handleOK() },
 * ]);
 * ```
 */

// AppState - Application lifecycle
export { AppState, useAppState } from './AppState';
export type { AppStateStatus, AppStateEvent, NativeEventSubscription } from './AppState';

// Keyboard - Keyboard events
export { Keyboard } from './Keyboard';
export type {
  KeyboardEventName,
  KeyboardMetrics,
  KeyboardEvent,
  AndroidSoftInputModes,
} from './Keyboard';

// BackHandler - Back button handling
export { BackHandler, useBackHandler } from './BackHandler';
export type { BackHandlerCallback } from './BackHandler';

// Clipboard - Copy/paste
export { Clipboard, useClipboard } from './Clipboard';
export type { ClipboardContent } from './Clipboard';

// Alert - Modal dialogs
export { Alert } from './Alert';
export type {
  AlertButtonStyle,
  AlertButton,
  AlertOptions,
  PromptOptions,
  AlertRenderer,
} from './Alert';

// Bell - Terminal audio feedback (beeps/alerts)
export { Bell, useBell } from './Bell';
export type { BellPattern, BellOptions } from './Bell';

// Dimensions - Terminal/window dimensions
export { Dimensions, useWindowDimensions } from './Dimensions';
export type { ScaledSize, DimensionsChangeEvent } from './Dimensions';

// Platform - Platform detection and selection
export { Platform } from './Platform';
export type { PlatformOSType, PlatformSelectSpecifics, PlatformConstants } from './Platform';
