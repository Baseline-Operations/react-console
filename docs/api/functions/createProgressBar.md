[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / createProgressBar

# Function: createProgressBar()

> **createProgressBar**(`current`, `total`, `width`, `filledChar`, `emptyChar`): `string`

Defined in: [src/utils/formatting.ts:201](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/formatting.ts#L201)

Create a progress bar string

## Parameters

### current

`number`

Current value

### total

`number`

Total value

### width

`number` = `20`

Bar width in characters (default: 20)

### filledChar

`string` = `'█'`

Character for filled portion (default: '█')

### emptyChar

`string` = `'░'`

Character for empty portion (default: '░')

## Returns

`string`

Progress bar string
