[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / CompositeBuffer

# Class: CompositeBuffer

Defined in: [src/buffer/CompositeBuffer.ts:15](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CompositeBuffer.ts#L15)

CompositeBuffer - Manages layer compositing

## Constructors

### Constructor

> **new CompositeBuffer**(`width`, `height`): `CompositeBuffer`

Defined in: [src/buffer/CompositeBuffer.ts:21](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CompositeBuffer.ts#L21)

#### Parameters

##### width

`number`

##### height

`number`

#### Returns

`CompositeBuffer`

## Accessors

### width

#### Get Signature

> **get** **width**(): `number`

Defined in: [src/buffer/CompositeBuffer.ts:31](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CompositeBuffer.ts#L31)

Get buffer width

##### Returns

`number`

---

### height

#### Get Signature

> **get** **height**(): `number`

Defined in: [src/buffer/CompositeBuffer.ts:38](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CompositeBuffer.ts#L38)

Get buffer height

##### Returns

`number`

## Methods

### getLayerManager()

> **getLayerManager**(): [`LayerManager`](LayerManager.md)

Defined in: [src/buffer/CompositeBuffer.ts:45](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CompositeBuffer.ts#L45)

Get the layer manager

#### Returns

[`LayerManager`](LayerManager.md)

---

### createLayer()

> **createLayer**(`id`, `zIndex`, `bounds`, `nodeId`): [`CellBuffer`](CellBuffer.md)

Defined in: [src/buffer/CompositeBuffer.ts:52](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CompositeBuffer.ts#L52)

Create a new layer and return its buffer

#### Parameters

##### id

`string`

##### zIndex

`number`

##### bounds

[`BufferBoundingBox`](../interfaces/BufferBoundingBox.md)

##### nodeId

`string` | `null`

#### Returns

[`CellBuffer`](CellBuffer.md)

---

### getLayerBuffer()

> **getLayerBuffer**(`id`): [`CellBuffer`](CellBuffer.md) \| `null`

Defined in: [src/buffer/CompositeBuffer.ts:65](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CompositeBuffer.ts#L65)

Get a layer's buffer by ID

#### Parameters

##### id

`string`

#### Returns

[`CellBuffer`](CellBuffer.md) \| `null`

---

### getRootBuffer()

> **getRootBuffer**(): [`CellBuffer`](CellBuffer.md)

Defined in: [src/buffer/CompositeBuffer.ts:73](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CompositeBuffer.ts#L73)

Get the root layer's buffer

#### Returns

[`CellBuffer`](CellBuffer.md)

---

### removeLayer()

> **removeLayer**(`id`): `boolean`

Defined in: [src/buffer/CompositeBuffer.ts:80](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CompositeBuffer.ts#L80)

Remove a layer

#### Parameters

##### id

`string`

#### Returns

`boolean`

---

### clearAllLayers()

> **clearAllLayers**(): `void`

Defined in: [src/buffer/CompositeBuffer.ts:87](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CompositeBuffer.ts#L87)

Clear all layers

#### Returns

`void`

---

### resetLayers()

> **resetLayers**(): `void`

Defined in: [src/buffer/CompositeBuffer.ts:94](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CompositeBuffer.ts#L94)

Remove all layers except root

#### Returns

`void`

---

### composite()

> **composite**(): `void`

Defined in: [src/buffer/CompositeBuffer.ts:110](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CompositeBuffer.ts#L110)

Composite all layers into the result buffer

Algorithm:

1. Start with empty result buffer
2. For each position (x, y):
   - Collect cells from all layers at this position (sorted by z-index)
   - Composite from bottom to top:
     - If cell has visible content, use it
     - If cell has background but transparent content, inherit background
     - Text styles come from the topmost visible content

#### Returns

`void`

---

### compositeRegion()

> **compositeRegion**(`region`): `void`

Defined in: [src/buffer/CompositeBuffer.ts:130](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CompositeBuffer.ts#L130)

Composite a specific region only (for partial updates)

#### Parameters

##### region

[`BufferBoundingBox`](../interfaces/BufferBoundingBox.md)

#### Returns

`void`

---

### getCompositeBuffer()

> **getCompositeBuffer**(): [`CellBuffer`](CellBuffer.md)

Defined in: [src/buffer/CompositeBuffer.ts:226](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CompositeBuffer.ts#L226)

Get the composited result buffer

#### Returns

[`CellBuffer`](CellBuffer.md)

---

### resize()

> **resize**(`width`, `height`): `void`

Defined in: [src/buffer/CompositeBuffer.ts:233](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CompositeBuffer.ts#L233)

Resize the composite buffer and all layers

#### Parameters

##### width

`number`

##### height

`number`

#### Returns

`void`

---

### getCell()

> **getCell**(`x`, `y`): [`Cell`](../interfaces/Cell.md) \| `null`

Defined in: [src/buffer/CompositeBuffer.ts:243](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CompositeBuffer.ts#L243)

Get cell at position from composited result

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

[`Cell`](../interfaces/Cell.md) \| `null`

---

### isDirty()

> **isDirty**(): `boolean`

Defined in: [src/buffer/CompositeBuffer.ts:250](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CompositeBuffer.ts#L250)

Check if compositing produced any dirty cells

#### Returns

`boolean`

---

### getDirtyRegions()

> **getDirtyRegions**(): [`BufferBoundingBox`](../interfaces/BufferBoundingBox.md)[]

Defined in: [src/buffer/CompositeBuffer.ts:257](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CompositeBuffer.ts#L257)

Get dirty regions from composite result

#### Returns

[`BufferBoundingBox`](../interfaces/BufferBoundingBox.md)[]
