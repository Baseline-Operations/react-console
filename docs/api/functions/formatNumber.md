[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / formatNumber

# Function: formatNumber()

> **formatNumber**(`num`, `separator`): `string`

Defined in: [src/utils/formatting.ts:102](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/formatting.ts#L102)

Format a number with thousands separator

## Parameters

### num

`number`

Number to format

### separator

`string` = `','`

Thousands separator (default: ',')

## Returns

`string`

Formatted number string.

## Example

```typescript
formatNumber(1234567); // '1,234,567'
formatNumber(1234567, '.'); // '1.234.567'
formatNumber(-1234567); // '-1,234,567'
formatNumber(1234.56); // '1,234.56'
```

## Notes

- Negative numbers retain their sign.
- Decimal portions are preserved.
- The separator is applied only to the integer part.
