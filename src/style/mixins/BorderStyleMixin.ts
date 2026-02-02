/**
 * Border style mixin - applied conditionally when border is set
 */

import type { Node } from '../../nodes/base/Node';
import type { StyleMixin } from './StyleMixin';
import type { StyleMap } from '../../nodes/base/types';
import { BorderStyle as BorderStyleEnum } from '../../nodes/base/types';

/**
 * Border style mixin - applied conditionally when border is set
 */
export class BorderStyleMixin implements StyleMixin<Node> {
  name = 'BorderStyle';
  priority = 60;

  appliesTo(node: Node): node is Node {
    // Applies to nodes with borders
    return (
      node.border.show.top ||
      node.border.show.right ||
      node.border.show.bottom ||
      node.border.show.left
    );
  }

  apply(_node: Node): void {
    // Border-specific setup
  }

  getDefaultStyle(): StyleMap {
    return {
      border: false,
      borderColor: 'inherit',
      borderBackgroundColor: 'inherit',
      borderStyle: BorderStyleEnum.SINGLE,
      borderWidth: 1,
    };
  }

  getInheritableProperties(): string[] {
    return ['borderColor', 'borderBackgroundColor'];
  }
}
