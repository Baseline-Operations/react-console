[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / useStorageDelete

# Function: useStorageDelete()

> **useStorageDelete**(`callback`, `key?`): `void`

Defined in: src/hooks/lifecycle.ts:180

Hook called when a storage key is deleted

This hook is called when a storage item is removed via removeItem() or clear().

Note: This only detects deletions made through the storage API.
External file deletions cannot be detected without file watching,
which is not implemented to avoid background processes.

## Parameters

### callback

(`key`) => `void`

Callback function called when storage is deleted

### key?

`string`

Optional specific key to listen for (if not provided, listens to all deletions)

## Returns

`void`

## Example

```tsx
function MyComponent() {
  useStorageDelete((deletedKey) => {
    console.log(`Storage key deleted: ${deletedKey}`);
  });
  
  // Or listen to specific key:
  useStorageDelete(() => {
    console.log('User preferences deleted');
  }, 'userPreferences');
  
  return <View>My Component</View>;
}
```
