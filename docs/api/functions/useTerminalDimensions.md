[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / useTerminalDimensions

# Function: useTerminalDimensions()

> **useTerminalDimensions**(): [`TerminalDimensions`](../interfaces/TerminalDimensions.md)

Defined in: src/hooks/terminal.ts:38

Hook for reactive terminal dimensions

Returns the current terminal dimensions and automatically updates
when the terminal is resized. Useful for responsive layouts.

## Returns

[`TerminalDimensions`](../interfaces/TerminalDimensions.md)

Current terminal dimensions { columns, rows }

## Example

```tsx
function ResponsiveComponent() {
  const dims = useTerminalDimensions();
  
  return (
    <View>
      <Text>Terminal size: {dims.columns}x{dims.rows}</Text>
    </View>
  );
}
```
