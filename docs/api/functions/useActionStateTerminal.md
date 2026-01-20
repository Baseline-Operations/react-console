[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / useActionStateTerminal

# Function: useActionStateTerminal()

> **useActionStateTerminal**\<`T`, `P`\>(`action`, `initialState`, `permalink?`): \[`T`, (`params`) => `void`, `boolean`\]

Defined in: src/hooks/action-state.ts:53

Hook for action state management in terminal applications

Wraps React 19's `useActionState` hook with terminal-specific patterns.
Useful for form submissions and actions that need to track pending, error, and success states.

## Type Parameters

### T

`T`

Type of the action state

### P

`P` = `FormData`

Type of the action parameters

## Parameters

### action

(`prevState`, `params`) => `T` \| `Promise`\<`T`\>

Async action function that takes parameters and returns state

### initialState

`T`

Initial state value

### permalink?

`string`

Optional permalink (not used in terminal, can be undefined)

## Returns

\[`T`, (`params`) => `void`, `boolean`\]

Tuple of [state, formAction, isPending]

## Example

```tsx
async function submitForm(prevState: { message: string }, formData: FormData) {
  const name = formData.get('name');
  if (!name) {
    return { message: 'Name is required' };
  }
  await saveToStorage(name);
  return { message: 'Saved successfully' };
}

function FormComponent() {
  const [state, formAction, isPending] = useActionStateTerminal(
    submitForm,
    { message: '' }
  );
  
  return (
    <View>
      <Text>{state.message}</Text>
      {isPending && <Text>Saving...</Text>}
      <Input name="name" />
      <Button onClick={() => formAction(new FormData())}>
        Submit
      </Button>
    </View>
  );
}
```
