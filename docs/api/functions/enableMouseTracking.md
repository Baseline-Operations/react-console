[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / enableMouseTracking

# Function: enableMouseTracking()

> **enableMouseTracking**(): `void`

Defined in: [src/utils/mouse.ts:55](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/mouse.ts#L55)

Enable mouse tracking in terminal

Enables SGR extended mouse mode which reports mouse clicks, drags, and movement
via ANSI escape sequences. Must be called before mouse events can be received.

Enables:

- SGR extended mode (`\x1b[?1006h`) - Reports coordinates in decimal
- Click reporting (`\x1b[?1000h`) - Reports mouse clicks
- Drag reporting (`\x1b[?1002h`) - Reports mouse drags

## Returns

`void`

## Example

```ts
if (supportsMouse()) {
  enableMouseTracking();
  // Mouse events now available
}
```
