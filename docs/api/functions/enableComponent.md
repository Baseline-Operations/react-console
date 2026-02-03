[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / enableComponent

# Function: enableComponent()

> **enableComponent**(`component`, `scheduleUpdate`): `void`

Defined in: [src/renderer/utils/focus/management.ts:132](https://github.com/Baseline-Operations/react-console/blob/main/src/renderer/utils/focus/management.ts#L132)

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
