/**
 * Unit tests for RenderingTree
 */

import { describe, it, expect } from 'vitest';
import { RenderingTreeRegistry } from '../RenderingTree';
import { TextNode } from '../../nodes/primitives/TextNode';

describe('RenderingTree', () => {
  it('should register rendering info', () => {
    const node = new TextNode();
    const renderingInfo = {
      component: node,
      bufferRegion: {
        startX: 0,
        startY: 0,
        endX: 10,
        endY: 1,
        lines: [0],
      },
      children: [],
      zIndex: 0,
      stackingContext: null,
      viewport: null,
      clipped: false,
      visible: true,
    };
    
    RenderingTreeRegistry.get().register(renderingInfo);
    const retrieved = RenderingTreeRegistry.get().get(node);
    expect(retrieved).toBe(renderingInfo);
  });
  
  it('should get components in region', () => {
    const tree = RenderingTreeRegistry.get();
    const node1 = new TextNode();
    const node2 = new TextNode();
    
    tree.register({
      component: node1,
      bufferRegion: { startX: 0, startY: 0, endX: 5, endY: 1, lines: [0] },
      children: [],
      zIndex: 0,
      stackingContext: null,
      viewport: null,
      clipped: false,
      visible: true,
    });
    
    tree.register({
      component: node2,
      bufferRegion: { startX: 6, startY: 0, endX: 10, endY: 1, lines: [0] },
      children: [],
      zIndex: 0,
      stackingContext: null,
      viewport: null,
      clipped: false,
      visible: true,
    });
    
    const components = tree.getComponentsInRegion({
      startX: 0,
      startY: 0,
      endX: 5,
      endY: 1,
    });
    
    expect(components).toContain(node1);
    expect(components).not.toContain(node2);
  });
});
