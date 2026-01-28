/**
 * Unit tests for Node base class
 */

import { describe, it, expect } from 'vitest';
import { TextNode } from '../primitives/TextNode';
import { BoxNode } from '../primitives/BoxNode';

describe('Node', () => {
  it('should create node with unique ID', () => {
    const node1 = new TextNode();
    const node2 = new TextNode();
    expect(node1.id).toBeDefined();
    expect(node2.id).toBeDefined();
    expect(node1.id).not.toBe(node2.id);
  });
  
  it('should have box model properties', () => {
    const node = new BoxNode();
    expect(node.width).toBeNull();
    expect(node.height).toBeNull();
    expect(node.margin).toBeDefined();
    expect(node.padding).toBeDefined();
    expect(node.border).toBeDefined();
  });
  
  it('should manage children', () => {
    const parent = new BoxNode();
    const child1 = new TextNode();
    const child2 = new TextNode();
    
    parent.appendChild(child1);
    parent.appendChild(child2);
    
    expect(parent.children).toHaveLength(2);
    expect(child1.parent).toBe(parent);
    expect(child2.parent).toBe(parent);
    
    parent.removeChild(child1);
    expect(parent.children).toHaveLength(1);
    expect(child1.parent).toBeNull();
  });
  
  it('should calculate content area', () => {
    const node = new BoxNode();
    node.width = 10;
    node.height = 5;
    node.padding = { top: 1, right: 1, bottom: 1, left: 1 };
    node.border.width = { top: 1, right: 1, bottom: 1, left: 1 };
    // Set bounds (required for calculateContentArea)
    node.bounds = { x: 0, y: 0, width: 10, height: 5 };
    
    const contentArea = node.calculateContentArea();
    // Content area = bounds - border - padding
    // Width: 10 - 1 (left border) - 1 (right border) - 1 (left padding) - 1 (right padding) = 6
    // Height: 5 - 1 (top border) - 1 (bottom border) - 1 (top padding) - 1 (bottom padding) = 1
    expect(contentArea.width).toBe(6);
    expect(contentArea.height).toBe(1);
  });
});
