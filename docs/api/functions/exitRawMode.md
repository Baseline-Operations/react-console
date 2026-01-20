[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / exitRawMode

# Function: exitRawMode()

> **exitRawMode**(): `void`

Defined in: src/utils/terminal.ts:98

Exit raw mode

Restores normal line-buffered input mode. Should be called when
interactive mode is no longer needed to restore normal terminal behavior.

## Returns

`void`

## Example

```ts
enterRawMode();
// ... interactive input handling ...
exitRawMode(); // Restore normal input
```
