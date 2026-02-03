[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / PluginConfig

# Interface: PluginConfig

Defined in: [src/utils/extensibility.ts:117](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/extensibility.ts#L117)

Plugin configuration

## Properties

### name

> **name**: `string`

Defined in: [src/utils/extensibility.ts:118](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/extensibility.ts#L118)

---

### version?

> `optional` **version**: `string`

Defined in: [src/utils/extensibility.ts:119](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/extensibility.ts#L119)

---

### components?

> `optional` **components**: [`ComponentRegistryEntry`](ComponentRegistryEntry.md)[]

Defined in: [src/utils/extensibility.ts:120](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/extensibility.ts#L120)

---

### renderers?

> `optional` **renderers**: `Record`\<`string`, [`CustomRenderer`](../type-aliases/CustomRenderer.md)\>

Defined in: [src/utils/extensibility.ts:121](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/extensibility.ts#L121)

---

### onRegister()?

> `optional` **onRegister**: () => `void`

Defined in: [src/utils/extensibility.ts:122](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/extensibility.ts#L122)

#### Returns

`void`

---

### onUnregister()?

> `optional` **onUnregister**: () => `void`

Defined in: [src/utils/extensibility.ts:123](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/extensibility.ts#L123)

#### Returns

`void`
