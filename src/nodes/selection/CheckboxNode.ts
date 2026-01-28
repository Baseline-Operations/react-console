/**
 * Checkbox node - checkbox selection
 */

import { SelectionNode } from './SelectionNode';
import type { OutputBuffer, RenderContext, RenderResult } from '../base/mixins/Renderable';

/**
 * Checkbox node - checkbox selection
 */
export class CheckboxNode extends SelectionNode {
  constructor(id?: string) {
    super(id);
    this.multiple = true; // Checkboxes support multiple selection
  }
  
  getNodeType(): string {
    return 'checkbox';
  }
  
  render(_buffer: OutputBuffer, context: RenderContext): RenderResult {
    // Checkbox rendering implementation
    // For now, placeholder
    return { endX: context.x, endY: context.y, width: 0, height: 0 };
  }
}
