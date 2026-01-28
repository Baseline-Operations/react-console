/**
 * Unit tests for mixins
 */

import { describe, it, expect } from 'vitest';
import { Node } from '../base/Node';
import { Stylable } from '../base/mixins/Stylable';
import { Renderable } from '../base/mixins/Renderable';
import { Layoutable } from '../base/mixins/Layoutable';
import { Interactive } from '../base/mixins/Interactive';

// Create a test base class that implements getNodeType
class TestNode extends Node {
  getNodeType(): string {
    return 'test';
  }
  getDefaultStyle() {
    return {};
  }
}

describe('Mixins', () => {
  it('should compose Stylable mixin', () => {
    const StylableNode = Stylable(TestNode as any);
    const node = new StylableNode();
    expect('computeStyle' in node).toBe(true);
    expect('setStyle' in node).toBe(true);
  });
  
  it('should compose Renderable mixin', () => {
    const RenderableNode = Renderable(TestNode as any);
    const node = new RenderableNode();
    expect('render' in node).toBe(true);
    expect('renderingInfo' in node).toBe(true);
  });
  
  it('should compose Layoutable mixin', () => {
    const LayoutableNode = Layoutable(TestNode as any);
    const node = new LayoutableNode();
    expect('computeLayout' in node).toBe(true);
    expect('layoutDirty' in node).toBe(true);
  });
  
  it('should compose Interactive mixin', () => {
    const InteractiveNode = Interactive(TestNode as any);
    const node = new InteractiveNode();
    expect('focused' in node).toBe(true);
    expect('handleKeyboardEvent' in node).toBe(true);
  });
  
  it('should compose multiple mixins', () => {
    const ComposedNode = Stylable(Renderable(Layoutable(TestNode as any)));
    const node = new ComposedNode();
    expect('computeStyle' in node).toBe(true);
    expect('render' in node).toBe(true);
    expect('computeLayout' in node).toBe(true);
  });
});
