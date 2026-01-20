[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / useTheme

# Function: useTheme()

> **useTheme**(): `ThemeContextValue`

Defined in: src/context/ThemeContext.tsx:106

Hook to use theme context

Returns theme context from the nearest ThemeProvider.

## Returns

`ThemeContextValue`

Theme context value

## Throws

Error if used outside ThemeProvider

## Example

```tsx
function ThemedComponent() {
  const { theme, colors, setTheme } = useTheme();
  
  return (
    <View>
      <Text color={colors.text}>Themed text</Text>
      <Button onClick={() => setTheme(darkTheme)}>
        Switch Theme
      </Button>
    </View>
  );
}
```
