[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / BoxProps

# Interface: BoxProps

Defined in: [src/components/primitives/Box.tsx:24](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Box.tsx#L24)

Props for the Box component

## Example

```tsx
<Box
  style={{ border: 'single', padding: 2, backgroundColor: 'blue' }}
  scrollable={true}
  scrollbarVisibility="auto"
>
  <Text>Content here</Text>
</Box>
```

## Properties

### children?

> `optional` **children**: `ReactNode`

Defined in: [src/components/primitives/Box.tsx:25](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Box.tsx#L25)

---

### style?

> `optional` **style**: `ViewStyle` \| `ViewStyle`[]

Defined in: [src/components/primitives/Box.tsx:26](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Box.tsx#L26)

---

### className?

> `optional` **className**: `string` \| `string`[]

Defined in: [src/components/primitives/Box.tsx:27](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Box.tsx#L27)

CSS-like class names for styling. Can be a single string or an array of class names. When multiple classes are provided, their styles are merged in order. Works with style libraries that support class-based styling.

---

### fullscreen?

> `optional` **fullscreen**: `boolean`

Defined in: [src/components/primitives/Box.tsx:28](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Box.tsx#L28)

---

### scrollable?

> `optional` **scrollable**: `boolean`

Defined in: [src/components/primitives/Box.tsx:30](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Box.tsx#L30)

---

### scrollbarVisibility?

> `optional` **scrollbarVisibility**: `"auto"` \| `"hidden"` \| `"always"`

Defined in: [src/components/primitives/Box.tsx:31](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Box.tsx#L31)

---

### horizontalScrollbar?

> `optional` **horizontalScrollbar**: `"auto"` \| `"hidden"` \| `"always"`

Defined in: [src/components/primitives/Box.tsx:32](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Box.tsx#L32)

---

### verticalScrollbar?

> `optional` **verticalScrollbar**: `"auto"` \| `"hidden"` \| `"always"`

Defined in: [src/components/primitives/Box.tsx:33](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Box.tsx#L33)

---

### scrollbarChar?

> `optional` **scrollbarChar**: `string`

Defined in: [src/components/primitives/Box.tsx:34](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Box.tsx#L34)

---

### scrollbarTrackChar?

> `optional` **scrollbarTrackChar**: `string`

Defined in: [src/components/primitives/Box.tsx:35](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Box.tsx#L35)

---

### scrollTop?

> `optional` **scrollTop**: `number`

Defined in: [src/components/primitives/Box.tsx:36](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Box.tsx#L36)

---

### scrollLeft?

> `optional` **scrollLeft**: `number`

Defined in: [src/components/primitives/Box.tsx:37](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Box.tsx#L37)

---

### color?

> `optional` **color**: `string`

Defined in: [src/components/primitives/Box.tsx:39](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Box.tsx#L39)

---

### backgroundColor?

> `optional` **backgroundColor**: `string`

Defined in: [src/components/primitives/Box.tsx:40](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Box.tsx#L40)

---

### padding?

> `optional` **padding**: `number` \| \{ `top?`: `number`; `right?`: `number`; `bottom?`: `number`; `left?`: `number`; \}

Defined in: [src/components/primitives/Box.tsx:41](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Box.tsx#L41)

---

### margin?

> `optional` **margin**: `number` \| \{ `top?`: `number`; `right?`: `number`; `bottom?`: `number`; `left?`: `number`; \}

Defined in: [src/components/primitives/Box.tsx:42](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Box.tsx#L42)

---

### width?

> `optional` **width**: [`ResponsiveSize`](../type-aliases/ResponsiveSize.md)

Defined in: [src/components/primitives/Box.tsx:43](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Box.tsx#L43)

---

### height?

> `optional` **height**: [`ResponsiveSize`](../type-aliases/ResponsiveSize.md)

Defined in: [src/components/primitives/Box.tsx:44](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Box.tsx#L44)

---

### position?

> `optional` **position**: `Position`

Defined in: [src/components/primitives/Box.tsx:45](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Box.tsx#L45)

---

### top?

> `optional` **top**: `string` \| `number`

Defined in: [src/components/primitives/Box.tsx:46](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Box.tsx#L46)

---

### left?

> `optional` **left**: `string` \| `number`

Defined in: [src/components/primitives/Box.tsx:47](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Box.tsx#L47)

---

### right?

> `optional` **right**: `string` \| `number`

Defined in: [src/components/primitives/Box.tsx:48](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Box.tsx#L48)

---

### bottom?

> `optional` **bottom**: `string` \| `number`

Defined in: [src/components/primitives/Box.tsx:49](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Box.tsx#L49)

---

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components/primitives/Box.tsx:50](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Box.tsx#L50)
