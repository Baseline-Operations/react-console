/**
 * Radio node - radio button selection
 */

import { SelectionNode } from './SelectionNode';
import type { OutputBuffer, RenderContext, RenderResult } from '../base/mixins/Renderable';

/**
 * Radio node - radio button selection
 */
export class RadioNode extends SelectionNode {
  constructor(id?: string) {
    super(id);
  }
  
  getNodeType(): string {
    return 'radio';
  }
  
  render(_buffer: OutputBuffer, context: RenderContext): RenderResult {
    // Radio rendering implementation
    // For now, placeholder
    return { endX: context.x, endY: context.y, width: 0, height: 0 };
  }
}
