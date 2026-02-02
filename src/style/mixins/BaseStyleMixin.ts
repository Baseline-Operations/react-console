/**
 * Base style mixin - applied to all nodes
 */

import type { Node } from '../../nodes/base/Node';
import type { StyleMixin } from './StyleMixin';
import type { StyleMap } from '../../nodes/base/types';

/**
 * Base style mixin - applied to all nodes
 */
export class BaseStyleMixin implements StyleMixin<Node> {
  name = 'BaseStyle';
  priority = 100;

  appliesTo(node: Node): node is Node {
    // Applies to all nodes - parameter is used for type guard
    void node; // Mark as used for type guard
    return true;
  }

  apply(_node: Node): void {
    // BaseStyle is always applied, no additional setup needed
  }

  getDefaultStyle(): StyleMap {
    return {
      color: 'inherit',
      backgroundColor: 'inherit',
      bold: false,
      dim: false,
      italic: false,
      underline: false,
      strikethrough: false,
      inverse: false,
    };
  }

  getInheritableProperties(): string[] {
    return ['color', 'backgroundColor'];
  }
}
