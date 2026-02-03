[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / DisplayBuffer

# Class: DisplayBuffer

Defined in: [src/buffer/DisplayBuffer.ts:26](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/DisplayBuffer.ts#L26)

DisplayBuffer - Terminal output manager with double buffering

## Constructors

### Constructor

> **new DisplayBuffer**(`width`, `height`): `DisplayBuffer`

Defined in: [src/buffer/DisplayBuffer.ts:36](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/DisplayBuffer.ts#L36)

#### Parameters

##### width

`number`

##### height

`number`

#### Returns

`DisplayBuffer`

## Accessors

### width

#### Get Signature

> **get** **width**(): `number`

Defined in: [src/buffer/DisplayBuffer.ts:47](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/DisplayBuffer.ts#L47)

Get buffer dimensions

##### Returns

`number`

---

### height

#### Get Signature

> **get** **height**(): `number`

Defined in: [src/buffer/DisplayBuffer.ts:51](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/DisplayBuffer.ts#L51)

##### Returns

`number`

---

### lastContentLine

#### Get Signature

> **get** **lastContentLine**(): `number`

Defined in: [src/buffer/DisplayBuffer.ts:59](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/DisplayBuffer.ts#L59)

Get the last line with content from the most recent flush
Returns 0-indexed line number

##### Returns

`number`

## Methods

### updateFromComposite()

> **updateFromComposite**(`composite`): `void`

Defined in: [src/buffer/DisplayBuffer.ts:66](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/DisplayBuffer.ts#L66)

Update pending buffer from a composite buffer

#### Parameters

##### composite

[`CellBuffer`](CellBuffer.md)

#### Returns

`void`

---

### getPendingBuffer()

> **getPendingBuffer**(): [`CellBuffer`](CellBuffer.md)

Defined in: [src/buffer/DisplayBuffer.ts:81](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/DisplayBuffer.ts#L81)

Get pending buffer for direct modification

#### Returns

[`CellBuffer`](CellBuffer.md)

---

### getDiff()

> **getDiff**(): [`CellDiff`](../interfaces/CellDiff.md)[]

Defined in: [src/buffer/DisplayBuffer.ts:88](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/DisplayBuffer.ts#L88)

Calculate diff between current and pending buffers

#### Returns

[`CellDiff`](../interfaces/CellDiff.md)[]

---

### flush()

> **flush**(`stream`, `_clearFirst`, `finalCursorPos?`): `void`

Defined in: [src/buffer/DisplayBuffer.ts:119](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/DisplayBuffer.ts#L119)

Flush entire pending buffer to terminal (full redraw)
Simple approach: clear screen, write from top, position cursor

#### Parameters

##### stream

`WriteStream` & `object`

Output stream

##### \_clearFirst

`boolean` = `true`

##### finalCursorPos?

Optional final cursor position

###### x

`number`

###### y

`number`

#### Returns

`void`

---

### flushDiff()

> **flushDiff**(`stream`): `void`

Defined in: [src/buffer/DisplayBuffer.ts:177](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/DisplayBuffer.ts#L177)

Flush only changed cells to terminal (diff-based update)

#### Parameters

##### stream

`WriteStream` & `object`

#### Returns

`void`

---

### setCursor()

> **setCursor**(`x`, `y`): `void`

Defined in: [src/buffer/DisplayBuffer.ts:305](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/DisplayBuffer.ts#L305)

Set cursor position for after flush

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

`void`

---

### getCursor()

> **getCursor**(): `object`

Defined in: [src/buffer/DisplayBuffer.ts:313](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/DisplayBuffer.ts#L313)

Get cursor position

#### Returns

`object`

##### x

> **x**: `number`

##### y

> **y**: `number`

---

### resize()

> **resize**(`width`, `height`): `void`

Defined in: [src/buffer/DisplayBuffer.ts:320](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/DisplayBuffer.ts#L320)

Resize buffers

#### Parameters

##### width

`number`

##### height

`number`

#### Returns

`void`

---

### clear()

> **clear**(): `void`

Defined in: [src/buffer/DisplayBuffer.ts:330](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/DisplayBuffer.ts#L330)

Clear both buffers

#### Returns

`void`

---

### moveCursor()

> `static` **moveCursor**(`x`, `y`): `string`

Defined in: [src/buffer/DisplayBuffer.ts:338](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/DisplayBuffer.ts#L338)

Generate ANSI escape sequence to move cursor

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

`string`

---

### clearScreen()

> `static` **clearScreen**(): `string`

Defined in: [src/buffer/DisplayBuffer.ts:345](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/DisplayBuffer.ts#L345)

Generate ANSI escape sequence to clear screen

#### Returns

`string`

---

### hideCursor()

> `static` **hideCursor**(): `string`

Defined in: [src/buffer/DisplayBuffer.ts:352](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/DisplayBuffer.ts#L352)

Generate ANSI escape sequence to hide cursor

#### Returns

`string`

---

### showCursor()

> `static` **showCursor**(): `string`

Defined in: [src/buffer/DisplayBuffer.ts:359](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/DisplayBuffer.ts#L359)

Generate ANSI escape sequence to show cursor

#### Returns

`string`
