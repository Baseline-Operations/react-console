[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / memoizeStyle

# Function: memoizeStyle()

> **memoizeStyle**\<`T`\>(`style`, `key?`): `T` \| `undefined`

Defined in: [src/utils/memoization.ts:35](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/memoization.ts#L35)

Memoize style object
Caches style objects to avoid recalculating merged styles

## Type Parameters

### T

`T` _extends_ `ViewStyle` \| `TextStyle`

## Parameters

### style

Style object to memoize

`T` | `undefined`

### key?

`string`

Optional key for cache (if style is not an object)

## Returns

`T` \| `undefined`

Cached or original style

## Example

```ts
const memoizedStyle = memoizeStyle({ padding: 2, color: 'red' });
```
