# Comparison with Ink and Other Terminal React Libraries

This document summarizes how **Ink** and similar terminal React libraries handle rendering and layout, and what we adopted (or fixed) in ReactConsoleLog.

## Ink (vadimdemedes/ink)

### Architecture

- **React reconciler** + custom host config → DOM-like tree of `ink-text`, `ink-box`, `ink-root` nodes.
- **Yoga Layout** (Facebook’s flexbox implementation) for all layout. Each node has a `yogaNode`; layout is computed once, then nodes are rendered using `getComputedLeft()`, `getComputedTop()`, `getComputedWidth()`, `getComputedHeight()`.
- **Output model**: A dedicated `Output` class that:
  - Pre-allocates a **2D grid** of `height × width` character cells (each cell: `{ type, value, styles }`).
  - Records **write operations** `output.write(x, y, text)` instead of writing directly to stdout.
  - In `get()`, applies operations in order: each `write` places **character-by-character** into the grid at `(x, y)`, advancing by `string-width` per character (handles fullwidth, emoji). Later writes overwrite earlier ones in overlapping cells.

### Render Order

1. **Box**: `renderBackground(x, y)` → `renderBorder(x, y)` → recurse to **children** with `(offsetX: x, offsetY: y)`.
2. **Text**: `squashTextNodes` (combine all text children), wrap if needed, then `output.write(x, y, text)`.

Background and border are drawn first; children draw on top. No “replace whole line” — only **cell-level overwrites** at specific `(x, y)`.

### Takeaways for ReactConsoleLog

1. **Replace-in-range, not replace-whole-line**  
   We previously did `buffer.lines[y] = padToVisibleColumn(line, x) + styledLine`, which **discarded everything after** the text. That overwrote adjacent content (sibling boxes, borders, etc.).  
   **Fix**: Use `before + styledLine + after`:
   - `before` = `padToVisibleColumn(substringToVisibleColumn(currentLine, x), x)`
   - `after` = `substringFromVisibleColumn(currentLine, x + measureText(line))`  
   So we only replace the segment `[x, x + width)` and preserve the rest of the line (Ink-like behavior with our line-based buffer).

2. **Layout then render**  
   Ink runs Yoga layout first, then walks the tree and writes at computed positions. We do the same: `calculateLayouts()` then `renderTree()` with layout-driven `(x, y)`.

3. **Background then children**  
   We render background, then children. Children draw over the background in their area. Our `renderBackground` uses `before + background + after`; the fix above ensures text writes also preserve `before`/`after`.

4. **Text inheritance**  
   Ink’s `<Text>` uses `backgroundColor ?? inheritedBackgroundColor` from a `BackgroundContext` provided by `<Box>`. We similarly inherit parent background in `TextNode.renderLine` when the text node has no explicit background.

## react-blessed

- **Blessed** as rendering engine; **react-blessed** maps React components to blessed widgets.
- Text is often applied via **`setContent` on the parent** widget rather than as separate sibling nodes. Different model from our explicit TextNode children; we keep TextNode as first-class.

## Summary of Changes Made

| Issue | Ink’s approach | Our fix |
|-------|----------------|---------|
| Text overwriting rest of line | Cell-level writes; no full-line replace | `before + styledLine + after` in `TextNode.renderLine` |
| Parent background for text | `BackgroundContext` / `inheritedBackgroundColor` | Use `context.parent` in `renderLine` when no explicit `backgroundColor` |
| Render order | Background → border → children | Same: `renderBackground` then children |

These updates ensure text correctly appears **inside** boxes and no longer overwrites borders or sibling content. The flexbox example (`examples/flexbox.tsx`) now shows “Item 1”, “Item 2”, “Item 3”, column items, “Centered”, “Items”, and the space-between / space-around labels as intended.
