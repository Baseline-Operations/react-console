[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / useSelection

# Function: useSelection()

> **useSelection**(`componentRef`): `object`

Defined in: src/hooks/selection.ts:40

Hook for managing selection component state

Returns the current selection state for radio, checkbox, dropdown, or list components.
Provides utilities to check selection state and update selections.

## Parameters

### componentRef

Reference to the selection component ConsoleNode

[`ConsoleNode`](../interfaces/ConsoleNode.md) | `null` | `undefined`

## Returns

`object`

Object with selection state and helper functions

### selected

> **selected**: `string` \| `number` \| (`string` \| `number`)[] \| `null`

### isOpen

> **isOpen**: `boolean`

### focusedIndex

> **focusedIndex**: `number`

### select()

> **select**: (`value`) => `void`

#### Parameters

##### value

`string` | `number` | (`string` \| `number`)[]

#### Returns

`void`

### open()

> **open**: () => `void`

#### Returns

`void`

### close()

> **close**: () => `void`

#### Returns

`void`

### setFocusedIndex()

> **setFocusedIndex**: (`index`) => `void`

#### Parameters

##### index

`number`

#### Returns

`void`

## Example

```tsx
function MyComponent() {
  const [radioNode, setRadioNode] = useState<ConsoleNode | null>(null);
  const { selected, isOpen, focusedIndex, select, open, close } = useSelection(radioNode);
  
  return (
    <View>
      <Radio
        ref={setRadioNode}
        options={['Option 1', 'Option 2']}
        selected={selected}
        onChange={(e) => select(e.value)}
      />
      <Text>Selected: {selected}</Text>
    </View>
  );
}
```
