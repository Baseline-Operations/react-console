[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / CheckboxProps

# Interface: CheckboxProps

Defined in: src/components/selection/Checkbox.tsx:35

Props for the Checkbox component

Provides multiple-selection checkbox group functionality.
Supports keyboard navigation (arrow keys) and toggling (Enter/Space).

## Example

```tsx
const [values, setValues] = useState<string[]>([]);

<Checkbox
  value={values}
  onChange={(e) => setValues(e.value as string[])}
  options={[
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
  ]}
/>
```

## Extends

- [`ComponentEventHandlers`](ComponentEventHandlers.md).[`StyleProps`](StyleProps.md)

## Properties

### value?

> `optional` **value**: `string`[] \| `number`[]

Defined in: src/components/selection/Checkbox.tsx:36

***

### defaultValue?

> `optional` **defaultValue**: `string`[] \| `number`[]

Defined in: src/components/selection/Checkbox.tsx:37

***

### options

> **options**: [`SelectOption`](SelectOption.md)[]

Defined in: src/components/selection/Checkbox.tsx:38

***

### disabled?

> `optional` **disabled**: `boolean`

Defined in: src/components/selection/Checkbox.tsx:39

***

### autoFocus?

> `optional` **autoFocus**: `boolean`

Defined in: src/components/selection/Checkbox.tsx:40

***

### tabIndex?

> `optional` **tabIndex**: `number`

Defined in: src/components/selection/Checkbox.tsx:41

***

### formatDisplay()?

> `optional` **formatDisplay**: (`option`, `selected`) => `string`

Defined in: src/components/selection/Checkbox.tsx:42

#### Parameters

##### option

[`SelectOption`](SelectOption.md)

##### selected

`boolean`

#### Returns

`string`

***

### displayFormat?

> `optional` **displayFormat**: `string`

Defined in: src/components/selection/Checkbox.tsx:44

***

### color?

> `optional` **color**: `string`

Defined in: src/types/index.ts:29

#### Inherited from

[`StyleProps`](StyleProps.md).[`color`](StyleProps.md#color)

***

### backgroundColor?

> `optional` **backgroundColor**: `string`

Defined in: src/types/index.ts:30

#### Inherited from

[`StyleProps`](StyleProps.md).[`backgroundColor`](StyleProps.md#backgroundcolor)

***

### bold?

> `optional` **bold**: `boolean`

Defined in: src/types/index.ts:31

#### Inherited from

[`StyleProps`](StyleProps.md).[`bold`](StyleProps.md#bold)

***

### dim?

> `optional` **dim**: `boolean`

Defined in: src/types/index.ts:32

#### Inherited from

[`StyleProps`](StyleProps.md).[`dim`](StyleProps.md#dim)

***

### italic?

> `optional` **italic**: `boolean`

Defined in: src/types/index.ts:33

#### Inherited from

[`StyleProps`](StyleProps.md).[`italic`](StyleProps.md#italic)

***

### underline?

> `optional` **underline**: `boolean`

Defined in: src/types/index.ts:34

#### Inherited from

[`StyleProps`](StyleProps.md).[`underline`](StyleProps.md#underline)

***

### strikethrough?

> `optional` **strikethrough**: `boolean`

Defined in: src/types/index.ts:35

#### Inherited from

[`StyleProps`](StyleProps.md).[`strikethrough`](StyleProps.md#strikethrough)

***

### inverse?

> `optional` **inverse**: `boolean`

Defined in: src/types/index.ts:36

#### Inherited from

[`StyleProps`](StyleProps.md).[`inverse`](StyleProps.md#inverse)

***

### onClick()?

> `optional` **onClick**: (`event`) => `void`

Defined in: src/types/index.ts:318

#### Parameters

##### event

[`MouseEvent`](MouseEvent.md)

#### Returns

`void`

#### Inherited from

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`onClick`](ComponentEventHandlers.md#onclick)

***

### onPress()?

> `optional` **onPress**: (`event`) => `void`

Defined in: src/types/index.ts:319

#### Parameters

##### event

[`MouseEvent`](MouseEvent.md)

#### Returns

`void`

#### Inherited from

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`onPress`](ComponentEventHandlers.md#onpress)

***

### onMouseDown()?

> `optional` **onMouseDown**: (`event`) => `void`

Defined in: src/types/index.ts:320

#### Parameters

##### event

[`MouseEvent`](MouseEvent.md)

#### Returns

`void`

#### Inherited from

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`onMouseDown`](ComponentEventHandlers.md#onmousedown)

***

### onMouseUp()?

> `optional` **onMouseUp**: (`event`) => `void`

Defined in: src/types/index.ts:321

#### Parameters

##### event

[`MouseEvent`](MouseEvent.md)

#### Returns

`void`

#### Inherited from

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`onMouseUp`](ComponentEventHandlers.md#onmouseup)

***

### onMouseMove()?

> `optional` **onMouseMove**: (`event`) => `void`

Defined in: src/types/index.ts:322

#### Parameters

##### event

[`MouseEvent`](MouseEvent.md)

#### Returns

`void`

#### Inherited from

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`onMouseMove`](ComponentEventHandlers.md#onmousemove)

***

### onMouseDrag()?

> `optional` **onMouseDrag**: (`event`) => `void`

Defined in: src/types/index.ts:323

#### Parameters

##### event

[`MouseEvent`](MouseEvent.md)

#### Returns

`void`

#### Inherited from

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`onMouseDrag`](ComponentEventHandlers.md#onmousedrag)

***

### onKeyDown()?

> `optional` **onKeyDown**: (`event`) => `void`

Defined in: src/types/index.ts:324

#### Parameters

##### event

[`KeyboardEvent`](KeyboardEvent.md)

#### Returns

`void`

#### Inherited from

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`onKeyDown`](ComponentEventHandlers.md#onkeydown)

***

### onKeyUp()?

> `optional` **onKeyUp**: (`event`) => `void`

Defined in: src/types/index.ts:325

#### Parameters

##### event

[`KeyboardEvent`](KeyboardEvent.md)

#### Returns

`void`

#### Inherited from

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`onKeyUp`](ComponentEventHandlers.md#onkeyup)

***

### onKeyPress()?

> `optional` **onKeyPress**: (`event`) => `void`

Defined in: src/types/index.ts:326

#### Parameters

##### event

[`KeyboardEvent`](KeyboardEvent.md)

#### Returns

`void`

#### Inherited from

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`onKeyPress`](ComponentEventHandlers.md#onkeypress)

***

### onChange()?

> `optional` **onChange**: (`event`) => `void`

Defined in: src/types/index.ts:327

#### Parameters

##### event

[`InputEvent`](InputEvent.md)

#### Returns

`void`

#### Inherited from

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`onChange`](ComponentEventHandlers.md#onchange)

***

### onSubmit()?

> `optional` **onSubmit**: (`event`) => `void`

Defined in: src/types/index.ts:328

#### Parameters

##### event

[`InputEvent`](InputEvent.md)

#### Returns

`void`

#### Inherited from

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`onSubmit`](ComponentEventHandlers.md#onsubmit)

***

### onFocus()?

> `optional` **onFocus**: () => `void`

Defined in: src/types/index.ts:329

#### Returns

`void`

#### Inherited from

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`onFocus`](ComponentEventHandlers.md#onfocus)

***

### onBlur()?

> `optional` **onBlur**: () => `void`

Defined in: src/types/index.ts:330

#### Returns

`void`

#### Inherited from

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`onBlur`](ComponentEventHandlers.md#onblur)
