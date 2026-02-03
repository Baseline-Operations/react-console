[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / isToday

# Function: isToday()

> **isToday**(`date`): `boolean`

Defined in: [src/utils/dateFormatting.ts:253](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/dateFormatting.ts#L253)

Check if a date is today

Compares the given date against the current local date. Returns `true` if the date falls within today's date boundaries (midnight to midnight in the local timezone).

## Parameters

### date

`number` | `Date`

Date object or timestamp (milliseconds since Unix epoch).

## Returns

`boolean`

`true` if the date falls within today's date, `false` otherwise.

## Example

```typescript
import { isToday } from 'react-console';

// With Date object
isToday(new Date()); // true

// With timestamp
isToday(Date.now()); // true

// Yesterday
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
isToday(yesterday); // false
```

## Notes

- Comparison is based on local timezone.
- Invalid dates return `false`.
