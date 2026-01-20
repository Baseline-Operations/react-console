[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / useStorage

# Function: useStorage()

> **useStorage**\<`T`\>(`key`, `defaultValue`): \[`T` \| `null`, (`value`) => `void`, () => `void`\]

Defined in: src/hooks/storage.ts:102

Hook to use storage as reactive state

Similar to useState, but persists to storage and syncs across components.
Storage changes trigger re-renders automatically.

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

## Returns

\[`T` \| `null`, (`value`) => `void`, () => `void`\]

[value, setValue, removeValue] tuple

## Example

```tsx
function MyComponent() {
  const [username, setUsername] = useStorage('username', 'guest');
  
  return (
    <View>
      <Text>Hello, {username}!</Text>
      <Input
        value={username}
        onChange={(e) => setUsername(e.value)}
      />
    </View>
  );
}
```
