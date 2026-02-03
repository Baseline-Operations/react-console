[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / CustomRenderer

# Type Alias: CustomRenderer()

> **CustomRenderer** = (`node`, `context`) => `string`[] \| `string`

Defined in: [src/utils/extensibility.ts:12](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/extensibility.ts#L12)

Custom renderer function type
Renderer functions take a node and return rendered output (buffer/lines)

## Parameters

### node

[`ConsoleNode`](../interfaces/ConsoleNode.md)

### context

#### width

`number`

#### height

`number`

#### x

`number`

#### y

`number`

## Returns

`string`[] \| `string`
