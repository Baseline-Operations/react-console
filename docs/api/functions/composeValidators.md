[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / composeValidators

# Function: composeValidators()

> **composeValidators**\<`T`\>(...`validators`): [`Validator`](../type-aliases/Validator.md)\<`T`\>

Defined in: src/utils/validation.ts:243

Compose multiple validators

Combines multiple validators into a single validator that runs them in sequence.
Returns the first failure result or the last success result if all validators pass.
Useful for chaining validation rules (e.g., format check, then range check).

## Type Parameters

### T

`T`

Type of validated value

## Parameters

### validators

...[`Validator`](../type-aliases/Validator.md)\<`T`\>[]

Array of validators to compose

## Returns

[`Validator`](../type-aliases/Validator.md)\<`T`\>

Composed validator function

## Example

```ts
const validator = composeValidators<number>(
  (input) => validateNumber(input, { min: 0 }),
  (input) => validateNumber(input, { max: 100 }),
);

const result = validator('50');
// Runs both validators, returns result from last validator if all pass
```
