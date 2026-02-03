[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / Pressable

# Function: Pressable()

> **Pressable**(`props`): `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [src/components/interactive/Pressable.tsx:133](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Pressable.tsx#L133)

Pressable component - React Native-like pattern for terminal

Provides pressable wrapper for any content. Can be pressed via keyboard
(Enter/Space when focused) or mouse clicks (if terminal supports it).
Similar to Button but can wrap any content, not just text.

Supports state-based styling where style can be a function that receives
the current interaction state ({ pressed, focused, hovered, disabled }).

## Parameters

### props

[`PressableProps`](../interfaces/PressableProps.md)

Pressable component props

## Returns

`ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

React element representing a pressable container

## Example

```tsx
// Static style
<Pressable onPress={() => handlePress()} style={{ backgroundColor: 'blue' }}>
  <Text>Press me</Text>
</Pressable>

// State-based style
<Pressable
  onPress={() => handlePress()}
  style={({ pressed, focused }) => ({
    backgroundColor: pressed ? 'darkblue' : focused ? 'lightblue' : 'blue',
    opacity: pressed ? 0.8 : 1
  })}
>
  {({ pressed }) => (
    <Text color={pressed ? 'gray' : 'white'}>
      {pressed ? 'Pressing...' : 'Press me'}
    </Text>
  )}
</Pressable>
```
