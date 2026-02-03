[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / isColor

# Function: isColor()

> **isColor**(`value`): `value is string`

Defined in: [src/types/guards.ts:223](https://github.com/Baseline-Operations/react-console/blob/main/src/types/guards.ts#L223)

Type guard: Check if value is a valid color (string)

Checks if the value is a non-empty string that can be used as a color value. This includes ANSI color names (e.g., 'red', 'blue'), hex colors (e.g., '#ff0000'), and RGB values (e.g., 'rgb(255,0,0)').

## Parameters

### value

`unknown`

The value to check.

## Returns

`value is string`

`true` if the value is a valid color string, `false` otherwise.

## Example

```typescript
isColor('red'); // true
isColor('#ff0000'); // true
isColor('rgb(255,0,0)'); // true
isColor(''); // false
isColor(123); // false
isColor(null); // false
```
