[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / ListRenderItemInfo

# Interface: ListRenderItemInfo\<T\>

Defined in: src/components/data/FlatList.tsx:49

List render item info

## Type Parameters

### T

`T`

## Properties

### item

> **item**: `T`

Defined in: src/components/data/FlatList.tsx:50

---

### index

> **index**: `number`

Defined in: src/components/data/FlatList.tsx:51

---

### separators

> **separators**: `object`

Defined in: src/components/data/FlatList.tsx:52

#### highlight()

> **highlight**: () => `void`

##### Returns

`void`

#### unhighlight()

> **unhighlight**: () => `void`

##### Returns

`void`

#### updateProps()

> **updateProps**: (`select`, `newProps`) => `void`

##### Parameters

###### select

`"leading"` | `"trailing"`

###### newProps

`Record`\<`string`, `unknown`\>

##### Returns

`void`
