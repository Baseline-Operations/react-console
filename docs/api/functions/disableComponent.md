[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / disableComponent

# Function: disableComponent()

> **disableComponent**(`component`, `interactiveComponents`, `scheduleUpdate`): `void`

Defined in: [src/renderer/utils/focus/management.ts:157](https://github.com/Baseline-Operations/react-console/blob/main/src/renderer/utils/focus/management.ts#L157)

Programmatically disable a component

Disables a component by setting disabled to true.
If the component is currently focused, blurs it first and focuses the
next available component in tab order. Does nothing if component is already disabled.

## Parameters

### component

[`ConsoleNode`](../interfaces/ConsoleNode.md)

Component to disable (modified in place)

### interactiveComponents

[`ConsoleNode`](../interfaces/ConsoleNode.md)[]

All interactive components (to find next focus target if needed)

### scheduleUpdate

() => `void`

Function to schedule re-render after disabling

## Returns

`void`

## Example

```ts
disableComponent(myButton, components, scheduleUpdate);
// myButton.disabled is now true, focus moved to next component if it was focused
```
