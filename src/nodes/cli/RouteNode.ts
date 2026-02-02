/**
 * Route node - Route definition
 * Composed with Stylable, Renderable, and Layoutable mixins
 */

import { Node } from '../base/Node';
import { Stylable, Renderable, Layoutable } from '../base/mixins';
import type { StyleMap, Constructor } from '../base/types';
import { StyleMixinRegistry } from '../../style/mixins/registry';
import type { OutputBuffer, RenderContext, RenderResult } from '../base/mixins/Renderable';
import type { LayoutConstraints, LayoutResult } from '../base/mixins/Layoutable';

/**
 * Route node props
 */
export interface RouteNodeProps {
  path: string;
  guards?: Array<(ctx: unknown) => boolean | Promise<boolean>>;
  children?: React.ReactNode;
}

// Create the mixed-in base class with proper type handling
const RouteNodeBase = Stylable(Renderable(Layoutable(Node as unknown as Constructor<Node>)));

/**
 * Route node - Route definition
 */
export class RouteNode extends RouteNodeBase {
  private path: string;

  constructor(props: RouteNodeProps | Record<string, unknown>, id?: string) {
    super(id);
    const typedProps = props as RouteNodeProps;
    this.path = typedProps.path;
    // Store guards for future use (accessed via props when needed)
    void typedProps.guards;
    this.applyStyleMixin('BaseStyle');
  }

  getNodeType(): string {
    return 'route';
  }

  getDefaultStyle(): StyleMap {
    const baseStyle = StyleMixinRegistry.get('BaseStyle')?.getDefaultStyle() || {};
    return { ...baseStyle };
  }

  computeLayout(_constraints: LayoutConstraints): LayoutResult {
    // Route nodes don't have their own layout - they render their children
    return {
      dimensions: { width: 0, height: 0, contentWidth: 0, contentHeight: 0 },
      layout: {},
      bounds: { x: 0, y: 0, width: 0, height: 0 },
    };
  }

  render(buffer: OutputBuffer, context: RenderContext): RenderResult {
    // Route nodes render their children
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

  matches(routePath: string): boolean {
    // Simplified route matching - will be fully implemented
    return this.path === routePath || routePath.startsWith(this.path);
  }
}
