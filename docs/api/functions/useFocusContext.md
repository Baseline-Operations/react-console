[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / useFocusContext

# Function: useFocusContext()

> **useFocusContext**(): `FocusContextValue`

Defined in: src/context/FocusContext.tsx:104

Hook to use focus context

Returns focus management utilities from the nearest FocusProvider.

## Returns

`FocusContextValue`

Focus context value

## Throws

Error if used outside FocusProvider

## Example

```tsx
function MyComponent() {
  const { focusedComponent, isFocused, setFocused } = useFocusContext();
  const [myNode, setMyNode] = useState<ConsoleNode | null>(null);
  
  return (
    <View>
      <Text>Focused: {isFocused(myNode) ? 'Yes' : 'No'}</Text>
    </View>
  );
}
```
