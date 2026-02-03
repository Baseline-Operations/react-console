/**
 * CommandRouter node - Root router for CLI applications
 * Composed with Stylable, Renderable, and Layoutable mixins
 */

import { Node } from '../../nodes/base/Node';
import {
  Stylable,
  Renderable,
  Layoutable,
  type OutputBuffer,
  type RenderContext,
  type RenderResult,
} from '../../nodes/base/mixins';
import type { LayoutConstraints, LayoutResult } from '../../nodes/base/mixins/Layoutable';
import type { StyleMap, Constructor } from '../../nodes/base/types';
import { StyleMixinRegistry } from '../../style/mixins/registry';
import type { ReactNode } from 'react';

/**
 * CommandRouter node props (simplified - will be expanded)
 */
export interface CommandRouterOption {
  type?: string;
  alias?: string;
  default?: unknown;
}

export interface CommandRouterNodeProps {
  description?: string;
  help?: ReactNode | ((props: Record<string, unknown>) => ReactNode);
  helpAutoExit?: boolean;
  helpExitCode?: number;
  noHelp?: boolean;
  showUnknownCommandError?: boolean;
  options?: Record<string, CommandRouterOption>;
  defaultConfig?: Record<string, unknown>;
  envPrefix?: string;
  configFile?: string;
  children?: ReactNode;
}

interface ParsedArgs {
  command: string[];
  options: Record<string, unknown>;
  params: string[];
}

interface MatchResult {
  component?: string | { type: string };
}

interface LayoutableChild {
  computeLayout(constraints: LayoutConstraints): LayoutResult;
}

interface RenderableChild {
  render(buffer: OutputBuffer, context: RenderContext): RenderResult;
}

// Create the mixed-in base class with proper type handling
const CommandRouterNodeBase = Stylable(
  Renderable(Layoutable(Node as unknown as Constructor<Node>))
);

/**
 * CommandRouter node - Root router for CLI applications
 */
export class CommandRouterNode extends CommandRouterNodeBase {
  private parsedArgs: ParsedArgs = { command: [], options: {}, params: [] };
  private matchedComponent: Node | null = null;

  constructor(props: CommandRouterNodeProps | Record<string, unknown>, id?: string) {
    super(id);
    const typedProps = props as CommandRouterNodeProps;
    // Store props for future use (accessed via props when needed)
    void typedProps.description;
    void typedProps.help;
    void typedProps.options;
    void typedProps.defaultConfig;

    // Parse command-line arguments (simplified - will use actual parser)
    if (typeof process !== 'undefined' && process.argv) {
      const { parseCommandLineArgs } = require('../../utils/cli/parser');
      this.parsedArgs = parseCommandLineArgs(process.argv.slice(2)) as ParsedArgs;
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
    const childrenElements = this.children.map((child: Node) => ({
      type: child.getNodeType(),
      props: {},
    }));
    const matchResult = matchComponent(this.parsedArgs, childrenElements) as MatchResult;

    // Find matching child node
    const matchedChild = this.children.find((child: Node) => {
      const childType = child.getNodeType();
      return (
        matchResult.component &&
        (typeof matchResult.component === 'string'
          ? matchResult.component === childType
          : matchResult.component.type === childType)
      );
    });

    this.matchedComponent = matchedChild || null;

    // Layout matched component
    if (this.matchedComponent && 'computeLayout' in this.matchedComponent) {
      return (this.matchedComponent as unknown as LayoutableChild).computeLayout(constraints);
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
    if ('render' in this.matchedComponent) {
      return (this.matchedComponent as unknown as RenderableChild).render(buffer, context);
    }

    return { endX: context.x, endY: context.y, width: 0, height: 0 };
  }
}
