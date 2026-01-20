[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / InputProps

# Interface: InputProps

Defined in: src/components/interactive/Input.tsx:68

Props for the Input component

Supports multiple input types (text, number) with validation, formatting, and multiline support.
All event handlers use JSX-style event objects similar to React Native.

## Example

```tsx
// Text input
<Input
  value={name}
  onChange={(e) => setName(e.value)}
  placeholder="Enter your name"
  maxLength={50}
/>

// Number input with validation
<Input
  type="number"
  value={age}
  onChange={(e) => setAge(e.value)}
  min={18}
  max={120}
  step={1}
  allowDecimals={false}
/>

// Currency input with formatting
<Input
  type="number"
  value={price}
  onChange={(e) => setPrice(e.value)}
  formatDisplay={(v) => `$${v.toFixed(2)}`}
  decimalPlaces={2}
/>

// Multiline input
<Input
  multiline
  maxLines={5}
  value={description}
  onChange={(e) => setDescription(e.value)}
/>
```

## Extends

- [`ComponentEventHandlers`](ComponentEventHandlers.md).[`StyleProps`](StyleProps.md)

## Properties

### type?

> `optional` **type**: `InputType`

Defined in: src/components/interactive/Input.tsx:69

***

### value?

> `optional` **value**: `string` \| `number`

Defined in: src/components/interactive/Input.tsx:70

***

### defaultValue?

> `optional` **defaultValue**: `string` \| `number`

Defined in: src/components/interactive/Input.tsx:71

***

### placeholder?

> `optional` **placeholder**: `string`

Defined in: src/components/interactive/Input.tsx:72

***

### disabled?

> `optional` **disabled**: `boolean`

Defined in: src/components/interactive/Input.tsx:73

***

### mask?

> `optional` **mask**: `string`

Defined in: src/components/interactive/Input.tsx:74

***

### maxLength?

> `optional` **maxLength**: `number`

Defined in: src/components/interactive/Input.tsx:75

***

### maxWidth?

> `optional` **maxWidth**: `number`

Defined in: src/components/interactive/Input.tsx:76

***

### multiline?

> `optional` **multiline**: `boolean`

Defined in: src/components/interactive/Input.tsx:77

***

### maxLines?

> `optional` **maxLines**: `number`

Defined in: src/components/interactive/Input.tsx:78

***

### autoFocus?

> `optional` **autoFocus**: `boolean`

Defined in: src/components/interactive/Input.tsx:79

***

### tabIndex?

> `optional` **tabIndex**: `number`

Defined in: src/components/interactive/Input.tsx:80

***

### step?

> `optional` **step**: `number`

Defined in: src/components/interactive/Input.tsx:82

***

### min?

> `optional` **min**: `number`

Defined in: src/components/interactive/Input.tsx:83

***

### max?

> `optional` **max**: `number`

Defined in: src/components/interactive/Input.tsx:84

***

### allowDecimals?

> `optional` **allowDecimals**: `boolean`

Defined in: src/components/interactive/Input.tsx:85

***

### decimalPlaces?

> `optional` **decimalPlaces**: `number`

Defined in: src/components/interactive/Input.tsx:86

***

### formatDisplay()?

> `optional` **formatDisplay**: (`value`) => `string`

Defined in: src/components/interactive/Input.tsx:88

#### Parameters

##### value

`string` | `number`

#### Returns

`string`

***

### formatValue()?

> `optional` **formatValue**: (`value`) => `string` \| `number`

Defined in: src/components/interactive/Input.tsx:89

#### Parameters

##### value

`string` | `number`

#### Returns

`string` \| `number`

***

### pattern?

> `optional` **pattern**: `string` \| `RegExp`

Defined in: src/components/interactive/Input.tsx:91

***

### displayFormat?

> `optional` **displayFormat**: `string`

Defined in: src/components/interactive/Input.tsx:93

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
