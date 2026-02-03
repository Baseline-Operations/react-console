[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / deprecationWarning

# Function: deprecationWarning()

> **deprecationWarning**(`oldAPI`, `newAPI`, `version?`): `void`

Defined in: [src/utils/errors.ts:125](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/errors.ts#L125)

Log a deprecation warning to the console.

Outputs a formatted warning message indicating that an API is deprecated and suggests the replacement. Useful for library maintainers to notify users of breaking changes.

## Parameters

### oldAPI

`string`

The name of the deprecated API.

### newAPI

`string`

The name of the replacement API.

### version?

`string`

Optional version in which the deprecated API will be removed.

## Returns

`void`

## Example

```typescript
deprecationWarning('Input', 'TextInput', '0.2.0');
// Output: "[DEPRECATED] 'Input' is deprecated. Use 'TextInput' instead. Will be removed in version 0.2.0"
```
