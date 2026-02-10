/**
 * BufferRenderer - Main renderer using the multi-buffer system
 *
 * This integrates the node system with the multi-buffer rendering pipeline:
 * 1. Create layers based on stacking contexts
 * 2. Render nodes to their respective layer buffers
 * 3. Composite all layers
 * 4. Output to terminal with diff-based updates
 */

import { CompositeBuffer } from './CompositeBuffer';
import { DisplayBuffer } from './DisplayBuffer';
import { CellBuffer } from './CellBuffer';
import { BoundingBox, BufferRenderOptions } from './types';
import type { Node } from '../nodes/base/Node';
import { getTerminalDimensions, getLayoutMaxHeight } from '../utils/terminal';
import { componentBoundsRegistry, createComponentBounds } from '../renderer/utils/componentBounds';
import type { ConsoleNode } from '../types';

// Type for nodes that can compute layout
interface LayoutableNode extends Node {
  computeLayout(constraints: {
    maxWidth: number;
    maxHeight: number;
    availableWidth: number;
    availableHeight: number;
  }): { bounds?: BoundingBox };
}

// Type for nodes that can compute style
interface StylableNode extends Node {
  computeStyle(): {
    getColor?(): string | null;
    getBackgroundColor?(): string | null;
    getBorderColor?(): string | null;
    getBorderBackgroundColor?(): string | null;
  };
}

// Type for nodes that can render to cell buffer
interface RenderableNode extends Node {
  renderToCellBuffer(context: CellRenderContext): void;
}

// Type for interactive nodes
interface InteractiveNode extends Node {
  onClick?: (event: unknown) => void;
  onPress?: (event: unknown) => void;
  isOpen?: boolean;
  options?: Array<{ label?: string; value: string | number }>;
  dropdownHeight?: number;
  dropdownPosition?: 'auto' | 'above' | 'below';
  handlesOwnChildren?: boolean;
  // Input-specific properties
  multiline?: boolean;
  maxLines?: number;
}

/**
 * Render context for cell-based rendering
 */
export interface CellRenderContext {
  buffer: CellBuffer;
  x: number;
  y: number;
  maxWidth: number;
  maxHeight: number;
  layerId: string;
  nodeId: string | null;
  zIndex: number;
  foreground: string | null;
  background: string | null;
}

/**
 * BufferRenderer - Main renderer class
 */
export class BufferRenderer {
  private compositeBuffer: CompositeBuffer;
  private displayBuffer: DisplayBuffer;
  private isFirstRender: boolean = true;
  private _lastContentHeight: number = 0;

  constructor() {
    const dims = getTerminalDimensions();
    const bufferHeight = getLayoutMaxHeight();
    this.compositeBuffer = new CompositeBuffer(dims.columns, bufferHeight);
    this.displayBuffer = new DisplayBuffer(dims.columns, bufferHeight);
  }

  /**
   * Get the actual content height from the last render
   */
  get lastContentHeight(): number {
    return this._lastContentHeight;
  }

  /**
   * Main render function
   */
  render(root: Node, options: Partial<BufferRenderOptions> = {}): void {
    const fullOptions: BufferRenderOptions = {
      mode: options.mode || 'static',
      fullRedraw: options.fullRedraw || this.isFirstRender,
      clearScreen: options.clearScreen ?? this.isFirstRender,
      cursorPosition: options.cursorPosition,
    };

    // Handle terminal resize
    this.checkAndHandleResize();

    // Clear component bounds registry for fresh hit testing
    componentBoundsRegistry.clear();

    // 1. Reset layers
    this.compositeBuffer.resetLayers();

    // 2. Create layers based on stacking contexts
    this.createLayers(root);

    // 3. Render node tree to layers
    this.renderNodeTree(root);

    // 4. Composite all layers
    this.compositeBuffer.composite();

    // 5. Finalize component bounds - atomic swap from staging to active
    // This ensures mouse events always see consistent bounds (never empty during render)
    componentBoundsRegistry.endRender();

    // 6. Update display buffer
    this.displayBuffer.updateFromComposite(this.compositeBuffer.getCompositeBuffer());

    // 7. Flush to terminal - static mode uses simple output
    if (fullOptions.mode === 'static') {
      this.flushStatic(root);
    } else if (fullOptions.fullRedraw || this.isFirstRender) {
      // Pass cursor position to flush so everything is in one write operation
      this.displayBuffer.flush(process.stdout, fullOptions.clearScreen, fullOptions.cursorPosition);
      // Track content height for proper cursor positioning on exit
      this._lastContentHeight = this.displayBuffer.lastContentLine + 1;
    } else {
      this.displayBuffer.flushDiff(process.stdout);
      // Also update content height during diff renders to keep it accurate
      this._lastContentHeight = this.displayBuffer.lastContentLine + 1;
    }

    this.isFirstRender = false;
  }

  /**
   * Flush output for static mode - only outputs content, no cursor positioning
   */
  private flushStatic(root: Node): void {
    const compositeBuffer = this.compositeBuffer.getCompositeBuffer();
    const bounds = root.bounds || { x: 0, y: 0, width: 80, height: 1 };

    // Calculate content height - find last row with content OR background color
    // This is important for padding/margin areas that only have background
    let contentHeight = bounds.height;
    for (let y = bounds.height - 1; y >= 0; y--) {
      let hasContent = false;
      for (let x = 0; x < bounds.width; x++) {
        const cell = compositeBuffer.getCell(x, y);
        if (cell) {
          // Check for visible characters
          if (cell.char && cell.char !== ' ' && cell.char !== '\0') {
            hasContent = true;
            break;
          }
          // Check for background color (padding/margin areas)
          if (
            cell.background &&
            cell.background !== 'transparent' &&
            cell.background !== 'inherit'
          ) {
            hasContent = true;
            break;
          }
        }
      }
      if (hasContent) {
        contentHeight = y + 1;
        break;
      }
    }

    // Track content height for proper cursor positioning on exit
    this._lastContentHeight = contentHeight;

    // Generate output only for content area
    let output = '';
    for (let y = 0; y < contentHeight; y++) {
      let line = '';
      let lastStyle = '';

      for (let x = 0; x < bounds.width; x++) {
        const cell = compositeBuffer.getCell(x, y);
        if (!cell) {
          line += ' ';
          continue;
        }

        // Build style codes
        const styleCodes: string[] = [];
        if (cell.foreground) {
          const fgCode = this.colorToAnsi(cell.foreground, false);
          if (fgCode) styleCodes.push(fgCode);
        }
        if (cell.background) {
          const bgCode = this.colorToAnsi(cell.background, true);
          if (bgCode) styleCodes.push(bgCode);
        }
        if (cell.bold) styleCodes.push('1');
        if (cell.dim) styleCodes.push('2');
        if (cell.italic) styleCodes.push('3');
        if (cell.underline) styleCodes.push('4');
        if (cell.strikethrough) styleCodes.push('9');
        if (cell.inverse) styleCodes.push('7');

        const newStyle = styleCodes.length > 0 ? `\x1b[${styleCodes.join(';')}m` : '';

        // Only add style codes if changed
        if (newStyle !== lastStyle) {
          if (lastStyle) line += '\x1b[0m';
          line += newStyle;
          lastStyle = newStyle;
        }

        line += cell.char || ' ';
      }

      // Reset at end of line if we had styles
      if (lastStyle) line += '\x1b[0m';

      // Trim trailing spaces from line
      line = line.replace(/\s+$/, '');

      output += line;
      if (y < contentHeight - 1) output += '\n';
    }

    process.stdout.write(output + '\n');
  }

  /**
   * Convert color name to ANSI code
   */
  private colorToAnsi(color: string | null, isBackground: boolean): string | null {
    if (!color) return null;

    const colors: Record<string, [number, number]> = {
      black: [30, 40],
      red: [31, 41],
      green: [32, 42],
      yellow: [33, 43],
      blue: [34, 44],
      magenta: [35, 45],
      cyan: [36, 46],
      white: [37, 47],
      gray: [90, 100],
      grey: [90, 100],
    };

    const colorEntry = colors[color.toLowerCase()];
    if (colorEntry) {
      return String(isBackground ? colorEntry[1] : colorEntry[0]);
    }

    // Handle hex colors or RGB - for now just return null
    return null;
  }

  /**
   * Check for terminal resize and handle it
   */
  private checkAndHandleResize(): void {
    const dims = getTerminalDimensions();
    const bufferHeight = getLayoutMaxHeight();

    if (dims.columns !== this.compositeBuffer.width || bufferHeight !== this.compositeBuffer.height) {
      this.compositeBuffer.resize(dims.columns, bufferHeight);
      this.displayBuffer.resize(dims.columns, bufferHeight);
      this.isFirstRender = true; // Force full redraw after resize
    }
  }

  /**
   * Create layers for all nodes with stacking contexts
   */
  private createLayers(node: Node): void {
    const dims = getTerminalDimensions();
    const layerHeight = getLayoutMaxHeight();

    // Root node always gets its own layer
    if (!node.parent) {
      this.compositeBuffer.createLayer(
        node.id,
        0,
        {
          x: 0,
          y: 0,
          width: dims.columns,
          height: layerHeight,
        },
        node.id
      );
      node.layerId = node.id;
    } else if (node.createsStackingContext || node.zIndex !== 0) {
      // Nodes that create stacking context get their own layer
      const bounds = this.getNodeBounds(node);
      this.compositeBuffer.createLayer(node.id, node.zIndex, bounds, node.id);
      node.layerId = node.id;
    } else {
      // Inherit parent's layer
      node.layerId = node.parent?.layerId || 'root';
    }

    // Recurse to children
    for (const child of node.children) {
      this.createLayers(child);
    }
  }

  /**
   * Get bounds for a node (from layout or calculated)
   */
  private getNodeBounds(node: Node): BoundingBox {
    if (node.bounds) {
      return node.bounds;
    }

    // Calculate from layout if available
    if ('computeLayout' in node) {
      const dims = getTerminalDimensions();
      const layoutMaxHeight = getLayoutMaxHeight();
      const layout = (node as LayoutableNode).computeLayout({
        maxWidth: dims.columns,
        maxHeight: layoutMaxHeight,
        availableWidth: dims.columns,
        availableHeight: layoutMaxHeight,
      });
      return layout.bounds || { x: 0, y: 0, width: 0, height: 0 };
    }

    return { x: 0, y: 0, width: 0, height: 0 };
  }

  /**
   * Render entire node tree to cell buffers
   * Follows CSS painting order: normal flow elements first, then positioned elements
   */
  private renderNodeTree(node: Node): void {
    this.renderNode(node);

    // If this node handles its own children rendering (e.g., ScrollView with clipping),
    // don't recursively render children here - the node's renderToCellBuffer handles it
    if ((node as InteractiveNode).handlesOwnChildren) {
      return;
    }

    // Separate children into normal flow and positioned
    const normalFlowChildren: Node[] = [];
    const positionedChildren: Node[] = [];

    for (const child of node.children) {
      // Skip duplicate text children - React reconciler may add children that
      // are duplicates of content already set by NodeFactory
      if (
        child.type === 'text' &&
        node.type === 'text' &&
        child.content === node.content &&
        !child.bounds
      ) {
        continue;
      }

      // CSS painting order: positioned elements (relative, absolute, fixed, sticky)
      // paint AFTER non-positioned elements at the same stacking level
      // This ensures positioned elements appear on top when they overlap
      const position = child.position || 'static';
      if (position !== 'static') {
        positionedChildren.push(child);
      } else {
        normalFlowChildren.push(child);
      }
    }

    // Render normal flow children first
    for (const child of normalFlowChildren) {
      this.renderNodeTree(child);
    }

    // Render positioned children last (they paint on top)
    for (const child of positionedChildren) {
      this.renderNodeTree(child);
    }
  }

  /**
   * Render a single node to its layer buffer
   */
  private renderNode(node: Node): void {
    const layerId = node.layerId || 'root';
    const layerBuffer = this.compositeBuffer.getLayerBuffer(layerId);

    if (!layerBuffer) return;

    // Get layer to convert coordinates
    const layer = this.compositeBuffer.getLayerManager().getLayer(layerId);
    if (!layer) return;

    // Get node bounds
    const bounds = this.getNodeBounds(node);

    // Convert to layer-local coordinates
    const localBounds = {
      x: bounds.x - layer.bounds.x,
      y: bounds.y - layer.bounds.y,
      width: bounds.width,
      height: bounds.height,
    };

    // Create render context
    const context: CellRenderContext = {
      buffer: layerBuffer,
      x: localBounds.x,
      y: localBounds.y,
      maxWidth: localBounds.width,
      maxHeight: localBounds.height,
      layerId,
      nodeId: node.id,
      zIndex: node.zIndex,
      foreground: null,
      background: null,
    };

    // Get style if available
    if ('computeStyle' in node) {
      const style = (node as StylableNode).computeStyle();
      context.foreground = style.getColor?.() || null;
      context.background = style.getBackgroundColor?.() || null;
    }

    // Render based on node type
    if ('renderToCellBuffer' in node) {
      // Node has cell buffer rendering method
      (node as RenderableNode).renderToCellBuffer(context);
    } else {
      // Fallback: use default rendering
      this.defaultNodeRender(node, context);
    }

    // Register interactive components for hit testing (mouse events)
    // A component is interactive if it has onClick, onPress, or is a button/input type
    // Note: ScrollView registers itself for scrollbar only (in ScrollViewNode.renderScrollbar)
    // Scroll wheel events use findScrollViewAt() which searches the node tree
    const interactiveNode = node as InteractiveNode;
    const isInteractive =
      interactiveNode.onClick ||
      interactiveNode.onPress ||
      node.type === 'button' ||
      node.type === 'input' ||
      node.type === 'checkbox' ||
      node.type === 'radio' ||
      node.type === 'dropdown' ||
      node.type === 'select';

    if (isInteractive) {
      // For open dropdowns, include the expanded options area in bounds
      // For multiline inputs, ensure full height is included
      let regBounds = { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height };

      // Handle multiline inputs - ensure height includes all lines
      if (node.type === 'input' && interactiveNode.multiline) {
        const maxLines = interactiveNode.maxLines || 3;
        // Ensure bounds height is at least maxLines
        if (regBounds.height < maxLines) {
          regBounds.height = maxLines;
        }
      }

      if (node.type === 'dropdown' && interactiveNode.isOpen) {
        const options = interactiveNode.options || [];
        const optionsCount = options.length;
        const maxVisible = interactiveNode.dropdownHeight ?? 6;
        const visibleOptions = Math.min(optionsCount, maxVisible);

        if (visibleOptions > 0) {
          // Determine if options are above or below
          const dropdownPosition = interactiveNode.dropdownPosition || 'auto';
          const termDims = getTerminalDimensions();
          const dims = { rows: termDims.rows, columns: termDims.columns };

          const spaceBelow = dims.rows - bounds.y - 2;
          const spaceAbove = bounds.y - 1;
          const showAbove =
            dropdownPosition === 'above' ||
            (dropdownPosition === 'auto' && spaceAbove > spaceBelow);

          // Expand bounds to include options
          if (showAbove) {
            regBounds.y = bounds.y - visibleOptions;
            regBounds.height = bounds.height + visibleOptions;
          } else {
            regBounds.height = bounds.height + visibleOptions;
          }

          // Also expand width to account for option labels
          let maxLabelWidth = bounds.width;
          for (const opt of options) {
            const label = opt.label || String(opt.value);
            maxLabelWidth = Math.max(maxLabelWidth, label.length + 6);
          }
          regBounds.width = Math.max(regBounds.width, maxLabelWidth);
        }
      }

      componentBoundsRegistry.register(
        createComponentBounds(
          node as unknown as ConsoleNode, // ConsoleNode interface compatibility
          regBounds.x,
          regBounds.y,
          regBounds.width,
          regBounds.height
        )
      );
    }
  }

  /**
   * Default rendering for nodes without custom cell rendering
   */
  private defaultNodeRender(node: Node, context: CellRenderContext): void {
    const { buffer, x, y, maxWidth, maxHeight, nodeId, zIndex } = context;

    // Render background if set
    if (context.background) {
      buffer.fillBackground(
        x,
        y,
        maxWidth,
        maxHeight,
        context.background,
        context.layerId,
        nodeId,
        zIndex
      );
    }

    // Render content if present
    if (node.content) {
      this.renderTextContent(node.content, context);
    }

    // Render border if present
    if (
      node.border &&
      (node.border.show.top ||
        node.border.show.right ||
        node.border.show.bottom ||
        node.border.show.left)
    ) {
      this.renderBorder(node, context);
    }
  }

  /**
   * Render text content to cell buffer
   */
  private renderTextContent(content: string, context: CellRenderContext): void {
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
  private renderBorder(node: Node, context: CellRenderContext): void {
    const { buffer, x, y, maxWidth, maxHeight, layerId, nodeId, zIndex } = context;
    const border = node.border;

    // Get border style characters
    const chars = this.getBorderChars(border.style);

    // Get border colors
    let borderFg: string | null = null;
    let borderBg: string | null = null;

    if ('computeStyle' in node) {
      const style = (node as StylableNode).computeStyle();
      borderFg = border.color || style.getBorderColor?.() || context.foreground;
      borderBg = border.backgroundColor || style.getBorderBackgroundColor?.() || context.background;
    } else {
      borderFg = border.color || context.foreground;
      borderBg = border.backgroundColor || context.background;
    }

    const cellData = {
      foreground: borderFg,
      background: borderBg,
      layerId,
      nodeId,
      zIndex,
    };

    // Top border
    if (border.show.top) {
      // Top-left corner
      if (border.show.left) {
        buffer.setCell(x, y, { char: chars.topLeft, ...cellData });
      }
      // Top edge
      for (let i = 1; i < maxWidth - 1; i++) {
        buffer.setCell(x + i, y, { char: chars.horizontal, ...cellData });
      }
      // Top-right corner
      if (border.show.right) {
        buffer.setCell(x + maxWidth - 1, y, { char: chars.topRight, ...cellData });
      }
    }

    // Bottom border
    if (border.show.bottom) {
      const by = y + maxHeight - 1;
      // Bottom-left corner
      if (border.show.left) {
        buffer.setCell(x, by, { char: chars.bottomLeft, ...cellData });
      }
      // Bottom edge
      for (let i = 1; i < maxWidth - 1; i++) {
        buffer.setCell(x + i, by, { char: chars.horizontal, ...cellData });
      }
      // Bottom-right corner
      if (border.show.right) {
        buffer.setCell(x + maxWidth - 1, by, { char: chars.bottomRight, ...cellData });
      }
    }

    // Left border (vertical part)
    if (border.show.left) {
      const startY = border.show.top ? 1 : 0;
      const endY = border.show.bottom ? maxHeight - 1 : maxHeight;
      for (let i = startY; i < endY; i++) {
        buffer.setCell(x, y + i, { char: chars.vertical, ...cellData });
      }
    }

    // Right border (vertical part)
    if (border.show.right) {
      const startY = border.show.top ? 1 : 0;
      const endY = border.show.bottom ? maxHeight - 1 : maxHeight;
      for (let i = startY; i < endY; i++) {
        buffer.setCell(x + maxWidth - 1, y + i, { char: chars.vertical, ...cellData });
      }
    }
  }

  /**
   * Get border characters based on style
   */
  private getBorderChars(style: string): {
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

  /**
   * Get the composite buffer (for debugging/testing)
   */
  getCompositeBuffer(): CompositeBuffer {
    return this.compositeBuffer;
  }

  /**
   * Get the display buffer (for debugging/testing)
   */
  getDisplayBuffer(): DisplayBuffer {
    return this.displayBuffer;
  }

  /**
   * Force a full redraw on next render
   */
  invalidate(): void {
    this.isFirstRender = true;
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.compositeBuffer.clearAllLayers();
    this.displayBuffer.clear();
  }
}

/**
 * Global buffer renderer instance
 */
let globalBufferRenderer: BufferRenderer | null = null;

/**
 * Get or create the global buffer renderer
 */
export function getBufferRenderer(): BufferRenderer {
  if (!globalBufferRenderer) {
    globalBufferRenderer = new BufferRenderer();
  }
  return globalBufferRenderer;
}

/**
 * Reset the global buffer renderer
 */
export function resetBufferRenderer(): void {
  if (globalBufferRenderer) {
    globalBufferRenderer.destroy();
    globalBufferRenderer = null;
  }
}
