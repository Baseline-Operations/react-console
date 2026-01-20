[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / PressableProps

# Interface: PressableProps

Defined in: src/components/interactive/Pressable.tsx:23

Props for the Pressable component

Provides pressable wrapper for any content. Supports keyboard (Enter/Space)
and mouse clicks (if terminal supports it). Similar to Button but can wrap any content.

## Example

```tsx
<Pressable onClick={() => handlePress()}>
  <Text>Press me!</Text>
</Pressable>
```

## Extends

- [`StyleProps`](StyleProps.md).[`LayoutProps`](LayoutProps.md).[`ComponentEventHandlers`](ComponentEventHandlers.md)

## Properties

### children?

> `optional` **children**: `ReactNode`

Defined in: src/components/interactive/Pressable.tsx:24

***

### disabled?

> `optional` **disabled**: `boolean`

Defined in: src/components/interactive/Pressable.tsx:25

***

### tabIndex?

> `optional` **tabIndex**: `number`

Defined in: src/components/interactive/Pressable.tsx:26

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

### padding?

> `optional` **padding**: `number` \| \{ `top?`: `number`; `right?`: `number`; `bottom?`: `number`; `left?`: `number`; \}

Defined in: src/types/index.ts:142

#### Inherited from

[`LayoutProps`](LayoutProps.md).[`padding`](LayoutProps.md#padding)

***

### margin?

> `optional` **margin**: `number` \| \{ `top?`: `number`; `right?`: `number`; `bottom?`: `number`; `left?`: `number`; \}

Defined in: src/types/index.ts:143

#### Inherited from

[`LayoutProps`](LayoutProps.md).[`margin`](LayoutProps.md#margin)

***

### width?

> `optional` **width**: [`ResponsiveSize`](../type-aliases/ResponsiveSize.md)

Defined in: src/types/index.ts:144

#### Inherited from

[`LayoutProps`](LayoutProps.md).[`width`](LayoutProps.md#width)

***

### height?

> `optional` **height**: [`ResponsiveSize`](../type-aliases/ResponsiveSize.md)

Defined in: src/types/index.ts:145

#### Inherited from

[`LayoutProps`](LayoutProps.md).[`height`](LayoutProps.md#height)

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
