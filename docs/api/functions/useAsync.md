[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / useAsync

# Function: useAsync()

> **useAsync**\<`T`\>(`promise`): `T`

Defined in: src/hooks/async.ts:34

Hook for async data loading in terminal applications

Wraps React 19's `use` hook for loading async data in terminal context.
Useful for loading data from storage, network requests, or other async operations.

## Type Parameters

### T

`T`

Type of the promise result

## Parameters

### promise

`Promise`\<`T`\>

Promise to unwrap

## Returns

`T`

Resolved value from promise

## Example

```tsx
function DataComponent() {
  const dataPromise = useMemo(() => loadDataFromStorage(), []);
  const data = useAsync(dataPromise);
  
  return (
    <View>
      <Text>Data: {data.name}</Text>
    </View>
  );
}
```
