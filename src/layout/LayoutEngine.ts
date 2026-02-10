/**
 * Layout engine - handles flexbox, grid, and block layouts
 * Integrates with new class-based node system
 */

import type { Node } from '../nodes/base/Node';
import type { LayoutConstraints, ChildLayout } from '../nodes/base/mixins/Layoutable';

// Interface for nodes with style computation
interface StylableNode {
  computeStyle(): {
    getProperty(name: string): unknown;
    getColor?(): string | null;
    getBackgroundColor?(): string | null;
    getDisplay?(): string;
  };
}

// Interface for nodes with layout computation
interface LayoutableNode {
  computeLayout(constraints: LayoutConstraints): {
    bounds?: { x: number; y: number; width: number; height: number };
    width: number;
    height: number;
  };
}

// Layout result with dimensions (for internal use)
interface LayoutResultLocal {
  bounds?: { x: number; y: number; width: number; height: number };
  dimensions?: { width: number; height: number; contentWidth: number; contentHeight: number };
  width: number;
  height: number;
  layout?: Record<string, unknown>;
}

/**
 * Extract text content from a node, handling nested View -> Text structures
 */
export function extractTextContent(node: Node): string | undefined {
  // Direct content
  if (node.content) {
    return String(node.content);
  }

  // Check children for TextNode
  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      // TextNode with content
      if (child.getNodeType && child.getNodeType() === 'text' && child.content) {
        return String(child.content);
      }
      // Nested Box/View - recurse
      if (child.children && child.children.length > 0) {
        const nestedText = extractTextContent(child);
        if (nestedText) {
          return nestedText;
        }
      }
    }
  }

  return undefined;
}

/**
 * Layout engine for computing child layouts
 */
export class LayoutEngine {
  /**
   * Layout children using flexbox
   * Properly calculates child positions based on flexbox rules
   */
  layoutFlexbox(node: Node, constraints: LayoutConstraints): ChildLayout[] {
    if (!node.children || node.children.length === 0) {
      return [];
    }

    const style = 'computeStyle' in node ? (node as unknown as StylableNode).computeStyle() : null;
    if (!style) {
      return this.layoutBlock(node, constraints);
    }

    const flexDirection = style.getProperty('flexDirection') || 'row';
    const justifyContent = style.getProperty('justifyContent') || 'flex-start';
    const alignItems = style.getProperty('alignItems') || 'stretch';
    const gap = style.getProperty('gap') as { row?: number; column?: number } | number | null;
    const rawRowGap = style.getProperty('rowGap');
    const rawColumnGap = style.getProperty('columnGap');
    const rowGap: number =
      (typeof rawRowGap === 'number' ? rawRowGap : null) ??
      (gap && typeof gap === 'object' ? (gap.row ?? 0) : typeof gap === 'number' ? gap : 0);
    const columnGap: number =
      (typeof rawColumnGap === 'number' ? rawColumnGap : null) ??
      (gap && typeof gap === 'object' ? (gap.column ?? 0) : typeof gap === 'number' ? gap : 0);

    const isRow = flexDirection === 'row' || flexDirection === 'row-reverse';
    const isReverse = flexDirection === 'row-reverse' || flexDirection === 'column-reverse';

    // Step 1: Measure all children
    const childData: Array<{
      node: Node;
      layout: LayoutResultLocal;
      width: number;
      height: number;
      flexGrow: number;
      flexShrink: number;
      flexBasis: number | undefined;
      order: number;
    }> = [];

    for (const child of node.children) {
      if ('computeLayout' in child) {
        const childStyle =
          'computeStyle' in child ? (child as unknown as StylableNode).computeStyle() : null;
        const flex = childStyle?.getProperty('flex');
        const rawFlexGrow = childStyle?.getProperty('flexGrow');
        const flexGrow: number =
          (typeof rawFlexGrow === 'number' ? rawFlexGrow : null) ??
          (typeof flex === 'number' ? flex : 0);
        const rawFlexShrink = childStyle?.getProperty('flexShrink');
        const flexShrink: number = typeof rawFlexShrink === 'number' ? rawFlexShrink : 1;
        const rawFlexBasis = childStyle?.getProperty('flexBasis');
        const flexBasis: number | undefined =
          typeof rawFlexBasis === 'number' ? rawFlexBasis : undefined;
        const rawOrder = childStyle?.getProperty('order');
        const order: number = typeof rawOrder === 'number' ? rawOrder : 0;

        // Compute child layout with available space
        // For row direction, children share the row width; for column, they share column width
        // For initial measurement, we need to provide reasonable constraints
        // If child has explicit width/height, use that; otherwise, use available space
        const childWidth = childStyle?.getProperty('width') || child.width;
        const childHeight = childStyle?.getProperty('height') || child.height;

        // For row direction: if no explicit width, use available width (will be adjusted by flex)
        // For column direction: if no explicit height, use available height (will be adjusted by flex)
        // CRITICAL: For row flex items, do NOT pass availableWidth - they should shrink-to-fit content
        // Otherwise block-level sizing makes them expand to fill the row
        const childConstraints = isRow
          ? {
              maxWidth:
                childWidth !== null && childWidth !== undefined
                  ? typeof childWidth === 'number'
                    ? childWidth
                    : constraints.maxWidth
                  : constraints.maxWidth, // Children share available width in row
              maxHeight: constraints.maxHeight,
              // Don't pass availableWidth for row items - they should shrink-to-fit
              availableWidth: undefined,
              availableHeight: constraints.availableHeight,
            }
          : {
              maxWidth: constraints.maxWidth,
              maxHeight:
                childHeight !== null && childHeight !== undefined
                  ? typeof childHeight === 'number'
                    ? childHeight
                    : constraints.maxHeight
                  : constraints.maxHeight, // Children share available height in column
              availableWidth: constraints.availableWidth,
              availableHeight: constraints.availableHeight,
            };

        const childLayout = (child as unknown as LayoutableNode).computeLayout(
          childConstraints
        ) as LayoutResultLocal;

        // Ensure dimensions are valid (at least 1x1)
        const layoutWidth = Math.max(1, childLayout.dimensions?.width || childLayout.width || 0);
        const layoutHeight = Math.max(1, childLayout.dimensions?.height || childLayout.height || 0);

        childData.push({
          node: child,
          layout: childLayout,
          width: layoutWidth,
          height: layoutHeight,
          flexGrow,
          flexShrink,
          flexBasis,
          order,
        });
      }
    }

    // Sort by order
    childData.sort((a, b) => a.order - b.order);
    if (isReverse) {
      childData.reverse();
    }

    // Check for flex wrap
    const flexWrap = style?.getProperty('flexWrap') || 'nowrap';
    const shouldWrap = flexWrap === 'wrap' || flexWrap === 'wrap-reverse';

    // Step 2: Calculate total size and available space
    // CRITICAL: Use terminal width as maximum constraint, not Infinity
    const { getTerminalDimensions, getLayoutMaxHeight } = require('../utils/terminal');
    const terminalDims = getTerminalDimensions();
    const maxTerminalWidth = terminalDims.columns;
    const maxTerminalHeight = getLayoutMaxHeight();

    const totalMainSize = isRow
      ? childData.reduce((sum, item) => sum + item.width, 0)
      : childData.reduce((sum, item) => sum + item.height, 0);
    const totalGap = isRow ? (childData.length - 1) * columnGap : (childData.length - 1) * rowGap;

    // Clamp available size to parent's constraints (not terminal dimensions)
    // IMPORTANT: For flexbox, the available size depends on:
    // 1. Whether the node has explicit width/height style
    // 2. Whether justifyContent needs free space (center, space-between, space-around, space-evenly, flex-end)
    // For justifyContent that needs space, use parent's available space to distribute items
    const nodeHasExplicitWidth = style && style.getProperty('width') !== undefined;
    const nodeHasExplicitHeight = style && style.getProperty('height') !== undefined;

    // Use parent's available width/height, not terminal dimensions
    // This ensures containers fit within their parent's bounds
    const parentAvailableWidth = constraints.maxWidth ?? maxTerminalWidth;
    const parentAvailableHeight = constraints.maxHeight ?? maxTerminalHeight;

    // CRITICAL: The constraints passed to layoutFlexbox already represent the CONTENT AREA
    // (BoxNode.computeLayout already subtracts this node's border+padding before calling layoutFlexbox)
    // So we should NOT subtract border+padding again here
    // The constraints.maxWidth IS the content area width for positioning children
    const maxContentWidth = parentAvailableWidth;
    const maxContentHeight = parentAvailableHeight;

    // HTML/CSS behavior for flex containers:
    // - Flex containers are BLOCK-LEVEL elements (display: flex, not inline-flex)
    // - Block-level elements fill their parent's available width by default
    // - So BOTH row and column flex containers should fill available width
    // - Height behavior differs: row = max child height, column = sum of children
    // This matches how HTML/CSS flexbox works
    const explicitWidth = style?.getProperty('width');
    const explicitHeight = style?.getProperty('height');
    const availableMainSize = isRow
      ? nodeHasExplicitWidth && typeof explicitWidth === 'number'
        ? Math.min(explicitWidth, maxContentWidth)
        : maxContentWidth // Block-level: fill available width
      : nodeHasExplicitHeight &&
          constraints.maxHeight !== undefined &&
          typeof explicitHeight === 'number'
        ? Math.min(explicitHeight, maxContentHeight)
        : totalMainSize + totalGap; // Height: auto-size based on children
    const freeSpace = availableMainSize - totalMainSize - totalGap;

    // Step 3: Handle flex wrap FIRST - split children into lines BEFORE flex grow/shrink
    // This uses the ORIGINAL measured sizes, not shrunk sizes
    type FlexLine = typeof childData;
    const lines: FlexLine[] = [];

    if (shouldWrap && childData.length > 0) {
      // Split children into lines based on available main axis space
      let currentLine: FlexLine = [];
      let currentLineMainSize = 0;
      const availableMain = isRow ? maxContentWidth : maxContentHeight;

      for (const item of childData) {
        const itemMainSize = isRow ? item.width : item.height;
        const itemGap = currentLine.length > 0 ? (isRow ? columnGap : rowGap) : 0;

        // Check if item fits on current line
        if (
          currentLine.length > 0 &&
          currentLineMainSize + itemGap + itemMainSize > availableMain
        ) {
          // Start new line
          lines.push(currentLine);
          currentLine = [item];
          currentLineMainSize = itemMainSize;
        } else {
          currentLine.push(item);
          currentLineMainSize += itemGap + itemMainSize;
        }
      }

      // Add last line
      if (currentLine.length > 0) {
        lines.push(currentLine);
      }

      // Handle wrap-reverse
      if (flexWrap === 'wrap-reverse') {
        lines.reverse();
      }
    } else {
      // No wrapping - all items on one line, apply flex grow/shrink
      lines.push(childData);

      // Apply flex grow/shrink only in nowrap mode
      let remainingFreeSpace = freeSpace;
      const flexGrowTotal = childData.reduce((sum, item) => sum + item.flexGrow, 0);

      if (flexGrowTotal > 0 && remainingFreeSpace > 0) {
        // Distribute positive free space
        for (const item of childData) {
          if (item.flexGrow > 0) {
            const growAmount = (remainingFreeSpace * item.flexGrow) / flexGrowTotal;
            if (isRow) {
              item.width += growAmount;
            } else {
              item.height += growAmount;
            }
          }
        }
      } else if (remainingFreeSpace < 0) {
        // Shrink items only in nowrap mode
        const flexShrinkTotal = childData.reduce(
          (sum, item) => sum + item.flexShrink * (isRow ? item.width : item.height),
          0
        );
        if (flexShrinkTotal > 0) {
          for (const item of childData) {
            if (item.flexShrink > 0) {
              const shrinkAmount =
                (Math.abs(remainingFreeSpace) *
                  item.flexShrink *
                  (isRow ? item.width : item.height)) /
                flexShrinkTotal;
              if (isRow) {
                item.width = Math.max(1, item.width - shrinkAmount); // Ensure at least 1
              } else {
                item.height = Math.max(1, item.height - shrinkAmount); // Ensure at least 1
              }
            }
          }
        }
      }
    }

    // Step 4: Apply flex grow/shrink per line (for wrap mode)

    // Step 5: Calculate positions for each line
    const childLayouts: ChildLayout[] = [];
    let crossOffset = 0; // Offset in the cross-axis direction for stacking lines

    for (const lineItems of lines) {
      // Calculate cross-axis size for this line
      const lineCrossSize = isRow
        ? Math.max(...lineItems.map((item) => item.height), 1)
        : Math.max(...lineItems.map((item) => item.width), 1);

      // Calculate total main size and free space for this line
      const lineTotalMainSize = isRow
        ? lineItems.reduce((sum, item) => sum + item.width, 0)
        : lineItems.reduce((sum, item) => sum + item.height, 0);
      const lineTotalGap = isRow
        ? (lineItems.length - 1) * columnGap
        : (lineItems.length - 1) * rowGap;
      const lineAvailableMain = isRow ? maxContentWidth : maxContentHeight;
      const lineFreeSpace = lineAvailableMain - lineTotalMainSize - lineTotalGap;

      // Calculate starting position based on justifyContent
      let mainPos = 0;

      if (lineItems.length > 0) {
        const firstChildMargin = lineItems[0]!.node.margin || {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        };
        if (isRow) {
          mainPos = firstChildMargin.left || 0;
        } else {
          mainPos = firstChildMargin.top || 0;
        }
      }

      if (justifyContent === 'center') {
        mainPos += lineFreeSpace / 2;
      } else if (justifyContent === 'flex-end') {
        mainPos += lineFreeSpace;
      } else if (justifyContent === 'space-around' && lineItems.length > 0) {
        const spacing = lineFreeSpace / lineItems.length;
        mainPos += spacing / 2;
      } else if (justifyContent === 'space-evenly' && lineItems.length > 0) {
        const spacing = lineFreeSpace / (lineItems.length + 1);
        mainPos += spacing;
      }

      // Position each item in this line
      for (let i = 0; i < lineItems.length; i++) {
        const item = lineItems[i]!;
        const childMargin = item.node.margin || { left: 0, right: 0, top: 0, bottom: 0 };

        let crossPos = crossOffset;

        // Calculate cross-axis position based on alignItems
        // Cross-axis margins also affect positioning
        if (isRow) {
          // For row, cross-axis is vertical (top/bottom margins)
          const crossMarginTop = childMargin.top || 0;
          switch (alignItems) {
            case 'flex-end':
              crossPos = crossOffset + lineCrossSize - item.height - (childMargin.bottom || 0);
              break;
            case 'center':
              crossPos =
                crossOffset + Math.floor((lineCrossSize - item.height) / 2) + crossMarginTop;
              break;
            case 'stretch':
              item.height = lineCrossSize - crossMarginTop - (childMargin.bottom || 0);
              crossPos = crossOffset + crossMarginTop;
              break;
            default:
              crossPos = crossOffset + crossMarginTop;
          }
        } else {
          // For column, cross-axis is horizontal (left/right margins)
          const crossMarginLeft = childMargin.left || 0;
          switch (alignItems) {
            case 'flex-end':
              crossPos = crossOffset + lineCrossSize - item.width - (childMargin.right || 0);
              break;
            case 'center':
              crossPos =
                crossOffset + Math.floor((lineCrossSize - item.width) / 2) + crossMarginLeft;
              break;
            case 'stretch':
              item.width = lineCrossSize - crossMarginLeft - (childMargin.right || 0);
              crossPos = crossOffset + crossMarginLeft;
              break;
            default:
              crossPos = crossOffset + crossMarginLeft;
          }
        }

        // Recalculate dimensions after alignItems: stretch may have modified them
        const finalWidth = Math.max(1, Math.round(item.width));
        const finalHeight = Math.max(1, Math.round(item.height));

        const bounds = isRow
          ? {
              x: Math.round(mainPos),
              y: crossPos,
              width: finalWidth,
              height: finalHeight,
            }
          : {
              x: crossPos,
              y: Math.round(mainPos),
              width: finalWidth,
              height: finalHeight,
            };

        childLayouts.push({
          node: item.node,
          bounds,
        });

        // Update position for next item
        // Account for margins: main-axis margin (right for row, bottom for column) affects spacing
        const gapSize = isRow ? columnGap : rowGap;
        let spacing = 0;

        if (justifyContent === 'space-between' && i < lineItems.length - 1) {
          // Space between items only (not after last)
          spacing = lineFreeSpace / (lineItems.length - 1);
        } else if (justifyContent === 'space-around') {
          spacing = lineFreeSpace / lineItems.length;
        } else if (justifyContent === 'space-evenly') {
          spacing = lineFreeSpace / (lineItems.length + 1);
        }

        if (isRow) {
          // Move past current item: width + right margin + gap (only between items) + spacing
          // Use finalWidth (already validated, recalculated after stretch)
          mainPos += finalWidth + (childMargin.right || 0);
          if (i < lineItems.length - 1) {
            mainPos += gapSize; // Only add gap between items, not after last
          }
          mainPos += spacing;
        } else {
          // Move past current item: height + bottom margin + gap (only between items) + spacing
          // Use finalHeight (already validated to be at least 1, recalculated after stretch)
          mainPos += finalHeight + (childMargin.bottom || 0);
          if (i < lineItems.length - 1) {
            mainPos += gapSize; // Only add gap between items, not after last
          }
          mainPos += spacing;
        }
      }

      // Update cross offset for next line
      crossOffset += lineCrossSize + (isRow ? rowGap : columnGap);
    }

    return childLayouts;
  }

  /**
   * Layout children using grid
   * Grid layout positions children in a grid based on gridTemplateColumns/Rows
   */
  layoutGrid(node: Node, constraints: LayoutConstraints): ChildLayout[] {
    const childLayouts: ChildLayout[] = [];
    const style = 'computeStyle' in node ? (node as unknown as StylableNode).computeStyle() : null;

    // Get grid configuration using getProperty (more reliable than getter methods)
    const gridTemplateColumns = style?.getProperty?.('gridTemplateColumns');
    const gridTemplateRows = style?.getProperty?.('gridTemplateRows');
    const gap = style?.getProperty?.('gap') as { row?: number; column?: number } | number | null;
    const rowGap: number =
      gap && typeof gap === 'object' ? (gap.row ?? 0) : typeof gap === 'number' ? gap : 0;
    const columnGap: number =
      gap && typeof gap === 'object' ? (gap.column ?? 0) : typeof gap === 'number' ? gap : 0;

    // Parse grid template columns
    // CSS Grid behavior: numbers in arrays are treated as fractional units (like 1fr)
    // This matches CSS grid-template-columns: 1fr 2fr 1fr syntax
    let columnWidths: number[];
    if (Array.isArray(gridTemplateColumns)) {
      // Treat array values as fractional units (like CSS 'fr')
      // [1, 1, 1] = 3 equal columns, [1, 2, 1] = columns in 1:2:1 ratio
      const frUnits = gridTemplateColumns.map((w) => (typeof w === 'number' ? w : 1));
      const totalFr = frUnits.reduce((sum, fr) => sum + fr, 0);
      const availableWidth =
        (constraints.maxWidth ?? 80) - (frUnits.length - 1) * (columnGap as number);
      columnWidths = frUnits.map((fr) => Math.floor((fr / totalFr) * availableWidth));
    } else if (typeof gridTemplateColumns === 'string') {
      // Parse string format like '1fr 2fr 1fr'
      const parts = gridTemplateColumns.split(/\s+/);
      const frUnits = parts.map((p) => {
        if (p.endsWith('fr')) {
          return parseFloat(p) || 1;
        }
        return parseFloat(p) || 0;
      });

      // Calculate total fr units
      const totalFr = frUnits.reduce((sum, fr) => sum + fr, 0);
      const availableWidth =
        (constraints.maxWidth ?? 80) - (parts.length - 1) * (columnGap as number);

      columnWidths = frUnits.map((fr) => Math.floor((fr / totalFr) * availableWidth));
    } else {
      // Default to auto layout - equal width columns based on child count
      const numChildren = node.children.length;
      const numColumns = Math.min(numChildren, 3); // Default to max 3 columns
      const availableWidth =
        (constraints.maxWidth ?? 80) - (numColumns - 1) * (columnGap as number);
      const colWidth = Math.floor(availableWidth / numColumns);
      columnWidths = Array(numColumns).fill(colWidth);
    }

    const numColumns = columnWidths.length;

    // Parse grid template rows (optional)
    let rowHeights: number[] | null = null;
    if (Array.isArray(gridTemplateRows)) {
      rowHeights = gridTemplateRows.map((h) => (typeof h === 'number' ? h : 5));
    }

    let currentCol = 0;
    let currentRow = 0;
    let currentX = 0;
    let currentY = 0;
    let maxRowHeight = 0;

    for (const child of node.children) {
      if ('computeLayout' in child) {
        const colWidth = columnWidths[currentCol] || columnWidths[columnWidths.length - 1] || 10;
        const rowHeight = rowHeights
          ? rowHeights[currentRow] || rowHeights[rowHeights.length - 1] || 5
          : undefined;

        // Check for grid-column span (e.g., '1 / 3' means span from col 1 to 3)
        const childStyle =
          'computeStyle' in child ? (child as unknown as StylableNode).computeStyle() : null;
        const gridColumn = childStyle?.getProperty?.('gridColumn');

        let spanCols = 1;
        let effectiveWidth = colWidth;

        if (gridColumn && typeof gridColumn === 'string') {
          const match = gridColumn.match(/(\d+)\s*\/\s*(\d+)/);
          if (match && match[1] && match[2]) {
            const startCol = parseInt(match[1], 10) - 1;
            const endCol = parseInt(match[2], 10) - 1;
            spanCols = endCol - startCol;

            // Calculate total width for spanned columns
            effectiveWidth = 0;
            for (let i = 0; i < spanCols && currentCol + i < columnWidths.length; i++) {
              effectiveWidth += columnWidths[currentCol + i] || 0;
            }
            // Add gaps between spanned columns
            effectiveWidth += (spanCols - 1) * (columnGap as number);
          }
        }

        const childLayout = (child as unknown as LayoutableNode).computeLayout({
          maxWidth: effectiveWidth,
          maxHeight: rowHeight || constraints.maxHeight,
          availableWidth: effectiveWidth,
          availableHeight: rowHeight || constraints.availableHeight,
        }) as LayoutResultLocal;

        const childWidth = childLayout.dimensions?.width ?? childLayout.width ?? 0;
        const childHeight = childLayout.dimensions?.height ?? childLayout.height ?? 0;

        childLayouts.push({
          node: child,
          bounds: {
            x: currentX,
            y: currentY,
            width: childWidth,
            height: childHeight,
          },
        });

        maxRowHeight = Math.max(maxRowHeight, childHeight);

        // Move to next column(s)
        currentCol += spanCols;
        currentX += effectiveWidth + (columnGap as number);

        // Move to next row if needed
        if (currentCol >= numColumns) {
          currentCol = 0;
          currentRow++;
          currentX = 0;
          currentY +=
            (rowHeights ? rowHeights[currentRow - 1] || maxRowHeight : maxRowHeight) +
            (rowGap as number);
          maxRowHeight = 0;
        }
      }
    }

    return childLayouts;
  }

  /**
   * Layout children using block layout
   * Implements CSS-style margin collapsing for adjacent vertical margins
   */
  layoutBlock(node: Node, constraints: LayoutConstraints): ChildLayout[] {
    const childLayouts: ChildLayout[] = [];
    let currentY = 0;
    let prevBottomMargin = 0; // Track previous child's bottom margin for collapsing

    if (!node.children || node.children.length === 0) {
      return childLayouts;
    }

    for (const child of node.children) {
      // Check if child has computeLayout method
      // TextNode extends Layoutable, so it should have computeLayout
      const layoutableChild = child as unknown as LayoutableNode;
      if ('computeLayout' in child && typeof layoutableChild.computeLayout === 'function') {
        try {
          // Account for child's top margin when calculating available space
          const childMargin = child.margin || { left: 0, right: 0, top: 0, bottom: 0 };
          const marginTop = childMargin.top || 0;

          // CSS margin collapsing: adjacent vertical margins collapse into one
          // The collapsed margin is the larger of the two (not the sum)
          // Example: if prevBottomMargin=2 and marginTop=3, collapsed=3 (not 5)
          const collapsedMargin = Math.max(prevBottomMargin, marginTop);

          const childLayout = layoutableChild.computeLayout({
            maxWidth: constraints.maxWidth ?? Infinity,
            maxHeight: constraints.maxHeight
              ? constraints.maxHeight - currentY - collapsedMargin
              : undefined,
            availableWidth: constraints.availableWidth ?? Infinity,
            availableHeight: constraints.availableHeight
              ? constraints.availableHeight - currentY - collapsedMargin
              : undefined,
          }) as LayoutResultLocal | null;

          if (childLayout) {
            // Ensure dimensions are valid (at least 1x1 for text nodes)
            const width = Math.max(1, childLayout.dimensions?.width || childLayout.width || 0);
            const height = Math.max(1, childLayout.dimensions?.height || childLayout.height || 0);

            // Position child accounting for collapsed margin
            childLayouts.push({
              node: child,
              bounds: {
                x: childMargin.left || 0, // Left margin shifts child right
                y: currentY + collapsedMargin, // Use collapsed margin
                width: width,
                height: height,
              },
            });

            // Move to next position: current position + collapsed margin + child height
            // Track bottom margin for potential collapse with next child
            currentY += collapsedMargin + height;
            prevBottomMargin = childMargin.bottom || 0;
          }
        } catch {
          // Skip children that fail to compute layout
          // Don't log errors in production
        }
      }
    }

    return childLayouts;
  }

  /**
   * Convert Node to ConsoleNode format (temporary bridge)
   */
  private nodeToConsoleNode(node: Node): {
    type: string;
    content?: unknown;
    style?: Record<string, unknown>;
    children: unknown[];
  } {
    const style = 'computeStyle' in node ? (node as unknown as StylableNode).computeStyle() : null;
    return {
      type: node.getNodeType(),
      content: node.content,
      style: style ? this.computedStyleToViewStyle(style) : undefined,
      children: node.children.map((child) => this.nodeToConsoleNode(child)),
    };
  }

  /**
   * Convert ComputedStyle to ViewStyle format (temporary bridge)
   */
  private computedStyleToViewStyle(
    style: ReturnType<StylableNode['computeStyle']>
  ): Record<string, unknown> {
    return {
      display: style.getDisplay?.() ?? style.getProperty('display') ?? 'block',
      flexDirection: style.getProperty('flexDirection'),
      justifyContent: style.getProperty('justifyContent'),
      alignItems: style.getProperty('alignItems'),
      // ... other properties
    };
  }
}
