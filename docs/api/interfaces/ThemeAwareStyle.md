[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / ThemeAwareStyle

# Interface: ThemeAwareStyle

Defined in: src/theme/types.ts:117

Theme-aware style that can reference theme colors

## Extends

- `Omit`\<`ViewStyle`, `"color"` \| `"backgroundColor"`\>.`Omit`\<`TextStyle`, `"color"` \| `"backgroundColor"`\>

## Properties

### color?

> `optional` **color**: `string`

Defined in: src/theme/types.ts:119

Theme-aware color (can reference theme.colors.*)

***

### backgroundColor?

> `optional` **backgroundColor**: `string`

Defined in: src/theme/types.ts:121

Theme-aware background color (can reference theme.colors.*)

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

### position?

> `optional` **position**: `Position`

Defined in: src/types/index.ts:49

#### Inherited from

`Omit.position`

***

### top?

> `optional` **top**: `string` \| `number`

Defined in: src/types/index.ts:50

#### Inherited from

`Omit.top`

***

### left?

> `optional` **left**: `string` \| `number`

Defined in: src/types/index.ts:51

#### Inherited from

`Omit.left`

***

### right?

> `optional` **right**: `string` \| `number`

Defined in: src/types/index.ts:52

#### Inherited from

`Omit.right`

***

### bottom?

> `optional` **bottom**: `string` \| `number`

Defined in: src/types/index.ts:53

#### Inherited from

`Omit.bottom`

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: src/types/index.ts:54

#### Inherited from

`Omit.zIndex`

***

### display?

> `optional` **display**: `"flex"` \| `"block"` \| `"grid"` \| `"none"`

Defined in: src/types/index.ts:58

#### Inherited from

`Omit.display`

***

### flexDirection?

> `optional` **flexDirection**: `"row"` \| `"column"` \| `"row-reverse"` \| `"column-reverse"`

Defined in: src/types/index.ts:59

#### Inherited from

`Omit.flexDirection`

***

### flexWrap?

> `optional` **flexWrap**: `"nowrap"` \| `"wrap"` \| `"wrap-reverse"`

Defined in: src/types/index.ts:60

#### Inherited from

`Omit.flexWrap`

***

### justifyContent?

> `optional` **justifyContent**: `"flex-start"` \| `"flex-end"` \| `"center"` \| `"space-between"` \| `"space-around"` \| `"space-evenly"`

Defined in: src/types/index.ts:61

#### Inherited from

`Omit.justifyContent`

***

### alignItems?

> `optional` **alignItems**: `"flex-start"` \| `"flex-end"` \| `"center"` \| `"stretch"` \| `"baseline"`

Defined in: src/types/index.ts:62

#### Inherited from

`Omit.alignItems`

***

### alignContent?

> `optional` **alignContent**: `"flex-start"` \| `"flex-end"` \| `"center"` \| `"space-between"` \| `"space-around"` \| `"stretch"`

Defined in: src/types/index.ts:63

#### Inherited from

`Omit.alignContent`

***

### gap?

> `optional` **gap**: `number` \| \{ `row?`: `number`; `column?`: `number`; \}

Defined in: src/types/index.ts:64

#### Inherited from

`Omit.gap`

***

### rowGap?

> `optional` **rowGap**: `number`

Defined in: src/types/index.ts:65

#### Inherited from

`Omit.rowGap`

***

### columnGap?

> `optional` **columnGap**: `number`

Defined in: src/types/index.ts:66

#### Inherited from

`Omit.columnGap`

***

### flex?

> `optional` **flex**: `number`

Defined in: src/types/index.ts:67

#### Inherited from

`Omit.flex`

***

### flexGrow?

> `optional` **flexGrow**: `number`

Defined in: src/types/index.ts:68

#### Inherited from

`Omit.flexGrow`

***

### flexShrink?

> `optional` **flexShrink**: `number`

Defined in: src/types/index.ts:69

#### Inherited from

`Omit.flexShrink`

***

### flexBasis?

> `optional` **flexBasis**: [`ResponsiveSize`](../type-aliases/ResponsiveSize.md)

Defined in: src/types/index.ts:70

#### Inherited from

`Omit.flexBasis`

***

### order?

> `optional` **order**: `number`

Defined in: src/types/index.ts:71

#### Inherited from

`Omit.order`

***

### alignSelf?

> `optional` **alignSelf**: `"flex-start"` \| `"flex-end"` \| `"center"` \| `"stretch"` \| `"baseline"` \| `"auto"`

Defined in: src/types/index.ts:74

#### Inherited from

`Omit.alignSelf`

***

### gridTemplateColumns?

> `optional` **gridTemplateColumns**: `string` \| [`ResponsiveSize`](../type-aliases/ResponsiveSize.md)[]

Defined in: src/types/index.ts:77

#### Inherited from

`Omit.gridTemplateColumns`

***

### gridTemplateRows?

> `optional` **gridTemplateRows**: `string` \| [`ResponsiveSize`](../type-aliases/ResponsiveSize.md)[]

Defined in: src/types/index.ts:78

#### Inherited from

`Omit.gridTemplateRows`

***

### gridColumn?

> `optional` **gridColumn**: `string` \| `number`

Defined in: src/types/index.ts:79

#### Inherited from

`Omit.gridColumn`

***

### gridRow?

> `optional` **gridRow**: `string` \| `number`

Defined in: src/types/index.ts:80

#### Inherited from

`Omit.gridRow`

***

### gridColumnStart?

> `optional` **gridColumnStart**: `string` \| `number`

Defined in: src/types/index.ts:81

#### Inherited from

`Omit.gridColumnStart`

***

### gridColumnEnd?

> `optional` **gridColumnEnd**: `string` \| `number`

Defined in: src/types/index.ts:82

#### Inherited from

`Omit.gridColumnEnd`

***

### gridRowStart?

> `optional` **gridRowStart**: `string` \| `number`

Defined in: src/types/index.ts:83

#### Inherited from

`Omit.gridRowStart`

***

### gridRowEnd?

> `optional` **gridRowEnd**: `string` \| `number`

Defined in: src/types/index.ts:84

#### Inherited from

`Omit.gridRowEnd`

***

### gridArea?

> `optional` **gridArea**: `string`

Defined in: src/types/index.ts:85

#### Inherited from

`Omit.gridArea`

***

### gridGap?

> `optional` **gridGap**: `number` \| \{ `row?`: `number`; `column?`: `number`; \}

Defined in: src/types/index.ts:86

#### Inherited from

`Omit.gridGap`

***

### gridRowGap?

> `optional` **gridRowGap**: `number`

Defined in: src/types/index.ts:87

#### Inherited from

`Omit.gridRowGap`

***

### gridColumnGap?

> `optional` **gridColumnGap**: `number`

Defined in: src/types/index.ts:88

#### Inherited from

`Omit.gridColumnGap`

***

### justifyItems?

> `optional` **justifyItems**: `"center"` \| `"stretch"` \| `"start"` \| `"end"`

Defined in: src/types/index.ts:89

#### Inherited from

`Omit.justifyItems`

***

### justifySelf?

> `optional` **justifySelf**: `"center"` \| `"stretch"` \| `"start"` \| `"end"`

Defined in: src/types/index.ts:90

#### Inherited from

`Omit.justifySelf`

***

### placeItems?

> `optional` **placeItems**: `string`

Defined in: src/types/index.ts:91

#### Inherited from

`Omit.placeItems`

***

### placeSelf?

> `optional` **placeSelf**: `string`

Defined in: src/types/index.ts:92

#### Inherited from

`Omit.placeSelf`

***

### overflow?

> `optional` **overflow**: `"visible"` \| `"hidden"` \| `"scroll"`

Defined in: src/types/index.ts:95

#### Inherited from

`Omit.overflow`

***

### overflowX?

> `optional` **overflowX**: `"visible"` \| `"hidden"` \| `"scroll"`

Defined in: src/types/index.ts:96

#### Inherited from

`Omit.overflowX`

***

### overflowY?

> `optional` **overflowY**: `"visible"` \| `"hidden"` \| `"scroll"`

Defined in: src/types/index.ts:97

#### Inherited from

`Omit.overflowY`

***

### border?

> `optional` **border**: `boolean` \| \{ `top?`: `boolean`; `right?`: `boolean`; `bottom?`: `boolean`; `left?`: `boolean`; \}

Defined in: src/types/index.ts:100

#### Inherited from

`Omit.border`

***

### borderColor?

> `optional` **borderColor**: `string`

Defined in: src/types/index.ts:106

#### Inherited from

`Omit.borderColor`

***

### borderStyle?

> `optional` **borderStyle**: `"single"` \| `"double"` \| `"thick"` \| `"dashed"` \| `"dotted"`

Defined in: src/types/index.ts:107

#### Inherited from

`Omit.borderStyle`

***

### borderWidth?

> `optional` **borderWidth**: `number` \| \{ `top?`: `number`; `right?`: `number`; `bottom?`: `number`; `left?`: `number`; \}

Defined in: src/types/index.ts:108

#### Inherited from

`Omit.borderWidth`

***

### borderRadius?

> `optional` **borderRadius**: `number`

Defined in: src/types/index.ts:114

#### Inherited from

`Omit.borderRadius`

***

### textAlign?

> `optional` **textAlign**: `"left"` \| `"right"` \| `"center"` \| `"justify"`

Defined in: src/types/index.ts:122

#### Inherited from

`Omit.textAlign`

***

### textDecoration?

> `optional` **textDecoration**: `"underline"` \| `"none"` \| `"line-through"`

Defined in: src/types/index.ts:125

#### Inherited from

`Omit.textDecoration`

***

### letterSpacing?

> `optional` **letterSpacing**: `number`

Defined in: src/types/index.ts:128

#### Inherited from

`Omit.letterSpacing`

***

### lineHeight?

> `optional` **lineHeight**: `number`

Defined in: src/types/index.ts:131

#### Inherited from

`Omit.lineHeight`

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
