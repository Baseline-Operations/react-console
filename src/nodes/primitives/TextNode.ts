/**
 * Text node - renders text content
 * Composed with Stylable and Renderable mixins
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
import type { ComputedStyle } from '../base/mixins/Stylable';
import type { LayoutConstraints, LayoutResult, Dimensions } from '../base/mixins/Layoutable';
import type { StyleMap } from '../base/types';
import { StyleMixinRegistry } from '../../style/mixins/registry';
import {
  measureText,
  wrapText,
  padToVisibleColumn,
  substringToVisibleColumn,
  substringFromVisibleColumn,
} from '../../utils/measure';
import { applyStyles, getBackgroundColorCode } from '../../renderer/ansi';

/**
 * Text metrics
 */
interface TextMetrics {
  width: number;
  height: number;
  visibleWidth: number;
}

/**
 * A segment of text with its associated style.
 * focusedLink: when true, segment is from a focused LinkNode; render with inverse (reverse fg/bg).
 * nodeRef: when set, segment is from this node (e.g. LinkNode) for bounds registration.
 */
interface TextSegment {
  text: string;
  style: ComputedStyle;
  focusedLink?: boolean;
  nodeRef?: Node;
}

/** Returns true if the node has a focused property set to true (e.g. focused LinkNode). */
function isNodeFocused(node: Node | undefined): boolean {
  if (!node || !('focused' in node)) return false;
  return Boolean((node as { focused: boolean }).focused);
}

// Create the mixed-in base class with proper type handling
const TextNodeBase = Stylable(
  Renderable(Layoutable(Node as unknown as import('../base/types').Constructor<Node>))
);

/**
 * Text node - renders text content
 * Composed with Stylable and Renderable mixins
 */
export class TextNode extends TextNodeBase {
  // Declare inherited mixin properties for TypeScript
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
  // From Stylable
  declare computeStyle: () => import('../base/mixins/Stylable').ComputedStyle;
  declare applyStyleMixin: (name: string) => void;

  private wrappedLines: string[] = [];
  private textSegments: TextSegment[] = [];

  /**
   * TextNode handles its own children rendering via collectTextSegments()
   * This prevents BufferRenderer from rendering nested Text children separately
   */
  get handlesOwnChildren(): boolean {
    return this.children.length > 0;
  }

  constructor(id?: string) {
    super(id);
    // Apply text style mixin
    this.applyStyleMixin('TextStyle');
  }

  /**
   * Apply textTransform to a string (uppercase, lowercase, capitalize).
   */
  private static applyTextTransform(
    text: string,
    transform: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
  ): string {
    if (!text || transform === 'none') return text;
    if (transform === 'uppercase') return text.toUpperCase();
    if (transform === 'lowercase') return text.toLowerCase();
    if (transform === 'capitalize') {
      return text.replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
    }
    return text;
  }

  /**
   * Collect all text segments from this node and its children
   * This enables nested Text components like: <Text>Hello <Text style={{bold: true}}>World</Text></Text>
   * Parent's textTransform is applied to child segment text when the content came from a string child
   * (so <Text textTransform="uppercase">foo</Text> works even when "foo" is in a child TextNode).
   */
  private collectTextSegments(): TextSegment[] {
    const segments: TextSegment[] = [];
    const style = this.computeStyle();
    const parentTransform = style.getTextTransform?.() ?? 'none';

    // If this node has children, collect from them (they include any text content)
    // If no children, use this node's content directly
    // This avoids double-counting when NodeFactory sets content AND reconciler adds child
    if (this.children.length > 0) {
      // Collect from children only - they represent the actual content structure.
      // Treat text and link children as having their own segments (shared styling path).
      // Parent textTransform intentionally overrides child (applied to all segment text).
      for (const child of this.children) {
        const nodeType = child.getNodeType?.();
        if (nodeType === 'text' || nodeType === 'link') {
          const textLikeChild = child as TextNode;
          const childSegments = textLikeChild.collectTextSegments();
          const isFocusedLink = nodeType === 'link' && isNodeFocused(child);
          for (const seg of childSegments) {
            segments.push({
              text: TextNode.applyTextTransform(seg.text, parentTransform),
              style: seg.style,
              focusedLink: isFocusedLink,
              nodeRef: nodeType === 'link' ? child : undefined,
            });
          }
        } else if (child.content) {
          // Raw text node or other node with content
          const raw = child.content;
          const transformed = TextNode.applyTextTransform(raw, parentTransform);
          segments.push({ text: transformed, style });
        }
      }
    } else if (this.content) {
      // Leaf text node - use its own content
      const transformed = TextNode.applyTextTransform(this.content, parentTransform);
      segments.push({ text: transformed, style });
    }

    return segments;
  }

  getNodeType(): string {
    return 'text';
  }

  getDefaultStyle(): StyleMap {
    const baseStyle = StyleMixinRegistry.get('BaseStyle')?.getDefaultStyle() || {};
    const textStyle = StyleMixinRegistry.get('TextStyle')?.getDefaultStyle() || {};
    return { ...baseStyle, ...textStyle };
  }

  /**
   * Return regions for interactive children (e.g. links) so BufferRenderer can register their bounds for mouse hit testing.
   * Coordinates are relative to this node's layout (x, y = column, row within the text block).
   * One region per node (merged if segment spans multiple lines).
   * Known limitation: merged box uses min(x)/max(right) across lines, so a multi-line link can have a hit region
   * wider than the text on any single line and may cause false-positive hits on adjacent non-link text.
   */
  getInteractiveChildRegions(): {
    node: Node;
    x: number;
    y: number;
    width: number;
    height: number;
  }[] {
    const byNode = new Map<Node, { x: number; y: number; right: number; bottom: number }>();
    if (this.textSegments.length === 0 || this.wrappedLines.length === 0) return [];
    const fullContent = this.textSegments.map((s) => s.text).join('');
    let segmentStart = 0;
    for (const seg of this.textSegments) {
      if (!seg.nodeRef) {
        segmentStart += seg.text.length;
        continue;
      }
      const segmentEnd = segmentStart + seg.text.length;
      let lineStartCharIndex = 0;
      for (let lineIndex = 0; lineIndex < this.wrappedLines.length; lineIndex++) {
        const line = this.wrappedLines[lineIndex] ?? '';
        const lineEndCharIndex = lineStartCharIndex + line.length;
        if (segmentEnd <= lineStartCharIndex || segmentStart >= lineEndCharIndex) {
          lineStartCharIndex = lineEndCharIndex;
          if (lineStartCharIndex < fullContent.length && fullContent[lineStartCharIndex] === '\n') {
            lineStartCharIndex++;
          }
          continue;
        }
        const startInLine = Math.max(0, segmentStart - lineStartCharIndex);
        const endInLine = Math.min(line.length, segmentEnd - lineStartCharIndex);
        const slice = line.substring(startInLine, endInLine);
        const width = measureText(slice);
        const x = width > 0 ? measureText(line.substring(0, startInLine)) : 0;
        const existing = byNode.get(seg.nodeRef);
        const right = x + width;
        const bottom = lineIndex + 1;
        if (existing) {
          existing.x = Math.min(existing.x, x);
          existing.y = Math.min(existing.y, lineIndex);
          existing.right = Math.max(existing.right, right);
          existing.bottom = Math.max(existing.bottom, bottom);
        } else {
          byNode.set(seg.nodeRef, { x, y: lineIndex, right, bottom });
        }
        lineStartCharIndex = lineEndCharIndex;
        if (lineStartCharIndex < fullContent.length && fullContent[lineStartCharIndex] === '\n') {
          lineStartCharIndex++;
        }
      }
      segmentStart = segmentEnd;
    }
    return Array.from(byNode.entries()).map(([node, r]) => ({
      node,
      x: r.x,
      y: r.y,
      width: r.right - r.x,
      height: r.bottom - r.y,
    }));
  }

  computeLayout(constraints: LayoutConstraints): LayoutResult {
    const style = this.computeStyle();

    // Collect text segments from this node and all children
    this.textSegments = this.collectTextSegments();
    const fullContent = this.textSegments.map((s) => s.text).join('');

    // Always recalculate wrapped lines (they depend on constraints which may change)
    let metrics: { width: number };
    if (!fullContent) {
      this.wrappedLines = [''];
      metrics = { width: 0 };
    } else {
      // Ensure maxWidth is at least 1 to avoid issues with text measurement
      const safeMaxWidth = Math.max(1, constraints.maxWidth ?? Infinity);
      metrics = this.measureText(fullContent, style, { ...constraints, maxWidth: safeMaxWidth });
      this.wrappedLines = this.wrapText(fullContent, style, safeMaxWidth);
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
      const availableContentWidth =
        constraints.availableWidth -
        borderWidth.left -
        borderWidth.right -
        this.padding.left -
        this.padding.right;
      contentWidth = Math.max(contentWidth, availableContentWidth);
    }

    const totalWidth = Math.max(
      1,
      contentWidth + borderWidth.left + borderWidth.right + this.padding.left + this.padding.right
    );
    const totalHeight = Math.max(
      1,
      contentHeight + borderWidth.top + borderWidth.bottom + this.padding.top + this.padding.bottom
    );

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
    const bgColor = style.getBackgroundColor();
    if (bgColor && bgColor !== 'inherit' && bgColor !== 'transparent') {
      this.renderBackground(buffer, style, context);
    }

    // 2. Render text content with segments
    let currentY = context.y;
    const hasContent = this.textSegments.length > 0 || this.content;

    if (hasContent) {
      // Get text alignment and available width for alignment calculation
      const textAlign = style.getTextAlign?.() || 'left';
      const availableWidth = context.constraints.maxWidth ?? this.bounds?.width ?? 80;

      // Render using segments if we have them (supports nested Text)
      if (this.textSegments.length > 0) {
        // Render all wrapped lines with proper segment styling
        for (let lineIndex = 0; lineIndex < this.wrappedLines.length; lineIndex++) {
          const line = this.wrappedLines[lineIndex];
          // Preserve whitespace-only lines for vertical spacing
          if (line && line.length > 0) {
            const lineWidth = measureText(line);
            let lineX = context.x;

            if (textAlign === 'center') {
              lineX = context.x + Math.floor((availableWidth - lineWidth) / 2);
            } else if (textAlign === 'right') {
              lineX = context.x + availableWidth - lineWidth;
            }

            // Render the line with segment styling, passing lineIndex for correct offset
            this.renderLineWithSegments(buffer, line, lineX, currentY, context, lineIndex);
            currentY++;
          }
        }
      } else if (this.content) {
        // Fallback for simple content without segments
        for (const line of this.wrappedLines) {
          // Preserve whitespace-only lines for vertical spacing
          if (line && line.length > 0) {
            const lineWidth = measureText(line);
            let lineX = context.x;

            if (textAlign === 'center') {
              lineX = context.x + Math.floor((availableWidth - lineWidth) / 2);
            } else if (textAlign === 'right') {
              lineX = context.x + availableWidth - lineWidth;
            }

            this.renderLine(buffer, line, style, lineX, currentY, context);
            currentY++;
          }
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

    this.registerRendering(bufferRegion, style.getZIndex() || 0, context.viewport ?? null);

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
    style: ComputedStyle,
    _constraints: LayoutConstraints
  ): TextMetrics {
    const styledContent = applyStyles(content, {
      color: style.getColor() ?? undefined,
      backgroundColor: style.getBackgroundColor() ?? undefined,
      bold: style.getBold(),
    });

    return {
      width: measureText(styledContent),
      height: 1,
      visibleWidth: measureText(content),
    };
  }

  private wrapText(content: string, _style: ComputedStyle, maxWidth: number): string[] {
    if (!content) return [];

    // Don't apply styles here - styling is done in renderLine
    // Applying styles here causes double-styling (once here, once in renderLine)
    return wrapText(content, maxWidth);
  }

  /**
   * Walk up the parent chain and return the ANSI background-color code
   * of the nearest ancestor with an opaque backgroundColor, or null.
   */
  private getParentBackgroundCode(): string | null {
    interface StylableParent {
      computeStyle(): ComputedStyle;
      parent?: Node | null;
    }
    let current: Node | null = this.parent;
    while (current) {
      if ('computeStyle' in current) {
        const pStyle = (current as unknown as StylableParent).computeStyle();
        const bgColor = pStyle.getBackgroundColor();
        if (bgColor && bgColor !== 'inherit' && bgColor !== 'transparent') {
          const code = getBackgroundColorCode(bgColor);
          return code || null;
        }
      }
      current = current.parent || null;
    }
    return null;
  }

  /**
   * Render a line with segment-specific styling
   * Maps positions in the line back to their original segments to apply correct styles
   * @param lineIndex - The index of this line in wrappedLines (used to calculate offset)
   */
  private renderLineWithSegments(
    buffer: OutputBuffer,
    line: string,
    x: number,
    y: number,
    _context: RenderContext,
    lineIndex: number
  ): void {
    while (buffer.lines.length <= y) {
      buffer.lines.push('');
    }

    const currentLine = buffer.lines[y] || '';

    // Build a styled string by tracking position in the full text
    // and applying the appropriate segment's style

    // Calculate where this line starts in the full text using index (not value equality)
    // This correctly handles identical lines at different positions
    // Also accounts for newlines that wrapText strips
    const fullContent = this.textSegments.map((s) => s.text).join('');
    let lineStartInFull = 0;
    for (let i = 0; i < lineIndex && i < this.wrappedLines.length; i++) {
      const wrappedLine = this.wrappedLines[i];
      if (wrappedLine) {
        lineStartInFull += wrappedLine.length;
        // Check if there was a newline after this line in the original text
        // wrapText splits on \n first, so we need to account for stripped newlines
        if (lineStartInFull < fullContent.length && fullContent[lineStartInFull] === '\n') {
          lineStartInFull++; // Skip the newline
        }
      }
    }

    // Build styled output by accumulating runs of same-styled characters
    // This reduces ANSI sequence count by styling runs instead of individual chars
    let styledOutput = '';
    let charIndex = 0;
    let currentRun = '';
    let currentRunStyle: ComputedStyle | null = null;

    // Per-line cost O(line_length × segment_count); fine for typical terminal text. Future optimization: precomputed position→segment index.
    const getSegmentInfoAtPos = (
      posInFull: number
    ): { style: ComputedStyle | null; focusedLink: boolean } => {
      let segmentStart = 0;
      for (const segment of this.textSegments) {
        const segmentEnd = segmentStart + segment.text.length;
        if (posInFull >= segmentStart && posInFull < segmentEnd) {
          const focused = segment.nodeRef ? isNodeFocused(segment.nodeRef) : false;
          return { style: segment.style, focusedLink: focused };
        }
        segmentStart = segmentEnd;
      }
      return { style: null, focusedLink: false };
    };

    let currentRunFocusedLink = false;

    // Helper to flush current run with styling
    const flushRun = () => {
      if (currentRun.length === 0) return;
      if (currentRunStyle) {
        styledOutput += applyStyles(currentRun, {
          color: currentRunStyle.getColor() ?? undefined,
          backgroundColor: currentRunStyle.getBackgroundColor() ?? undefined,
          bold: currentRunStyle.getBold(),
          dim: currentRunStyle.getDim(),
          italic: currentRunStyle.getItalic(),
          underline: currentRunStyle.getUnderline(),
          strikethrough: currentRunStyle.getStrikethrough(),
          inverse: currentRunFocusedLink || currentRunStyle.getInverse(),
        });
      } else {
        styledOutput += currentRun;
      }
      currentRun = '';
    };

    for (const char of line) {
      const posInFull = lineStartInFull + charIndex;
      const { style: segmentStyle, focusedLink: segmentFocusedLink } =
        getSegmentInfoAtPos(posInFull);

      // Check if style or focus changed
      if (segmentStyle !== currentRunStyle || segmentFocusedLink !== currentRunFocusedLink) {
        flushRun();
        currentRunStyle = segmentStyle;
        currentRunFocusedLink = segmentFocusedLink;
      }

      currentRun += char;
      charIndex++;
    }

    // Flush final run
    flushRun();

    // Ink-style replace-in-range
    const lineWidth = measureText(line);
    const before = padToVisibleColumn(substringToVisibleColumn(currentLine, x), x);
    let after = substringFromVisibleColumn(currentLine, x + lineWidth);

    // Re-apply parent's background color to the "after" portion if needed
    if (after) {
      const parentBgCode = this.getParentBackgroundCode();
      if (parentBgCode) {
        after = parentBgCode + after;
      }
    }

    this.setBufferLine(buffer, y, before + styledOutput + after);
  }

  /**
   * Write line content to buffer. Overridden by LinkNode to wrap in OSC 8.
   */
  protected setBufferLine(buffer: OutputBuffer, y: number, content: string): void {
    buffer.lines[y] = content;
  }

  private renderLine(
    buffer: OutputBuffer,
    line: string,
    style: ComputedStyle,
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
      color: style.getColor() ?? undefined,
      backgroundColor: bgColor ?? undefined,
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
    if (after) {
      const parentBgCode = this.getParentBackgroundCode();
      if (parentBgCode) {
        after = parentBgCode + after;
      }
    }

    this.setBufferLine(buffer, y, before + styledLine + after);
  }

  /**
   * Render to cell buffer (multi-buffer system)
   */
  renderToCellBuffer(context: import('../../buffer').CellRenderContext): void {
    const style = this.computeStyle();
    const { buffer, x, y, maxWidth, maxHeight, layerId, nodeId, zIndex } = context;

    // Get default colors from style
    const defaultForeground = style.getColor() || context.foreground;
    const background = style.getBackgroundColor() || context.background;

    // Get default text styles
    const defaultBold = style.getBold();
    const defaultDim = style.getDim();
    const defaultItalic = style.getItalic();
    const defaultUnderline = style.getUnderline();
    const defaultStrikethrough = style.getStrikethrough();
    const defaultInverse = style.getInverse();

    // Render background if set
    if (background && background !== 'inherit' && background !== 'transparent') {
      buffer.fillBackground(x, y, maxWidth, maxHeight, background, layerId, nodeId, zIndex);
    }

    // Collect text segments from this node and children
    const segments = this.collectTextSegments();
    if (segments.length === 0) return;

    // Build full text for wrapping
    const fullContent = segments.map((s) => s.text).join('');
    if (!fullContent) return;

    // Get text alignment
    const textAlign = style.getTextAlign?.() || 'left';

    // Wrap text if needed
    const wrappedLines = wrapText(fullContent, maxWidth);
    let cy = y;

    // Calculate where each line starts in the full text
    // (needed because wrapText may split differently than segment boundaries)
    let lineStartInFull = 0;

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
      let charIndexInLine = 0;

      // Per-character segment lookup mirrors O(n×m) in renderLineWithSegments; could share a precomputed char→segment index if needed.
      for (const char of line) {
        if (cx >= x + maxWidth) break;
        if (cx < x) {
          cx++;
          charIndexInLine++;
          continue; // Skip characters that would be before the content area
        }

        // Find which segment this character belongs to
        const posInFull = lineStartInFull + charIndexInLine;
        let segmentStart = 0;
        let segmentStyle: ComputedStyle | null = null;
        let matchedSegment: TextSegment | null = null;

        for (const segment of segments) {
          const segmentEnd = segmentStart + segment.text.length;
          if (posInFull >= segmentStart && posInFull < segmentEnd) {
            segmentStyle = segment.style;
            matchedSegment = segment;
            break;
          }
          segmentStart = segmentEnd;
        }

        // Use segment style if found, otherwise use defaults (segment background is required for Code/link styling)
        const charForeground = segmentStyle?.getColor() || defaultForeground;
        const charBackground = segmentStyle?.getBackgroundColor() || background;
        const charBold = segmentStyle?.getBold() ?? defaultBold;
        const charDim = segmentStyle?.getDim() ?? defaultDim;
        const charItalic = segmentStyle?.getItalic() ?? defaultItalic;
        const charUnderline = segmentStyle?.getUnderline() ?? defaultUnderline;
        const charStrikethrough = segmentStyle?.getStrikethrough() ?? defaultStrikethrough;
        const charInverse =
          !!(matchedSegment?.nodeRef && isNodeFocused(matchedSegment.nodeRef)) ||
          (segmentStyle?.getInverse() ?? defaultInverse);

        buffer.setCell(cx, cy, {
          char,
          foreground: charForeground,
          background: charBackground,
          bold: charBold,
          dim: charDim,
          italic: charItalic,
          underline: charUnderline,
          strikethrough: charStrikethrough,
          inverse: charInverse,
          layerId,
          nodeId,
          zIndex,
        });

        cx++;
        charIndexInLine++;
      }

      // Move to next line in full text
      lineStartInFull += line.length;
      // Account for stripped newlines (same logic as getInteractiveChildRegions / renderLineWithSegments)
      if (lineStartInFull < fullContent.length && fullContent[lineStartInFull] === '\n') {
        lineStartInFull++;
      }
      cy++;
    }
  }
}
