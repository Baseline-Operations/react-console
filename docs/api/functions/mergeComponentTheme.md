[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / mergeComponentTheme

# Function: mergeComponentTheme()

> **mergeComponentTheme**(`componentType`, `customStyle`, `theme`): `ViewStyle` \| `TextStyle` \| `undefined`

Defined in: src/theme/resolveTheme.ts:104

Merge component theme with custom style

Merges component default styles from theme with custom styles,
resolving theme color references in the process.

## Parameters

### componentType

keyof [`ComponentTheme`](../interfaces/ComponentTheme.md)

Type of component ('text', 'input', 'button', etc.)

### customStyle

Custom style to merge

[`ThemeAwareStyle`](../interfaces/ThemeAwareStyle.md) | `undefined`

### theme

[`Theme`](../interfaces/Theme.md)

Current theme

## Returns

`ViewStyle` \| `TextStyle` \| `undefined`

Merged and resolved style

## Example

```ts
const style = mergeComponentTheme('button', { bold: true }, theme);
// Merges theme.components.button with custom style, resolves colors
```
