[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / Dropdown

# Function: Dropdown()

> **Dropdown**(`props`): `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [src/components/selection/Dropdown.tsx:84](https://github.com/Baseline-Operations/react-console/blob/main/src/components/selection/Dropdown.tsx#L84)

Dropdown component - Single or multiple selection dropdown

Provides dropdown menu functionality with keyboard and mouse support.
Opens/closes with Space or Enter, navigates options with arrow keys,
selects with Enter/Space, closes with Escape or clicking outside.

## Parameters

### props

[`DropdownProps`](../interfaces/DropdownProps.md)

Dropdown component props

## Returns

`ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

React element representing a dropdown menu

## Example

```tsx
<Dropdown
  value={selectedValue}
  onChange={(e) => setSelectedValue(e.value)}
  options={[
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
  ]}
/>
```
