[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / withErrorHandler

# Function: withErrorHandler()

> **withErrorHandler**\<`T`\>(`fn`, `handler`, `type`, `context?`, `rethrow?`): `T`

Defined in: src/utils/errorHandlers.ts:159

Error handler wrapper
Wraps a function with error handling using a class-based handler

## Type Parameters

### T

`T` *extends* (...`args`) => `unknown`

## Parameters

### fn

`T`

### handler

[`BaseErrorHandler`](../classes/BaseErrorHandler.md)

### type

[`ErrorType`](../enumerations/ErrorType.md)

### context?

`Record`\<`string`, `unknown`\>

### rethrow?

`boolean` = `false`

## Returns

`T`
