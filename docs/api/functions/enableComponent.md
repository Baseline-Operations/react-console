[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / enableComponent

# Function: enableComponent()

> **enableComponent**(`component`, `scheduleUpdate`): `void`

Defined in: src/renderer/utils/navigation.ts:219

Programmatically enable a component

Enables a disabled component by setting disabled to false.
Does nothing if component is already enabled.

## Parameters

### component

[`ConsoleNode`](../interfaces/ConsoleNode.md)

Component to enable (modified in place)

### scheduleUpdate

() => `void`

Function to schedule re-render after enabling

## Returns

`void`

## Example

```ts
enableComponent(myButton, scheduleUpdate);
// myButton.disabled is now false
```
