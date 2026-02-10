/**
 * Mouse event handling utilities
 * Functions for handling mouse clicks, drags, and selection component interactions
 */

import type { ConsoleNode, MouseEvent } from '../../../types';
import { componentBoundsRegistry } from '../componentBounds';
import { isArrayValue } from '../../../types/guards';
import { terminal } from '../../../utils/globalTerminal';

// Import reconciler for discrete updates (ensures state changes are committed)
interface ReconcilerMethods {
  flushSyncFromReconciler?: (fn: () => void) => void;
  discreteUpdates?: (fn: () => void) => void;
  flushSyncWork?: () => void;
}
let reconciler: ReconcilerMethods | null = null;
try {
  reconciler = require('../../reconciler').reconciler as ReconcilerMethods;
} catch {
  // Reconciler may not be available
}

// Track mouse drag state (global state for drag tracking across components)
interface DragState {
  isDragging: boolean;
  component: ConsoleNode | null;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  button: number;
}

let dragState: DragState = {
  isDragging: false,
  component: null,
  startX: 0,
  startY: 0,
  lastX: 0,
  lastY: 0,
  button: 0,
};

// Track scrollbar drag state (separate from general drag state)
interface ScrollViewNode {
  scrollTop?: number;
  contentHeight?: number;
  maxHeight?: number;
  bounds?: { x: number; y: number; width: number; height: number } | null;
  onScroll?: (scrollTop: number, scrollLeft: number) => void;
  scrollToNode?: (node: unknown) => void;
}
interface ScrollbarDragState {
  isDragging: boolean;
  scrollView: ScrollViewNode | null;
  startY: number;
  startScrollTop: number;
}

let scrollbarDragState: ScrollbarDragState = {
  isDragging: false,
  scrollView: null,
  startY: 0,
  startScrollTop: 0,
};

// Track hover state for mouse enter/leave events
let hoveredComponent: ConsoleNode | null = null;

// Track selection component press to prevent release from focusing different component
// When dropdown closes after selection, release event may hit a different component
let selectionPressHandled = false;

/**
 * Handle mouse click on selection component option
 *
 * Determines which option was clicked based on mouse y coordinate relative to
 * component bounds. Handles Radio (select), Checkbox (toggle), Dropdown (open/select),
 * and List (select) components. Updates component state and triggers onChange events.
 *
 * @param component - Selection component (radio, checkbox, dropdown, or list)
 * @param mouse - Mouse event with coordinates
 * @param scheduleUpdate - Function to schedule re-render after state change
 *
 * @internal
 * This is an internal utility function called by handleMouseEvent.
 */
function handleSelectionComponentClick(
  component: ConsoleNode,
  mouse: MouseEvent,
  scheduleUpdate: () => void,
  immediateRender?: () => void
): void {
  const bounds = componentBoundsRegistry.get(component);

  if (!bounds) {
    return;
  }

  const options = component.options || [];
  if (options.length === 0) {
    return;
  }

  // Calculate which option was clicked based on y coordinate
  const relativeY = mouse.y - bounds.y;
  const optionIndex = Math.floor(relativeY);

  if (optionIndex >= 0 && optionIndex < options.length) {
    const option = options[optionIndex];
    if (!option) return;

    if (component.type === 'radio') {
      // Radio: select clicked option
      component.value = option.value;
      // Set highlighted index for keyboard navigation
      if (
        'setHighlightedIndex' in component &&
        typeof component.setHighlightedIndex === 'function'
      ) {
        component.setHighlightedIndex(optionIndex);
      } else {
        component.focusedIndex = optionIndex;
      }
      if (component.onChange) {
        component.onChange({
          value: option.value,
          key: {
            return: true,
            ctrl: false,
            meta: false,
            shift: false,
            escape: false,
            tab: false,
            backspace: false,
            delete: false,
            upArrow: false,
            downArrow: false,
            leftArrow: false,
            rightArrow: false,
          },
        });
      }
      // Force immediate render so selection is visible right away
      if (immediateRender) {
        immediateRender();
      } else {
        scheduleUpdate();
      }
      return;
    } else if (component.type === 'checkbox') {
      // Checkbox: toggle clicked option
      const rawValue = component.value ?? component.defaultValue;
      const selectedValues: (string | number)[] = isArrayValue(rawValue) ? rawValue : [];
      const isSelected = selectedValues.some((v) => v === option.value);
      const newSelectedValues: (string | number)[] = isSelected
        ? selectedValues.filter((v) => v !== option.value)
        : [...selectedValues, option.value];

      component.value = newSelectedValues as string[] | number[];
      // Set highlighted index for keyboard navigation
      if (
        'setHighlightedIndex' in component &&
        typeof component.setHighlightedIndex === 'function'
      ) {
        component.setHighlightedIndex(optionIndex);
      } else {
        component.focusedIndex = optionIndex;
      }
      if (component.onChange) {
        component.onChange({
          value: newSelectedValues as string[] | number[],
          key: {
            return: true,
            ctrl: false,
            meta: false,
            shift: false,
            escape: false,
            tab: false,
            backspace: false,
            delete: false,
            upArrow: false,
            downArrow: false,
            leftArrow: false,
            rightArrow: false,
          },
        });
      }
      // Force immediate render so selection is visible right away
      if (immediateRender) {
        immediateRender();
      } else {
        scheduleUpdate();
      }
      return;
    } else if (component.type === 'dropdown') {
      // Dropdown: open if closed, select option if open
      const isOpen = component.isOpen ?? false;
      interface DropdownComponent extends ConsoleNode {
        scrollOffset?: number;
      }
      const dropdownComp = component as DropdownComponent;

      if (!isOpen) {
        // Click on closed dropdown - open it
        component.isOpen = true;
        // Set focused index to current selection
        const selectedIdx = options.findIndex((opt) => opt.value === component.value);
        component.focusedIndex = selectedIdx >= 0 ? selectedIdx : 0;
      } else {
        // Dropdown is open - use relativeY to determine what was clicked
        // relativeY 0 = button row, relativeY 1+ = option rows (for dropdown below)
        const scrollOffset = dropdownComp.scrollOffset || 0;

        if (relativeY === 0) {
          // Clicked on the button row - close dropdown
          component.isOpen = false;
          dropdownComp.scrollOffset = 0;
          // Force immediate render so dropdown closes visually right away
          if (immediateRender) {
            immediateRender();
            return;
          }
        } else if (relativeY > 0) {
          // Clicked on an option (options are below button starting at relativeY 1)
          const clickedOptionIdx = scrollOffset + (relativeY - 1);

          if (clickedOptionIdx >= 0 && clickedOptionIdx < options.length) {
            const clickedOption = options[clickedOptionIdx];
            interface OptionWithDisabled {
              value: string | number;
              label?: string;
              disabled?: boolean;
            }
            const optionDisabled = (clickedOption as OptionWithDisabled)?.disabled;
            if (clickedOption && !optionDisabled) {
              if (component.multiple) {
                // Multiselect: toggle option, keep dropdown open
                const current: (string | number)[] = isArrayValue(component.value)
                  ? component.value
                  : [];
                const isSelected = current.some((v) => v === clickedOption.value);
                const newValue: (string | number)[] = isSelected
                  ? current.filter((v) => v !== clickedOption.value)
                  : [...current, clickedOption.value];
                component.value = newValue;
                component.focusedIndex = clickedOptionIdx;
                if (component.onChange) {
                  component.onChange({
                    value: newValue,
                    key: {
                      return: true,
                      ctrl: false,
                      meta: false,
                      shift: false,
                      escape: false,
                      tab: false,
                      backspace: false,
                      delete: false,
                      upArrow: false,
                      downArrow: false,
                      leftArrow: false,
                      rightArrow: false,
                    },
                  });
                }
              } else {
                // Single select: select and close
                component.value = clickedOption.value;
                component.isOpen = false;
                dropdownComp.scrollOffset = 0;

                if (component.onChange) {
                  component.onChange({
                    value: clickedOption.value,
                    key: {
                      return: true,
                      ctrl: false,
                      meta: false,
                      shift: false,
                      escape: false,
                      tab: false,
                      backspace: false,
                      delete: false,
                      upArrow: false,
                      downArrow: false,
                      leftArrow: false,
                      rightArrow: false,
                    },
                  });
                }
                // Force immediate render so dropdown closes visually right away
                if (immediateRender) {
                  immediateRender();
                } else {
                  scheduleUpdate();
                }
                return;
              }
            }
          }
        }
      }
    } else if (component.type === 'list') {
      // List: select clicked option
      const scrollTop = component.scrollTop || 0;
      const actualIndex = scrollTop + optionIndex;

      if (actualIndex >= 0 && actualIndex < options.length) {
        const actualOption = options[actualIndex];
        if (!actualOption) return;

        const newValue = component.multiple
          ? (() => {
              const current: (string | number)[] = isArrayValue(component.value)
                ? component.value
                : [];
              const isSelected = current.some((v) => v === actualOption.value);
              const result: (string | number)[] = isSelected
                ? current.filter((v) => v !== actualOption.value)
                : [...current, actualOption.value];
              return result;
            })()
          : actualOption.value;

        component.value = newValue as string | number | string[] | number[] | undefined;
        component.focusedIndex = actualIndex;
        if (component.onChange) {
          component.onChange({
            value: newValue as string | number | string[] | number[],
            key: {
              return: true,
              ctrl: false,
              meta: false,
              shift: false,
              escape: false,
              tab: false,
              backspace: false,
              delete: false,
              upArrow: false,
              downArrow: false,
              leftArrow: false,
              rightArrow: false,
            },
          });
        }
      }
    }

    scheduleUpdate();
  }
}

/**
 * Find the nearest ScrollView ancestor for a node (including the node itself)
 */
function findScrollViewAncestor(
  node: import('../../../nodes/base/Node').Node | null
): import('../../../nodes/base/Node').Node | null {
  let current = node;
  while (current) {
    if (current.type === 'scrollview') {
      return current;
    }
    current = current.parent;
  }
  return null;
}

/**
 * Find the innermost ScrollView at coordinates
 * Returns the deepest nested scrollview that contains the point
 * Uses actual screen position (set during rendering) for accurate hit testing
 */
function findInnermostScrollViewAt(
  x: number,
  y: number,
  rootNode: import('../../../nodes/base/Node').Node | null
): import('../../../nodes/base/Node').Node | null {
  if (!rootNode) return null;

  let deepestScrollView: import('../../../nodes/base/Node').Node | null = null;
  let deepestDepth = -1;

  // Recursive function that finds the deepest scrollview containing the point
  const findDeepestScrollView = (
    node: import('../../../nodes/base/Node').Node,
    depth: number
  ): void => {
    // For scrollviews, check if point is within actual screen viewport area
    if (node.type === 'scrollview') {
      interface ScrollViewScreenPos {
        screenX?: number;
        screenY?: number;
        screenWidth?: number;
        screenHeight?: number;
        effectiveVisibleHeight?: number;
        maxHeight?: number;
        bounds?: { x: number; y: number; width: number; height: number } | null;
      }
      const sv = node as import('../../../nodes/base/Node').Node & ScrollViewScreenPos;
      // Use screen position (set during rendering) instead of bounds
      // This accounts for parent scroll offsets
      const screenX = sv.screenX ?? sv.bounds?.x ?? 0;
      const screenY = sv.screenY ?? sv.bounds?.y ?? 0;
      const screenWidth = sv.screenWidth ?? sv.bounds?.width ?? 0;
      const screenHeight = sv.screenHeight
        ?? (sv.effectiveVisibleHeight && sv.effectiveVisibleHeight > 0 ? sv.effectiveVisibleHeight : null)
        ?? sv.maxHeight
        ?? sv.bounds?.height
        ?? 0;

      if (x >= screenX && x < screenX + screenWidth && y >= screenY && y < screenY + screenHeight) {
        // Point is in this scrollview
        if (depth > deepestDepth) {
          deepestScrollView = node;
          deepestDepth = depth;
        }
      }
    }

    // Check children for deeper nested scrollviews
    for (const child of node.children) {
      findDeepestScrollView(child, depth + 1);
    }
  };

  findDeepestScrollView(rootNode, 0);

  return deepestScrollView;
}

/**
 * Find ScrollView at coordinates (returns innermost)
 */
function findScrollViewAt(
  x: number,
  y: number,
  rootNode: import('../../../nodes/base/Node').Node | null
): import('../../../nodes/base/Node').Node | null {
  return findInnermostScrollViewAt(x, y, rootNode);
}

/**
 * Handle mouse events
 *
 * Finds components at mouse coordinates using hit testing and triggers appropriate
 * events (onClick, onPress, onMouseDown, onMouseDrag). Handles focus changes on click,
 * selection component clicks (radio, checkbox, dropdown, list), and drag events.
 * Supports mouse button tracking (left, middle, right) and drag state management.
 *
 * @param mouse - Mouse event with coordinates and button information
 * @param interactiveComponents - All interactive components (for hit testing)
 * @param scheduleUpdate - Function to schedule re-render after event handling
 *
 * @example
 * ```ts
 * handleMouseEvent({ x: 10, y: 5, button: 0 }, components, scheduleUpdate);
 * // Finds component at (10, 5) and triggers click events
 * ```
 */
export function handleMouseEvent(
  mouse: MouseEvent,
  interactiveComponents: import('../../../nodes/base/Node').Node[],
  scheduleUpdate: () => void,
  immediateRender?: () => void,
  rootNode?: import('../../../nodes/base/Node').Node | null
): void {
  // Handle scroll wheel events
  if (mouse.eventType === 'wheel' && mouse.scrollDirection) {
    // Find innermost ScrollView at mouse position
    let scrollView = findScrollViewAt(mouse.x, mouse.y, rootNode || null);
    const scrollAmount = mouse.scrollDirection === 'up' ? -3 : 3;

    // Try to scroll, bubbling up to parent if at limit
    interface ScrollableNode {
      scrollTop?: number;
      contentHeight?: number;
      maxHeight?: number;
      effectiveVisibleHeight?: number;
      scrollBy?(dy: number, dx: number): void;
      parent?: import('../../../nodes/base/Node').Node | null;
    }
    while (scrollView && 'scrollBy' in scrollView) {
      const sv = scrollView as import('../../../nodes/base/Node').Node & ScrollableNode;
      const oldScrollTop = sv.scrollTop ?? 0;

      // Check if we can scroll in this direction
      // Use effectiveVisibleHeight (which accounts for layout constraints from terminal size)
      // instead of maxHeight (which is just the prop value)
      const viewHeight = (sv.effectiveVisibleHeight && sv.effectiveVisibleHeight > 0)
        ? sv.effectiveVisibleHeight
        : (sv.maxHeight || sv.contentHeight || 0);
      const maxScroll = Math.max(0, (sv.contentHeight ?? 0) - viewHeight);
      const canScrollUp = mouse.scrollDirection === 'up' && oldScrollTop > 0;
      const canScrollDown = mouse.scrollDirection === 'down' && oldScrollTop < maxScroll;

      if (canScrollUp || canScrollDown) {
        // This scrollview can handle the scroll
        sv.scrollBy?.(scrollAmount, 0);
        scheduleUpdate();
        return;
      }

      // Can't scroll in this direction - bubble to parent scrollview
      // Start from parent to avoid returning the same scrollview
      scrollView = scrollView.parent ? findScrollViewAncestor(scrollView.parent) : null;
    }
    return;
  }

  // Use component bounds registry for hit testing
  const target = componentBoundsRegistry.findAt(mouse.x, mouse.y);

  // Handle scrollbar interactions (click and drag)
  interface ScrollViewWithScrollbar extends ScrollViewNode {
    isPointOnScrollbar?(x: number, y: number): boolean;
    isPointOnThumb?(x: number, y: number): boolean;
    handleScrollbarClick?(y: number): void;
  }
  if (target && target.type === 'scrollview' && 'isPointOnScrollbar' in target) {
    const scrollView = target as unknown as ScrollViewWithScrollbar;

    if (scrollView.isPointOnScrollbar?.(mouse.x, mouse.y)) {
      // Mouse is on scrollbar
      if (mouse.eventType === 'press' && mouse.button === 0) {
        if (scrollView.isPointOnThumb?.(mouse.x, mouse.y)) {
          // Click on thumb - start drag
          scrollbarDragState = {
            isDragging: true,
            scrollView,
            startY: mouse.y,
            startScrollTop: scrollView.scrollTop ?? 0,
          };
        } else {
          // Click on track - page up/down
          scrollView.handleScrollbarClick?.(mouse.y);
          if (immediateRender) {
            immediateRender();
          } else {
            scheduleUpdate();
          }
        }
        return;
      }
    }
  }

  // Handle scrollbar drag (motion while dragging thumb)
  if (scrollbarDragState.isDragging && scrollbarDragState.scrollView) {
    if (mouse.eventType === 'release') {
      // End drag
      scrollbarDragState = { isDragging: false, scrollView: null, startY: 0, startScrollTop: 0 };
      return;
    }

    // Continue drag - update scroll position
    interface ScrollViewWithDrag extends ScrollViewNode {
      handleScrollbarDrag?(y: number): void;
    }
    (scrollbarDragState.scrollView as ScrollViewWithDrag).handleScrollbarDrag?.(mouse.y);
    if (immediateRender) {
      immediateRender();
    } else {
      scheduleUpdate();
    }
    return;
  }

  // Handle hover (mouse enter/leave) events
  // This works for all mouse events including move events from 1003h mode
  interface HoverableNode extends ConsoleNode {
    onMouseLeave?: () => void;
    onMouseEnter?: () => void;
    isHovered?: boolean;
    isPressed?: boolean;
  }
  if (target !== hoveredComponent) {
    let needsUpdate = false;

    // Mouse left previous component
    if (hoveredComponent) {
      const hoverableComp = hoveredComponent as HoverableNode;
      if (hoverableComp.onMouseLeave) {
        hoverableComp.onMouseLeave();
        needsUpdate = true;
      }
      // Reset hover/pressed state on ButtonNodes
      if ('isHovered' in hoverableComp) {
        hoverableComp.isHovered = false;
        hoverableComp.isPressed = false;
        needsUpdate = true;
      }
    }

    // Mouse entered new component
    if (target) {
      const hoverableTarget = target as HoverableNode;
      if (hoverableTarget.onMouseEnter) {
        hoverableTarget.onMouseEnter();
        needsUpdate = true;
      }
      // Set hover state on ButtonNodes
      if ('isHovered' in hoverableTarget) {
        hoverableTarget.isHovered = true;
        needsUpdate = true;
      }
    }

    hoveredComponent = target;

    // Only schedule update if there's an actual visual change
    if (needsUpdate) {
      scheduleUpdate();
    }
  }

  // Handle drag events (mouse move while button is pressed)
  if (mouse.eventType === 'press' || (dragState.isDragging && mouse.eventType !== 'release')) {
    // Check if this is a drag (mouse moved while button was pressed)
    if (dragState.isDragging && dragState.component) {
      // Calculate drag delta
      const deltaX = mouse.x - dragState.startX;
      const deltaY = mouse.y - dragState.startY;

      // Check if mouse actually moved (not just another press at same position)
      const hasMoved = deltaX !== 0 || deltaY !== 0;

      if (hasMoved) {
        // Create drag event
        const dragEvent: MouseEvent = {
          ...mouse,
          isDragging: true,
          startX: dragState.startX,
          startY: dragState.startY,
          deltaX,
          deltaY,
          eventType: 'drag',
        };

        // Fire onMouseDrag event on the component being dragged
        if (dragState.component.onMouseDrag) {
          dragState.component.onMouseDrag(dragEvent);
        }

        // Also fire onMouseMove for compatibility
        if (dragState.component.onMouseMove) {
          dragState.component.onMouseMove(dragEvent);
        }

        dragState.lastX = mouse.x;
        dragState.lastY = mouse.y;
        scheduleUpdate();
      }

      // If this is a press event (M) and not a drag yet, update last position
      if (mouse.eventType === 'press' && !hasMoved) {
        dragState.lastX = mouse.x;
        dragState.lastY = mouse.y;
      }

      // Don't process clicks during drag (only process drag end on release)
      if (mouse.eventType === 'press') {
        return;
      }
    }

    // Start drag tracking on press (M event)
    if (mouse.eventType === 'press' && target && !target.disabled && mouse.button === 0) {
      dragState = {
        isDragging: false, // Will be set to true when mouse moves
        component: target,
        startX: mouse.x,
        startY: mouse.y,
        lastX: mouse.x,
        lastY: mouse.y,
        button: mouse.button || 0,
      };
    }
  }

  // Handle drag end (mouse button released)
  if (mouse.eventType === 'release' && dragState.isDragging && dragState.component) {
    const deltaX = mouse.x - dragState.startX;
    const deltaY = mouse.y - dragState.startY;

    // Create final drag event
    const dragEndEvent: MouseEvent = {
      ...mouse,
      isDragging: true,
      startX: dragState.startX,
      startY: dragState.startY,
      deltaX,
      deltaY,
      eventType: 'release',
    };

    // Fire onMouseUp on the dragged component
    if (dragState.component.onMouseUp) {
      dragState.component.onMouseUp(dragEndEvent);
    }

    // Fire final onMouseDrag if component was actually dragged
    if ((deltaX !== 0 || deltaY !== 0) && dragState.component.onMouseDrag) {
      dragState.component.onMouseDrag(dragEndEvent);
    }

    // Clear drag state
    dragState = {
      isDragging: false,
      component: null,
      startX: 0,
      startY: 0,
      lastX: 0,
      lastY: 0,
      button: 0,
    };

    scheduleUpdate();
    return; // Don't process as click if this was a drag
  }

  // Reset drag state on release if not dragging (simple click)
  if (mouse.eventType === 'release' && !dragState.isDragging) {
    dragState = {
      isDragging: false,
      component: null,
      startX: 0,
      startY: 0,
      lastX: 0,
      lastY: 0,
      button: 0,
    };
  }

  // Handle click outside open dropdowns (close them)
  // Only check on press events, not on move/hover events
  interface DropdownNodeExt {
    isOpen?: boolean;
  }
  if (mouse.eventType === 'press' && mouse.button === 0) {
    const openDropdowns = interactiveComponents.filter((comp) => {
      const dropdown = comp as unknown as DropdownNodeExt;
      return comp.type === 'dropdown' && dropdown.isOpen;
    });
    if (openDropdowns.length > 0) {
      // Check if click is on a dropdown (button or options area)
      const clickedDropdown = target && target.type === 'dropdown' ? target : null;

      // If click is outside all dropdowns, close all open dropdowns
      if (!clickedDropdown) {
        for (const dropdown of openDropdowns) {
          (dropdown as unknown as DropdownNodeExt).isOpen = false;
        }
        scheduleUpdate();
        // If click was completely outside any component, return early
        if (!target) {
          return;
        }
        // Continue processing the click on the target component (which is not a dropdown)
      }
      // If click is on a dropdown that's already open, let handleSelectionComponentClick handle it
      // If click is on a closed dropdown, handleSelectionComponentClick will open it
    }
  }

  if (!target || target.disabled) {
    return; // No component at click position or component is disabled
  }

  // Mark as dragging if mouse moved after initial press
  if (dragState.component === target && mouse.eventType === 'press') {
    const hasMoved = mouse.x !== dragState.startX || mouse.y !== dragState.startY;
    if (hasMoved) {
      dragState.isDragging = true;
    }
  }

  // Handle mouse button events
  // Button 0 = left, 1 = middle, 2 = right, 3 = no button (motion/hover)
  // Only handle actual button clicks, not motion events
  interface FocusableTargetNode {
    focused?: boolean;
    onFocus?: () => void;
    onBlur?: () => void;
    isPressed?: boolean;
  }
  if (mouse.button === 0 || mouse.button === 1 || mouse.button === 2) {
    // Check if this is a release after a selection component press
    // When dropdown closes after selection, release may hit a different component
    // We don't want to focus that component - the selection already handled focus
    if (mouse.eventType === 'release' && selectionPressHandled) {
      selectionPressHandled = false;
      return;
    }

    // Mouse button click (left, middle, or right)
    // Focus component on click - always handle focus for any left click (press or release)
    const focusableTarget = target as unknown as FocusableTargetNode;
    if (!focusableTarget.focused) {
      // Blur currently focused component
      const currentlyFocused = interactiveComponents.find((comp) => {
        const fc = comp as unknown as FocusableTargetNode;
        return fc.focused;
      });
      if (currentlyFocused) {
        const focusableCurrent = currentlyFocused as unknown as FocusableTargetNode;
        focusableCurrent.focused = false;
        terminal.setFocusedComponent(null);
        focusableCurrent.onBlur?.();
      }

      // Focus clicked component
      focusableTarget.focused = true;
      terminal.setFocusedComponent(target);
      focusableTarget.onFocus?.();

      // Use immediate render for focus changes to provide instant visual feedback
      if (immediateRender) {
        immediateRender();
      } else {
        scheduleUpdate();
      }
    }

    // Handle selection component clicks (radio, checkbox, dropdown, list)
    // Only handle on 'press' to avoid double-triggering (press + release)
    if (
      target.type === 'radio' ||
      target.type === 'checkbox' ||
      target.type === 'dropdown' ||
      target.type === 'list'
    ) {
      if (mouse.eventType === 'press') {
        // Mark that we handled a selection press - release may hit different component
        // after dropdown closes, and we don't want to focus that component
        selectionPressHandled = true;
        handleSelectionComponentClick(target, mouse, scheduleUpdate, immediateRender);
      }
      return;
    }

    // Handle input focus on click
    if (target.type === 'input') {
      // Input is focused, no additional action needed
      return;
    }

    // Set pressed state for visual feedback
    if ('isPressed' in target) {
      focusableTarget.isPressed = true;
    }

    // Trigger mouse events for other components
    // Wrap in discreteUpdates to ensure any state changes from handlers are committed
    const triggerEvents = () => {
      try {
        if (target.onMouseDown) {
          target.onMouseDown(mouse);
        }
        if (target.onClick) {
          target.onClick(mouse);
        }
        if (target.onPress) {
          // onPress is alias for onClick (React Native pattern)
          target.onPress(mouse);
        }
      } catch (error) {
        console.error('Error in click handler:', error);
      }
    };

    try {
      // Use flushSyncFromReconciler to ensure state updates trigger re-renders
      if (reconciler?.flushSyncFromReconciler) {
        reconciler.flushSyncFromReconciler(triggerEvents);
      } else if (reconciler?.discreteUpdates) {
        reconciler.discreteUpdates(triggerEvents);
      } else {
        triggerEvents();
      }

      // Flush any pending work after the event
      reconciler?.flushSyncWork?.();
    } catch (error) {
      console.error('Error in click handler:', error);
    }

    // Reset pressed state immediately after click processing
    // The visual feedback is provided by the immediate scheduleUpdate below
    if ('isPressed' in target) {
      // Use setImmediate to reset after the current event processing
      setImmediate(() => {
        try {
          focusableTarget.isPressed = false;
          scheduleUpdate();
        } catch {
          // Ignore errors during cleanup
        }
      });
    }

    scheduleUpdate();
  }
}
