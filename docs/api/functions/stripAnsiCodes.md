[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / stripAnsiCodes

# Function: stripAnsiCodes()

> **stripAnsiCodes**(`text`): `string`

Defined in: src/renderer/ansi.ts:211

Remove ANSI codes from text

Strips all ANSI escape codes from text, returning only visible characters.
Useful for measuring text width or comparing text without styling.

## Parameters

### text

`string`

Text with ANSI escape codes

## Returns

`string`

Text without ANSI escape codes

## Example

```ts
stripAnsiCodes('\x1b[31mRed\x1b[0m'); // 'Red'
stripAnsiCodes('Normal'); // 'Normal'
```
