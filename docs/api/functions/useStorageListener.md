[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / useStorageListener

# Function: useStorageListener()

> **useStorageListener**(`callback`): `void`

Defined in: src/hooks/storage.ts:239

Hook to listen to all storage changes

Useful for debugging or syncing external state.

## Parameters

### callback

() => `void`

Callback called when any storage value changes

## Returns

`void`

## Example

```tsx
function DebugComponent() {
  useStorageListener(() => {
    console.log('Storage changed:', storage.keys());
  });
  
  return <Text>Storage listener active</Text>;
}
```
