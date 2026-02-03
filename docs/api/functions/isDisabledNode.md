[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / isDisabledNode

# Function: isDisabledNode()

> **isDisabledNode**(`node`): `node is ConsoleNode & { disabled: boolean }`

Defined in: [src/types/guards.ts:173](https://github.com/Baseline-Operations/react-console/blob/main/src/types/guards.ts#L173)

Type guard: Check if node has a disabled property

## Parameters

### node

`unknown`

The value to test for a `ConsoleNode` with a boolean `disabled` property.

## Returns

`node is ConsoleNode & { disabled: boolean }`

`true` if the node is a `ConsoleNode` with a `disabled` property, enabling type-safe access.
