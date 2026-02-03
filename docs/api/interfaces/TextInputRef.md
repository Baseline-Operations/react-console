[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / TextInputRef

# Interface: TextInputRef

Defined in: src/utils/refs.ts:10

TextInput ref interface (React Native compatible)
Allows imperative control of text input

## Methods

### focus()

> **focus**(): `void`

Defined in: src/utils/refs.ts:12

Focus the input

#### Returns

`void`

---

### blur()

> **blur**(): `void`

Defined in: src/utils/refs.ts:14

Remove focus from the input

#### Returns

`void`

---

### clear()

> **clear**(): `void`

Defined in: src/utils/refs.ts:16

Clear the input value

#### Returns

`void`

---

### isFocused()

> **isFocused**(): `boolean`

Defined in: src/utils/refs.ts:18

Check if the input is focused

#### Returns

`boolean`

---

### setNativeProps()?

> `optional` **setNativeProps**(`props`): `void`

Defined in: src/utils/refs.ts:20

Set native props (limited support in terminal)

#### Parameters

##### props

`Record`\<`string`, `unknown`\>

#### Returns

`void`
