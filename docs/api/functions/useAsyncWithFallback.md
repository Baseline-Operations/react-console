[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / useAsyncWithFallback

# Function: useAsyncWithFallback()

> **useAsyncWithFallback**\<`T`\>(`promise`, `fallback`): `T`

Defined in: src/hooks/async.ts:62

Hook for async data loading with error handling

Wraps `use` hook with error boundary support for better error handling.

## Type Parameters

### T

`T`

Type of the promise result

## Parameters

### promise

`Promise`\<`T`\>

Promise to unwrap

### fallback

`T`

Fallback value if promise rejects

## Returns

`T`

Resolved value from promise or fallback if rejected

## Example

```tsx
function DataComponent() {
  const dataPromise = useMemo(() => loadDataFromStorage(), []);
  const data = useAsyncWithFallback(dataPromise, { name: 'Default' });
  
  return (
    <View>
      <Text>Data: {data.name}</Text>
    </View>
  );
}
```
