[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / ComponentRegistryEntry

# Interface: ComponentRegistryEntry

Defined in: [src/utils/extensibility.ts:26](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/extensibility.ts#L26)

Component registry entry

## Properties

### type

> **type**: `string`

Defined in: [src/utils/extensibility.ts:27](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/extensibility.ts#L27)

---

### renderer?

> `optional` **renderer**: [`CustomRenderer`](../type-aliases/CustomRenderer.md)

Defined in: [src/utils/extensibility.ts:28](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/extensibility.ts#L28)

---

### defaultStyle?

> `optional` **defaultStyle**: `ViewStyle` \| `TextStyle`

Defined in: [src/utils/extensibility.ts:29](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/extensibility.ts#L29)

---

### validator()?

> `optional` **validator**: (`node`) => `boolean`

Defined in: [src/utils/extensibility.ts:30](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/extensibility.ts#L30)

#### Parameters

##### node

[`ConsoleNode`](ConsoleNode.md)

#### Returns

`boolean`
