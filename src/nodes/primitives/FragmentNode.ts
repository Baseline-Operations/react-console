/**
 * Fragment node - groups children without creating a container
 * Composed with Stylable and Renderable mixins
 */

import { Node } from '../base/Node';
import {
  Stylable,
  Renderable,
  type OutputBuffer,
  type RenderContext,
  type RenderResult,
} from '../base/mixins';
import type { StyleMap, Constructor } from '../base/types';
import { StyleMixinRegistry } from '../../style/mixins/registry';

// Interface for renderable children
interface RenderableChild {
  render(buffer: OutputBuffer, context: RenderContext): RenderResult;
}

/**
 * Fragment node - groups children without creating a container
 */
export class FragmentNode extends Stylable(Renderable(Node as Constructor<Node>)) {
  constructor(id?: string) {
    super(id);
    // Apply base style mixin
    this.applyStyleMixin('BaseStyle');
  }

  getNodeType(): string {
    return 'fragment';
  }

  getDefaultStyle(): StyleMap {
    const baseStyle = StyleMixinRegistry.get('BaseStyle')?.getDefaultStyle() || {};
    return { ...baseStyle };
  }

  computeLayout(
    _constraints: import('../base/mixins/Layoutable').LayoutConstraints
  ): import('../base/mixins/Layoutable').LayoutResult {
    // Fragment doesn't have layout - just passes through
    return {
      dimensions: {
        width: 0,
        height: 0,
        contentWidth: 0,
        contentHeight: 0,
      },
      layout: {},
      bounds: { x: 0, y: 0, width: 0, height: 0 },
    };
  }

  render(buffer: OutputBuffer, context: RenderContext): RenderResult {
    // Fragment just renders children - no background or border
    let maxEndX = context.x;
    let maxEndY = context.y;

    for (const child of this.children) {
      if ('render' in child) {
        const result = (child as unknown as RenderableChild).render(buffer, context);
        maxEndX = Math.max(maxEndX, result.endX);
        maxEndY = Math.max(maxEndY, result.endY);
      }
    }

    return {
      endX: maxEndX,
      endY: maxEndY,
      width: 0,
      height: 0,
    };
  }
}
