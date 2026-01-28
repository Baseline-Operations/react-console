/**
 * Text node - renders text content
 * Composed with Stylable and Renderable mixins
 */

import { Node } from '../base/Node';
import { Stylable, Renderable, Layoutable, type OutputBuffer, type RenderContext, type RenderResult } from '../base/mixins';
import type { LayoutConstraints, LayoutResult, Dimensions } from '../base/mixins/Layoutable';
import type { StyleMap } from '../base/types';
import { StyleMixinRegistry } from '../../style/mixins/registry';
import { measureText, wrapText, padToVisibleColumn, substringToVisibleColumn, substringFromVisibleColumn } from '../../utils/measure';
import { applyStyles } from '../../renderer/ansi';

/**
 * Text metrics
 */
interface TextMetrics {
  width: number;
  height: number;
  visibleWidth: number;
}

/**
 * Text node - renders text content
 * Composed with Stylable and Renderable mixins
 */
export class TextNode extends Stylable(Renderable(Layoutable(Node as any))) {
  private wrappedLines: string[] = [];
  
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
    const style = this.computeStyle();
    const content = this.content || '';
    
    // Always recalculate wrapped lines (they depend on constraints which may change)
    let metrics: any;
    if (!content) {
      this.wrappedLines = [''];
      metrics = { width: 0 };
    } else {
      // Ensure maxWidth is at least 1 to avoid issues with text measurement
      const safeMaxWidth = Math.max(1, constraints.maxWidth ?? Infinity);
      metrics = this.measureText(content, style, { ...constraints, maxWidth: safeMaxWidth });
      this.wrappedLines = this.wrapText(content, style, safeMaxWidth);
    }
    
    const borderWidth = this.border.width;
    // Ensure dimensions are at least 1x1 to ensure text is always visible
    let contentWidth = Math.max(1, metrics.width);
    const contentHeight = Math.max(1, this.wrappedLines.length);
    
    // For text alignment to work, TextNode needs to expand to parent's width
    // when textAlign is center or right (otherwise alignment has no visible effect)
    const textAlign = style.getTextAlign?.() || 'left';
    if ((textAlign === 'center' || textAlign === 'right') && constraints.availableWidth) {
      // Expand to fill available width (like block-level text elements in HTML)
      const availableContentWidth = constraints.availableWidth - borderWidth.left - borderWidth.right - this.padding.left - this.padding.right;
      contentWidth = Math.max(contentWidth, availableContentWidth);
    }
    
    const totalWidth = Math.max(1, contentWidth + borderWidth.left + borderWidth.right + this.padding.left + this.padding.right);
    const totalHeight = Math.max(1, contentHeight + borderWidth.top + borderWidth.bottom + this.padding.top + this.padding.bottom);
    
    const dimensions: Dimensions = {
      width: totalWidth,
      height: totalHeight,
      contentWidth: contentWidth,
      contentHeight: contentHeight,
    };
    
    this.bounds = {
      x: 0,
      y: 0,
      width: dimensions.width,
      height: dimensions.height,
    };
    
    this.contentArea = this.calculateContentArea();
    
    return {
      dimensions,
      layout: {},
      bounds: this.bounds,
      children: [], // Text nodes don't have children to lay out
    };
  }
  
  render(buffer: OutputBuffer, context: RenderContext): RenderResult {
    const style = this.computeStyle();
    const layout = this.computeLayout(context.constraints);
    
    // Update bounds from layout
    this.bounds = {
      ...layout.bounds,
      x: context.x,
      y: context.y,
    };
    
    // Calculate content area
    this.contentArea = this.calculateContentArea();
    
    // 1. Render background
    // For TextNode children of BoxNode, the parent BoxNode already renders its background
    // So we skip rendering TextNode's background to avoid overwriting the parent's background
    // Only render if TextNode has an explicit background that's different from parent
    const bgColor = style.getBackgroundColor();
    
    // Render background if TextNode has an explicit background
    // For items with backgroundColor, we should render it (like HTML/CSS)
    // The parent BoxNode's background is rendered separately, but TextNode's background should also render
    if (bgColor && bgColor !== 'inherit' && bgColor !== 'transparent') {
      this.renderBackground(buffer, style, context);
    }
    
    // 2. Render text content
    // wrappedLines is calculated in computeLayout, but ensure we have content
    const content = this.content || '';
    // For TextNode, context.x/y from parent BoxNode is the content area position
    // Use it directly for text rendering
    let currentY = context.y;
    if (content) {
      // Ensure we have wrappedLines (should be set by computeLayout)
      if (!this.wrappedLines || this.wrappedLines.length === 0) {
        // Fallback: wrap the content if wrappedLines is missing
        const safeMaxWidth = Math.max(1, context.constraints.maxWidth ?? Infinity);
        this.wrappedLines = this.wrapText(content, style, safeMaxWidth);
      }
      
      // Get text alignment and available width for alignment calculation
      const textAlign = style.getTextAlign?.() || 'left';
      const availableWidth = context.constraints.maxWidth ?? this.bounds?.width ?? 80;
      
      // Render all non-empty lines
      for (const line of this.wrappedLines) {
        if (line && line.trim().length > 0) {
          // Calculate X position based on text alignment
          const lineWidth = measureText(line);
          let lineX = context.x;
          
          if (textAlign === 'center') {
            lineX = context.x + Math.floor((availableWidth - lineWidth) / 2);
          } else if (textAlign === 'right') {
            lineX = context.x + availableWidth - lineWidth;
          }
          // 'left' is default, no adjustment needed
          
          this.renderLine(buffer, line, style, lineX, currentY, context);
          currentY++;
        }
      }
    }
    
    // 3. Render border
    this.renderBorder(buffer, style, context);
    
    // 4. Register rendering info
    const bufferRegion = {
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
      bounds: this.bounds,
    };
  }
  
  private measureText(
    content: string,
    style: any,
    _constraints: LayoutConstraints
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
    _style: any,
    maxWidth: number
  ): string[] {
    if (!content) return [];
    
    // Don't apply styles here - styling is done in renderLine
    // Applying styles here causes double-styling (once here, once in renderLine)
    return wrapText(content, maxWidth);
  }
  
  private renderLine(
    buffer: OutputBuffer,
    line: string,
    style: any,
    x: number,
    y: number,
    _context: RenderContext
  ): void {
    while (buffer.lines.length <= y) {
      buffer.lines.push('');
    }
    
    const currentLine = buffer.lines[y] || '';
    
    // Use computed style's backgroundColor - it already handles inheritance via StyleResolver
    // Ink-style: backgroundColor is inherited through style resolution, not manual parent lookup
    // The style.computeStyle() already resolved 'inherit' values from parentStyle
    const bgColor = style.getBackgroundColor();
    
    const styledLine = applyStyles(line, {
      color: style.getColor(),
      backgroundColor: bgColor,
      bold: style.getBold(),
      dim: style.getDim(),
      italic: style.getItalic(),
      underline: style.getUnderline(),
      strikethrough: style.getStrikethrough(),
      inverse: style.getInverse(),
    });
    
    // Ink-style replace-in-range: preserve "before" and "after" so we don't overwrite
    // adjacent content (e.g. sibling boxes, borders). Previously we did
    // padToVisibleColumn(line,x)+styledLine which discarded everything after the text.
    const lineWidth = measureText(line);
    const before = padToVisibleColumn(substringToVisibleColumn(currentLine, x), x);
    let after = substringFromVisibleColumn(currentLine, x + lineWidth);
    
    // CRITICAL: Re-apply parent's background color to the "after" portion
    // The styledLine ends with \x1b[0m (reset), which clears all styling.
    // The "after" portion was extracted from the middle of the original line,
    // so it lost the background color that was set at position 0.
    // We need to restore the parent's background so gaps between children
    // maintain the parent container's background color.
    // Walk up the node's tree parent chain to find actual effective background
    // (not context.parent which may be 'this' for the parent node)
    if (after) {
      let current = this.parent;
      let parentBgColor: string | null = null;
      while (current) {
        if ('computeStyle' in current) {
          const style = (current as any).computeStyle();
          const bgColor = style.getBackgroundColor();
          if (bgColor && bgColor !== 'inherit' && bgColor !== 'transparent') {
            parentBgColor = bgColor;
            break;
          }
        }
        current = (current as any).parent || null;
      }
      if (parentBgColor) {
        const { getBackgroundColorCode } = require('../../renderer/ansi');
        const parentBgCode = getBackgroundColorCode(parentBgColor);
        if (parentBgCode) {
          after = parentBgCode + after;
        }
      }
    }
    
    buffer.lines[y] = before + styledLine + after;
  }
  
  /**
   * Render to cell buffer (multi-buffer system)
   */
  renderToCellBuffer(context: import('../../buffer').CellRenderContext): void {
    const style = this.computeStyle();
    const { buffer, x, y, maxWidth, maxHeight, layerId, nodeId, zIndex } = context;
    
    // Get colors from style
    const foreground = style.getColor() || context.foreground;
    const background = style.getBackgroundColor() || context.background;
    
    // Get text styles
    const bold = style.getBold();
    const dim = style.getDim();
    const italic = style.getItalic();
    const underline = style.getUnderline();
    const strikethrough = style.getStrikethrough();
    const inverse = style.getInverse();
    
    // Render background if set
    if (background && background !== 'inherit' && background !== 'transparent') {
      buffer.fillBackground(x, y, maxWidth, maxHeight, background, layerId, nodeId, zIndex);
    }
    
    // Render text content
    const content = this.content || '';
    if (!content) return;
    
    // Get text alignment
    const textAlign = style.getTextAlign?.() || 'left';
    
    // Wrap text if needed
    const wrappedLines = wrapText(content, maxWidth);
    let cy = y;
    
    for (const line of wrappedLines) {
      if (cy >= y + maxHeight) break;
      
      // Calculate X position based on text alignment
      const lineWidth = measureText(line);
      let lineStartX = x;
      
      if (textAlign === 'center') {
        lineStartX = x + Math.floor((maxWidth - lineWidth) / 2);
      } else if (textAlign === 'right') {
        lineStartX = x + maxWidth - lineWidth;
      }
      // 'left' is default, no adjustment needed
      
      let cx = lineStartX;
      for (const char of line) {
        if (cx >= x + maxWidth) break;
        if (cx < x) {
          cx++;
          continue; // Skip characters that would be before the content area
        }
        
        buffer.setCell(cx, cy, {
          char,
          foreground,
          background,
          bold,
          dim,
          italic,
          underline,
          strikethrough,
          inverse,
          layerId,
          nodeId,
          zIndex,
        });
        
        cx++;
      }
      
      cy++;
    }
  }
}
