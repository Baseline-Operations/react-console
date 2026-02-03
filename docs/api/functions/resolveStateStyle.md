[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / resolveStateStyle

# Function: resolveStateStyle()

> **resolveStateStyle**\<`T`\>(`style`, `state`, `overrides?`): `T`

Defined in: src/utils/stateStyles.ts:92

Resolve state-based style to a concrete style object

## Type Parameters

### T

`T` _extends_ `ViewStyle` \| `TextStyle` = `ViewStyle`

## Parameters

### style

Static style, array of styles, or function returning style

[`StateStyle`](../type-aliases/StateStyle.md)\<`T`\> | `undefined`

### state

[`InteractionState`](../interfaces/InteractionState.md)

Current interaction state

### overrides?

`Partial`\<[`StateStyleProps`](../interfaces/StateStyleProps.md)\<`T`\>\>

Optional per-state style overrides

## Returns

`T`

Resolved style object

## Example

```ts
// Function style
const style = resolveStateStyle(
  ({ pressed }) => ({ backgroundColor: pressed ? 'blue' : 'white' }),
  { pressed: true, focused: false, hovered: false, disabled: false }
);

// With overrides
const style = resolveStateStyle(
  { backgroundColor: 'white' },
  { pressed: false, focused: true, hovered: false, disabled: false },
  { focusedStyle: { backgroundColor: 'yellow' } }
);
```
