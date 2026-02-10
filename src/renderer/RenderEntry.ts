/**
 * Render Entry Points
 * Contains render(), unmount(), and exit() functions
 * Extracted from Node.ts for better code organization
 *
 * These functions manage the React reconciler lifecycle and terminal I/O
 */

import type { ReactElement } from 'react';
import type { Reconciler as ReconcilerType, FiberRoot } from 'react-reconciler';
import { renderState, setOnCommitCallback, resetRenderState } from './RenderState';
import { debug } from '../utils/debug';
import { setBellRenderCallback, setBellFlushSyncCallback } from '../apis/Bell';
import { callGlobalInputHandlers } from '../hooks/input';

// Global state for ESM/CJS dual loading (mirrors Node.ts pattern)
// This is accessed via globalThis to survive module reloading
interface GlobalRenderState {
  isInteractive: boolean;
  wasInteractiveMode: boolean;
  unmountInProgress: boolean;
}

const globalState: GlobalRenderState = ((globalThis as Record<string, unknown>)
  .__reactConsoleGlobalState as GlobalRenderState) || {
  isInteractive: false,
  wasInteractiveMode: false,
  unmountInProgress: false,
};
(globalThis as Record<string, unknown>).__reactConsoleGlobalState = globalState;

// Type for Node - using 'any' to avoid complex type synchronization
// These are all internal runtime types handled through dynamic require()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NodeLike = any;

// Focusable node interface - same reasoning
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FocusableNode = any;

/**
 * Render options
 */
export interface RenderOptions {
  mode?: 'static' | 'interactive' | 'fullscreen';
  fullscreen?: boolean;
  onUpdate?: () => void;
  appId?: string;
  navigation?: {
    arrowKeyNavigation?: boolean;
    verticalArrowNavigation?: boolean;
    horizontalArrowNavigation?: boolean;
  };
}

/**
 * Main render entry point - renders React elements to console
 * This is the primary API for users
 */
export function render(element: ReactElement, options?: RenderOptions): string | void {
  // Store navigation options
  renderState.navigationOptions = options?.navigation || {};

  // Lazy imports to avoid circular dependency with reconciler
  interface ReconcilerModule {
    reconciler: ReconcilerType<NodeLike, NodeLike, NodeLike, NodeLike, NodeLike, NodeLike>;
  }
  let reconciler: ReconcilerModule['reconciler'];
  try {
    reconciler = (require('./reconciler') as ReconcilerModule).reconciler;
  } catch (err: unknown) {
    try {
      const path = require('path');
      const rootPath = path.resolve(process.cwd(), 'src/renderer/reconciler');
      reconciler = require(rootPath).reconciler;
    } catch {
      const errMessage = err instanceof Error ? err.message : String(err);
      throw new Error(
        `Failed to load reconciler from './reconciler'. ` +
          `Original error: ${errMessage}. ` +
          `This may be a module resolution issue in the test environment.`
      );
    }
  }

  const { getBufferRenderer, resetBufferRenderer } = require('../buffer');
  const { showCursor } = require('./ansi');
  const { startInputListener } = require('./input');
  const {
    getTerminalDimensions,
    onTerminalResizeDebounced,
    setRenderMode,
  } = require('../utils/terminal');
  const { reportError, ErrorType } = require('../utils/errors');
  const { initializeStorage } = require('../utils/storage');
  const {
    scheduleBatchedUpdate,
    flushBatchedUpdatesSync,
    hasBatchedUpdates,
  } = require('./batching');
  const { BoxNode } = require('../nodes/primitives/BoxNode');
  const {
    collectInteractiveComponents,
    assignTabIndexes,
    handleTabNavigation,
    handleMouseEvent,
    focusComponent,
    findAllOverlays,
  } = require('./utils/navigation');
  const { componentBoundsRegistry } = require('./utils/componentBounds');
  const { terminal, updateTerminalDimensions } = require('../utils/globalTerminal');

  const mode = options?.mode || 'static';
  const fullscreen = options?.fullscreen || false;
  renderState.renderCallback = options?.onUpdate || null;

  // Set render mode early so terminal dimensions are correct
  setRenderMode(mode === 'static' ? 'static' : 'interactive');
  resetBufferRenderer();

  // Set interactive mode flags EARLY
  const isInteractiveMode = mode === 'interactive' || mode === 'fullscreen';
  globalState.isInteractive = isInteractiveMode;
  globalState.wasInteractiveMode = isInteractiveMode;
  globalState.unmountInProgress = false;
  renderState.isInteractive = isInteractiveMode;
  renderState.wasInteractiveMode = isInteractiveMode;
  renderState.currentElement = element;

  // Register SIGINT handler for proper cleanup
  if (mode !== 'static') {
    process.removeAllListeners('SIGINT');
    process.on('SIGINT', () => {
      exit(0);
    });
  }

  initializeStorage(options?.appId);

  let previousFocusedComponent: NodeLike | null = null;
  let overlayStack: NodeLike[] = [];

  if (!renderState.rootFiber) {
    try {
      import('../hooks/lifecycle')
        .then((lifecycle) => {
          if (lifecycle?.notifyAppStart) {
            lifecycle.notifyAppStart();
          }
        })
        .catch(() => {});
    } catch {
      // Ignore
    }
  }

  // Create root container
  if (!renderState.rootContainer) {
    renderState.rootContainer = new BoxNode() as unknown as NodeLike;
    if (fullscreen || mode === 'fullscreen') {
      interface StylableRoot {
        setStyle?(style: Record<string, unknown>): void;
      }
      const stylableRoot = renderState.rootContainer as unknown as StylableRoot;
      if (stylableRoot.setStyle) {
        stylableRoot.setStyle({ width: '100%', height: '100%' });
      }
    }
  }

  // Create reconciler container
  if (!renderState.rootFiber) {
    const rootTag = 0; // LegacyRoot

    renderState.rootFiber = reconciler.createContainer(
      renderState.rootContainer,
      rootTag,
      null,
      false,
      false,
      '',
      (error: Error, errorInfo?: { componentStack?: string }) => {
        reportError(error, ErrorType.RENDER, {
          severity: 'uncaught',
          componentStack: errorInfo?.componentStack,
        });
      },
      (error: Error, errorInfo?: { componentStack?: string }) => {
        reportError(error, ErrorType.RENDER, {
          severity: 'caught',
          componentStack: errorInfo?.componentStack,
        });
      },
      (error: Error, errorInfo?: { componentStack?: string }) => {
        reportError(error, ErrorType.RENDER, {
          severity: 'recoverable',
          componentStack: errorInfo?.componentStack,
        });
      },
      () => {
        // Default transition indicator - no-op for terminal
      }
    ) as FiberRoot;
  }

  let isFirstRender = true;

  // Get fresh interactive components from root
  const getInteractiveComponents = (rootNode: NodeLike): NodeLike[] => {
    const components: NodeLike[] = [];
    collectInteractiveComponents(rootNode, components);
    assignTabIndexes(components);
    return components;
  };

  // Apply stored focus state to components after re-render
  const applyFocusState = (components: NodeLike[]): void => {
    for (const comp of components) {
      const focusableComp = comp as NodeLike & { focused?: boolean };
      if ('focused' in focusableComp) {
        focusableComp.focused = false;
      }
    }

    if (terminal.focusedNodeId) {
      for (const comp of components) {
        if (comp.id === terminal.focusedNodeId) {
          const focusableComp = comp as NodeLike & { focused?: boolean };
          focusableComp.focused = true;
          terminal.setFocusedComponent(comp as unknown as import('../types').ConsoleNode);
          return;
        }
      }
      terminal.focusedNodeId = null;
    }
  };

  // Helper to get stdout state
  const getStdoutState = () => {
    const handle = (
      process.stdout as NodeJS.WriteStream & { _handle?: { writeQueueSize?: number } }
    )._handle;
    return {
      queueSize: handle?.writeQueueSize ?? -1,
      writableLength: process.stdout.writableLength,
    };
  };

  // Update through React reconciliation
  const performRender = (): string | void => {
    debug('[performRender] START', { time: Date.now(), stdout: getStdoutState() });
    if (renderState.rootContainer) {
      try {
        const dims = getTerminalDimensions();
        terminal.dimensions = dims;

        const currentOverlays = findAllOverlays(renderState.rootContainer);
        const previousOverlayCount = overlayStack.length;
        const currentOverlayCount = currentOverlays.length;

        if (currentOverlayCount > previousOverlayCount && previousFocusedComponent === null) {
          previousFocusedComponent = terminal.focusedComponent as NodeLike | null;
        }

        if (currentOverlayCount < previousOverlayCount && previousFocusedComponent) {
          const interactiveComponents: NodeLike[] = [];
          collectInteractiveComponents(renderState.rootContainer, interactiveComponents);
          if (
            previousFocusedComponent &&
            interactiveComponents.includes(previousFocusedComponent)
          ) {
            focusComponent(previousFocusedComponent, interactiveComponents, scheduleUpdate);
          }
          previousFocusedComponent = null;
        }

        overlayStack = currentOverlays;

        // Build component tree, layouts, stacking contexts, and viewports
        const container = renderState.rootContainer as NodeLike;
        if (container.buildComponentTree) {
          container.buildComponentTree();
        }
        if (container.calculateLayouts) {
          container.calculateLayouts();
        }
        if (container.buildStackingContexts) {
          container.buildStackingContexts();
        }
        if (container.buildViewports) {
          container.buildViewports();
        }

        // Apply focus state to components after React updates
        if (terminal.focusedNodeId) {
          const components = getInteractiveComponents(renderState.rootContainer);
          applyFocusState(components);
        }

        // Use the multi-buffer renderer
        const bufferRenderer = getBufferRenderer();
        bufferRenderer.render(renderState.rootContainer, {
          mode: renderState.isInteractive ? 'interactive' : 'static',
          fullRedraw: renderState.isInteractive || isFirstRender,
          clearScreen: renderState.isInteractive && isFirstRender,
        });

        // Compute cursor position AFTER render
        if (terminal.focusedNodeId && renderState.isInteractive) {
          const components = getInteractiveComponents(renderState.rootContainer);
          const focusedComponent = components.find((c) => c.id === terminal.focusedNodeId);
          if (focusedComponent) {
            const registryBounds = componentBoundsRegistry.get(
              focusedComponent as unknown as import('../types').ConsoleNode
            );

            if (!registryBounds) {
              debug('[performRender] focused component not in registry (not visible)', {
                type: focusedComponent.type,
                id: focusedComponent.id,
              });
            }

            let focusedBounds = registryBounds
              ? {
                  x: registryBounds.x,
                  y: registryBounds.y,
                  width: registryBounds.width,
                  height: registryBounds.height,
                }
              : null;

            if (focusedBounds) {
              let cursorX: number;
              let cursorY: number = focusedBounds.y;

              if (focusedComponent.type === 'input') {
                interface InputNodeState {
                  _cursorPos?: number;
                  _scrollOffset?: number;
                  _visibleWidth?: number;
                  _multiline?: boolean;
                  _cursorLine?: number;
                  _cursorCol?: number;
                  _scrollTop?: number;
                  _maxLines?: number;
                }
                const inputNode = focusedComponent as NodeLike & InputNodeState;
                const cursorPos = inputNode._cursorPos ?? 0;
                const scrollOffset = inputNode._scrollOffset ?? 0;
                const visibleWidth = inputNode._visibleWidth ?? 20;

                if (inputNode._multiline) {
                  const cursorLine = inputNode._cursorLine ?? 0;
                  const cursorCol = inputNode._cursorCol ?? 0;
                  const scrollTop = inputNode._scrollTop ?? 0;

                  const visibleLine = cursorLine - scrollTop;
                  if (visibleLine >= 0 && visibleLine < (inputNode._maxLines || 3)) {
                    cursorX = focusedBounds.x + 2 + Math.min(cursorCol, visibleWidth);
                    cursorY = focusedBounds.y + visibleLine;
                  } else {
                    cursorX = -1;
                  }
                } else {
                  const visibleCursorPos = cursorPos - scrollOffset;
                  if (visibleCursorPos >= 0 && visibleCursorPos <= visibleWidth) {
                    cursorX = focusedBounds.x + 2 + visibleCursorPos;
                  } else {
                    cursorX = -1;
                  }
                }
              } else if (focusedComponent.type === 'button') {
                cursorX = focusedBounds.x + 2;
              } else {
                cursorX = focusedBounds.x;
              }

              if (cursorX >= 0) {
                debug('[performRender] computed cursor position', { x: cursorX, y: cursorY });
                process.stdout.write(`\x1b[${cursorY + 1};${cursorX + 1}H`);
              }
            }
          }
        }

        isFirstRender = false;
        debug('[performRender] END', { time: Date.now(), stdout: getStdoutState() });

        if (renderState.renderCallback) {
          renderState.renderCallback();
        }
      } catch (error) {
        try {
          process.stdout.write('\n[Render Error: ' + String(error) + ']\n');
          process.stdout.write(showCursor());
        } catch {
          console.error('Render error:', error);
        }
        reportError(error, ErrorType.RENDER, {
          nodeType: renderState.rootContainer.type,
        });
      }
    }
  };

  // Register the render callback for interactive mode
  if (renderState.isInteractive) {
    setOnCommitCallback(performRender);
  }

  let outputResult: string | void = undefined;

  try {
    interface ReconcilerExt {
      updateContainerSync?: (
        element: unknown,
        container: unknown,
        parent: unknown,
        callback: () => void
      ) => void;
      flushSyncWork?: () => void;
    }
    const extReconciler = reconciler as typeof reconciler & ReconcilerExt;
    if (typeof extReconciler.updateContainerSync === 'function') {
      extReconciler.updateContainerSync(element, renderState.rootFiber, null, () => {
        outputResult = performRender();
      });
      if (typeof extReconciler.flushSyncWork === 'function') {
        extReconciler.flushSyncWork();
      }
    } else {
      reconciler.updateContainer(element, renderState.rootFiber, null, () => {
        outputResult = performRender();
      });
    }
  } catch (error) {
    reportError(error, ErrorType.RENDER);
    throw error;
  }

  // For static mode, check if there are interactive components
  // If so, auto-upgrade to interactive mode so buttons/inputs work
  if (mode === 'static' && !renderState.isInteractive) {
    const interactiveComponents: NodeLike[] = [];
    collectInteractiveComponents(renderState.rootContainer, interactiveComponents);
    if (interactiveComponents.length > 0) {
      // Auto-enable interactive mode for components with buttons/inputs
      debug('[render] Auto-enabling interactive mode - found interactive components:', {
        count: interactiveComponents.length,
        types: interactiveComponents.map((c: NodeLike) => c.type),
      });

      // CRITICAL: Set render mode to interactive for proper terminal dimensions
      setRenderMode('interactive');
      updateTerminalDimensions();

      globalState.isInteractive = true;
      globalState.wasInteractiveMode = true;
      renderState.isInteractive = true;
      renderState.wasInteractiveMode = true;

      // CRITICAL: Register the commit callback so state updates trigger performRender
      setOnCommitCallback(performRender);

      // Register SIGINT handler for proper cleanup (since we're now interactive)
      process.removeAllListeners('SIGINT');
      process.on('SIGINT', () => {
        exit(0);
      });

      // Reset buffer and force a re-render with correct dimensions
      resetBufferRenderer();

      // Re-render the tree with correct interactive mode dimensions
      reconciler.updateContainer(element, renderState.rootFiber, null, () => {
        performRender();
      });
    } else {
      // No interactive components, return static output
      return outputResult;
    }
  }

  // Set up terminal resize listener for interactive mode
  if (renderState.resizeCleanup) {
    renderState.resizeCleanup();
    renderState.resizeCleanup = null;
  }
  renderState.resizeCleanup = onTerminalResizeDebounced(() => {
    updateTerminalDimensions();

    if (renderState.currentElement && renderState.rootFiber) {
      reconciler.updateContainer(renderState.currentElement, renderState.rootFiber, null, () => {
        performRender();
      });
    }
  }, 100);

  // Schedule update function
  const scheduleUpdate = (): void => {
    debug('scheduleUpdate called', { stdout: getStdoutState() });

    debug('[scheduleUpdate] Scheduling batch', { time: Date.now(), stdout: getStdoutState() });
    scheduleBatchedUpdate(() => {
      debug('[scheduleUpdate] Batch callback executing, calling performRender', {
        time: Date.now(),
        stdout: getStdoutState(),
      });
      performRender();
      debug('[scheduleUpdate] performRender done', { time: Date.now(), stdout: getStdoutState() });
    });
  };

  // Flush all pending React updates synchronously
  // Defined first so we can pass it to bell callbacks
  const flushSyncReactUpdates = (): void => {
    // Only do work if there are pending batched updates
    if (!hasBatchedUpdates()) {
      return;
    }

    flushBatchedUpdatesSync();

    if (renderState.currentElement && renderState.rootFiber) {
      interface ReconcilerExt {
        updateContainerSync?: (
          element: unknown,
          container: unknown,
          parent: unknown,
          callback: () => void
        ) => void;
        flushSyncWork?: () => void;
      }
      const extReconciler = reconciler as typeof reconciler & ReconcilerExt;
      if (typeof extReconciler.updateContainerSync === 'function') {
        extReconciler.updateContainerSync(
          renderState.currentElement,
          renderState.rootFiber,
          null,
          () => {}
        );
        if (typeof extReconciler.flushSyncWork === 'function') {
          extReconciler.flushSyncWork();
        }
      } else {
        reconciler.updateContainer(
          renderState.currentElement,
          renderState.rootFiber,
          null,
          () => {}
        );
      }

      performRender();
    }
  };

  // Register the bell render callback so bells can trigger screen flush
  setBellRenderCallback(() => {
    debug('[BELL] Callback starting', { time: Date.now(), stdout: getStdoutState() });
    debug('[BELL] Calling performRender directly', { stdout: getStdoutState() });
    performRender();
    debug('[BELL] performRender done', { time: Date.now(), stdout: getStdoutState() });
    debug('[BELL] Callback complete', { stdout: getStdoutState() });
  });

  // Register the flushSync callback so DSR responses can do sync work like TAB
  setBellFlushSyncCallback(() => {
    debug('[BELL] flushSync callback - doing sync work like TAB', { time: Date.now() });
    flushSyncReactUpdates();
    debug('[BELL] flushSync callback done', { time: Date.now() });
  });

  // Setup input handling for interactive components
  const setupInputHandling = (root: NodeLike): void => {
    const interactiveComponents = getInteractiveComponents(root);

    const firstAutoFocusComponent = interactiveComponents.find((comp) => {
      const focusable = comp as FocusableNode;
      return focusable.autoFocus && !focusable.disabled;
    });

    let needsRerender = false;

    if (firstAutoFocusComponent) {
      const focusable = firstAutoFocusComponent as FocusableNode;
      focusable.focused = true;
      terminal.setFocusedComponent(
        firstAutoFocusComponent as unknown as import('../types').ConsoleNode
      );
      if (focusable.onFocus) {
        focusable.onFocus();
      }
      needsRerender = true;
    } else if (interactiveComponents.length > 0) {
      const focusableComponents = interactiveComponents.filter((comp) => {
        const focusable = comp as FocusableNode;
        return !focusable.disabled && (focusable.tabIndex === undefined || focusable.tabIndex >= 0);
      });
      if (focusableComponents.length > 0) {
        const anyHasTabIndex = focusableComponents.some(
          (comp) => (comp as FocusableNode).tabIndex !== undefined
        );

        let first: NodeLike;
        if (anyHasTabIndex) {
          const sorted = [...focusableComponents].sort((a, b) => {
            const aTab = (a as FocusableNode).tabIndex ?? Infinity;
            const bTab = (b as FocusableNode).tabIndex ?? Infinity;
            return aTab - bTab;
          });
          first = sorted[0]!;
        } else {
          first = focusableComponents[0]!;
        }

        const focusableFirst = first as FocusableNode;
        focusableFirst.focused = true;
        terminal.setFocusedComponent(first as unknown as import('../types').ConsoleNode);
        if (focusableFirst.onFocus) {
          const focusEvent = { target: first, nativeEvent: { target: first } };
          focusableFirst.onFocus(focusEvent);
        }
        needsRerender = true;
      }
    }

    if (needsRerender) {
      scheduleUpdate();
    }

    interface KeyEvent {
      tab?: boolean;
      shift?: boolean;
      upArrow?: boolean;
      downArrow?: boolean;
      leftArrow?: boolean;
      rightArrow?: boolean;
      return?: boolean;
      space?: boolean;
      escape?: boolean;
      name?: string;
      char?: string;
    }
    interface MouseEventData {
      x: number;
      y: number;
      button: number;
    }
    startInputListener((_chunk: string, key: KeyEvent | null, mouse: MouseEventData | null) => {
      debug('[INPUT] Listener callback', {
        time: Date.now(),
        hasKey: !!key,
        hasMouse: !!mouse,
        keyTab: key?.tab,
      });
      try {
        // Handle DSR (cursor position) responses
        // The bell's onDsrResponse() already schedules a render via setImmediate,
        // so we just need to return early here to avoid duplicate processing
        const keyWithDsr = key as KeyEvent & { _dsrResponse?: boolean };
        if (keyWithDsr?._dsrResponse) {
          debug('[INPUT] DSR response - letting onDsrResponse handle it', { time: Date.now() });
          return;
        }

        const currentRoot = renderState.rootContainer || root;
        const currentComponents = getInteractiveComponents(currentRoot);
        applyFocusState(currentComponents);

        if (mouse) {
          handleMouseEvent(mouse, currentComponents, scheduleUpdate, performRender, currentRoot);
          return;
        }

        if (key) {
          // Call global input handlers first (for useInput hook)
          // These handlers receive all key events regardless of focus
          callGlobalInputHandlers(_chunk, key as unknown as import('../types').KeyPress);

          if (key.tab) {
            debug('[TAB] Starting tab handler', {
              time: Date.now(),
              shift: key.shift,
              stdout: getStdoutState(),
            });
            debug('[TAB] Calling flushSyncReactUpdates');
            flushSyncReactUpdates();
            debug('[TAB] flushSyncReactUpdates done', { stdout: getStdoutState() });

            const freshRoot = renderState.rootContainer || root;
            const freshComponents = getInteractiveComponents(freshRoot);
            debug('[TAB] Got components', {
              count: freshComponents.length,
              stdout: getStdoutState(),
            });
            applyFocusState(freshComponents);
            debug('[TAB] Applied focus state', { stdout: getStdoutState() });

            handleTabNavigation(freshComponents, key.shift, scheduleUpdate, freshRoot);
            debug('[TAB] handleTabNavigation done', { stdout: getStdoutState() });
            const newFocused = freshComponents.find((comp) => (comp as FocusableNode).focused);
            terminal.focusedNodeId = newFocused?.id || null;
            debug('[TAB] Handler complete', {
              focused: terminal.focusedNodeId,
              stdout: getStdoutState(),
            });
            return;
          }

          // Arrow key navigation (if enabled)
          const focusedForArrowCheck = currentComponents.find(
            (comp) => (comp as FocusableNode).focused
          );
          const inputHasFocus = focusedForArrowCheck?.type === 'input';

          const navOpts = renderState.navigationOptions;
          const arrowNav = navOpts.arrowKeyNavigation;
          const verticalNav = navOpts.verticalArrowNavigation ?? arrowNav;
          const horizontalNav = navOpts.horizontalArrowNavigation ?? arrowNav;

          if (!inputHasFocus) {
            if (
              (key.upArrow || key.leftArrow) &&
              ((verticalNav && key.upArrow) || (horizontalNav && key.leftArrow))
            ) {
              flushSyncReactUpdates();
              const freshRoot = renderState.rootContainer || root;
              const freshComponents = getInteractiveComponents(freshRoot);
              applyFocusState(freshComponents);

              handleTabNavigation(freshComponents, true, scheduleUpdate, freshRoot);
              const newFocused = freshComponents.find((comp) => (comp as FocusableNode).focused);
              terminal.focusedNodeId = newFocused?.id || null;
              return;
            }

            if (
              (key.downArrow || key.rightArrow) &&
              ((verticalNav && key.downArrow) || (horizontalNav && key.rightArrow))
            ) {
              flushSyncReactUpdates();
              const freshRoot = renderState.rootContainer || root;
              const freshComponents = getInteractiveComponents(freshRoot);
              applyFocusState(freshComponents);

              handleTabNavigation(freshComponents, false, scheduleUpdate, freshRoot);
              const newFocused = freshComponents.find((comp) => (comp as FocusableNode).focused);
              terminal.focusedNodeId = newFocused?.id || null;
              return;
            }
          }

          if (key.escape) {
            for (const comp of currentComponents) {
              interface DropdownLikeNode {
                isOpen?: boolean;
              }
              const dropdownComp = comp as unknown as DropdownLikeNode;
              if (comp.type === 'dropdown' && dropdownComp.isOpen) {
                dropdownComp.isOpen = false;
                scheduleUpdate();
                return;
              }
            }
          }

          const focused = currentComponents.find((comp) => (comp as FocusableNode).focused);

          if (focused) {
            const focusedNode = focused as FocusableNode;
            if (!focusedNode.disabled) {
              interface KeyboardEventObj {
                key: KeyEvent;
                _propagationStopped: boolean;
                stopPropagation: () => void;
                preventDefault: () => void;
              }
              const keyboardEvent: KeyboardEventObj = {
                key,
                _propagationStopped: false,
                stopPropagation: () => {
                  keyboardEvent._propagationStopped = true;
                },
                preventDefault: () => {},
              };

              if (focusedNode.onKeyDown) {
                (focusedNode.onKeyDown as (event: KeyboardEventObj) => void)(keyboardEvent);
              }

              interface InteractiveNode extends FocusableNode {
                handleKeyboardEvent?: (event: KeyboardEventObj) => void;
                isOpen?: boolean;
                submitButtonId?: string;
                onClick?: (event: { target: unknown }) => void;
              }
              const interactiveNode = focused as unknown as InteractiveNode;

              if (!keyboardEvent._propagationStopped) {
                if (interactiveNode.handleKeyboardEvent) {
                  const wasDropdownOpen = focused.type === 'dropdown' && interactiveNode.isOpen;

                  interface ReconcilerExt {
                    flushSyncFromReconciler?: (fn: () => void) => void;
                  }
                  const extReconciler = reconciler as typeof reconciler & ReconcilerExt;
                  if (typeof extReconciler.flushSyncFromReconciler === 'function') {
                    extReconciler.flushSyncFromReconciler(() => {
                      interactiveNode.handleKeyboardEvent!(keyboardEvent);
                    });
                  } else {
                    interactiveNode.handleKeyboardEvent(keyboardEvent);
                  }

                  if (wasDropdownOpen && (key.return || key.char === ' ')) {
                    const freshRoot = renderState.rootContainer || root;
                    const freshComponents = getInteractiveComponents(freshRoot);
                    const dropdown = freshComponents.find(
                      (c) => c.type === 'dropdown' && c.id === focused.id
                    );
                    if (dropdown) {
                      const dropdownNode = dropdown as unknown as InteractiveNode;
                      if (dropdownNode.isOpen) {
                        dropdownNode.isOpen = false;
                      }
                    }
                    flushBatchedUpdatesSync();
                    performRender();
                  } else {
                    scheduleUpdate();
                  }
                }

                // Handle submitButtonId on Enter for input components
                if (key.tab === false && key.return && focused.type === 'input') {
                  const submitButtonId = interactiveNode.submitButtonId;
                  if (submitButtonId) {
                    const submitButton = currentComponents.find(
                      (comp) => comp.type === 'button' && comp.id === submitButtonId
                    );
                    if (submitButton) {
                      const buttonNode = submitButton as unknown as InteractiveNode;
                      if (buttonNode.onClick && !buttonNode.disabled) {
                        buttonNode.onClick({ target: submitButton });
                      }
                    }
                  }
                }
              }
            }
          }

          if (!focused && currentComponents.length > 0) {
            const focusableComponents = currentComponents.filter((comp) => {
              const focusable = comp as FocusableNode;
              return (
                !focusable.disabled && (focusable.tabIndex === undefined || focusable.tabIndex >= 0)
              );
            });
            if (focusableComponents.length > 0) {
              const sorted = [...focusableComponents].sort((a, b) => {
                const aFocusable = a as FocusableNode;
                const bFocusable = b as FocusableNode;
                return (aFocusable.tabIndex || 0) - (bFocusable.tabIndex || 0);
              });
              const first = sorted[0]!;
              const firstFocusable = first as FocusableNode;
              firstFocusable.focused = true;
              terminal.setFocusedComponent(first as unknown as import('../types').ConsoleNode);
              if (firstFocusable.onFocus) {
                const focusEvent = { target: first, nativeEvent: { target: first } };
                firstFocusable.onFocus(focusEvent);
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
  };

  // Start input listener if interactive
  if (renderState.isInteractive && renderState.rootContainer) {
    const startInput = () => {
      performRender();
      setupInputHandling(renderState.rootContainer!);
    };
    if (typeof setImmediate !== 'undefined') {
      setImmediate(() => setImmediate(startInput));
    } else {
      setTimeout(() => setTimeout(startInput, 0), 0);
    }
  }
}

/**
 * Unmount the rendered React application
 */
export function unmount(): void {
  if (globalState.unmountInProgress) {
    process.stderr.write(`[unmount] Already in progress, skipping\n`);
    return;
  }
  globalState.unmountInProgress = true;

  const { showCursor } = require('./ansi');
  const { resetBufferRenderer, getBufferRenderer } = require('../buffer');
  const { clearBatchedUpdates } = require('./batching');
  const { stopInputListener } = require('./input');
  const { getTerminalDimensions } = require('../utils/terminal');

  // Store state FIRST before any cleanup
  const wasInteractive = globalState.wasInteractiveMode || globalState.isInteractive;

  // Get content height before cleanup
  let contentHeight = 0;
  if (wasInteractive) {
    try {
      const bufferRenderer = getBufferRenderer();
      contentHeight = bufferRenderer.lastContentHeight;
    } catch {
      // Buffer may not be initialized
    }
    if (contentHeight <= 0) {
      const dims = getTerminalDimensions();
      contentHeight = dims.rows;
    }
  }

  // Prevent any more renders
  setOnCommitCallback(null);
  clearBatchedUpdates();

  // Stop input listener
  stopInputListener();

  // Clean up resize listener
  if (renderState.resizeCleanup) {
    renderState.resizeCleanup();
    renderState.resizeCleanup = null;
  }

  // Reset state
  const hadRootFiber = renderState.rootFiber !== null;
  const rootFiber = renderState.rootFiber;
  const rootContainer = renderState.rootContainer;

  resetRenderState();
  globalState.isInteractive = false;
  globalState.wasInteractiveMode = false;

  // Reset buffer renderer
  resetBufferRenderer();

  // Unmount React tree
  if (hadRootFiber && rootFiber && rootContainer) {
    try {
      const { reconciler } = require('./reconciler');
      reconciler.updateContainer(null, rootFiber, null, () => {});
    } catch {
      // Reconciler may not be available
    }
  }

  // Build final output for cleanup
  let finalOutput = '';

  if (wasInteractive) {
    const targetRow = Math.max(contentHeight, 1);
    finalOutput += `\x1b[${targetRow + 1};1H`;
    finalOutput += '\x1b[J';
  }

  finalOutput += showCursor();
  finalOutput += '\n';

  process.stdout.write(finalOutput);
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
