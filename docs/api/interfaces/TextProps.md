[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / TextProps

# Interface: TextProps

Defined in: src/components/primitives/Text.tsx:31

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

Defined in: src/components/primitives/Text.tsx:32

***

### style?

> `optional` **style**: `TextStyle` \| `TextStyle`[]

Defined in: src/components/primitives/Text.tsx:33

***

### color?

> `optional` **color**: `string`

Defined in: src/components/primitives/Text.tsx:35

***

### backgroundColor?

> `optional` **backgroundColor**: `string`

Defined in: src/components/primitives/Text.tsx:36

***

### bold?

> `optional` **bold**: `boolean`

Defined in: src/components/primitives/Text.tsx:37

***

### dim?

> `optional` **dim**: `boolean`

Defined in: src/components/primitives/Text.tsx:38

***

### italic?

> `optional` **italic**: `boolean`

Defined in: src/components/primitives/Text.tsx:39

***

### underline?

> `optional` **underline**: `boolean`

Defined in: src/components/primitives/Text.tsx:40

***

### strikethrough?

> `optional` **strikethrough**: `boolean`

Defined in: src/components/primitives/Text.tsx:41

***

### inverse?

> `optional` **inverse**: `boolean`

Defined in: src/components/primitives/Text.tsx:42

***

### textAlign?

> `optional` **textAlign**: `"left"` \| `"right"` \| `"center"` \| `"justify"`

Defined in: src/components/primitives/Text.tsx:43
