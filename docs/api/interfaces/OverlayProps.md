[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / OverlayProps

# Interface: OverlayProps

Defined in: src/components/layout/Overlay.tsx:22

Props for the Overlay component

Provides modal/popup functionality with layering and backdrop support.
Overlays render on top of other content with configurable z-index.

## Example

```tsx
<Overlay zIndex={2000} backdrop={true} backdropColor="black">
  <Text>Modal Content</Text>
</Overlay>
```

## Extends

- [`LayoutProps`](LayoutProps.md).[`StyleProps`](StyleProps.md)

## Properties

### children?

> `optional` **children**: `ReactNode`

Defined in: src/components/layout/Overlay.tsx:23

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: src/components/layout/Overlay.tsx:24

***

### backdrop?

> `optional` **backdrop**: `boolean`

Defined in: src/components/layout/Overlay.tsx:25

***

### backdropColor?

> `optional` **backdropColor**: `string`

Defined in: src/components/layout/Overlay.tsx:26

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
