/**
 * Alert API - React Native compatible alert dialogs
 * Provides modal dialogs in terminal context
 *
 * In terminal context, alerts are rendered as modal overlays
 * with keyboard-navigable buttons.
 */

/**
 * Alert button style (React Native compatible)
 */
export type AlertButtonStyle = 'default' | 'cancel' | 'destructive';

/**
 * Alert button configuration
 */
export interface AlertButton {
  /** Button text */
  text?: string;
  /** Callback when button is pressed */
  onPress?: (value?: string) => void;
  /** Button style */
  style?: AlertButtonStyle;
  /** Whether this is the preferred action (iOS) */
  isPreferred?: boolean;
}

/**
 * Alert options (React Native compatible)
 */
export interface AlertOptions {
  /** Whether alert can be dismissed by tapping outside (default: true) */
  cancelable?: boolean;
  /** Callback when alert is dismissed without button press */
  onDismiss?: () => void;
  /** User interface style (not applicable in terminal) */
  userInterfaceStyle?: 'unspecified' | 'light' | 'dark';
}

/**
 * Prompt options
 */
export interface PromptOptions {
  /** Prompt type */
  type?: 'default' | 'plain-text' | 'secure-text' | 'login-password';
  /** Default value for text input */
  defaultValue?: string;
  /** Keyboard type (not applicable in terminal) */
  keyboardType?: string;
  /** Placeholder text */
  placeholder?: string;
}

/**
 * Alert renderer interface
 * Implement this to customize how alerts are displayed
 */
export interface AlertRenderer {
  show(config: {
    title: string;
    message?: string;
    buttons: AlertButton[];
    options?: AlertOptions;
  }): void;

  prompt?(config: {
    title: string;
    message?: string;
    buttons: AlertButton[];
    type?: PromptOptions['type'];
    defaultValue?: string;
    keyboardType?: string;
  }): void;

  dismiss?(): void;
}

// Default renderer (can be overridden)
let alertRenderer: AlertRenderer | null = null;

// Queue of pending alerts (shown one at a time)
const alertQueue: Array<{
  type: 'alert' | 'prompt';
  config:
    | Parameters<AlertRenderer['show']>[0]
    | Parameters<NonNullable<AlertRenderer['prompt']>>[0];
}> = [];

let isShowingAlert = false;

/**
 * Process next alert in queue
 */
function processAlertQueue(): void {
  if (isShowingAlert || alertQueue.length === 0) {
    return;
  }

  const next = alertQueue.shift();
  if (!next) return;

  isShowingAlert = true;

  if (alertRenderer) {
    if (next.type === 'alert') {
      alertRenderer.show(next.config as Parameters<AlertRenderer['show']>[0]);
    } else if (next.type === 'prompt' && alertRenderer.prompt) {
      alertRenderer.prompt(next.config as Parameters<NonNullable<AlertRenderer['prompt']>>[0]);
    }
  } else {
    // Fallback: log to console
    const config = next.config;
    console.log(`\n=== ${config.title} ===`);
    if (config.message) {
      console.log(config.message);
    }
    if (config.buttons && config.buttons.length > 0) {
      console.log('Buttons:', config.buttons.map((b) => b.text).join(', '));
      // Auto-select first button for non-interactive fallback
      const firstButton = config.buttons[0];
      if (firstButton?.onPress) {
        firstButton.onPress();
      }
    }
    isShowingAlert = false;
    processAlertQueue();
  }
}

/**
 * Mark current alert as dismissed
 */
function alertDismissed(): void {
  isShowingAlert = false;
  processAlertQueue();
}

class AlertModule {
  /**
   * Display an alert dialog
   *
   * @param title - Alert title
   * @param message - Alert message (optional)
   * @param buttons - Array of buttons (optional, defaults to OK)
   * @param options - Alert options (optional)
   *
   * @example
   * ```tsx
   * // Simple alert
   * Alert.alert('Hello', 'This is a message');
   *
   * // With buttons
   * Alert.alert(
   *   'Confirm',
   *   'Are you sure?',
   *   [
   *     { text: 'Cancel', style: 'cancel' },
   *     { text: 'OK', onPress: () => handleConfirm() },
   *   ]
   * );
   * ```
   */
  alert(title: string, message?: string, buttons?: AlertButton[], options?: AlertOptions): void {
    // Default to OK button if none provided
    const alertButtons = buttons || [{ text: 'OK' }];

    // Wrap button callbacks to handle queue
    const wrappedButtons = alertButtons.map((button) => ({
      ...button,
      onPress: (value?: string) => {
        button.onPress?.(value);
        alertDismissed();
      },
    }));

    alertQueue.push({
      type: 'alert',
      config: {
        title,
        message,
        buttons: wrappedButtons,
        options,
      },
    });

    processAlertQueue();
  }

  /**
   * Display a prompt dialog with text input
   * iOS/Android compatible API
   *
   * @param title - Prompt title
   * @param message - Prompt message (optional)
   * @param callbackOrButtons - Callback or array of buttons
   * @param type - Prompt type (optional)
   * @param defaultValue - Default input value (optional)
   * @param keyboardType - Keyboard type (optional, ignored in terminal)
   *
   * @example
   * ```tsx
   * // Simple prompt
   * Alert.prompt('Name', 'Enter your name:', (text) => {
   *   console.log('Name:', text);
   * });
   *
   * // With buttons
   * Alert.prompt(
   *   'Name',
   *   'Enter your name:',
   *   [
   *     { text: 'Cancel', style: 'cancel' },
   *     { text: 'OK', onPress: (text) => console.log('Name:', text) },
   *   ],
   *   'plain-text',
   *   'John'
   * );
   * ```
   */
  prompt(
    title: string,
    message?: string,
    callbackOrButtons?: ((text: string) => void) | AlertButton[],
    type?: PromptOptions['type'],
    defaultValue?: string,
    keyboardType?: string
  ): void {
    let buttons: AlertButton[];

    if (typeof callbackOrButtons === 'function') {
      // Simple callback API - wrap to match AlertButton signature
      const callback = callbackOrButtons;
      buttons = [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: (value?: string) => callback(value ?? '') },
      ];
    } else if (Array.isArray(callbackOrButtons)) {
      buttons = callbackOrButtons;
    } else {
      buttons = [{ text: 'OK' }];
    }

    // Wrap button callbacks to handle queue
    const wrappedButtons = buttons.map((button) => ({
      ...button,
      onPress: (value?: string) => {
        button.onPress?.(value);
        alertDismissed();
      },
    }));

    alertQueue.push({
      type: 'prompt',
      config: {
        title,
        message,
        buttons: wrappedButtons,
        type: type || 'plain-text',
        defaultValue,
        keyboardType,
      },
    });

    processAlertQueue();
  }

  /**
   * Set custom alert renderer
   * Use this to integrate alerts with your UI system
   *
   * @param renderer - Custom renderer implementation
   */
  setRenderer(renderer: AlertRenderer | null): void {
    alertRenderer = renderer;
  }

  /**
   * Get current renderer
   */
  getRenderer(): AlertRenderer | null {
    return alertRenderer;
  }

  /**
   * Dismiss current alert
   */
  dismiss(): void {
    if (alertRenderer?.dismiss) {
      alertRenderer.dismiss();
    }
    alertDismissed();
  }
}

/**
 * Alert singleton instance
 */
export const Alert = new AlertModule();
