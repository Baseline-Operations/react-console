[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / memoizeResponsiveSize

# Function: memoizeResponsiveSize()

> **memoizeResponsiveSize**(`size`, `dimension`, `maxSize?`): `number` \| `undefined`

Defined in: [src/utils/memoization.ts:78](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/memoization.ts#L78)

Memoize responsive size resolution
Caches resolved responsive sizes to avoid recalculating

## Parameters

### size

Responsive size to resolve

[`ResponsiveSize`](../type-aliases/ResponsiveSize.md) | `undefined`

### dimension

'width' or 'height'

`"width"` | `"height"`

### maxSize?

`number`

Optional maximum size constraint

## Returns

`number` \| `undefined`

Cached or newly resolved size

## Example

```ts
const width = memoizeResponsiveSize('50%', 'width', 80);
```
