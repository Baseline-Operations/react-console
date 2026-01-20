/**
 * Layout module - re-exports all layout functionality
 * This file maintains backward compatibility while organizing code into modules
 */

// Main entry point
export { renderNodeToBuffer, getPadding } from './core';

// Node renderers
export {
  renderTextNode,
  renderBoxNode,
  renderFragmentNode,
  renderLineBreakNode,
  renderInputNode,
  renderButtonNode,
  renderRadioNode,
  renderCheckboxNode,
  renderDropdownNode,
  renderListNode,
  renderScrollableNode,
  renderOverlayNode,
} from './nodes';

// Layout engines
export { renderFlexboxLayout } from './flexbox';
export { renderGridLayout } from './grid';

// Border utilities
export { getBorderInfo, getBorderChars, renderBorderLine, renderBorderChar } from './borders';
