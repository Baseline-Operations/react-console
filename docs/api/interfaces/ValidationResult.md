[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / ValidationResult

# Interface: ValidationResult\<T\>

Defined in: src/utils/validation.ts:24

Validation result type

Generic type for validation results that preserve type information.
Returns both validation status and typed value (or null if invalid).

## Example

```ts
const result: ValidationResult<number> = validateNumber('123');
// { valid: true, value: 123, error: undefined }
```

## Type Parameters

### T

`T`

Type of validated value (e.g., `number`, `string`)

## Properties

### valid

> **valid**: `boolean`

Defined in: src/utils/validation.ts:25

***

### value

> **value**: `T` \| `null`

Defined in: src/utils/validation.ts:26

***

### error?

> `optional` **error**: `string`

Defined in: src/utils/validation.ts:27
