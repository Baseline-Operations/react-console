[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / useComponentTheme

# Function: useComponentTheme()

> **useComponentTheme**(`componentType`, `customStyle?`): `ViewStyle` \| `TextStyle` \| `undefined`

Defined in: src/theme/useThemeStyle.ts:65

Hook to get component theme with custom overrides

Merges component default theme styles with custom styles,
resolving theme colors in the process.

## Parameters

### componentType

keyof [`ComponentTheme`](../interfaces/ComponentTheme.md)

Type of component ('text', 'input', 'button', etc.)

### customStyle?

[`ThemeAwareStyle`](../interfaces/ThemeAwareStyle.md)

Custom style to merge with component theme

## Returns

`ViewStyle` \| `TextStyle` \| `undefined`

Merged and resolved style

## Example

```tsx
function ThemedButton() {
  const style = useComponentTheme('button', { bold: true });
  
  return <Button style={style}>Themed Button</Button>;
}
```
