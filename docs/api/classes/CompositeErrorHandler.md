[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / CompositeErrorHandler

# Class: CompositeErrorHandler

Defined in: src/utils/errorHandlers.ts:115

Composite error handler
Combines multiple error handlers

## Extends

- [`BaseErrorHandler`](BaseErrorHandler.md)

## Constructors

### Constructor

> **new CompositeErrorHandler**(`handlers`): `CompositeErrorHandler`

Defined in: src/utils/errorHandlers.ts:118

#### Parameters

##### handlers

[`BaseErrorHandler`](BaseErrorHandler.md)[]

#### Returns

`CompositeErrorHandler`

#### Overrides

[`BaseErrorHandler`](BaseErrorHandler.md).[`constructor`](BaseErrorHandler.md#constructor)

## Methods

### setContext()

> **setContext**(`context`): `this`

Defined in: src/utils/errorHandlers.ts:23

Set handler context

#### Parameters

##### context

`Record`\<`string`, `unknown`\>

#### Returns

`this`

#### Inherited from

[`BaseErrorHandler`](BaseErrorHandler.md).[`setContext`](BaseErrorHandler.md#setcontext)

***

### clearContext()

> **clearContext**(): `this`

Defined in: src/utils/errorHandlers.ts:31

Clear handler context

#### Returns

`this`

#### Inherited from

[`BaseErrorHandler`](BaseErrorHandler.md).[`clearContext`](BaseErrorHandler.md#clearcontext)

***

### handle()

> **handle**(`error`, `type`, `context?`): `void`

Defined in: src/utils/errorHandlers.ts:123

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

#### Overrides

[`BaseErrorHandler`](BaseErrorHandler.md).[`handle`](BaseErrorHandler.md#handle)

***

### addHandler()

> **addHandler**(`handler`): `this`

Defined in: src/utils/errorHandlers.ts:138

Add a handler

#### Parameters

##### handler

[`BaseErrorHandler`](BaseErrorHandler.md)

#### Returns

`this`

***

### removeHandler()

> **removeHandler**(`handler`): `this`

Defined in: src/utils/errorHandlers.ts:146

Remove a handler

#### Parameters

##### handler

[`BaseErrorHandler`](BaseErrorHandler.md)

#### Returns

`this`
