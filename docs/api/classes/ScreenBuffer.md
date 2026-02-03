[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / ScreenBuffer

# Class: ScreenBuffer

Defined in: [src/utils/console.ts:154](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/console.ts#L154)

Screen buffer utilities

## Constructors

### Constructor

> **new ScreenBuffer**(`width`, `height`): `ScreenBuffer`

Defined in: [src/utils/console.ts:159](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/console.ts#L159)

#### Parameters

##### width

`number`

##### height

`number`

#### Returns

`ScreenBuffer`

## Methods

### clear()

> **clear**(): `void`

Defined in: [src/utils/console.ts:168](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/console.ts#L168)

Clear the buffer

#### Returns

`void`

---

### setChar()

> **setChar**(`x`, `y`, `char`): `void`

Defined in: [src/utils/console.ts:180](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/console.ts#L180)

Set a character at a specific position

#### Parameters

##### x

`number`

Column (0-indexed)

##### y

`number`

Row (0-indexed)

##### char

`string`

Character to set

#### Returns

`void`

---

### setText()

> **setText**(`x`, `y`, `text`): `void`

Defined in: [src/utils/console.ts:192](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/console.ts#L192)

Set a string starting at a specific position

#### Parameters

##### x

`number`

Starting column (0-indexed)

##### y

`number`

Starting row (0-indexed)

##### text

`string`

Text to set

#### Returns

`void`

---

### getChar()

> **getChar**(`x`, `y`): `string`

Defined in: [src/utils/console.ts:206](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/console.ts#L206)

Get character at a specific position

#### Parameters

##### x

`number`

Column (0-indexed)

##### y

`number`

Row (0-indexed)

#### Returns

`string`

Character at position

---

### render()

> **render**(): `string`

Defined in: [src/utils/console.ts:217](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/console.ts#L217)

Render buffer to string

#### Returns

`string`

Rendered buffer as string

---

### getLines()

> **getLines**(): `string`[]

Defined in: [src/utils/console.ts:225](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/console.ts#L225)

Get buffer as array of lines

#### Returns

`string`[]

Array of lines

---

### resize()

> **resize**(`width`, `height`): `void`

Defined in: [src/utils/console.ts:234](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/console.ts#L234)

Resize buffer

#### Parameters

##### width

`number`

New width

##### height

`number`

New height

#### Returns

`void`
