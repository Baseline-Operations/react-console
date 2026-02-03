[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / isFuture

# Function: isFuture()

> **isFuture**(`date`): `boolean`

Defined in: [src/utils/dateFormatting.ts:278](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/dateFormatting.ts#L278)

Check if a date is in the future

Compares the given date against `Date.now()` using the local timezone.
Returns `true` if the date is strictly after the current time (equality returns `false`).

## Parameters

### date

`number` | `Date`

Date object or timestamp (milliseconds since Unix epoch).

## Returns

`boolean`

`true` if the date is strictly in the future, `false` if equal to or before current time.
