[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / Validator

# Type Alias: Validator()\<T\>

> **Validator**\<`T`\> = (`input`) => [`ValidationResult`](../interfaces/ValidationResult.md)\<`T`\>

Defined in: [src/utils/validation.ts:45](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/validation.ts#L45)

Validator function type

Generic validator function that takes input string and returns typed validation result.
All validators follow this signature for composability.

## Type Parameters

### T

`T`

Type of validated value (e.g., `number`, `string`)

## Parameters

### input

`string`

Input string to validate

## Returns

[`ValidationResult`](../interfaces/ValidationResult.md)\<`T`\>

Validation result with valid flag and typed value

## Example

```ts
const validator: Validator<number> = (input) => validateNumber(input, { min: 0 });
```
