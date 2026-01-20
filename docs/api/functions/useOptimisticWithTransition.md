[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / useOptimisticWithTransition

# Function: useOptimisticWithTransition()

> **useOptimisticWithTransition**\<`T`, `O`\>(`state`, `updateFn`): `object`

Defined in: src/hooks/optimistic.ts:95

Hook for optimistic updates with transition

Combines `useOptimistic` with `useTransition` for better UX during async operations.
Shows pending state while optimistic update is in progress.

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

`object`

Object with optimisticState, addOptimisticUpdate, isPending, and startTransition

### optimisticState

> **optimisticState**: `T`

### addOptimisticUpdate()

> **addOptimisticUpdate**: (`update`) => `void`

#### Parameters

##### update

`O`

#### Returns

`void`

### isPending

> **isPending**: `boolean`

### startTransition()

> **startTransition**: (`callback`) => `void`

#### Parameters

##### callback

() => `void` \| `Promise`\<`void`\>

#### Returns

`void`

## Example

```tsx
function FormComponent() {
  const [formData, setFormData] = useState({ name: '' });
  const { optimisticData, addOptimisticUpdate, isPending, startTransition } = useOptimisticWithTransition(
    formData,
    (current, update) => update
  );
  
  const handleSubmit = async () => {
    startTransition(async () => {
      addOptimisticUpdate({ name: 'Saving...' });
      await submitForm(formData);
      setFormData({ name: 'Saved' });
    });
  };
  
  return (
    <View>
      <Text>{optimisticData.name}</Text>
      {isPending && <Text>Processing...</Text>}
    </View>
  );
}
```
