/**
 * Style Mixin interface - Base interface for style mixins
 * Generic to support type-safe node types
 */

import type { Node } from '../../nodes/base/Node';
import type { StyleMap } from '../../nodes/base/types';

/**
 * Base interface for style mixins
 * Generic to support type-safe node types
 */
export interface StyleMixin<TNode extends Node = Node> {
  name: string;
  priority: number; // Lower = higher priority
  appliesTo(node: Node): node is TNode;
  getDefaultStyle(): StyleMap;
  getInheritableProperties(): string[];
  apply(node: TNode): void;
}
