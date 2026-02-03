[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / isTextStyle

# Function: isTextStyle()

> **isTextStyle**(`style`): `style is TextStyle`

Defined in: [src/types/guards.ts:204](https://github.com/Baseline-Operations/react-console/blob/main/src/types/guards.ts#L204)

Type guard: Check if style is a TextStyle

Validates whether an unknown style object conforms to the TextStyle interface (text formatting properties like color, fontWeight, fontSize, etc.).

## Parameters

### style

`unknown`

The value to check. Can be any type; the function validates whether it matches the TextStyle interface.

## Returns

`style is TextStyle`

`true` if the style object conforms to the TextStyle interface, `false` otherwise. When `true`, TypeScript narrows the type.

## Example

```typescript
if (isTextStyle(style)) {
  // style is now narrowed to TextStyle
  console.log(style.color, style.fontWeight);
}
```
