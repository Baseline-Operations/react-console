[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / RadioProps

# Interface: RadioProps

Defined in: src/components/selection/Radio.tsx:35

Props for the Radio component

Provides single-selection radio button group functionality.
Supports keyboard navigation (arrow keys) and selection (Enter/Space).

## Example

```tsx
const [value, setValue] = useState('option1');

<Radio
  name="choice"
  value={value}
  onChange={(e) => setValue(e.value)}
  options={[
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
  ]}
/>
```

## Extends

- [`ComponentEventHandlers`](ComponentEventHandlers.md).[`StyleProps`](StyleProps.md)

## Properties

### name?

> `optional` **name**: `string`

Defined in: src/components/selection/Radio.tsx:36

***

### value?

> `optional` **value**: `string` \| `number`

Defined in: src/components/selection/Radio.tsx:37

***

### defaultValue?

> `optional` **defaultValue**: `string` \| `number`

Defined in: src/components/selection/Radio.tsx:38

***

### options

> **options**: [`SelectOption`](SelectOption.md)[]

Defined in: src/components/selection/Radio.tsx:39

***

### disabled?

> `optional` **disabled**: `boolean`

Defined in: src/components/selection/Radio.tsx:40

***

### autoFocus?

> `optional` **autoFocus**: `boolean`

Defined in: src/components/selection/Radio.tsx:41

***

### tabIndex?

> `optional` **tabIndex**: `number`

Defined in: src/components/selection/Radio.tsx:42

***

### formatDisplay()?

> `optional` **formatDisplay**: (`option`, `selected`) => `string`

Defined in: src/components/selection/Radio.tsx:43

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

Defined in: src/components/selection/Radio.tsx:45

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
