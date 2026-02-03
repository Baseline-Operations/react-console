[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / SilentErrorHandler

# Class: SilentErrorHandler

Defined in: [src/utils/errorHandlers.ts:67](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/errorHandlers.ts#L67)

Silent error handler
Suppresses error output (useful for testing)

## Extends

- [`BaseErrorHandler`](BaseErrorHandler.md)

## Constructors

### Constructor

> **new SilentErrorHandler**(): `SilentErrorHandler`

#### Returns

`SilentErrorHandler`

#### Inherited from

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

> **handle**(`_error`, `_type`, `_context?`): `void`

Defined in: [src/utils/errorHandlers.ts:68](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/errorHandlers.ts#L68)

Handle an error

#### Parameters

##### \_error

`Error`

##### \_type

[`ErrorType`](../enumerations/ErrorType.md)

##### \_context?

`Record`\<`string`, `unknown`\>

#### Returns

`void`

#### Overrides

[`BaseErrorHandler`](BaseErrorHandler.md).[`handle`](BaseErrorHandler.md#handle)
