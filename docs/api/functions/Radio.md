[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / Radio

# Function: Radio()

> **Radio**(`props`): `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: src/components/selection/Radio.tsx:70

Radio component - Single selection from options

Provides radio button group functionality for selecting one option from a list.
Supports keyboard navigation (arrow keys) and selection (Enter/Space).

## Parameters

### props

[`RadioProps`](../interfaces/RadioProps.md)

Radio component props

## Returns

`ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

React element representing a radio button group

## Example

```tsx
<Radio
  name="theme"
  value={selectedTheme}
  onChange={(e) => setSelectedTheme(e.value)}
  options={[
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
  ]}
/>
```
