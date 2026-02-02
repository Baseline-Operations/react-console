/**
 * Default node - Default/fallback component
 * Composed with Stylable, Renderable, and Layoutable mixins
 */

import { Node } from '../base/Node';
import { Stylable, Renderable, Layoutable } from '../base/mixins';
import type { StyleMap, Constructor } from '../base/types';
import { StyleMixinRegistry } from '../../style/mixins/registry';
import type { OutputBuffer, RenderContext, RenderResult } from '../base/mixins/Renderable';
import type { LayoutConstraints, LayoutResult } from '../base/mixins/Layoutable';

/**
 * Default node props
 */
export interface DefaultNodeProps {
  children?: React.ReactNode;
}

/**
 * Default node - Default/fallback component
 */
export class DefaultNode extends Stylable(Renderable(Layoutable(Node as Constructor<Node>))) {
  constructor(props: DefaultNodeProps | Record<string, unknown> = {}, id?: string) {
    super(id);
    // Props stored for future use
    void props;
    this.applyStyleMixin('BaseStyle');
  }

  getNodeType(): string {
    return 'default';
  }

  getDefaultStyle(): StyleMap {
    const baseStyle = StyleMixinRegistry.get('BaseStyle')?.getDefaultStyle() || {};
    return { ...baseStyle };
  }

  computeLayout(_constraints: LayoutConstraints): LayoutResult {
    // Default nodes don't have their own layout - they render their children
    return {
      dimensions: { width: 0, height: 0, contentWidth: 0, contentHeight: 0 },
      layout: {},
      bounds: { x: 0, y: 0, width: 0, height: 0 },
    };
  }

  render(buffer: OutputBuffer, context: RenderContext): RenderResult {
    // Default nodes render their children
    let maxEndX = context.x;
    let maxEndY = context.y;

    interface RenderableChild {
      render(buffer: OutputBuffer, context: RenderContext): RenderResult;
    }

    for (const child of this.children) {
      if ('render' in child) {
        const result = (child as unknown as RenderableChild).render(buffer, context);
        maxEndX = Math.max(maxEndX, result.endX);
        maxEndY = Math.max(maxEndY, result.endY);
      }
    }

    return { endX: maxEndX, endY: maxEndY, width: 0, height: 0 };
  }
}
