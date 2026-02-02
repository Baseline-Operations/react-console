/**
 * Text style mixin - applied to text nodes
 */

import type { Node } from '../../nodes/base/Node';
import type { StyleMixin } from './StyleMixin';
import type { StyleMap } from '../../nodes/base/types';
import { TextAlign as TextAlignEnum } from '../../nodes/base/types';

/**
 * Text style mixin - applied to text nodes
 * Note: TextNode will be implemented in Phase 3
 */
export class TextStyleMixin implements StyleMixin<Node> {
  name = 'TextStyle';
  priority = 80;

  appliesTo(node: Node): node is Node {
    // Will check for TextNode instance once TextNode is implemented
    return node.getNodeType() === 'text';
  }

  apply(_node: Node): void {
    // Text-specific setup
  }

  getDefaultStyle(): StyleMap {
    return {
      textAlign: TextAlignEnum.LEFT,
      textWrap: true,
    };
  }

  getInheritableProperties(): string[] {
    return [];
  }
}
