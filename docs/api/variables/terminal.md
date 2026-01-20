[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / terminal

# Variable: terminal

> `const` **terminal**: [`GlobalTerminal`](../interfaces/GlobalTerminal.md)

Defined in: src/utils/globalTerminal.ts:113

Global terminal object instance (singleton)

This is exported as a global-like object accessible without imports.
Similar to `window` in browsers, provides global access to terminal state.

Attached to `globalThis` for global access: `terminal.dimensions`, `terminal.focusedComponent`

## Example

```ts
// Use directly (available globally)
const dims = terminal.dimensions;
const focused = terminal.focusedComponent;
```
