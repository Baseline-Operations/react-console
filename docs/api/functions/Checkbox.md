[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / Checkbox

# Function: Checkbox()

> **Checkbox**(`props`): `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: src/components/selection/Checkbox.tsx:68

Checkbox component - Multiple selection from options

Provides checkbox group functionality for selecting multiple options.
Supports keyboard navigation (arrow keys) and toggling (Enter/Space).

## Parameters

### props

[`CheckboxProps`](../interfaces/CheckboxProps.md)

Checkbox component props

## Returns

`ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

React element representing a checkbox group

## Example

```tsx
<Checkbox
  value={selectedItems}
  onChange={(e) => setSelectedItems(e.value as string[])}
  options={[
    { label: 'Item 1', value: 'item1' },
    { label: 'Item 2', value: 'item2' },
  ]}
/>
```
