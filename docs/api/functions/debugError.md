[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / debugError

# Function: debugError()

> **debugError**(`message`, `data?`): `void`

Defined in: [src/utils/debug.ts:96](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/debug.ts#L96)

Log an error message to file with timestamp.
Errors are logged with ERROR prefix for easier filtering. No-op if `FILE_DEBUG_ENABLED` is `false`.

## Parameters

### message

`string`

Error message

### data?

`unknown`

Optional error data

## Returns

`void`
