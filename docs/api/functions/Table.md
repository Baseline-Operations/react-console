[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / Table

# Function: Table()

> **Table**\<`T`\>(`props`): `ReactElement`\<`unknown`\>

Defined in: [src/components/data/Table.tsx:62](https://github.com/Baseline-Operations/react-console/blob/main/src/components/data/Table.tsx#L62)

Table component - Display tabular data

Renders a table with headers, rows, and optional sorting, borders, and zebra striping.

## Type Parameters

### T

`T` = `unknown`

## Parameters

### props

[`TableProps`](../interfaces/TableProps.md)\<`T`\>

Table component props

## Returns

`ReactElement`\<`unknown`\>

React element representing a table

## Example

```tsx
const data = [
  { id: 1, name: 'John', age: 30 },
  { id: 2, name: 'Jane', age: 25 },
  { id: 3, name: 'Bob', age: 35 },
];

const columns = [
  { key: 'name', header: 'Name', accessor: (row) => row.name },
  { key: 'age', header: 'Age', accessor: (row) => row.age, align: 'right' },
];

// Basic table with border
<Table data={data} columns={columns} border="single" />

// With sorting and zebra striping
<Table
  data={data}
  columns={columns}
  border="single"
  sortable
  zebra
/>
```
