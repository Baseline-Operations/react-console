[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / updateTerminalDimensions

# Function: updateTerminalDimensions()

> **updateTerminalDimensions**(): `void`

Defined in: src/utils/globalTerminal.ts:134

Update terminal dimensions (called on resize)

Updates the global terminal object with current terminal dimensions.
Called automatically on terminal resize, but can be called manually if needed.

## Returns

`void`

## Example

```ts
// Manual update (usually not needed - auto-updates on resize)
updateTerminalDimensions();
const dims = terminal.dimensions;
```
