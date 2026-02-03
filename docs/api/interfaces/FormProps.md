[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / FormProps

# Interface: FormProps

Defined in: [src/components/Form.tsx:23](https://github.com/Baseline-Operations/react-console/blob/main/src/components/Form.tsx#L23)

## Extends

- [`StyleProps`](StyleProps.md)

## Properties

### children?

> `optional` **children**: `ReactNode`

Defined in: [src/components/Form.tsx:24](https://github.com/Baseline-Operations/react-console/blob/main/src/components/Form.tsx#L24)

---

### style?

> `optional` **style**: `ViewStyle` \| `ViewStyle`[]

Defined in: [src/components/Form.tsx:25](https://github.com/Baseline-Operations/react-console/blob/main/src/components/Form.tsx#L25)

---

### className?

> `optional` **className**: `string` \| `string`[]

Defined in: [src/components/Form.tsx:26](https://github.com/Baseline-Operations/react-console/blob/main/src/components/Form.tsx#L26)

#### Overrides

[`StyleProps`](StyleProps.md).[`className`](StyleProps.md#classname)

---

### onSubmit()?

> `optional` **onSubmit**: (`values`) => `void` \| `Promise`\<`void`\>

Defined in: [src/components/Form.tsx:27](https://github.com/Baseline-Operations/react-console/blob/main/src/components/Form.tsx#L27)

#### Parameters

##### values

`Record`\<`string`, `unknown`\>

#### Returns

`void` \| `Promise`\<`void`\>

---

### onValidate?

> `optional` **onValidate**: [`FormValidator`](../type-aliases/FormValidator.md)\<`Record`\<`string`, `unknown`\>\>

Defined in: [src/components/Form.tsx:28](https://github.com/Baseline-Operations/react-console/blob/main/src/components/Form.tsx#L28)

---

### initialValues?

> `optional` **initialValues**: `Record`\<`string`, `unknown`\>

Defined in: [src/components/Form.tsx:29](https://github.com/Baseline-Operations/react-console/blob/main/src/components/Form.tsx#L29)

---

### validateOnChange?

> `optional` **validateOnChange**: `boolean`

Defined in: [src/components/Form.tsx:30](https://github.com/Baseline-Operations/react-console/blob/main/src/components/Form.tsx#L30)

---

### validateOnBlur?

> `optional` **validateOnBlur**: `boolean`

Defined in: [src/components/Form.tsx:31](https://github.com/Baseline-Operations/react-console/blob/main/src/components/Form.tsx#L31)

---

### showErrors?

> `optional` **showErrors**: `boolean`

Defined in: [src/components/Form.tsx:32](https://github.com/Baseline-Operations/react-console/blob/main/src/components/Form.tsx#L32)

---

### errorStyle?

> `optional` **errorStyle**: `ViewStyle`

Defined in: [src/components/Form.tsx:33](https://github.com/Baseline-Operations/react-console/blob/main/src/components/Form.tsx#L33)

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
