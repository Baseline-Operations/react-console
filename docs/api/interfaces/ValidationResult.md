[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / ValidationResult

# Interface: ValidationResult\<T\>

Defined in: [src/utils/validation.ts:24](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/validation.ts#L24)

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

Defined in: [src/utils/validation.ts:25](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/validation.ts#L25)

---

### value

> **value**: `T` \| `null`

Defined in: [src/utils/validation.ts:26](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/validation.ts#L26)

---

### error?

> `optional` **error**: `string`

Defined in: [src/utils/validation.ts:27](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/validation.ts#L27)
