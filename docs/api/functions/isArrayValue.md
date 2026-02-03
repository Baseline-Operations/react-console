[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / isArrayValue

# Function: isArrayValue()

> **isArrayValue**(`value`): value is string\[\] \| number\[\]

Defined in: [src/types/guards.ts:25](https://github.com/Baseline-Operations/react-console/blob/main/src/types/guards.ts#L25)

Type guard: Check if value is a homogeneous array (string[] or number[])

Returns `true` if the value is an array containing only strings OR only numbers (not mixed).

## Parameters

### value

`unknown`

The value to check.

## Returns

value is string\[\] \| number\[\]

`true` if value is a homogeneous string or number array, `false` otherwise.

## Examples

Returns `true` for:

- `['a', 'b', 'c']` (string array)
- `[1, 2, 3]` (number array)

Returns `false` for:

- `['a', 1]` (mixed array)
- `'hello'` (string)
- `{ key: 'value' }` (object)
- `null`
