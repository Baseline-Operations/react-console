[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / resolveClassName

# Function: resolveClassName()

> **resolveClassName**(`classNames`): `ViewStyle` \| `TextStyle` \| `undefined`

Defined in: [src/utils/className.ts:149](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/className.ts#L149)

Resolve class names to style object

## Parameters

### classNames

`string` | `string`[] | `undefined`

## Returns

`ViewStyle` \| `TextStyle` \| `undefined`

## Example

```tsx
const style = resolveClassName('text-red bg-blue p-2');
// Returns: { color: 'red', backgroundColor: 'blue', padding: 2 }
```
