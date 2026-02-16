/**
 * React Reconciler Host Config
 * This is the interface between React and the Node system
 * Extracted from Node.ts for better code organization
 */

import type { Node } from '../nodes/base/Node';
import type { ViewStyle, TextStyle } from '../types';
import { debug } from '../utils/debug';

// Extended node interface for mixin capabilities
interface RenderableNode {
  clearRenderingState?(): void;
  render?(buffer: unknown, context: unknown): void;
  computeLayout?(constraints: unknown): unknown;
  updateStackingContext?(): void;
  updateViewport?(): void;
  setStyle?(style: ViewStyle | TextStyle): void;
  setContent?(content: string): void;
  setValue?(value: unknown): void;
  setLabel?(label: string): void;
  onClick?: (event: unknown) => void;
  onPress?: (event: unknown) => void;
  onKeyDown?: (event: unknown) => void;
  onChange?: (event: unknown) => void;
  onFocus?: (event?: unknown) => void;
  onBlur?: () => void;
  onSubmit?: (event: unknown) => void;
  disabled?: boolean;
  tabIndex?: number;
  autoFocus?: boolean;
  componentId?: string;
  disabledStyle?: ViewStyle | TextStyle;
  focusedStyle?: ViewStyle | TextStyle;
  pressedStyle?: ViewStyle | TextStyle;
  hoveredStyle?: ViewStyle | TextStyle;
}

// Text instance type - mutable so we can update text content
interface TextInstance {
  text: string;
  parentNode: Node | null;
  childNode?: Node; // Reference to created TextNode child for updates
}

// Priority tracking for react-reconciler
const DefaultEventPriority = 32;
let currentUpdatePriority = DefaultEventPriority;

/**
 * Create React Reconciler host config
 * This is the interface between React and the Node system
 * Returns the host config object required by react-reconciler
 */
// Return type uses 'any' to allow additional properties required by react-reconciler 0.31+
// that aren't in the @types/react-reconciler type definitions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createHostConfig(): any {
  const { NodeFactory } = require('../nodes/NodeFactory');

  const getPublicInstance = (instance: Node): Node => instance;

  const getRootHostContext = (): { x: number; y: number; width: number } => {
    return {
      x: 0,
      y: 0,
      width: process.stdout.columns ?? 80,
    };
  };

  const getChildHostContext = (
    parentHostContext: object,
    _type: string,
    _rootContainer: Node
  ): object => {
    return parentHostContext;
  };

  const prepareForCommit = (_containerInfo: Node): Record<string, unknown> | null => {
    debug('[hostConfig] prepareForCommit');
    return null;
  };

  const resetAfterCommit = (): void => {
    debug('[hostConfig] resetAfterCommit');
    // Call the registered callback to trigger screen rendering
    // This ensures state updates result in visible screen changes
    const { getOnCommitCallback } = require('./RenderState');
    const callback = getOnCommitCallback();
    if (callback) {
      callback();
    }
  };

  /** Style-like prop keys that should be applied to the node even when not under props.style */
  const STYLE_KEYS = [
    'color',
    'backgroundColor',
    'bold',
    'dim',
    'italic',
    'underline',
    'strikethrough',
    'inverse',
    'textAlign',
    'textTransform',
  ] as const;

  /**
   * Apply props to a node (style, content, href, etc.).
   * Single path for all nodes: Text, Link, Code, Button, etc. use setStyle (Stylable) so styling is consistent.
   * Used for both initial mount (createInstance) and updates (commitUpdate).
   * Merge order: props.style (or raw STYLE_KEYS) is merged with individual style props; individual props (e.g. backgroundColor="blue") override style object values when both present.
   */
  const applyPropsToNode = (instance: Node, newProps: Record<string, unknown>): void => {
    const extInstance = instance as unknown as RenderableNode;

    let styleToApply = newProps.style as ViewStyle | TextStyle | undefined;
    if (!styleToApply && extInstance.setStyle) {
      const rawStyle: Record<string, unknown> = {};
      for (const key of STYLE_KEYS) {
        if (key in newProps && newProps[key] !== undefined) {
          rawStyle[key] = newProps[key];
        }
      }
      if (Object.keys(rawStyle).length > 0) {
        styleToApply = rawStyle as ViewStyle | TextStyle;
      }
    }
    // Always merge raw style props (e.g. backgroundColor from <Code backgroundColor="blue">) into style so they are never dropped
    if (
      extInstance.setStyle &&
      (styleToApply || STYLE_KEYS.some((k) => k in newProps && newProps[k] !== undefined))
    ) {
      const merged: Record<string, unknown> = { ...(styleToApply as Record<string, unknown>) };
      for (const key of STYLE_KEYS) {
        if (key in newProps && newProps[key] !== undefined) {
          merged[key] = newProps[key];
        }
      }
      if (Object.keys(merged).length > 0) {
        extInstance.setStyle(merged as ViewStyle | TextStyle);
      }
    }
    if (
      'className' in newProps &&
      'setClassName' in extInstance &&
      typeof (extInstance as { setClassName(v: string | string[]): void }).setClassName ===
        'function'
    ) {
      (extInstance as { setClassName(v: string | string[]): void }).setClassName(
        newProps.className as string | string[]
      );
    }
    if ('onClick' in newProps) {
      extInstance.onClick = newProps.onClick as ((event: unknown) => void) | undefined;
    }
    if ('onPress' in newProps) {
      extInstance.onPress = newProps.onPress as ((event: unknown) => void) | undefined;
    }
    if ('onKeyDown' in newProps) {
      extInstance.onKeyDown = newProps.onKeyDown as ((event: unknown) => void) | undefined;
    }
    if ('onChange' in newProps) {
      extInstance.onChange = newProps.onChange as ((event: unknown) => void) | undefined;
    }
    if ('onFocus' in newProps) {
      extInstance.onFocus = newProps.onFocus as (() => void) | undefined;
    }
    if ('onBlur' in newProps) {
      extInstance.onBlur = newProps.onBlur as (() => void) | undefined;
    }
    if ('onSubmit' in newProps) {
      extInstance.onSubmit = newProps.onSubmit as ((event: unknown) => void) | undefined;
    }
    if ('disabled' in newProps) {
      extInstance.disabled = Boolean(newProps.disabled);
    }
    if ('tabIndex' in newProps) {
      extInstance.tabIndex = newProps.tabIndex as number | undefined;
    }
    if ('autoFocus' in newProps) {
      extInstance.autoFocus = Boolean(newProps.autoFocus);
    }
    if (newProps.children !== undefined && extInstance.setContent) {
      if (Array.isArray(newProps.children)) {
        const textParts = (newProps.children as unknown[])
          .filter((child: unknown) => typeof child === 'string' || typeof child === 'number')
          .map((child: unknown) => String(child));
        extInstance.setContent(textParts.join(''));
      } else if (typeof newProps.children === 'string' || typeof newProps.children === 'number') {
        extInstance.setContent(String(newProps.children));
      }
    }
    if (newProps.value !== undefined && extInstance.setValue) {
      extInstance.setValue(newProps.value);
    }
    if (
      typeof (newProps as { href?: string }).href === 'string' &&
      'setHref' in extInstance &&
      typeof (extInstance as { setHref: (url: string) => void }).setHref === 'function'
    ) {
      (extInstance as { setHref: (url: string) => void }).setHref(
        (newProps as { href: string }).href
      );
    }
    if ('label' in newProps && extInstance.setLabel) {
      extInstance.setLabel(newProps.label as string);
    }
  };

  const createInstance = (
    type: string | ((...args: unknown[]) => unknown),
    props: Record<string, unknown>,
    _rootContainerInstance: unknown,
    _hostContext: { x: number; y: number; width: number },
    _internalInstanceHandle: unknown
  ): Node => {
    // Handle different type formats
    let typeString: string;

    // Type for function components with optional displayName
    interface FunctionComponent {
      (...args: unknown[]): unknown;
      name?: string;
      displayName?: string;
    }
    // Type for React elements with type property
    interface ReactElementLike {
      type?: unknown;
      $$typeof?: symbol;
    }

    if (typeof type === 'string') {
      typeString = type;
    } else if (typeof type === 'function') {
      // Function component - try to get name, or default to Box
      const fn = type as FunctionComponent;
      typeString = fn.name || fn.displayName || 'Box';
    } else if (type && typeof type === 'object') {
      // Object type - could be React element or other object
      const elem = type as ReactElementLike;
      if ('type' in type) {
        // Has type property - could be React element
        const innerType = elem.type;
        if (typeof innerType === 'string') {
          typeString = innerType;
        } else if (typeof innerType === 'function') {
          const innerFn = innerType as FunctionComponent;
          typeString = innerFn.name || innerFn.displayName || 'Box';
        } else {
          typeString = 'Box';
        }
      } else if ('$$typeof' in type) {
        // React element with $$typeof - extract type
        const elementType = elem.type;
        if (typeof elementType === 'string') {
          typeString = elementType;
        } else if (typeof elementType === 'function') {
          const elemFn = elementType as FunctionComponent;
          typeString = elemFn.name || elemFn.displayName || 'Box';
        } else {
          typeString = 'Box';
        }
      } else {
        // Unknown object - default to Box
        typeString = 'Box';
      }
    } else {
      typeString = 'Box';
    }

    const element = {
      type: typeString,
      props: props as Record<string, unknown>,
    } as unknown as import('react').ReactElement;

    const node = NodeFactory.createNode(element);
    // Apply initial props (style, content, href, etc.) so new nodes get correct styling
    applyPropsToNode(node, props);
    debug('[hostConfig] createInstance', {
      type: typeString,
      id: props.id,
      disabled: props.disabled,
    });
    return node;
  };

  const createTextInstance = (
    text: string,
    _rootContainerInstance: Node,
    _hostContext: object,
    _internalInstanceHandle: unknown
  ): Node => {
    // Create a text instance that satisfies the Node interface requirement
    // but is handled specially in appendInitialChild
    const textInstance: TextInstance = { text, parentNode: null };
    return textInstance as unknown as Node;
  };

  /** Copy parent's inline style to a child TextNode when parent is Text/Link so string children get correct styling (underline, color, etc.) */
  const inheritParentTextStyle = (parent: Node, childNode: Node): void => {
    const parentType = parent.getNodeType?.();
    if (parentType !== 'text' && parentType !== 'link') return;
    const parentStyled = parent as unknown as { inlineStyle?: Record<string, unknown> };
    const childWithStyle = childNode as unknown as {
      setStyle?(style: Record<string, unknown>): void;
    };
    if (parentStyled.inlineStyle && typeof childWithStyle.setStyle === 'function') {
      childWithStyle.setStyle(parentStyled.inlineStyle);
    }
  };

  const appendInitialChild = (parentInstance: Node, child: Node | string | TextInstance): void => {
    // Handle TextInstance objects (raw text like {'Status: '})
    if (child && typeof child === 'object' && 'text' in child && 'parentNode' in child) {
      const textInstance = child as TextInstance;
      textInstance.parentNode = parentInstance;

      // Create a child TextNode to preserve ordering with siblings
      const textNode = NodeFactory.createNode(
        {
          type: 'Text',
          props: { children: textInstance.text },
        } as import('react').ReactElement,
        parentInstance
      );
      inheritParentTextStyle(parentInstance, textNode);
      parentInstance.appendChild(textNode);

      textInstance.childNode = textNode;
      return;
    }

    if (typeof child === 'string') {
      const textElement = {
        type: 'Text',
        props: { children: child },
      } as import('react').ReactElement;
      const textNode = NodeFactory.createNode(textElement, parentInstance);
      inheritParentTextStyle(parentInstance, textNode);
      parentInstance.appendChild(textNode);
    } else {
      // child is a Node
      const nodeChild = child as Node;
      nodeChild.parent = parentInstance;
      parentInstance.appendChild(nodeChild);
    }
  };

  const finalizeInitialChildren = (): boolean => false;

  const prepareUpdate = (
    _instance: Node,
    _type: string,
    _oldProps: Record<string, unknown>,
    _newProps: Record<string, unknown>,
    _rootContainerInstance: Node,
    _hostContext: object
  ): unknown[] | null => {
    // Log significant prop changes (disabled, label, etc.)
    if (_oldProps.disabled !== _newProps.disabled) {
      debug('[hostConfig] prepareUpdate: disabled changed', {
        type: _type,
        oldDisabled: _oldProps.disabled,
        newDisabled: _newProps.disabled,
      });
    }
    // Return update payload as array - react-reconciler expects unknown[]
    return [_oldProps, _newProps];
  };

  const shouldSetTextContent = (_type: string, _props: Record<string, unknown>): boolean => {
    return false;
  };

  const getCurrentEventPriority = (): number => DefaultEventPriority;

  const getCurrentUpdatePriority = (): number => currentUpdatePriority;

  const setCurrentUpdatePriority = (priority: number): void => {
    currentUpdatePriority = priority;
  };

  const resolveUpdatePriority = (): number => {
    if (currentUpdatePriority !== DefaultEventPriority) {
      return currentUpdatePriority;
    }
    return DefaultEventPriority;
  };

  const appendChild = (parentInstance: Node, child: Node | string): void => {
    appendInitialChild(parentInstance, child);
  };

  const appendChildToContainer = (container: Node, child: Node | string): void => {
    appendInitialChild(container, child);
  };

  const insertBefore = (
    parentInstance: Node,
    child: Node | string | TextInstance,
    beforeChild: Node | string
  ): void => {
    // Handle TextInstance objects (raw text like {'Status: '})
    if (child && typeof child === 'object' && 'text' in child && 'parentNode' in child) {
      const textInstance = child as TextInstance;
      textInstance.parentNode = parentInstance;

      const textNode = NodeFactory.createNode(
        {
          type: 'Text',
          props: { children: textInstance.text },
        } as import('react').ReactElement,
        parentInstance
      );
      inheritParentTextStyle(parentInstance, textNode);
      textInstance.childNode = textNode;

      const beforeIndex = parentInstance.children.indexOf(beforeChild as Node);
      if (beforeIndex >= 0) {
        parentInstance.children.splice(beforeIndex, 0, textNode);
      } else {
        parentInstance.appendChild(textNode);
      }
      return;
    }

    if (typeof child === 'string') {
      const textElement = {
        type: 'Text',
        props: { children: child },
      } as import('react').ReactElement;
      const textNode = NodeFactory.createNode(textElement, parentInstance);
      inheritParentTextStyle(parentInstance, textNode);
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
    container: Node,
    child: Node | string,
    beforeChild: Node | string
  ): void => {
    insertBefore(container, child, beforeChild);
  };

  const removeChild = (parentInstance: Node, child: Node | string | TextInstance): void => {
    // Handle TextInstance objects - remove the wrapper node referenced by childNode
    if (child && typeof child === 'object' && 'text' in child && 'parentNode' in child) {
      const textInstance = child as TextInstance;
      if (textInstance.childNode) {
        const index = parentInstance.children.indexOf(textInstance.childNode);
        if (index >= 0) {
          parentInstance.children.splice(index, 1);
          textInstance.childNode.parent = null;
        }
        textInstance.childNode = undefined;
      }
      textInstance.parentNode = null;
      return;
    }

    if (typeof child === 'string') {
      const index = parentInstance.children.findIndex((c) => c.content === child);
      if (index >= 0) {
        parentInstance.children.splice(index, 1);
      }
    } else {
      const index = parentInstance.children.indexOf(child as Node);
      if (index >= 0) {
        parentInstance.children.splice(index, 1);
        (child as Node).parent = null;
      }
    }
  };

  const removeChildFromContainer = (container: Node, child: Node | string): void => {
    removeChild(container, child);
  };

  const commitTextUpdate = (textInstance: Node, _oldText: string, newText: string): void => {
    // Cast to TextInstance for internal use
    const textInst = textInstance as unknown as TextInstance;
    // Update the text instance
    textInst.text = newText;

    // Update the child TextNode that was created in appendInitialChild
    // This ensures collectTextSegments() sees the updated text
    if (textInst.childNode && typeof textInst.childNode.setContent === 'function') {
      textInst.childNode.setContent(newText);
    } else if (textInst.parentNode && textInst.parentNode.type === 'text') {
      // Fallback: update parent's content if no child reference
      textInst.parentNode.setContent(newText);
    }
  };

  const commitUpdate = (
    instance: Node,
    updatePayload: unknown[],
    _type: string,
    _oldProps: Record<string, unknown>,
    newProps: Record<string, unknown>,
    _internalHandle: unknown
  ): void => {
    const extInstance = instance as unknown as RenderableNode;
    debug('[hostConfig] commitUpdate', {
      type: instance.type,
      id: extInstance.componentId,
      disabled: newProps.disabled,
      oldDisabled: _oldProps.disabled,
      updatePayload,
    });

    applyPropsToNode(instance, newProps);

    // Update ScrollView props (maxHeight, maxWidth, scrollTop, etc.)
    if ('maxHeight' in newProps) {
      (instance as unknown as { maxHeight: number | null }).maxHeight =
        newProps.maxHeight != null ? (newProps.maxHeight as number) : null;
    }
    if ('maxWidth' in newProps) {
      (instance as unknown as { maxWidth: number | null }).maxWidth =
        newProps.maxWidth != null ? (newProps.maxWidth as number) : null;
    }
    if ('scrollTop' in newProps) {
      (instance as unknown as { scrollTop: number }).scrollTop = newProps.scrollTop as number;
    }
    if ('scrollLeft' in newProps) {
      (instance as unknown as { scrollLeft: number }).scrollLeft = newProps.scrollLeft as number;
    }
    if ('horizontal' in newProps) {
      (instance as unknown as { horizontal: boolean }).horizontal = Boolean(newProps.horizontal);
    }
    if ('showsVerticalScrollIndicator' in newProps) {
      (
        instance as unknown as { showsVerticalScrollIndicator: boolean }
      ).showsVerticalScrollIndicator = Boolean(newProps.showsVerticalScrollIndicator);
    }
    if ('showsHorizontalScrollIndicator' in newProps) {
      (
        instance as unknown as { showsHorizontalScrollIndicator: boolean }
      ).showsHorizontalScrollIndicator = Boolean(newProps.showsHorizontalScrollIndicator);
    }
    if ('scrollbarStyle' in newProps && newProps.scrollbarStyle) {
      (instance as unknown as { scrollbarStyle: unknown }).scrollbarStyle = newProps.scrollbarStyle;
    }
    if ('onScroll' in newProps) {
      (instance as unknown as { onScroll: unknown }).onScroll = newProps.onScroll;
    }

    // Update state-specific styles for buttons
    if ('disabledStyle' in newProps) {
      extInstance.disabledStyle = newProps.disabledStyle as ViewStyle | TextStyle | undefined;
    }
    if ('focusedStyle' in newProps) {
      extInstance.focusedStyle = newProps.focusedStyle as ViewStyle | TextStyle | undefined;
    }
    if ('pressedStyle' in newProps) {
      extInstance.pressedStyle = newProps.pressedStyle as ViewStyle | TextStyle | undefined;
    }
    if ('hoveredStyle' in newProps) {
      extInstance.hoveredStyle = newProps.hoveredStyle as ViewStyle | TextStyle | undefined;
    }
  };

  const hideInstance = (): void => {};
  const hideTextInstance = (): void => {};
  const unhideInstance = (): void => {};
  const unhideTextInstance = (): void => {};

  const clearContainer = (container: Node): void => {
    container.children = [];
  };

  return {
    // Note: 'now' is not part of react-reconciler HostConfig, removed
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
    getCurrentUpdatePriority,
    setCurrentUpdatePriority,
    resolveUpdatePriority,
    // Wrap setTimeout/clearTimeout to handle Node.js Timeout type
    scheduleTimeout: (fn: (...args: unknown[]) => unknown, delay?: number) =>
      setTimeout(fn, delay) as unknown as number,
    cancelTimeout: (id: number) => clearTimeout(id as unknown as NodeJS.Timeout),
    noTimeout: -1,
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
    isPrimaryRenderer: true,
    // Required additional properties
    preparePortalMount: () => {},
    getInstanceFromNode: () => null,
    beforeActiveInstanceBlur: () => {},
    afterActiveInstanceBlur: () => {},
    prepareScopeUpdate: () => {},
    getInstanceFromScope: () => null,
    detachDeletedInstance: () => {},
    // React 19 / reconciler 0.31+ required methods
    maySuspendCommit: () => false,
    preloadInstance: () => true,
    startSuspendingCommit: () => {},
    suspendInstance: () => {},
    waitForCommitToBeReady: () => null,
    NotPendingTransition: null,
    // react-reconciler 0.33+ required methods
    trackSchedulerEvent: () => {},
    resolveEventType: () => null,
    resolveEventTimeStamp: () => -1.1,
    shouldAttemptEagerTransition: () => false,
    maySuspendCommitOnUpdate: () => false,
    maySuspendCommitInSyncRender: () => false,
    getSuspendedCommitReason: () => null,
    HostTransitionContext: null,
    resetFormInstance: () => {},
    bindToConsole: (
      _methodName: string,
      fn: (...args: unknown[]) => unknown,
      _errorCode: unknown
    ) => fn,
    supportsMicrotasks: true,
    scheduleMicrotask:
      typeof queueMicrotask === 'function' ? queueMicrotask : (fn: () => void) => setTimeout(fn, 0),
    supportsTestSelectors: false,
    commitMount: () => {},
    resetTextContent: () => {},
    requestPostPaintCallback: () => {},
  };
}
