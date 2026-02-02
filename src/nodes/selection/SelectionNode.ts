/**
 * Selection node - base for selection components (Radio, Checkbox, Dropdown, List)
 * Composed with Stylable, Renderable, and Interactive mixins
 */

import { Node } from '../base/Node';
import {
  Stylable,
  Renderable,
  Interactive,
  type OutputBuffer,
  type RenderContext,
  type RenderResult,
} from '../base/mixins';
import type { StyleMap } from '../base/types';
import { StyleMixinRegistry } from '../../style/mixins/registry';

/**
 * Selection option
 */
export interface SelectionOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

// Create the mixed-in base class with proper type handling
const SelectionNodeBase = Stylable(
  Renderable(Interactive(Node as unknown as import('../base/types').Constructor<Node>))
);

/**
 * Selection node - base for selection components
 */
export class SelectionNode extends SelectionNodeBase {
  protected options: SelectionOption[] = [];
  protected value: string | number | (string | number)[] | null = null;
  protected multiple: boolean = false;

  constructor(id?: string) {
    super(id);
    this.applyStyleMixin('BaseStyle');
  }

  getNodeType(): string {
    return 'selection';
  }

  getDefaultStyle(): StyleMap {
    const baseStyle = StyleMixinRegistry.get('BaseStyle')?.getDefaultStyle() || {};
    return { ...baseStyle };
  }

  computeLayout(
    _constraints: import('../base/mixins/Layoutable').LayoutConstraints
  ): import('../base/mixins/Layoutable').LayoutResult {
    // Selection nodes compute layout based on options
    return {
      dimensions: { width: 0, height: 0, contentWidth: 0, contentHeight: 0 },
      layout: {},
      bounds: { x: 0, y: 0, width: 0, height: 0 },
    };
  }

  render(_buffer: OutputBuffer, _context: RenderContext): RenderResult {
    // Base implementation - subclasses override
    return { endX: _context.x, endY: _context.y, width: 0, height: 0 };
  }

  setOptions(options: SelectionOption[]): void {
    this.options = options;
    // Clear bounds to force recalculation with new options
    this.bounds = null;
    this.onUpdate();
  }

  setValue(value: string | number | (string | number)[] | null): void {
    this.value = value;
    this.onUpdate();
  }

  getValue(): string | number | (string | number)[] | null {
    return this.value;
  }
}
