[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / supportsColor

# Function: supportsColor()

> **supportsColor**(): `boolean`

Defined in: src/utils/terminal.ts:42

Check if terminal supports ANSI colors

Checks environment variables and terminal type to determine color support.
Respects FORCE_COLOR environment variable if set.

## Returns

`boolean`

True if terminal supports colors, false otherwise

## Example

```ts
if (supportsColor()) {
  console.log('\x1b[31mRed text\x1b[0m');
}
```
