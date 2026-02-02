/**
 * Box node - container for layout and styling
 * Composed with Stylable, Renderable, and Layoutable mixins
 */

import { Node } from '../base/Node';
import {
  Stylable,
  Renderable,
  Layoutable,
  type OutputBuffer,
  type RenderContext,
  type RenderResult,
} from '../base/mixins';
import type {
  LayoutConstraints,
  LayoutResult,
  ChildLayout,
  Dimensions,
} from '../base/mixins/Layoutable';
import type { StyleMap, DisplayMode, Constructor } from '../base/types';
import { DisplayMode as DisplayModeEnum, Position as PositionEnum } from '../base/types';
import { StyleMixinRegistry } from '../../style/mixins/registry';
import { LayoutEngine } from '../../layout/LayoutEngine';

// Interface for layoutable children
interface LayoutableChild {
  computeLayout(constraints: LayoutConstraints): LayoutResult;
}

// Interface for renderable children
interface RenderableChild {
  render(buffer: OutputBuffer, context: RenderContext): RenderResult;
}

/**
 * Box node - container for layout and styling
 * Composed with Stylable, Renderable, and Layoutable mixins
 */
// Create the mixed-in base class with proper type handling
const BoxNodeBase = Stylable(Renderable(Layoutable(Node as unknown as Constructor<Node>)));

export class BoxNode extends BoxNodeBase {
  // Declare inherited mixin properties for TypeScript
  // From Layoutable
  declare display: DisplayMode;
  declare layoutDirty: boolean;
  declare updateStackingContext: () => void;
  declare updateViewport: () => void;
  // From Renderable
  declare renderBackground: (
    buffer: OutputBuffer,
    style: import('../base/mixins/Stylable').ComputedStyle,
    context: RenderContext
  ) => void;
  declare renderBorder: (
    buffer: OutputBuffer,
    style: import('../base/mixins/Stylable').ComputedStyle,
    context: RenderContext
  ) => void;
  declare registerRendering: (
    bufferRegion: import('../base/mixins').BufferRegion,
    zIndex: number,
    viewport: import('../base/mixins/Renderable').Viewport | null
  ) => void;
  declare renderBorderToCellBuffer: (context: import('../../buffer').CellRenderContext) => void;
  // From Stylable
  declare computeStyle: () => import('../base/mixins/Stylable').ComputedStyle;
  declare updateBoxModelFromStyle: (style: StyleMap) => void;
  declare applyStyleMixin: (name: string) => void;

  constructor(id?: string) {
    super(id);
    // Apply box style mixin
    this.applyStyleMixin('BoxStyle');
    // Apply border style mixin if border is set
    if (
      this.border.show.top ||
      this.border.show.right ||
      this.border.show.bottom ||
      this.border.show.left
    ) {
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
    const style = this.computeStyle();
    this.display = style.getDisplay() as DisplayMode;

    this.updateBoxModelFromStyle(style.styles);

    if (
      this.border.show.top ||
      this.border.show.right ||
      this.border.show.bottom ||
      this.border.show.left
    ) {
      this.applyStyleMixin('BorderStyle');
    }

    const borderWidth = this.border.width;
    // Content constraints: children are laid out in the content area (after border and padding)
    // So we subtract border and padding from available space
    // Ensure we don't get negative values, and ensure at least 1 for text nodes
    // CRITICAL: Use terminal width as maximum constraint, not Infinity
    const { getTerminalDimensions } = require('../../utils/terminal');
    const terminalDims = getTerminalDimensions();
    const maxTerminalWidth = terminalDims.columns;
    const maxTerminalHeight = terminalDims.rows;

    const totalHorizontalSpace =
      borderWidth.left + borderWidth.right + this.padding.left + this.padding.right;
    const totalVerticalSpace =
      borderWidth.top + borderWidth.bottom + this.padding.top + this.padding.bottom;

    // Use terminal width as fallback for maxWidth, but NOT for availableWidth
    // availableWidth being undefined signals "shrink-to-fit" behavior (flex items)
    const effectiveMaxWidth = constraints.maxWidth ?? maxTerminalWidth;
    const effectiveMaxHeight = constraints.maxHeight ?? maxTerminalHeight;
    // CRITICAL: Don't default availableWidth to terminal width - undefined means shrink-to-fit
    const effectiveAvailableWidth = constraints.availableWidth;
    const effectiveAvailableHeight = constraints.availableHeight;

    // Calculate content area dimensions
    const contentMaxWidth = Math.max(
      1,
      Math.min(effectiveMaxWidth, maxTerminalWidth) - totalHorizontalSpace
    );
    const contentMaxHeight = effectiveMaxHeight
      ? Math.max(1, Math.min(effectiveMaxHeight, maxTerminalHeight) - totalVerticalSpace)
      : undefined;

    // For block containers, children should get availableWidth based on this container's content width
    // This ensures text alignment and block-level children work correctly
    // If this container has a fixed width, use it; otherwise use parent's available width
    let childAvailableWidth: number | undefined;
    if (this.width !== null) {
      // Container has explicit width - children get that width minus padding/border
      childAvailableWidth = Math.max(1, this.width - totalHorizontalSpace);
    } else if (effectiveAvailableWidth !== undefined) {
      // Container fills parent - children get same available space
      childAvailableWidth = Math.max(
        1,
        Math.min(effectiveAvailableWidth, maxTerminalWidth) - totalHorizontalSpace
      );
    }
    // If undefined, children will shrink-to-fit (flex items in row direction)

    const contentConstraints: LayoutConstraints = {
      maxWidth: contentMaxWidth,
      maxHeight: contentMaxHeight,
      availableWidth: childAvailableWidth,
      availableHeight:
        effectiveAvailableHeight !== undefined
          ? Math.max(1, Math.min(effectiveAvailableHeight, maxTerminalHeight) - totalVerticalSpace)
          : undefined,
    };

    const layoutEngine = new LayoutEngine();
    let childLayouts: ChildLayout[] = [];

    // Separate children into normal flow and positioned (absolute/fixed)
    // Absolute/fixed positioned elements are taken out of normal flow
    const normalFlowChildren: Node[] = [];
    const positionedChildren: Node[] = [];

    for (const child of this.children || []) {
      const childPosition = child.position || PositionEnum.STATIC;
      if (childPosition === PositionEnum.ABSOLUTE || childPosition === PositionEnum.FIXED) {
        positionedChildren.push(child);
      } else {
        normalFlowChildren.push(child);
      }
    }

    // Create a node-like object for layout engine with only normal flow children
    // CRITICAL: Use Object.create to preserve the prototype chain so methods like computeStyle work
    const layoutNode = Object.create(Object.getPrototypeOf(this), {
      ...Object.getOwnPropertyDescriptors(this),
      children: { value: normalFlowChildren, writable: true, enumerable: true, configurable: true },
    });

    if (this.display === DisplayModeEnum.FLEX) {
      childLayouts = layoutEngine.layoutFlexbox(layoutNode as Node, contentConstraints);
    } else if (this.display === DisplayModeEnum.GRID) {
      childLayouts = layoutEngine.layoutGrid(layoutNode as Node, contentConstraints);
    } else {
      childLayouts = layoutEngine.layoutBlock(layoutNode as Node, contentConstraints);
    }

    // Ensure all normal flow children are included in childLayouts
    // This is especially important for TextNode children that layoutBlock might miss
    if (normalFlowChildren.length > 0) {
      const includedNodes = new Set(childLayouts.map((cl) => cl.node));
      let currentY =
        childLayouts.length > 0
          ? Math.max(...childLayouts.map((cl) => cl.bounds.y + cl.bounds.height), 0)
          : 0;

      for (const child of normalFlowChildren) {
        if (!includedNodes.has(child) && 'computeLayout' in child) {
          // This child wasn't included by layoutBlock/layoutFlexbox, add it manually
          try {
            const childLayout = (child as unknown as LayoutableChild).computeLayout({
              maxWidth: contentConstraints.maxWidth,
              maxHeight: contentConstraints.maxHeight,
              availableWidth: contentConstraints.availableWidth,
              availableHeight: contentConstraints.availableHeight,
            });

            if (childLayout && childLayout.dimensions) {
              childLayouts.push({
                node: child,
                bounds: {
                  x: 0,
                  y: currentY,
                  width: childLayout.dimensions.width,
                  height: childLayout.dimensions.height,
                },
              });

              currentY += childLayout.dimensions.height;
            }
          } catch {
            // Skip children that fail to compute layout
          }
        }
      }
    }

    // Add positioned children (absolute/fixed) - they get a placeholder position
    // Their actual position will be calculated after the parent dimensions are known
    // CSS behavior: absolute/fixed positioned elements are shrink-to-fit by default
    // (like inline-block), so we don't pass availableWidth
    for (const child of positionedChildren) {
      if ('computeLayout' in child) {
        try {
          const childLayout = (child as unknown as LayoutableChild).computeLayout({
            maxWidth: contentConstraints.maxWidth,
            maxHeight: contentConstraints.maxHeight,
            // Don't pass availableWidth - positioned elements shrink-to-fit
            availableWidth: undefined,
            availableHeight: undefined,
          });

          if (childLayout && childLayout.dimensions) {
            // Position will be calculated later in the positioning phase
            // For now, use (0, 0) as placeholder
            childLayouts.push({
              node: child,
              bounds: {
                x: 0,
                y: 0,
                width: childLayout.dimensions.width,
                height: childLayout.dimensions.height,
              },
            });
          }
        } catch {
          // Skip children that fail to compute layout
        }
      }
    }

    // Pass the actual constraints used for this layout calculation
    // Note: _renderContext may not be set during computeLayout (only set in render)
    // so we pass the constraints directly to ensure correct width calculation
    // CRITICAL: Preserve availableWidth from input - undefined means shrink-to-fit (flex items)
    const layoutContext = {
      constraints: {
        maxWidth: constraints.maxWidth,
        maxHeight: constraints.maxHeight,
        availableWidth: constraints.availableWidth, // Preserve undefined for shrink-to-fit
        availableHeight: constraints.availableHeight,
      },
    };
    const dimensions = this.calculateDimensions(
      childLayouts,
      borderWidth,
      layoutContext as Partial<RenderContext>
    );

    this.bounds = {
      x: 0,
      y: 0,
      width: dimensions.width,
      height: dimensions.height,
    };

    this.contentArea = this.calculateContentArea();

    // Update child bounds - convert from parent-relative to absolute coordinates
    // Child bounds from layout engine are relative to parent's content area
    // We need to add parent's absolute position + border + padding offset
    const parentX = this.bounds.x;
    const parentY = this.bounds.y;
    const contentOffsetX = borderWidth.left + this.padding.left;
    const contentOffsetY = borderWidth.top + this.padding.top;

    // Use terminal dimensions already calculated at the start of computeLayout
    const positioningTerminalDims = { columns: maxTerminalWidth, rows: maxTerminalHeight };

    // CSS positioning behavior:
    // - position: relative - element moves visually but original space is PRESERVED
    //   siblings are NOT affected by the offset (they flow as if element didn't move)
    // - position: absolute - element is removed from flow, positioned relative to
    //   nearest positioned ancestor (handled separately above)

    for (const childLayout of childLayouts) {
      // Calculate normal flow position (where element would be without positioning)
      const normalFlowX = parentX + contentOffsetX + childLayout.bounds.x;
      const normalFlowY = parentY + contentOffsetY + childLayout.bounds.y;

      let newX = normalFlowX;
      let newY = normalFlowY;

      // Apply positioning based on child's position property
      const childNode = childLayout.node;
      if ('calculatePosition' in childNode && typeof childNode.calculatePosition === 'function') {
        // For absolute/fixed positioning, CSS uses the padding box as reference
        // (position offsets start from after border, before padding)
        const paddingBoxX = parentX + borderWidth.left;
        const paddingBoxY = parentY + borderWidth.top;
        const paddingBoxWidth = dimensions.width - borderWidth.left - borderWidth.right;
        const paddingBoxHeight = dimensions.height - borderWidth.top - borderWidth.bottom;

        const posResult = childNode.calculatePosition(
          paddingBoxX, // Parent padding box start X (for absolute)
          paddingBoxY, // Parent padding box start Y (for absolute)
          paddingBoxWidth,
          paddingBoxHeight,
          positioningTerminalDims,
          normalFlowX, // Normal flow X position (for relative)
          normalFlowY, // Normal flow Y position (for relative)
          childLayout.bounds.width, // Element width
          childLayout.bounds.height // Element height
        );

        newX = posResult.x;
        newY = posResult.y;

        // CSS behavior: relative positioning does NOT affect sibling layout
        // The element moves visually but its original space is preserved
        // Siblings flow as if the element hadn't moved
      }

      // Calculate how much this child moved from its current bounds
      const currentBounds = childLayout.node.bounds || { x: 0, y: 0, width: 0, height: 0 };
      const deltaX = newX - currentBounds.x;
      const deltaY = newY - currentBounds.y;

      // Update child bounds
      childLayout.node.bounds = {
        x: newX,
        y: newY,
        width: childLayout.bounds.width,
        height: childLayout.bounds.height,
      };

      // Recursively update all descendants' bounds by the same delta
      // This is necessary because grandchildren's bounds were set during
      // the child's computeLayout call, before the child was positioned
      if (deltaX !== 0 || deltaY !== 0) {
        this.updateDescendantBounds(childLayout.node, deltaX, deltaY);
      }
    }

    // Recalculate container height to ensure it contains all children at their visual positions
    // This handles cases where absolute/relative positioned elements extend beyond normal flow
    let maxChildBottom = 0;
    for (const childLayout of childLayouts) {
      const childBounds = childLayout.node.bounds;
      if (childBounds) {
        const childBottom = childBounds.y + childBounds.height;
        if (childBottom > maxChildBottom) {
          maxChildBottom = childBottom;
        }
      }
    }

    // Add container's bottom padding and border
    const requiredHeight = maxChildBottom + this.padding.bottom + borderWidth.bottom;
    if (requiredHeight > this.bounds.height) {
      this.bounds.height = requiredHeight;
      dimensions.height = requiredHeight;
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

  /**
   * Recursively update descendant bounds by a delta offset
   * Used when a node is repositioned after its children have already computed their bounds
   */
  private updateDescendantBounds(node: Node, deltaX: number, deltaY: number): void {
    for (const child of node.children) {
      if (child.bounds) {
        child.bounds = {
          x: child.bounds.x + deltaX,
          y: child.bounds.y + deltaY,
          width: child.bounds.width,
          height: child.bounds.height,
        };
      }
      // Recurse to grandchildren
      this.updateDescendantBounds(child, deltaX, deltaY);
    }
  }

  render(buffer: OutputBuffer, context: RenderContext): RenderResult {
    const style = this.computeStyle();
    // Force recalculation of layout to ensure children are included
    // Don't use cached layout - always recalculate to ensure TextNode children are found
    this.layoutDirty = true;
    // Store context for use in calculateDimensions
    interface NodeWithRenderContext {
      _renderContext?: RenderContext;
    }
    (this as unknown as NodeWithRenderContext)._renderContext = context;
    const layoutResult = this.computeLayout(context.constraints);

    // Use context position directly (parent has already calculated correct position)
    // Update bounds to match context position
    // Keep the width/height from layout, but update x/y from context
    this.bounds = {
      x: context.x,
      y: context.y,
      width: layoutResult.bounds.width,
      height: layoutResult.bounds.height,
    };

    // Recalculate contentArea with updated bounds
    this.contentArea = this.calculateContentArea();

    // Calculate content area first (needed for child positioning)
    const contentArea = this.getContentArea();

    const boxContext: RenderContext = {
      ...context,
      x: this.bounds.x,
      y: this.bounds.y,
      constraints: {
        ...context.constraints,
        maxWidth: layoutResult.dimensions.contentWidth,
        maxHeight: layoutResult.dimensions.contentHeight,
      },
      parent: this,
    };

    // 1. Render background
    this.renderBackground(buffer, style, boxContext);

    // 2. Render children using layout positions
    let maxEndY = this.bounds.y;

    // Track which children have been rendered
    const renderedNodes = new Set<Node>();

    // Always use layoutResult.children if available (for flex, grid, and block layouts)
    if (layoutResult.children && layoutResult.children.length > 0) {
      // Use calculated child layouts for positioning
      for (const childLayout of layoutResult.children) {
        const child = childLayout.node;

        if ('render' in child) {
          renderedNodes.add(child);
          const childContext: RenderContext = {
            ...boxContext,
            x: contentArea.x + childLayout.bounds.x,
            y: contentArea.y + childLayout.bounds.y,
            constraints: {
              maxWidth: Math.max(1, childLayout.bounds.width),
              maxHeight: Math.max(1, childLayout.bounds.height),
              availableWidth: Math.max(1, childLayout.bounds.width),
              availableHeight: Math.max(1, childLayout.bounds.height),
            },
            parent: this,
          };

          const result = (child as unknown as RenderableChild).render(buffer, childContext);
          maxEndY = Math.max(maxEndY, result.endY);
        }
      }
    }

    // Fallback: render any children that weren't in layoutResult.children
    // This ensures TextNode children are always rendered even if layoutBlock missed them
    // This is especially important for flexbox item boxes where layoutBlock might not include TextNode children
    // CRITICAL: Always check this.children and render any missing children, regardless of layoutResult.children
    if (this.children.length > 0) {
      const childContext = this.createChildContext(boxContext, layoutResult);
      let fallbackY = childContext.y;

      for (const child of this.children) {
        // Skip if already rendered via layoutResult.children
        if (renderedNodes.has(child)) {
          continue;
        }

        // Always render children that weren't in layoutResult.children
        // This is critical for TextNode children in flexbox item boxes

        if ('render' in child) {
          // Compute layout for this child to get proper dimensions
          // Use contentConstraints to ensure child gets correct available space
          // Ensure constraints are never 0 or negative
          const safeMaxWidth = Math.max(1, childContext.constraints.maxWidth ?? Infinity);
          const safeMaxHeight = childContext.constraints.maxHeight
            ? Math.max(1, childContext.constraints.maxHeight)
            : undefined;
          const safeAvailableWidth = Math.max(
            1,
            childContext.constraints.availableWidth ?? Infinity
          );
          const safeAvailableHeight = childContext.constraints.availableHeight
            ? Math.max(1, childContext.constraints.availableHeight)
            : undefined;

          const childLayout =
            'computeLayout' in child
              ? (child as unknown as LayoutableChild).computeLayout({
                  maxWidth: safeMaxWidth,
                  maxHeight: safeMaxHeight,
                  availableWidth: safeAvailableWidth,
                  availableHeight: safeAvailableHeight,
                })
              : null;

          if (childLayout && childLayout.dimensions) {
            // Ensure dimensions are valid
            const childWidth = Math.max(1, childLayout.dimensions.width || 0);
            const childHeight = Math.max(1, childLayout.dimensions.height || 0);

            if (childWidth > 0 && childHeight > 0) {
              const fallbackChildContext: RenderContext = {
                ...childContext,
                x: contentArea.x,
                y: fallbackY,
                constraints: {
                  maxWidth: childWidth,
                  maxHeight: childHeight,
                  availableWidth: childWidth,
                  availableHeight: childHeight,
                },
              };

              // Render the child
              const result = (child as unknown as RenderableChild).render(
                buffer,
                fallbackChildContext
              );
              maxEndY = Math.max(maxEndY, result.endY);
              fallbackY = result.endY;
            }
          }
        }
      }
    }

    // 3. Render border
    this.renderBorder(buffer, style, boxContext);

    // 4. Register rendering info
    const boundsX = this.bounds?.x ?? 0;
    const boundsY = this.bounds?.y ?? 0;
    const bufferRegion = {
      startX: boundsX,
      startY: boundsY,
      endX: boundsX + layoutResult.dimensions.width,
      endY: maxEndY,
      lines: Array.from({ length: layoutResult.dimensions.height }, (_, i) => boundsY + i),
    };

    this.registerRendering(bufferRegion, style.getZIndex() || 0, boxContext.viewport ?? null);

    return {
      endX: this.bounds.x + layoutResult.dimensions.width,
      endY: maxEndY,
      width: layoutResult.dimensions.width,
      height: layoutResult.dimensions.height,
      bounds: this.bounds,
    };
  }

  private calculateDimensions(
    childLayouts: ChildLayout[],
    borderWidth: { top: number; right: number; bottom: number; left: number },
    context?: Partial<RenderContext>
  ): Dimensions {
    const style = this.computeStyle();
    const flexDirection = style.getProperty('flexDirection') || 'row';
    const isRow = flexDirection === 'row' || flexDirection === 'row-reverse';

    // Filter out absolute/fixed positioned children - they don't contribute to parent size
    const flowChildLayouts = childLayouts.filter((cl) => {
      const childPosition = cl.node.position || PositionEnum.STATIC;
      return childPosition !== PositionEnum.ABSOLUTE && childPosition !== PositionEnum.FIXED;
    });

    if (this.display === DisplayModeEnum.FLEX || this.display === DisplayModeEnum.GRID) {
      // Algorithm: Calculate parent dimensions from children (like HTML/CSS flexbox)
      // Step 1: Each child's intrinsic size is already calculated (content + padding + border) in childLayouts
      // Step 2: Calculate parent content area from children's sizes
      // Step 3: Children are already positioned by layout engine

      let contentAreaWidth = 0;
      let contentAreaHeight = 0;

      if (flowChildLayouts.length > 0) {
        const gap = style.getProperty('gap') as { row?: number; column?: number } | number | null;
        const rawRowGap = style.getProperty('rowGap');
        const rowGap: number =
          (typeof rawRowGap === 'number' ? rawRowGap : null) ??
          (gap && typeof gap === 'object' ? (gap.column ?? 0) : typeof gap === 'number' ? gap : 0);

        if (isRow || this.display === DisplayModeEnum.GRID) {
          // ROW flexbox/GRID: Calculate parent content area from children
          // Algorithm: Sum of all child widths + gaps + margins
          // Note: justifyContent affects child positioning, handled by layout engine

          // Note: Total child width calculation removed - flex containers use block-level sizing
          // They fill available width rather than shrink-to-fit children

          // Get terminal width and available width from context
          const { getTerminalDimensions } = require('../../utils/terminal');
          const terminalDims = getTerminalDimensions();
          const maxTerminalWidth = terminalDims.columns;

          // Available width should come from parent's content area, NOT terminal width
          // This ensures containers fit within their parent's bounds
          const availableWidth = context?.constraints?.maxWidth || maxTerminalWidth;

          // CRITICAL: Available width is the space THIS container must fit in
          // So content width = available - this container's border/padding
          const maxContentWidth =
            availableWidth -
            borderWidth.left -
            borderWidth.right -
            this.padding.left -
            this.padding.right;

          // HTML/CSS behavior: Flex containers are BLOCK-LEVEL elements
          // Block elements fill their parent's available width by default
          // Only explicit width overrides this behavior
          const explicitWidth = style.getProperty('width');
          if (typeof explicitWidth === 'number') {
            // Explicit width set - use it (clamped to available)
            contentAreaWidth = Math.min(explicitWidth, maxContentWidth);
          } else {
            // Block-level behavior: fill available width
            contentAreaWidth = maxContentWidth;
          }

          // Height: For ROW flexbox and GRID, calculate total height from all rows
          // Find the maximum Y + height across all children to determine total content height
          if (flowChildLayouts.length > 0) {
            contentAreaHeight = Math.max(
              ...flowChildLayouts.map((l) => l.bounds.y + l.bounds.height),
              0
            );
          } else {
            contentAreaHeight = 0;
          }
        } else {
          // COLUMN flexbox: Calculate parent content area from children
          // HTML/CSS behavior: Flex containers are BLOCK-LEVEL elements
          // Block elements fill their parent's available width by default
          // Only height is determined by content

          // Get available width from context (like row flexbox)
          const { getTerminalDimensions } = require('../../utils/terminal');
          const terminalDims = getTerminalDimensions();
          const maxTerminalWidth = terminalDims.columns;
          const availableWidth = context?.constraints?.maxWidth || maxTerminalWidth;
          const maxContentWidth =
            availableWidth -
            borderWidth.left -
            borderWidth.right -
            this.padding.left -
            this.padding.right;

          // Width: Block-level behavior - fill available width (unless explicit width set)
          // CSS box model: width:auto means width = available - margins
          // So we need to subtract this element's own margins from available width
          const selfMargin = this.margin || { left: 0, right: 0, top: 0, bottom: 0 };
          const availableAfterMargin =
            maxContentWidth - (selfMargin.left || 0) - (selfMargin.right || 0);

          const colWidth = style.getProperty('width');
          if (typeof colWidth === 'number') {
            contentAreaWidth = Math.min(colWidth, availableAfterMargin);
          } else {
            contentAreaWidth = Math.max(0, availableAfterMargin);
          }

          // Height: Sum of all child heights + gaps + margins
          // Each child contributes: height + bottom margin + gap (except last child has no gap after)
          if (flowChildLayouts.length > 0) {
            let totalHeight = 0;
            const firstChild = flowChildLayouts[0]!;
            const firstChildMargin = firstChild.node.margin || {
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            };
            // First child's top margin creates space from 0
            totalHeight = firstChildMargin.top || 0;

            for (let i = 0; i < flowChildLayouts.length; i++) {
              const l = flowChildLayouts[i]!;
              const childMargin = l.node.margin || { left: 0, right: 0, top: 0, bottom: 0 };
              totalHeight += l.bounds.height; // Child's height (already includes padding + border)
              if (i < flowChildLayouts.length - 1) {
                totalHeight += rowGap; // Gap between children
              }
              if (i === flowChildLayouts.length - 1) {
                totalHeight += childMargin.bottom || 0; // Last child's bottom margin
              }
            }

            contentAreaHeight = totalHeight;
          } else {
            contentAreaHeight = 0;
          }
        }
      }

      // Ensure minimum content area if we have padding but no children
      if (contentAreaWidth === 0 && (this.padding.left > 0 || this.padding.right > 0)) {
        contentAreaWidth = 0; // Padding doesn't create content width, it's just spacing
      }
      if (contentAreaHeight === 0 && (this.padding.top > 0 || this.padding.bottom > 0)) {
        contentAreaHeight = 0; // Padding doesn't create content height, it's just spacing
      }

      // Total box dimensions = border + padding + contentArea + padding + border
      // Ink model: border is OUTSIDE, padding is INSIDE border
      const totalWidth =
        borderWidth.left +
        this.padding.left +
        contentAreaWidth +
        this.padding.right +
        borderWidth.right;
      const totalHeight =
        borderWidth.top +
        this.padding.top +
        contentAreaHeight +
        this.padding.bottom +
        borderWidth.bottom;

      return {
        width: totalWidth,
        height: totalHeight,
        contentWidth: contentAreaWidth,
        contentHeight: contentAreaHeight,
      };
    } else {
      // Block layout: stack children vertically
      // Account for margins when calculating parent dimensions
      // Margins are space outside border, so they affect parent's content area size
      let maxWidth = 0;
      let totalHeight = 0;

      if (flowChildLayouts.length > 0) {
        // Width: max of (child width + left margin + right margin)
        maxWidth = Math.max(
          ...flowChildLayouts.map((layout) => {
            const childMargin = layout.node.margin || { left: 0, right: 0, top: 0, bottom: 0 };
            return layout.bounds.width + childMargin.left + childMargin.right;
          }),
          0
        );

        // Height: bottom edge of last child INCLUDING its bottom margin
        // Child bounds.y already includes top margin (from layoutBlock), so we just need bottom edge + bottom margin
        const lastLayout = flowChildLayouts[flowChildLayouts.length - 1]!;
        const lastChildMargin = lastLayout.node.margin || { left: 0, right: 0, top: 0, bottom: 0 };
        // CRITICAL: Ensure we calculate height correctly - bounds.y is relative to content area start (0)
        // So height = bounds.y (position) + bounds.height (size) + bottom margin
        totalHeight = Math.max(
          1,
          lastLayout.bounds.y + lastLayout.bounds.height + (lastChildMargin.bottom || 0)
        );
      } else {
        // No children - ensure minimum height of 1 for content area
        totalHeight = 1;
      }

      // Block-level behavior: expand to fill available width (CSS default)
      // Only shrink-to-fit if explicit width is set or if no constraints available
      // CSS box model: width:auto means width = available - margins - border - padding
      const selfMargin = this.margin || { left: 0, right: 0, top: 0, bottom: 0 };
      let contentWidth = maxWidth;
      if (this.width !== null) {
        // Explicit width set
        contentWidth = this.width;
      } else if (context?.constraints?.availableWidth) {
        // No explicit width - expand to fill available space (block-level behavior)
        // Subtract this element's own margins so total footprint fits in available space
        const availableContentWidth =
          context.constraints.availableWidth -
          borderWidth.left -
          borderWidth.right -
          this.padding.left -
          this.padding.right -
          (selfMargin.left || 0) -
          (selfMargin.right || 0);
        contentWidth = Math.max(maxWidth, Math.max(0, availableContentWidth));
      }

      // CRITICAL: Ensure total height is at least 1 (content) + border + padding
      const minHeight =
        borderWidth.top + borderWidth.bottom + this.padding.top + this.padding.bottom + 1;
      const calculatedHeight =
        totalHeight + borderWidth.top + borderWidth.bottom + this.padding.top + this.padding.bottom;

      return {
        width:
          contentWidth +
          borderWidth.left +
          borderWidth.right +
          this.padding.left +
          this.padding.right,
        height: Math.max(minHeight, calculatedHeight),
        contentWidth: contentWidth,
        contentHeight: totalHeight,
      };
    }
  }

  private createChildContext(boxContext: RenderContext, _layout: LayoutResult): RenderContext {
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

  /**
   * Render to cell buffer (multi-buffer system)
   */
  renderToCellBuffer(context: import('../../buffer').CellRenderContext): void {
    const style = this.computeStyle();
    const { buffer, x, y, maxWidth, maxHeight, layerId, nodeId, zIndex } = context;

    // Get colors from style
    const background = style.getBackgroundColor() || context.background;

    // 1. Render background
    if (background && background !== 'inherit' && background !== 'transparent') {
      buffer.fillBackground(x, y, maxWidth, maxHeight, background, layerId, nodeId, zIndex);
    }

    // 2. Render border
    if (
      this.border.show.top ||
      this.border.show.right ||
      this.border.show.bottom ||
      this.border.show.left
    ) {
      this.renderBorderToCellBuffer({
        ...context,
        background,
      });
    }

    // Note: Children are rendered by BufferRenderer.renderNodeTree()
    // which walks the entire node tree. We don't render children here
    // to avoid double-rendering.
  }
}
