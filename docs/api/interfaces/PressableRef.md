[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / PressableRef

# Interface: PressableRef

Defined in: src/utils/refs.ts:137

Pressable ref interface (React Native compatible)

## Extends

- [`ViewRef`](ViewRef.md)

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

#### Inherited from

[`ViewRef`](ViewRef.md).[`measure`](ViewRef.md#measure)

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

#### Inherited from

[`ViewRef`](ViewRef.md).[`measureInWindow`](ViewRef.md#measureinwindow)

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

#### Inherited from

[`ViewRef`](ViewRef.md).[`measureLayout`](ViewRef.md#measurelayout)

---

### focus()

> **focus**(): `void`

Defined in: src/utils/refs.ts:127

Focus the view

#### Returns

`void`

#### Inherited from

[`ViewRef`](ViewRef.md).[`focus`](ViewRef.md#focus)

---

### blur()

> **blur**(): `void`

Defined in: src/utils/refs.ts:129

Blur the view

#### Returns

`void`

#### Inherited from

[`ViewRef`](ViewRef.md).[`blur`](ViewRef.md#blur)

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

#### Inherited from

[`ViewRef`](ViewRef.md).[`setNativeProps`](ViewRef.md#setnativeprops)
