[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / measureText

# Function: measureText()

> **measureText**(`text`): `number`

Defined in: src/utils/measure.ts:26

Measure text width (accounting for ANSI codes)

Returns the visible width of text in characters, ignoring ANSI escape codes.
Useful for layout calculations where ANSI codes shouldn't affect spacing.

## Parameters

### text

`string`

Text to measure (may contain ANSI escape codes)

## Returns

`number`

Visible width in characters (ANSI codes excluded)

## Example

```ts
measureText('Hello'); // 5
measureText('\x1b[31mRed\x1b[0m'); // 3 (ANSI codes ignored)
measureText('Hello\nWorld'); // 5 (only first line measured)
```
