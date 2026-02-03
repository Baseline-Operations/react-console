[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / registerComponent

# Function: registerComponent()

> **registerComponent**(`type`, `renderer`, `options?`): `void`

Defined in: [src/utils/extensibility.ts:251](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/extensibility.ts#L251)

Register a custom component type
Convenience function for component registry

## Parameters

### type

`string`

Component type name

### renderer

[`CustomRenderer`](../type-aliases/CustomRenderer.md)

Custom renderer function

### options?

Optional additional options

#### defaultStyle?

`ViewStyle` \| `TextStyle`

#### validator?

(`node`) => `boolean`

## Returns

`void`
