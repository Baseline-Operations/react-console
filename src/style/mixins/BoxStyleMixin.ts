/**
 * Box style mixin - applied to box nodes
 */

import type { Node } from '../../nodes/base/Node';
import type { StyleMixin } from './StyleMixin';
import type { StyleMap } from '../../nodes/base/types';
import { DisplayMode as DisplayModeEnum } from '../../nodes/base/types';

/**
 * Box style mixin - applied to box nodes
 * Note: BoxNode will be implemented in Phase 3
 */
export class BoxStyleMixin implements StyleMixin<Node> {
  name = 'BoxStyle';
  priority = 80;

  appliesTo(node: Node): node is Node {
    // Will check for BoxNode instance once BoxNode is implemented
    return node.getNodeType() === 'box' || node.getNodeType() === 'view';
  }

  apply(_node: Node): void {
    // Box-specific setup
  }

  getDefaultStyle(): StyleMap {
    return {
      display: DisplayModeEnum.BLOCK,
    };
  }

  getInheritableProperties(): string[] {
    return [];
  }
}
