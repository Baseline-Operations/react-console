[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / flushBatchedUpdatesSync

# Function: flushBatchedUpdatesSync()

> **flushBatchedUpdatesSync**(): `void`

Defined in: [src/renderer/batching.ts:91](https://github.com/Baseline-Operations/react-console/blob/main/src/renderer/batching.ts#L91)

Immediately flush batched updates (synchronously)
Useful when you need to ensure updates are applied before proceeding

## Returns

`void`

## Example

```ts
scheduleBatchedUpdate(update1);
scheduleBatchedUpdate(update2);
flushBatchedUpdatesSync(); // Executes both updates now
```
