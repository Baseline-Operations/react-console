# Architectural Redesign: Detailed Technical Specification

## Overview

This document provides detailed technical specifications for the class-based node system redesign with type-safe mixin-based styling. All nodes inherit from a unified base class that includes the complete box model (dimensions, positioning, padding, margin, border), and styling is provided through composable, type-safe mixins using TypeScript generics.

## Core Design Principles

1. **Unified Base Class**: All nodes inherit from `Node` with complete box model support
2. **Type-Safe Mixins**: Styling and capabilities provided through composable, type-safe mixins using generics
3. **Base Classes for Concerns**: Separate base classes/mixins for different concerns (Stylable, Renderable, Layoutable)
4. **Box Model for All**: Every node has dimensions, positioning, padding, margin, and border
5. **Style Cascade**: Automatic style inheritance through mixin chain
6. **Computed Styles**: Styles computed from multiple sources (default, theme, class, inherited, inline)
7. **Component Tree Tracking**: Track component instances in a tree (like React's fiber tree)
8. **Rendering Tree**: Track what's actually in the buffer for each component
9. **Stacking Context**: Proper z-index and stacking context management (like CSS)
10. **Viewport/Clipping**: Track viewport and clipping areas for scrollable containers
11. **React Native Style API**: Full support for React Native-style components and StyleSheet API
12. **CommandRouter Integration**: Seamless integration with CLI command/router system
13. **Keyboard/Mouse Input**: Built-in support for keyboard and mouse event handling
14. **TSX-First**: Use TSX syntax throughout for component definitions and usage
15. **Example Compatibility**: All existing examples must continue to work

## Type Definitions

### Enums (as const)

```typescript
/**
 * Position enum - CSS-like positioning
 */
export const Position = {
  RELATIVE: 'relative',
  ABSOLUTE: 'absolute',
  FIXED: 'fixed',
  STICKY: 'sticky',
} as const;

export type Position = typeof Position[keyof typeof Position];

/**
 * Display mode enum - Layout display modes
 */
export const DisplayMode = {
  BLOCK: 'block',
  FLEX: 'flex',
  GRID: 'grid',
  NONE: 'none',
} as const;

export type DisplayMode = typeof DisplayMode[keyof typeof DisplayMode];

/**
 * Border style enum - Border rendering styles
 */
export const BorderStyle = {
  SINGLE: 'single',
  DOUBLE: 'double',
  THICK: 'thick',
  DASHED: 'dashed',
  DOTTED: 'dotted',
} as const;

export type BorderStyle = typeof BorderStyle[keyof typeof BorderStyle];

/**
 * Text align enum - Text alignment options
 */
export const TextAlign = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
  JUSTIFY: 'justify',
} as const;

export type TextAlign = typeof TextAlign[keyof typeof TextAlign];

/**
 * Overflow enum - Overflow handling
 */
export const Overflow = {
  VISIBLE: 'visible',
  HIDDEN: 'hidden',
  SCROLL: 'scroll',
} as const;

export type Overflow = typeof Overflow[keyof typeof Overflow];

/**
 * Flex direction enum - Flexbox direction
 */
export const FlexDirection = {
  ROW: 'row',
  COLUMN: 'column',
  ROW_REVERSE: 'row-reverse',
  COLUMN_REVERSE: 'column-reverse',
} as const;

export type FlexDirection = typeof FlexDirection[keyof typeof FlexDirection];

/**
 * Justify content enum - Flexbox/Grid justify content
 */
export const JustifyContent = {
  FLEX_START: 'flex-start',
  FLEX_END: 'flex-end',
  CENTER: 'center',
  SPACE_BETWEEN: 'space-between',
  SPACE_AROUND: 'space-around',
  SPACE_EVENLY: 'space-evenly',
} as const;

export type JustifyContent = typeof JustifyContent[keyof typeof JustifyContent];

/**
 * Align items enum - Flexbox/Grid align items
 */
export const AlignItems = {
  FLEX_START: 'flex-start',
  FLEX_END: 'flex-end',
  CENTER: 'center',
  BASELINE: 'baseline',
  STRETCH: 'stretch',
} as const;

export type AlignItems = typeof AlignItems[keyof typeof AlignItems];

/**
 * Mouse button enum - Mouse button types
 */
export const MouseButton = {
  LEFT: 'left',
  RIGHT: 'right',
  MIDDLE: 'middle',
  WHEEL: 'wheel',
} as const;

export type MouseButton = typeof MouseButton[keyof typeof MouseButton];

/**
 * Mouse action enum - Mouse action types
 */
export const MouseAction = {
  PRESS: 'press',
  RELEASE: 'release',
  MOVE: 'move',
  WHEEL: 'wheel',
} as const;

export type MouseAction = typeof MouseAction[keyof typeof MouseAction];
```

### Core Types

```typescript
/**
 * Base constructor type for mixins
 */
type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * Margin definition - Spacing outside the border
 */
interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Padding definition - Spacing inside the border
 */
interface Padding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Border width definition - Width of each border side
 */
interface BorderWidth {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Border show definition - Which borders to display
 * Can be true for all sides, or an object specifying individual sides
 */
type BorderShow = 
  | true  // Show all borders
  | {
      top?: boolean;
      right?: boolean;
      bottom?: boolean;
      left?: boolean;
    };

/**
 * Border configuration - Simplified border settings
 * border can be true (all sides) or an object specifying which sides
 * Other border properties are defined separately
 */
interface BorderConfig {
  border?: BorderShow;
  borderWidth?: number | BorderWidth;
  borderStyle?: BorderStyle;
  borderColor?: string | null;
  borderBackgroundColor?: string | null;
}

/**
 * Border information - Internal border representation
 */
interface BorderInfo {
  show: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  width: BorderWidth;
  style: BorderStyle;
  color: string | null;
  backgroundColor: string | null;
}

/**
 * Bounding box - Rectangle with position and size
 */
interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Dimensions - Size information including content dimensions
 */
interface Dimensions {
  width: number;
  height: number;
  contentWidth: number;
  contentHeight: number;
}

/**
 * Content area - Position and size of content area (inside padding)
 */
interface ContentArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Style map - Generic style object
 */
type StyleMap = Record<string, any>;

/**
 * Color type - String color name or hex code
 */
type Color = string;

/**
 * Spacing value - Number or object with individual sides
 */
type Spacing = number | { top?: number; right?: number; bottom?: number; left?: number };

/**
 * Size value - Number, percentage string, or 'auto'
 */
type Size = number | string | 'auto';

/**
 * Responsive size - Number or percentage string
 */
type ResponsiveSize = number | string;
```

## Core Base Class

### Node (Abstract Base Class)

```typescript
/**
 * Core base class for all nodes
 * Contains only essential functionality: identity, tree structure, box model
 */
abstract class Node {
  // Identity
  readonly id: string;
  readonly type: string;
  parent: Node | null = null;
  children: Node[] = [];
  
  // Box Model (ALL nodes have this)
  // Dimensions
  width: number | null = null;
  height: number | null = null;
  minWidth: number = 0;
  maxWidth: number | null = null;
  minHeight: number = 0;
  maxHeight: number | null = null;
  
  // Positioning
  position: Position = Position.RELATIVE;
  top: number | string | null = null;
  left: number | string | null = null;
  right: number | string | null = null;
  bottom: number | string | null = null;
  zIndex: number = 0;
  
  // Box Model
  margin: Margin = { top: 0, right: 0, bottom: 0, left: 0 };
  border: BorderInfo = {
    show: { top: false, right: false, bottom: false, left: false },
    width: { top: 0, right: 0, bottom: 0, left: 0 },
    style: BorderStyle.SINGLE,
    color: null,
    backgroundColor: null,
  };
  padding: Padding = { top: 0, right: 0, bottom: 0, left: 0 };
  
  // Computed Box Model
  contentArea: ContentArea | null = null;
  bounds: BoundingBox | null = null;
  borderBounds: BoundingBox | null = null;
  marginBounds: BoundingBox | null = null;
  
  // State
  state: NodeState = {
    mounted: false,
    visible: true,
    enabled: true,
  };
  
  // Content
  content: string | null = null;
  
  // Component Tree Tracking
  componentInstance: ComponentInstance | null = null;
  
  // Rendering Tree Tracking
  renderingInfo: RenderingInfo | null = null;
  
  // Stacking Context
  stackingContext: StackingContext | null = null;
  createsStackingContext: boolean = false;
  
  // Viewport/Clipping
  viewport: Viewport | null = null;
  clippingArea: BoundingBox | null = null;
  
  constructor(id?: string) {
    this.id = id || generateId();
    this.type = this.getNodeType();
    this.componentInstance = ComponentTree.createInstance(this);
  }
  
  // Abstract methods
  abstract getNodeType(): string;
  
  // Lifecycle hooks
  protected onMount(): void {
    this.state.mounted = true;
  }
  
  protected onUpdate(): void {
    // Mark for update
  }
  
  protected onUnmount(): void {
    this.state.mounted = false;
  }
  
  // Box Model Methods
  calculateContentArea(): ContentArea {
    if (!this.bounds) {
      throw new Error('Node not laid out');
    }
    
    const borderWidth = this.border.width;
    
    return {
      x: this.bounds.x + borderWidth.left + this.padding.left,
      y: this.bounds.y + borderWidth.top + this.padding.top,
      width: this.bounds.width - borderWidth.left - borderWidth.right - this.padding.left - this.padding.right,
      height: this.bounds.height - borderWidth.top - borderWidth.bottom - this.padding.top - this.padding.bottom,
    };
  }
  
  getContentArea(): ContentArea {
    if (!this.contentArea) {
      this.contentArea = this.calculateContentArea();
    }
    return this.contentArea;
  }
  
  getBounds(): BoundingBox {
    if (!this.bounds) {
      throw new Error('Node not laid out');
    }
    return this.bounds;
  }
  
  calculateBorderBounds(): BoundingBox {
    if (!this.bounds) {
      throw new Error('Node not laid out');
    }
    return { ...this.bounds };
  }
  
  calculateMarginBounds(): BoundingBox {
    if (!this.bounds) {
      throw new Error('Node not laid out');
    }
    return {
      x: this.bounds.x - this.margin.left,
      y: this.bounds.y - this.margin.top,
      width: this.bounds.width + this.margin.left + this.margin.right,
      height: this.bounds.height + this.margin.top + this.margin.bottom,
    };
  }
  
  // Positioning Methods
  calculatePosition(
    parentX: number,
    parentY: number,
    parentWidth: number,
    parentHeight: number,
    terminalDims: TerminalDimensions
  ): { x: number; y: number } {
    let x = parentX;
    let y = parentY;
    
    if (this.position === Position.RELATIVE) {
      x += this.margin.left;
      y += this.margin.top;
    }
    
    if (this.position === Position.ABSOLUTE || this.position === Position.FIXED) {
      const referenceWidth = this.position === Position.FIXED ? terminalDims.columns : parentWidth;
      const referenceHeight = this.position === Position.FIXED ? terminalDims.rows : parentHeight;
      
      if (this.left !== null) {
        x = typeof this.left === 'number' 
          ? this.left 
          : resolveSize(this.left, 'width', referenceWidth) || 0;
      } else if (this.right !== null) {
        const right = typeof this.right === 'number'
          ? this.right
          : resolveSize(this.right, 'width', referenceWidth) || 0;
        x = referenceWidth - right;
      }
      
      if (this.top !== null) {
        y = typeof this.top === 'number'
          ? this.top
          : resolveSize(this.top, 'height', referenceHeight) || 0;
      } else if (this.bottom !== null) {
        const bottom = typeof this.bottom === 'number'
          ? this.bottom
          : resolveSize(this.bottom, 'height', referenceHeight) || 0;
        y = referenceHeight - bottom;
      }
    } else if (this.position === Position.STICKY) {
      // Sticky positioning logic
      // ...
    } else {
      if (this.left !== null) {
        const left = typeof this.left === 'number'
          ? this.left
          : resolveSize(this.left, 'width', terminalDims.columns) || 0;
        x = parentX + left;
      }
      
      if (this.top !== null) {
        const top = typeof this.top === 'number'
          ? this.top
          : resolveSize(this.top, 'height', terminalDims.rows) || 0;
        y = parentY + top;
      }
    }
    
    return { x, y };
  }
  
  // Tree Methods
  appendChild(child: Node): void {
    if (child.parent) {
      child.parent.removeChild(child);
    }
    child.parent = this;
    this.children.push(child);
    child.onMount();
    this.onUpdate();
  }
  
  removeChild(child: Node): void {
    const index = this.children.indexOf(child);
    if (index >= 0) {
      this.children.splice(index, 1);
      child.parent = null;
      child.onUnmount();
      this.onUpdate();
    }
  }
  
  getAncestors(): Node[] {
    const ancestors: Node[] = [];
    let current: Node | null = this.parent;
    while (current) {
      ancestors.push(current);
      current = current.parent;
    }
    return ancestors;
  }
  
  getDescendants(): Node[] {
    const descendants: Node[] = [];
    for (const child of this.children) {
      descendants.push(child);
      descendants.push(...child.getDescendants());
    }
    return descendants;
  }
  
  setContent(content: string | null): void {
    this.content = content;
    this.onUpdate();
  }
}
```

## Type-Safe Mixins

### Stylable Mixin

```typescript
/**
 * Mixin that adds styling capabilities to a node
 * Type-safe using generics
 */
function Stylable<TBase extends Constructor<Node>>(Base: TBase) {
  return class StylableNode extends Base {
    // Style System
    inlineStyle: StyleMap = {};
    className: string[] = [];
    computedStyle: ComputedStyle | null = null;
    styleDirty: boolean = true;
    appliedStyleMixins: Set<string> = new Set();
    theme: Theme | null = null;
    
    /**
     * Compute final style from all sources (cascade)
     * Order: Default -> Theme -> Style Mixin -> Class -> Inherited -> Inline
     */
    computeStyle(): ComputedStyle {
      if (!this.styleDirty && this.computedStyle) {
        return this.computedStyle;
      }
      
      const resolver = new StyleResolver();
      const parentStyle = this.parent && 'computeStyle' in this.parent 
        ? (this.parent as StylableNode).computeStyle() 
        : undefined;
      
      this.computedStyle = resolver.resolve(
        this,
        this.getDefaultStyle(),
        this.theme,
        Array.from(this.appliedStyleMixins),
        this.className,
        this.inlineStyle,
        parentStyle
      );
      
      this.styleDirty = false;
      return this.computedStyle;
    }
    
    /**
     * Apply inline style (highest priority)
     */
    setStyle(style: StyleMap): void {
      this.inlineStyle = { ...this.inlineStyle, ...style };
      this.updateBoxModelFromStyle(style);
      this.onUpdate();
      this.markChildrenStyleDirty();
    }
    
    /**
     * Set class names for style resolution
     */
    setClassName(className: string | string[]): void {
      this.className = Array.isArray(className) ? className : [className];
      this.onUpdate();
      this.markChildrenStyleDirty();
    }
    
    /**
     * Set theme for style resolution
     */
    setTheme(theme: Theme): void {
      this.theme = theme;
      this.onUpdate();
      this.markChildrenStyleDirty();
    }
    
    /**
     * Apply style mixin
     */
    applyStyleMixin(mixinName: string): void {
      if (this.appliedStyleMixins.has(mixinName)) {
        return;
      }
      
      const mixin = StyleMixinRegistry.get(mixinName);
      if (mixin && mixin.appliesTo(this)) {
        mixin.apply(this);
        this.appliedStyleMixins.add(mixinName);
      }
    }
    
    /**
     * Update box model properties from style
     */
    protected updateBoxModelFromStyle(style: StyleMap): void {
      if (style.margin !== undefined) {
        this.margin = this.normalizeSpacing(style.margin);
      }
      
      if (style.padding !== undefined) {
        this.padding = this.normalizeSpacing(style.padding);
      }
      
      if (style.border !== undefined) {
        this.border = this.normalizeBorder(style);
      }
      
      if (style.width !== undefined) {
        this.width = typeof style.width === 'number' ? style.width : null;
      }
      if (style.height !== undefined) {
        this.height = typeof style.height === 'number' ? style.height : null;
      }
      
      if (style.position !== undefined) {
        this.position = style.position;
      }
      if (style.top !== undefined) this.top = style.top;
      if (style.left !== undefined) this.left = style.left;
      if (style.right !== undefined) this.right = style.right;
      if (style.bottom !== undefined) this.bottom = style.bottom;
      if (style.zIndex !== undefined) this.zIndex = style.zIndex;
    }
    
    protected normalizeSpacing(spacing: number | Margin | Padding): Margin | Padding {
      if (typeof spacing === 'number') {
        return { top: spacing, right: spacing, bottom: spacing, left: spacing };
      }
      return {
        top: spacing.top ?? 0,
        right: spacing.right ?? 0,
        bottom: spacing.bottom ?? 0,
        left: spacing.left ?? 0,
      };
    }
    
    protected normalizeBorder(style: StyleMap): BorderInfo {
      const border = style.border;
      const borderWidth = style.borderWidth;
      const borderStyle = (style.borderStyle as BorderStyle) || BorderStyle.SINGLE;
      const borderColor = style.borderColor || null;
      const borderBackgroundColor = style.borderBackgroundColor || null;
      
      // Handle border show: true for all sides, or object with individual sides
      let show = { top: false, right: false, bottom: false, left: false };
      if (border === true) {
        // border: true means show all borders
        show = { top: true, right: true, bottom: true, left: true };
      } else if (typeof border === 'object' && border !== null) {
        // border: { top: true, right: true, ... } for individual sides
        show = {
          top: border.top ?? false,
          right: border.right ?? false,
          bottom: border.bottom ?? false,
          left: border.left ?? false,
        };
      }
      
      // Handle border width: number for all sides, or object with individual sides
      let width: BorderWidth = { top: 0, right: 0, bottom: 0, left: 0 };
      if (borderWidth !== undefined) {
        if (typeof borderWidth === 'number') {
          // borderWidth: 1 means all sides have width 1
          width = { top: borderWidth, right: borderWidth, bottom: borderWidth, left: borderWidth };
        } else if (typeof borderWidth === 'object' && borderWidth !== null) {
          // borderWidth: { top: 1, right: 1, ... } for individual sides
          width = {
            top: borderWidth.top ?? 0,
            right: borderWidth.right ?? 0,
            bottom: borderWidth.bottom ?? 0,
            left: borderWidth.left ?? 0,
          };
        }
      } else if (show.top || show.right || show.bottom || show.left) {
        // Default width is 1 if border is enabled but width not specified
        width = { top: 1, right: 1, bottom: 1, left: 1 };
      }
      
      return { show, width, style: borderStyle, color: borderColor, backgroundColor: borderBackgroundColor };
    }
    
    protected markChildrenStyleDirty(): void {
      for (const child of this.children) {
        if ('styleDirty' in child) {
          (child as StylableNode).styleDirty = true;
          (child as StylableNode).markChildrenStyleDirty();
        }
      }
    }
    
    // Abstract method (must be implemented by classes using this mixin)
    abstract getDefaultStyle(): StyleMap;
  };
}
```

### Renderable Mixin

```typescript
/**
 * Mixin that adds rendering capabilities to a node
 * Type-safe using generics
 */
function Renderable<TBase extends Constructor<Node>>(Base: TBase) {
  return class RenderableNode extends Base {
    // Rendering state
    renderingInfo: RenderingInfo | null = null;
    renderDirty: boolean = true;
    
    /**
     * Render node to buffer
     */
    abstract render(buffer: OutputBuffer, context: RenderContext): RenderResult;
    
    /**
     * Render background (called before children)
     */
    protected renderBackground(
      buffer: OutputBuffer,
      style: ComputedStyle,
      context: RenderContext
    ): void {
      const bgColor = style.getBackgroundColor();
      if (!bgColor) return;
      
      const bgColorCode = getBackgroundColorCode(bgColor);
      if (!bgColorCode) return;
      
      const bounds = this.getBounds();
      
      for (let lineY = bounds.y; lineY < bounds.y + bounds.height; lineY++) {
        while (buffer.lines.length <= lineY) {
          buffer.lines.push('');
        }
        const line = buffer.lines[lineY] || '';
        const before = padToVisibleColumn(substringToVisibleColumn(line, bounds.x), bounds.x);
        const after = substringFromVisibleColumn(line, bounds.x + bounds.width);
        const background = bgColorCode + ' '.repeat(bounds.width) + '\x1b[0m';
        buffer.lines[lineY] = before + background + after;
      }
    }
    
    /**
     * Render border (called after children)
     */
    protected renderBorder(
      buffer: OutputBuffer,
      style: ComputedStyle,
      context: RenderContext
    ): void {
      if (!this.border.show.top && !this.border.show.right && 
          !this.border.show.bottom && !this.border.show.left) {
        return;
      }
      
      const borderColor = this.border.color || style.getBorderColor();
      const borderBgColor = this.border.backgroundColor || style.getBorderBackgroundColor() || style.getBackgroundColor();
      
      renderBorders(
        buffer,
        this.getBounds(),
        this.border,
        borderColor,
        borderBgColor
      );
    }
    
    /**
     * Register rendering info after rendering
     */
    protected registerRendering(
      bufferRegion: BufferRegion,
      zIndex: number,
      viewport: Viewport | null
    ): void {
      const renderingInfo: RenderingInfo = {
        component: this,
        bufferRegion,
        children: [],
        zIndex,
        stackingContext: this.stackingContext,
        viewport,
        clipped: viewport ? !viewport.intersects(this.getBounds()) : false,
        visible: this.state.visible,
      };
      
      this.renderingInfo = renderingInfo;
      RenderingTreeRegistry.get().register(renderingInfo);
      
      if (this.componentInstance) {
        this.componentInstance.renderingInfo = renderingInfo;
        this.componentInstance.rendered = true;
      }
    }
  };
}
```

### Layoutable Mixin

```typescript
/**
 * Mixin that adds layout capabilities to a node
 * Type-safe using generics
 */
function Layoutable<TBase extends Constructor<Node>>(Base: TBase) {
  return class LayoutableNode extends Base {
    // Layout state
    layoutDirty: boolean = true;
    display: DisplayMode = 'block';
    
    /**
     * Compute layout for this node
     */
    abstract computeLayout(constraints: LayoutConstraints): LayoutResult;
    
    /**
     * Layout children (called by computeLayout)
     */
    protected layoutChildren(constraints: LayoutConstraints): void {
      // Default: no layout (override in subclasses)
    }
    
    /**
     * Measure node dimensions
     */
    measure(constraints: LayoutConstraints): Dimensions {
      const layout = this.computeLayout(constraints);
      return layout.dimensions;
    }
    
    /**
     * Update stacking context
     */
    protected updateStackingContext(): void {
      if (!('computeStyle' in this)) {
        return;
      }
      
      const style = (this as any as StylableNode).computeStyle();
      this.createsStackingContext = StackingContext.createsStackingContext(this, style);
      
      if (this.createsStackingContext) {
        const manager = StackingContextManager.get();
        this.stackingContext = manager.getContext(this, style);
      } else if (this.parent) {
        this.stackingContext = this.parent.stackingContext;
      }
    }
    
    /**
     * Update viewport
     */
    protected updateViewport(): void {
      const bounds = this.getBounds();
      const manager = ViewportManager.get();
      
      if (this.isScrollable()) {
        this.viewport = manager.createViewport(this, bounds);
      } else if (this.parent) {
        this.viewport = this.parent.viewport;
      }
      
      if (this.viewport) {
        this.clippingArea = this.viewport.clip(bounds);
      } else {
        this.clippingArea = bounds;
      }
    }
    
    protected isScrollable(): boolean {
      // Override in ScrollableNode
      return false;
    }
    
    protected markChildrenLayoutDirty(): void {
      for (const child of this.children) {
        if ('layoutDirty' in child) {
          (child as LayoutableNode).layoutDirty = true;
          (child as LayoutableNode).markChildrenLayoutDirty();
        }
      }
    }
  };
}
```

### Interactive Mixin

```typescript
/**
 * Mixin that adds interactive capabilities to a node
 * Type-safe using generics
 */
function Interactive<TBase extends Constructor<Node>>(Base: TBase) {
  return class InteractiveNode extends Base {
    // Interactive state
    focused: boolean = false;
    disabled: boolean = false;
    tabIndex: number = 0;
    
    // Event handlers
    onClick?: (event: MouseEvent) => void;
    onPress?: (event: MouseEvent) => void;
    onKeyDown?: (event: KeyboardEvent) => void;
    onKeyUp?: (event: KeyboardEvent) => void;
    onChange?: (event: InputEvent) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    
    /**
     * Focus this node
     */
    focus(): void {
      if (this.disabled) return;
      this.focused = true;
      this.onFocus?.();
    }
    
    /**
     * Blur this node
     */
    blur(): void {
      this.focused = false;
      this.onBlur?.();
    }
    
    /**
     * Handle click event
     */
    handleClick(event: MouseEvent): void {
      if (this.disabled) return;
      this.onClick?.(event);
      this.onPress?.(event);
    }
    
    /**
     * Handle key event
     */
    handleKeyDown(event: KeyboardEvent): void {
      if (this.disabled) return;
      this.onKeyDown?.(event);
    }
    
    handleKeyUp(event: KeyboardEvent): void {
      if (this.disabled) return;
      this.onKeyUp?.(event);
    }
    
    /**
     * Handle change event
     */
    handleChange(event: InputEvent): void {
      if (this.disabled) return;
      this.onChange?.(event);
    }
  };
}
```

## Node Implementations

### TextNode

```typescript
/**
 * Text node - renders text content
 * Composed with Stylable and Renderable mixins
 */
class TextNode extends Stylable(Renderable(Node)) {
  private wrappedLines: string[] = [];
  private textMetrics: TextMetrics | null = null;
  
  constructor(id?: string) {
    super(id);
    // Apply text style mixin
    this.applyStyleMixin('TextStyle');
  }
  
  getNodeType(): string {
    return 'text';
  }
  
  getDefaultStyle(): StyleMap {
    const baseStyle = StyleMixinRegistry.get('BaseStyle')?.getDefaultStyle() || {};
    const textStyle = StyleMixinRegistry.get('TextStyle')?.getDefaultStyle() || {};
    return { ...baseStyle, ...textStyle };
  }
  
  computeLayout(constraints: LayoutConstraints): LayoutResult {
    if (!this.layoutDirty && this.bounds) {
      return {
        dimensions: {
          width: this.bounds.width,
          height: this.bounds.height,
          contentWidth: this.bounds.width,
          contentHeight: this.bounds.height,
        },
        layout: {},
        bounds: this.bounds,
      };
    }
    
    const style = this.computeStyle();
    const content = this.content || '';
    
    const metrics = this.measureText(content, style, constraints);
    this.textMetrics = metrics;
    
    this.wrappedLines = this.wrapText(content, style, constraints.maxWidth);
    
    const borderWidth = this.border.width;
    const totalWidth = metrics.width + borderWidth.left + borderWidth.right + this.padding.left + this.padding.right;
    const totalHeight = this.wrappedLines.length + borderWidth.top + borderWidth.bottom + this.padding.top + this.padding.bottom;
    
    const dimensions: Dimensions = {
      width: totalWidth,
      height: totalHeight,
      contentWidth: metrics.width,
      contentHeight: this.wrappedLines.length,
    };
    
    this.bounds = {
      x: 0,
      y: 0,
      width: dimensions.width,
      height: dimensions.height,
    };
    
    this.contentArea = this.calculateContentArea();
    this.layoutDirty = false;
    
    return {
      dimensions,
      layout: {},
      bounds: this.bounds,
    };
  }
  
  render(buffer: OutputBuffer, context: RenderContext): RenderResult {
    const style = this.computeStyle();
    const layout = this.computeLayout(context.constraints);
    
    // 1. Render background
    this.renderBackground(buffer, style, context);
    
    // 2. Render text content
    const contentArea = this.getContentArea();
    let currentY = contentArea.y;
    for (const line of this.wrappedLines) {
      this.renderLine(buffer, line, style, contentArea.x, currentY);
      currentY++;
    }
    
    // 3. Render border
    this.renderBorder(buffer, style, context);
    
    // 4. Register rendering info
    const bufferRegion: BufferRegion = {
      startX: context.x,
      startY: context.y,
      endX: context.x + layout.dimensions.width,
      endY: currentY,
      lines: Array.from({ length: layout.dimensions.height }, (_, i) => context.y + i),
    };
    
    this.registerRendering(
      bufferRegion,
      style.getZIndex() || 0,
      context.viewport
    );
    
    return {
      endX: context.x + layout.dimensions.width,
      endY: currentY,
      width: layout.dimensions.width,
      height: layout.dimensions.height,
      bounds: layout.bounds,
    };
  }
  
  private measureText(
    content: string,
    style: ComputedStyle,
    constraints: LayoutConstraints
  ): TextMetrics {
    const styledContent = applyStyles(content, {
      color: style.getColor(),
      backgroundColor: style.getBackgroundColor(),
      bold: style.getBold(),
    });
    
    return {
      width: measureText(styledContent),
      height: 1,
      visibleWidth: measureText(content),
    };
  }
  
  private wrapText(
    content: string,
    style: ComputedStyle,
    maxWidth: number
  ): string[] {
    if (!content) return [];
    
    const styledContent = applyStyles(content, {
      color: style.getColor(),
      backgroundColor: style.getBackgroundColor(),
    });
    
    return wrapText(styledContent, maxWidth);
  }
  
  private renderLine(
    buffer: OutputBuffer,
    line: string,
    style: ComputedStyle,
    x: number,
    y: number
  ): void {
    while (buffer.lines.length <= y) {
      buffer.lines.push('');
    }
    
    const currentLine = buffer.lines[y] || '';
    const styledLine = applyStyles(line, {
      color: style.getColor(),
      backgroundColor: style.getBackgroundColor(),
      bold: style.getBold(),
      dim: style.getDim(),
      italic: style.getItalic(),
      underline: style.getUnderline(),
      strikethrough: style.getStrikethrough(),
      inverse: style.getInverse(),
    });
    
    buffer.lines[y] = padToVisibleColumn(currentLine, x) + styledLine;
  }
}
```

### BoxNode

```typescript
/**
 * Box node - container for layout and styling
 * Composed with Stylable, Renderable, and Layoutable mixins
 */
class BoxNode extends Stylable(Renderable(Layoutable(Node))) {
  constructor(id?: string) {
    super(id);
    // Apply box style mixin
    this.applyStyleMixin('BoxStyle');
    // Apply border style mixin if border is set
    if (this.border.show.top || this.border.show.right || 
        this.border.show.bottom || this.border.show.left) {
      this.applyStyleMixin('BorderStyle');
    }
  }
  
  getNodeType(): string {
    return 'box';
  }
  
  getDefaultStyle(): StyleMap {
    const baseStyle = StyleMixinRegistry.get('BaseStyle')?.getDefaultStyle() || {};
    const boxStyle = StyleMixinRegistry.get('BoxStyle')?.getDefaultStyle() || {};
    return { ...baseStyle, ...boxStyle };
  }
  
  computeLayout(constraints: LayoutConstraints): LayoutResult {
    if (!this.layoutDirty && this.bounds) {
      return {
        dimensions: {
          width: this.bounds.width,
          height: this.bounds.height,
          contentWidth: this.getContentArea().width,
          contentHeight: this.getContentArea().height,
        },
        layout: {},
        bounds: this.bounds,
      };
    }
    
    const style = this.computeStyle();
    this.display = style.getDisplay();
    
    this.updateBoxModelFromStyle(style);
    
    if (this.border.show.top || this.border.show.right || 
        this.border.show.bottom || this.border.show.left) {
      this.applyStyleMixin('BorderStyle');
    }
    
    const borderWidth = this.border.width;
    const contentConstraints: LayoutConstraints = {
      maxWidth: constraints.maxWidth - borderWidth.left - borderWidth.right - this.padding.left - this.padding.right,
      maxHeight: constraints.maxHeight ? constraints.maxHeight - borderWidth.top - borderWidth.bottom - this.padding.top - this.padding.bottom : undefined,
      availableWidth: constraints.availableWidth - borderWidth.left - borderWidth.right - this.padding.left - this.padding.right,
      availableHeight: constraints.availableHeight ? constraints.availableHeight - borderWidth.top - borderWidth.bottom - this.padding.top - this.padding.bottom : undefined,
    };
    
    const layoutEngine = new LayoutEngine();
    let childLayouts: ChildLayout[] = [];
    
    if (this.display === DisplayMode.FLEX) {
      childLayouts = layoutEngine.layoutFlexbox(this, contentConstraints);
    } else if (this.display === DisplayMode.GRID) {
      childLayouts = layoutEngine.layoutGrid(this, contentConstraints);
    } else {
      childLayouts = layoutEngine.layoutBlock(this, contentConstraints);
    }
    
    const dimensions = this.calculateDimensions(childLayouts, borderWidth);
    
    this.bounds = {
      x: 0,
      y: 0,
      width: dimensions.width,
      height: dimensions.height,
    };
    
    this.contentArea = this.calculateContentArea();
    
    for (const childLayout of childLayouts) {
      childLayout.node.bounds = childLayout.bounds;
    }
    
    this.updateStackingContext();
    this.updateViewport();
    
    this.layoutDirty = false;
    
    return {
      dimensions,
      layout: {},
      bounds: this.bounds,
      children: childLayouts,
    };
  }
  
  render(buffer: OutputBuffer, context: RenderContext): RenderResult {
    const style = this.computeStyle();
    const layout = this.computeLayout(context.constraints);
    
    const terminalDims = getTerminalDimensions();
    const position = this.calculatePosition(
      context.x,
      context.y,
      context.constraints.maxWidth,
      context.constraints.maxHeight || terminalDims.rows,
      terminalDims
    );
    
    this.bounds = {
      ...this.bounds!,
      x: position.x,
      y: position.y,
    };
    
    this.contentArea = this.calculateContentArea();
    
    const boxContext: RenderContext = {
      ...context,
      x: position.x,
      y: position.y,
      constraints: {
        ...context.constraints,
        maxWidth: layout.dimensions.contentWidth,
        maxHeight: layout.dimensions.contentHeight,
      },
      parent: this,
    };
    
    // 1. Render background
    this.renderBackground(buffer, style, boxContext);
    
    // 2. Render children
    const childContext = this.createChildContext(boxContext, layout);
    let maxEndY = position.y;
    for (const child of this.children) {
      if ('render' in child) {
        const result = (child as RenderableNode).render(buffer, childContext);
        maxEndY = Math.max(maxEndY, result.endY);
        if (this.display === DisplayMode.BLOCK) {
          childContext.y = result.endY;
        }
      }
    }
    
    // 3. Render border
    this.renderBorder(buffer, style, boxContext);
    
    // 4. Register rendering info
    const bufferRegion: BufferRegion = {
      startX: position.x,
      startY: position.y,
      endX: position.x + layout.dimensions.width,
      endY: maxEndY,
      lines: Array.from({ length: layout.dimensions.height }, (_, i) => position.y + i),
    };
    
    this.registerRendering(
      bufferRegion,
      style.getZIndex() || 0,
      boxContext.viewport
    );
    
    return {
      endX: position.x + layout.dimensions.width,
      endY: maxEndY,
      width: layout.dimensions.width,
      height: layout.dimensions.height,
      bounds: layout.bounds,
    };
  }
  
  private calculateDimensions(
    childLayouts: ChildLayout[],
    borderWidth: BorderWidth
  ): Dimensions {
    if (this.display === DisplayMode.FLEX || this.display === DisplayMode.GRID) {
      const maxX = Math.max(...childLayouts.map(l => l.bounds.x + l.bounds.width), 0);
      const maxY = Math.max(...childLayouts.map(l => l.bounds.y + l.bounds.height), 0);
      
      return {
        width: maxX + borderWidth.left + borderWidth.right + this.padding.left + this.padding.right,
        height: maxY + borderWidth.top + borderWidth.bottom + this.padding.top + this.padding.bottom,
        contentWidth: maxX,
        contentHeight: maxY,
      };
    } else {
      const totalHeight = childLayouts.reduce((sum, l) => sum + l.bounds.height, 0);
      
      return {
        width: this.width || 0,
        height: totalHeight + borderWidth.top + borderWidth.bottom + this.padding.top + this.padding.bottom,
        contentWidth: this.width || 0,
        contentHeight: totalHeight,
      };
    }
  }
  
  private createChildContext(
    boxContext: RenderContext,
    layout: LayoutResult
  ): RenderContext {
    const contentArea = this.getContentArea();
    
    return {
      ...boxContext,
      x: contentArea.x,
      y: contentArea.y,
      constraints: {
        maxWidth: contentArea.width,
        maxHeight: contentArea.height,
        availableWidth: contentArea.width,
        availableHeight: contentArea.height,
      },
    };
  }
}
```

## Style Mixin System

### StyleMixin Interface (Generic)

```typescript
/**
 * Base interface for style mixins
 * Generic to support type-safe node types
 */
interface StyleMixin<TNode extends Node = Node> {
  name: string;
  priority: number; // Lower = higher priority
  appliesTo(node: Node): node is TNode;
  getDefaultStyle(): StyleMap;
  getInheritableProperties(): string[];
  apply(node: TNode): void;
}
```

### BaseStyleMixin

```typescript
/**
 * Base style mixin - applied to all nodes
 */
class BaseStyleMixin implements StyleMixin<Node> {
  name = 'BaseStyle';
  priority = 100;
  
  appliesTo(node: Node): node is Node {
    return true; // Applies to all nodes
  }
  
  apply(node: Node): void {
    // BaseStyle is always applied, no additional setup needed
  }
  
  getDefaultStyle(): StyleMap {
    return {
      color: 'inherit',
      backgroundColor: 'inherit',
      bold: false,
      dim: false,
      italic: false,
      underline: false,
      strikethrough: false,
      inverse: false,
    };
  }
  
  getInheritableProperties(): string[] {
    return ['color', 'backgroundColor'];
  }
}
```

### TextStyleMixin

```typescript
/**
 * Text style mixin - applied to text nodes
 */
class TextStyleMixin implements StyleMixin<TextNode> {
  name = 'TextStyle';
  priority = 80;
  
  appliesTo(node: Node): node is TextNode {
    return node instanceof TextNode;
  }
  
  apply(node: TextNode): void {
    // Text-specific setup
  }
  
  getDefaultStyle(): StyleMap {
    return {
      textAlign: TextAlign.LEFT,
      textWrap: true,
    };
  }
  
  getInheritableProperties(): string[] {
    return [];
  }
}
```

### BoxStyleMixin

```typescript
/**
 * Box style mixin - applied to box nodes
 */
class BoxStyleMixin implements StyleMixin<BoxNode> {
  name = 'BoxStyle';
  priority = 80;
  
  appliesTo(node: Node): node is BoxNode {
    return node instanceof BoxNode;
  }
  
  apply(node: BoxNode): void {
    // Box-specific setup
  }
  
  getDefaultStyle(): StyleMap {
    return {
      display: DisplayMode.BLOCK,
    };
  }
  
  getInheritableProperties(): string[] {
    return [];
  }
}
```

### BorderStyleMixin

```typescript
/**
 * Border style mixin - applied conditionally when border is set
 */
class BorderStyleMixin implements StyleMixin<Node> {
  name = 'BorderStyle';
  priority = 60;
  
  appliesTo(node: Node): node is Node {
    // Applies to nodes with borders
    return node.border.show.top || node.border.show.right || 
           node.border.show.bottom || node.border.show.left;
  }
  
  apply(node: Node): void {
    // Border-specific setup
  }
  
  getDefaultStyle(): StyleMap {
    return {
      border: false,
      borderColor: 'inherit',
      borderBackgroundColor: 'inherit',
      borderStyle: BorderStyle.SINGLE,
      borderWidth: 1,
    };
  }
  
  getInheritableProperties(): string[] {
    return ['borderColor', 'borderBackgroundColor'];
  }
}
```

### StyleMixinRegistry (Type-Safe)

```typescript
/**
 * Registry for style mixins with type safety
 */
class StyleMixinRegistry {
  private static mixins = new Map<string, StyleMixin>();
  
  static register<TNode extends Node>(mixin: StyleMixin<TNode>): void {
    this.mixins.set(mixin.name, mixin);
  }
  
  static get(name: string): StyleMixin | undefined {
    return this.mixins.get(name);
  }
  
  static getAll(): StyleMixin[] {
    return Array.from(this.mixins.values()).sort((a, b) => a.priority - b.priority);
  }
  
  static getApplicableMixins(node: Node): StyleMixin[] {
    return this.getAll().filter(mixin => mixin.appliesTo(node));
  }
}

// Register default mixins
StyleMixinRegistry.register(new BaseStyleMixin());
StyleMixinRegistry.register(new TextStyleMixin());
StyleMixinRegistry.register(new BoxStyleMixin());
StyleMixinRegistry.register(new BorderStyleMixin());
```

## Style Resolver with Mixin Support

```typescript
/**
 * Resolves styles through cascade with mixin support
 */
class StyleResolver {
  /**
   * Resolve style through cascade
   * Order: Default -> Theme -> Style Mixin -> Class -> Inherited -> Inline
   */
  resolve(
    node: Node,
    defaultStyle: StyleMap,
    theme: Theme | null,
    appliedStyleMixins: string[],
    className: string[],
    inlineStyle: StyleMap,
    parentStyle?: ComputedStyle
  ): ComputedStyle {
    // 1. Default styles
    let resolved = { ...defaultStyle };
    
    // 2. Theme styles
    if (theme) {
      const themeStyle = this.resolveThemeStyles(node, theme);
      resolved = this.mergeStyles(resolved, themeStyle);
    }
    
    // 3. Style mixin styles (in priority order)
    for (const mixinName of appliedStyleMixins) {
      const mixin = StyleMixinRegistry.get(mixinName);
      if (mixin && mixin.appliesTo(node)) {
        const mixinStyle = mixin.getDefaultStyle();
        resolved = this.mergeStyles(resolved, mixinStyle);
      }
    }
    
    // 4. Class styles
    if (className.length > 0) {
      const classStyles = this.resolveClassStyles(className, theme);
      resolved = this.mergeStyles(resolved, classStyles);
    }
    
    // 5. Inherited styles (from parent)
    const inherited: StyleMap = {};
    if (parentStyle) {
      // Get inheritable properties from all applied mixins
      const inheritableProps = new Set<string>();
      for (const mixinName of appliedStyleMixins) {
        const mixin = StyleMixinRegistry.get(mixinName);
        if (mixin) {
          for (const prop of mixin.getInheritableProperties()) {
            inheritableProps.add(prop);
          }
        }
      }
      
      for (const prop of inheritableProps) {
        const value = parentStyle.getProperty(prop);
        if (value !== null && value !== undefined) {
          inherited[prop] = value;
        }
      }
    }
    
    // 6. Inline styles (highest priority)
    resolved = this.mergeStyles(resolved, inlineStyle);
    
    // Resolve color values (theme colors -> actual colors)
    resolved = this.resolveColors(resolved, theme);
    
    return new ComputedStyle(resolved, inherited);
  }
  
  private resolveThemeStyles(node: Node, theme: Theme): StyleMap {
    const nodeType = node.getNodeType();
    const componentTheme = theme.components[nodeType];
    return componentTheme || {};
  }
  
  private resolveClassStyles(className: string[], theme: Theme): StyleMap {
    const styles: StyleMap = {};
    for (const name of className) {
      const classStyle = theme.classes?.[name];
      if (classStyle) {
        Object.assign(styles, classStyle);
      }
    }
    return styles;
  }
  
  private mergeStyles(...styles: StyleMap[]): StyleMap {
    return Object.assign({}, ...styles);
  }
  
  private resolveColors(style: StyleMap, theme: Theme | null): StyleMap {
    const resolved = { ...style };
    
    if (theme) {
      for (const [key, value] of Object.entries(resolved)) {
        if (key.includes('Color') && typeof value === 'string') {
          if (value in theme.colors) {
            resolved[key] = theme.colors[value];
          }
        }
      }
    }
    
    return resolved;
  }
}
```

## Component Tree System

### ComponentInstance (Like React Fibers)

```typescript
/**
 * Component instance - tracks component in the tree (like React fibers)
 */
class ComponentInstance {
  readonly node: Node;
  
  parent: ComponentInstance | null = null;
  children: ComponentInstance[] = [];
  sibling: ComponentInstance | null = null;
  
  mounted: boolean = false;
  updated: boolean = false;
  rendered: boolean = false;
  renderingInfo: RenderingInfo | null = null;
  
  needsUpdate: boolean = false;
  updatePriority: number = 0;
  
  constructor(node: Node) {
    this.node = node;
  }
  
  mount(parent: ComponentInstance | null): void {
    this.parent = parent;
    if (parent) {
      if (parent.children.length > 0) {
        const lastSibling = parent.children[parent.children.length - 1]!;
        lastSibling.sibling = this;
      }
      parent.children.push(this);
    }
    this.mounted = true;
  }
  
  unmount(): void {
    if (this.parent) {
      const index = this.parent.children.indexOf(this);
      if (index >= 0) {
        this.parent.children.splice(index, 1);
      }
      if (index > 0) {
        const prevSibling = this.parent.children[index - 1];
        if (prevSibling) {
          prevSibling.sibling = this.sibling;
        }
      }
    }
    this.parent = null;
    this.sibling = null;
    this.mounted = false;
  }
  
  markForUpdate(priority: number = 0): void {
    this.needsUpdate = true;
    this.updatePriority = priority;
  }
  
  getDescendants(): ComponentInstance[] {
    const descendants: ComponentInstance[] = [];
    for (const child of this.children) {
      descendants.push(child);
      descendants.push(...child.getDescendants());
    }
    return descendants;
  }
  
  getAncestors(): ComponentInstance[] {
    const ancestors: ComponentInstance[] = [];
    let current: ComponentInstance | null = this.parent;
    while (current) {
      ancestors.push(current);
      current = current.parent;
    }
    return ancestors;
  }
}
```

### ComponentTree

```typescript
/**
 * Component tree - tracks all component instances (like React's fiber tree)
 */
class ComponentTree {
  private instances: Map<Node, ComponentInstance> = new Map();
  private root: ComponentInstance | null = null;
  
  static createInstance(node: Node): ComponentInstance {
    const tree = ComponentTreeRegistry.get();
    let instance = tree.instances.get(node);
    if (!instance) {
      instance = new ComponentInstance(node);
      tree.instances.set(node, instance);
    }
    return instance;
  }
  
  mount(node: Node, parent: Node | null): void {
    const instance = this.instances.get(node);
    if (!instance) return;
    
    const parentInstance = parent ? this.instances.get(parent) : null;
    instance.mount(parentInstance);
    
    if (!this.root && !parent) {
      this.root = instance;
    }
  }
  
  unmount(node: Node): void {
    const instance = this.instances.get(node);
    if (!instance) return;
    
    instance.unmount();
    
    if (this.root === instance) {
      this.root = null;
    }
  }
  
  getInstance(node: Node): ComponentInstance | undefined {
    return this.instances.get(node);
  }
  
  getRoot(): ComponentInstance | null {
    return this.root;
  }
  
  clear(): void {
    this.instances.clear();
    this.root = null;
  }
}

class ComponentTreeRegistry {
  private static tree: ComponentTree = new ComponentTree();
  
  static get(): ComponentTree {
    return this.tree;
  }
  
  static reset(): void {
    this.tree = new ComponentTree();
  }
}
```

## Rendering Tree System

### RenderingInfo

```typescript
/**
 * Information about what's rendered in the buffer for a component
 */
interface RenderingInfo {
  component: Node;
  bufferRegion: BufferRegion;
  children: RenderingInfo[];
  zIndex: number;
  stackingContext: StackingContext | null;
  viewport: Viewport | null;
  clipped: boolean;
  visible: boolean;
}

interface BufferRegion {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  lines: number[];
}

/**
 * Rendering tree - tracks what's in the buffer for each component
 */
class RenderingTree {
  private renderingInfo: Map<Node, RenderingInfo> = new Map();
  private root: RenderingInfo | null = null;
  
  register(info: RenderingInfo): void {
    this.renderingInfo.set(info.component, info);
    
    const parent = info.component.parent;
    if (parent) {
      const parentInfo = this.renderingInfo.get(parent);
      if (parentInfo) {
        parentInfo.children.push(info);
      }
    } else {
      this.root = info;
    }
  }
  
  get(component: Node): RenderingInfo | undefined {
    return this.renderingInfo.get(component);
  }
  
  getComponentsInRegion(region: BufferRegion): Node[] {
    const components: Node[] = [];
    for (const info of this.renderingInfo.values()) {
      if (this.regionsIntersect(info.bufferRegion, region)) {
        components.push(info.component);
      }
    }
    return components;
  }
  
  getVisibleComponents(): Node[] {
    const visible: Node[] = [];
    for (const info of this.renderingInfo.values()) {
      if (info.visible && !info.clipped) {
        visible.push(info.component);
      }
    }
    return visible;
  }
  
  getComponentsByZIndex(): Node[] {
    const sorted = Array.from(this.renderingInfo.values())
      .sort((a, b) => a.zIndex - b.zIndex);
    return sorted.map(info => info.component);
  }
  
  clear(): void {
    this.renderingInfo.clear();
    this.root = null;
  }
  
  private regionsIntersect(a: BufferRegion, b: BufferRegion): boolean {
    return !(
      a.endX <= b.startX ||
      b.endX <= a.startX ||
      a.endY <= b.startY ||
      b.endY <= a.startY
    );
  }
}

class RenderingTreeRegistry {
  private static tree: RenderingTree = new RenderingTree();
  
  static get(): RenderingTree {
    return this.tree;
  }
  
  static reset(): void {
    this.tree = new RenderingTree();
  }
}
```

## Stacking Context System

### StackingContext

```typescript
/**
 * Stacking context - manages z-index and rendering order (like CSS)
 */
class StackingContext {
  readonly root: Node;
  readonly zIndex: number;
  
  private children: Array<{ node: Node; zIndex: number }> = [];
  parent: StackingContext | null = null;
  childContexts: StackingContext[] = [];
  
  constructor(root: Node, zIndex: number = 0) {
    this.root = root;
    this.zIndex = zIndex;
  }
  
  addNode(node: Node, zIndex: number): void {
    this.children.push({ node, zIndex });
    this.sortChildren();
  }
  
  removeNode(node: Node): void {
    this.children = this.children.filter(c => c.node !== node);
  }
  
  addChildContext(context: StackingContext): void {
    context.parent = this;
    this.childContexts.push(context);
    this.sortChildContexts();
  }
  
  getRenderingOrder(): Node[] {
    const order: Node[] = [];
    
    // 1. Background and borders of root
    order.push(this.root);
    
    // 2. Child stacking contexts with negative z-index
    const negativeContexts = this.childContexts
      .filter(c => c.zIndex < 0)
      .sort((a, b) => a.zIndex - b.zIndex);
    for (const context of negativeContexts) {
      order.push(...context.getRenderingOrder());
    }
    
    // 3. Non-positioned children
    const nonPositioned = this.children
      .filter(c => !this.isPositioned(c.node))
      .sort((a, b) => a.zIndex - b.zIndex);
    for (const child of nonPositioned) {
      order.push(child.node);
    }
    
    // 4. Child stacking contexts with z-index 0
    const zeroContexts = this.childContexts
      .filter(c => c.zIndex === 0);
    for (const context of zeroContexts) {
      order.push(...context.getRenderingOrder());
    }
    
    // 5. Positioned children with z-index 0
    const positionedZero = this.children
      .filter(c => this.isPositioned(c.node) && c.zIndex === 0);
    for (const child of positionedZero) {
      order.push(child.node);
    }
    
    // 6. Child stacking contexts with positive z-index
    const positiveContexts = this.childContexts
      .filter(c => c.zIndex > 0)
      .sort((a, b) => a.zIndex - b.zIndex);
    for (const context of positiveContexts) {
      order.push(...context.getRenderingOrder());
    }
    
    // 7. Positioned children with positive z-index
    const positionedPositive = this.children
      .filter(c => this.isPositioned(c.node) && c.zIndex > 0)
      .sort((a, b) => a.zIndex - b.zIndex);
    for (const child of positionedPositive) {
      order.push(child.node);
    }
    
    return order;
  }
  
  static createsStackingContext(node: Node, style: ComputedStyle): boolean {
    if (!node.parent) {
      return true;
    }
    
    const position = style.getPosition();
    const zIndex = style.getZIndex();
    if ((position === Position.ABSOLUTE || position === Position.FIXED || position === Position.RELATIVE || position === Position.STICKY) && zIndex !== null && zIndex !== 0) {
      return true;
    }
    
    if (position === Position.FIXED || position === Position.STICKY) {
      return true;
    }
    
    const display = style.getDisplay();
    if ((display === DisplayMode.FLEX || display === DisplayMode.GRID) && zIndex !== null && zIndex !== 0) {
      return true;
    }
    
    return false;
  }
  
  private isPositioned(node: Node): boolean {
    const position = node.position;
    return position === Position.ABSOLUTE || position === Position.FIXED || position === Position.RELATIVE || position === Position.STICKY;
  }
  
  private sortChildren(): void {
    this.children.sort((a, b) => a.zIndex - b.zIndex);
  }
  
  private sortChildContexts(): void {
    this.childContexts.sort((a, b) => a.zIndex - b.zIndex);
  }
}

class StackingContextManager {
  private contexts: Map<Node, StackingContext> = new Map();
  private rootContext: StackingContext | null = null;
  
  getContext(node: Node, style: ComputedStyle): StackingContext {
    let context = this.contexts.get(node);
    if (!context) {
      const zIndex = style.getZIndex() || 0;
      context = new StackingContext(node, zIndex);
      this.contexts.set(node, context);
      
      if (node.parent) {
        const parentContext = this.getContext(node.parent, node.parent.computeStyle());
        parentContext.addChildContext(context);
      } else {
        this.rootContext = context;
      }
    }
    return context;
  }
  
  getRootContext(): StackingContext | null {
    return this.rootContext;
  }
  
  getGlobalRenderingOrder(): Node[] {
    if (!this.rootContext) {
      return [];
    }
    return this.rootContext.getRenderingOrder();
  }
  
  clear(): void {
    this.contexts.clear();
    this.rootContext = null;
  }
  
  static get(): StackingContextManager {
    return this.instance || (this.instance = new StackingContextManager());
  }
  
  private static instance: StackingContextManager | null = null;
}
```

## Viewport and Clipping System

### Viewport

```typescript
/**
 * Viewport - represents a visible area (like browser viewport)
 */
class Viewport {
  readonly bounds: BoundingBox;
  scrollX: number = 0;
  scrollY: number = 0;
  clippingArea: BoundingBox;
  parent: Viewport | null = null;
  children: Viewport[] = [];
  
  constructor(bounds: BoundingBox, parent: Viewport | null = null) {
    this.bounds = bounds;
    this.clippingArea = bounds;
    this.parent = parent;
    if (parent) {
      parent.children.push(this);
    }
  }
  
  containsPoint(x: number, y: number): boolean {
    return (
      x >= this.clippingArea.x &&
      x < this.clippingArea.x + this.clippingArea.width &&
      y >= this.clippingArea.y &&
      y < this.clippingArea.y + this.clippingArea.height
    );
  }
  
  intersects(region: BoundingBox): boolean {
    return !(
      region.x + region.width <= this.clippingArea.x ||
      this.clippingArea.x + this.clippingArea.width <= region.x ||
      region.y + region.height <= this.clippingArea.y ||
      this.clippingArea.y + this.clippingArea.height <= region.y
    );
  }
  
  clip(region: BoundingBox): BoundingBox | null {
    if (!this.intersects(region)) {
      return null;
    }
    
    return {
      x: Math.max(region.x, this.clippingArea.x),
      y: Math.max(region.y, this.clippingArea.y),
      width: Math.min(
        region.x + region.width,
        this.clippingArea.x + this.clippingArea.width
      ) - Math.max(region.x, this.clippingArea.x),
      height: Math.min(
        region.y + region.height,
        this.clippingArea.y + this.clippingArea.height
      ) - Math.max(region.y, this.clippingArea.y),
    };
  }
  
  setScroll(x: number, y: number): void {
    this.scrollX = x;
    this.scrollY = y;
    this.updateClippingArea();
  }
  
  private updateClippingArea(): void {
    this.clippingArea = { ...this.bounds };
    this.clippingArea.x -= this.scrollX;
    this.clippingArea.y -= this.scrollY;
    
    if (this.parent) {
      const parentClipped = this.parent.clip(this.clippingArea);
      if (parentClipped) {
        this.clippingArea = parentClipped;
      } else {
        this.clippingArea = { x: 0, y: 0, width: 0, height: 0 };
      }
    }
    
    for (const child of this.children) {
      child.updateClippingArea();
    }
  }
}

class ViewportManager {
  private viewports: Map<Node, Viewport> = new Map();
  private rootViewport: Viewport | null = null;
  
  createViewport(node: Node, bounds: BoundingBox): Viewport {
    const parent = node.parent;
    const parentViewport = parent ? this.viewports.get(parent) : null;
    
    const viewport = new Viewport(bounds, parentViewport);
    this.viewports.set(node, viewport);
    
    if (!parent) {
      this.rootViewport = viewport;
    }
    
    return viewport;
  }
  
  getViewport(node: Node): Viewport | undefined {
    return this.viewports.get(node);
  }
  
  getRootViewport(): Viewport | null {
    return this.rootViewport;
  }
  
  clear(): void {
    this.viewports.clear();
    this.rootViewport = null;
  }
  
  static get(): ViewportManager {
    return this.instance || (this.instance = new ViewportManager());
  }
  
  private static instance: ViewportManager | null = null;
}
```

## System Integration

### Renderer with Tree Tracking

```typescript
/**
 * Main renderer that integrates all systems
 */
class Renderer {
  private componentTree: ComponentTree;
  private renderingTree: RenderingTree;
  private stackingContextManager: StackingContextManager;
  private viewportManager: ViewportManager;
  
  constructor() {
    this.componentTree = ComponentTreeRegistry.get();
    this.renderingTree = RenderingTreeRegistry.get();
    this.stackingContextManager = StackingContextManager.get();
    this.viewportManager = ViewportManager.get();
  }
  
  render(root: Node, buffer: OutputBuffer): void {
    // 1. Clear previous state
    this.renderingTree.clear();
    this.stackingContextManager.clear();
    this.viewportManager.clear();
    
    // 2. Build component tree
    this.buildComponentTree(root);
    
    // 3. Calculate layouts
    this.calculateLayouts(root);
    
    // 4. Build stacking contexts
    this.buildStackingContexts(root);
    
    // 5. Build viewports
    this.buildViewports(root);
    
    // 6. Get rendering order (sorted by stacking context)
    const renderingOrder = this.stackingContextManager.getGlobalRenderingOrder();
    
    // 7. Render nodes in correct order
    const context: RenderContext = {
      buffer,
      x: 0,
      y: 0,
      constraints: {
        maxWidth: getTerminalDimensions().columns,
        maxHeight: getTerminalDimensions().rows,
        availableWidth: getTerminalDimensions().columns,
        availableHeight: getTerminalDimensions().rows,
      },
      parent: null,
      theme: root.theme,
      viewport: null,
    };
    
    for (const node of renderingOrder) {
      if ('render' in node) {
        (node as RenderableNode).render(buffer, context);
      }
    }
  }
  
  private buildComponentTree(node: Node): void {
    const instance = this.componentTree.getInstance(node);
    if (!instance) return;
    
    if (!instance.mounted) {
      const parent = node.parent;
      this.componentTree.mount(node, parent);
    }
    
    for (const child of node.children) {
      this.buildComponentTree(child);
    }
  }
  
  private calculateLayouts(node: Node): void {
    if ('computeLayout' in node) {
      const constraints = this.getLayoutConstraints(node);
      (node as LayoutableNode).computeLayout(constraints);
    }
    
    for (const child of node.children) {
      this.calculateLayouts(child);
    }
  }
  
  private buildStackingContexts(node: Node): void {
    if ('updateStackingContext' in node) {
      (node as LayoutableNode).updateStackingContext();
    }
    
    for (const child of node.children) {
      this.buildStackingContexts(child);
    }
  }
  
  private buildViewports(node: Node): void {
    if ('updateViewport' in node) {
      (node as LayoutableNode).updateViewport();
    }
    
    for (const child of node.children) {
      this.buildViewports(child);
    }
  }
  
  private getLayoutConstraints(node: Node): LayoutConstraints {
    const parent = node.parent;
    if (!parent) {
      const dims = getTerminalDimensions();
      return {
        maxWidth: dims.columns,
        maxHeight: dims.rows,
        availableWidth: dims.columns,
        availableHeight: dims.rows,
      };
    }
    
    if ('getContentArea' in parent) {
      const parentContentArea = parent.getContentArea();
      return {
        maxWidth: parentContentArea.width,
        maxHeight: parentContentArea.height,
        availableWidth: parentContentArea.width,
        availableHeight: parentContentArea.height,
      };
    }
    
    return {
      maxWidth: 0,
      maxHeight: 0,
      availableWidth: 0,
      availableHeight: 0,
    };
  }
}
```

## React Integration

### Node Factory

```typescript
/**
 * Factory to create node instances from React elements
 * Uses mixin composition for type-safe node creation
 */
class NodeFactory {
  static createNode(element: ReactElement, parent?: Node): Node {
    const type = element.type;
    const props = element.props;
    
    let node: Node;
    
    switch (type) {
      case 'text':
      case Text:
        node = new TextNode();
        if (props.children) {
          node.setContent(String(props.children));
        }
        break;
        
      case 'box':
      case 'view':
      case Box:
      case View:
        node = new BoxNode();
        break;
        
      case 'input':
      case Input:
        node = new InputNode();
        break;
        
      case 'button':
      case Button:
        node = new ButtonNode();
        break;
        
      // ... other types
        
      default:
        throw new Error(`Unknown node type: ${type}`);
    }
    
    // Apply props
    if (props.style && 'setStyle' in node) {
      (node as StylableNode).setStyle(props.style);
    }
    
    if (props.className && 'setClassName' in node) {
      (node as StylableNode).setClassName(props.className);
    }
    
    // Set theme
    const theme = getRendererTheme();
    if (theme && 'setTheme' in node) {
      (node as StylableNode).setTheme(theme);
    }
    
    // Add children
    if (props.children && Array.isArray(props.children)) {
      for (const child of props.children) {
        if (React.isValidElement(child)) {
          const childNode = NodeFactory.createNode(child, node);
          node.appendChild(childNode);
        }
      }
    }
    
    return node;
  }
}
```

### Host Config Integration

```typescript
// In hostConfig.ts
export const hostConfig = {
  createInstance(type: string, props: any): Node {
    const element = { type, props } as ReactElement;
    return NodeFactory.createNode(element);
  },
  
  appendChild(parent: Node, child: Node): void {
    parent.appendChild(child);
  },
  
  removeChild(parent: Node, child: Node): void {
    parent.removeChild(child);
  },
  
  commitUpdate(node: Node, updatePayload: any): void {
    if (updatePayload.style && 'setStyle' in node) {
      (node as StylableNode).setStyle(updatePayload.style);
    }
    // ... other updates
  },
  
  // ... other host config methods
};
```

## React Native StyleSheet API Integration

### StyleSheet API

The architecture fully supports React Native-style StyleSheet API:

```typescript
/**
 * StyleSheet API - React Native-like stylesheets
 */
export const StyleSheet = {
  /**
   * Create a stylesheet from style definitions
   */
  create<T extends Record<string, ViewStyle | TextStyle | TerminalStyle>>(
    styles: T
  ): T {
    // Returns styles as-is (for API consistency with React Native)
    return styles;
  },

  /**
   * Flatten an array of styles
   * Merges multiple styles into one, with later styles overriding earlier ones
   */
  flatten<T extends ViewStyle | TextStyle | TerminalStyle>(
    styles: (T | false | null | undefined)[]
  ): T | null {
    const validStyles = styles.filter((s): s is T => s !== false && s !== null && s !== undefined);
    if (validStyles.length === 0) return null;
    
    return Object.assign({}, ...validStyles) as T;
  },

  /**
   * Compose styles (alias for flatten)
   */
  compose<T extends ViewStyle | TextStyle | TerminalStyle>(
    ...styles: (T | false | null | undefined)[]
  ): T | null {
    return StyleSheet.flatten(styles);
  },
};
```

### StyleSheet Integration with Style System

StyleSheet styles integrate seamlessly with the new style system:

```typescript
// StyleSheet styles are resolved through the same cascade
class StylableNode extends Node {
  computeStyle(): ComputedStyle {
    const resolver = new StyleResolver();
    
    // StyleSheet styles are treated as class styles
    const styleSheetStyles = this.resolveStyleSheetStyles();
    
    return resolver.resolve(
      this,
      this.getDefaultStyle(),
      this.theme,
      Array.from(this.appliedStyleMixins),
      this.className,
      styleSheetStyles, // StyleSheet styles merged with inline styles
      parentStyle
    );
  }
  
  private resolveStyleSheetStyles(): StyleMap {
    // If style prop is a StyleSheet reference, resolve it
    if (this.inlineStyle && typeof this.inlineStyle === 'object') {
      return this.inlineStyle;
    }
    return {};
  }
}
```

### React Native-Style Component Usage

```tsx
import { StyleSheet, View, Text } from 'react-console';

const styles = StyleSheet.create({
  container: {
    padding: 2,
    border: 'single',
    backgroundColor: 'blue',
  },
  title: {
    color: 'white',
    bold: true,
  },
});

function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Title</Text>
    </View>
  );
}
```

## CommandRouter System Integration

### CommandRouter Nodes

The architecture includes specialized nodes for the CLI command/router system:

```typescript
/**
 * CommandRouterNode - Root router for CLI applications
 */
class CommandRouterNode extends Stylable(Renderable(Layoutable(Node))) {
  private description?: string;
  private help?: ReactNode | ((props: HelpProps) => ReactNode);
  private options?: Record<string, CommandOption>;
  private defaultConfig?: Record<string, ConfigValue>;
  private envPrefix?: string;
  
  // Routing state
  private parsedArgs: ParsedArgs;
  private matchedComponent: ReactNode | null = null;
  private metadata: ComponentMetadata[] = [];
  
  constructor(props: CommandRouterProps) {
    super();
    this.description = props.description;
    this.help = props.help;
    this.options = props.options;
    this.defaultConfig = props.defaultConfig;
    this.envPrefix = props.envPrefix;
    
    // Parse command-line arguments
    this.parsedArgs = parseCommandLineArgs(process.argv.slice(2));
    
    // Extract metadata from children
    this.metadata = extractComponentMetadata(props.children);
  }
  
  computeLayout(constraints: LayoutConstraints): LayoutResult {
    // Match component based on parsed args
    const matchResult = matchComponent(this.parsedArgs, this.children);
    
    // Execute middleware chain
    const middlewareResult = executeMiddlewareChain(
      matchResult.metadata,
      this.parsedArgs,
      matchResult.isDefault
    );
    
    // Execute lifecycle hooks
    executeBeforeHooksChain(
      matchResult.metadata,
      this.parsedArgs,
      middlewareResult.args,
      matchResult.isDefault
    );
    
    // Validate parameters
    const validationResult = validateCommandParams(
      matchResult.metadata,
      middlewareResult.args
    );
    
    // Select matched component
    this.matchedComponent = matchResult.component;
    
    // Layout matched component
    if (this.matchedComponent && 'computeLayout' in this.matchedComponent) {
      return (this.matchedComponent as LayoutableNode).computeLayout(constraints);
    }
    
    return {
      dimensions: { width: 0, height: 0, contentWidth: 0, contentHeight: 0 },
      layout: {},
      bounds: { x: 0, y: 0, width: 0, height: 0 },
    };
  }
  
  render(buffer: OutputBuffer, context: RenderContext): RenderResult {
    if (!this.matchedComponent) {
      return { endX: context.x, endY: context.y, width: 0, height: 0 };
    }
    
    // Render matched component
    if ('render' in this.matchedComponent) {
      return (this.matchedComponent as RenderableNode).render(buffer, context);
    }
    
    return { endX: context.x, endY: context.y, width: 0, height: 0 };
  }
}

/**
 * CommandNode - Command definition node
 */
class CommandNode extends Stylable(Renderable(Layoutable(Node))) {
  private name: string;
  private aliases?: string[];
  private params?: CommandParam[];
  private options?: Record<string, CommandOption>;
  private middleware?: CommandMiddlewareFunction[];
  private beforeHooks?: CommandLifecycleHook[];
  private afterHooks?: CommandLifecycleHook[];
  private guards?: RouteGuardFunction[];
  
  constructor(props: CommandProps) {
    super();
    this.name = props.name;
    this.aliases = props.aliases;
    this.params = props.params;
    this.options = props.options;
    this.middleware = props.middleware;
    this.beforeHooks = props.beforeHooks;
    this.afterHooks = props.afterHooks;
    this.guards = props.guards;
  }
  
  // Command-specific methods
  matches(command: string[]): boolean {
    if (command.length === 0) return false;
    return command[0] === this.name || this.aliases?.includes(command[0]);
  }
}

/**
 * RouteNode - Route definition node
 */
class RouteNode extends Stylable(Renderable(Layoutable(Node))) {
  private path: string;
  private guards?: RouteGuardFunction[];
  
  constructor(props: RouteProps) {
    super();
    this.path = props.path;
    this.guards = props.guards;
  }
  
  matches(routePath: string): boolean {
    return matchRoute(this.path, routePath);
  }
}

/**
 * DefaultNode - Default/fallback component node
 */
class DefaultNode extends Stylable(Renderable(Layoutable(Node))) {
  constructor(props: DefaultProps) {
    super();
  }
  
  // Default node is matched when no command/route matches
}
```

### CommandRouter Integration with React Components

```tsx
// React component wrappers use TSX
export function CommandRouter(props: CommandRouterProps): ReactNode {
  const node = useMemo(() => {
    return new CommandRouterNode(props);
  }, [props]);
  
  return <CommandRouterNodeWrapper node={node}>{props.children}</CommandRouterNodeWrapper>;
}

export function Command(props: CommandProps): ReactNode {
  const node = useMemo(() => {
    return new CommandNode(props);
  }, [props]);
  
  return <CommandNodeWrapper node={node}>{props.children}</CommandNodeWrapper>;
}

export function Route(props: RouteProps): ReactNode {
  const node = useMemo(() => {
    return new RouteNode(props);
  }, [props]);
  
  return <RouteNodeWrapper node={node}>{props.children}</RouteNodeWrapper>;
}

export function Default(props: DefaultProps): ReactNode {
  const node = useMemo(() => {
    return new DefaultNode(props);
  }, [props]);
  
  return <DefaultNodeWrapper node={node}>{props.children}</DefaultNodeWrapper>;
}
```

## Keyboard and Mouse Input System

### Input Event Types

```typescript
/**
 * Keyboard event
 */
interface KeyboardEvent {
  key: {
    char?: string;
    name?: string;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
    return?: boolean;
    escape?: boolean;
    tab?: boolean;
    backspace?: boolean;
    delete?: boolean;
    up?: boolean;
    down?: boolean;
    left?: boolean;
    right?: boolean;
    home?: boolean;
    end?: boolean;
    pageUp?: boolean;
    pageDown?: boolean;
  };
  preventDefault(): void;
  stopPropagation(): void;
}

/**
 * Mouse event
 */
interface MouseEvent {
  x: number;
  y: number;
  button: MouseButton;
  action: MouseAction;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  preventDefault(): void;
  stopPropagation(): void;
}
```

### Interactive Mixin with Input Handling

```typescript
/**
 * Interactive mixin with keyboard and mouse support
 */
function Interactive<TBase extends Constructor<Node>>(Base: TBase) {
  return class InteractiveNode extends Base {
    // Event handlers
    onClick?: (event: MouseEvent) => void;
    onMouseDown?: (event: MouseEvent) => void;
    onMouseUp?: (event: MouseEvent) => void;
    onMouseMove?: (event: MouseEvent) => void;
    onMouseEnter?: (event: MouseEvent) => void;
    onMouseLeave?: (event: MouseEvent) => void;
    onKeyDown?: (event: KeyboardEvent) => void;
    onKeyUp?: (event: KeyboardEvent) => void;
    onKeyPress?: (event: KeyboardEvent) => void;
    onChange?: (event: InputEvent) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    
    // Focus state
    focused: boolean = false;
    disabled: boolean = false;
    tabIndex: number = 0;
    
    /**
     * Handle keyboard event
     */
    handleKeyboardEvent(event: KeyboardEvent): void {
      if (this.disabled) return;
      
      if (event.key.return || event.key.char) {
        this.onKeyPress?.(event);
      }
      
      this.onKeyDown?.(event);
    }
    
    /**
     * Handle mouse event
     */
    handleMouseEvent(event: MouseEvent): void {
      if (this.disabled) return;
      
      const bounds = this.getBounds();
      if (!this.containsPoint(event.x, event.y)) {
        return;
      }
      
      switch (event.action) {
        case MouseAction.PRESS:
          this.onMouseDown?.(event);
          break;
        case MouseAction.RELEASE:
          this.onMouseUp?.(event);
          if (event.button === MouseButton.LEFT) {
            this.onClick?.(event);
          }
          break;
        case MouseAction.MOVE:
          this.onMouseMove?.(event);
          break;
      }
    }
    
    /**
     * Check if point is within bounds
     */
    containsPoint(x: number, y: number): boolean {
      const bounds = this.getBounds();
      return (
        x >= bounds.x &&
        x < bounds.x + bounds.width &&
        y >= bounds.y &&
        y < bounds.y + bounds.height
      );
    }
    
    /**
     * Focus this node
     */
    focus(): void {
      if (this.disabled) return;
      this.focused = true;
      this.onFocus?.();
    }
    
    /**
     * Blur this node
     */
    blur(): void {
      this.focused = false;
      this.onBlur?.();
    }
  };
}
```

### Input System Integration

```typescript
/**
 * Input system manager
 */
class InputSystem {
  private keyboardHandler: KeyboardHandler;
  private mouseHandler: MouseHandler;
  private focusManager: FocusManager;
  private interactiveNodes: InteractiveNode[] = [];
  
  constructor() {
    this.keyboardHandler = new KeyboardHandler();
    this.mouseHandler = new MouseHandler();
    this.focusManager = new FocusManager();
  }
  
  /**
   * Register interactive node
   */
  registerNode(node: InteractiveNode): void {
    this.interactiveNodes.push(node);
    this.focusManager.register(node);
  }
  
  /**
   * Start input listening
   */
  startListening(rootNode: Node): void {
    startInputListener((chunk, key, mouse) => {
      if (mouse) {
        this.handleMouseInput(mouse);
      } else if (key) {
        this.handleKeyboardInput(key);
      }
    });
  }
  
  private handleMouseInput(mouse: MouseEvent): void {
    // Find nodes at mouse position (respecting z-index)
    const nodesAtPoint = this.findNodesAtPoint(mouse.x, mouse.y);
    
    // Handle mouse events (bubble up)
    for (const node of nodesAtPoint) {
      if ('handleMouseEvent' in node) {
        (node as InteractiveNode).handleMouseEvent(mouse);
        if (mouse.stopPropagation) break;
      }
    }
  }
  
  private handleKeyboardInput(key: KeyPress): void {
    const focused = this.focusManager.getFocused();
    
    if (focused && 'handleKeyboardEvent' in focused) {
      const event: KeyboardEvent = {
        key: this.mapKeyPress(key),
        preventDefault: () => {},
        stopPropagation: () => {},
      };
      (focused as InteractiveNode).handleKeyboardEvent(event);
    }
    
    // Handle Tab navigation
    if (key.tab) {
      this.focusManager.navigate(key.shift ? 'backward' : 'forward');
    }
  }
  
  private findNodesAtPoint(x: number, y: number): InteractiveNode[] {
    // Find all nodes at point, sorted by z-index
    const nodes: InteractiveNode[] = [];
    
    for (const node of this.interactiveNodes) {
      if ('containsPoint' in node && node.containsPoint(x, y)) {
        nodes.push(node);
      }
    }
    
    // Sort by z-index (highest first)
    return nodes.sort((a, b) => {
      const aZ = a.zIndex || 0;
      const bZ = b.zIndex || 0;
      return bZ - aZ;
    });
  }
}
```

## TSX Usage

### Component Definitions

All React component wrappers use TSX:

```tsx
/**
 * Text component - TSX wrapper for TextNode
 */
export function Text({ children, style, ...props }: TextProps): ReactNode {
  const node = useMemo(() => {
    const textNode = new TextNode();
    if (style) {
      textNode.setStyle(style);
    }
    // Apply other props...
    return textNode;
  }, [style, ...]);
  
  return <TextNodeWrapper node={node}>{children}</TextNodeWrapper>;
}

/**
 * View component - TSX wrapper for BoxNode
 */
export function View({ children, style, ...props }: ViewProps): ReactNode {
  const node = useMemo(() => {
    const boxNode = new BoxNode();
    if (style) {
      boxNode.setStyle(style);
    }
    // Apply other props...
    return boxNode;
  }, [style, ...]);
  
  return <BoxNodeWrapper node={node}>{children}</BoxNodeWrapper>;
}
```

### Node Factory with TSX

```typescript
/**
 * Node factory - creates nodes from React elements (TSX)
 */
class NodeFactory {
  static createNode(element: ReactElement, parent?: Node): Node {
    const type = element.type;
    const props = element.props;
    
    let node: Node;
    
    // Use TSX-friendly component names
    switch (type) {
      case 'text':
      case Text:
        node = new TextNode();
        if (props.children) {
          node.setContent(String(props.children));
        }
        break;
        
      case 'view':
      case 'box':
      case View:
      case Box:
        node = new BoxNode();
        break;
        
      case 'input':
      case Input:
        node = new InputNode();
        break;
        
      case 'button':
      case Button:
        node = new ButtonNode();
        break;
        
      case 'commandrouter':
      case CommandRouter:
        node = new CommandRouterNode(props);
        break;
        
      case 'command':
      case Command:
        node = new CommandNode(props);
        break;
        
      case 'route':
      case Route:
        node = new RouteNode(props);
        break;
        
      case 'default':
      case Default:
        node = new DefaultNode(props);
        break;
        
      default:
        throw new Error(`Unknown node type: ${type}`);
    }
    
    // Apply props using TSX-friendly APIs
    if (props.style && 'setStyle' in node) {
      (node as StylableNode).setStyle(props.style);
    }
    
    if (props.className && 'setClassName' in node) {
      (node as StylableNode).setClassName(props.className);
    }
    
    // Add event handlers
    if ('onClick' in props && 'onClick' in node) {
      (node as InteractiveNode).onClick = props.onClick;
    }
    if ('onKeyDown' in props && 'onKeyDown' in node) {
      (node as InteractiveNode).onKeyDown = props.onKeyDown;
    }
    // ... other event handlers
    
    // Add children (recursive TSX processing)
    if (props.children && Array.isArray(props.children)) {
      for (const child of props.children) {
        if (React.isValidElement(child)) {
          const childNode = NodeFactory.createNode(child, node);
          node.appendChild(childNode);
        }
      }
    }
    
    return node;
  }
}
```

## Example Compatibility

### All Examples Must Work

All existing examples must continue to work with the new architecture:

1. **Basic Examples**:
   - `examples/basic.tsx` - Basic component usage
   - `examples/flexbox.tsx` - Flexbox layout
   - `examples/grid.tsx` - Grid layout
   - `examples/responsive.tsx` - Responsive sizing

2. **Styling Examples**:
   - `examples/stylesheet.tsx` - StyleSheet API usage
   - `examples/stylesheet-borders.tsx` - Border styling
   - `examples/animations.tsx` - Animations

3. **Interactive Examples**:
   - `examples/event-handling.tsx` - Event handling
   - `examples/forms.tsx` - Form components
   - `examples/input-types.tsx` - Input types
   - `examples/selection.tsx` - Selection components
   - `examples/interactive.tsx` - Interactive components
   - `examples/mouse-example.tsx` - Mouse events

4. **CLI Examples**:
   - `examples/cli/basic-cli.tsx` - Basic CLI
   - `examples/cli/commands-with-params.tsx` - Command parameters
   - `examples/cli/help-customization.tsx` - Help customization
   - `examples/cli/mixed-mode.tsx` - Mixed mode
   - `examples/cli/nested-commands.tsx` - Nested commands
   - `examples/cli/path-based-commands.tsx` - Path-based commands
   - `examples/cli/routes-only.tsx` - Routes only
   - `examples/cli/single-component.tsx` - Single component

5. **Other Examples**:
   - `examples/state-hooks.tsx` - State hooks
   - `examples/fullscreen.tsx` - Fullscreen mode

### Compatibility Strategy

1. **API Compatibility**: All React component APIs remain identical
2. **Style Compatibility**: StyleSheet API and inline styles work identically
3. **Event Compatibility**: Event handling APIs remain the same
4. **CLI Compatibility**: CommandRouter APIs remain the same
5. **Internal Refactoring**: Only internal implementation changes (nodes use classes instead of plain objects)

### Migration Testing

```typescript
/**
 * Test suite for example compatibility
 */
describe('Example Compatibility', () => {
  test('basic.tsx should work', () => {
    // Test basic example
  });
  
  test('flexbox.tsx should work', () => {
    // Test flexbox example
  });
  
  test('stylesheet.tsx should work', () => {
    // Test stylesheet example
  });
  
  test('event-handling.tsx should work', () => {
    // Test event handling example
  });
  
  test('cli/basic-cli.tsx should work', () => {
    // Test CLI example
  });
  
  // ... all other examples
});
```

## Architecture Structure Verification

### Object-Oriented Design with Inheritance

The architecture follows proper object-oriented principles:

1. **Base Class Hierarchy**:
   ```typescript
   abstract class Node {
     // Core functionality: identity, tree structure, box model
   }
   
   // Concrete node classes inherit from Node with mixin composition
   class TextNode extends Stylable(Renderable(Node)) { }
   class BoxNode extends Stylable(Renderable(Layoutable(Node))) { }
   class InputNode extends Stylable(Renderable(Interactive(Node))) { }
   ```

2. **Inheritance Chain**:
   - All nodes inherit from `Node` (single inheritance)
   - Mixins add capabilities (composition over inheritance)
   - Clear hierarchy: Node → Mixins → Concrete Classes

3. **Encapsulation**:
   - Protected properties for internal state
   - Public methods for external API
   - Abstract methods for required implementations

### Type-Safe Generics

Generics are used throughout for type safety:

1. **Mixin Generics**:
   ```typescript
   function Stylable<TBase extends Constructor<Node>>(Base: TBase) {
     return class StylableNode extends Base { }
   }
   ```
   - Constrains mixins to work only with Node subclasses
   - Preserves type information through composition

2. **Style Mixin Generics**:
   ```typescript
   interface StyleMixin<TNode extends Node = Node> {
     appliesTo(node: Node): node is TNode;
     apply(node: TNode): void;
   }
   ```
   - Type-safe style mixin application
   - Type guards for runtime type checking

3. **Registry Generics**:
   ```typescript
   static register<TNode extends Node>(mixin: StyleMixin<TNode>): void
   ```
   - Type-safe mixin registration

### Mixin Pattern

Mixins are properly implemented using TypeScript's mixin pattern:

1. **Capability Mixins** (Cross-cutting concerns):
   - `Stylable<TBase>` - Adds styling capabilities
   - `Renderable<TBase>` - Adds rendering capabilities
   - `Layoutable<TBase>` - Adds layout capabilities
   - `Interactive<TBase>` - Adds interactive capabilities

2. **Style Mixins** (Runtime style application):
   - `BaseStyleMixin` - Base styles for all nodes
   - `TextStyleMixin` - Text-specific styles
   - `BoxStyleMixin` - Box-specific styles
   - `BorderStyleMixin` - Border-specific styles

3. **Mixin Composition**:
   ```typescript
   // Multiple mixins can be composed
   class BoxNode extends Stylable(Renderable(Layoutable(Node))) { }
   ```
   - Type-safe composition
   - Order matters (later mixins can override earlier ones)

### Type Safety

Type safety is ensured through:

1. **Const Enums**: All string literals replaced with const enums
   ```typescript
   export const Position = { RELATIVE: 'relative', ... } as const;
   export type Position = typeof Position[keyof typeof Position];
   ```

2. **Type Guards**: Runtime type checking
   ```typescript
   appliesTo(node: Node): node is TNode
   ```

3. **Generic Constraints**: Type constraints on generics
   ```typescript
   <TBase extends Constructor<Node>>
   ```

4. **Abstract Methods**: Required implementations
   ```typescript
   abstract getNodeType(): string;
   abstract render(...): RenderResult;
   ```

### Organization and Coordination

The architecture is well-organized:

1. **Separation of Concerns**:
   - `Node` - Core functionality
   - `Stylable` - Styling concerns
   - `Renderable` - Rendering concerns
   - `Layoutable` - Layout concerns
   - `Interactive` - Interaction concerns

2. **File Structure**:
   ```
   nodes/
     base/
       Node.ts              # Base class
       mixins/              # Capability mixins
   style/
     mixins/                # Style mixins
   ```

3. **Type Definitions**:
   - All types defined in dedicated sections
   - Enums defined as const for type safety
   - Interfaces for data structures

4. **Consistent Patterns**:
   - All mixins follow same pattern
   - All nodes follow same structure
   - All style mixins follow same interface

### Verification Checklist

✅ **Inheritance**: All nodes inherit from `Node` base class  
✅ **Generics**: Used throughout for type safety  
✅ **Mixins**: Properly implemented with type-safe composition  
✅ **Type Safety**: Const enums, type guards, generic constraints  
✅ **Organization**: Clear separation of concerns, consistent patterns  
✅ **Coordination**: Well-structured file organization, consistent APIs  

## Benefits of This Architecture

1. **Unified Box Model**: All nodes have consistent box model support
2. **Type-Safe Mixins**: Compile-time type safety for mixin composition
3. **Modular Design**: Base classes and mixins for different concerns
4. **Component Tree Tracking**: Track component instances like React fibers
5. **Rendering Tree**: Know exactly what's in the buffer for each component
6. **Stacking Context**: Proper z-index management like CSS
7. **Viewport/Clipping**: Track visible areas for scrollable containers
8. **Encapsulation**: Each node type encapsulates its own behavior
9. **Type Safety**: Strong typing through class hierarchy and generics
10. **Extensibility**: Easy to add new node types and style mixins
11. **Maintainability**: Clear separation of concerns
12. **Consistency**: Uniform API across all node types
13. **Performance**: Potential for better optimization through class methods
14. **React/HTML/CSS Alignment**: Works similarly to how React, HTML, and CSS work
15. **React Native Style API**: Full support for React Native-style components and StyleSheet API
16. **CommandRouter Integration**: Seamless CLI command/router system integration
17. **Keyboard/Mouse Input**: Built-in support for keyboard and mouse event handling
18. **TSX-First**: Use TSX syntax throughout for better developer experience
19. **Example Compatibility**: All existing examples continue to work

## Migration Path

1. Implement new classes with mixin composition
2. Replace existing render functions with class methods
3. Update hostConfig to use new classes
4. Integrate StyleSheet API with new style system
5. Integrate CommandRouter nodes with new architecture
6. Integrate keyboard/mouse input system
7. Test all examples for compatibility
8. Comprehensive testing
9. **Cleanup Phase**:
   - **Code Cleanup**:
     - Remove obsolete files and code
     - Remove old procedural rendering functions (`renderTextNode`, `renderBoxNode`, etc.)
     - Remove old style resolution utilities (if replaced by new style system)
     - Remove old node data structures (`ConsoleNode`, etc. if replaced by class-based nodes)
     - Remove deprecated APIs and interfaces
     - Clean up unused imports and dependencies
     - Remove old renderer/layout/style files if replaced by new architecture
     - Consolidate duplicate functionality
     - Remove deprecated files (e.g., `parserEnhanced.ts` if fully merged, deprecated layout files)
   
   - **File Cleanup**:
     - Remove old renderer files if replaced by new class-based renderer
     - Remove old layout files if replaced by new layout system
     - Remove old style files if replaced by new style system
     - Clean up deprecated barrel exports
     - Remove unused utility files
     - Consolidate similar functionality
   
   - **Documentation Cleanup**:
     - Update documentation to reflect new architecture
     - Remove outdated documentation
     - Update API documentation
     - Update examples documentation
     - Update migration guides
     - Remove references to old architecture
   
   - **Test Cleanup**:
     - Remove obsolete tests
     - Update test files to use new architecture
     - Remove test utilities that are no longer needed
     - Consolidate test helpers
     - Update test mocks and fixtures
   
   - **Configuration Cleanup**:
     - Update build configuration if needed
     - Update TypeScript configuration if needed
     - Remove unused build scripts
     - Clean up package.json dependencies
     - Remove unused dev dependencies
   
   - **Verification**:
     - Verify all examples still work after cleanup
     - Verify all tests pass after cleanup
     - Verify no broken imports or references
     - Run full test suite
     - Performance regression testing
     - Check for any remaining references to old code

## Example Usage

### React Native-Style Components with StyleSheet

```tsx
import { StyleSheet, View, Text, Button } from 'react-console';

const styles = StyleSheet.create({
  container: {
    padding: 2,
    border: 'single',
    backgroundColor: 'blue',
  },
  title: {
    color: 'white',
    bold: true,
  },
  button: {
    backgroundColor: 'green',
    color: 'white',
    padding: 1,
  },
});

function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My App</Text>
      <Button
        style={styles.button}
        onClick={(e) => console.log('Clicked!', e.x, e.y)}
        onKeyDown={(e) => {
          if (e.key.return) console.log('Enter pressed');
        }}
      >
        Click Me
      </Button>
    </View>
  );
}
```

### CommandRouter Integration

```tsx
import { CommandRouter, Command, Route, Default, View, Text } from 'react-console';

function App() {
  return (
    <CommandRouter description="My CLI App">
      <Default>
        <View>
          <Text>Welcome to My CLI App</Text>
        </View>
      </Default>
      <Command name="build">
        <View>
          <Text>Building...</Text>
        </View>
      </Command>
      <Route path="/settings">
        <View>
          <Text>Settings</Text>
        </View>
      </Route>
    </CommandRouter>
  );
}
```

### Keyboard and Mouse Events

```tsx
import { View, Button, Input } from 'react-console';

function InteractiveApp() {
  return (
    <View>
      <Button
        onClick={(e) => console.log('Clicked at', e.x, e.y)}
        onMouseEnter={(e) => console.log('Mouse entered')}
        onMouseLeave={(e) => console.log('Mouse left')}
        onKeyDown={(e) => {
          if (e.key.return) console.log('Enter pressed');
          if (e.key.escape) console.log('Escape pressed');
        }}
      >
        Interactive Button
      </Button>
      <Input
        onKeyDown={(e) => console.log('Key:', e.key.char)}
        onChange={(e) => console.log('Value:', e.value)}
      />
    </View>
  );
}
```
