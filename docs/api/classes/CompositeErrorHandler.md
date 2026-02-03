[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / CompositeErrorHandler

# Class: CompositeErrorHandler

Defined in: [src/utils/errorHandlers.ts:114](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/errorHandlers.ts#L114)

Composite error handler
Combines multiple error handlers

## Extends

- [`BaseErrorHandler`](BaseErrorHandler.md)

## Constructors

### Constructor

> **new CompositeErrorHandler**(`handlers`): `CompositeErrorHandler`

Defined in: [src/utils/errorHandlers.ts:117](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/errorHandlers.ts#L117)

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

Defined in: [src/utils/errorHandlers.ts:122](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/errorHandlers.ts#L122)

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

---

### addHandler()

> **addHandler**(`handler`): `this`

Defined in: [src/utils/errorHandlers.ts:137](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/errorHandlers.ts#L137)

Add a handler

#### Parameters

##### handler

[`BaseErrorHandler`](BaseErrorHandler.md)

#### Returns

`this`

---

### removeHandler()

> **removeHandler**(`handler`): `this`

Defined in: [src/utils/errorHandlers.ts:145](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/errorHandlers.ts#L145)

Remove a handler

#### Parameters

##### handler

[`BaseErrorHandler`](BaseErrorHandler.md)

#### Returns

`this`
