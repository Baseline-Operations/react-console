[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / ConsoleErrorHandler

# Class: ConsoleErrorHandler

Defined in: [src/utils/errorHandlers.ts:41](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/errorHandlers.ts#L41)

Console error handler
Logs errors to console with formatting

## Extends

- [`BaseErrorHandler`](BaseErrorHandler.md)

## Constructors

### Constructor

> **new ConsoleErrorHandler**(`options`): `ConsoleErrorHandler`

Defined in: [src/utils/errorHandlers.ts:45](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/errorHandlers.ts#L45)

#### Parameters

##### options

###### includeStack?

`boolean`

###### includeContext?

`boolean`

#### Returns

`ConsoleErrorHandler`

#### Overrides

[`BaseErrorHandler`](BaseErrorHandler.md).[`constructor`](BaseErrorHandler.md#constructor)

## Methods

### setContext()

> **setContext**(`context`): `this`

Defined in: [src/utils/errorHandlers.ts:23](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/errorHandlers.ts#L23)

Set handler context

#### Parameters

##### context

`Record`\<`string`, `unknown`\>

#### Returns

`this`

#### Inherited from

[`BaseErrorHandler`](BaseErrorHandler.md).[`setContext`](BaseErrorHandler.md#setcontext)

---

### clearContext()

> **clearContext**(): `this`

Defined in: [src/utils/errorHandlers.ts:31](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/errorHandlers.ts#L31)

Clear handler context

#### Returns

`this`

#### Inherited from

[`BaseErrorHandler`](BaseErrorHandler.md).[`clearContext`](BaseErrorHandler.md#clearcontext)

---

### handle()

> **handle**(`error`, `type`, `context?`): `void`

Defined in: [src/utils/errorHandlers.ts:51](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/errorHandlers.ts#L51)

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
