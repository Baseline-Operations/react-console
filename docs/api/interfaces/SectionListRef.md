[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / SectionListRef

# Interface: SectionListRef\<ItemT\>

Defined in: src/utils/refs.ts:91

SectionList ref interface (React Native compatible)
Similar to FlatList ref

## Type Parameters

### ItemT

`ItemT` = `unknown`

The type of items in the section list (for future use)

## Methods

### scrollToLocation()

> **scrollToLocation**(`params`): `void`

Defined in: src/utils/refs.ts:95

Scroll to a specific location

#### Parameters

##### params

###### sectionIndex

`number`

###### itemIndex

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

### recordInteraction()

> **recordInteraction**(): `void`

Defined in: src/utils/refs.ts:103

Record interaction

#### Returns

`void`

---

### flashScrollIndicators()

> **flashScrollIndicators**(): `void`

Defined in: src/utils/refs.ts:105

Flash indicators

#### Returns

`void`

---

### getNativeScrollRef()?

> `optional` **getNativeScrollRef**(): [`ScrollViewRef`](ScrollViewRef.md) \| `null`

Defined in: src/utils/refs.ts:107

Get native scroll ref

#### Returns

[`ScrollViewRef`](ScrollViewRef.md) \| `null`

---

### getScrollableNode()?

> `optional` **getScrollableNode**(): `unknown`

Defined in: src/utils/refs.ts:109

Get scrollable node

#### Returns

`unknown`
