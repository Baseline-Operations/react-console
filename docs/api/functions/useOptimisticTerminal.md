[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / useOptimisticTerminal

# Function: useOptimisticTerminal()

> **useOptimisticTerminal**\<`T`, `O`\>(`state`, `updateFn`): \[`T`, (`update`) => `void`\]

Defined in: src/hooks/optimistic.ts:50

Hook for optimistic updates in terminal applications

Wraps React 19's `useOptimistic` hook with terminal-specific patterns.
Useful for optimistic UI updates when performing actions like form submissions,
data saving, or network requests that may take time or fail.

## Type Parameters

### T

`T`

Type of the state value

### O

`O` = `T`

Type of the optimistic update value

## Parameters

### state

`T`

Current state value

### updateFn

(`current`, `update`) => `T`

Function to compute optimistic state from current state and update

## Returns

\[`T`, (`update`) => `void`\]

Tuple of [optimisticState, addOptimisticUpdate]

## Example

```tsx
function SaveButton() {
  const [data, setData] = useState('initial');
  const [optimisticData, addOptimisticUpdate] = useOptimisticTerminal(
    data,
    (current, update) => update
  );
  
  const handleSave = async () => {
    addOptimisticUpdate('saving...');
    try {
      await saveToStorage(data);
      setData('saved');
    } catch {
      // Optimistic update will revert on error
    }
  };
  
  return (
    <Button onClick={handleSave}>
      {optimisticData}
    </Button>
  );
}
```
