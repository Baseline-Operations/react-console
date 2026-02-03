[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / ANSIGenerator

# Class: ANSIGenerator

Defined in: [src/buffer/ANSIGenerator.ts:58](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/ANSIGenerator.ts#L58)

ANSIGenerator - Efficient ANSI code generation

## Constructors

### Constructor

> **new ANSIGenerator**(): `ANSIGenerator`

#### Returns

`ANSIGenerator`

## Methods

### cellToANSI()

> **cellToANSI**(`cell`): `string`

Defined in: [src/buffer/ANSIGenerator.ts:62](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/ANSIGenerator.ts#L62)

Convert a cell to ANSI escape codes + character

#### Parameters

##### cell

[`Cell`](../interfaces/Cell.md)

#### Returns

`string`

---

### transitionCodes()

> **transitionCodes**(`from`, `to`): `string`

Defined in: [src/buffer/ANSIGenerator.ts:174](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/ANSIGenerator.ts#L174)

Generate minimal codes when transitioning between cells
Returns codes to transition from `from` cell styling to `to` cell styling

#### Parameters

##### from

[`Cell`](../interfaces/Cell.md) | `null`

##### to

[`Cell`](../interfaces/Cell.md)

#### Returns

`string`

---

### lineToANSI()

> **lineToANSI**(`cells`): `string`

Defined in: [src/buffer/ANSIGenerator.ts:256](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/ANSIGenerator.ts#L256)

Generate full line output

#### Parameters

##### cells

[`Cell`](../interfaces/Cell.md)[]

#### Returns

`string`

---

### bufferToANSI()

> **bufferToANSI**(`cells`, `_width`, `height`): `string`

Defined in: [src/buffer/ANSIGenerator.ts:275](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/ANSIGenerator.ts#L275)

Generate full buffer output

#### Parameters

##### cells

[`Cell`](../interfaces/Cell.md)[][]

##### \_width

`number`

##### height

`number`

#### Returns

`string`

---

### stripANSI()

> `static` **stripANSI**(`text`): `string`

Defined in: [src/buffer/ANSIGenerator.ts:293](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/ANSIGenerator.ts#L293)

Strip all ANSI codes from text

#### Parameters

##### text

`string`

#### Returns

`string`

---

### visibleLength()

> `static` **visibleLength**(`text`): `number`

Defined in: [src/buffer/ANSIGenerator.ts:300](https://github.com/Baseline-Operations/react-console/blob/main/src/buffer/ANSIGenerator.ts#L300)

Get visible length of text (without ANSI codes)

#### Parameters

##### text

`string`

#### Returns

`number`
