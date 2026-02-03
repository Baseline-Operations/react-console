/**
 * Render State Management
 * Centralized state for the render system, shared between Node and RenderEntry
 * This allows render(), unmount(), exit() to be extracted while maintaining state access
 */

import type { FiberRoot } from 'react-reconciler';
import type { ReactElement } from 'react';
import type { Node } from '../nodes/base/Node';

/**
 * Render state - holds all static state needed by the render system
 */
export interface RenderState {
  /** The React reconciler fiber root */
  rootFiber: FiberRoot | null;
  /** The root Node container */
  rootContainer: Node | null;
  /** The current React element being rendered */
  currentElement: ReactElement | null;
  /** Whether the app is in interactive mode */
  isInteractive: boolean;
  /** Cleanup function for resize listener */
  resizeCleanup: (() => void) | null;
  /** Callback for render updates */
  renderCallback: (() => void) | null;
  /** Whether interactive mode was ever active (for cleanup) */
  wasInteractiveMode: boolean;
  /** Callback called after React commits changes */
  onCommitCallback: (() => void) | null;
  /** Navigation options for interactive mode */
  navigationOptions: {
    arrowKeyNavigation?: boolean;
    verticalArrowNavigation?: boolean;
    horizontalArrowNavigation?: boolean;
  };
}

/**
 * Global render state singleton
 * Using a plain object allows for direct property access and mutation
 */
export const renderState: RenderState = {
  rootFiber: null,
  rootContainer: null,
  currentElement: null,
  isInteractive: false,
  resizeCleanup: null,
  renderCallback: null,
  wasInteractiveMode: false,
  onCommitCallback: null,
  navigationOptions: {},
};

/**
 * Reset all render state to initial values
 * Called during unmount to clean up
 */
export function resetRenderState(): void {
  renderState.rootFiber = null;
  renderState.rootContainer = null;
  renderState.currentElement = null;
  renderState.isInteractive = false;
  renderState.resizeCleanup = null;
  renderState.renderCallback = null;
  renderState.wasInteractiveMode = false;
  // Don't reset onCommitCallback - it's managed separately
  renderState.navigationOptions = {};
}

/**
 * Set the commit callback
 * This is called after React commits changes to trigger screen rendering
 */
export function setOnCommitCallback(callback: (() => void) | null): void {
  renderState.onCommitCallback = callback;
}

/**
 * Get the commit callback
 */
export function getOnCommitCallback(): (() => void) | null {
  return renderState.onCommitCallback;
}
