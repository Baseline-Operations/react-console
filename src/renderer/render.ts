/**
 * Main render function - renders React elements to console using new Node architecture
 * Uses the multi-buffer rendering system for all output
 */

import { reconciler } from './reconciler';
import type { ReactElement } from 'react';
import type { RenderMode } from '../types';
import { getBufferRenderer, resetBufferRenderer } from '../buffer';
import { hideCursor, showCursor } from './ansi';
import { startInputListener, stopInputListener } from './input';
import { getTerminalDimensions, onTerminalResizeDebounced, setRenderMode } from '../utils/terminal';
import { reportError, ErrorType } from '../utils/errors';
import { initializeStorage } from '../utils/storage';
import { scheduleBatchedUpdate } from './batching';
import type { Node } from '../nodes/base/Node';
import { BoxNode } from '../nodes/primitives/BoxNode';
import {
  collectInteractiveComponents,
  assignTabIndexes,
  handleTabNavigation,
  handleMouseEvent,
  focusComponent,
  findAllOverlays,
} from './utils/navigation';
import { componentBoundsRegistry } from './utils/componentBounds';
import { terminal, updateTerminalDimensions } from '../utils/globalTerminal';

let rootContainer: Node | null = null;
let rootFiber: ReturnType<typeof reconciler.createContainer> | null = null;
let errorHandlersInstalled = false;

/**
 * Emergency cleanup function for crashes
 * Ensures terminal state is restored even on errors
 */
function emergencyCleanup(): void {
  try {
    // Disable mouse tracking
    const { disableMouseTracking } = require('../utils/mouse');
    disableMouseTracking();
  } catch {
    // Ignore errors during cleanup
  }
  
  try {
    // Show cursor
    showCursor();
  } catch {
    // Ignore errors during cleanup
  }
  
  try {
    // Exit raw mode
    const { exitRawMode } = require('../utils/terminal');
    exitRawMode();
  } catch {
    // Ignore errors during cleanup
  }
}

/**
 * Install global error handlers to ensure cleanup on crash
 */
function installErrorHandlers(): void {
  if (errorHandlersInstalled) return;
  errorHandlersInstalled = true;
  
  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    emergencyCleanup();
    // eslint-disable-next-line no-console
    console.error('Uncaught exception:', error);
    process.exit(1);
  });
  
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason) => {
    emergencyCleanup();
    // eslint-disable-next-line no-console
    console.error('Unhandled rejection:', reason);
    process.exit(1);
  });
  
  // Handle SIGINT (Ctrl+C)
  process.on('SIGINT', () => {
    emergencyCleanup();
    process.exit(0);
  });
  
  // Handle SIGTERM
  process.on('SIGTERM', () => {
    emergencyCleanup();
    process.exit(0);
  });
}
let currentElement: ReactElement | null = null;
let isInteractive = false;
let renderCallback: (() => void) | null = null;
let resizeCleanup: (() => void) | null = null;
let previousFocusedComponent: Node | null = null;
let overlayStack: Node[] = [];
let isFirstRender = true;

/**
 * Render a React element to console using new Node architecture
 */
export function render(
  element: ReactElement,
  options?: {
    mode?: RenderMode;
    fullscreen?: boolean;
    onUpdate?: () => void;
    appId?: string;
  }
): void {
  const mode = options?.mode || 'static';
  const fullscreen = options?.fullscreen || false;
  renderCallback = options?.onUpdate || null;

  // Install global error handlers for safe cleanup on crashes
  installErrorHandlers();

  // Set the render mode for terminal dimensions calculation
  setRenderMode(mode);
  
  // Reset buffer renderer to pick up new dimensions (especially for static mode)
  resetBufferRenderer();
  
  initializeStorage(options?.appId);

  if (!rootFiber) {
    try {
      const { notifyAppStart } = require('../hooks/lifecycle');
      notifyAppStart();
    } catch {
      // Hooks module may not be loaded yet
    }
  }

  isInteractive = mode === 'interactive' || mode === 'fullscreen';
  currentElement = element;

  // Create root container using new Node system
  if (!rootContainer) {
    rootContainer = new BoxNode() as unknown as Node;
    if (fullscreen || mode === 'fullscreen') {
      // Set fullscreen style if needed
      if ('setStyle' in rootContainer) {
        (rootContainer as any).setStyle({ width: '100%', height: '100%' });
      }
    }
  }

  // Create reconciler container
  if (!rootFiber) {
    // Use LegacyRoot (0) for all modes - ConcurrentRoot has scheduling issues
    const rootTag = 0;
    
    rootFiber = reconciler.createContainer(
      rootContainer,
      rootTag,
      null,
      false,
      false,
      '',
      (error: Error) => {
        reportError(error, ErrorType.RENDER);
      },
      null
    );
  }

  // Update through React reconciliation
  try {
    // Use synchronous update path for both static and interactive modes
    // This ensures the render callback fires immediately
    if (typeof (reconciler as any).updateContainerSync === 'function') {
      (reconciler as any).updateContainerSync(element, rootFiber, null, () => {
        performRender();
      });
      if (typeof (reconciler as any).flushSyncWork === 'function') {
        (reconciler as any).flushSyncWork();
      }
    } else {
      // Fallback for older react-reconciler versions
      reconciler.updateContainer(element, rootFiber, null, () => {
        performRender();
      });
      // Try to flush any pending work
      if (typeof (reconciler as any).flushSync === 'function') {
        (reconciler as any).flushSync(() => {});
      }
    }
  } catch (error) {
    reportError(error, ErrorType.RENDER);
    throw error;
  }

  // Set up terminal resize listener
  if (resizeCleanup) {
    resizeCleanup();
  }
  resizeCleanup = onTerminalResizeDebounced(() => {
    updateTerminalDimensions();
    
    if (currentElement && rootFiber) {
      reconciler.updateContainer(currentElement, rootFiber, null, () => {
        performRender();
      });
    }
  }, 100);

  // Start input listener if interactive
  if (isInteractive) {
    setupInputHandling(rootContainer);
    
    // Start a work loop that periodically processes React's pending updates
    // This is necessary because React's scheduler doesn't automatically trigger
    // re-renders in custom renderers without explicit work processing
    startWorkLoop();
  }
}

// Work loop for processing React updates
let workLoopInterval: ReturnType<typeof setInterval> | null = null;

function startWorkLoop(): void {
  if (workLoopInterval) return;
  
  workLoopInterval = setInterval(() => {
    try {
      // Use flushSync to trigger React's work processing
      // This forces React to process any pending state updates
      if (typeof (reconciler as any).flushSync === 'function') {
        (reconciler as any).flushSync(() => {});
      }
      
      // Also flush passive effects (useEffect callbacks)
      if (typeof (reconciler as any).flushPassiveEffects === 'function') {
        (reconciler as any).flushPassiveEffects();
      }
    } catch (error) {
      // Ignore errors in work loop
    }
  }, 16); // ~60fps
}

function stopWorkLoop(): void {
  if (workLoopInterval) {
    clearInterval(workLoopInterval);
    workLoopInterval = null;
  }
}

/**
 * Perform the actual render using new Renderer
 */
function performRender(): void {
  if (rootContainer) {
    try {
      renderToConsole(rootContainer);
      
      if (renderCallback) {
        renderCallback();
      }
    } catch (error) {
      try {
        process.stdout.write('\n[Render Error: ' + String(error) + ']\n');
      } catch {
        console.error('Render error:', error);
      }
    }
  } else {
    process.stdout.write('\n[No root container to render]\n');
  }
}

/**
 * Render node tree to console using multi-buffer system
 */
function renderToConsole(root: Node): void {
  try {
    // Hide cursor during render
    process.stdout.write(hideCursor());

    componentBoundsRegistry.clear();

    const dims = getTerminalDimensions();
    terminal.dimensions = dims;
    
    // Track overlay changes for focus restoration
    const currentOverlays = findAllOverlays(root);
    const previousOverlayCount = overlayStack.length;
    const currentOverlayCount = currentOverlays.length;
    
    if (currentOverlayCount > previousOverlayCount && previousFocusedComponent === null) {
      previousFocusedComponent = terminal.focusedComponent as Node | null;
    }
    
    if (currentOverlayCount < previousOverlayCount && previousFocusedComponent) {
      const interactiveComponents: Node[] = [];
      collectInteractiveComponents(root, interactiveComponents);
      if (previousFocusedComponent && interactiveComponents.includes(previousFocusedComponent)) {
        focusComponent(previousFocusedComponent, interactiveComponents, scheduleUpdate);
      }
      previousFocusedComponent = null;
    }
    
    overlayStack = currentOverlays;
    
    // Build component tree, layouts, stacking contexts, and viewports
    // These are still needed for the node system
    if ('buildComponentTree' in root) {
      (root as any).buildComponentTree();
    }
    if ('calculateLayouts' in root) {
      (root as any).calculateLayouts();
    }
    if ('buildStackingContexts' in root) {
      (root as any).buildStackingContexts();
    }
    if ('buildViewports' in root) {
      (root as any).buildViewports();
    }
    
    // Use the multi-buffer renderer
    const bufferRenderer = getBufferRenderer();
    bufferRenderer.render(root, {
      mode: isInteractive ? 'interactive' : 'static',
      fullRedraw: isFirstRender,
      clearScreen: isInteractive && isFirstRender,
    });
    
    isFirstRender = false;

    // Show cursor after render
    process.stdout.write(showCursor());
  } catch (error) {
    try {
      process.stdout.write('\n[Render Error: ' + String(error) + ']\n');
      process.stdout.write(showCursor());
    } catch {
      console.error('Render error:', error);
    }
    reportError(error, ErrorType.RENDER, { 
      nodeType: root.type,
    });
  }
}

/**
 * Setup input handling for interactive components
 */
function setupInputHandling(root: Node): void {
  const interactiveComponents: Node[] = [];
  collectInteractiveComponents(root, interactiveComponents);

  assignTabIndexes(interactiveComponents);

  const firstAutoFocusComponent = interactiveComponents.find(
    (comp) => ('autoFocus' in comp && (comp as any).autoFocus) && ('disabled' in comp && !(comp as any).disabled)
  );
  if (firstAutoFocusComponent) {
    (firstAutoFocusComponent as any).focused = true;
    terminal.setFocusedComponent(firstAutoFocusComponent as any);
    if ('onFocus' in firstAutoFocusComponent && (firstAutoFocusComponent as any).onFocus) {
      (firstAutoFocusComponent as any).onFocus();
    }
  }

  startInputListener((_chunk, key, mouse) => {
    try {
      if (mouse) {
        handleMouseEvent(mouse, interactiveComponents, scheduleUpdate);
        return;
      }

      if (key) {
        if (key.tab) {
          handleTabNavigation(interactiveComponents, key.shift, scheduleUpdate, root);
          return;
        }

        if (key.escape) {
          for (const comp of interactiveComponents) {
            if (comp.type === 'dropdown' && 'isOpen' in comp && (comp as any).isOpen) {
              (comp as any).isOpen = false;
              scheduleUpdate();
              return;
            }
          }
        }

        const focused = interactiveComponents.find((comp) => 'focused' in comp && (comp as any).focused);

        if (focused) {
          if (!('disabled' in focused) || !(focused as any).disabled) {
            const keyboardEvent: import('../types').KeyboardEvent = {
              key,
              _propagationStopped: false,
              stopPropagation: () => {
                keyboardEvent._propagationStopped = true;
              },
              preventDefault: () => {
                // Prevent default behavior
              },
            };

            if ('onKeyDown' in focused && (focused as any).onKeyDown) {
              (focused as any).onKeyDown(keyboardEvent);
            }

            if (!keyboardEvent._propagationStopped) {
              handleComponentInput(focused, _chunk, key);
            }
          }
        }

        if (!focused && interactiveComponents.length > 0) {
          const focusableComponents = interactiveComponents.filter((comp) => {
            const disabled = 'disabled' in comp ? (comp as any).disabled : false;
            const tabIndex = 'tabIndex' in comp ? (comp as any).tabIndex : undefined;
            return !disabled && (tabIndex === undefined || tabIndex >= 0);
          });
          if (focusableComponents.length > 0) {
            const sorted = [...focusableComponents].sort((a, b) => 
              ((a as any).tabIndex || 0) - ((b as any).tabIndex || 0)
            );
            const first = sorted[0]!;
            (first as any).focused = true;
            terminal.setFocusedComponent(first as any);
            if ('onFocus' in first && (first as any).onFocus) {
              (first as any).onFocus();
            }
            scheduleUpdate();
          }
        }
      }
    } catch (error) {
      reportError(error, ErrorType.INPUT_PARSING, {
        hasKey: !!key,
        hasMouse: !!mouse,
        chunkLength: _chunk?.length || 0,
      });
    }
  });
}

/**
 * Handle input for a component
 */
function handleComponentInput(component: Node, _chunk: string, key: import('../types').KeyPress): void {
  if ('disabled' in component && (component as any).disabled) {
    return;
  }
  
  // Handle keyboard events on interactive nodes
  if ('handleKeyboardEvent' in component) {
    (component as any).handleKeyboardEvent(key);
  }
}

/**
 * Schedule an update/re-render
 */
function scheduleUpdate(): void {
  scheduleBatchedUpdate(() => {
    if (currentElement && rootFiber) {
      reconciler.updateContainer(currentElement, rootFiber, null, () => {
        performRender();
      });
    } else if (rootContainer) {
      performRender();
    }
  });
}

/**
 * Unmount the rendered React application
 */
export function unmount(): void {
  // Stop the work loop first
  stopWorkLoop();
  
  if (resizeCleanup) {
    resizeCleanup();
    resizeCleanup = null;
  }

  const { clearBatchedUpdates } = require('./batching');
  clearBatchedUpdates();

  if (isInteractive) {
    stopInputListener();
  }

  if (rootFiber && rootContainer) {
    reconciler.updateContainer(null, rootFiber, null, () => {});
    rootContainer = null;
    rootFiber = null;
  }

  currentElement = null;
  renderCallback = null;
  isFirstRender = true;

  // Reset the buffer renderer
  resetBufferRenderer();
  
  // Show cursor
  process.stdout.write(showCursor());
}

/**
 * Exit the application after rendering
 */
export function exit(exitCode: number = 0): void {
  try {
    const { notifyAppExit } = require('../hooks/lifecycle');
    notifyAppExit();
  } catch {
    // Hooks module may not be loaded yet
  }

  unmount();

  process.exit(exitCode);
}
