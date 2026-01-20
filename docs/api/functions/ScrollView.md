[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / ScrollView

# Function: ScrollView()

> **ScrollView**(`props`): `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: src/components/layout/ScrollView.tsx:53

ScrollView component - React Native-like pattern for terminal

React Native-compatible scrollable container for overflow content.
Functionally identical to Scrollable but uses React Native naming conventions.
Supports horizontal and vertical scrolling with scroll position control.

## Parameters

### props

[`ScrollViewProps`](../interfaces/ScrollViewProps.md)

ScrollView component props

## Returns

`ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

React element representing a scrollable container

## Example

```tsx
<ScrollView scrollTop={scrollPosition} maxHeight={20}>
  <Text>Long content that overflows</Text>
</ScrollView>
```

## See

Scrollable - For component with identical functionality
