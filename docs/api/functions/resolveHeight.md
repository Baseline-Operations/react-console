[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / resolveHeight

# Function: resolveHeight()

> **resolveHeight**(`height`, `maxHeight?`): `number` \| `undefined`

Defined in: [src/utils/responsive.ts:132](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/responsive.ts#L132)

Get responsive height value

Convenience function for resolving height sizes. Same as `resolveSize(height, 'height', maxHeight)`.

## Parameters

### height

Fixed number or responsive string (e.g., "50%", "50vh")

`ResponsiveSize` | `undefined`

### maxHeight?

`number`

Optional maximum height constraint

## Returns

`number` \| `undefined`

Resolved height in characters or undefined if invalid

## Example

```ts
resolveHeight(24); // 24
resolveHeight('50%'); // 50% of terminal height
resolveHeight('50vh'); // 50% of terminal height
```
