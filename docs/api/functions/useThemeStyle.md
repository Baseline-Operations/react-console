[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / useThemeStyle

# Function: useThemeStyle()

> **useThemeStyle**(`style`): `ViewStyle` \| `TextStyle` \| `undefined`

Defined in: src/theme/useThemeStyle.ts:35

Hook to resolve theme-aware styles

Automatically resolves theme color references in styles using the current theme.
Useful for components that want to use theme colors in their styles.

## Parameters

### style

Theme-aware style object (can reference theme colors)

[`ThemeAwareStyle`](../interfaces/ThemeAwareStyle.md) | `undefined`

## Returns

`ViewStyle` \| `TextStyle` \| `undefined`

Resolved style object with actual color values

## Example

```tsx
function ThemedComponent() {
  const style = useThemeStyle({
    color: 'text',
    backgroundColor: 'background',
    bold: true,
  });
  
  return <Text style={style}>Themed text</Text>;
}
```
