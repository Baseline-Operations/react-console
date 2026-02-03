[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / inspectComponentTree

# Function: inspectComponentTree()

> **inspectComponentTree**(`node`, `indent`): `void`

Defined in: [src/utils/debug.ts:144](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/debug.ts#L144)

Component tree inspector
Formats and logs component tree structure

## Parameters

### node

`object`

The node object to inspect.

#### node.type

`string`

The type/name of the component.

#### node.children?

`unknown`[]

Optional array of child nodes.

### indent

`number` = `0`

Indentation level for formatting (default: 0).

## Returns

`void`
