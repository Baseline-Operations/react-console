[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / assertIsType

# Function: assertIsType()

> **assertIsType**\<`T`\>(`value`, `guard`, `errorMessage?`): `asserts value is T`

Defined in: [src/types/guards.ts:261](https://github.com/Baseline-Operations/react-console/blob/main/src/types/guards.ts#L261)

Type assertion helper: Assert value is a specific type

Throws an error if the guard function returns `false`, otherwise narrows the type of `value` to `T`.

## Type Parameters

### T

`T`

The target type to assert.

## Parameters

### value

`unknown`

The value to assert.

### guard

(`val`) => `val is T`

A type guard function that returns `true` if the value is of type `T`.

### errorMessage?

`string`

Optional custom error message to throw if assertion fails.

## Returns

`asserts value is T`

## Example

```typescript
assertIsType<number>(input, (v): v is number => typeof v === 'number', 'Expected a number');
// After this line, TypeScript knows `input` is a number
```
