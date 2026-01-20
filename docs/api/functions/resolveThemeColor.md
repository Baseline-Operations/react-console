[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / resolveThemeColor

# Function: resolveThemeColor()

> **resolveThemeColor**(`color`, `theme`): `string` \| `undefined`

Defined in: src/theme/resolveTheme.ts:27

Resolve a theme color reference to an actual color value

If the color is a theme color key (e.g., 'text', 'primary'), resolves it from the theme.
Otherwise, returns the color as-is (for direct color values like 'red', '#FF0000').

## Parameters

### color

Theme color reference or direct color value

`string` | `undefined`

### theme

[`Theme`](../interfaces/Theme.md)

Current theme

## Returns

`string` \| `undefined`

Resolved color value

## Example

```ts
resolveThemeColor('text', theme); // 'white' (from theme.colors.text)
resolveThemeColor('red', theme); // 'red' (direct color value)
resolveThemeColor('#FF0000', theme); // '#FF0000' (direct hex color)
```
