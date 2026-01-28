/**
 * Style mixin registry - Registry for style mixins with type safety
 */

import type { Node } from '../../nodes/base/Node';
import type { StyleMixin } from './StyleMixin';
import { BaseStyleMixin } from './BaseStyleMixin';
import { TextStyleMixin } from './TextStyleMixin';
import { BoxStyleMixin } from './BoxStyleMixin';
import { BorderStyleMixin } from './BorderStyleMixin';

/**
 * Registry for style mixins with type safety
 */
export class StyleMixinRegistry {
  private static mixins = new Map<string, StyleMixin>();
  
  /**
   * Register a style mixin
   */
  static register<TNode extends Node>(mixin: StyleMixin<TNode>): void {
    this.mixins.set(mixin.name, mixin);
  }
  
  /**
   * Get a style mixin by name
   */
  static get(name: string): StyleMixin | undefined {
    return this.mixins.get(name);
  }
  
  /**
   * Get all style mixins, sorted by priority
   */
  static getAll(): StyleMixin[] {
    return Array.from(this.mixins.values()).sort((a, b) => a.priority - b.priority);
  }
  
  /**
   * Get all style mixins that apply to a given node
   */
  static getApplicableMixins(node: Node): StyleMixin[] {
    return this.getAll().filter(mixin => mixin.appliesTo(node));
  }
}

// Register default mixins
StyleMixinRegistry.register(new BaseStyleMixin());
StyleMixinRegistry.register(new TextStyleMixin());
StyleMixinRegistry.register(new BoxStyleMixin());
StyleMixinRegistry.register(new BorderStyleMixin());
