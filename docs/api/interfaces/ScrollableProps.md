[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / ScrollableProps

# Interface: ScrollableProps

Defined in: src/components/layout/Scrollable.tsx:22

Props for the Scrollable component

Provides scrollable container functionality for overflow content.
Supports vertical and horizontal scrolling with scroll position control.

## Example

```tsx
<Scrollable scrollTop={10} maxHeight={20}>
  <Text>Long content that overflows</Text>
</Scrollable>
```

## Extends

- [`LayoutProps`](LayoutProps.md).[`StyleProps`](StyleProps.md)

## Properties

### children?

> `optional` **children**: `ReactNode`

Defined in: src/components/layout/Scrollable.tsx:23

***

### scrollTop?

> `optional` **scrollTop**: `number`

Defined in: src/components/layout/Scrollable.tsx:24

***

### scrollLeft?

> `optional` **scrollLeft**: `number`

Defined in: src/components/layout/Scrollable.tsx:25

***

### maxHeight?

> `optional` **maxHeight**: `number`

Defined in: src/components/layout/Scrollable.tsx:26

***

### maxWidth?

> `optional` **maxWidth**: `number`

Defined in: src/components/layout/Scrollable.tsx:27

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
