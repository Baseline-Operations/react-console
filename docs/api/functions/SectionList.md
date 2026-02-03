[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / SectionList

# Function: SectionList()

> **SectionList**\<`ItemT`, `SectionT`\>(`__namedParameters`): `ReactElement`\<`unknown`\>

Defined in: src/components/data/SectionList.tsx:231

SectionList Component

Renders sectioned data with headers, footers, and separators.
Similar to React Native's SectionList but optimized for terminal.

## Type Parameters

### ItemT

`ItemT`

### SectionT

`SectionT` = [`DefaultSectionT`](../interfaces/DefaultSectionT.md)

## Parameters

### \_\_namedParameters

[`SectionListProps`](../interfaces/SectionListProps.md)\<`ItemT`, `SectionT`\>

## Returns

`ReactElement`\<`unknown`\>

## Example

```tsx
const DATA = [
  {
    title: 'Main Dishes',
    data: ['Pizza', 'Burger', 'Pasta'],
  },
  {
    title: 'Desserts',
    data: ['Ice Cream', 'Cake'],
  },
];

<SectionList
  sections={DATA}
  keyExtractor={(item, index) => item + index}
  renderItem={({ item }) => <Text>{item}</Text>}
  renderSectionHeader={({ section }) => <Text style={{ bold: true }}>{section.title}</Text>}
/>;
```
