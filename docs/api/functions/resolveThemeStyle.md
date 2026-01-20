[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / resolveThemeStyle

# Function: resolveThemeStyle()

> **resolveThemeStyle**(`style`, `theme`): `ViewStyle` \| `TextStyle` \| `undefined`

Defined in: src/theme/resolveTheme.ts:62

Resolve theme-aware style to regular style

Converts a ThemeAwareStyle (which can reference theme colors) to a regular
TextStyle or ViewStyle with resolved color values.

## Parameters

### style

Theme-aware style object

[`ThemeAwareStyle`](../interfaces/ThemeAwareStyle.md) | `undefined`

### theme

[`Theme`](../interfaces/Theme.md)

Current theme

## Returns

`ViewStyle` \| `TextStyle` \| `undefined`

Resolved style object

## Example

```ts
const themeStyle: ThemeAwareStyle = {
  color: 'text',
  backgroundColor: 'background',
  bold: true,
};

const resolved = resolveThemeStyle(themeStyle, theme);
// { color: 'white', backgroundColor: 'black', bold: true }
```
