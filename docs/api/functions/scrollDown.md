[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / scrollDown

# Function: scrollDown()

> **scrollDown**(`n`): `string`

Defined in: [src/utils/console.ts:147](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/console.ts#L147)

Scroll down

Generates an ANSI escape sequence that scrolls the terminal viewport down by the specified number of lines.

## Parameters

### n

`number` = `1`

Number of lines to scroll (default: 1).

## Returns

`string`

ANSI escape sequence string. Write this to stdout to perform the scroll operation.

## Example

```typescript
// Scroll the terminal viewport down by 3 lines
process.stdout.write(scrollDown(3));
```
