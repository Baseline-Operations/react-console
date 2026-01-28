/**
 * Main render function - renders React elements to console using new Node architecture
 * Uses the multi-buffer rendering system for all output
 */

import { reconciler } from './reconciler';
import type { ReactElement } from 'react';
import type { RenderMode } from '../types';
import { getBufferRenderer, resetBufferRenderer } from '../buffer';
import { hideCursor, showCursor, moveCursor } from './ansi';
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
    
    // Apply focus state to components after React updates
    if (focusedNodeId) {
      const components = getInteractiveComponents(root);
      applyFocusState(components);
    }
    
    // Use the multi-buffer renderer
    const bufferRenderer = getBufferRenderer();
    bufferRenderer.render(root, {
      mode: isInteractive ? 'interactive' : 'static',
      fullRedraw: isFirstRender,
      clearScreen: isInteractive && isFirstRender,
    });
    
    isFirstRender = false;

    // Position cursor at focused input if any
    if (focusedNodeId) {
      const components = getInteractiveComponents(root);
      const focusedComponent = components.find(c => c.id === focusedNodeId);
      if (focusedComponent && focusedComponent.type === 'input') {
        // Get the input's bounds from the component bounds registry (populated during render)
        const registeredBounds = componentBoundsRegistry.get(focusedComponent as any);
        if (registeredBounds) {
          // Position cursor: x = bounds.x + prefix(2) + text length, y = bounds.y
          const inputValue = (focusedComponent as any).value || '';
          const cursorX = registeredBounds.x + 2 + inputValue.length; // +2 for "[ " prefix
          const cursorY = registeredBounds.y;
          process.stdout.write(moveCursor(cursorX, cursorY));
        }
      }
    }
    
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

// Track which node ID is focused (survives across re-renders)
let focusedNodeId: string | null = null;

/**
 * Get fresh interactive components from root
 */
function getInteractiveComponents(root: Node): Node[] {
  const components: Node[] = [];
  collectInteractiveComponents(root, components);
  assignTabIndexes(components);
  return components;
}

/**
 * Apply stored focus state to components after re-render
 */
function applyFocusState(components: Node[]): void {
  // Try to find focus by stored ID first
  if (focusedNodeId) {
    for (const comp of components) {
      if (comp.id === focusedNodeId) {
        (comp as any).focused = true;
        terminal.setFocusedComponent(comp as any);
        return;
      }
    }
    // ID not found, clear it
    focusedNodeId = null;
  }
  
  // Fallback: check terminal's focused component by type and check if same position in tree
  const terminalFocused = terminal.focusedComponent;
  if (terminalFocused) {
    const terminalType = (terminalFocused as any).type;
    
    // Find component with same type at same position
    for (const comp of components) {
      if (comp.type === terminalType) {
        (comp as any).focused = true;
        focusedNodeId = comp.id;
        terminal.setFocusedComponent(comp as any);
        return;
      }
    }
  }
}

/**
 * Setup input handling for interactive components
 */
function setupInputHandling(root: Node): void {
  const interactiveComponents = getInteractiveComponents(root);

  // Find first autoFocus component that is not disabled
  const firstAutoFocusComponent = interactiveComponents.find(
    (comp) => {
      const hasAutoFocus = 'autoFocus' in comp && (comp as any).autoFocus;
      const isDisabled = 'disabled' in comp && (comp as any).disabled;
      return hasAutoFocus && !isDisabled;
    }
  );
  
  let needsRerender = false;
  
  if (firstAutoFocusComponent) {
    (firstAutoFocusComponent as any).focused = true;
    focusedNodeId = firstAutoFocusComponent.id;
    terminal.setFocusedComponent(firstAutoFocusComponent as any);
    if ('onFocus' in firstAutoFocusComponent && (firstAutoFocusComponent as any).onFocus) {
      (firstAutoFocusComponent as any).onFocus();
    }
    needsRerender = true;
  } else if (interactiveComponents.length > 0) {
    // If no autoFocus, focus the first focusable component
    const focusableComponents = interactiveComponents.filter((comp) => {
      const isDisabled = 'disabled' in comp && (comp as any).disabled;
      const tabIndex = 'tabIndex' in comp ? (comp as any).tabIndex : undefined;
      return !isDisabled && (tabIndex === undefined || tabIndex >= 0);
    });
    if (focusableComponents.length > 0) {
      const sorted = [...focusableComponents].sort((a, b) => 
        ((a as any).tabIndex || 0) - ((b as any).tabIndex || 0)
      );
      const first = sorted[0]!;
      (first as any).focused = true;
      focusedNodeId = first.id;
      terminal.setFocusedComponent(first as any);
      if ('onFocus' in first && (first as any).onFocus) {
        (first as any).onFocus();
      }
      needsRerender = true;
    }
  }
  
  // Schedule a re-render to show focus state
  if (needsRerender) {
    scheduleUpdate();
  }

  startInputListener((_chunk, key, mouse) => {
    try {
      // Re-collect components to get current instances after any React updates
      const currentComponents = getInteractiveComponents(root);
      applyFocusState(currentComponents);
      
      if (mouse) {
        handleMouseEvent(mouse, currentComponents, scheduleUpdate);
        return;
      }

      if (key) {
        if (key.tab) {
          handleTabNavigation(currentComponents, key.shift, scheduleUpdate, root);
          // Update focusedNodeId after tab navigation
          const newFocused = currentComponents.find((comp) => 'focused' in comp && (comp as any).focused);
          focusedNodeId = newFocused?.id || null;
          return;
        }

        if (key.escape) {
          for (const comp of currentComponents) {
            if (comp.type === 'dropdown' && 'isOpen' in comp && (comp as any).isOpen) {
              (comp as any).isOpen = false;
              scheduleUpdate();
              return;
            }
          }
        }

        const focused = currentComponents.find((comp) => 'focused' in comp && (comp as any).focused);

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

        if (!focused && currentComponents.length > 0) {
          const focusableComponents = currentComponents.filter((comp) => {
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
            focusedNodeId = first.id;
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
  
  // Route to type-specific handlers
  if (component.type === 'input') {
    // Use the Input component's handler
    const { handleInputComponent } = require('../components/interactive/Input');
    handleInputComponent(component as any, _chunk, key, scheduleUpdate);
    return;
  }
  
  // Handle keyboard events on interactive nodes
  if ('handleKeyboardEvent' in component) {
    const keyboardEvent = {
      key,
      preventDefault: () => {},
      stopPropagation: () => {},
    };
    (component as any).handleKeyboardEvent(keyboardEvent);
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
