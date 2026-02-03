[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / FileErrorHandler

# Class: FileErrorHandler

Defined in: [src/utils/errorHandlers.ts:77](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/errorHandlers.ts#L77)

File error handler
Writes errors to a file (requires fs module)

## Extends

- [`BaseErrorHandler`](BaseErrorHandler.md)

## Constructors

### Constructor

> **new FileErrorHandler**(`filePath`): `FileErrorHandler`

Defined in: [src/utils/errorHandlers.ts:81](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/errorHandlers.ts#L81)

#### Parameters

##### filePath

`string`

#### Returns

`FileErrorHandler`

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

Defined in: [src/utils/errorHandlers.ts:88](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/errorHandlers.ts#L88)

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
