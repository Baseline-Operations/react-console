[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / FocusProvider

# Function: FocusProvider()

> **FocusProvider**(`children`): `Element`

Defined in: src/context/FocusContext.tsx:39

Focus Provider

Provides focus management context to child components.
Tracks the currently focused component and provides utilities to check/manage focus.

## Parameters

### children

Child components

#### children

`ReactNode`

## Returns

`Element`

## Example

```tsx
function App() {
  return (
    <FocusProvider>
      <FocusableComponent />
    </FocusProvider>
  );
}
```
