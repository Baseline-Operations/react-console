[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / List

# Function: List()

> **List**(`props`): `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [src/components/selection/List.tsx:80](https://github.com/Baseline-Operations/react-console/blob/main/src/components/selection/List.tsx#L80)

List component - Scrollable list with single or multiple selection

Provides scrollable list functionality for selecting from many options.
Automatically handles scrolling to keep focused item visible. Supports
keyboard navigation (arrow keys, Page Up/Down, Home/End) and selection
(Enter for single, Space to toggle for multiple).

## Parameters

### props

[`ListProps`](../interfaces/ListProps.md)

List component props

## Returns

`ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

React element representing a scrollable list

## Example

```tsx
<List
  value={selectedValue}
  onChange={(e) => setSelectedValue(e.value)}
  options={largeArrayOfOptions}
  multiple={false}
  style={{ height: 15 }}
/>
```
