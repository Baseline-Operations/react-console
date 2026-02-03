[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / registerClassNames

# Function: registerClassNames()

> **registerClassNames**(`mappings`): `void`

Defined in: [src/utils/className.ts:129](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/className.ts#L129)

Register class name mappings

## Parameters

### mappings

`ClassNameMapping`

## Returns

`void`

## Example

```tsx
registerClassNames({
  'text-red': { color: 'red' },
  'bg-blue': { backgroundColor: 'blue' },
  'p-2': { padding: 2 },
});
```
