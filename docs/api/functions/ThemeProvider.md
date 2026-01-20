[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / ThemeProvider

# Function: ThemeProvider()

> **ThemeProvider**(`children`): `Element`

Defined in: src/context/ThemeContext.tsx:50

Theme Provider

Provides theme context to child components.
Allows components to access theme colors and styles.

## Parameters

### children

Child components

#### children

`ReactNode`

#### initialTheme?

[`Theme`](../interfaces/Theme.md) = `defaultTheme`

## Returns

`Element`

## Example

```tsx
function App() {
  return (
    <ThemeProvider>
      <ThemedComponent />
    </ThemeProvider>
  );
}

// With custom theme
function App() {
  return (
    <ThemeProvider initialTheme={customTheme}>
      <ThemedComponent />
    </ThemeProvider>
  );
}
```
