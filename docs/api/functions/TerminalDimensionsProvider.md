[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / TerminalDimensionsProvider

# Function: TerminalDimensionsProvider()

> **TerminalDimensionsProvider**(`children`): `Element`

Defined in: src/context/TerminalDimensionsContext.tsx:40

Terminal Dimensions Provider

Provides terminal dimensions context to child components.
Automatically updates when terminal is resized.

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
    <TerminalDimensionsProvider>
      <ResponsiveComponent />
    </TerminalDimensionsProvider>
  );
}
```
