[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / ComponentEventHandlers

# Interface: ComponentEventHandlers

Defined in: [src/types/events.ts:109](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L109)

Component event handlers (JSX-style)

## Extended by

- [`ButtonProps`](ButtonProps.md)
- [`FocusableProps`](FocusableProps.md)
- [`RadioProps`](RadioProps.md)
- [`CheckboxProps`](CheckboxProps.md)
- [`DropdownProps`](DropdownProps.md)
- [`ListProps`](ListProps.md)
- [`TableProps`](TableProps.md)

## Properties

### onClick()?

> `optional` **onClick**: (`event`) => `void`

Defined in: [src/types/events.ts:111](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L111)

#### Parameters

##### event

[`MouseEvent`](MouseEvent.md)

#### Returns

`void`

---

### onPress()?

> `optional` **onPress**: (`event`) => `void`

Defined in: [src/types/events.ts:112](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L112)

#### Parameters

##### event

`GestureResponderEvent`

#### Returns

`void`

---

### onMouseDown()?

> `optional` **onMouseDown**: (`event`) => `void`

Defined in: [src/types/events.ts:113](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L113)

#### Parameters

##### event

[`MouseEvent`](MouseEvent.md)

#### Returns

`void`

---

### onMouseUp()?

> `optional` **onMouseUp**: (`event`) => `void`

Defined in: [src/types/events.ts:114](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L114)

#### Parameters

##### event

[`MouseEvent`](MouseEvent.md)

#### Returns

`void`

---

### onMouseMove()?

> `optional` **onMouseMove**: (`event`) => `void`

Defined in: [src/types/events.ts:115](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L115)

#### Parameters

##### event

[`MouseEvent`](MouseEvent.md)

#### Returns

`void`

---

### onMouseDrag()?

> `optional` **onMouseDrag**: (`event`) => `void`

Defined in: [src/types/events.ts:116](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L116)

#### Parameters

##### event

[`MouseEvent`](MouseEvent.md)

#### Returns

`void`

---

### onPressIn()?

> `optional` **onPressIn**: (`event`) => `void`

Defined in: [src/types/events.ts:119](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L119)

#### Parameters

##### event

`GestureResponderEvent`

#### Returns

`void`

---

### onPressOut()?

> `optional` **onPressOut**: (`event`) => `void`

Defined in: [src/types/events.ts:120](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L120)

#### Parameters

##### event

`GestureResponderEvent`

#### Returns

`void`

---

### onLongPress()?

> `optional` **onLongPress**: (`event`) => `void`

Defined in: [src/types/events.ts:121](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L121)

#### Parameters

##### event

`GestureResponderEvent`

#### Returns

`void`

---

### onHoverIn()?

> `optional` **onHoverIn**: (`event`) => `void`

Defined in: [src/types/events.ts:124](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L124)

#### Parameters

##### event

`GestureResponderEvent`

#### Returns

`void`

---

### onHoverOut()?

> `optional` **onHoverOut**: (`event`) => `void`

Defined in: [src/types/events.ts:125](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L125)

#### Parameters

##### event

`GestureResponderEvent`

#### Returns

`void`

---

### onKeyDown()?

> `optional` **onKeyDown**: (`event`) => `void`

Defined in: [src/types/events.ts:128](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L128)

#### Parameters

##### event

[`KeyboardEvent`](KeyboardEvent.md)

#### Returns

`void`

---

### onKeyUp()?

> `optional` **onKeyUp**: (`event`) => `void`

Defined in: [src/types/events.ts:129](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L129)

#### Parameters

##### event

[`KeyboardEvent`](KeyboardEvent.md)

#### Returns

`void`

---

### onKeyPress()?

> `optional` **onKeyPress**: (`event`) => `void`

Defined in: [src/types/events.ts:130](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L130)

#### Parameters

##### event

[`KeyboardEvent`](KeyboardEvent.md)

#### Returns

`void`

---

### onChange()?

> `optional` **onChange**: (`event`) => `void`

Defined in: [src/types/events.ts:133](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L133)

#### Parameters

##### event

[`InputEvent`](InputEvent.md)

#### Returns

`void`

---

### onSubmit()?

> `optional` **onSubmit**: (`event`) => `void`

Defined in: [src/types/events.ts:134](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L134)

#### Parameters

##### event

[`InputEvent`](InputEvent.md)

#### Returns

`void`

---

### onFocus()?

> `optional` **onFocus**: (`event?`) => `void`

Defined in: [src/types/events.ts:137](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L137)

#### Parameters

##### event?

`NativeSyntheticEvent`\<\{ `target`: `number`; \}\>

#### Returns

`void`

---

### onBlur()?

> `optional` **onBlur**: (`event?`) => `void`

Defined in: [src/types/events.ts:138](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L138)

#### Parameters

##### event?

`NativeSyntheticEvent`\<\{ `target`: `number`; \}\>

#### Returns

`void`

---

### onLayout()?

> `optional` **onLayout**: (`event`) => `void`

Defined in: [src/types/events.ts:141](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L141)

#### Parameters

##### event

`LayoutChangeEvent`

#### Returns

`void`

---

### delayLongPress?

> `optional` **delayLongPress**: `number`

Defined in: [src/types/events.ts:144](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L144)

---

### delayPressIn?

> `optional` **delayPressIn**: `number`

Defined in: [src/types/events.ts:145](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L145)

---

### delayPressOut?

> `optional` **delayPressOut**: `number`

Defined in: [src/types/events.ts:146](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L146)

---

### disabled?

> `optional` **disabled**: `boolean`

Defined in: [src/types/events.ts:149](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L149)
