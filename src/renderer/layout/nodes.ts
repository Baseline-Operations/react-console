/**
 * Node rendering functions - render individual ConsoleNode types to output buffer
 * 
 * This file re-exports all node renderers from organized subdirectories.
 * Node renderers are organized by category:
 * - primitives: Text, Box, Fragment, LineBreak
 * - interactive: Input, Button
 * - selection: Radio, Checkbox, Dropdown, List
 * - layout: Scrollable, Overlay
 */

// Re-export all node renderers from organized modules
export {
  renderTextNode,
  renderBoxNode,
  renderFragmentNode,
  renderLineBreakNode,
} from './nodes/primitives';

export {
  renderInputNode,
  renderButtonNode,
} from './nodes/interactive';

export {
  renderRadioNode,
  renderCheckboxNode,
  renderDropdownNode,
  renderListNode,
} from './nodes/selection';

export {
  renderScrollableNode,
  renderOverlayNode,
} from './nodes/layout';
