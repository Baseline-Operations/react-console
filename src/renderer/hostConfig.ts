/**
 * React Reconciler Host Config
 * Maps React operations to new Node-based architecture
 */

import type { ReactElement } from 'react';
import { NodeFactory } from '../nodes/NodeFactory';
import type { Node } from '../nodes/base/Node';

export type HostInstance = Node;

export type HostTextInstance = string;

export type HostContext = {
  x: number;
  y: number;
  width: number;
};

export type HostProps = Record<string, unknown>;

export type UpdatePayload = Partial<HostProps>;

export type ChildSet = Node[];

export type TimeoutHandle = ReturnType<typeof setTimeout>;
export type NoTimeout = -1;

const now = (): number => Date.now();

const getPublicInstance = (instance: HostInstance): HostInstance => instance;

const getRootHostContext = (): HostContext => {
  return {
    x: 0,
    y: 0,
    width: process.stdout.columns ?? 80,
  };
};

const getChildHostContext = (
  parentHostContext: HostContext,
  _type: string,
  _props: HostProps
): HostContext => {
  return parentHostContext;
};

const prepareForCommit = (): void => {
  // No-op for console renderer
};

const resetAfterCommit = (): void => {
  // No-op for console renderer
};

const createInstance = (
  type: string | React.ComponentType<any>,
  props: HostProps,
  _rootContainerInstance: unknown,
  _hostContext: HostContext,
  _internalInstanceHandle: unknown
): HostInstance => {
  // Convert React element type to Node
  const element: ReactElement = {
    type: typeof type === 'string' ? type : (type as any).name || 'Box',
    props: props as any,
  } as ReactElement;
  
  return NodeFactory.createNode(element);
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
  if (typeof child === 'string') {
    // Text child handling:
    // When JSX has interpolation like "Text: {value} more", React creates separate string children.
    // NodeFactory.createNode already concatenates these into a single content string.
    // So if parent is a TextNode that already has content, we should skip adding string children
    // to avoid duplicate rendering at wrong positions.
    if (parentInstance.type === 'text') {
      // Parent is TextNode - it already has concatenated content from NodeFactory
      // Skip all string children to avoid duplicates
      return;
    }
    // For non-text parents, create text node and append
    const textElement: ReactElement = {
      type: 'Text',
      props: { children: child },
    } as ReactElement;
    const textNode = NodeFactory.createNode(textElement, parentInstance);
    parentInstance.appendChild(textNode);
  } else {
    // Node child
    child.parent = parentInstance;
    parentInstance.appendChild(child);
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
  return 0;
};

let currentUpdatePriority: number = 0;

const resolveUpdatePriority = (): number => {
  return currentUpdatePriority;
};

const setCurrentUpdatePriority = (priority: number): void => {
  currentUpdatePriority = priority;
};

const getCurrentUpdatePriority = (): number => {
  return currentUpdatePriority;
};

const resolveEventType = (): string => {
  return 'unknown';
};

const resolveEventTimeStamp = (): number => {
  return now();
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
};

const requestPostPaintCallback = (callback: () => void): TimeoutHandle => {
  if (typeof setImmediate !== 'undefined') {
    setImmediate(callback);
    return setImmediate as unknown as TimeoutHandle;
  } else {
    return setTimeout(callback, 0) as TimeoutHandle;
  }
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
  if (typeof child === 'string') {
    const textElement: ReactElement = {
      type: 'Text',
      props: { children: child },
    } as ReactElement;
    const textNode = NodeFactory.createNode(textElement, parentInstance);
    const beforeIndex = parentInstance.children.indexOf(beforeChild as Node);
    if (beforeIndex >= 0) {
      parentInstance.children.splice(beforeIndex, 0, textNode);
    } else {
      parentInstance.appendChild(textNode);
    }
  } else {
    const beforeIndex = parentInstance.children.indexOf(beforeChild as Node);
    if (beforeIndex >= 0) {
      child.parent = parentInstance;
      parentInstance.children.splice(beforeIndex, 0, child);
    } else {
      appendInitialChild(parentInstance, child);
    }
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
  if (typeof child === 'string') {
    // Find text node with matching content
    const index = parentInstance.children.findIndex(
      (c) => c.content === child
    );
    if (index >= 0) {
      parentInstance.children.splice(index, 1);
    }
  } else {
    const index = parentInstance.children.indexOf(child);
    if (index >= 0) {
      parentInstance.children.splice(index, 1);
      child.parent = null;
    }
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
  // Text instances are immutable, updates handled during render
};

const commitUpdate = (
  instance: HostInstance,
  _updatePayload: UpdatePayload,
  _type: string,
  _oldProps: HostProps,
  newProps: HostProps,
  _finishedWork: unknown
): void => {
  // Update node properties from new props
  if (newProps.style && 'setStyle' in instance) {
    (instance as any).setStyle(newProps.style);
  }
  
  // Update event handlers
  if (newProps.onClick && 'onClick' in instance) {
    (instance as any).onClick = newProps.onClick;
  }
  if (newProps.onKeyDown && 'onKeyDown' in instance) {
    (instance as any).onKeyDown = newProps.onKeyDown;
  }
  if (newProps.onChange && 'onChange' in instance) {
    (instance as any).onChange = newProps.onChange;
  }
  if (newProps.onFocus && 'onFocus' in instance) {
    (instance as any).onFocus = newProps.onFocus;
  }
  if (newProps.onBlur && 'onBlur' in instance) {
    (instance as any).onBlur = newProps.onBlur;
  }
  
  // Update content for text nodes
  if (newProps.children !== undefined && 'setContent' in instance) {
    (instance as any).setContent(String(newProps.children));
  }
  
  // Update value for input nodes
  if (newProps.value !== undefined && 'setValue' in instance) {
    (instance as any).setValue(newProps.value);
  }
};

const hideInstance = (): void => {
  // No-op
};

const hideTextInstance = (): void => {
  // No-op
};

const unhideInstance = (): void => {
  // No-op
};

const unhideTextInstance = (): void => {
  // No-op
};

const clearContainer = (container: HostInstance): void => {
  container.children = [];
};

const maySuspendCommit = (_type: string, _props: HostProps): boolean => {
  return false;
};

const preloadInstance = (_type: string, _props: HostProps): void => {
  // No-op
};

const startSuspendingCommit = (): void => {
  // No-op
};

const suspendInstance = (_type: string, _props: HostProps): void => {
  // No-op
};

const waitForCommitToBeReady = (): ((initiateCommit: () => void) => () => void) | null => {
  return null;
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
  resolveUpdatePriority,
  setCurrentUpdatePriority,
  getCurrentUpdatePriority,
  resolveEventType,
  resolveEventTimeStamp,
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
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,
  NotPendingTransition: null,
  HostTransitionContext: null,
  requestPostPaintCallback,
  shouldAttemptEagerTransition: () => false,
  resetFormInstance: () => {
    // No-op
  },
  maySuspendCommit,
  preloadInstance,
  startSuspendingCommit,
  suspendInstance,
  waitForCommitToBeReady,
};
