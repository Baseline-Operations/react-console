[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / isViewStyle

# Function: isViewStyle()

> **isViewStyle**(`style`): `style is ViewStyle`

Defined in: [src/types/guards.ts:194](https://github.com/Baseline-Operations/react-console/blob/main/src/types/guards.ts#L194)

Type guard: Check if style is a ViewStyle

Validates whether an unknown style object conforms to the ViewStyle interface (layout and visual properties for container elements).

## Parameters

### style

`unknown`

The value to check. Can be any type; the function validates whether it matches the ViewStyle interface.

## Returns

`style is ViewStyle`

`true` if the style object conforms to the ViewStyle interface, `false` otherwise. When `true`, TypeScript narrows the type.

## Example

```typescript
if (isViewStyle(style)) {
  // style is now narrowed to ViewStyle
  console.log(style.borderWidth, style.padding);
}
```
