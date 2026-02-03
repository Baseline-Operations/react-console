[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / getVisibleLength

# Function: getVisibleLength()

> **getVisibleLength**(`text`): `number`

Defined in: [src/renderer/ansi.ts:336](https://github.com/Baseline-Operations/react-console/blob/main/src/renderer/ansi.ts#L336)

Get visible length of text (without ANSI codes)

Returns the visible character count of text, excluding ANSI escape codes.
Useful for layout calculations where ANSI codes shouldn't affect width.

## Parameters

### text

`string`

Text with ANSI escape codes

## Returns

`number`

Visible character count (ANSI codes excluded)

## Example

```ts
getVisibleLength('Hello'); // 5
getVisibleLength('\x1b[31mRed\x1b[0m'); // 3 (ANSI codes excluded)
```
