[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / TextProps

# Interface: TextProps

Defined in: [src/components/primitives/Text.tsx:31](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Text.tsx#L31)

Props for the Text component

Supports all text styling options including colors, background colors,
and text decorations (bold, italic, underline, etc.).

## Example

```tsx
<Text color="red" bold>Important Text</Text>

<Text style={{ color: 'cyan', bold: true, underline: true }}>
  Styled Text
</Text>

// Nested Text for inline styling
<Text>
  Normal text <Text bold>bold text</Text> more normal
</Text>
```

## Properties

### children?

> `optional` **children**: `ReactNode`

Defined in: [src/components/primitives/Text.tsx:32](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Text.tsx#L32)

---

### style?

> `optional` **style**: `TextStyle` \| `TextStyle`[]

Defined in: [src/components/primitives/Text.tsx:33](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Text.tsx#L33)

---

### className?

> `optional` **className**: `string` \| `string`[]

Defined in: [src/components/primitives/Text.tsx:34](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Text.tsx#L34)

---

### color?

> `optional` **color**: `string`

Defined in: [src/components/primitives/Text.tsx:36](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Text.tsx#L36)

---

### backgroundColor?

> `optional` **backgroundColor**: `string`

Defined in: [src/components/primitives/Text.tsx:37](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Text.tsx#L37)

---

### bold?

> `optional` **bold**: `boolean`

Defined in: [src/components/primitives/Text.tsx:38](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Text.tsx#L38)

---

### dim?

> `optional` **dim**: `boolean`

Defined in: [src/components/primitives/Text.tsx:39](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Text.tsx#L39)

---

### italic?

> `optional` **italic**: `boolean`

Defined in: [src/components/primitives/Text.tsx:40](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Text.tsx#L40)

---

### underline?

> `optional` **underline**: `boolean`

Defined in: [src/components/primitives/Text.tsx:41](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Text.tsx#L41)

---

### strikethrough?

> `optional` **strikethrough**: `boolean`

Defined in: [src/components/primitives/Text.tsx:42](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Text.tsx#L42)

---

### inverse?

> `optional` **inverse**: `boolean`

Defined in: [src/components/primitives/Text.tsx:43](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Text.tsx#L43)

---

### textAlign?

> `optional` **textAlign**: `"left"` \| `"right"` \| `"center"` \| `"justify"`

Defined in: [src/components/primitives/Text.tsx:44](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Text.tsx#L44)
