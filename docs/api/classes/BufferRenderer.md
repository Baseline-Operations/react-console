[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / BufferRenderer

# Class: BufferRenderer

Defined in: [src/buffer/BufferRenderer.ts:78](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/BufferRenderer.ts#L78)

BufferRenderer - Main renderer class

## Constructors

### Constructor

> **new BufferRenderer**(): `BufferRenderer`

Defined in: [src/buffer/BufferRenderer.ts:84](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/BufferRenderer.ts#L84)

#### Returns

`BufferRenderer`

## Accessors

### lastContentHeight

#### Get Signature

> **get** **lastContentHeight**(): `number`

Defined in: [src/buffer/BufferRenderer.ts:93](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/BufferRenderer.ts#L93)

Get the actual content height from the last render

##### Returns

`number`

## Methods

### render()

> **render**(`root`, `options`): `void`

Defined in: [src/buffer/BufferRenderer.ts:100](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/BufferRenderer.ts#L100)

Main render function

#### Parameters

##### root

`Node`

##### options

`Partial`\<[`BufferRenderOptions`](../interfaces/BufferRenderOptions.md)\> = `{}`

#### Returns

`void`

---

### getCompositeBuffer()

> **getCompositeBuffer**(): [`CompositeBuffer`](CompositeBuffer.md)

Defined in: [src/buffer/BufferRenderer.ts:753](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/BufferRenderer.ts#L753)

Get the composite buffer (for debugging/testing)

#### Returns

[`CompositeBuffer`](CompositeBuffer.md)

---

### getDisplayBuffer()

> **getDisplayBuffer**(): [`DisplayBuffer`](DisplayBuffer.md)

Defined in: [src/buffer/BufferRenderer.ts:760](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/BufferRenderer.ts#L760)

Get the display buffer (for debugging/testing)

#### Returns

[`DisplayBuffer`](DisplayBuffer.md)

---

### invalidate()

> **invalidate**(): `void`

Defined in: [src/buffer/BufferRenderer.ts:767](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/BufferRenderer.ts#L767)

Force a full redraw on next render

#### Returns

`void`

---

### destroy()

> **destroy**(): `void`

Defined in: [src/buffer/BufferRenderer.ts:774](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/BufferRenderer.ts#L774)

Clean up resources

#### Returns

`void`
