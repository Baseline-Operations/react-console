[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / exitRawMode

# Function: exitRawMode()

> **exitRawMode**(): `void`

Defined in: [src/utils/terminal.ts:127](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/terminal.ts#L127)

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
