[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / FlatListRef

# Interface: FlatListRef\<T\>

Defined in: src/utils/refs.ts:50

FlatList ref interface (React Native compatible)
Allows imperative control of flat list

## Type Parameters

### T

`T` = `unknown`

## Methods

### scrollToIndex()

> **scrollToIndex**(`params`): `void`

Defined in: src/utils/refs.ts:52

Scroll to a specific index

#### Parameters

##### params

###### index

`number`

###### animated?

`boolean`

###### viewOffset?

`number`

###### viewPosition?

`number`

#### Returns

`void`

---

### scrollToItem()

> **scrollToItem**(`params`): `void`

Defined in: src/utils/refs.ts:59

Scroll to a specific item

#### Parameters

##### params

###### item

`T`

###### animated?

`boolean`

###### viewOffset?

`number`

###### viewPosition?

`number`

#### Returns

`void`

---

### scrollToOffset()

> **scrollToOffset**(`params`): `void`

Defined in: src/utils/refs.ts:66

Scroll to a specific offset

#### Parameters

##### params

###### offset

`number`

###### animated?

`boolean`

#### Returns

`void`

---

### scrollToEnd()

> **scrollToEnd**(`params?`): `void`

Defined in: src/utils/refs.ts:71

Scroll to the end

#### Parameters

##### params?

###### animated?

`boolean`

#### Returns

`void`

---

### recordInteraction()

> **recordInteraction**(): `void`

Defined in: src/utils/refs.ts:73

Record that user has interacted (for viewability)

#### Returns

`void`

---

### flashScrollIndicators()

> **flashScrollIndicators**(): `void`

Defined in: src/utils/refs.ts:75

Flash the scroll indicators briefly

#### Returns

`void`

---

### getNativeScrollRef()?

> `optional` **getNativeScrollRef**(): [`ScrollViewRef`](ScrollViewRef.md) \| `null`

Defined in: src/utils/refs.ts:77

Get native scroll ref

#### Returns

[`ScrollViewRef`](ScrollViewRef.md) \| `null`

---

### getScrollableNode()?

> `optional` **getScrollableNode**(): `unknown`

Defined in: src/utils/refs.ts:79

Get scrollable node

#### Returns

`unknown`

---

### getScrollResponder()?

> `optional` **getScrollResponder**(): `unknown`

Defined in: src/utils/refs.ts:81

Get scroll responder

#### Returns

`unknown`

---

### setNativeProps()?

> `optional` **setNativeProps**(`props`): `void`

Defined in: src/utils/refs.ts:83

Set native props (limited support in terminal)

#### Parameters

##### props

`Record`\<`string`, `unknown`\>

#### Returns

`void`
