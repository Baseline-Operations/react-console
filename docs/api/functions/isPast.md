[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / isPast

# Function: isPast()

> **isPast**(`date`): `boolean`

Defined in: [src/utils/dateFormatting.ts:268](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/dateFormatting.ts#L268)

Check if a date is in the past

Compares the given date against `Date.now()` using the local timezone.
Returns `true` if the date is strictly before the current time (equality returns `false`).

## Parameters

### date

`number` | `Date`

Date object or timestamp (milliseconds since Unix epoch).

## Returns

`boolean`

`true` if the date is strictly in the past, `false` if equal to or after current time.
