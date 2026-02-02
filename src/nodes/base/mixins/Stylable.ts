/**
 * Stylable Mixin - Adds styling capabilities to nodes
 * Type-safe using generics
 */

import type {
  Constructor,
  AbstractConstructor,
  StyleMap,
  BorderInfo,
  BorderWidth,
  Margin,
  Padding,
  BorderStyle,
  Position,
} from '../types';
import { BorderStyle as BorderStyleEnum } from '../types';
import { Node } from '../Node';
import { StyleMixinRegistry } from '../../../style/mixins/registry';

/**
 * Computed style class (placeholder - will be fully implemented with style system)
 */
export class ComputedStyle {
  readonly styles: StyleMap;

  constructor(styles: StyleMap) {
    this.styles = styles;
  }

  getProperty(key: string): unknown {
    return this.styles[key];
  }

  getColor(): string | null {
    const color = this.styles.color;
    return typeof color === 'string' ? color : null;
  }

  getBackgroundColor(): string | null {
    const bg = this.styles.backgroundColor;
    return typeof bg === 'string' ? bg : null;
  }

  getBorderColor(): string | null {
    const bc = this.styles.borderColor;
    return typeof bc === 'string' ? bc : null;
  }

  getBorderBackgroundColor(): string | null {
    const bbg = this.styles.borderBackgroundColor;
    return typeof bbg === 'string' ? bbg : null;
  }

  getPosition(): string {
    const pos = this.styles.position;
    return typeof pos === 'string' ? pos : 'relative';
  }

  getZIndex(): number | null {
    const z = this.styles.zIndex;
    return typeof z === 'number' ? z : null;
  }

  getDisplay(): string {
    const d = this.styles.display;
    return typeof d === 'string' ? d : 'block';
  }

  getBold(): boolean {
    // Support both 'bold: true' and CSS-like 'fontWeight: bold'
    if (this.styles.bold === true) return true;
    const fontWeight = this.styles.fontWeight;
    return (
      fontWeight === 'bold' ||
      fontWeight === 700 ||
      (typeof fontWeight === 'number' && fontWeight >= 700)
    );
  }

  getDim(): boolean {
    return this.styles.dim === true;
  }

  getItalic(): boolean {
    // Support both 'italic: true' and CSS-like 'fontStyle: italic'
    if (this.styles.italic === true) return true;
    return this.styles.fontStyle === 'italic';
  }

  getUnderline(): boolean {
    // Support both 'underline: true' and CSS-like 'textDecoration: underline'
    if (this.styles.underline === true) return true;
    const textDeco = this.styles.textDecoration;
    return textDeco === 'underline';
  }

  getStrikethrough(): boolean {
    // Support both 'strikethrough: true' and CSS-like 'textDecoration: line-through'
    if (this.styles.strikethrough === true) return true;
    const textDeco = this.styles.textDecoration;
    return textDeco === 'line-through';
  }

  getInverse(): boolean {
    return this.styles.inverse === true;
  }

  getTextAlign(): 'left' | 'center' | 'right' {
    const ta = this.styles.textAlign;
    if (ta === 'center' || ta === 'right') return ta;
    return 'left';
  }
}

/**
 * Theme type (placeholder - will be properly typed later)
 */
export type Theme = Record<string, unknown>;

/**
 * Style resolver - Resolves styles through cascade with mixin support
 */
class StyleResolver {
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

    // 2. Theme styles (placeholder - will be fully implemented)
    if (theme) {
      // Theme resolution will be added later
    }

    // 3. Style mixin styles (in priority order)
    for (const mixinName of appliedStyleMixins) {
      const mixin = StyleMixinRegistry.get(mixinName);
      if (mixin && mixin.appliesTo(node)) {
        const mixinStyle = mixin.getDefaultStyle();
        resolved = this.mergeStyles(resolved, mixinStyle);
      }
    }

    // 4. Class styles (placeholder - will be fully implemented)
    if (className.length > 0) {
      // Class style resolution will be added later
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

      // Also add BaseStyle inheritable properties (color, backgroundColor)
      inheritableProps.add('color');
      inheritableProps.add('backgroundColor');

      for (const prop of inheritableProps) {
        const currentValue = resolved[prop];
        // If current value is 'inherit' or undefined/null, inherit from parent
        if (currentValue === 'inherit' || currentValue === undefined || currentValue === null) {
          const parentValue = parentStyle.getProperty(prop);
          if (parentValue !== null && parentValue !== undefined && parentValue !== 'inherit') {
            inherited[prop] = parentValue;
          }
        }
      }
    }

    // 6. Inline styles (highest priority)
    resolved = this.mergeStyles(resolved, inherited, inlineStyle);

    return new ComputedStyle(resolved);
  }

  private mergeStyles(...styles: StyleMap[]): StyleMap {
    return Object.assign({}, ...styles);
  }
}

/**
 * Mixin that adds styling capabilities to a node
 * Type-safe using generics
 * Accepts both concrete and abstract constructors
 */
export function Stylable<TBase extends Constructor<Node> | AbstractConstructor<Node>>(Base: TBase) {
  // Mixins return classes that extend Base, but the final composed class will implement abstract methods
  // TypeScript requires implementation, but we use type assertion to allow abstract methods in mixins
  return class StylableNode extends (Base as Constructor<Node>) {
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
      const parentStyle =
        this.parent && 'computeStyle' in this.parent
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
    updateBoxModelFromStyle(style: StyleMap): void {
      // Helper to extract number value
      const toNumber = (val: unknown): number | undefined =>
        typeof val === 'number' ? val : undefined;

      // Handle margin - object form or individual properties
      if (style.margin !== undefined) {
        const margin = style.margin;
        if (typeof margin === 'number' || typeof margin === 'object') {
          this.margin = this.normalizeSpacing(margin as number | Margin) as Margin;
        }
      }
      // Individual margin properties override object form
      const marginTop = toNumber(style.marginTop);
      const marginRight = toNumber(style.marginRight);
      const marginBottom = toNumber(style.marginBottom);
      const marginLeft = toNumber(style.marginLeft);
      const marginHorizontal = toNumber(style.marginHorizontal);
      const marginVertical = toNumber(style.marginVertical);

      if (marginTop !== undefined) this.margin.top = marginTop;
      if (marginRight !== undefined) this.margin.right = marginRight;
      if (marginBottom !== undefined) this.margin.bottom = marginBottom;
      if (marginLeft !== undefined) this.margin.left = marginLeft;
      if (marginHorizontal !== undefined) {
        this.margin.left = marginHorizontal;
        this.margin.right = marginHorizontal;
      }
      if (marginVertical !== undefined) {
        this.margin.top = marginVertical;
        this.margin.bottom = marginVertical;
      }

      // Handle padding - object form or individual properties
      if (style.padding !== undefined) {
        const padding = style.padding;
        if (typeof padding === 'number' || typeof padding === 'object') {
          this.padding = this.normalizeSpacing(padding as number | Padding) as Padding;
        }
      }
      // Individual padding properties override object form
      const paddingTop = toNumber(style.paddingTop);
      const paddingRight = toNumber(style.paddingRight);
      const paddingBottom = toNumber(style.paddingBottom);
      const paddingLeft = toNumber(style.paddingLeft);
      const paddingHorizontal = toNumber(style.paddingHorizontal);
      const paddingVertical = toNumber(style.paddingVertical);

      if (paddingTop !== undefined) this.padding.top = paddingTop;
      if (paddingRight !== undefined) this.padding.right = paddingRight;
      if (paddingBottom !== undefined) this.padding.bottom = paddingBottom;
      if (paddingLeft !== undefined) this.padding.left = paddingLeft;
      if (paddingHorizontal !== undefined) {
        this.padding.left = paddingHorizontal;
        this.padding.right = paddingHorizontal;
      }
      if (paddingVertical !== undefined) {
        this.padding.top = paddingVertical;
        this.padding.bottom = paddingVertical;
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

      if (style.position !== undefined && typeof style.position === 'string') {
        this.position = style.position as Position;
      }
      if (style.top !== undefined) {
        const top = style.top;
        this.top = typeof top === 'number' || typeof top === 'string' ? top : null;
      }
      if (style.left !== undefined) {
        const left = style.left;
        this.left = typeof left === 'number' || typeof left === 'string' ? left : null;
      }
      if (style.right !== undefined) {
        const right = style.right;
        this.right = typeof right === 'number' || typeof right === 'string' ? right : null;
      }
      if (style.bottom !== undefined) {
        const bottom = style.bottom;
        this.bottom = typeof bottom === 'number' || typeof bottom === 'string' ? bottom : null;
      }
      if (style.zIndex !== undefined && typeof style.zIndex === 'number') {
        this.zIndex = style.zIndex;
      }
    }

    normalizeSpacing(spacing: number | Margin | Padding): Margin | Padding {
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

    normalizeBorder(style: StyleMap): BorderInfo {
      const border = style.border;
      const borderWidth = style.borderWidth;
      const borderStyle = (
        typeof style.borderStyle === 'string' ? style.borderStyle : BorderStyleEnum.SINGLE
      ) as BorderStyle;
      const borderColor = typeof style.borderColor === 'string' ? style.borderColor : null;
      const borderBackgroundColor =
        typeof style.borderBackgroundColor === 'string' ? style.borderBackgroundColor : null;

      // Type for border object with individual sides
      interface BorderSides {
        top?: boolean;
        right?: boolean;
        bottom?: boolean;
        left?: boolean;
      }

      // Type for border width object with individual sides
      interface BorderWidthSides {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
      }

      // Handle border show: true for all sides, or object with individual sides
      let show = { top: false, right: false, bottom: false, left: false };
      if (border === true) {
        // border: true means show all borders
        show = { top: true, right: true, bottom: true, left: true };
      } else if (typeof border === 'object' && border !== null) {
        // border: { top: true, right: true, ... } for individual sides
        const borderObj = border as BorderSides;
        show = {
          top: borderObj.top ?? false,
          right: borderObj.right ?? false,
          bottom: borderObj.bottom ?? false,
          left: borderObj.left ?? false,
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
          const bwObj = borderWidth as BorderWidthSides;
          width = {
            top: bwObj.top ?? 0,
            right: bwObj.right ?? 0,
            bottom: bwObj.bottom ?? 0,
            left: bwObj.left ?? 0,
          };
        }
      } else if (show.top || show.right || show.bottom || show.left) {
        // Default width is 1 if border is enabled but width not specified
        width = { top: 1, right: 1, bottom: 1, left: 1 };
      }

      return {
        show,
        width,
        style: borderStyle,
        color: borderColor,
        backgroundColor: borderBackgroundColor,
      };
    }

    markChildrenStyleDirty(): void {
      for (const child of this.children) {
        if ('styleDirty' in child) {
          (child as StylableNode).styleDirty = true;
          (child as StylableNode).markChildrenStyleDirty();
        }
      }
    }

    // This method must be implemented by classes using this mixin
    // We don't make it abstract here because mixins can't be abstract
    // Classes that use this mixin must implement it
    getDefaultStyle(): StyleMap {
      throw new Error('getDefaultStyle() must be implemented by classes using Stylable mixin');
    }
  };
}
