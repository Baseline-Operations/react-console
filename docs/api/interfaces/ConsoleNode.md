[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / ConsoleNode

# Interface: ConsoleNode

Defined in: [src/types/components.ts:18](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L18)

## Properties

### type

> **type**: `"text"` \| `"radio"` \| `"checkbox"` \| `"dropdown"` \| `"list"` \| `"box"` \| `"fragment"` \| `"newline"` \| `"linebreak"` \| `"textinput"` \| `"input"` \| `"button"` \| `"scrollable"` \| `"scrollview"` \| `"modal"` \| `"overlay"`

Defined in: [src/types/components.ts:19](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L19)

---

### customType?

> `optional` **customType**: `string`

Defined in: [src/types/components.ts:36](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L36)

---

### content?

> `optional` **content**: `string`

Defined in: [src/types/components.ts:37](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L37)

---

### styles?

> `optional` **styles**: [`StyleProps`](StyleProps.md)

Defined in: [src/types/components.ts:38](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L38)

---

### style?

> `optional` **style**: `ViewStyle` \| `TextStyle`

Defined in: [src/types/components.ts:39](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L39)

---

### layout?

> `optional` **layout**: [`LayoutProps`](LayoutProps.md)

Defined in: [src/types/components.ts:40](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L40)

---

### children?

> `optional` **children**: `ConsoleNode`[]

Defined in: [src/types/components.ts:41](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L41)

---

### x?

> `optional` **x**: `number`

Defined in: [src/types/components.ts:42](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L42)

---

### y?

> `optional` **y**: `number`

Defined in: [src/types/components.ts:43](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L43)

---

### width?

> `optional` **width**: [`ResponsiveSize`](../type-aliases/ResponsiveSize.md)

Defined in: [src/types/components.ts:44](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L44)

---

### height?

> `optional` **height**: [`ResponsiveSize`](../type-aliases/ResponsiveSize.md)

Defined in: [src/types/components.ts:45](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L45)

---

### value?

> `optional` **value**: `string` \| `number` \| `boolean` \| (`string` \| `number`)[]

Defined in: [src/types/components.ts:47](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L47)

---

### defaultValue?

> `optional` **defaultValue**: `string` \| `number` \| `boolean` \| (`string` \| `number`)[]

Defined in: [src/types/components.ts:48](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L48)

---

### placeholder?

> `optional` **placeholder**: `string`

Defined in: [src/types/components.ts:49](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L49)

---

### focused?

> `optional` **focused**: `boolean`

Defined in: [src/types/components.ts:50](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L50)

---

### disabled?

> `optional` **disabled**: `boolean`

Defined in: [src/types/components.ts:51](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L51)

---

### mask?

> `optional` **mask**: `string`

Defined in: [src/types/components.ts:52](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L52)

---

### maxLength?

> `optional` **maxLength**: `number`

Defined in: [src/types/components.ts:53](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L53)

---

### maxWidth?

> `optional` **maxWidth**: `number`

Defined in: [src/types/components.ts:54](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L54)

---

### multiline?

> `optional` **multiline**: `boolean`

Defined in: [src/types/components.ts:55](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L55)

---

### maxLines?

> `optional` **maxLines**: `number`

Defined in: [src/types/components.ts:56](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L56)

---

### autoFocus?

> `optional` **autoFocus**: `boolean`

Defined in: [src/types/components.ts:57](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L57)

---

### tabIndex?

> `optional` **tabIndex**: `number`

Defined in: [src/types/components.ts:58](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L58)

---

### inputType?

> `optional` **inputType**: [`InputType`](../type-aliases/InputType.md)

Defined in: [src/types/components.ts:60](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L60)

---

### step?

> `optional` **step**: `number`

Defined in: [src/types/components.ts:62](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L62)

---

### min?

> `optional` **min**: `number`

Defined in: [src/types/components.ts:63](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L63)

---

### max?

> `optional` **max**: `number`

Defined in: [src/types/components.ts:64](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L64)

---

### allowDecimals?

> `optional` **allowDecimals**: `boolean`

Defined in: [src/types/components.ts:65](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L65)

---

### decimalPlaces?

> `optional` **decimalPlaces**: `number`

Defined in: [src/types/components.ts:66](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L66)

---

### formatDisplay()?

> `optional` **formatDisplay**: (`value`) => `string`

Defined in: [src/types/components.ts:68](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L68)

#### Parameters

##### value

`string` | `number` | `boolean`

#### Returns

`string`

---

### formatValue()?

> `optional` **formatValue**: (`value`) => `string` \| `number`

Defined in: [src/types/components.ts:69](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L69)

#### Parameters

##### value

`string` | `number` | `boolean`

#### Returns

`string` \| `number`

---

### pattern?

> `optional` **pattern**: `string` \| `RegExp`

Defined in: [src/types/components.ts:71](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L71)

---

### validationError?

> `optional` **validationError**: `string`

Defined in: [src/types/components.ts:72](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L72)

---

### invalid?

> `optional` **invalid**: `boolean`

Defined in: [src/types/components.ts:73](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L73)

---

### options?

> `optional` **options**: `object`[]

Defined in: [src/types/components.ts:75](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L75)

#### label

> **label**: `string`

#### value

> **value**: `string` \| `number`

---

### selected?

> `optional` **selected**: `string` \| `number` \| `string`[]

Defined in: [src/types/components.ts:76](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L76)

---

### multiple?

> `optional` **multiple**: `boolean`

Defined in: [src/types/components.ts:77](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L77)

---

### name?

> `optional` **name**: `string`

Defined in: [src/types/components.ts:78](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L78)

---

### displayFormat?

> `optional` **displayFormat**: `string`

Defined in: [src/types/components.ts:80](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L80)

---

### onClick()?

> `optional` **onClick**: (`event`) => `void`

Defined in: [src/types/components.ts:82](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L82)

#### Parameters

##### event

[`MouseEvent`](MouseEvent.md)

#### Returns

`void`

---

### onPress()?

> `optional` **onPress**: (`event`) => `void`

Defined in: [src/types/components.ts:83](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L83)

#### Parameters

##### event

[`MouseEvent`](MouseEvent.md)

#### Returns

`void`

---

### onMouseDown()?

> `optional` **onMouseDown**: (`event`) => `void`

Defined in: [src/types/components.ts:84](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L84)

#### Parameters

##### event

[`MouseEvent`](MouseEvent.md)

#### Returns

`void`

---

### onMouseUp()?

> `optional` **onMouseUp**: (`event`) => `void`

Defined in: [src/types/components.ts:85](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L85)

#### Parameters

##### event

[`MouseEvent`](MouseEvent.md)

#### Returns

`void`

---

### onMouseMove()?

> `optional` **onMouseMove**: (`event`) => `void`

Defined in: [src/types/components.ts:86](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L86)

#### Parameters

##### event

[`MouseEvent`](MouseEvent.md)

#### Returns

`void`

---

### onMouseDrag()?

> `optional` **onMouseDrag**: (`event`) => `void`

Defined in: [src/types/components.ts:87](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L87)

#### Parameters

##### event

[`MouseEvent`](MouseEvent.md)

#### Returns

`void`

---

### onKeyDown()?

> `optional` **onKeyDown**: (`event`) => `void`

Defined in: [src/types/components.ts:88](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L88)

#### Parameters

##### event

[`KeyboardEvent`](KeyboardEvent.md)

#### Returns

`void`

---

### onKeyUp()?

> `optional` **onKeyUp**: (`event`) => `void`

Defined in: [src/types/components.ts:89](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L89)

#### Parameters

##### event

[`KeyboardEvent`](KeyboardEvent.md)

#### Returns

`void`

---

### onKeyPress()?

> `optional` **onKeyPress**: (`event`) => `void`

Defined in: [src/types/components.ts:90](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L90)

#### Parameters

##### event

[`KeyboardEvent`](KeyboardEvent.md)

#### Returns

`void`

---

### onChange()?

> `optional` **onChange**: (`event`) => `void`

Defined in: [src/types/components.ts:91](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L91)

#### Parameters

##### event

[`InputEvent`](InputEvent.md)

#### Returns

`void`

---

### onSubmit()?

> `optional` **onSubmit**: (`event`) => `void`

Defined in: [src/types/components.ts:92](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L92)

#### Parameters

##### event

[`InputEvent`](InputEvent.md)

#### Returns

`void`

---

### onFocus()?

> `optional` **onFocus**: () => `void`

Defined in: [src/types/components.ts:93](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L93)

#### Returns

`void`

---

### onBlur()?

> `optional` **onBlur**: () => `void`

Defined in: [src/types/components.ts:94](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L94)

#### Returns

`void`

---

### scrollTop?

> `optional` **scrollTop**: `number`

Defined in: [src/types/components.ts:96](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L96)

---

### scrollLeft?

> `optional` **scrollLeft**: `number`

Defined in: [src/types/components.ts:97](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L97)

---

### maxHeight?

> `optional` **maxHeight**: `number`

Defined in: [src/types/components.ts:98](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L98)

---

### scrollable?

> `optional` **scrollable**: `boolean`

Defined in: [src/types/components.ts:101](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L101)

---

### scrollbarVisibility?

> `optional` **scrollbarVisibility**: `"auto"` \| `"hidden"` \| `"always"`

Defined in: [src/types/components.ts:102](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L102)

---

### horizontalScrollbar?

> `optional` **horizontalScrollbar**: `"auto"` \| `"hidden"` \| `"always"`

Defined in: [src/types/components.ts:103](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L103)

---

### verticalScrollbar?

> `optional` **verticalScrollbar**: `"auto"` \| `"hidden"` \| `"always"`

Defined in: [src/types/components.ts:104](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L104)

---

### scrollbarChar?

> `optional` **scrollbarChar**: `string`

Defined in: [src/types/components.ts:105](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L105)

---

### scrollbarTrackChar?

> `optional` **scrollbarTrackChar**: `string`

Defined in: [src/types/components.ts:106](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L106)

---

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/types/components.ts:108](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L108)

---

### backdrop?

> `optional` **backdrop**: `boolean`

Defined in: [src/types/components.ts:109](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L109)

---

### backdropColor?

> `optional` **backdropColor**: `string`

Defined in: [src/types/components.ts:110](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L110)

---

### fullscreen?

> `optional` **fullscreen**: `boolean`

Defined in: [src/types/components.ts:112](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L112)

---

### focusedIndex?

> `optional` **focusedIndex**: `number`

Defined in: [src/types/components.ts:115](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L115)

---

### isOpen?

> `optional` **isOpen**: `boolean`

Defined in: [src/types/components.ts:116](https://github.com/Baseline-Operations/react-console/blob/main/src/types/components.ts#L116)
