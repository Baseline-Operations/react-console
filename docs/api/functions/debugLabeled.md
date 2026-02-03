[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / debugLabeled

# Function: debugLabeled()

> **debugLabeled**(`label`, `message`, `data?`): `void`

Defined in: [src/utils/debug.ts:87](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/debug.ts#L87)

Log a debug message with a label/category to file with timestamp.
Useful for filtering logs by component/area. No-op if `FILE_DEBUG_ENABLED` is `false`.

## Parameters

### label

`string`

Category label (e.g., 'InputNode', 'scheduleUpdate')

### message

`string`

The message to log

### data?

`unknown`

Optional data to include

## Returns

`void`
