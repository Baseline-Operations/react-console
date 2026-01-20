[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / getTerminalDimensions

# Function: getTerminalDimensions()

> **getTerminalDimensions**(): [`TerminalDimensions`](../interfaces/TerminalDimensions.md)

Defined in: src/utils/terminal.ts:21

Get terminal dimensions (columns and rows)

Returns the current terminal size. Falls back to 80x24 if dimensions
are not available (e.g., when not in a TTY).

## Returns

[`TerminalDimensions`](../interfaces/TerminalDimensions.md)

Terminal dimensions with columns and rows

## Example

```ts
const dims = getTerminalDimensions();
console.log(`Terminal size: ${dims.columns}x${dims.rows}`);
```
