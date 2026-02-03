[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / resolveWidth

# Function: resolveWidth()

> **resolveWidth**(`width`, `maxWidth?`): `number` \| `undefined`

Defined in: [src/utils/responsive.ts:109](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/responsive.ts#L109)

Get responsive width value

Convenience function for resolving width sizes. Same as `resolveSize(width, 'width', maxWidth)`.

## Parameters

### width

Fixed number or responsive string (e.g., "50%", "80vw", "80ch")

`ResponsiveSize` | `undefined`

### maxWidth?

`number`

Optional maximum width constraint

## Returns

`number` \| `undefined`

Resolved width in characters or undefined if invalid

## Example

```ts
resolveWidth(80); // 80
resolveWidth('50%'); // 50% of terminal width
resolveWidth('80vw'); // 80% of terminal width
```
