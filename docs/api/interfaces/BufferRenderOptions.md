[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / BufferRenderOptions

# Interface: BufferRenderOptions

Defined in: [src/buffer/types.ts:88](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/types.ts#L88)

Render Options for the buffer renderer

## Properties

### mode

> **mode**: `"static"` \| `"interactive"` \| `"fullscreen"`

Defined in: [src/buffer/types.ts:89](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/types.ts#L89)

---

### fullRedraw

> **fullRedraw**: `boolean`

Defined in: [src/buffer/types.ts:90](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/types.ts#L90)

---

### clearScreen

> **clearScreen**: `boolean`

Defined in: [src/buffer/types.ts:91](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/types.ts#L91)

---

### cursorPosition?

> `optional` **cursorPosition**: `object`

Defined in: [src/buffer/types.ts:93](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/types.ts#L93)

Final cursor position to set after rendering (applied during buffer flush to avoid visual artifacts)

#### x

> **x**: `number`

#### y

> **y**: `number`
