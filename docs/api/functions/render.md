[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / render

# Function: render()

> **render**(`element`, `options?`): `void`

Defined in: src/renderer/render.ts:77

Render a React element to console

Main entry point for rendering React components to the terminal. Supports three modes:
- `'static'` - One-time render (useful for CLI output)
- `'interactive'` - Interactive mode with keyboard and mouse input
- `'fullscreen'` - Fullscreen application mode

Automatically handles terminal resizing, input events, and reactive updates.
Uses React 19's reconciliation for efficient updates.

## Parameters

### element

`ReactElement`

React element to render (JSX component tree)

### options?

Render options

#### mode?

[`RenderMode`](../type-aliases/RenderMode.md)

Rendering mode: 'static', 'interactive', or 'fullscreen' (default: 'static')

#### fullscreen?

`boolean`

Enable fullscreen mode (takes over entire terminal)

#### onUpdate?

() => `void`

Callback called after each render update

#### appId?

`string`

## Returns

`void`

## Example

```tsx
// Static one-time render
render(<App />, { mode: 'static' });

// Interactive application
render(
  <App />,
  { 
    mode: 'interactive',
    onUpdate: () => console.log('UI updated')
  }
);

// Fullscreen application
render(<App />, { mode: 'fullscreen' });
```
