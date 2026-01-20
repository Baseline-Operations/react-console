[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / BaseErrorHandler

# Abstract Class: BaseErrorHandler

Defined in: src/utils/errorHandlers.ts:12

Base error handler class
Provides common error handling functionality

## Extended by

- [`ConsoleErrorHandler`](ConsoleErrorHandler.md)
- [`SilentErrorHandler`](SilentErrorHandler.md)
- [`FileErrorHandler`](FileErrorHandler.md)
- [`CompositeErrorHandler`](CompositeErrorHandler.md)

## Constructors

### Constructor

> **new BaseErrorHandler**(): `BaseErrorHandler`

#### Returns

`BaseErrorHandler`

## Methods

### handle()

> `abstract` **handle**(`error`, `type`, `context?`): `void`

Defined in: src/utils/errorHandlers.ts:18

Handle an error

#### Parameters

##### error

`Error`

##### type

[`ErrorType`](../enumerations/ErrorType.md)

##### context?

`Record`\<`string`, `unknown`\>

#### Returns

`void`

***

### setContext()

> **setContext**(`context`): `this`

Defined in: src/utils/errorHandlers.ts:23

Set handler context

#### Parameters

##### context

`Record`\<`string`, `unknown`\>

#### Returns

`this`

***

### clearContext()

> **clearContext**(): `this`

Defined in: src/utils/errorHandlers.ts:31

Clear handler context

#### Returns

`this`
