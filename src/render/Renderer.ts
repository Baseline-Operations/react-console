/**
 * Main renderer that integrates all systems
 * Uses the multi-buffer system for all rendering
 */

import type { Node } from '../nodes/base/Node';
import { getBufferRenderer, BufferRenderer } from '../buffer';
import type { BufferRenderOptions } from '../buffer';

/**
 * Main renderer class - wrapper around BufferRenderer
 * Uses the multi-buffer system for cell-based rendering
 */
export class Renderer {
  private bufferRenderer: BufferRenderer;
  
  constructor() {
    this.bufferRenderer = getBufferRenderer();
  }
  
  /**
   * Render root node using multi-buffer system
   */
  render(root: Node, options?: Partial<BufferRenderOptions>): void {
    this.bufferRenderer.render(root, options || {});
  }
  
  /**
   * Force a full redraw on next render
   */
  invalidate(): void {
    this.bufferRenderer.invalidate();
  }
  
  /**
   * Clean up resources
   */
  destroy(): void {
    this.bufferRenderer.destroy();
  }
}
