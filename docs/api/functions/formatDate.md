[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / formatDate

# Function: formatDate()

> **formatDate**(`date`, `format`): `string`

Defined in: [src/utils/dateFormatting.ts:28](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/dateFormatting.ts#L28)

Format a date to a string

## Parameters

### date

Date object or timestamp

`number` | `Date`

### format

`string` = `'YYYY-MM-DD'`

Format string (default: 'YYYY-MM-DD')

## Returns

`string`

Formatted date string

Format tokens:

- YYYY: 4-digit year
- YY: 2-digit year
- MM: 2-digit month (01-12)
- M: Month (1-12)
- DD: 2-digit day (01-31)
- D: Day (1-31)
- HH: 2-digit hour (00-23)
- H: Hour (0-23)
- mm: 2-digit minute (00-59)
- m: Minute (0-59)
- ss: 2-digit second (00-59)
- s: Second (0-59)
- SSS: 3-digit milliseconds
- S: Milliseconds
