[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / assertIsArray

# Function: assertIsArray()

> **assertIsArray**\<`T`\>(`value`, `errorMessage?`): `asserts value is T[]`

Defined in: [src/types/guards.ts:284](https://github.com/Baseline-Operations/react-console/blob/main/src/types/guards.ts#L284)

Type assertion helper: Assert value is an array

Throws an error if the value is not an array, otherwise narrows the type to `T[]`.

## Type Parameters

### T

`T`

The expected element type of the array.

## Parameters

### value

`unknown`

The value to check.

### errorMessage?

`string`

Optional custom error message to throw if assertion fails.

## Returns

`asserts value is T[]`

## Example

```typescript
assertIsArray<string>(input, 'Expected an array of strings');
// After this line, TypeScript knows `input` is string[]
```
