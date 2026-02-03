[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / InputValidator

# Class: InputValidator

Defined in: [src/utils/inputValidator.ts:51](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/inputValidator.ts#L51)

InputValidator class
Centralized validator with common validation rules and custom validator support

## Constructors

### Constructor

> **new InputValidator**(): `InputValidator`

#### Returns

`InputValidator`

## Methods

### addRule()

> **addRule**(`rule`, `value?`, `message?`): `this`

Defined in: [src/utils/inputValidator.ts:64](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/inputValidator.ts#L64)

Add a validation rule

#### Parameters

##### rule

[`ValidationRule`](../type-aliases/ValidationRule.md)

Validation rule type

##### value?

Optional value for rules that need it (min, max, minLength, maxLength, pattern)

`string` | `number` | `RegExp`

##### message?

`string`

Optional custom error message

#### Returns

`this`

This validator instance for chaining

---

### addCustomValidator()

> **addCustomValidator**(`validator`): `this`

Defined in: [src/utils/inputValidator.ts:74](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/inputValidator.ts#L74)

Add a custom validator function

#### Parameters

##### validator

[`Validator`](../type-aliases/Validator.md)\<`string`\>

Custom validator function

#### Returns

`this`

This validator instance for chaining

---

### setNumberConstraints()

> **setNumberConstraints**(`constraints`): `this`

Defined in: [src/utils/inputValidator.ts:84](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/inputValidator.ts#L84)

Set number validation constraints

#### Parameters

##### constraints

[`NumberConstraints`](../interfaces/NumberConstraints.md)

Number constraints

#### Returns

`this`

This validator instance for chaining

---

### setStringConstraints()

> **setStringConstraints**(`constraints`): `this`

Defined in: [src/utils/inputValidator.ts:94](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/inputValidator.ts#L94)

Set string validation constraints

#### Parameters

##### constraints

[`StringConstraints`](../interfaces/StringConstraints.md)

String constraints

#### Returns

`this`

This validator instance for chaining

---

### validate()

> **validate**(`input`): [`ValidationResult`](../interfaces/ValidationResult.md)\<`string` \| `number`\>

Defined in: [src/utils/inputValidator.ts:104](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/inputValidator.ts#L104)

Validate input string

#### Parameters

##### input

`string`

Input string to validate

#### Returns

[`ValidationResult`](../interfaces/ValidationResult.md)\<`string` \| `number`\>

Validation result

---

### clear()

> **clear**(): `void`

Defined in: [src/utils/inputValidator.ts:378](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/inputValidator.ts#L378)

Clear all validation rules and validators

#### Returns

`void`

---

### createPreset()

> `static` **createPreset**(`preset`): `InputValidator`

Defined in: [src/utils/inputValidator.ts:390](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/inputValidator.ts#L390)

Create a validator from a preset configuration

#### Parameters

##### preset

Preset name

`"number"` | `"email"` | `"url"` | `"phone"` | `"ip"` | `"uuid"`

#### Returns

`InputValidator`

Configured validator
