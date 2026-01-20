[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / resolveSize

# Function: resolveSize()

> **resolveSize**(`size`, `dimension`, `maxSize?`): `number` \| `undefined`

Defined in: src/utils/responsive.ts:39

Resolve a responsive size to a pixel value based on terminal dimensions

Supports multiple size formats:
- Fixed numbers: `80` (80 characters)
- Percentages: `"50%"` (50% of terminal width/height)
- Viewport units: `"80vw"` (80% width), `"50vh"` (50% height)
- Character units: `"80ch"` (80 characters, for width only)

## Parameters

### size

Fixed number or percentage/viewport/character string

`ResponsiveSize` | `undefined`

### dimension

'width' or 'height' to use appropriate terminal dimension

`"width"` | `"height"`

### maxSize?

`number`

Optional maximum size constraint

## Returns

`number` \| `undefined`

Resolved pixel value or undefined if invalid format

## Example

```ts
resolveSize(80, 'width'); // 80
resolveSize('50%', 'width'); // 50% of terminal width
resolveSize('80vw', 'width'); // 80% of terminal width
resolveSize('80ch', 'width'); // 80 characters
```
