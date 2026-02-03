[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / ScrollViewProps

# Interface: ScrollViewProps

Defined in: [src/components/layout/ScrollView.tsx:54](https://github.com/Baseline-Operations/react-console/blob/main/src/components/layout/ScrollView.tsx#L54)

Props for the ScrollView component

React Native-like scrollable container for overflow content.
Extends View with scrolling capability and optional scrollbar.

## Example

```tsx
// Basic usage
<ScrollView maxHeight={20}>
  <Text>Long content that overflows</Text>
</ScrollView>

// With scrollbar styling
<ScrollView
  maxHeight={20}
  showsVerticalScrollIndicator
  scrollbarStyle={{ thumbColor: 'cyan', trackColor: 'gray' }}
>
  <Text>Scrollable content</Text>
</ScrollView>

// Controlled scroll position
<ScrollView scrollTop={scrollY} onScroll={setScrollY}>
  <Text>Content</Text>
</ScrollView>
```

## Extends

- [`LayoutProps`](LayoutProps.md).[`StyleProps`](StyleProps.md)

## Properties

### children?

> `optional` **children**: `ReactNode`

Defined in: [src/components/layout/ScrollView.tsx:55](https://github.com/Baseline-Operations/react-console/blob/main/src/components/layout/ScrollView.tsx#L55)

---

### style?

> `optional` **style**: `ViewStyle` \| `ViewStyle`[]

Defined in: [src/components/layout/ScrollView.tsx:57](https://github.com/Baseline-Operations/react-console/blob/main/src/components/layout/ScrollView.tsx#L57)

CSS-like style (similar to React Native)

---

### contentContainerStyle?

> `optional` **contentContainerStyle**: `ViewStyle`

Defined in: [src/components/layout/ScrollView.tsx:59](https://github.com/Baseline-Operations/react-console/blob/main/src/components/layout/ScrollView.tsx#L59)

Content container style

---

### scrollTop?

> `optional` **scrollTop**: `number`

Defined in: [src/components/layout/ScrollView.tsx:63](https://github.com/Baseline-Operations/react-console/blob/main/src/components/layout/ScrollView.tsx#L63)

Vertical scroll offset (default: 0)

---

### scrollLeft?

> `optional` **scrollLeft**: `number`

Defined in: [src/components/layout/ScrollView.tsx:65](https://github.com/Baseline-Operations/react-console/blob/main/src/components/layout/ScrollView.tsx#L65)

Horizontal scroll offset (default: 0)

---

### onScroll()?

> `optional` **onScroll**: (`scrollTop`, `scrollLeft`) => `void`

Defined in: [src/components/layout/ScrollView.tsx:67](https://github.com/Baseline-Operations/react-console/blob/main/src/components/layout/ScrollView.tsx#L67)

Callback when scroll position changes

#### Parameters

##### scrollTop

`number`

##### scrollLeft

`number`

#### Returns

`void`

---

### maxHeight?

> `optional` **maxHeight**: `number`

Defined in: [src/components/layout/ScrollView.tsx:71](https://github.com/Baseline-Operations/react-console/blob/main/src/components/layout/ScrollView.tsx#L71)

Maximum visible height (enables vertical scrolling)

---

### maxWidth?

> `optional` **maxWidth**: `number`

Defined in: [src/components/layout/ScrollView.tsx:73](https://github.com/Baseline-Operations/react-console/blob/main/src/components/layout/ScrollView.tsx#L73)

Maximum visible width (enables horizontal scrolling)

---

### horizontal?

> `optional` **horizontal**: `boolean`

Defined in: [src/components/layout/ScrollView.tsx:77](https://github.com/Baseline-Operations/react-console/blob/main/src/components/layout/ScrollView.tsx#L77)

Enable horizontal scrolling (default: false)

---

### showsVerticalScrollIndicator?

> `optional` **showsVerticalScrollIndicator**: `boolean`

Defined in: [src/components/layout/ScrollView.tsx:81](https://github.com/Baseline-Operations/react-console/blob/main/src/components/layout/ScrollView.tsx#L81)

Show vertical scroll indicator (default: true when content overflows)

---

### showsHorizontalScrollIndicator?

> `optional` **showsHorizontalScrollIndicator**: `boolean`

Defined in: [src/components/layout/ScrollView.tsx:83](https://github.com/Baseline-Operations/react-console/blob/main/src/components/layout/ScrollView.tsx#L83)

Show horizontal scroll indicator (default: true when content overflows)

---

### showsScrollIndicator?

> `optional` **showsScrollIndicator**: `boolean`

Defined in: [src/components/layout/ScrollView.tsx:85](https://github.com/Baseline-Operations/react-console/blob/main/src/components/layout/ScrollView.tsx#L85)

Legacy: Show scroll indicator (maps to vertical/horizontal based on direction)

---

### scrollbarStyle?

> `optional` **scrollbarStyle**: `ScrollbarStyle`

Defined in: [src/components/layout/ScrollView.tsx:89](https://github.com/Baseline-Operations/react-console/blob/main/src/components/layout/ScrollView.tsx#L89)

Custom scrollbar appearance

---

### scrollToEnd?

> `optional` **scrollToEnd**: `boolean`

Defined in: [src/components/layout/ScrollView.tsx:93](https://github.com/Baseline-Operations/react-console/blob/main/src/components/layout/ScrollView.tsx#L93)

Scroll to end when content changes (default: false)

---

### keyboardScrollEnabled?

> `optional` **keyboardScrollEnabled**: `boolean`

Defined in: [src/components/layout/ScrollView.tsx:95](https://github.com/Baseline-Operations/react-console/blob/main/src/components/layout/ScrollView.tsx#L95)

Enable keyboard scrolling when focused (default: true)

---

### scrollStep?

> `optional` **scrollStep**: `number`

Defined in: [src/components/layout/ScrollView.tsx:97](https://github.com/Baseline-Operations/react-console/blob/main/src/components/layout/ScrollView.tsx#L97)

Lines to scroll per key press (default: 1)

---

### stickyToBottom?

> `optional` **stickyToBottom**: `boolean`

Defined in: [src/components/layout/ScrollView.tsx:99](https://github.com/Baseline-Operations/react-console/blob/main/src/components/layout/ScrollView.tsx#L99)

Stay at bottom when new content is added (if already at bottom) (default: false)

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
