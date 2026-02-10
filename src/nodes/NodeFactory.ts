/**
 * Node factory - creates node instances from React elements
 * Uses mixin composition for type-safe node creation
 */

import type { ReactElement } from 'react';
import { TextNode } from './primitives/TextNode';
import { BoxNode } from './primitives/BoxNode';
import { FragmentNode } from './primitives/FragmentNode';
import { TextInputNode } from './interactive/TextInputNode';
import { ButtonNode } from './interactive/ButtonNode';
import { ScrollViewNode } from './layout/ScrollViewNode';
import { CommandRouterNode } from '../cli/nodes/CommandRouterNode';
import { CommandNode } from '../cli/nodes/CommandNode';
import { RouteNode } from '../cli/nodes/RouteNode';
import { DefaultNode } from '../cli/nodes/DefaultNode';
import type { Node } from './base/Node';
import type { ViewStyle, TextStyle } from '../types';

// Extended node interface for interactive properties
interface ExtendedNodeProps {
  autoFocus?: boolean;
  tabIndex?: number;
  disabled?: boolean;
  onChange?: (event: unknown) => void;
  onSubmit?: (event: unknown) => void;
  onKeyDown?: (event: unknown) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onClick?: (event: unknown) => void;
  onKeyPress?: (event: unknown) => void;
  submitButtonId?: string;
  disabledStyle?: ViewStyle | TextStyle;
  focusedStyle?: ViewStyle | TextStyle;
  pressedStyle?: ViewStyle | TextStyle;
  hoveredStyle?: ViewStyle | TextStyle;
  setStyle?: (style: ViewStyle | TextStyle) => void;
  setClassName?: (className: string | string[]) => void;
  setOptions?: (options: unknown[]) => void;
  setValue?: (value: unknown) => void;
}

type ExtendedNode = Node & Partial<ExtendedNodeProps>;

/**
 * Node factory - creates node instances from React elements
 */
export class NodeFactory {
  /**
   * Create node from React element
   */
  static createNode(element: ReactElement, _parent?: Node): Node {
    const type = element.type;
    const props = element.props as Record<string, unknown>;

    // Normalize type to string
    let typeString: string;
    if (typeof type === 'string') {
      typeString = type;
    } else if (typeof type === 'function') {
      typeString = type.name || (type as { displayName?: string }).displayName || 'Box';
    } else if (type && typeof type === 'object' && 'type' in type) {
      // Nested element - extract inner type
      const innerType = (type as { type: unknown }).type;
      if (typeof innerType === 'string') {
        typeString = innerType;
      } else if (typeof innerType === 'function') {
        typeString =
          (innerType as { name?: string; displayName?: string }).name ||
          (innerType as { displayName?: string }).displayName ||
          'Box';
      } else {
        typeString = 'Box';
      }
    } else {
      // Fallback to Box for unknown types
      typeString = 'Box';
    }

    let node: Node;

    // Use TSX-friendly component names
    switch (typeString) {
      case 'text':
      case 'Text':
        node = new TextNode() as unknown as Node;
        // Only set content for simple string/number children
        // For arrays or React elements, let appendInitialChild handle them
        // This preserves nested Text styling (e.g., <Text>foo<Text style={...}>bar</Text></Text>)
        if (props.children !== undefined && props.children !== null) {
          if (typeof props.children === 'string' || typeof props.children === 'number') {
            node.setContent(String(props.children));
          }
          // Arrays and React element children are handled by appendInitialChild
          // which creates proper child nodes that TextNode.collectTextSegments() can gather
        }
        break;

      case 'view':
      case 'box':
      case 'View':
      case 'Box':
        node = new BoxNode() as unknown as Node;
        break;

      case 'fragment':
      case 'Fragment':
        node = new FragmentNode() as unknown as Node;
        break;

      case 'linebreak':
      case 'LineBreak':
        // LineBreak is just a text node with newline(s)
        node = new TextNode() as unknown as Node;
        const lineBreakCount =
          typeof props.count === 'number' && props.count > 0 ? Math.floor(props.count) : 1;
        node.setContent('\n'.repeat(lineBreakCount));
        break;

      case 'textinput':
      case 'TextInput':
      case 'input':
      case 'Input':
        const inputNode = new TextInputNode(typeof props.id === 'string' ? props.id : undefined);
        if (props.value !== undefined) {
          inputNode.setValue(String(props.value));
        }
        if (props.placeholder && typeof props.placeholder === 'string') {
          inputNode.setPlaceholder(props.placeholder);
        }
        if (props.maxLength && typeof props.maxLength === 'number') {
          inputNode.setMaxLength(props.maxLength);
        }
        if (props.multiline !== undefined) {
          inputNode.setMultiline(Boolean(props.multiline));
        }
        if (props.maxLines && typeof props.maxLines === 'number') {
          inputNode.setMaxLines(props.maxLines);
        }
        if (props.mask && typeof props.mask === 'string') {
          inputNode.setMask(props.mask);
        }
        if (props.type) {
          inputNode.setInputType(props.type === 'number' ? 'number' : 'text');
        }
        // Set focus-related props
        const extInputNode = inputNode as unknown as ExtendedNode;
        if (props.autoFocus !== undefined) {
          extInputNode.autoFocus = Boolean(props.autoFocus);
        }
        if (props.tabIndex !== undefined) {
          extInputNode.tabIndex = props.tabIndex as number;
        }
        if (props.disabled !== undefined) {
          extInputNode.disabled = Boolean(props.disabled);
        }
        // Set event handlers
        if (props.onChange) {
          extInputNode.onChange = props.onChange as (event: unknown) => void;
        }
        // React Native compatible: onChangeText
        if (props.onChangeText) {
          (extInputNode as unknown as { onChangeText: (text: string) => void }).onChangeText =
            props.onChangeText as (text: string) => void;
        }
        // React Native compatible: onSubmitEditing
        if (props.onSubmitEditing) {
          (
            extInputNode as unknown as { onSubmitEditing: (event: unknown) => void }
          ).onSubmitEditing = props.onSubmitEditing as (event: unknown) => void;
        }
        // React Native compatible: onEndEditing
        if (props.onEndEditing) {
          (extInputNode as unknown as { onEndEditing: (event: unknown) => void }).onEndEditing =
            props.onEndEditing as (event: unknown) => void;
        }
        if (props.onSubmit) {
          extInputNode.onSubmit = props.onSubmit as (event: unknown) => void;
        }
        if (props.onKeyDown) {
          extInputNode.onKeyDown = props.onKeyDown as (event: unknown) => void;
        }
        if (props.onFocus) {
          extInputNode.onFocus = props.onFocus as () => void;
        }
        if (props.onBlur) {
          extInputNode.onBlur = props.onBlur as () => void;
        }
        // Set submitButtonId for Enter key behavior
        if (props.submitButtonId) {
          extInputNode.submitButtonId = props.submitButtonId as string;
        }
        node = inputNode as unknown as Node;
        break;

      case 'button':
      case 'Button':
        const buttonNode = new ButtonNode(typeof props.id === 'string' ? props.id : undefined);
        if (props.label && typeof props.label === 'string') {
          buttonNode.setLabel(props.label);
        } else if (props.content) {
          buttonNode.setContent(String(props.content));
        } else if (props.children) {
          buttonNode.setContent(String(props.children));
        }
        // Set event handlers
        if (props.onClick) {
          buttonNode.onClick = props.onClick as (event: unknown) => void;
        }
        if (props.onPress) {
          buttonNode.onPress = props.onPress as (event: unknown) => void;
        }
        if (props.disabled !== undefined) {
          buttonNode.disabled = Boolean(props.disabled);
        }
        // Set focus-related props
        const extButtonNode = buttonNode as unknown as ExtendedNode;
        if (props.autoFocus !== undefined) {
          extButtonNode.autoFocus = Boolean(props.autoFocus);
        }
        if (props.tabIndex !== undefined) {
          extButtonNode.tabIndex = props.tabIndex as number;
        }
        if (props.onFocus) {
          extButtonNode.onFocus = props.onFocus as () => void;
        }
        if (props.onBlur) {
          extButtonNode.onBlur = props.onBlur as () => void;
        }
        // Set state-specific style overrides
        if (props.disabledStyle) {
          extButtonNode.disabledStyle = props.disabledStyle as ViewStyle | TextStyle;
        }
        if (props.focusedStyle) {
          extButtonNode.focusedStyle = props.focusedStyle as ViewStyle | TextStyle;
        }
        if (props.pressedStyle) {
          extButtonNode.pressedStyle = props.pressedStyle as ViewStyle | TextStyle;
        }
        if (props.hoveredStyle) {
          extButtonNode.hoveredStyle = props.hoveredStyle as ViewStyle | TextStyle;
        }
        // Set style if provided
        if (props.style) {
          buttonNode.setStyle(props.style as Record<string, unknown>);
        }
        node = buttonNode as unknown as Node;
        break;

      case 'scrollview':
      case 'ScrollView':
      case 'scrollable':
      case 'Scrollable':
        const scrollViewNode = new ScrollViewNode();
        if (props.scrollTop !== undefined) {
          scrollViewNode.scrollTop = props.scrollTop as number;
        }
        if (props.scrollLeft !== undefined) {
          scrollViewNode.scrollLeft = props.scrollLeft as number;
        }
        if (props.maxHeight !== undefined) {
          scrollViewNode.maxHeight = props.maxHeight as number;
        }
        if (props.maxWidth !== undefined) {
          scrollViewNode.maxWidth = props.maxWidth as number;
        }
        if (props.horizontal !== undefined) {
          scrollViewNode.horizontal = Boolean(props.horizontal);
        }
        if (props.showsVerticalScrollIndicator !== undefined) {
          scrollViewNode.showsVerticalScrollIndicator = Boolean(props.showsVerticalScrollIndicator);
        }
        if (props.showsHorizontalScrollIndicator !== undefined) {
          scrollViewNode.showsHorizontalScrollIndicator = Boolean(
            props.showsHorizontalScrollIndicator
          );
        }
        if (props.scrollbarStyle) {
          scrollViewNode.scrollbarStyle = props.scrollbarStyle as {
            width?: number;
            trackChar?: string;
            thumbChar?: string;
            trackColor?: string;
            thumbColor?: string;
          };
        }
        if (props.scrollStep !== undefined) {
          scrollViewNode.scrollStep = props.scrollStep as number;
        }
        if (props.keyboardScrollEnabled !== undefined) {
          scrollViewNode.keyboardScrollEnabled = Boolean(props.keyboardScrollEnabled);
        }
        if (props.autoScrollToBottom !== undefined) {
          scrollViewNode.autoScrollToBottom = Boolean(props.autoScrollToBottom);
        }
        if (props.onScroll) {
          scrollViewNode.onScroll = props.onScroll as (
            scrollTop: number,
            scrollLeft: number
          ) => void;
        }
        if (props.style) {
          scrollViewNode.setStyle(props.style as Record<string, unknown>);
        }
        node = scrollViewNode as unknown as Node;
        break;

      case 'commandrouter':
      case 'CommandRouter':
        node = new CommandRouterNode(props as Record<string, unknown>) as unknown as Node;
        break;

      case 'command':
      case 'Command':
        node = new CommandNode(props as Record<string, unknown>) as unknown as Node;
        break;

      case 'route':
      case 'Route':
        node = new RouteNode(props as Record<string, unknown>) as unknown as Node;
        break;

      case 'default':
      case 'Default':
        node = new DefaultNode(props as Record<string, unknown>) as unknown as Node;
        break;

      case 'radio':
      case 'Radio':
        const { RadioNode } = require('./selection/RadioNode');
        const radioNode = new RadioNode(props.id);
        if (props.options) {
          radioNode.setOptions(props.options);
        }
        if (props.value !== undefined) {
          radioNode.setValue(props.value);
        }
        // Set focus-related props
        if (props.autoFocus !== undefined) {
          radioNode.autoFocus = Boolean(props.autoFocus);
        }
        if (props.tabIndex !== undefined) {
          radioNode.tabIndex = props.tabIndex;
        }
        if (props.disabled !== undefined) {
          radioNode.disabled = Boolean(props.disabled);
        }
        // Set event handlers
        if (props.onChange) {
          radioNode.onChange = props.onChange;
        }
        if (props.onFocus) {
          radioNode.onFocus = props.onFocus;
        }
        if (props.onBlur) {
          radioNode.onBlur = props.onBlur;
        }
        // Set display props
        if (props.formatDisplay) {
          radioNode.formatDisplay = props.formatDisplay;
        }
        if (props.displayFormat) {
          radioNode.displayFormat = props.displayFormat;
        }
        // Set indicator characters (customizable)
        if (props.selectedIndicator) {
          radioNode.selectedIndicator = props.selectedIndicator;
        }
        if (props.unselectedIndicator) {
          radioNode.unselectedIndicator = props.unselectedIndicator;
        }
        // Set style if provided
        if (props.style) {
          radioNode.setStyle(props.style as ViewStyle | TextStyle);
        }
        node = radioNode as unknown as Node;
        break;

      case 'checkbox':
      case 'Checkbox':
        const { CheckboxNode } = require('./selection/CheckboxNode');
        const checkboxNode = new CheckboxNode(props.id as string | undefined);
        if (props.options) {
          checkboxNode.setOptions(props.options);
        }
        if (props.value !== undefined) {
          checkboxNode.setValue(props.value);
        }
        // Set focus-related props
        if (props.autoFocus !== undefined) {
          checkboxNode.autoFocus = Boolean(props.autoFocus);
        }
        if (props.tabIndex !== undefined) {
          checkboxNode.tabIndex = props.tabIndex;
        }
        if (props.disabled !== undefined) {
          checkboxNode.disabled = Boolean(props.disabled);
        }
        // Set event handlers
        if (props.onChange) {
          checkboxNode.onChange = props.onChange;
        }
        if (props.onFocus) {
          checkboxNode.onFocus = props.onFocus;
        }
        if (props.onBlur) {
          checkboxNode.onBlur = props.onBlur;
        }
        // Set display props
        if (props.formatDisplay) {
          checkboxNode.formatDisplay = props.formatDisplay;
        }
        if (props.displayFormat) {
          checkboxNode.displayFormat = props.displayFormat;
        }
        // Set indicator characters (customizable)
        if (props.checkedIndicator) {
          checkboxNode.checkedIndicator = props.checkedIndicator;
        }
        if (props.uncheckedIndicator) {
          checkboxNode.uncheckedIndicator = props.uncheckedIndicator;
        }
        // Set style if provided
        if (props.style) {
          checkboxNode.setStyle(props.style as ViewStyle | TextStyle);
        }
        node = checkboxNode as unknown as Node;
        break;

      case 'dropdown':
      case 'Dropdown':
        const { DropdownNode } = require('./selection/DropdownNode');
        const dropdownNode = new DropdownNode(props.id as string | undefined);
        if (props.options) {
          dropdownNode.setOptions(props.options);
        }
        if (props.value !== undefined) {
          dropdownNode.setValue(props.value);
        }
        // Set dropdown-specific props
        if (props.placeholder) {
          dropdownNode.placeholder = props.placeholder;
        }
        // Set focus-related props
        if (props.autoFocus !== undefined) {
          dropdownNode.autoFocus = Boolean(props.autoFocus);
        }
        if (props.tabIndex !== undefined) {
          dropdownNode.tabIndex = props.tabIndex;
        }
        if (props.disabled !== undefined) {
          dropdownNode.disabled = Boolean(props.disabled);
        }
        // Set event handlers
        if (props.onChange) {
          dropdownNode.onChange = props.onChange;
        }
        if (props.onFocus) {
          dropdownNode.onFocus = props.onFocus;
        }
        if (props.onBlur) {
          dropdownNode.onBlur = props.onBlur;
        }
        // Set display props
        if (props.formatDisplay) {
          dropdownNode.formatDisplay = props.formatDisplay;
        }
        if (props.displayFormat) {
          dropdownNode.displayFormat = props.displayFormat;
        }
        // Set dropdown-specific styling props
        if (props.dropdownHeight !== undefined) {
          dropdownNode.dropdownHeight = props.dropdownHeight;
        }
        if (props.dropdownPosition) {
          dropdownNode.dropdownPosition = props.dropdownPosition;
        }
        // Set style if provided
        if (props.style) {
          dropdownNode.setStyle(props.style as ViewStyle | TextStyle);
        }
        node = dropdownNode as unknown as Node;
        break;

      case 'list':
      case 'List':
        const { ListNode } = require('./selection/ListNode');
        node = new ListNode() as unknown as Node;
        const extListNode = node as ExtendedNode;
        if (props.options) {
          extListNode.setOptions?.(props.options as unknown[]);
        }
        if (props.value !== undefined) {
          extListNode.setValue?.(props.value);
        }
        break;

      case 'modal':
      case 'Modal':
      case 'overlay':
      case 'Overlay':
        // Modal/Overlay uses BoxNode with z-index layering
        const modalNode = new BoxNode() as unknown as Node;
        // Set z-index for layering
        if (props.zIndex !== undefined) {
          (modalNode as unknown as { zIndex: number }).zIndex = props.zIndex as number;
        }
        // Set backdrop props
        if (props.backdrop !== undefined) {
          (modalNode as unknown as { backdrop: boolean }).backdrop = Boolean(props.backdrop);
        }
        if (props.backdropColor) {
          (modalNode as unknown as { backdropColor: string }).backdropColor =
            props.backdropColor as string;
        }
        // React Native modal props
        if (props.onRequestClose) {
          (modalNode as unknown as { onRequestClose: () => void }).onRequestClose =
            props.onRequestClose as () => void;
        }
        if (props.onShow) {
          (modalNode as unknown as { onShow: () => void }).onShow = props.onShow as () => void;
        }
        if (props.onDismiss) {
          (modalNode as unknown as { onDismiss: () => void }).onDismiss =
            props.onDismiss as () => void;
        }
        // Set style if provided
        if (props.style) {
          (modalNode as ExtendedNode).setStyle?.(props.style as ViewStyle | TextStyle);
        }
        node = modalNode;
        break;

      default:
        // Default to BoxNode for unknown types
        // This handles custom components and unknown types gracefully
        node = new BoxNode() as unknown as Node;
    }

    // Apply props using TSX-friendly APIs
    const extNode = node as ExtendedNode;
    if (props.style && 'setStyle' in node) {
      extNode.setStyle?.(props.style as ViewStyle | TextStyle);
    }

    if (props.className && 'setClassName' in node) {
      extNode.setClassName?.(props.className as string | string[]);
    }

    // Add event handlers
    if (props.onClick && 'onClick' in node) {
      extNode.onClick = props.onClick as (event: unknown) => void;
    }
    if (props.onKeyDown && 'onKeyDown' in node) {
      extNode.onKeyDown = props.onKeyDown as (event: unknown) => void;
    }
    if (props.onKeyPress && 'onKeyPress' in node) {
      extNode.onKeyPress = props.onKeyPress as (event: unknown) => void;
    }
    if (props.onChange && 'onChange' in node) {
      extNode.onChange = props.onChange as (event: unknown) => void;
    }
    if (props.onFocus && 'onFocus' in node) {
      extNode.onFocus = props.onFocus as () => void;
    }
    if (props.onBlur && 'onBlur' in node) {
      extNode.onBlur = props.onBlur as () => void;
    }

    // NOTE: Children are NOT added here - React's reconciler handles child addition
    // via appendChild/appendInitialChild. Adding them here would cause duplication.
    // TextNode content is set above from props.children, but children nodes are
    // added by the reconciler.

    return node;
  }
}
