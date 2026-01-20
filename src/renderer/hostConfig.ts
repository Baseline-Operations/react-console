/**
 * React Reconciler Host Config
 * Maps React operations to console/terminal operations
 */

import type { ConsoleNode, StyleProps, LayoutProps, ViewStyle, TextStyle, InputType, ComponentEventHandlers } from '../types';

export type HostInstance = ConsoleNode;

export type HostTextInstance = string;

export type HostContext = {
  x: number;
  y: number;
  width: number;
  styles?: StyleProps;
};

export type HostProps = Record<string, unknown>;

export type UpdatePayload = Partial<HostProps>;

export type ChildSet = ConsoleNode[];

export type TimeoutHandle = ReturnType<typeof setTimeout>;
export type NoTimeout = -1;

const now = (): number => Date.now();

const getPublicInstance = (instance: HostInstance): HostInstance => instance;

const getRootHostContext = (): HostContext => ({
  x: 0,
  y: 0,
  width: process.stdout.columns ?? 80,
  styles: undefined,
});

const getChildHostContext = (
  parentHostContext: HostContext,
  _type: string,
  props: HostProps
): HostContext => {
  return {
    ...parentHostContext,
    styles: props as StyleProps,
  };
};

const prepareForCommit = (): void => {
  // No-op for console renderer
};

const resetAfterCommit = (): void => {
  // No-op for console renderer
};

// Import component registry for custom component support
import { componentRegistry } from '../utils/componentRegistry';

const createInstance = (
  type: string,
  props: HostProps,
  _rootContainerInstance: unknown,
  _hostContext: HostContext,
  _internalInstanceHandle: unknown
): HostInstance => {
  // Check for custom registered components first
  if (componentRegistry.isRegistered(type)) {
    // Custom component - use 'box' as base type, but mark it as custom
    const node: ConsoleNode = {
      type: 'box',
      children: [],
      customType: type, // Mark as custom component
    };
    return node;
  }
  
  // Handle different component types
  let nodeType: ConsoleNode['type'] = 'box';

  if (type === 'fragment' || type === 'Fragment') {
    nodeType = 'fragment';
  } else if (type === 'Text') {
    nodeType = 'text';
  } else if (type === 'View' || type === 'Box') {
    nodeType = 'box'; // View and Box are the same (React Native pattern)
  } else if (type === 'LineBreak' || type === 'Newline' || type === '\n') {
    nodeType = 'linebreak'; // LineBreak component (React Native-like)
  } else if (type === 'Input') {
    nodeType = 'input';
  } else if (type === 'Button') {
    nodeType = 'button';
  } else if (type === 'Radio') {
    nodeType = 'radio';
  } else if (type === 'Checkbox') {
    nodeType = 'checkbox';
  } else if (type === 'Dropdown') {
    nodeType = 'dropdown';
  } else if (type === 'List') {
    nodeType = 'list';
  } else if (type === 'Pressable' || type === 'Focusable') {
    nodeType = 'box'; // Pressable and Focusable render as boxes with handlers
  } else if (type === 'Scrollable' || type === 'ScrollView') {
    nodeType = 'scrollable'; // ScrollView is React Native naming for Scrollable
  } else if (type === 'Overlay') {
    nodeType = 'overlay';
  } else if (type === 'Table') {
    nodeType = 'box'; // Table renders as a box with structured content
  } else if (type === 'Spinner') {
    nodeType = 'text'; // Spinner renders as animated text
  } else if (type === 'ProgressBar') {
    nodeType = 'box'; // ProgressBar renders as a box with bars
  } else if (type === 'Row' || type === 'Column') {
    nodeType = 'box'; // Row and Column are flex containers (shorthand for View with flexDirection)
  } else if (type === 'Prompt') {
    nodeType = 'box'; // Prompt renders as a box with question and input
  } else if (type === 'Suspense') {
    nodeType = 'fragment'; // Suspense is handled by React reconciler
  } else if (type === 'Form') {
    nodeType = 'box'; // Form renders as a box container
  } else if (type === 'Animated') {
    nodeType = 'box'; // Animated renders as a box wrapper
  } else {
    // Check if it's a registered custom component
    try {
      const { isComponentRegistered } = require('../utils/componentRegistry');
      if (isComponentRegistered(type)) {
        nodeType = type as any; // Use custom type
      }
    } catch {
      // Component registry not available, continue with default
    }
  }

  const node: ConsoleNode = {
    type: nodeType,
    children: [],
  };

  // Handle style prop (CSS-like, similar to React Native)
  if (props.style) {
    node.style = props.style as ViewStyle | TextStyle;
    // Extract legacy styles and layout from style for backward compatibility
    node.styles = props.style as StyleProps;
    node.layout = props.style as LayoutProps;
  } else {
    // Legacy support: extract styles and layout from props
    node.styles = props as StyleProps;
    node.layout = props as LayoutProps;
  }

  // Text can contain nested Text or string children
  // If it's a simple string, extract as content; otherwise children are processed by reconciler
  if (nodeType === 'text') {
    // Text may have nested Text components for inline styling (React Native pattern)
    // Children are processed by the reconciler, not extracted as simple content
  }

  // Extract event handlers and other props for interactive components
  if (nodeType === 'input' || nodeType === 'button' || nodeType === 'box' || nodeType === 'radio' || nodeType === 'checkbox' || nodeType === 'dropdown' || nodeType === 'list') {
    // Event handlers - properly typed from ComponentEventHandlers interface
    // Cast props to ComponentEventHandlers for event handler access (HostProps is Record<string, unknown>)
    const eventProps = props as Partial<ComponentEventHandlers>;
    if (eventProps.onChange) {
      node.onChange = eventProps.onChange;
    }
    if (eventProps.onKeyDown) {
      node.onKeyDown = eventProps.onKeyDown;
    }
    if (eventProps.onKeyUp) {
      node.onKeyUp = eventProps.onKeyUp;
    }
    if (eventProps.onKeyPress) {
      node.onKeyPress = eventProps.onKeyPress;
    }
    if (eventProps.onSubmit) {
      node.onSubmit = eventProps.onSubmit;
    }
    if (eventProps.onClick) {
      node.onClick = eventProps.onClick;
    }
    if (eventProps.onPress) {
      node.onPress = eventProps.onPress;
    }
    if (eventProps.onMouseDown) {
      node.onMouseDown = eventProps.onMouseDown;
    }
    if (eventProps.onMouseUp) {
      node.onMouseUp = eventProps.onMouseUp;
    }
    if (eventProps.onMouseMove) {
      node.onMouseMove = eventProps.onMouseMove;
    }
    if (eventProps.onFocus) {
      node.onFocus = eventProps.onFocus;
    }
    if (eventProps.onBlur) {
      node.onBlur = eventProps.onBlur;
    }
    if (nodeType === 'button' || nodeType === 'box' || nodeType === 'radio' || nodeType === 'checkbox' || nodeType === 'dropdown' || nodeType === 'list') {
      node.tabIndex = props.tabIndex as number;
    }
    node.value = props.value as string | number | boolean | string[] | number[];
    node.defaultValue = props.defaultValue as string | number | boolean | string[] | number[];
    node.placeholder = props.placeholder as string;
    node.focused = props.focused as boolean;
    node.disabled = props.disabled as boolean;
    node.mask = props.mask as string;
    node.maxLength = props.maxLength as number;
    node.maxWidth = props.maxWidth as number;
    node.multiline = props.multiline as boolean;
    node.maxLines = props.maxLines as number;
    node.autoFocus = props.autoFocus as boolean;
    // Input type and validation
    node.inputType = props.type as InputType;
    node.step = props.step as number;
    node.min = props.min as number;
    node.max = props.max as number;
    node.allowDecimals = props.allowDecimals as boolean;
    node.decimalPlaces = props.decimalPlaces as number;
    node.formatDisplay = props.formatDisplay as ((value: string | number | boolean) => string) | undefined;
    node.formatValue = props.formatValue as ((value: string | number | boolean) => string | number) | undefined;
    node.pattern = props.pattern as string | RegExp | undefined;
    // Radio/Checkbox/Dropdown/List specific
    node.options = props.options as Array<{ label: string; value: string | number }> | undefined;
    node.selected = props.selected as string | number | string[] | undefined;
    node.multiple = props.multiple as boolean | undefined;
    node.name = props.name as string | undefined;
    node.displayFormat = props.displayFormat as string | undefined;
    node.tabIndex = props.tabIndex as number;
  }

  if (nodeType === 'scrollable') {
    node.scrollTop = props.scrollTop as number;
    node.scrollLeft = props.scrollLeft as number;
    node.maxHeight = props.maxHeight as number;
    node.maxWidth = props.maxWidth as number;
  }

  if (nodeType === 'overlay') {
    node.zIndex = props.zIndex as number;
    node.backdrop = props.backdrop as boolean;
    node.backdropColor = props.backdropColor as string;
  }

  // Handle fullscreen prop for box/view components
  if (nodeType === 'box') {
    node.fullscreen = props.fullscreen as boolean;
  }

  return node;
};

const createTextInstance = (
  text: string,
  _rootContainerInstance: unknown,
  _hostContext: HostContext,
  _internalInstanceHandle: unknown
): HostTextInstance => {
  return text;
};

const appendInitialChild = (parentInstance: HostInstance, child: HostInstance | HostTextInstance): void => {
  if (!parentInstance.children) {
    parentInstance.children = [];
  }
  
  if (typeof child === 'string') {
    // Text child - create text node
    parentInstance.children.push({
      type: 'text',
      content: child,
    });
  } else if (child && typeof child === 'object') {
    // Component child
    parentInstance.children.push(child);
  }
};

const finalizeInitialChildren = (): boolean => {
  return false;
};

const prepareUpdate = (
  _instance: HostInstance,
  _type: string,
  _oldProps: HostProps,
  _newProps: HostProps,
  _rootContainerInstance: unknown,
  _hostContext: HostContext
): UpdatePayload | null => {
  return _newProps;
};

const shouldSetTextContent = (_type: string, _props: HostProps): boolean => {
  return false;
};

const getCurrentEventPriority = (): number => {
  return 0; // Default priority
};

const scheduleCallback = (
  _priority: number,
  callback: () => void,
  options?: { delay?: number }
): TimeoutHandle | NoTimeout => {
  const delay = options?.delay ?? 0;
  if (delay > 0) {
    return setTimeout(callback, delay) as TimeoutHandle;
  }
  // Immediate execution for synchronous priority
  callback();
  return -1 as NoTimeout;
};

const cancelCallback = (handle: TimeoutHandle | NoTimeout): void => {
  if (handle !== -1) {
    clearTimeout(handle as TimeoutHandle);
  }
};

const shouldYield = (): boolean => {
  return false;
};

const requestPaint = (): void => {
  // Request a paint/re-render through React reconciliation
  // This is called by React when it wants to trigger a visual update
  // The actual rendering will happen through the reconciler's update callback
  // which calls performRender() in render.ts
};

const appendChild = (parentInstance: HostInstance, child: HostInstance | HostTextInstance): void => {
  appendInitialChild(parentInstance, child);
};

const appendChildToContainer = (
  container: HostInstance,
  child: HostInstance | HostTextInstance
): void => {
  appendInitialChild(container, child);
};

const insertBefore = (
  parentInstance: HostInstance,
  child: HostInstance | HostTextInstance,
  beforeChild: HostInstance | HostTextInstance
): void => {
  if (!parentInstance.children) {
    parentInstance.children = [];
  }
  const beforeIndex = parentInstance.children.indexOf(beforeChild as ConsoleNode);
  if (beforeIndex >= 0) {
    if (typeof child === 'string') {
      parentInstance.children.splice(beforeIndex, 0, {
        type: 'text',
        content: child,
      });
    } else {
      parentInstance.children.splice(beforeIndex, 0, child);
    }
  } else {
    appendInitialChild(parentInstance, child);
  }
};

const insertInContainerBefore = (
  container: HostInstance,
  child: HostInstance | HostTextInstance,
  beforeChild: HostInstance | HostTextInstance
): void => {
  insertBefore(container, child, beforeChild);
};

const removeChild = (parentInstance: HostInstance, child: HostInstance | HostTextInstance): void => {
  if (!parentInstance.children) return;
  const index = parentInstance.children.findIndex(
    (c) => c === (child as ConsoleNode) || (typeof child === 'string' && c.content === child)
  );
  if (index >= 0) {
    parentInstance.children.splice(index, 1);
  }
};

const removeChildFromContainer = (
  container: HostInstance,
  child: HostInstance | HostTextInstance
): void => {
  removeChild(container, child);
};

const commitTextUpdate = (
  _textInstance: HostTextInstance,
  _oldText: string,
  _newText: string
): void => {
  // Text instances are immutable, so this updates the content in the tree
  // The actual update will be handled during render
};

const commitUpdate = (
  instance: HostInstance,
  _updatePayload: UpdatePayload,
  _type: string,
  _oldProps: HostProps,
  newProps: HostProps,
  _finishedWork: unknown
): void => {
  // Update instance properties from new props
  // This is called by React reconciler during commit phase
  
  // Handle style prop (CSS-like, similar to React Native)
  if (newProps.style) {
    instance.style = newProps.style as ViewStyle | TextStyle;
    // Extract legacy styles and layout from style for backward compatibility
    instance.styles = newProps.style as StyleProps;
    instance.layout = newProps.style as LayoutProps;
  } else {
    // Legacy support: update styles and layout separately
    if (newProps.styles) {
      instance.styles = newProps.styles as StyleProps;
    }
    
    if (newProps.layout) {
      instance.layout = newProps.layout as LayoutProps;
    }
  }
  
  // Update all interactive props from newProps
  const nodeType = instance.type;
  
  // Handle fullscreen prop for box/view components
  if (nodeType === 'box') {
    instance.fullscreen = newProps.fullscreen as boolean | undefined;
  }

  if (nodeType === 'input' || nodeType === 'button' || nodeType === 'box' || nodeType === 'radio' || nodeType === 'checkbox' || nodeType === 'dropdown' || nodeType === 'list') {
    // Event handlers - properly typed from ComponentEventHandlers interface
    const eventProps = newProps as Partial<ComponentEventHandlers>;
    if (eventProps.onChange) {
      instance.onChange = eventProps.onChange;
    }
    if (eventProps.onKeyDown) {
      instance.onKeyDown = eventProps.onKeyDown;
    }
    if (eventProps.onKeyUp) {
      instance.onKeyUp = eventProps.onKeyUp;
    }
    if (eventProps.onKeyPress) {
      instance.onKeyPress = eventProps.onKeyPress;
    }
    if (eventProps.onSubmit) {
      instance.onSubmit = eventProps.onSubmit;
    }
    if (eventProps.onClick) {
      instance.onClick = eventProps.onClick;
    }
    if (eventProps.onPress) {
      instance.onPress = eventProps.onPress;
    }
    if (eventProps.onMouseDown) {
      instance.onMouseDown = eventProps.onMouseDown;
    }
    if (eventProps.onMouseUp) {
      instance.onMouseUp = eventProps.onMouseUp;
    }
    if (eventProps.onMouseMove) {
      instance.onMouseMove = eventProps.onMouseMove;
    }
    if (eventProps.onFocus) {
      instance.onFocus = eventProps.onFocus;
    }
    if (eventProps.onBlur) {
      instance.onBlur = eventProps.onBlur;
    }
    
    // Update interactive component props
    instance.value = newProps.value as string | number | boolean | string[] | number[] | undefined;
    instance.defaultValue = newProps.defaultValue as string | number | boolean | string[] | number[] | undefined;
    instance.placeholder = newProps.placeholder as string | undefined;
    instance.disabled = newProps.disabled as boolean | undefined;
    instance.mask = newProps.mask as string | undefined;
    instance.maxLength = newProps.maxLength as number | undefined;
    instance.maxWidth = newProps.maxWidth as number | undefined;
    instance.multiline = newProps.multiline as boolean | undefined;
    instance.maxLines = newProps.maxLines as number | undefined;
    instance.autoFocus = newProps.autoFocus as boolean | undefined;
    instance.tabIndex = newProps.tabIndex as number | undefined;
    // Input type and validation
    instance.inputType = (newProps.type || newProps.inputType) as InputType | undefined;
    instance.step = newProps.step as number | undefined;
    instance.min = newProps.min as number | undefined;
    instance.max = newProps.max as number | undefined;
    instance.allowDecimals = newProps.allowDecimals as boolean | undefined;
    instance.decimalPlaces = newProps.decimalPlaces as number | undefined;
    instance.formatDisplay = newProps.formatDisplay as ((value: string | number | boolean) => string) | undefined;
    instance.formatValue = newProps.formatValue as ((value: string | number | boolean) => string | number) | undefined;
    instance.pattern = newProps.pattern as string | RegExp | undefined;
    // Radio/Checkbox/Dropdown/List specific
    instance.options = newProps.options as Array<{ label: string; value: string | number }> | undefined;
    instance.selected = newProps.selected as string | number | string[] | undefined;
    instance.multiple = newProps.multiple as boolean | undefined;
    instance.name = newProps.name as string | undefined;
    instance.displayFormat = newProps.displayFormat as string | undefined;
    
    if (newProps.content !== undefined) {
      instance.content = String(newProps.content);
    }
  }
};

const hideInstance = (): void => {
  // No-op for console renderer
};

const hideTextInstance = (): void => {
  // No-op for console renderer
};

const unhideInstance = (): void => {
  // No-op for console renderer
};

const unhideTextInstance = (): void => {
  // No-op for console renderer
};

const clearContainer = (container: HostInstance): void => {
  container.children = [];
};

export const hostConfig = {
  now,
  getPublicInstance,
  getRootHostContext,
  getChildHostContext,
  prepareForCommit,
  resetAfterCommit,
  createInstance,
  createTextInstance,
  appendInitialChild,
  finalizeInitialChildren,
  prepareUpdate,
  shouldSetTextContent,
  getCurrentEventPriority,
  scheduleCallback,
  cancelCallback,
  shouldYield,
  requestPaint,
  appendChild,
  appendChildToContainer,
  insertBefore,
  insertInContainerBefore,
  removeChild,
  removeChildFromContainer,
  commitTextUpdate,
  commitUpdate,
  hideInstance,
  hideTextInstance,
  unhideInstance,
  unhideTextInstance,
  clearContainer,
  // React 19 compatibility - these may be required
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,
};
