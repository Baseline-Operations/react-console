[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / createErrorHandlerWrapper

# Function: createErrorHandlerWrapper()

> **createErrorHandlerWrapper**(`handler`, `defaultType`): \<`T`\>(`fn`, `type`, `context?`, `rethrow`) => `T`

Defined in: src/utils/errorHandlers.ts:184

Create a function wrapper with class-based error handling
Similar to withErrorHandling but uses class-based handlers

## Parameters

### handler

[`BaseErrorHandler`](../classes/BaseErrorHandler.md)

### defaultType

[`ErrorType`](../enumerations/ErrorType.md) = `ErrorType.UNKNOWN`

## Returns

> \<`T`\>(`fn`, `type`, `context?`, `rethrow?`): `T`

### Type Parameters

#### T

`T` *extends* (...`args`) => `unknown`

### Parameters

#### fn

`T`

#### type

[`ErrorType`](../enumerations/ErrorType.md) = `defaultType`

#### context?

`Record`\<`string`, `unknown`\>

#### rethrow?

`boolean` = `false`

### Returns

`T`
