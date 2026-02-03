[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / hasChildren

# Function: hasChildren()

> **hasChildren**(`node`): `node is ConsoleNode & { children: ConsoleNode[] }`

Defined in: [src/types/guards.ts:187](https://github.com/Baseline-Operations/react-console/blob/main/src/types/guards.ts#L187)

Type guard: Check if node has children

Returns `true` if the node contains a `children` property with an array of ConsoleNode elements, enabling type-safe access to the children array.

## Parameters

### node

[`ConsoleNode`](../interfaces/ConsoleNode.md)

The node to check for children.

## Returns

`node is ConsoleNode & { children: ConsoleNode[] }`

## Example

```typescript
if (hasChildren(node)) {
  // TypeScript now knows node.children exists and is ConsoleNode[]
  node.children.forEach((child) => processChild(child));
}
```
