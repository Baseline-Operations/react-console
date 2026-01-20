[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / disableMouseTracking

# Function: disableMouseTracking()

> **disableMouseTracking**(): `void`

Defined in: src/utils/mouse.ts:81

Disable mouse tracking in terminal

Disables mouse tracking and returns terminal to normal mode.
Should be called when mouse events are no longer needed (e.g., on cleanup).

## Returns

`void`

## Example

```ts
enableMouseTracking();
// ... use mouse events ...
disableMouseTracking(); // Cleanup
```
