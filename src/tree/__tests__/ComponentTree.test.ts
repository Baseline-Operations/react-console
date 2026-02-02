/**
 * Unit tests for ComponentTree
 */

import { describe, it, expect } from 'vitest';
import { ComponentTree, ComponentTreeRegistry } from '../ComponentTree';
import { TextNode } from '../../nodes/primitives/TextNode';
import { BoxNode } from '../../nodes/primitives/BoxNode';

describe('ComponentTree', () => {
  it('should create component instances', () => {
    const node = new TextNode();
    const instance = ComponentTree.createInstance(node);
    expect(instance).toBeDefined();
    expect(instance.node).toBe(node);
  });

  it('should mount and unmount nodes', () => {
    const parent = new BoxNode();
    const child = new TextNode();

    // First create instances (now done lazily)
    ComponentTree.createInstance(parent);
    ComponentTree.createInstance(child);

    // Then mount
    ComponentTreeRegistry.get().mount(parent, null);
    ComponentTreeRegistry.get().mount(child, parent);

    const parentInstance = ComponentTreeRegistry.get().getInstance(parent);
    const childInstance = ComponentTreeRegistry.get().getInstance(child);

    expect(parentInstance).toBeDefined();
    expect(childInstance).toBeDefined();
    expect(parentInstance?.mounted).toBe(true);
    expect(childInstance?.mounted).toBe(true);
    expect(childInstance?.parent).toBe(parentInstance);
  });

  it('should track component lifecycle', () => {
    const node = new TextNode();
    const instance = ComponentTree.createInstance(node);

    instance.mount(null);
    expect(instance.mounted).toBe(true);

    instance.unmount();
    expect(instance.mounted).toBe(false);
  });
});
