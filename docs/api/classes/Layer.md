[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / Layer

# Class: Layer

Defined in: [src/buffer/Layer.ts:14](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/Layer.ts#L14)

Layer - A rendering layer with its own cell buffer

## Implements

- [`LayerInfo`](../interfaces/LayerInfo.md)

## Constructors

### Constructor

> **new Layer**(`id`, `zIndex`, `bounds`, `nodeId`): `Layer`

Defined in: [src/buffer/Layer.ts:23](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/Layer.ts#L23)

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

`Layer`

## Properties

### id

> `readonly` **id**: `string`

Defined in: [src/buffer/Layer.ts:15](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/Layer.ts#L15)

#### Implementation of

[`LayerInfo`](../interfaces/LayerInfo.md).[`id`](../interfaces/LayerInfo.md#id)

---

### zIndex

> **zIndex**: `number`

Defined in: [src/buffer/Layer.ts:16](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/Layer.ts#L16)

#### Implementation of

[`LayerInfo`](../interfaces/LayerInfo.md).[`zIndex`](../interfaces/LayerInfo.md#zindex)

---

### visible

> **visible**: `boolean`

Defined in: [src/buffer/Layer.ts:17](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/Layer.ts#L17)

#### Implementation of

[`LayerInfo`](../interfaces/LayerInfo.md).[`visible`](../interfaces/LayerInfo.md#visible)

---

### opacity

> **opacity**: `number`

Defined in: [src/buffer/Layer.ts:18](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/Layer.ts#L18)

#### Implementation of

[`LayerInfo`](../interfaces/LayerInfo.md).[`opacity`](../interfaces/LayerInfo.md#opacity)

---

### bounds

> **bounds**: [`BufferBoundingBox`](../interfaces/BufferBoundingBox.md)

Defined in: [src/buffer/Layer.ts:19](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/Layer.ts#L19)

#### Implementation of

[`LayerInfo`](../interfaces/LayerInfo.md).[`bounds`](../interfaces/LayerInfo.md#bounds)

---

### nodeId

> **nodeId**: `string` \| `null`

Defined in: [src/buffer/Layer.ts:20](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/Layer.ts#L20)

#### Implementation of

[`LayerInfo`](../interfaces/LayerInfo.md).[`nodeId`](../interfaces/LayerInfo.md#nodeid)

---

### buffer

> **buffer**: [`CellBuffer`](CellBuffer.md)

Defined in: [src/buffer/Layer.ts:21](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/Layer.ts#L21)

## Methods

### getBuffer()

> **getBuffer**(): [`CellBuffer`](CellBuffer.md)

Defined in: [src/buffer/Layer.ts:38](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/Layer.ts#L38)

Get the layer's cell buffer

#### Returns

[`CellBuffer`](CellBuffer.md)

---

### clear()

> **clear**(): `void`

Defined in: [src/buffer/Layer.ts:45](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/Layer.ts#L45)

Clear the layer's buffer

#### Returns

`void`

---

### resize()

> **resize**(`width`, `height`): `void`

Defined in: [src/buffer/Layer.ts:52](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/Layer.ts#L52)

Resize the layer

#### Parameters

##### width

`number`

##### height

`number`

#### Returns

`void`

---

### moveTo()

> **moveTo**(`x`, `y`): `void`

Defined in: [src/buffer/Layer.ts:61](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/Layer.ts#L61)

Move the layer to a new position

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

`void`

---

### containsPoint()

> **containsPoint**(`x`, `y`): `boolean`

Defined in: [src/buffer/Layer.ts:69](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/Layer.ts#L69)

Check if a point is within this layer's bounds

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

`boolean`

---

### toLocalCoords()

> **toLocalCoords**(`globalX`, `globalY`): `object`

Defined in: [src/buffer/Layer.ts:81](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/Layer.ts#L81)

Convert global coordinates to layer-local coordinates

#### Parameters

##### globalX

`number`

##### globalY

`number`

#### Returns

`object`

##### x

> **x**: `number`

##### y

> **y**: `number`

---

### toGlobalCoords()

> **toGlobalCoords**(`localX`, `localY`): `object`

Defined in: [src/buffer/Layer.ts:91](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/Layer.ts#L91)

Convert layer-local coordinates to global coordinates

#### Parameters

##### localX

`number`

##### localY

`number`

#### Returns

`object`

##### x

> **x**: `number`

##### y

> **y**: `number`
