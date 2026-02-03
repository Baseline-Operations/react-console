[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / LayerManager

# Class: LayerManager

Defined in: [src/buffer/Layer.ts:102](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/Layer.ts#L102)

LayerManager - Manages all layers and their ordering

## Constructors

### Constructor

> **new LayerManager**(`terminalWidth`, `terminalHeight`): `LayerManager`

Defined in: [src/buffer/Layer.ts:107](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/Layer.ts#L107)

#### Parameters

##### terminalWidth

`number`

##### terminalHeight

`number`

#### Returns

`LayerManager`

## Accessors

### layerCount

#### Get Signature

> **get** **layerCount**(): `number`

Defined in: [src/buffer/Layer.ts:290](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/Layer.ts#L290)

Get layer count

##### Returns

`number`

## Methods

### createLayer()

> **createLayer**(`id`, `zIndex`, `bounds`, `nodeId`): [`Layer`](Layer.md)

Defined in: [src/buffer/Layer.ts:120](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/Layer.ts#L120)

Create a new layer

#### Parameters

##### id

`string`

##### zIndex

`number`

##### bounds

[`BoundingBox`](../interfaces/BoundingBox.md)

##### nodeId

`string` | `null`

#### Returns

[`Layer`](Layer.md)

---

### removeLayer()

> **removeLayer**(`id`): `boolean`

Defined in: [src/buffer/Layer.ts:146](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/Layer.ts#L146)

Remove a layer

#### Parameters

##### id

`string`

#### Returns

`boolean`

---

### getLayer()

> **getLayer**(`id`): [`Layer`](Layer.md) \| `null`

Defined in: [src/buffer/Layer.ts:161](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/Layer.ts#L161)

Get a layer by ID

#### Parameters

##### id

`string`

#### Returns

[`Layer`](Layer.md) \| `null`

---

### getRootLayer()

> **getRootLayer**(): [`Layer`](Layer.md)

Defined in: [src/buffer/Layer.ts:168](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/Layer.ts#L168)

Get the root layer

#### Returns

[`Layer`](Layer.md)

---

### hasLayer()

> **hasLayer**(`id`): `boolean`

Defined in: [src/buffer/Layer.ts:175](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/Layer.ts#L175)

Check if a layer exists

#### Parameters

##### id

`string`

#### Returns

`boolean`

---

### setZIndex()

> **setZIndex**(`layerId`, `zIndex`): `void`

Defined in: [src/buffer/Layer.ts:182](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/Layer.ts#L182)

Set z-index for a layer

#### Parameters

##### layerId

`string`

##### zIndex

`number`

#### Returns

`void`

---

### bringToFront()

> **bringToFront**(`layerId`): `void`

Defined in: [src/buffer/Layer.ts:193](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/Layer.ts#L193)

Bring a layer to the front (highest z-index)

#### Parameters

##### layerId

`string`

#### Returns

`void`

---

### sendToBack()

> **sendToBack**(`layerId`): `void`

Defined in: [src/buffer/Layer.ts:211](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/Layer.ts#L211)

Send a layer to the back (lowest z-index)

#### Parameters

##### layerId

`string`

#### Returns

`void`

---

### getSortedLayers()

> **getSortedLayers**(): [`Layer`](Layer.md)[]

Defined in: [src/buffer/Layer.ts:229](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/Layer.ts#L229)

Get layers sorted by z-index (lowest first)

#### Returns

[`Layer`](Layer.md)[]

---

### invalidateSortOrder()

> **invalidateSortOrder**(): `void`

Defined in: [src/buffer/Layer.ts:239](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/Layer.ts#L239)

Invalidate the cached sort order

#### Returns

`void`

---

### getLayersAtPoint()

> **getLayersAtPoint**(`x`, `y`): [`Layer`](Layer.md)[]

Defined in: [src/buffer/Layer.ts:246](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/Layer.ts#L246)

Get all layers that contain a point

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

[`Layer`](Layer.md)[]

---

### getLayerIds()

> **getLayerIds**(): `string`[]

Defined in: [src/buffer/Layer.ts:253](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/Layer.ts#L253)

Get all layer IDs

#### Returns

`string`[]

---

### clearAllLayers()

> **clearAllLayers**(): `void`

Defined in: [src/buffer/Layer.ts:260](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/Layer.ts#L260)

Clear all layers

#### Returns

`void`

---

### removeAllLayers()

> **removeAllLayers**(): `void`

Defined in: [src/buffer/Layer.ts:269](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/Layer.ts#L269)

Remove all layers except root

#### Returns

`void`

---

### resizeTerminal()

> **resizeTerminal**(`width`, `height`): `void`

Defined in: [src/buffer/Layer.ts:282](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/Layer.ts#L282)

Resize all layers based on terminal resize

#### Parameters

##### width

`number`

##### height

`number`

#### Returns

`void`
