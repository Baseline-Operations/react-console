/**
 * Stylable Mixin - Adds styling capabilities to nodes
 * Type-safe using generics
 */

import type { Constructor, StyleMap, BorderInfo, BorderWidth, Margin, Padding, BorderStyle } from '../types';
import { BorderStyle as BorderStyleEnum } from '../types';
import { Node } from '../Node';
import { StyleMixinRegistry } from '../../../style/mixins/registry';

/**
 * Computed style class (placeholder - will be fully implemented with style system)
 */
export class ComputedStyle {
  private styles: StyleMap;
  
  constructor(styles: StyleMap) {
    this.styles = styles;
  }
  
  getProperty(key: string): any {
    return this.styles[key];
  }
  
  getColor(): string | null {
    return this.styles.color || null;
  }
  
  getBackgroundColor(): string | null {
    return this.styles.backgroundColor || null;
  }
  
  getBorderColor(): string | null {
    return this.styles.borderColor || null;
  }
  
  getBorderBackgroundColor(): string | null {
    return this.styles.borderBackgroundColor || null;
  }
  
  getPosition(): string {
    return this.styles.position || 'relative';
  }
  
  getZIndex(): number | null {
    return this.styles.zIndex ?? null;
  }
  
  getDisplay(): string {
    return this.styles.display || 'block';
  }
  
  getBold(): boolean {
    // Support both 'bold: true' and CSS-like 'fontWeight: bold'
    if (this.styles.bold) return true;
    const fontWeight = this.styles.fontWeight;
    return fontWeight === 'bold' || fontWeight === 700 || (typeof fontWeight === 'number' && fontWeight >= 700);
  }
  
  getDim(): boolean {
    return this.styles.dim || false;
  }
  
  getItalic(): boolean {
    // Support both 'italic: true' and CSS-like 'fontStyle: italic'
    if (this.styles.italic) return true;
    return this.styles.fontStyle === 'italic';
  }
  
  getUnderline(): boolean {
    // Support both 'underline: true' and CSS-like 'textDecoration: underline'
    if (this.styles.underline) return true;
    const textDeco = this.styles.textDecoration;
    return textDeco === 'underline';
  }
  
  getStrikethrough(): boolean {
    // Support both 'strikethrough: true' and CSS-like 'textDecoration: line-through'
    if (this.styles.strikethrough) return true;
    const textDeco = this.styles.textDecoration;
    return textDeco === 'line-through';
  }
  
  getInverse(): boolean {
    return this.styles.inverse || false;
  }
  
  getTextAlign(): 'left' | 'center' | 'right' {
    return (this.styles.textAlign as 'left' | 'center' | 'right') || 'left';
  }
}

/**
 * Theme type (placeholder - will be properly typed later)
 */
export type Theme = any;

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
 */
export function Stylable<TBase extends Constructor<Node>>(Base: TBase) {
  // Mixins return classes that extend Base, but the final composed class will implement abstract methods
  // TypeScript requires implementation, but we use type assertion to allow abstract methods in mixins
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
    updateBoxModelFromStyle(style: StyleMap): void {
      if (style.margin !== undefined) {
        this.margin = this.normalizeSpacing(style.margin) as Margin;
      }
      
      if (style.padding !== undefined) {
        this.padding = this.normalizeSpacing(style.padding) as Padding;
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
      const borderStyle = (style.borderStyle as BorderStyle) || BorderStyleEnum.SINGLE;
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
