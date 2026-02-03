[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / isClickableNode

# Function: isClickableNode()

> **isClickableNode**(`node`): `node is ConsoleNode & { onClick?: (event: { x: number; y: number }) => void; onPress?: (event: { x: number; y: number }) => void }`

Defined in: [src/types/guards.ts:106](https://github.com/Baseline-Operations/react-console/blob/main/src/types/guards.ts#L106)

Type guard: Check if node has click/press handlers

## Parameters

### node

[`ConsoleNode`](../interfaces/ConsoleNode.md)

## Returns

`node is ConsoleNode & { onClick?: (event: { x: number; y: number }) => void; onPress?: (event: { x: number; y: number }) => void }`
