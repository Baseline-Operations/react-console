[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / applyStyles

# Function: applyStyles()

> **applyStyles**(`text`, `styles?`): `string`

Defined in: [src/renderer/ansi.ts:183](https://github.com/Baseline-Operations/react-console/blob/main/src/renderer/ansi.ts#L183)

Apply styles to text using ANSI escape codes

Applies multiple text styles and colors to text using ANSI escape codes.
Supports text styles (bold, italic, underline, etc.) and colors (foreground, background).
Automatically resets styles at the end of text.

## Parameters

### text

`string`

Text to style

### styles?

[`StyleProps`](../interfaces/StyleProps.md)

Style properties to apply (color, backgroundColor, bold, italic, etc.)

## Returns

`string`

Styled text with ANSI escape codes

## Example

```ts
applyStyles('Hello', { color: 'red', bold: true });
// '\x1b[1;31mHello\x1b[0m' (combined codes)

applyStyles('World', { backgroundColor: 'blue', underline: true });
// '\x1b[4;44mWorld\x1b[0m' (combined codes)
```
