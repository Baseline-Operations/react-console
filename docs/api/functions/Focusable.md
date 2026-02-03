[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / Focusable

# Function: Focusable()

> **Focusable**(`props`): `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [src/components/interactive/Focusable.tsx:53](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Focusable.tsx#L53)

Focusable component - React Native-like pattern for terminal

Makes any content focusable and accessible via Tab navigation.
Wraps content in a focusable box that can receive keyboard focus and
supports focus/blur events. Useful for making non-interactive content
focusable or creating custom focusable components.

## Parameters

### props

[`FocusableProps`](../interfaces/FocusableProps.md)

Focusable component props

## Returns

`ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

React element representing a focusable container

## Example

```tsx
<Focusable onFocus={() => console.log('Focused!')} onBlur={() => console.log('Blurred!')}>
  <Box style={{ border: 'single' }}>
    <Text>Focusable Content</Text>
  </Box>
</Focusable>
```
