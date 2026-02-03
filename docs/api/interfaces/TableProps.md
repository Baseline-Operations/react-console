[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / TableProps

# Interface: TableProps\<T\>

Defined in: [src/components/data/Table.tsx:22](https://github.com/Baseline-Operations/react-console/blob/main/src/components/data/Table.tsx#L22)

Component event handlers (JSX-style)

## Extends

- [`ComponentEventHandlers`](ComponentEventHandlers.md).[`StyleProps`](StyleProps.md)

## Type Parameters

### T

`T` = `unknown`

## Properties

### data

> **data**: `T`[]

Defined in: [src/components/data/Table.tsx:23](https://github.com/Baseline-Operations/react-console/blob/main/src/components/data/Table.tsx#L23)

---

### columns

> **columns**: [`TableColumn`](TableColumn.md)\<`T`\>[]

Defined in: [src/components/data/Table.tsx:24](https://github.com/Baseline-Operations/react-console/blob/main/src/components/data/Table.tsx#L24)

---

### style?

> `optional` **style**: `ViewStyle` \| `ViewStyle`[]

Defined in: [src/components/data/Table.tsx:25](https://github.com/Baseline-Operations/react-console/blob/main/src/components/data/Table.tsx#L25)

---

### header?

> `optional` **header**: `boolean`

Defined in: [src/components/data/Table.tsx:26](https://github.com/Baseline-Operations/react-console/blob/main/src/components/data/Table.tsx#L26)

---

### footer?

> `optional` **footer**: `ReactNode`

Defined in: [src/components/data/Table.tsx:27](https://github.com/Baseline-Operations/react-console/blob/main/src/components/data/Table.tsx#L27)

---

### border?

> `optional` **border**: `false` \| `"single"` \| `"double"` \| `"thick"` \| `"dashed"` \| `"dotted"`

Defined in: [src/components/data/Table.tsx:28](https://github.com/Baseline-Operations/react-console/blob/main/src/components/data/Table.tsx#L28)

---

### zebra?

> `optional` **zebra**: `boolean`

Defined in: [src/components/data/Table.tsx:29](https://github.com/Baseline-Operations/react-console/blob/main/src/components/data/Table.tsx#L29)

---

### sortable?

> `optional` **sortable**: `boolean`

Defined in: [src/components/data/Table.tsx:30](https://github.com/Baseline-Operations/react-console/blob/main/src/components/data/Table.tsx#L30)

---

### sortBy?

> `optional` **sortBy**: `string`

Defined in: [src/components/data/Table.tsx:31](https://github.com/Baseline-Operations/react-console/blob/main/src/components/data/Table.tsx#L31)

---

### sortDirection?

> `optional` **sortDirection**: `"desc"` \| `"asc"`

Defined in: [src/components/data/Table.tsx:32](https://github.com/Baseline-Operations/react-console/blob/main/src/components/data/Table.tsx#L32)

---

### onSort()?

> `optional` **onSort**: (`columnKey`, `direction`) => `void`

Defined in: [src/components/data/Table.tsx:33](https://github.com/Baseline-Operations/react-console/blob/main/src/components/data/Table.tsx#L33)

#### Parameters

##### columnKey

`string`

##### direction

`"desc"` | `"asc"`

#### Returns

`void`

---

### maxHeight?

> `optional` **maxHeight**: `number`

Defined in: [src/components/data/Table.tsx:34](https://github.com/Baseline-Operations/react-console/blob/main/src/components/data/Table.tsx#L34)

---

### emptyMessage?

> `optional` **emptyMessage**: `string`

Defined in: [src/components/data/Table.tsx:35](https://github.com/Baseline-Operations/react-console/blob/main/src/components/data/Table.tsx#L35)

---

### children?

> `optional` **children**: `ReactNode`

Defined in: [src/components/data/Table.tsx:36](https://github.com/Baseline-Operations/react-console/blob/main/src/components/data/Table.tsx#L36)

---

### onClick()?

> `optional` **onClick**: (`event`) => `void`

Defined in: [src/types/events.ts:111](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L111)

#### Parameters

##### event

[`MouseEvent`](MouseEvent.md)

#### Returns

`void`

#### Inherited from

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`onClick`](ComponentEventHandlers.md#onclick)

---

### onPress()?

> `optional` **onPress**: (`event`) => `void`

Defined in: [src/types/events.ts:112](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L112)

#### Parameters

##### event

`GestureResponderEvent`

#### Returns

`void`

#### Inherited from

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`onPress`](ComponentEventHandlers.md#onpress)

---

### onMouseDown()?

> `optional` **onMouseDown**: (`event`) => `void`

Defined in: [src/types/events.ts:113](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L113)

#### Parameters

##### event

[`MouseEvent`](MouseEvent.md)

#### Returns

`void`

#### Inherited from

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`onMouseDown`](ComponentEventHandlers.md#onmousedown)

---

### onMouseUp()?

> `optional` **onMouseUp**: (`event`) => `void`

Defined in: [src/types/events.ts:114](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L114)

#### Parameters

##### event

[`MouseEvent`](MouseEvent.md)

#### Returns

`void`

#### Inherited from

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`onMouseUp`](ComponentEventHandlers.md#onmouseup)

---

### onMouseMove()?

> `optional` **onMouseMove**: (`event`) => `void`

Defined in: [src/types/events.ts:115](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L115)

#### Parameters

##### event

[`MouseEvent`](MouseEvent.md)

#### Returns

`void`

#### Inherited from

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`onMouseMove`](ComponentEventHandlers.md#onmousemove)

---

### onMouseDrag()?

> `optional` **onMouseDrag**: (`event`) => `void`

Defined in: [src/types/events.ts:116](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L116)

#### Parameters

##### event

[`MouseEvent`](MouseEvent.md)

#### Returns

`void`

#### Inherited from

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`onMouseDrag`](ComponentEventHandlers.md#onmousedrag)

---

### onPressIn()?

> `optional` **onPressIn**: (`event`) => `void`

Defined in: [src/types/events.ts:119](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L119)

#### Parameters

##### event

`GestureResponderEvent`

#### Returns

`void`

#### Inherited from

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`onPressIn`](ComponentEventHandlers.md#onpressin)

---

### onPressOut()?

> `optional` **onPressOut**: (`event`) => `void`

Defined in: [src/types/events.ts:120](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L120)

#### Parameters

##### event

`GestureResponderEvent`

#### Returns

`void`

#### Inherited from

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`onPressOut`](ComponentEventHandlers.md#onpressout)

---

### onLongPress()?

> `optional` **onLongPress**: (`event`) => `void`

Defined in: [src/types/events.ts:121](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L121)

#### Parameters

##### event

`GestureResponderEvent`

#### Returns

`void`

#### Inherited from

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`onLongPress`](ComponentEventHandlers.md#onlongpress)

---

### onHoverIn()?

> `optional` **onHoverIn**: (`event`) => `void`

Defined in: [src/types/events.ts:124](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L124)

#### Parameters

##### event

`GestureResponderEvent`

#### Returns

`void`

#### Inherited from

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`onHoverIn`](ComponentEventHandlers.md#onhoverin)

---

### onHoverOut()?

> `optional` **onHoverOut**: (`event`) => `void`

Defined in: [src/types/events.ts:125](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L125)

#### Parameters

##### event

`GestureResponderEvent`

#### Returns

`void`

#### Inherited from

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`onHoverOut`](ComponentEventHandlers.md#onhoverout)

---

### onKeyDown()?

> `optional` **onKeyDown**: (`event`) => `void`

Defined in: [src/types/events.ts:128](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L128)

#### Parameters

##### event

[`KeyboardEvent`](KeyboardEvent.md)

#### Returns

`void`

#### Inherited from

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`onKeyDown`](ComponentEventHandlers.md#onkeydown)

---

### onKeyUp()?

> `optional` **onKeyUp**: (`event`) => `void`

Defined in: [src/types/events.ts:129](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L129)

#### Parameters

##### event

[`KeyboardEvent`](KeyboardEvent.md)

#### Returns

`void`

#### Inherited from

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`onKeyUp`](ComponentEventHandlers.md#onkeyup)

---

### onKeyPress()?

> `optional` **onKeyPress**: (`event`) => `void`

Defined in: [src/types/events.ts:130](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L130)

#### Parameters

##### event

[`KeyboardEvent`](KeyboardEvent.md)

#### Returns

`void`

#### Inherited from

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`onKeyPress`](ComponentEventHandlers.md#onkeypress)

---

### onChange()?

> `optional` **onChange**: (`event`) => `void`

Defined in: [src/types/events.ts:133](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L133)

#### Parameters

##### event

[`InputEvent`](InputEvent.md)

#### Returns

`void`

#### Inherited from

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`onChange`](ComponentEventHandlers.md#onchange)

---

### onSubmit()?

> `optional` **onSubmit**: (`event`) => `void`

Defined in: [src/types/events.ts:134](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L134)

#### Parameters

##### event

[`InputEvent`](InputEvent.md)

#### Returns

`void`

#### Inherited from

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`onSubmit`](ComponentEventHandlers.md#onsubmit)

---

### onFocus()?

> `optional` **onFocus**: (`event?`) => `void`

Defined in: [src/types/events.ts:137](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L137)

#### Parameters

##### event?

`NativeSyntheticEvent`\<\{ `target`: `number`; \}\>

#### Returns

`void`

#### Inherited from

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`onFocus`](ComponentEventHandlers.md#onfocus)

---

### onBlur()?

> `optional` **onBlur**: (`event?`) => `void`

Defined in: [src/types/events.ts:138](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L138)

#### Parameters

##### event?

`NativeSyntheticEvent`\<\{ `target`: `number`; \}\>

#### Returns

`void`

#### Inherited from

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`onBlur`](ComponentEventHandlers.md#onblur)

---

### onLayout()?

> `optional` **onLayout**: (`event`) => `void`

Defined in: [src/types/events.ts:141](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L141)

#### Parameters

##### event

`LayoutChangeEvent`

#### Returns

`void`

#### Inherited from

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`onLayout`](ComponentEventHandlers.md#onlayout)

---

### delayLongPress?

> `optional` **delayLongPress**: `number`

Defined in: [src/types/events.ts:144](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L144)

#### Inherited from

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`delayLongPress`](ComponentEventHandlers.md#delaylongpress)

---

### delayPressIn?

> `optional` **delayPressIn**: `number`

Defined in: [src/types/events.ts:145](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L145)

#### Inherited from

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`delayPressIn`](ComponentEventHandlers.md#delaypressin)

---

### delayPressOut?

> `optional` **delayPressOut**: `number`

Defined in: [src/types/events.ts:146](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L146)

#### Inherited from

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`delayPressOut`](ComponentEventHandlers.md#delaypressout)

---

### disabled?

> `optional` **disabled**: `boolean`

Defined in: [src/types/events.ts:149](https://github.com/Baseline-Operations/react-console/blob/main/src/types/events.ts#L149)

#### Inherited from

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`disabled`](ComponentEventHandlers.md#disabled)

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
