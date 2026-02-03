[**React Console API v0.1.0**](../../README.md)

---

[React Console API](../globals.md) / useWindowDimensions

# Function: useWindowDimensions()

> **useWindowDimensions**(): `ScaledSize`

Defined in: [src/apis/Dimensions.ts:194](https://github.com/Baseline-Operations/react-console/blob/main/src/apis/Dimensions.ts#L194)

Hook: useWindowDimensions
React hook for getting window dimensions with automatic updates

## Returns

`ScaledSize`

Current window dimensions

## Example

```tsx
function MyComponent() {
  const { width, height } = useWindowDimensions();

  return (
    <View style={{ width: width - 4 }}>
      <Text>
        Terminal is {width}x{height}
      </Text>
    </View>
  );
}
```
