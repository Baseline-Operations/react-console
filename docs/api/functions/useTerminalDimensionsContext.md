[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / useTerminalDimensionsContext

# Function: useTerminalDimensionsContext()

> **useTerminalDimensionsContext**(): `TerminalDimensionsContextValue`

Defined in: src/context/TerminalDimensionsContext.tsx:91

Hook to use terminal dimensions context

Returns terminal dimensions from the nearest TerminalDimensionsProvider.

## Returns

`TerminalDimensionsContextValue`

Terminal dimensions context value

## Throws

Error if used outside TerminalDimensionsProvider

## Example

```tsx
function ResponsiveComponent() {
  const { dimensions, columns, rows } = useTerminalDimensionsContext();
  
  return (
    <View>
      <Text>Size: {columns}x{rows}</Text>
    </View>
  );
}
```
