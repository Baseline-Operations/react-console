[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / SectionListRenderItemInfo

# Interface: SectionListRenderItemInfo\<ItemT, SectionT\>

Defined in: src/components/data/SectionList.tsx:35

Info passed to renderItem

## Type Parameters

### ItemT

`ItemT`

### SectionT

`SectionT` = [`DefaultSectionT`](DefaultSectionT.md)

## Properties

### item

> **item**: `ItemT`

Defined in: src/components/data/SectionList.tsx:36

---

### index

> **index**: `number`

Defined in: src/components/data/SectionList.tsx:37

---

### section

> **section**: [`Section`](Section.md)\<`ItemT`, `SectionT`\>

Defined in: src/components/data/SectionList.tsx:38

---

### separators

> **separators**: `object`

Defined in: src/components/data/SectionList.tsx:39

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

`object`

##### Returns

`void`
