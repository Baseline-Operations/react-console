[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / PressableProps

# Interface: PressableProps

Defined in: [src/components/interactive/Pressable.tsx:42](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Pressable.tsx#L42)

Props for the Pressable component (React Native compatible)

Provides pressable wrapper for any content. Supports keyboard (Enter/Space)
and mouse clicks (if terminal supports it). Similar to Button but can wrap any content.

## Example

```tsx
// Basic usage
<Pressable onPress={() => handlePress()}>
  <Text>Press me!</Text>
</Pressable>

// With state-based styling (React Native pattern)
<Pressable
  onPress={() => handlePress()}
  style={({ pressed, focused }) => ({
    backgroundColor: pressed ? 'blue' : focused ? 'gray' : 'white'
  })}
>
  {({ pressed }) => (
    <Text>{pressed ? 'Pressing...' : 'Press me'}</Text>
  )}
</Pressable>
```

## Extends

- [`StyleProps`](StyleProps.md).[`LayoutProps`](LayoutProps.md).`Omit`\<[`ComponentEventHandlers`](ComponentEventHandlers.md), `"onPress"` \| `"onPressIn"` \| `"onPressOut"` \| `"onLongPress"`\>

## Properties

### children?

> `optional` **children**: `ReactNode` \| `PressableStateCallbackType`

Defined in: [src/components/interactive/Pressable.tsx:44](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Pressable.tsx#L44)

Children - can be ReactNode or render prop based on interaction state

---

### style?

> `optional` **style**: [`StateStyle`](../type-aliases/StateStyle.md)\<`ViewStyle`\>

Defined in: [src/components/interactive/Pressable.tsx:50](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Pressable.tsx#L50)

Style - can be static ViewStyle or function of interaction state

#### Example

```ts
style={({ pressed }) => ({ backgroundColor: pressed ? 'blue' : 'white' })}
```

---

### disabled?

> `optional` **disabled**: `boolean`

Defined in: [src/components/interactive/Pressable.tsx:52](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Pressable.tsx#L52)

Disable pressable interaction (default: false)

#### Overrides

[`TableProps`](TableProps.md).[`disabled`](TableProps.md#disabled)

---

### tabIndex?

> `optional` **tabIndex**: `number`

Defined in: [src/components/interactive/Pressable.tsx:54](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Pressable.tsx#L54)

Tab order (auto-assigned if not set)

---

### autoFocus?

> `optional` **autoFocus**: `boolean`

Defined in: [src/components/interactive/Pressable.tsx:56](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Pressable.tsx#L56)

Auto focus on mount

---

### onPress()?

> `optional` **onPress**: (`event`) => `void`

Defined in: [src/components/interactive/Pressable.tsx:60](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Pressable.tsx#L60)

Called when the press is activated

#### Parameters

##### event

`GestureResponderEvent`

#### Returns

`void`

---

### onPressIn()?

> `optional` **onPressIn**: (`event`) => `void`

Defined in: [src/components/interactive/Pressable.tsx:62](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Pressable.tsx#L62)

Called immediately when a press is activated, before onPressOut

#### Parameters

##### event

`GestureResponderEvent`

#### Returns

`void`

---

### onPressOut()?

> `optional` **onPressOut**: (`event`) => `void`

Defined in: [src/components/interactive/Pressable.tsx:64](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Pressable.tsx#L64)

Called when a press gesture has been deactivated

#### Parameters

##### event

`GestureResponderEvent`

#### Returns

`void`

---

### onLongPress()?

> `optional` **onLongPress**: (`event`) => `void`

Defined in: [src/components/interactive/Pressable.tsx:66](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Pressable.tsx#L66)

Called after delayLongPress has elapsed

#### Parameters

##### event

`GestureResponderEvent`

#### Returns

`void`

---

### delayLongPress?

> `optional` **delayLongPress**: `number`

Defined in: [src/components/interactive/Pressable.tsx:70](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Pressable.tsx#L70)

Duration before onLongPress is called (default: 500ms)

#### Overrides

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`delayLongPress`](ComponentEventHandlers.md#delaylongpress)

---

### delayPressIn?

> `optional` **delayPressIn**: `number`

Defined in: [src/components/interactive/Pressable.tsx:72](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Pressable.tsx#L72)

Duration before onPressIn is called (default: 0)

#### Overrides

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`delayPressIn`](ComponentEventHandlers.md#delaypressin)

---

### delayPressOut?

> `optional` **delayPressOut**: `number`

Defined in: [src/components/interactive/Pressable.tsx:74](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Pressable.tsx#L74)

Duration before onPressOut is called (default: 0)

#### Overrides

[`ComponentEventHandlers`](ComponentEventHandlers.md).[`delayPressOut`](ComponentEventHandlers.md#delaypressout)

---

### unstable_pressDelay?

> `optional` **unstable_pressDelay**: `number`

Defined in: [src/components/interactive/Pressable.tsx:78](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Pressable.tsx#L78)

Called when the view starts responding to touches

---

### android_ripple?

> `optional` **android_ripple**: `object`

Defined in: [src/components/interactive/Pressable.tsx:80](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Pressable.tsx#L80)

Android ripple effect config (ignored in terminal)

#### color?

> `optional` **color**: `string`

#### borderless?

> `optional` **borderless**: `boolean`

#### radius?

> `optional` **radius**: `number`

---

### pressedStyle?

> `optional` **pressedStyle**: `ViewStyle`

Defined in: [src/components/interactive/Pressable.tsx:88](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Pressable.tsx#L88)

Style applied when pressed

---

### focusedStyle?

> `optional` **focusedStyle**: `ViewStyle`

Defined in: [src/components/interactive/Pressable.tsx:90](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Pressable.tsx#L90)

Style applied when focused

---

### hoveredStyle?

> `optional` **hoveredStyle**: `ViewStyle`

Defined in: [src/components/interactive/Pressable.tsx:92](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Pressable.tsx#L92)

Style applied when hovered

---

### disabledStyle?

> `optional` **disabledStyle**: `ViewStyle`

Defined in: [src/components/interactive/Pressable.tsx:94](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Pressable.tsx#L94)

Style applied when disabled

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

---

### padding?

> `optional` **padding**: `number` \| \{ `top?`: `number`; `right?`: `number`; `bottom?`: `number`; `left?`: `number`; \}

Defined in: [src/types/styles.ts:26](https://github.com/Baseline-Operations/react-console/blob/main/src/types/styles.ts#L26)

#### Inherited from

[`LayoutProps`](LayoutProps.md).[`padding`](LayoutProps.md#padding)

---

### paddingTop?

> `optional` **paddingTop**: `number`

Defined in: [src/types/styles.ts:27](https://github.com/Baseline-Operations/react-console/blob/main/src/types/styles.ts#L27)

#### Inherited from

[`LayoutProps`](LayoutProps.md).[`paddingTop`](LayoutProps.md#paddingtop)

---

### paddingRight?

> `optional` **paddingRight**: `number`

Defined in: [src/types/styles.ts:28](https://github.com/Baseline-Operations/react-console/blob/main/src/types/styles.ts#L28)

#### Inherited from

[`LayoutProps`](LayoutProps.md).[`paddingRight`](LayoutProps.md#paddingright)

---

### paddingBottom?

> `optional` **paddingBottom**: `number`

Defined in: [src/types/styles.ts:29](https://github.com/Baseline-Operations/react-console/blob/main/src/types/styles.ts#L29)

#### Inherited from

[`LayoutProps`](LayoutProps.md).[`paddingBottom`](LayoutProps.md#paddingbottom)

---

### paddingLeft?

> `optional` **paddingLeft**: `number`

Defined in: [src/types/styles.ts:30](https://github.com/Baseline-Operations/react-console/blob/main/src/types/styles.ts#L30)

#### Inherited from

[`LayoutProps`](LayoutProps.md).[`paddingLeft`](LayoutProps.md#paddingleft)

---

### paddingHorizontal?

> `optional` **paddingHorizontal**: `number`

Defined in: [src/types/styles.ts:31](https://github.com/Baseline-Operations/react-console/blob/main/src/types/styles.ts#L31)

#### Inherited from

[`LayoutProps`](LayoutProps.md).[`paddingHorizontal`](LayoutProps.md#paddinghorizontal)

---

### paddingVertical?

> `optional` **paddingVertical**: `number`

Defined in: [src/types/styles.ts:32](https://github.com/Baseline-Operations/react-console/blob/main/src/types/styles.ts#L32)

#### Inherited from

[`LayoutProps`](LayoutProps.md).[`paddingVertical`](LayoutProps.md#paddingvertical)

---

### margin?

> `optional` **margin**: `number` \| \{ `top?`: `number`; `right?`: `number`; `bottom?`: `number`; `left?`: `number`; \}

Defined in: [src/types/styles.ts:35](https://github.com/Baseline-Operations/react-console/blob/main/src/types/styles.ts#L35)

#### Inherited from

[`LayoutProps`](LayoutProps.md).[`margin`](LayoutProps.md#margin)

---

### marginTop?

> `optional` **marginTop**: `number`

Defined in: [src/types/styles.ts:36](https://github.com/Baseline-Operations/react-console/blob/main/src/types/styles.ts#L36)

#### Inherited from

[`LayoutProps`](LayoutProps.md).[`marginTop`](LayoutProps.md#margintop)

---

### marginRight?

> `optional` **marginRight**: `number`

Defined in: [src/types/styles.ts:37](https://github.com/Baseline-Operations/react-console/blob/main/src/types/styles.ts#L37)

#### Inherited from

[`LayoutProps`](LayoutProps.md).[`marginRight`](LayoutProps.md#marginright)

---

### marginBottom?

> `optional` **marginBottom**: `number`

Defined in: [src/types/styles.ts:38](https://github.com/Baseline-Operations/react-console/blob/main/src/types/styles.ts#L38)

#### Inherited from

[`LayoutProps`](LayoutProps.md).[`marginBottom`](LayoutProps.md#marginbottom)

---

### marginLeft?

> `optional` **marginLeft**: `number`

Defined in: [src/types/styles.ts:39](https://github.com/Baseline-Operations/react-console/blob/main/src/types/styles.ts#L39)

#### Inherited from

[`LayoutProps`](LayoutProps.md).[`marginLeft`](LayoutProps.md#marginleft)

---

### marginHorizontal?

> `optional` **marginHorizontal**: `number`

Defined in: [src/types/styles.ts:40](https://github.com/Baseline-Operations/react-console/blob/main/src/types/styles.ts#L40)

#### Inherited from

[`LayoutProps`](LayoutProps.md).[`marginHorizontal`](LayoutProps.md#marginhorizontal)

---

### marginVertical?

> `optional` **marginVertical**: `number`

Defined in: [src/types/styles.ts:41](https://github.com/Baseline-Operations/react-console/blob/main/src/types/styles.ts#L41)

#### Inherited from

[`LayoutProps`](LayoutProps.md).[`marginVertical`](LayoutProps.md#marginvertical)

---

### width?

> `optional` **width**: [`ResponsiveSize`](../type-aliases/ResponsiveSize.md)

Defined in: [src/types/styles.ts:43](https://github.com/Baseline-Operations/react-console/blob/main/src/types/styles.ts#L43)

#### Inherited from

[`LayoutProps`](LayoutProps.md).[`width`](LayoutProps.md#width)

---

### height?

> `optional` **height**: [`ResponsiveSize`](../type-aliases/ResponsiveSize.md)

Defined in: [src/types/styles.ts:44](https://github.com/Baseline-Operations/react-console/blob/main/src/types/styles.ts#L44)

#### Inherited from

[`LayoutProps`](LayoutProps.md).[`height`](LayoutProps.md#height)
