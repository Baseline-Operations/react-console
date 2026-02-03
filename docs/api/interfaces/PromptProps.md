[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / PromptProps

# Interface: PromptProps

Defined in: [src/components/interactive/Prompt.tsx:9](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Prompt.tsx#L9)

## Extends

- [`StyleProps`](StyleProps.md)

## Properties

### question

> **question**: `string`

Defined in: [src/components/interactive/Prompt.tsx:11](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Prompt.tsx#L11)

Question text to display

---

### defaultValue?

> `optional` **defaultValue**: `string`

Defined in: [src/components/interactive/Prompt.tsx:13](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Prompt.tsx#L13)

Default value for the input

---

### placeholder?

> `optional` **placeholder**: `string`

Defined in: [src/components/interactive/Prompt.tsx:15](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Prompt.tsx#L15)

Placeholder text

---

### validate()?

> `optional` **validate**: (`value`) => `string` \| `undefined`

Defined in: [src/components/interactive/Prompt.tsx:17](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Prompt.tsx#L17)

Validation function - returns error message if invalid, undefined if valid

#### Parameters

##### value

`string`

#### Returns

`string` \| `undefined`

---

### onSubmit()?

> `optional` **onSubmit**: (`value`) => `void`

Defined in: [src/components/interactive/Prompt.tsx:19](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Prompt.tsx#L19)

Callback when prompt is submitted (Enter key)

#### Parameters

##### value

`string`

#### Returns

`void`

---

### onCancel()?

> `optional` **onCancel**: () => `void`

Defined in: [src/components/interactive/Prompt.tsx:21](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Prompt.tsx#L21)

Callback when prompt is cancelled (Escape key)

#### Returns

`void`

---

### required?

> `optional` **required**: `boolean`

Defined in: [src/components/interactive/Prompt.tsx:23](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Prompt.tsx#L23)

Whether the prompt is required (non-empty)

---

### type?

> `optional` **type**: `"number"` \| `"text"` \| `"password"` \| `"email"`

Defined in: [src/components/interactive/Prompt.tsx:25](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Prompt.tsx#L25)

Input type (text, password, number, etc.)

---

### mask?

> `optional` **mask**: `string`

Defined in: [src/components/interactive/Prompt.tsx:27](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Prompt.tsx#L27)

Mask character for password inputs

---

### maxLength?

> `optional` **maxLength**: `number`

Defined in: [src/components/interactive/Prompt.tsx:29](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Prompt.tsx#L29)

Maximum length

---

### style?

> `optional` **style**: `ViewStyle`

Defined in: [src/components/interactive/Prompt.tsx:31](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Prompt.tsx#L31)

Custom styling

---

### questionStyle?

> `optional` **questionStyle**: `TextStyle`

Defined in: [src/components/interactive/Prompt.tsx:33](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Prompt.tsx#L33)

Question text styling

---

### inputStyle?

> `optional` **inputStyle**: `ViewStyle`

Defined in: [src/components/interactive/Prompt.tsx:35](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Prompt.tsx#L35)

Input styling

---

### errorStyle?

> `optional` **errorStyle**: `TextStyle`

Defined in: [src/components/interactive/Prompt.tsx:37](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Prompt.tsx#L37)

Error message styling

---

### showErrors?

> `optional` **showErrors**: `boolean`

Defined in: [src/components/interactive/Prompt.tsx:39](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Prompt.tsx#L39)

Show validation errors

---

### color?

> `optional` **color**: `string`

Defined in: [src/types/styles.ts:9](https://github.com/Baseline-Operations/react-console/blob/main/src/types/styles.ts#L9)

#### Inherited from

[`StyleProps`](StyleProps.md).[`color`](StyleProps.md#color)

---

### backgroundColor?

> `optional` **backgroundColor**: `string`

Defined in: [src/types/styles.ts:10](https://github.com/Baseline-Operations/react-console/blob/main/src/types/styles.ts#L10)

#### Inherited from

[`StyleProps`](StyleProps.md).[`backgroundColor`](StyleProps.md#backgroundcolor)

---

### bold?

> `optional` **bold**: `boolean`

Defined in: [src/types/styles.ts:11](https://github.com/Baseline-Operations/react-console/blob/main/src/types/styles.ts#L11)

#### Inherited from

[`StyleProps`](StyleProps.md).[`bold`](StyleProps.md#bold)

---

### dim?

> `optional` **dim**: `boolean`

Defined in: [src/types/styles.ts:12](https://github.com/Baseline-Operations/react-console/blob/main/src/types/styles.ts#L12)

#### Inherited from

[`StyleProps`](StyleProps.md).[`dim`](StyleProps.md#dim)

---

### italic?

> `optional` **italic**: `boolean`

Defined in: [src/types/styles.ts:13](https://github.com/Baseline-Operations/react-console/blob/main/src/types/styles.ts#L13)

#### Inherited from

[`StyleProps`](StyleProps.md).[`italic`](StyleProps.md#italic)

---

### underline?

> `optional` **underline**: `boolean`

Defined in: [src/types/styles.ts:14](https://github.com/Baseline-Operations/react-console/blob/main/src/types/styles.ts#L14)

#### Inherited from

[`StyleProps`](StyleProps.md).[`underline`](StyleProps.md#underline)

---

### strikethrough?

> `optional` **strikethrough**: `boolean`

Defined in: [src/types/styles.ts:15](https://github.com/Baseline-Operations/react-console/blob/main/src/types/styles.ts#L15)

#### Inherited from

[`StyleProps`](StyleProps.md).[`strikethrough`](StyleProps.md#strikethrough)

---

### inverse?

> `optional` **inverse**: `boolean`

Defined in: [src/types/styles.ts:16](https://github.com/Baseline-Operations/react-console/blob/main/src/types/styles.ts#L16)

#### Inherited from

[`StyleProps`](StyleProps.md).[`inverse`](StyleProps.md#inverse)

---

### className?

> `optional` **className**: `string` \| `string`[]

Defined in: [src/types/styles.ts:17](https://github.com/Baseline-Operations/react-console/blob/main/src/types/styles.ts#L17)

#### Inherited from

[`StyleProps`](StyleProps.md).[`className`](StyleProps.md#classname)

---

### fontWeight?

> `optional` **fontWeight**: `number` \| `"bold"` \| `"normal"`

Defined in: [src/types/styles.ts:20](https://github.com/Baseline-Operations/react-console/blob/main/src/types/styles.ts#L20)

#### Inherited from

[`StyleProps`](StyleProps.md).[`fontWeight`](StyleProps.md#fontweight)

---

### fontStyle?

> `optional` **fontStyle**: `"italic"` \| `"normal"`

Defined in: [src/types/styles.ts:21](https://github.com/Baseline-Operations/react-console/blob/main/src/types/styles.ts#L21)

#### Inherited from

[`StyleProps`](StyleProps.md).[`fontStyle`](StyleProps.md#fontstyle)
