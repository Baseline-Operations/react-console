[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / createStatefulStyle

# Function: createStatefulStyle()

> **createStatefulStyle**\<`T`\>(`baseStyle`, `stateStyles`): (`state`) => `T`

Defined in: src/utils/stateStyles.ts:180

Create a stateful style function from base and state-specific styles
Useful for building reusable interactive styles

## Type Parameters

### T

`T` _extends_ `ViewStyle` \| `TextStyle` = `ViewStyle`

## Parameters

### baseStyle

`T`

### stateStyles

#### pressed?

`Partial`\<`T`\>

#### focused?

`Partial`\<`T`\>

#### hovered?

`Partial`\<`T`\>

#### disabled?

`Partial`\<`T`\>

## Returns

> (`state`): `T`

### Parameters

#### state

[`InteractionState`](../interfaces/InteractionState.md)

### Returns

`T`

## Example

```tsx
const buttonStyle = createStatefulStyle(
  { backgroundColor: 'blue', color: 'white' },
  {
    pressed: { backgroundColor: 'darkblue' },
    focused: { borderColor: 'yellow' },
    hovered: { backgroundColor: 'lightblue' },
    disabled: { backgroundColor: 'gray', color: 'darkgray' },
  }
);

<Pressable style={buttonStyle}>Press Me</Pressable>;
```
