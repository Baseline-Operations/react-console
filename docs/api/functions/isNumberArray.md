[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / isNumberArray

# Function: isNumberArray()

> **isNumberArray**(`value`): `value is number[]`

Defined in: [src/types/guards.ts:18](https://github.com/Baseline-Operations/react-console/blob/main/src/types/guards.ts#L18)

Type guard: Check if value is a number array

Returns `true` if the value is an array where every element is a number.

## Parameters

### value

`unknown`

The value to check.

## Returns

`value is number[]`

`true` if value is an array of numbers, `false` otherwise.

## Example

```typescript
const data: unknown = [1, 2, 3];
if (isNumberArray(data)) {
  // data is now typed as number[]
  console.log(data.map((n) => n * 2));
}
```

## See Also

- [`isStringArray`](./isStringArray.md)
- [`isArrayValue`](./isArrayValue.md)
