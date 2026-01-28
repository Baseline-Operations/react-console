/**
 * Command node - Command definition
 * Composed with Stylable, Renderable, and Layoutable mixins
 */

import { Node } from '../base/Node';
import { Stylable, Renderable, Layoutable } from '../base/mixins';
import type { StyleMap } from '../base/types';
import { StyleMixinRegistry } from '../../style/mixins/registry';

/**
 * Command node props (simplified)
 */
export interface CommandNodeProps {
  name: string;
  aliases?: string[];
  params?: any[];
  options?: Record<string, any>;
  middleware?: any[];
  beforeHooks?: any[];
  afterHooks?: any[];
  guards?: any[];
  children?: any;
}

/**
 * Command node - Command definition
 */
export class CommandNode extends Stylable(Renderable(Layoutable(Node as any))) {
  private name: string;
  private aliases?: string[];
  
  constructor(props: CommandNodeProps, id?: string) {
    super(id);
    this.name = props.name;
    this.aliases = props.aliases;
    // Store params and options for future use (accessed via props when needed)
    void props.params;
    void props.options;
    this.applyStyleMixin('BaseStyle');
  }
  
  getNodeType(): string {
    return 'command';
  }
  
  getDefaultStyle(): StyleMap {
    const baseStyle = StyleMixinRegistry.get('BaseStyle')?.getDefaultStyle() || {};
    return { ...baseStyle };
  }
  
  computeLayout(_constraints: any): any {
    // Command nodes don't have their own layout - they render their children
    return {
      dimensions: { width: 0, height: 0, contentWidth: 0, contentHeight: 0 },
      layout: {},
      bounds: { x: 0, y: 0, width: 0, height: 0 },
    };
  }
  
  render(buffer: any, context: any): any {
    // Command nodes render their children
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
  
  matches(command: string[]): boolean {
    if (command.length === 0) return false;
    const firstCommand = command[0];
    if (!firstCommand) return false;
    return firstCommand === this.name || (this.aliases ? this.aliases.includes(firstCommand) : false);
  }
}
