[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / TextInputProps

# Interface: TextInputProps

Defined in: src/components/interactive/TextInput.tsx:89

Props for the TextInput component

Supports multiple input types (text, number) with validation, formatting, and multiline support.
All event handlers use JSX-style event objects similar to React Native.

## Example

```tsx
// Text input
<TextInput
  value={name}
  onChangeText={(text) => setName(text)}
  placeholder="Enter your name"
  maxLength={50}
/>

// Number input with validation
<TextInput
  keyboardType="numeric"
  value={age}
  onChangeText={(text) => setAge(text)}
  min={18}
  max={120}
  step={1}
  allowDecimals={false}
/>

// Currency input with formatting
<TextInput
  keyboardType="numeric"
  value={price}
  onChangeText={(text) => setPrice(text)}
  formatDisplay={(v) => `$${Number(v).toFixed(2)}`}
  decimalPlaces={2}
/>

// Multiline input
<TextInput
  multiline
  numberOfLines={5}
  value={description}
  onChangeText={(text) => setDescription(text)}
/>
```

## Extends

- `Omit`\<[`ComponentEventHandlers`](ComponentEventHandlers.md), `"onKeyDown"` \| `"onKeyUp"` \| `"onKeyPress"` \| `"onFocus"` \| `"onBlur"`\>.[`StyleProps`](StyleProps.md)

## Properties

### style?

> `optional` **style**: `ViewStyle` \| `ViewStyle`[]

Defined in: src/components/interactive/TextInput.tsx:90

---

### value?

> `optional` **value**: `string` \| `number`

Defined in: src/components/interactive/TextInput.tsx:93

---

### defaultValue?

> `optional` **defaultValue**: `string` \| `number`

Defined in: src/components/interactive/TextInput.tsx:94

---

### placeholder?

> `optional` **placeholder**: `string`

Defined in: src/components/interactive/TextInput.tsx:95

---

### placeholderTextColor?

> `optional` **placeholderTextColor**: `string`

Defined in: src/components/interactive/TextInput.tsx:96

---

### editable?

> `optional` **editable**: `boolean`

Defined in: src/components/interactive/TextInput.tsx:99

---

### disabled?

> `optional` **disabled**: `boolean`

Defined in: src/components/interactive/TextInput.tsx:100

#### Overrides

[`TableProps`](TableProps.md).[`disabled`](TableProps.md#disabled)

---

### secureTextEntry?

> `optional` **secureTextEntry**: `boolean`

Defined in: src/components/interactive/TextInput.tsx:101

---

### mask?

> `optional` **mask**: `string`

Defined in: src/components/interactive/TextInput.tsx:102

---

### maxLength?

> `optional` **maxLength**: `number`

Defined in: src/components/interactive/TextInput.tsx:103

---

### maxWidth?

> `optional` **maxWidth**: `number`

Defined in: src/components/interactive/TextInput.tsx:104

---

### multiline?

> `optional` **multiline**: `boolean`

Defined in: src/components/interactive/TextInput.tsx:107

---

### numberOfLines?

> `optional` **numberOfLines**: `number`

Defined in: src/components/interactive/TextInput.tsx:108

---

### maxLines?

> `optional` **maxLines**: `number`

Defined in: src/components/interactive/TextInput.tsx:109

---

### keyboardType?

> `optional` **keyboardType**: `"default"` \| `"numeric"` \| `"decimal-pad"` \| `"number-pad"`

Defined in: src/components/interactive/TextInput.tsx:112

---

### autoFocus?

> `optional` **autoFocus**: `boolean`

Defined in: src/components/interactive/TextInput.tsx:115

---

### tabIndex?

> `optional` **tabIndex**: `number`

Defined in: src/components/interactive/TextInput.tsx:116

---

### selectTextOnFocus?

> `optional` **selectTextOnFocus**: `boolean`

Defined in: src/components/interactive/TextInput.tsx:117

---

### step?

> `optional` **step**: `number`

Defined in: src/components/interactive/TextInput.tsx:120

---

### min?

> `optional` **min**: `number`

Defined in: src/components/interactive/TextInput.tsx:121

---

### max?

> `optional` **max**: `number`

Defined in: src/components/interactive/TextInput.tsx:122

---

### allowDecimals?

> `optional` **allowDecimals**: `boolean`

Defined in: src/components/interactive/TextInput.tsx:123

---

### decimalPlaces?

> `optional` **decimalPlaces**: `number`

Defined in: src/components/interactive/TextInput.tsx:124

---

### formatDisplay()?

> `optional` **formatDisplay**: (`value`) => `string`

Defined in: src/components/interactive/TextInput.tsx:127

#### Parameters

##### value

`string` | `number`

#### Returns

`string`

---

### formatValue()?

> `optional` **formatValue**: (`value`) => `string` \| `number`

Defined in: src/components/interactive/TextInput.tsx:128

#### Parameters

##### value

`string` | `number`

#### Returns

`string` \| `number`

---

### pattern?

> `optional` **pattern**: `string` \| `RegExp`

Defined in: src/components/interactive/TextInput.tsx:131

---

### displayFormat?

> `optional` **displayFormat**: `string`

Defined in: src/components/interactive/TextInput.tsx:134

---

### submitButtonId?

> `optional` **submitButtonId**: `string`

Defined in: src/components/interactive/TextInput.tsx:137

---

### returnKeyType?

> `optional` **returnKeyType**: `"search"` \| `"done"` \| `"go"` \| `"next"` \| `"send"`

Defined in: src/components/interactive/TextInput.tsx:138

---

### blurOnSubmit?

> `optional` **blurOnSubmit**: `boolean`

Defined in: src/components/interactive/TextInput.tsx:139

---

### onChangeText()?

> `optional` **onChangeText**: (`text`) => `void`

Defined in: src/components/interactive/TextInput.tsx:142

#### Parameters

##### text

`string`

#### Returns

`void`

---

### onSubmitEditing()?

> `optional` **onSubmitEditing**: (`event`) => `void`

Defined in: src/components/interactive/TextInput.tsx:143

#### Parameters

##### event

`SubmitEditingEvent`

#### Returns

`void`

---

### onEndEditing()?

> `optional` **onEndEditing**: (`event`) => `void`

Defined in: src/components/interactive/TextInput.tsx:144

#### Parameters

##### event

`NativeTextInputEvent`

#### Returns

`void`

---

### onContentSizeChange()?

> `optional` **onContentSizeChange**: (`event`) => `void`

Defined in: src/components/interactive/TextInput.tsx:145

#### Parameters

##### event

###### nativeEvent

\{ `contentSize`: \{ `width`: `number`; `height`: `number`; \}; \}

###### nativeEvent.contentSize

\{ `width`: `number`; `height`: `number`; \}

###### nativeEvent.contentSize.width

`number`

###### nativeEvent.contentSize.height

`number`

#### Returns

`void`

---

### onSelectionChange()?

> `optional` **onSelectionChange**: (`event`) => `void`

Defined in: src/components/interactive/TextInput.tsx:146

#### Parameters

##### event

###### nativeEvent

\{ `selection`: \{ `start`: `number`; `end`: `number`; \}; \}

###### nativeEvent.selection

\{ `start`: `number`; `end`: `number`; \}

###### nativeEvent.selection.start

`number`

###### nativeEvent.selection.end

`number`

#### Returns

`void`

---

### onChange()?

> `optional` **onChange**: (`event`) => `void`

Defined in: src/components/interactive/TextInput.tsx:149

#### Parameters

##### event

###### value

`unknown`

###### key?

[`KeyPress`](KeyPress.md)

#### Returns

`void`

#### Overrides

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`onChange`](ComponentEventHandlers.md#onchange)

---

### onKeyDown()?

> `optional` **onKeyDown**: (`event`) => `void`

Defined in: src/components/interactive/TextInput.tsx:150

#### Parameters

##### event

###### key

[`KeyPress`](KeyPress.md)

###### preventDefault

() => `void`

###### stopPropagation

() => `void`

#### Returns

`void`

---

### onKeyUp()?

> `optional` **onKeyUp**: (`event`) => `void`

Defined in: src/components/interactive/TextInput.tsx:151

#### Parameters

##### event

###### key

[`KeyPress`](KeyPress.md)

###### preventDefault

() => `void`

###### stopPropagation

() => `void`

#### Returns

`void`

---

### onKeyPress()?

> `optional` **onKeyPress**: (`event`) => `void`

Defined in: src/components/interactive/TextInput.tsx:152

#### Parameters

##### event

###### key

[`KeyPress`](KeyPress.md)

###### preventDefault

() => `void`

###### stopPropagation

() => `void`

#### Returns

`void`

---

### onSubmit()?

> `optional` **onSubmit**: (`event`) => `void`

Defined in: src/components/interactive/TextInput.tsx:153

#### Parameters

##### event

###### value

`unknown`

###### key?

[`KeyPress`](KeyPress.md)

#### Returns

`void`

#### Overrides

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`onSubmit`](ComponentEventHandlers.md#onsubmit)

---

### onFocus()?

> `optional` **onFocus**: () => `void`

Defined in: src/components/interactive/TextInput.tsx:154

#### Returns

`void`

---

### onBlur()?

> `optional` **onBlur**: () => `void`

Defined in: src/components/interactive/TextInput.tsx:155

#### Returns

`void`

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
