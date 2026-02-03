[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / enterRawMode

# Function: enterRawMode()

> **enterRawMode**(): `void`

Defined in: [src/utils/terminal.ts:106](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/terminal.ts#L106)

Enter raw mode for terminal input (captures keypresses)

Enables raw mode on stdin, allowing capture of individual keypresses
and special keys (arrows, function keys, etc.) instead of line buffering.
Required for interactive applications.

## Returns

`void`

## Example

```ts
enterRawMode(); // Now can capture individual keypresses
// ... handle input ...
exitRawMode(); // Restore normal input mode
```
