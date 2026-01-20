[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / wrapText

# Function: wrapText()

> **wrapText**(`text`, `width`): `string`[]

Defined in: src/utils/measure.ts:48

Wrap text to fit within a given width

Wraps text at word boundaries to fit within specified width, preserving
ANSI escape codes. Handles multiple lines (separated by `\n`) and wraps
each line independently.

## Parameters

### text

`string`

Text to wrap (may contain ANSI codes and newlines)

### width

`number`

Maximum width in characters for each line

## Returns

`string`[]

Array of wrapped lines (each line fits within width)

## Example

```ts
wrapText('Hello world', 5); // ['Hello', 'world']
wrapText('Long text here', 8); // ['Long', 'text', 'here']
wrapText('\x1b[31mRed\x1b[0m text', 10); // ['\x1b[31mRed\x1b[0m text'] (ANSI preserved)
```
