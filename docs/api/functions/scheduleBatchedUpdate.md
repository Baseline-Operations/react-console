[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / scheduleBatchedUpdate

# Function: scheduleBatchedUpdate()

> **scheduleBatchedUpdate**(`updateFn`): `void`

Defined in: [src/renderer/batching.ts:23](https://github.com/Baseline-Operations/react-console/blob/main/src/renderer/batching.ts#L23)

Schedule a batched update
Queues an update function to be executed in the next batch

## Parameters

### updateFn

() => `void`

Function to execute as part of the batch

## Returns

`void`

## Example

```ts
scheduleBatchedUpdate(() => {
  // Update state or trigger render
});
```
