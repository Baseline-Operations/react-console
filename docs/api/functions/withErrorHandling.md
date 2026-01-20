[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / withErrorHandling

# Function: withErrorHandling()

> **withErrorHandling**\<`T`\>(`fn`, `type`, `context?`, `rethrow?`): `T`

Defined in: src/utils/errors.ts:61

Wrap a function with error handling
Catches errors and reports them, then re-throws if needed

## Type Parameters

### T

`T` *extends* (...`args`) => `unknown`

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
