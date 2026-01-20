[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / useThemeColors

# Function: useThemeColors()

> **useThemeColors**(): [`ThemeColors`](../interfaces/ThemeColors.md)

Defined in: src/context/ThemeContext.tsx:132

Hook to use theme colors

Convenience hook that returns just the theme colors.

## Returns

[`ThemeColors`](../interfaces/ThemeColors.md)

Theme colors object

## Example

```tsx
function ThemedComponent() {
  const colors = useThemeColors();
  
  return (
    <Text color={colors.text}>Themed text</Text>
  );
}
```
