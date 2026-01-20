[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / Pressable

# Function: Pressable()

> **Pressable**(`props`): `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: src/components/interactive/Pressable.tsx:50

Pressable component - React Native-like pattern for terminal

Provides pressable wrapper for any content. Can be pressed via keyboard
(Enter/Space when focused) or mouse clicks (if terminal supports it).
Similar to Button but can wrap any content, not just text.

`onPress` is an alias for `onClick` (React Native pattern).

## Parameters

### props

[`PressableProps`](../interfaces/PressableProps.md)

Pressable component props

## Returns

`ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

React element representing a pressable container

## Example

```tsx
<Pressable onClick={() => handlePress()}>
  <Box style={{ border: 'single' }}>
    <Text>Pressable Content</Text>
  </Box>
</Pressable>
```
