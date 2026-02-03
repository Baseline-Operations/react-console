[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / TableColumn

# Interface: TableColumn\<T\>

Defined in: [src/components/data/Table.tsx:12](https://github.com/Baseline-Operations/react-console/blob/main/src/components/data/Table.tsx#L12)

## Type Parameters

### T

`T` = `unknown`

## Properties

### key

> **key**: `string`

Defined in: [src/components/data/Table.tsx:13](https://github.com/Baseline-Operations/react-console/blob/main/src/components/data/Table.tsx#L13)

---

### header?

> `optional` **header**: `ReactNode`

Defined in: [src/components/data/Table.tsx:14](https://github.com/Baseline-Operations/react-console/blob/main/src/components/data/Table.tsx#L14)

---

### accessor()?

> `optional` **accessor**: (`row`) => `ReactNode`

Defined in: [src/components/data/Table.tsx:15](https://github.com/Baseline-Operations/react-console/blob/main/src/components/data/Table.tsx#L15)

#### Parameters

##### row

`T`

#### Returns

`ReactNode`

---

### width?

> `optional` **width**: `string` \| `number`

Defined in: [src/components/data/Table.tsx:16](https://github.com/Baseline-Operations/react-console/blob/main/src/components/data/Table.tsx#L16)

---

### align?

> `optional` **align**: `"left"` \| `"right"` \| `"center"`

Defined in: [src/components/data/Table.tsx:17](https://github.com/Baseline-Operations/react-console/blob/main/src/components/data/Table.tsx#L17)

---

### sortable?

> `optional` **sortable**: `boolean`

Defined in: [src/components/data/Table.tsx:18](https://github.com/Baseline-Operations/react-console/blob/main/src/components/data/Table.tsx#L18)

---

### render()?

> `optional` **render**: (`value`, `row`, `index`) => `ReactNode`

Defined in: [src/components/data/Table.tsx:19](https://github.com/Baseline-Operations/react-console/blob/main/src/components/data/Table.tsx#L19)

#### Parameters

##### value

`unknown`

##### row

`T`

##### index

`number`

#### Returns

`ReactNode`
