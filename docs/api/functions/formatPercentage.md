[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / formatPercentage

# Function: formatPercentage()

> **formatPercentage**(`value`, `decimals`, `format`): `string`

Defined in: [src/utils/formatting.ts:113](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/formatting.ts#L113)

Format a percentage value

## Parameters

### value

`number`

The value to format. For `'decimal'` format, expects 0-1 range (e.g., 0.5 = 50%). For `'percent'` format, expects 0-100 range (e.g., 50 = 50%).

### decimals

`number` = `0`

Number of decimal places (default: 0).

### format

`"decimal"` | `"percent"`

Output format: `'decimal'` outputs "0.50" style, `'percent'` outputs "50%" style (default: `'percent'`).

## Returns

`string`

Formatted percentage string
