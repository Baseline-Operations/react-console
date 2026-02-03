[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / ViewRef

# Interface: ViewRef

Defined in: src/utils/refs.ts:115

View ref interface (React Native compatible)

## Extended by

- [`PressableRef`](PressableRef.md)

## Methods

### measure()

> **measure**(`callback`): `void`

Defined in: src/utils/refs.ts:117

Measure the view layout

#### Parameters

##### callback

(`x`, `y`, `width`, `height`, `pageX`, `pageY`) => `void`

#### Returns

`void`

---

### measureInWindow()

> **measureInWindow**(`callback`): `void`

Defined in: src/utils/refs.ts:119

Measure view layout in window

#### Parameters

##### callback

(`x`, `y`, `width`, `height`) => `void`

#### Returns

`void`

---

### measureLayout()

> **measureLayout**(`relativeToNativeNode`, `onSuccess`, `onFail?`): `void`

Defined in: src/utils/refs.ts:121

Measure layout relative to ancestor

#### Parameters

##### relativeToNativeNode

`unknown`

##### onSuccess

(`left`, `top`, `width`, `height`) => `void`

##### onFail?

() => `void`

#### Returns

`void`

---

### focus()

> **focus**(): `void`

Defined in: src/utils/refs.ts:127

Focus the view

#### Returns

`void`

---

### blur()

> **blur**(): `void`

Defined in: src/utils/refs.ts:129

Blur the view

#### Returns

`void`

---

### setNativeProps()?

> `optional` **setNativeProps**(`props`): `void`

Defined in: src/utils/refs.ts:131

Set native props (limited support in terminal)

#### Parameters

##### props

`Record`\<`string`, `unknown`\>

#### Returns

`void`
