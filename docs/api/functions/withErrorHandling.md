[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / withErrorHandling

# Function: withErrorHandling()

> **withErrorHandling**\<`T`\>(`fn`, `type`, `context?`, `rethrow?`): `T`

Defined in: [src/utils/errors.ts:143](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/errors.ts#L143)

Wrap a function with error handling
Catches errors and reports them, then re-throws if needed

## Type Parameters

### T

`T` _extends_ (...`args`) => `unknown`

## Parameters

### fn

`T`

### type

[`ErrorType`](../enumerations/ErrorType.md)

### context?

`Record`\<`string`, `unknown`\>

### rethrow?

`boolean` = `false`

## Returns

`T`
