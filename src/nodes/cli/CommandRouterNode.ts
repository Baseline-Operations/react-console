/**
 * CommandRouter node - Root router for CLI applications
 * Composed with Stylable, Renderable, and Layoutable mixins
 */

import { Node } from '../base/Node';
import { Stylable, Renderable, Layoutable, type OutputBuffer, type RenderContext, type RenderResult } from '../base/mixins';
import type { LayoutConstraints, LayoutResult } from '../base/mixins/Layoutable';
import type { StyleMap } from '../base/types';
import { StyleMixinRegistry } from '../../style/mixins/registry';
import type { ReactNode } from 'react';

/**
 * CommandRouter node props (simplified - will be expanded)
 */
export interface CommandRouterNodeProps {
  description?: string;
  help?: ReactNode | ((props: any) => ReactNode);
  helpAutoExit?: boolean;
  helpExitCode?: number;
  noHelp?: boolean;
  showUnknownCommandError?: boolean;
  options?: Record<string, any>;
  defaultConfig?: Record<string, any>;
  envPrefix?: string;
  configFile?: string;
  children?: ReactNode;
}

/**
 * CommandRouter node - Root router for CLI applications
 */
export class CommandRouterNode extends Stylable(Renderable(Layoutable(Node as any))) {
  private parsedArgs: any = { command: [], options: {}, params: [] };
  private matchedComponent: Node | null = null;
  
  constructor(props: CommandRouterNodeProps, id?: string) {
    super(id);
    // Store props for future use (accessed via props when needed)
    void props.description;
    void props.help;
    void props.options;
    void props.defaultConfig;
    
    // Parse command-line arguments (simplified - will use actual parser)
    if (typeof process !== 'undefined' && process.argv) {
      const { parseCommandLineArgs } = require('../../utils/cli/parser');
      this.parsedArgs = parseCommandLineArgs(process.argv.slice(2));
    }
    
    this.applyStyleMixin('BaseStyle');
  }
  
  getNodeType(): string {
    return 'commandrouter';
  }
  
  getDefaultStyle(): StyleMap {
    const baseStyle = StyleMixinRegistry.get('BaseStyle')?.getDefaultStyle() || {};
    return { ...baseStyle };
  }
  
  computeLayout(constraints: LayoutConstraints): LayoutResult {
    // Match component based on parsed args
    // This is a simplified version - full implementation will use actual matching logic
    const { matchComponent } = require('../../utils/cli/matcher');
    // Convert children nodes to React elements format for matcher
    const childrenElements = this.children.map((child: Node) => ({ type: child.getNodeType(), props: {} }));
    const matchResult = matchComponent(this.parsedArgs, childrenElements);
    
    // Find matching child node
    const matchedChild = this.children.find((child: Node) => {
      const childType = child.getNodeType();
      return matchResult.component && 
        (typeof matchResult.component === 'string' ? matchResult.component === childType : 
         (matchResult.component as any).type === childType);
    });
    
    this.matchedComponent = matchedChild || null;
    
    // Layout matched component
    if (this.matchedComponent && typeof this.matchedComponent === 'object' && 'computeLayout' in this.matchedComponent) {
      return (this.matchedComponent as any).computeLayout(constraints);
    }
    
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
    if (!this.matchedComponent) {
      return { endX: context.x, endY: context.y, width: 0, height: 0 };
    }
    
    // Render matched component
    if (this.matchedComponent && typeof this.matchedComponent === 'object' && 'render' in this.matchedComponent) {
      return (this.matchedComponent as any).render(buffer, context);
    }
    
    return { endX: context.x, endY: context.y, width: 0, height: 0 };
  }
}
