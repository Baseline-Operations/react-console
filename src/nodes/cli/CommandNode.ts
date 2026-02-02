/**
 * Command node - Command definition
 * Composed with Stylable, Renderable, and Layoutable mixins
 */

import { Node } from '../base/Node';
import { Stylable, Renderable, Layoutable } from '../base/mixins';
import type { StyleMap, Constructor } from '../base/types';
import { StyleMixinRegistry } from '../../style/mixins/registry';
import type { OutputBuffer, RenderContext, RenderResult } from '../base/mixins/Renderable';
import type { LayoutConstraints, LayoutResult } from '../base/mixins/Layoutable';

/**
 * Command node props (simplified)
 */
export interface CommandParam {
  name: string;
  type?: string;
  required?: boolean;
  default?: unknown;
}

export interface CommandOption {
  name: string;
  type?: string;
  alias?: string;
  default?: unknown;
}

export interface CommandNodeProps {
  name: string;
  aliases?: string[];
  params?: CommandParam[];
  options?: Record<string, CommandOption>;
  middleware?: Array<(ctx: unknown) => Promise<void> | void>;
  beforeHooks?: Array<(ctx: unknown) => Promise<void> | void>;
  afterHooks?: Array<(ctx: unknown) => Promise<void> | void>;
  guards?: Array<(ctx: unknown) => boolean | Promise<boolean>>;
  children?: React.ReactNode;
}

// Create the mixed-in base class with proper type handling
const CommandNodeBase = Stylable(Renderable(Layoutable(Node as unknown as Constructor<Node>)));

/**
 * Command node - Command definition
 */
export class CommandNode extends CommandNodeBase {
  private name: string;
  private aliases?: string[];

  constructor(props: CommandNodeProps | Record<string, unknown>, id?: string) {
    super(id);
    const typedProps = props as CommandNodeProps;
    this.name = typedProps.name;
    this.aliases = typedProps.aliases;
    // Store params and options for future use (accessed via props when needed)
    void typedProps.params;
    void typedProps.options;
    this.applyStyleMixin('BaseStyle');
  }

  getNodeType(): string {
    return 'command';
  }

  getDefaultStyle(): StyleMap {
    const baseStyle = StyleMixinRegistry.get('BaseStyle')?.getDefaultStyle() || {};
    return { ...baseStyle };
  }

  computeLayout(_constraints: LayoutConstraints): LayoutResult {
    // Command nodes don't have their own layout - they render their children
    return {
      dimensions: { width: 0, height: 0, contentWidth: 0, contentHeight: 0 },
      layout: {},
      bounds: { x: 0, y: 0, width: 0, height: 0 },
    };
  }

  render(buffer: OutputBuffer, context: RenderContext): RenderResult {
    // Command nodes render their children
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

  matches(command: string[]): boolean {
    if (command.length === 0) return false;
    const firstCommand = command[0];
    if (!firstCommand) return false;
    return (
      firstCommand === this.name || (this.aliases ? this.aliases.includes(firstCommand) : false)
    );
  }
}
