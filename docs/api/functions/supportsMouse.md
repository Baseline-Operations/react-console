[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / supportsMouse

# Function: supportsMouse()

> **supportsMouse**(): `boolean`

Defined in: src/utils/mouse.ts:26

Check if terminal supports mouse events

Determines if the current terminal supports mouse events by checking:
- TERM environment variable (not 'dumb')
- stdout is a TTY

## Returns

`boolean`

True if terminal supports mouse events, false otherwise

## Example

```ts
if (supportsMouse()) {
  enableMouseTracking();
}
```
