/**
 * Route node - Route definition
 * Composed with Stylable, Renderable, and Layoutable mixins
 */

import { Node } from '../base/Node';
import { Stylable, Renderable, Layoutable } from '../base/mixins';
import type { StyleMap } from '../base/types';
import { StyleMixinRegistry } from '../../style/mixins/registry';

/**
 * Route node props
 */
export interface RouteNodeProps {
  path: string;
  guards?: any[];
  children?: any;
}

/**
 * Route node - Route definition
 */
export class RouteNode extends Stylable(Renderable(Layoutable(Node as any))) {
  private path: string;
  
  constructor(props: RouteNodeProps, id?: string) {
    super(id);
    this.path = props.path;
    // Store guards for future use (accessed via props when needed)
    void props.guards;
    this.applyStyleMixin('BaseStyle');
  }
  
  getNodeType(): string {
    return 'route';
  }
  
  getDefaultStyle(): StyleMap {
    const baseStyle = StyleMixinRegistry.get('BaseStyle')?.getDefaultStyle() || {};
    return { ...baseStyle };
  }
  
  computeLayout(_constraints: any): any {
    // Route nodes don't have their own layout - they render their children
    return {
      dimensions: { width: 0, height: 0, contentWidth: 0, contentHeight: 0 },
      layout: {},
      bounds: { x: 0, y: 0, width: 0, height: 0 },
    };
  }
  
  render(buffer: any, context: any): any {
    // Route nodes render their children
    let maxEndX = context.x;
    let maxEndY = context.y;
    
    for (const child of this.children) {
      if ('render' in child) {
        const result = (child as any).render(buffer, context);
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
