[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / ButtonProps

# Interface: ButtonProps

Defined in: src/components/interactive/Button.tsx:32

Props for the Button component

Supports both mouse clicks (if terminal supports it) and keyboard activation
(Enter/Space keys when focused).

## Example

```tsx
<Button onClick={() => console.log('Clicked!')}>
  Click Me
</Button>

<Button
  label="Submit"
  onClick={handleSubmit}
  disabled={!isValid}
  style={{ backgroundColor: 'blue', color: 'white' }}
/>
```

## Extends

- [`StyleProps`](StyleProps.md).[`ComponentEventHandlers`](ComponentEventHandlers.md)

## Properties

### children?

> `optional` **children**: `ReactNode`

Defined in: src/components/interactive/Button.tsx:33

***

### disabled?

> `optional` **disabled**: `boolean`

Defined in: src/components/interactive/Button.tsx:34

***

### label?

> `optional` **label**: `string`

Defined in: src/components/interactive/Button.tsx:35

***

### tabIndex?

> `optional` **tabIndex**: `number`

Defined in: src/components/interactive/Button.tsx:36

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
