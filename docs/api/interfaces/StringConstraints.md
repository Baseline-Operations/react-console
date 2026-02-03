[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / StringConstraints

# Interface: StringConstraints

Defined in: [src/utils/validation.ts:173](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/validation.ts#L173)

Generic string validator

Validates string input with optional constraints (minLength, maxLength, pattern).
Returns typed validation result with validated string or validation error.

Constraints:

- `minLength`/`maxLength`: String length constraints
- `pattern`: Regex pattern to match

## Param

Input string to validate

## Param

Optional string validation constraints

## Example

```ts
// Basic validation
const result = validateString('hello');
// { valid: true, value: 'hello' }

// With constraints
const result2 = validateString('hello@example.com', {
  minLength: 5,
  maxLength: 50,
  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
});
// { valid: true, value: 'hello@example.com' }
```

## Properties

### minLength?

> `optional` **minLength**: `number`

Defined in: [src/utils/validation.ts:174](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/validation.ts#L174)

---

### maxLength?

> `optional` **maxLength**: `number`

Defined in: [src/utils/validation.ts:175](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/validation.ts#L175)

---

### pattern?

> `optional` **pattern**: `string` \| `RegExp`

Defined in: [src/utils/validation.ts:176](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/validation.ts#L176)
