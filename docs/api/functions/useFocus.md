[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / useFocus

# Function: useFocus()

> **useFocus**(`componentRef?`): `object`

Defined in: src/hooks/terminal.ts:84

Hook for managing component focus state

Returns the currently focused component and provides utilities
to check if a specific component is focused.

## Parameters

### componentRef?

Optional reference to a specific component to track

[`ConsoleNode`](../interfaces/ConsoleNode.md) | `null`

## Returns

`object`

Object with focused component and helper functions

### focusedComponent

> **focusedComponent**: [`ConsoleNode`](../interfaces/ConsoleNode.md) \| `null`

### isFocused

> **isFocused**: `boolean`

### focus()

> **focus**: () => `void`

#### Returns

`void`

### blur()

> **blur**: () => `void`

#### Returns

`void`

## Example

```tsx
function MyComponent() {
  const { focusedComponent, isFocused, focus } = useFocus();
  
  return (
    <Button
      focused={isFocused}
      onClick={() => focus()}
    >
      Click to Focus
    </Button>
  );
}
```
