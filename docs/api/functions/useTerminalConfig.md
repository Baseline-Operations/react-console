[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / useTerminalConfig

# Function: useTerminalConfig()

> **useTerminalConfig**(): `object`

Defined in: src/hooks/terminal.ts:170

Hook for terminal configuration and capabilities

Returns terminal capabilities like color support, mouse support, etc.
Useful for conditionally enabling features based on terminal capabilities.

## Returns

`object`

Terminal configuration object

### supportsColor

> **supportsColor**: `boolean`

### supportsMouse

> **supportsMouse**: `boolean`

### dimensions

> **dimensions**: [`TerminalDimensions`](../interfaces/TerminalDimensions.md)

## Example

```tsx
function AdaptiveComponent() {
  const config = useTerminalConfig();
  
  return (
    <View>
      {config.supportsColor && <Text color="red">Colored text</Text>}
      {config.supportsMouse && <Text>Mouse supported</Text>}
    </View>
  );
}
```
