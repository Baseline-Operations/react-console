[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / FlatList

# Function: FlatList()

> **FlatList**\<`T`\>(`props`): `ReactElement`\<`unknown`\>

Defined in: src/components/data/FlatList.tsx:198

FlatList component - Performant scrollable list

Renders a scrollable list of data. Similar to React Native's FlatList,
it virtualizes items for performance when dealing with large lists.

## Type Parameters

### T

`T`

## Parameters

### props

[`FlatListProps`](../interfaces/FlatListProps.md)\<`T`\>

FlatList component props

## Returns

`ReactElement`\<`unknown`\>

React element representing a scrollable list

## Example

```tsx
const data = [
  { id: '1', title: 'Item 1' },
  { id: '2', title: 'Item 2' },
  { id: '3', title: 'Item 3' },
];

<FlatList
  data={data}
  renderItem={({ item }) => <Text>{item.title}</Text>}
  keyExtractor={(item) => item.id}
  maxHeight={5}
/>

// With header and footer
<FlatList
  data={data}
  renderItem={({ item }) => <Text>{item.title}</Text>}
  ListHeaderComponent={<Text bold>My List</Text>}
  ListFooterComponent={<Text dim>End of list</Text>}
  ListEmptyComponent={<Text>No items</Text>}
/>
```
