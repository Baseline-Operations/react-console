[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / ValidationRules

# Variable: ValidationRules

> `const` **ValidationRules**: `object`

Defined in: [src/utils/inputValidator.ts:423](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/inputValidator.ts#L423)

Common validation rules factory

## Type Declaration

### required()

> **required**(`message?`): [`InputValidator`](../classes/InputValidator.md)

Create a required validator

#### Parameters

##### message?

`string`

#### Returns

[`InputValidator`](../classes/InputValidator.md)

### email()

> **email**(`message?`): [`InputValidator`](../classes/InputValidator.md)

Create an email validator

#### Parameters

##### message?

`string`

#### Returns

[`InputValidator`](../classes/InputValidator.md)

### url()

> **url**(`message?`): [`InputValidator`](../classes/InputValidator.md)

Create a URL validator

#### Parameters

##### message?

`string`

#### Returns

[`InputValidator`](../classes/InputValidator.md)

### number()

> **number**(`message?`): [`InputValidator`](../classes/InputValidator.md)

Create a number validator

#### Parameters

##### message?

`string`

#### Returns

[`InputValidator`](../classes/InputValidator.md)

### integer()

> **integer**(`message?`): [`InputValidator`](../classes/InputValidator.md)

Create an integer validator

#### Parameters

##### message?

`string`

#### Returns

[`InputValidator`](../classes/InputValidator.md)

### minLength()

> **minLength**(`min`, `message?`): [`InputValidator`](../classes/InputValidator.md)

Create a min length validator

#### Parameters

##### min

`number`

##### message?

`string`

#### Returns

[`InputValidator`](../classes/InputValidator.md)

### maxLength()

> **maxLength**(`max`, `message?`): [`InputValidator`](../classes/InputValidator.md)

Create a max length validator

#### Parameters

##### max

`number`

##### message?

`string`

#### Returns

[`InputValidator`](../classes/InputValidator.md)

### pattern()

> **pattern**(`pattern`, `message?`): [`InputValidator`](../classes/InputValidator.md)

Create a pattern validator

#### Parameters

##### pattern

`string` | `RegExp`

##### message?

`string`

#### Returns

[`InputValidator`](../classes/InputValidator.md)

### phone()

> **phone**(`message?`): [`InputValidator`](../classes/InputValidator.md)

Create a phone number validator

#### Parameters

##### message?

`string`

#### Returns

[`InputValidator`](../classes/InputValidator.md)

### ip()

> **ip**(`message?`): [`InputValidator`](../classes/InputValidator.md)

Create an IP address validator

#### Parameters

##### message?

`string`

#### Returns

[`InputValidator`](../classes/InputValidator.md)

### uuid()

> **uuid**(`message?`): [`InputValidator`](../classes/InputValidator.md)

Create a UUID validator

#### Parameters

##### message?

`string`

#### Returns

[`InputValidator`](../classes/InputValidator.md)
