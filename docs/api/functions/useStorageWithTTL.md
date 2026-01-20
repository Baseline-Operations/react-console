[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / useStorageWithTTL

# Function: useStorageWithTTL()

> **useStorageWithTTL**\<`T`\>(`key`, `defaultValue`, `ttl`): \[`T` \| `null`, (`value`) => `void`, () => `void`\]

Defined in: src/hooks/storage.ts:176

Hook to use storage with TTL (time-to-live)

Similar to useStorage, but with automatic expiration.

## Type Parameters

### T

`T` *extends* [`StorageValue`](../type-aliases/StorageValue.md)

## Parameters

### key

`string`

Storage key

### defaultValue

Default value if key doesn't exist

`T` | `null`

### ttl

`number`

Time to live in milliseconds

## Returns

\[`T` \| `null`, (`value`) => `void`, () => `void`\]

[value, setValue, removeValue] tuple

## Example

```tsx
function MyComponent() {
  const [token, setToken] = useStorageWithTTL('token', null, 3600000); // 1 hour
  
  return (
    <View>
      <Text>Token expires in 1 hour</Text>
    </View>
  );
}
```
