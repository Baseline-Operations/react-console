[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / unmount

# Function: unmount()

> **unmount**(): `void`

Defined in: src/renderer/render.ts:417

Unmount the rendered React application from the terminal

Cleans up all listeners, stops input handling, and removes the rendered content.
Call this when your application is done or needs to be completely removed.

## Returns

`void`

## Example

```tsx
// Render app
render(<App />, { mode: 'interactive' });

// Later, cleanup
unmount();
```
