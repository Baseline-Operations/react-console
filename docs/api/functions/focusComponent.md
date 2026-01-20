[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / focusComponent

# Function: focusComponent()

> **focusComponent**(`component`, `interactiveComponents`, `scheduleUpdate`): `void`

Defined in: src/renderer/utils/navigation.ts:181

Programmatically focus a component

Blurs currently focused component and focuses the target component.
Updates global terminal focus state and triggers focus/blur events.
Skips disabled components (returns early if component is disabled).

## Parameters

### component

[`ConsoleNode`](../interfaces/ConsoleNode.md)

Component to focus (must not be disabled)

### interactiveComponents

[`ConsoleNode`](../interfaces/ConsoleNode.md)[]

All interactive components (to blur currently focused one)

### scheduleUpdate

() => `void`

Function to schedule re-render after focus change

## Returns

`void`

## Example

```ts
focusComponent(myButton, components, scheduleUpdate);
// myButton is now focused, previous focus blurred
```
