[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / StateStyleProps

# Interface: StateStyleProps\<T\>

Defined in: src/utils/stateStyles.ts:36

Props for state-based styling (can be added to any component)

## Type Parameters

### T

`T` _extends_ `ViewStyle` \| `TextStyle` = `ViewStyle`

## Properties

### style?

> `optional` **style**: [`StateStyle`](../type-aliases/StateStyle.md)\<`T`\>

Defined in: src/utils/stateStyles.ts:46

Style that can be static or a function of interaction state

#### Example

```tsx
<Pressable
  style={({ pressed, focused }) => ({
    backgroundColor: pressed ? 'blue' : focused ? 'gray' : 'white',
  })}
/>
```

---

### disabledStyle?

> `optional` **disabledStyle**: `T`

Defined in: src/utils/stateStyles.ts:49

Style applied when component is disabled

---

### pressedStyle?

> `optional` **pressedStyle**: `T`

Defined in: src/utils/stateStyles.ts:51

Style applied when component is pressed/activated

---

### focusedStyle?

> `optional` **focusedStyle**: `T`

Defined in: src/utils/stateStyles.ts:53

Style applied when component has focus

---

### hoveredStyle?

> `optional` **hoveredStyle**: `T`

Defined in: src/utils/stateStyles.ts:55

Style applied when component is hovered
