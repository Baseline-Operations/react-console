[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / truncateText

# Function: truncateText()

> **truncateText**(`text`, `width`, `ellipsis`): `string`

Defined in: src/utils/measure.ts:104

Truncate text to fit width with ellipsis

Truncates text to fit within specified width, appending ellipsis if truncated.
Preserves ANSI escape codes and ensures total width (including ellipsis) fits.

## Parameters

### text

`string`

Text to truncate (may contain ANSI codes)

### width

`number`

Maximum width in characters

### ellipsis

`string` = `'...'`

Ellipsis string to append when truncated (default: '...')

## Returns

`string`

Truncated text with ellipsis if needed

## Example

```ts
truncateText('Hello world', 5); // 'He...'
truncateText('Short', 10); // 'Short' (not truncated)
truncateText('\x1b[31mRed\x1b[0m text', 8); // '\x1b[31mRed\x1b[0m ...' (ANSI preserved)
```
