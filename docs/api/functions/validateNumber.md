[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / validateNumber

# Function: validateNumber()

> **validateNumber**(`input`, `constraints?`): [`ValidationResult`](../interfaces/ValidationResult.md)\<`number`\>

Defined in: src/utils/validation.ts:94

Generic number validator

Validates and parses number input with optional constraints (min, max, step, decimals).
Returns typed validation result with parsed number or validation error.

## Parameters

### input

`string`

Input string to validate and parse

### constraints?

[`NumberConstraints`](../interfaces/NumberConstraints.md)

Optional number validation constraints

## Returns

[`ValidationResult`](../interfaces/ValidationResult.md)\<`number`\>

Validation result with valid flag, parsed number, and error message (if invalid)

## Example

```ts
// Basic validation
const result = validateNumber('123.45');
// { valid: true, value: 123.45 }

// With constraints
const result2 = validateNumber('123.45', {
  min: 0,
  max: 1000,
  step: 0.1,
  decimalPlaces: 2,
});
// { valid: true, value: 123.45 }

// Invalid input
const result3 = validateNumber('abc');
// { valid: false, value: null, error: 'Invalid number format' }
```
