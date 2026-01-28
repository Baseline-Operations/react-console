/**
 * Mouse event handling utilities
 * Functions for handling mouse clicks, drags, and selection component interactions
 */

import type { ConsoleNode, MouseEvent } from '../../../types';
import { componentBoundsRegistry } from '../componentBounds';
import { isArrayValue } from '../../../types/guards';
import { terminal } from '../../../utils/globalTerminal';

// Import reconciler for discrete updates (ensures state changes are committed)
let reconciler: any = null;
try {
  reconciler = require('../../reconciler').reconciler;
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

// Track hover state for mouse enter/leave events
let hoveredComponent: ConsoleNode | null = null;

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
  scheduleUpdate: () => void
): void {
  const bounds = componentBoundsRegistry.get(component);
  if (!bounds) return;

  const options = component.options || [];
  if (options.length === 0) return;

  // Calculate which option was clicked based on y coordinate
  const relativeY = mouse.y - bounds.y;
  const optionIndex = Math.floor(relativeY);

  if (optionIndex >= 0 && optionIndex < options.length) {
    const option = options[optionIndex];
    if (!option) return;

    if (component.type === 'radio') {
      // Radio: select clicked option
      component.value = option.value;
      component.focusedIndex = optionIndex;
      if (component.onChange) {
        component.onChange({
          value: option.value,
          key: { return: true, ctrl: false, meta: false, shift: false, escape: false, tab: false, backspace: false, delete: false, upArrow: false, downArrow: false, leftArrow: false, rightArrow: false },
        });
      }
    } else if (component.type === 'checkbox') {
      // Checkbox: toggle clicked option
      const rawValue = component.value ?? component.defaultValue;
      const selectedValues: (string | number)[] = isArrayValue(rawValue) ? rawValue : [];
      const isSelected = selectedValues.some(v => v === option.value);
      const newSelectedValues: (string | number)[] = isSelected
        ? selectedValues.filter(v => v !== option.value)
        : [...selectedValues, option.value];
      
      component.value = newSelectedValues as string[] | number[];
      component.focusedIndex = optionIndex;
      if (component.onChange) {
        component.onChange({
          value: newSelectedValues as string[] | number[],
          key: { return: true, ctrl: false, meta: false, shift: false, escape: false, tab: false, backspace: false, delete: false, upArrow: false, downArrow: false, leftArrow: false, rightArrow: false },
        });
      }
    } else if (component.type === 'dropdown') {
      // Dropdown: open if closed, select option if open
      const isOpen = component.isOpen ?? false;
      if (!isOpen) {
        component.isOpen = true;
        component.focusedIndex = optionIndex;
      } else {
        // Select option
        const newValue = component.multiple
          ? (() => {
              const current: (string | number)[] = isArrayValue(component.value) ? component.value : [];
              const isSelected = current.some(v => v === option.value);
              const result: (string | number)[] = isSelected
                ? current.filter(v => v !== option.value)
                : [...current, option.value];
              return result;
            })()
          : option.value;
        
        component.value = newValue as string | number | string[] | number[] | undefined;
        component.isOpen = false;
        if (component.onChange) {
          component.onChange({
            value: newValue as string | number | string[] | number[],
            key: { return: true, ctrl: false, meta: false, shift: false, escape: false, tab: false, backspace: false, delete: false, upArrow: false, downArrow: false, leftArrow: false, rightArrow: false },
          });
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
              const current: (string | number)[] = isArrayValue(component.value) ? component.value : [];
              const isSelected = current.some(v => v === actualOption.value);
              const result: (string | number)[] = isSelected
                ? current.filter(v => v !== actualOption.value)
                : [...current, actualOption.value];
              return result;
            })()
          : actualOption.value;

        component.value = newValue as string | number | string[] | number[] | undefined;
        component.focusedIndex = actualIndex;
        if (component.onChange) {
          component.onChange({
            value: newValue as string | number | string[] | number[],
            key: { return: true, ctrl: false, meta: false, shift: false, escape: false, tab: false, backspace: false, delete: false, upArrow: false, downArrow: false, leftArrow: false, rightArrow: false },
          });
        }
      }
    }
    
    scheduleUpdate();
  }
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
  scheduleUpdate: () => void
): void {
  // Use component bounds registry for hit testing
  const target = componentBoundsRegistry.findAt(mouse.x, mouse.y);

  // Handle hover (mouse enter/leave) events
  // This works for all mouse events including move events from 1003h mode
  if (target !== hoveredComponent) {
    // Mouse left previous component
    if (hoveredComponent) {
      if ('onMouseLeave' in hoveredComponent && typeof (hoveredComponent as any).onMouseLeave === 'function') {
        (hoveredComponent as any).onMouseLeave();
      }
      // Reset hover/pressed state on ButtonNodes
      if ('isHovered' in hoveredComponent) {
        (hoveredComponent as any).isHovered = false;
        (hoveredComponent as any).isPressed = false;
      }
    }
    
    // Mouse entered new component
    if (target) {
      if ('onMouseEnter' in target && typeof (target as any).onMouseEnter === 'function') {
        (target as any).onMouseEnter();
      }
      // Set hover state on ButtonNodes
      if ('isHovered' in target) {
        (target as any).isHovered = true;
      }
    }
    
    hoveredComponent = target;
    scheduleUpdate();
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
  // Check if any dropdowns are open
  const openDropdowns = interactiveComponents.filter(
    (comp) => comp.type === 'dropdown' && (comp as any).isOpen
  );
  if (openDropdowns.length > 0) {
    // Check if click is on a dropdown (button or options area)
    const clickedDropdown = target && target.type === 'dropdown' ? target : null;
    
    // If click is outside all dropdowns, close all open dropdowns
    if (!clickedDropdown) {
      for (const dropdown of openDropdowns) {
        (dropdown as any).isOpen = false;
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
  if (mouse.button === 0) {
    // Left click
    // Focus component on click
    if (!(target as any).focused) {
      // Blur currently focused component
      const currentlyFocused = interactiveComponents.find((comp) => (comp as any).focused);
      if (currentlyFocused) {
        (currentlyFocused as any).focused = false;
        terminal.setFocusedComponent(null);
        (currentlyFocused as any).onBlur?.();
      }
      
      // Focus clicked component
      (target as any).focused = true;
      terminal.setFocusedComponent(target);
      (target as any).onFocus?.();
    }

    // Handle selection component clicks (radio, checkbox, dropdown, list)
    if (target.type === 'radio' || target.type === 'checkbox' || target.type === 'dropdown' || target.type === 'list') {
      handleSelectionComponentClick(target, mouse, scheduleUpdate);
      return; // Selection components handle their own clicks
    }

    // Set pressed state for visual feedback
    if ('isPressed' in target) {
      (target as any).isPressed = true;
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
        // eslint-disable-next-line no-console
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
      // eslint-disable-next-line no-console
      console.error('Error in click handler:', error);
    }
    
    // Reset pressed state after a short delay (visual feedback)
    setTimeout(() => {
      try {
        if ('isPressed' in target) {
          (target as any).isPressed = false;
        }
        // Flush the pressed state change
        if (reconciler?.flushSyncFromReconciler) {
          reconciler.flushSyncFromReconciler(() => {});
        }
        scheduleUpdate();
      } catch (error) {
        // Ignore errors during cleanup
      }
    }, 100);
    
    scheduleUpdate();
  } else if (mouse.button === 1) {
    // Middle click
    if (target.onMouseDown) {
      target.onMouseDown(mouse);
    }
  } else if (mouse.button === 2) {
    // Right click
    if (target.onMouseDown) {
      target.onMouseDown(mouse);
    }
  }
}
