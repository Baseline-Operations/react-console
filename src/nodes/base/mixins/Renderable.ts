/**
 * Renderable Mixin - Adds rendering capabilities to nodes
 * Uses the multi-buffer system for all rendering
 */

import type { Constructor, BoundingBox } from '../types';
import { Node } from '../Node';
import type { ComputedStyle } from './Stylable';
import { RenderingTreeRegistry } from '../../../render/RenderingTree';
import { StackingContextManager } from '../../../render/StackingContext';
import { ViewportManager } from '../../../render/Viewport';
import { getBackgroundColorCode, applyStyles } from '../../../renderer/ansi';
import {
  padToVisibleColumn,
  replaceAtVisibleColumn,
  substringToVisibleColumn,
  substringFromVisibleColumn,
} from '../../../utils/measure';

/**
 * Legacy output buffer type - kept for method signatures during transition
 * All actual rendering uses CellBuffer from the multi-buffer system
 */
export interface OutputBuffer {
  lines: string[];
  cursorX: number;
  cursorY: number;
}

/**
 * Theme type for styling
 */
export interface Theme {
  colors?: Record<string, string>;
  styles?: Record<string, unknown>;
}

/**
 * Viewport type for clipping
 */
export interface Viewport {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Render context type (placeholder - will be fully defined in Phase 3)
 */
export interface RenderContext {
  buffer: OutputBuffer;
  x: number;
  y: number;
  constraints: {
    maxWidth: number;
    maxHeight?: number;
    availableWidth: number;
    availableHeight?: number;
  };
  parent?: Node | null;
  theme?: Theme | null;
  viewport?: Viewport | null;
}

/**
 * Render result type
 */
export interface RenderResult {
  endX: number;
  endY: number;
  width: number;
  height: number;
  bounds?: BoundingBox;
}

/**
 * Stacking context type
 */
export interface StackingContext {
  zIndex: number;
  parent?: StackingContext | null;
}

/**
 * Rendering info type (placeholder - will be fully defined in Phase 3)
 */
export interface RenderingInfo {
  component: Node;
  bufferRegion: BufferRegion;
  children: RenderingInfo[];
  zIndex: number;
  stackingContext: StackingContext | null;
  viewport: Viewport | null;
  clipped: boolean;
  visible: boolean;
}

/**
 * Buffer region type
 */
export interface BufferRegion {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  lines: number[];
}

/**
 * Mixin that adds rendering capabilities to a node
 * Type-safe using generics
 * Provides default render implementation that can be overridden
 */
export function Renderable<TBase extends Constructor<Node>>(Base: TBase) {
  // Mixins return classes that extend Base, but the final composed class will implement abstract methods
  return class RenderableNode extends Base {
    // Rendering state
    renderingInfo: RenderingInfo | null = null;
    renderDirty: boolean = true;

    /**
     * Render node to buffer
     * Default implementation - can be overridden by subclasses
     * Default behavior: render background, children, border
     */
    render(buffer: OutputBuffer, context: RenderContext): RenderResult {
      // Interface for stylable nodes
      interface StylableNodeMixin {
        computeStyle(): ComputedStyle;
      }
      // Interface for layoutable nodes
      interface LayoutableNodeMixin {
        computeLayout(constraints: RenderContext['constraints']): void;
      }
      // Interface for renderable children
      interface RenderableChildNode {
        render(buffer: OutputBuffer, context: RenderContext): RenderResult;
      }

      // Get style if Stylable mixin is present
      const style =
        'computeStyle' in this ? (this as unknown as StylableNodeMixin).computeStyle() : null;

      // Get layout if Layoutable mixin is present
      if ('computeLayout' in this) {
        (this as unknown as LayoutableNodeMixin).computeLayout(context.constraints);
      }

      // Get bounds
      const bounds = this.getBounds();

      // 1. Render background (if style available)
      if (style) {
        this.renderBackground(buffer, style, context);
      }

      // 2. Render children (default behavior - can be overridden)
      let maxEndY = bounds.y;
      for (const child of this.children) {
        if ('render' in child) {
          const childContext: RenderContext = {
            ...context,
            x: bounds.x,
            y: bounds.y,
            constraints: {
              ...context.constraints,
              maxWidth: bounds.width,
              maxHeight: bounds.height,
            },
            parent: this,
          };
          const result = (child as unknown as RenderableChildNode).render(buffer, childContext);
          maxEndY = Math.max(maxEndY, result.endY);
        }
      }

      // 3. Render border (if style available)
      if (style) {
        this.renderBorder(buffer, style, context);
      }

      // 4. Register rendering info
      const bufferRegion: BufferRegion = {
        startX: bounds.x,
        startY: bounds.y,
        endX: bounds.x + bounds.width,
        endY: maxEndY,
        lines: Array.from({ length: bounds.height }, (_, i) => bounds.y + i),
      };

      const zIndex = style && 'getZIndex' in style ? style.getZIndex() || 0 : 0;
      this.registerRendering(bufferRegion, zIndex, context.viewport);

      return {
        endX: bounds.x + bounds.width,
        endY: maxEndY,
        width: bounds.width,
        height: bounds.height,
        bounds,
      };
    }

    /**
     * Render background (called before children)
     * Ink-style: render background ONLY in content area (excluding border areas)
     */
    renderBackground(buffer: OutputBuffer, style: ComputedStyle, _context: RenderContext): void {
      const bgColor = style.getBackgroundColor();
      if (!bgColor || bgColor === 'inherit' || bgColor === 'transparent') {
        return;
      }

      // Get background color code
      const bgColorCode = getBackgroundColorCode(bgColor);
      if (!bgColorCode) return;

      const bounds = this.getBounds();
      const borderWidth = this.border.width;

      // Calculate content area (like Ink): subtract border widths
      // Ink: contentWidth = width - leftBorderWidth - rightBorderWidth
      const leftBorderWidth = this.border.show.left ? borderWidth.left : 0;
      const rightBorderWidth = this.border.show.right ? borderWidth.right : 0;
      const topBorderHeight = this.border.show.top ? borderWidth.top : 0;
      const bottomBorderHeight = this.border.show.bottom ? borderWidth.bottom : 0;

      const contentWidth = bounds.width - leftBorderWidth - rightBorderWidth;
      const contentHeight = bounds.height - topBorderHeight - bottomBorderHeight;

      // Only render if content area is valid (like Ink)
      if (!(contentWidth > 0 && contentHeight > 0)) {
        return;
      }

      // Render background ONLY in content area (not where borders are)
      // Ink: output.write(x + leftBorderWidth, y + topBorderHeight + row, backgroundLine)
      const contentX = bounds.x + leftBorderWidth;
      const contentY = bounds.y + topBorderHeight;
      const backgroundLine = bgColorCode + ' '.repeat(contentWidth) + '\x1b[0m';

      // Note: We don't add parent background to the "after" portion here because
      // "after" starts at the border position, and adding [44m there would leave
      // residual ANSI codes before the border character. The border rendering
      // will handle restoring parent background after the borders.

      for (let row = 0; row < contentHeight; row++) {
        const lineY = contentY + row;
        while (buffer.lines.length <= lineY) {
          buffer.lines.push('');
        }
        const line = buffer.lines[lineY] || '';
        const before = padToVisibleColumn(substringToVisibleColumn(line, contentX), contentX);
        const after = substringFromVisibleColumn(line, contentX + contentWidth);

        buffer.lines[lineY] = before + backgroundLine + after;
      }
    }

    /**
     * Render border (called after children)
     * Note: This is the legacy OutputBuffer method. New code uses renderBorderToCellBuffer.
     */
    renderBorder(buffer: OutputBuffer, style: ComputedStyle, _context: RenderContext): void {
      if (
        !this.border.show.top &&
        !this.border.show.right &&
        !this.border.show.bottom &&
        !this.border.show.left
      ) {
        return;
      }

      const bounds = this.getBounds();
      const borderColor = this.border.color || style.getBorderColor();
      const borderBgColor =
        this.border.backgroundColor ||
        style.getBorderBackgroundColor() ||
        style.getBackgroundColor();

      // Get border characters
      const chars = this.getBorderCharsForCellBuffer(this.border.style);

      // Apply border styles
      const styledChar = (char: string) =>
        applyStyles(char, {
          color: borderColor ?? undefined,
          backgroundColor: borderBgColor ?? undefined,
        });

      // Ensure buffer has enough lines
      while (buffer.lines.length <= bounds.y + bounds.height) {
        buffer.lines.push('');
      }

      // Top border
      if (this.border.show.top) {
        const topLine =
          (this.border.show.left ? styledChar(chars.topLeft) : '') +
          styledChar(chars.horizontal.repeat(Math.max(0, bounds.width - 2))) +
          (this.border.show.right ? styledChar(chars.topRight) : '');
        buffer.lines[bounds.y] =
          padToVisibleColumn(buffer.lines[bounds.y] || '', bounds.x) + topLine;
      }

      // Bottom border
      if (this.border.show.bottom) {
        const by = bounds.y + bounds.height - 1;
        const bottomLine =
          (this.border.show.left ? styledChar(chars.bottomLeft) : '') +
          styledChar(chars.horizontal.repeat(Math.max(0, bounds.width - 2))) +
          (this.border.show.right ? styledChar(chars.bottomRight) : '');
        buffer.lines[by] = padToVisibleColumn(buffer.lines[by] || '', bounds.x) + bottomLine;
      }

      // Left and right borders (vertical parts)
      const startY = this.border.show.top ? 1 : 0;
      const endY = bounds.height - (this.border.show.bottom ? 1 : 0);

      for (let row = startY; row < endY; row++) {
        const y = bounds.y + row;
        let line = buffer.lines[y] || '';
        line = padToVisibleColumn(line, bounds.x + bounds.width);

        if (this.border.show.left) {
          line = replaceAtVisibleColumn(line, bounds.x, styledChar(chars.vertical));
        }
        if (this.border.show.right) {
          line = replaceAtVisibleColumn(
            line,
            bounds.x + bounds.width - 1,
            styledChar(chars.vertical)
          );
        }

        buffer.lines[y] = line;
      }
    }

    /**
     * Get the effective background color from parent chain
     * Walks up the tree until finding a non-null, non-inherit background
     * IMPORTANT: Uses this.parent (the node's tree parent), not context.parent
     * because context.parent may be 'this' itself when passed down from render()
     */
    getEffectiveParentBackground(_context: RenderContext): string | null {
      // Start from this node's actual parent in the tree, not context.parent
      // This is because BoxNode.render sets context.parent = this for child rendering
      interface StylableParentNode {
        computeStyle(): ComputedStyle;
        parent?: Node | null;
      }
      let current: Node | null = this.parent;
      while (current) {
        if ('computeStyle' in current) {
          const style = (current as unknown as StylableParentNode).computeStyle();
          const bgColor = style.getBackgroundColor();
          if (bgColor && bgColor !== 'inherit' && bgColor !== 'transparent') {
            return bgColor;
          }
        }
        // Move to parent's parent
        current = current.parent || null;
      }
      return null;
    }

    /**
     * Register rendering info after rendering
     */
    registerRendering(bufferRegion: BufferRegion, zIndex: number, viewport: Viewport | null): void {
      interface ViewportWithIntersects extends Viewport {
        intersects?(bounds: BoundingBox): boolean;
      }
      const viewportWithMethod = viewport as ViewportWithIntersects | null;
      const renderingInfo: RenderingInfo = {
        component: this,
        bufferRegion,
        children: [],
        zIndex,
        stackingContext: this.stackingContext as StackingContext | null,
        viewport,
        clipped: viewportWithMethod ? !viewportWithMethod.intersects?.(this.getBounds()) : false,
        visible: this.state.visible,
      };

      this.renderingInfo = renderingInfo;

      // Register with rendering tree
      RenderingTreeRegistry.get().register(renderingInfo);

      // Update component instance
      if (this.componentInstance) {
        interface ComponentInstanceExt {
          renderingInfo?: RenderingInfo;
          rendered?: boolean;
        }
        const instance = this.componentInstance as ComponentInstanceExt;
        instance.renderingInfo = renderingInfo;
        instance.rendered = true;
      }
    }

    /**
     * Clear rendering state before new render
     * Called by renderTree() orchestration
     */
    clearRenderingState(): void {
      RenderingTreeRegistry.get().clear();
      StackingContextManager.get().clear();
      ViewportManager.get().clear();
    }

    /**
     * Render node to cell buffer (multi-buffer system)
     * This is the new cell-based rendering method
     */
    renderToCellBuffer(context: import('../../../buffer').CellRenderContext): void {
      const { buffer, x, y, maxWidth, maxHeight, layerId, nodeId, zIndex, background } = context;

      // Render background if set
      if (background) {
        buffer.fillBackground(x, y, maxWidth, maxHeight, background, layerId, nodeId, zIndex);
      }

      // Render content if present
      if (this.content) {
        this.renderTextToCellBuffer(this.content, context);
      }

      // Render border if present
      if (
        this.border &&
        (this.border.show.top ||
          this.border.show.right ||
          this.border.show.bottom ||
          this.border.show.left)
      ) {
        this.renderBorderToCellBuffer(context);
      }
    }

    /**
     * Render text content to cell buffer
     */
    renderTextToCellBuffer(
      content: string,
      context: import('../../../buffer').CellRenderContext
    ): void {
      const { buffer, x, y, maxWidth, maxHeight, foreground, background, layerId, nodeId, zIndex } =
        context;

      const lines = content.split('\n');
      let cy = y;

      for (const line of lines) {
        if (cy >= y + maxHeight) break;

        let cx = x;
        for (const char of line) {
          if (cx >= x + maxWidth) break;

          buffer.setCell(cx, cy, {
            char,
            foreground,
            background,
            layerId,
            nodeId,
            zIndex,
          });

          cx++;
        }

        cy++;
      }
    }

    /**
     * Render border to cell buffer
     */
    renderBorderToCellBuffer(context: import('../../../buffer').CellRenderContext): void {
      const { buffer, x, y, maxWidth, maxHeight, layerId, nodeId, zIndex, foreground, background } =
        context;
      const border = this.border;

      // Get border style characters
      const chars = this.getBorderCharsForCellBuffer(border.style);

      // Get border colors
      let borderFg = border.color || foreground;
      let borderBg = border.backgroundColor || background;

      const cellData = {
        foreground: borderFg,
        background: borderBg,
        layerId,
        nodeId,
        zIndex,
      };

      // Top border
      if (border.show.top) {
        if (border.show.left) {
          buffer.setCell(x, y, { char: chars.topLeft, ...cellData });
        }
        for (let i = 1; i < maxWidth - 1; i++) {
          buffer.setCell(x + i, y, { char: chars.horizontal, ...cellData });
        }
        if (border.show.right) {
          buffer.setCell(x + maxWidth - 1, y, { char: chars.topRight, ...cellData });
        }
      }

      // Bottom border
      if (border.show.bottom) {
        const by = y + maxHeight - 1;
        if (border.show.left) {
          buffer.setCell(x, by, { char: chars.bottomLeft, ...cellData });
        }
        for (let i = 1; i < maxWidth - 1; i++) {
          buffer.setCell(x + i, by, { char: chars.horizontal, ...cellData });
        }
        if (border.show.right) {
          buffer.setCell(x + maxWidth - 1, by, { char: chars.bottomRight, ...cellData });
        }
      }

      // Left border
      if (border.show.left) {
        const startY = border.show.top ? 1 : 0;
        const endY = border.show.bottom ? maxHeight - 1 : maxHeight;
        for (let i = startY; i < endY; i++) {
          buffer.setCell(x, y + i, { char: chars.vertical, ...cellData });
        }
      }

      // Right border
      if (border.show.right) {
        const startY = border.show.top ? 1 : 0;
        const endY = border.show.bottom ? maxHeight - 1 : maxHeight;
        for (let i = startY; i < endY; i++) {
          buffer.setCell(x + maxWidth - 1, y + i, { char: chars.vertical, ...cellData });
        }
      }
    }

    /**
     * Get border characters for cell buffer rendering
     * Public for mixin compatibility
     */
    getBorderCharsForCellBuffer(style: string): {
      topLeft: string;
      topRight: string;
      bottomLeft: string;
      bottomRight: string;
      horizontal: string;
      vertical: string;
    } {
      switch (style) {
        case 'double':
          return {
            topLeft: '╔',
            topRight: '╗',
            bottomLeft: '╚',
            bottomRight: '╝',
            horizontal: '═',
            vertical: '║',
          };
        case 'thick':
          return {
            topLeft: '┏',
            topRight: '┓',
            bottomLeft: '┗',
            bottomRight: '┛',
            horizontal: '━',
            vertical: '┃',
          };
        case 'dashed':
          return {
            topLeft: '┌',
            topRight: '┐',
            bottomLeft: '└',
            bottomRight: '┘',
            horizontal: '┄',
            vertical: '┆',
          };
        case 'dotted':
          return {
            topLeft: '·',
            topRight: '·',
            bottomLeft: '·',
            bottomRight: '·',
            horizontal: '·',
            vertical: '·',
          };
        case 'ascii':
          return {
            topLeft: '+',
            topRight: '+',
            bottomLeft: '+',
            bottomRight: '+',
            horizontal: '-',
            vertical: '|',
          };
        case 'single':
        default:
          return {
            topLeft: '┌',
            topRight: '┐',
            bottomLeft: '└',
            bottomRight: '┘',
            horizontal: '─',
            vertical: '│',
          };
      }
    }
  };
}
