[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / CellBuffer

# Class: CellBuffer

Defined in: [src/buffer/CellBuffer.ts:21](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CellBuffer.ts#L21)

CellBuffer - A 2D grid of cells with dirty region tracking

## Constructors

### Constructor

> **new CellBuffer**(`width`, `height`): `CellBuffer`

Defined in: [src/buffer/CellBuffer.ts:28](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CellBuffer.ts#L28)

#### Parameters

##### width

`number`

##### height

`number`

#### Returns

`CellBuffer`

## Accessors

### width

#### Get Signature

> **get** **width**(): `number`

Defined in: [src/buffer/CellBuffer.ts:55](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CellBuffer.ts#L55)

Get buffer width

##### Returns

`number`

---

### height

#### Get Signature

> **get** **height**(): `number`

Defined in: [src/buffer/CellBuffer.ts:62](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CellBuffer.ts#L62)

Get buffer height

##### Returns

`number`

## Methods

### isInBounds()

> **isInBounds**(`x`, `y`): `boolean`

Defined in: [src/buffer/CellBuffer.ts:69](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CellBuffer.ts#L69)

Check if coordinates are within bounds

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

`boolean`

---

### getCell()

> **getCell**(`x`, `y`): [`Cell`](../interfaces/Cell.md) \| `null`

Defined in: [src/buffer/CellBuffer.ts:79](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CellBuffer.ts#L79)

Get cell at position

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

[`Cell`](../interfaces/Cell.md) \| `null`

---

### setCell()

> **setCell**(`x`, `y`, `cellData`): `void`

Defined in: [src/buffer/CellBuffer.ts:93](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CellBuffer.ts#L93)

Set cell at position
Respects z-index: higher z-index content won't be overwritten by lower z-index
from DIFFERENT nodes (nodeId comparison)

#### Parameters

##### x

`number`

##### y

`number`

##### cellData

`PartialCell`

#### Returns

`void`

---

### setChar()

> **setChar**(`x`, `y`, `char`, `foreground?`, `background?`, `styles?`): `void`

Defined in: [src/buffer/CellBuffer.ts:136](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CellBuffer.ts#L136)

Set a character at position with optional style

#### Parameters

##### x

`number`

##### y

`number`

##### char

`string`

##### foreground?

`string` | `null`

##### background?

`string` | `null`

##### styles?

###### bold?

`boolean`

###### dim?

`boolean`

###### italic?

`boolean`

###### underline?

`boolean`

###### strikethrough?

`boolean`

###### inverse?

`boolean`

#### Returns

`void`

---

### fillRegion()

> **fillRegion**(`x`, `y`, `width`, `height`, `cellData`): `void`

Defined in: [src/buffer/CellBuffer.ts:162](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CellBuffer.ts#L162)

Fill a region with a cell value

#### Parameters

##### x

`number`

##### y

`number`

##### width

`number`

##### height

`number`

##### cellData

`PartialCell`

#### Returns

`void`

---

### fillBackground()

> **fillBackground**(`x`, `y`, `width`, `height`, `background`, `layerId?`, `nodeId?`, `zIndex?`): `void`

Defined in: [src/buffer/CellBuffer.ts:179](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CellBuffer.ts#L179)

Fill a region with a background color
Also fills with space characters to fully overwrite any existing content

#### Parameters

##### x

`number`

##### y

`number`

##### width

`number`

##### height

`number`

##### background

`string` | `null`

##### layerId?

`string`

##### nodeId?

`string` | `null`

##### zIndex?

`number`

#### Returns

`void`

---

### clearRegion()

> **clearRegion**(`x`, `y`, `width`, `height`): `void`

Defined in: [src/buffer/CellBuffer.ts:201](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CellBuffer.ts#L201)

Clear a region (reset to empty cells)

#### Parameters

##### x

`number`

##### y

`number`

##### width

`number`

##### height

`number`

#### Returns

`void`

---

### clear()

> **clear**(): `void`

Defined in: [src/buffer/CellBuffer.ts:219](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CellBuffer.ts#L219)

Clear entire buffer

#### Returns

`void`

---

### resize()

> **resize**(`newWidth`, `newHeight`): `void`

Defined in: [src/buffer/CellBuffer.ts:228](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CellBuffer.ts#L228)

Resize buffer (preserving content where possible)

#### Parameters

##### newWidth

`number`

##### newHeight

`number`

#### Returns

`void`

---

### markDirty()

> **markDirty**(`x`, `y`, `width`, `height`): `void`

Defined in: [src/buffer/CellBuffer.ts:272](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CellBuffer.ts#L272)

Mark a region as dirty

#### Parameters

##### x

`number`

##### y

`number`

##### width

`number`

##### height

`number`

#### Returns

`void`

---

### markAllDirty()

> **markAllDirty**(): `void`

Defined in: [src/buffer/CellBuffer.ts:289](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CellBuffer.ts#L289)

Mark entire buffer as dirty

#### Returns

`void`

---

### markClean()

> **markClean**(): `void`

Defined in: [src/buffer/CellBuffer.ts:297](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CellBuffer.ts#L297)

Mark all cells as clean

#### Returns

`void`

---

### isDirty()

> **isDirty**(): `boolean`

Defined in: [src/buffer/CellBuffer.ts:311](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CellBuffer.ts#L311)

Check if buffer has any dirty cells

#### Returns

`boolean`

---

### getDirtyRegions()

> **getDirtyRegions**(): `DirtyRegion`[]

Defined in: [src/buffer/CellBuffer.ts:318](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CellBuffer.ts#L318)

Get all dirty regions (optimized as bounding boxes)

#### Returns

`DirtyRegion`[]

---

### getDirtyCells()

> **getDirtyCells**(): `object`[]

Defined in: [src/buffer/CellBuffer.ts:372](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CellBuffer.ts#L372)

Get dirty cells as an array

#### Returns

`object`[]

---

### forEach()

> **forEach**(`callback`): `void`

Defined in: [src/buffer/CellBuffer.ts:390](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CellBuffer.ts#L390)

Iterate over all cells

#### Parameters

##### callback

(`cell`, `x`, `y`) => `void`

#### Returns

`void`

---

### forEachInRegion()

> **forEachInRegion**(`region`, `callback`): `void`

Defined in: [src/buffer/CellBuffer.ts:401](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CellBuffer.ts#L401)

Iterate over a region

#### Parameters

##### region

[`BufferBoundingBox`](../interfaces/BufferBoundingBox.md)

##### callback

(`cell`, `x`, `y`) => `void`

#### Returns

`void`

---

### getRow()

> **getRow**(`y`): [`Cell`](../interfaces/Cell.md)[] \| `null`

Defined in: [src/buffer/CellBuffer.ts:417](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CellBuffer.ts#L417)

Get a row of cells

#### Parameters

##### y

`number`

#### Returns

[`Cell`](../interfaces/Cell.md)[] \| `null`

---

### getColumn()

> **getColumn**(`x`): [`Cell`](../interfaces/Cell.md)[] \| `null`

Defined in: [src/buffer/CellBuffer.ts:427](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CellBuffer.ts#L427)

Get a column of cells

#### Parameters

##### x

`number`

#### Returns

[`Cell`](../interfaces/Cell.md)[] \| `null`

---

### copyRegion()

> **copyRegion**(`region`): `CellBuffer`

Defined in: [src/buffer/CellBuffer.ts:437](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CellBuffer.ts#L437)

Copy a region from this buffer

#### Parameters

##### region

[`BufferBoundingBox`](../interfaces/BufferBoundingBox.md)

#### Returns

`CellBuffer`

---

### pasteBuffer()

> **pasteBuffer**(`source`, `x`, `y`): `void`

Defined in: [src/buffer/CellBuffer.ts:455](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CellBuffer.ts#L455)

Paste a buffer into this buffer at position

#### Parameters

##### source

`CellBuffer`

##### x

`number`

##### y

`number`

#### Returns

`void`

---

### writeString()

> **writeString**(`x`, `y`, `text`, `foreground?`, `background?`, `styles?`, `options?`): `number`

Defined in: [src/buffer/CellBuffer.ts:469](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CellBuffer.ts#L469)

Write a string horizontally starting at position

#### Parameters

##### x

`number`

##### y

`number`

##### text

`string`

##### foreground?

`string` | `null`

##### background?

`string` | `null`

##### styles?

###### bold?

`boolean`

###### dim?

`boolean`

###### italic?

`boolean`

###### underline?

`boolean`

###### strikethrough?

`boolean`

###### inverse?

`boolean`

##### options?

###### layerId?

`string`

###### nodeId?

`string` \| `null`

###### zIndex?

`number`

#### Returns

`number`

---

### clone()

> **clone**(): `CellBuffer`

Defined in: [src/buffer/CellBuffer.ts:515](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/CellBuffer.ts#L515)

Create a clone of this buffer

#### Returns

`CellBuffer`
