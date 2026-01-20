[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / useInputState

# Function: useInputState()

> **useInputState**(`inputRef`): `object`

Defined in: src/hooks/input.ts:41

Hook for managing input component state

Returns the current input value, cursor position, and multiline state
for a specific input component. Useful for building custom input components
or accessing input state programmatically.

## Parameters

### inputRef

Reference to the input ConsoleNode

[`ConsoleNode`](../interfaces/ConsoleNode.md) | `null` | `undefined`

## Returns

`object`

Object with input state and helper functions

### value

> **value**: `string` \| `number` \| `null`

### cursorPosition

> **cursorPosition**: `number`

### isMultiline

> **isMultiline**: `boolean`

### setValue()

> **setValue**: (`value`) => `void`

#### Parameters

##### value

`string` | `number` | `null`

#### Returns

`void`

### setCursorPosition()

> **setCursorPosition**: (`position`) => `void`

#### Parameters

##### position

`number`

#### Returns

`void`

## Example

```tsx
function MyComponent() {
  const [inputNode, setInputNode] = useState<ConsoleNode | null>(null);
  const { value, cursorPosition, isMultiline, setValue, setCursorPosition } = useInputState(inputNode);
  
  return (
    <View>
      <Input
        ref={setInputNode}
        value={value}
        onChange={(e) => setValue(e.value)}
      />
      <Text>Cursor at position: {cursorPosition}</Text>
    </View>
  );
}
```
