/**
 * Main render function - renders React elements to console
 * 
 * This is the primary entry point for rendering React components to the terminal.
 * Supports three rendering modes: static (one-time output), interactive (with input),
 * and fullscreen (takes over entire terminal).
 * 
 * @param element - React element to render (JSX component tree)
 * @param options - Render options
 * @param options.mode - Rendering mode: 'static' (one-time), 'interactive' (with input), or 'fullscreen' (full terminal)
 * @param options.fullscreen - Enable fullscreen mode (takes over entire terminal, alias for mode: 'fullscreen')
 * @param options.onUpdate - Callback called after each render update (useful for testing or monitoring)
 * @param options.appId - Optional app ID for storage namespace (auto-generated if not provided)
 * 
 * @example
 * ```tsx
 * // Static one-time render (CLI output)
 * render(<App />, { mode: 'static' });
 * 
 * // Interactive application (forms, menus)
 * render(
 *   <App />,
 *   { 
 *     mode: 'interactive',
 *     onUpdate: () => console.log('UI updated')
 *   }
 * );
 * 
 * // Fullscreen application (dashboards, editors)
 * render(<App />, { mode: 'fullscreen' });
 * ```
 */

import { reconciler } from './reconciler';
import type { ReactElement } from 'react';
import type { ConsoleNode, RenderMode, KeyPress } from '../types';
import { createOutputBuffer, flushOutput, startRendering, stopRendering } from './output';
import { renderNodeToBuffer } from './layout';
import { startInputListener, stopInputListener } from './input';
import { getTerminalDimensions, onTerminalResizeDebounced } from '../utils/terminal';
import { reportError, ErrorType } from '../utils/errors';
import { handleInputComponent } from '../components/interactive/Input';
import { handleButtonComponent } from '../components/interactive/Button';
import { handleBoxComponent } from '../components/interactive/BoxHandler';
import { handleRadioComponent } from '../components/selection/Radio';
import { handleCheckboxComponent } from '../components/selection/Checkbox';
import { handleDropdownComponent } from '../components/selection/Dropdown';
import { handleListComponent } from '../components/selection/List';
import { dispatchHandler, type HandlerRegistry } from '../types/handlers';
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
import { initializeStorage } from '../utils/storage';
import { scheduleBatchedUpdate } from './batching';

let rootContainer: ConsoleNode | null = null;
let rootFiber: ReturnType<typeof reconciler.createContainer> | null = null;
let currentElement: ReactElement | null = null;
let isInteractive = false;
let renderCallback: (() => void) | null = null;
let resizeCleanup: (() => void) | null = null;
let previousFocusedComponent: ConsoleNode | null = null; // For focus restoration when overlays close
let overlayStack: ConsoleNode[] = []; // Stack of open overlays for focus restoration

/**
 * Render a React element to console
 * 
 * Main entry point for rendering React components to the terminal. Supports three modes:
 * - `'static'` - One-time render (useful for CLI output)
 * - `'interactive'` - Interactive mode with keyboard and mouse input
 * - `'fullscreen'` - Fullscreen application mode
 * 
 * Automatically handles terminal resizing, input events, and reactive updates.
 * Uses React 19's reconciliation for efficient updates.
 * 
 * @param element - React element to render (JSX component tree)
 * @param options - Render options
 * @param options.mode - Rendering mode: 'static', 'interactive', or 'fullscreen' (default: 'static')
 * @param options.fullscreen - Enable fullscreen mode (takes over entire terminal)
 * @param options.onUpdate - Callback called after each render update
 * 
 * @example
 * ```tsx
 * // Static one-time render
 * render(<App />, { mode: 'static' });
 * 
 * // Interactive application
 * render(
 *   <App />,
 *   { 
 *     mode: 'interactive',
 *     onUpdate: () => console.log('UI updated')
 *   }
 * );
 * 
 * // Fullscreen application
 * render(<App />, { mode: 'fullscreen' });
 * ```
 */
export function render(
  element: ReactElement,
  options?: {
    mode?: RenderMode;
    fullscreen?: boolean;
    onUpdate?: () => void;
    appId?: string; // Optional app ID for storage namespace (auto-generated if not provided)
  }
): void {
  const mode = options?.mode || 'static';
  const fullscreen = options?.fullscreen || false;
  renderCallback = options?.onUpdate || null;

  // Initialize storage automatically (if appId provided, use it; otherwise auto-generate)
  // Storage is automatically created on first access, but we initialize it here for early access
  initializeStorage(options?.appId);

  // Notify application start hooks (only on first render)
  if (!rootFiber) {
    try {
      const { notifyAppStart } = require('../hooks/lifecycle');
      notifyAppStart();
    } catch {
      // Hooks module may not be loaded yet, ignore
    }
  }

  isInteractive = mode === 'interactive' || mode === 'fullscreen';
  
  // Store current element for reactive updates
  currentElement = element;

  // Create root container if not provided
  if (!rootContainer) {
    rootContainer = {
      type: 'box',
      children: [],
      fullscreen: fullscreen || mode === 'fullscreen',
    };
  } else {
    rootContainer.fullscreen = fullscreen || mode === 'fullscreen';
  }

  // Create reconciler container
  if (!rootFiber) {
    rootFiber = reconciler.createContainer(
      rootContainer,
      0,
      null,
      false,
      false,
      '',
      () => {
        // On update callback - re-render after React reconciliation
        // This is called when React state changes trigger reconciliation
        // Note: We use performRender() directly here (not batched) because
        // React's reconciliation already batches updates internally
        performRender();
      },
      null
    );
  }

  // Update the root through React reconciliation
  // For initial render, we don't batch (need immediate render)
  reconciler.updateContainer(element, rootFiber, null, () => {
    // After reconciliation completes, perform the actual render
    performRender();
  });

  // Set up terminal resize listener for reactive updates
  if (resizeCleanup) {
    resizeCleanup();
  }
  // Use debounced resize to prevent excessive reconciliation
  resizeCleanup = onTerminalResizeDebounced(() => {
    // Update global terminal dimensions on resize
    updateTerminalDimensions();
    
    // Terminal resized - re-run React reconciliation to update responsive sizes
    if (currentElement && rootFiber) {
      reconciler.updateContainer(currentElement, rootFiber, null, () => {
        performRender();
      });
    }
  }, 100);

  // Start input listener if interactive
  if (isInteractive) {
    setupInputHandling(rootContainer);
  }
}

/**
 * Perform the actual render to console after React reconciliation
 */
function performRender(): void {
  if (rootContainer) {
    renderToConsole(rootContainer);
    
    // Call custom update callback if provided
    if (renderCallback) {
      renderCallback();
    }
  }
}

/**
 * Render console node tree to console output
 * Wrapped with error handling for render errors
 */
function renderToConsole(node: ConsoleNode): void {
  try {
    startRendering();

    // Clear component bounds registry before rendering (fresh render)
    componentBoundsRegistry.clear();

    const dims = getTerminalDimensions();
    // Update global terminal dimensions
    terminal.dimensions = dims;
    
    // Track overlay changes for focus restoration
    const currentOverlays = findAllOverlays(node);
    const previousOverlayCount = overlayStack.length;
    const currentOverlayCount = currentOverlays.length;
    
    // If overlay was just opened (count increased), save previous focus
    if (currentOverlayCount > previousOverlayCount && previousFocusedComponent === null) {
      previousFocusedComponent = terminal.focusedComponent;
    }
    
    // If overlay was just closed (count decreased), restore focus
    if (currentOverlayCount < previousOverlayCount && previousFocusedComponent) {
      const interactiveComponents: ConsoleNode[] = [];
      collectInteractiveComponents(node, interactiveComponents);
      if (previousFocusedComponent && interactiveComponents.includes(previousFocusedComponent)) {
        focusComponent(previousFocusedComponent, interactiveComponents, scheduleUpdate);
      }
      previousFocusedComponent = null;
    }
    
    // Update overlay stack
    overlayStack = currentOverlays;
    
    const width = node.fullscreen ? dims.columns : dims.columns;
    const height = node.fullscreen ? dims.rows : undefined;

    const buffer = createOutputBuffer();
    renderNodeToBuffer(node, buffer, 0, 0, width, height);
    flushOutput(buffer, true);

    stopRendering();
  } catch (error) {
    reportError(error, ErrorType.RENDER, { 
      nodeType: node.type,
      fullscreen: node.fullscreen,
    });
    // Try to stop rendering even if there was an error
    try {
      stopRendering();
    } catch {
      // Ignore cleanup errors
    }
    // Re-throw to let caller know render failed
    throw error;
  }
}

/**
 * Setup input handling for interactive components
 * Wrapped with error handling for input parsing errors
 */
function setupInputHandling(node: ConsoleNode): void {
  // Find all input components and buttons
  const interactiveComponents: ConsoleNode[] = [];
  collectInteractiveComponents(node, interactiveComponents);

  // Auto-assign tab indexes to interactive components
  assignTabIndexes(interactiveComponents);

  // Auto-focus first component if it has autoFocus prop (works for all component types)
  const firstAutoFocusComponent = interactiveComponents.find(
    (comp) => comp.autoFocus && !comp.disabled
  );
  if (firstAutoFocusComponent) {
    firstAutoFocusComponent.focused = true;
    terminal.setFocusedComponent(firstAutoFocusComponent);
    firstAutoFocusComponent.onFocus?.();
  }

  // Set up input listener (keyboard and mouse)
  startInputListener((_chunk, key, mouse) => {
    try {
      // Handle mouse events
      if (mouse) {
        handleMouseEvent(mouse, interactiveComponents, scheduleUpdate);
        return;
      }

      // Handle keyboard input
      if (key) {
        // Handle Tab key for navigation (with focus trapping support)
        if (key.tab) {
          handleTabNavigation(interactiveComponents, key.shift, scheduleUpdate, node);
          return;
        }

        // Handle global Escape key (close dropdowns, modals)
        if (key.escape) {
          // Close all open dropdowns
          for (const comp of interactiveComponents) {
            if (comp.type === 'dropdown' && comp.isOpen) {
              comp.isOpen = false;
              scheduleUpdate();
              return; // Don't process further if we closed a dropdown
            }
          }
          // Could also handle modal closing here in the future
        }

        // Handle input for focused component
        const focused = interactiveComponents.find((comp) => comp.focused);

        if (focused) {
          // Skip input handling for disabled components
          if (!focused.disabled) {
            // First, trigger onKeyDown event with propagation support
            // This allows components to handle keyboard events before default behavior
            const keyboardEvent: import('../types').KeyboardEvent = {
              key,
              _propagationStopped: false,
              stopPropagation: () => {
                keyboardEvent._propagationStopped = true;
              },
              preventDefault: () => {
                // Prevent default behavior (can be implemented later if needed)
              },
            };

            // Call onKeyDown handler if it exists (event propagation - component level)
            if (focused.onKeyDown) {
              focused.onKeyDown(keyboardEvent);
            }

            // Only continue with default handling if propagation wasn't stopped
            if (!keyboardEvent._propagationStopped) {
              handleComponentInput(focused, _chunk, key);
            }
          }
        }

        // If no focused component, focus first input/button
        if (!focused && interactiveComponents.length > 0) {
          const focusableComponents = interactiveComponents.filter(
            (comp) => !comp.disabled && (comp.tabIndex === undefined || comp.tabIndex >= 0)
          );
          if (focusableComponents.length > 0) {
            const sorted = [...focusableComponents].sort((a, b) => (a.tabIndex || 0) - (b.tabIndex || 0));
            const first = sorted[0]!;
            first.focused = true;
            terminal.setFocusedComponent(first);
            first.onFocus?.();
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
 * Handler registry for component input handlers
 * Type-safe mapping of component types to their handlers
 */
const componentHandlers: HandlerRegistry = {
  input: handleInputComponent,
  button: handleButtonComponent,
  box: handleBoxComponent, // For Pressable and Focusable components
  radio: handleRadioComponent,
  checkbox: handleCheckboxComponent,
  dropdown: handleDropdownComponent,
  list: handleListComponent,
};

/**
 * Handle input for a component
 * Dispatches to component-specific handlers using type-safe registry
 * Disabled components are skipped (should not receive input)
 */
function handleComponentInput(component: ConsoleNode, _chunk: string, key: KeyPress): void {
  // Disabled components should not process input
  if (component.disabled) {
    return;
  }
  dispatchHandler(componentHandlers, component, _chunk, key, scheduleUpdate);
}

/**
 * Schedule an update/re-render
 * This triggers React reconciliation with the current element, which will then
 * call performRender() through the reconciler's update callback
 * 
 * Uses batched updates to prevent flicker from rapid state changes
 */
function scheduleUpdate(): void {
  // Batch the update to prevent flicker from rapid state changes
  scheduleBatchedUpdate(() => {
    // Trigger React reconciliation if we have a current element
    // This ensures all updates go through React's reconciliation system
    if (currentElement && rootFiber) {
      // Update through React reconciliation - this will trigger the onUpdate callback
      // which will then call performRender()
      reconciler.updateContainer(currentElement, rootFiber, null, () => {
        performRender();
      });
    } else if (rootContainer) {
      // Fallback: direct render if no React element (shouldn't happen normally)
      performRender();
    }
  });
}

/**
 * Unmount the rendered tree
 */
/**
 * Unmount the rendered React application from the terminal
 * 
 * Cleans up all listeners, stops input handling, and removes the rendered content.
 * Call this when your application is done or needs to be completely removed.
 * 
 * @example
 * ```tsx
 * // Render app
 * render(<App />, { mode: 'interactive' });
 * 
 * // Later, cleanup
 * unmount();
 * ```
 */
export function unmount(): void {
  // Clean up resize listener
  if (resizeCleanup) {
    resizeCleanup();
    resizeCleanup = null;
  }

  // Clean up batched updates
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

  stopRendering();
}

/**
 * Exit the application after rendering
 * 
 * Unmounts the rendered tree, cleans up all resources, persists storage to disk,
 * and exits the Node.js process with the specified exit code.
 * 
 * This is the recommended way to exit a terminal application after initial render.
 * Ensures proper cleanup of resources (input listeners, resize handlers, etc.)
 * and persistence of storage data before exiting.
 * 
 * @param exitCode - Exit code for the process (default: 0 for success, non-zero for error)
 * 
 * @example
 * ```tsx
 * // Static CLI application - render and exit
 * import { render, exit } from 'react-console';
 * 
 * function App() {
 *   return <Text>Hello, World!</Text>;
 * }
 * 
 * render(<App />, { mode: 'static' });
 * exit(); // Clean exit after render
 * 
 * // Exit with error code
 * render(<App />, { mode: 'static' });
 * exit(1); // Exit with error code 1
 * ```
 * 
 * @example
 * ```tsx
 * // Exit from event handler
 * import { render, exit } from 'react-console';
 * import { Button } from 'react-console';
 * 
 * function App() {
 *   return (
 *     <Button onClick={() => exit()}>
 *       Exit Application
 *     </Button>
 *   );
 * }
 * 
 * render(<App />, { mode: 'interactive' });
 * ```
 */
export function exit(exitCode: number = 0): void {
  // Notify application exit hooks
  try {
    const { notifyAppExit } = require('../hooks/lifecycle');
    notifyAppExit();
  } catch {
    // Hooks module may not be loaded yet, ignore
  }

  // Unmount and clean up renderer resources
  unmount();

  // Storage persistence is handled automatically on process exit
  // via process.on('exit') listeners in storage.ts, but we can
  // ensure it's persisted if needed (it already has exit listeners)

  // Exit the process
  process.exit(exitCode);
}
