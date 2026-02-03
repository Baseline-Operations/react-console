[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / ScrollViewRef

# Interface: ScrollViewRef

Defined in: src/utils/refs.ts:27

ScrollView ref interface (React Native compatible)
Allows imperative control of scroll view

## Methods

### scrollTo()

> **scrollTo**(`options`): `void`

Defined in: src/utils/refs.ts:29

Scroll to a specific position

#### Parameters

##### options

###### x?

`number`

###### y?

`number`

###### animated?

`boolean`

#### Returns

`void`

---

### scrollToEnd()

> **scrollToEnd**(`options?`): `void`

Defined in: src/utils/refs.ts:31

Scroll to the end of the content

#### Parameters

##### options?

###### animated?

`boolean`

#### Returns

`void`

---

### flashScrollIndicators()

> **flashScrollIndicators**(): `void`

Defined in: src/utils/refs.ts:33

Flash the scroll indicators briefly

#### Returns

`void`

---

### getScrollResponder()?

> `optional` **getScrollResponder**(): `unknown`

Defined in: src/utils/refs.ts:35

Get scroll responder (for advanced usage)

#### Returns

`unknown`

---

### getInnerViewRef()?

> `optional` **getInnerViewRef**(): `unknown`

Defined in: src/utils/refs.ts:37

Get inner view ref

#### Returns

`unknown`

---

### getInnerViewNode()?

> `optional` **getInnerViewNode**(): `unknown`

Defined in: src/utils/refs.ts:39

Get inner view node

#### Returns

`unknown`

---

### getScrollableNode()?

> `optional` **getScrollableNode**(): `unknown`

Defined in: src/utils/refs.ts:41

Get scroll node

#### Returns

`unknown`

---

### setNativeProps()?

> `optional` **setNativeProps**(`props`): `void`

Defined in: src/utils/refs.ts:43

Set native props (limited support in terminal)

#### Parameters

##### props

`Record`\<`string`, `unknown`\>

#### Returns

`void`
