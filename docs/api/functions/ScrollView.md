[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / ScrollView

# Function: ScrollView()

> **ScrollView**(`props`): `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [src/components/layout/ScrollView.tsx:133](https://github.com/Baseline-Operations/react-console/blob/main/src/components/layout/ScrollView.tsx#L133)

ScrollView component - React Native-like pattern for terminal

Extends View with scrolling capability. Content that exceeds maxHeight/maxWidth
becomes scrollable. Supports both controlled (scrollTop prop) and uncontrolled modes.

## Parameters

### props

[`ScrollViewProps`](../interfaces/ScrollViewProps.md)

ScrollView component props

## Returns

`ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

React element representing a scrollable container

## Example

```tsx
// Simple scrollable list
<ScrollView maxHeight={10}>
  {items.map(item => <Text key={item.id}>{item.name}</Text>)}
</ScrollView>

// With custom scrollbar
<ScrollView
  maxHeight={15}
  showsVerticalScrollIndicator
  scrollbarStyle={{
    thumbColor: 'blue',
    trackColor: 'gray',
    thumbChar: '●',
    trackChar: '│'
  }}
>
  <Text>Content here...</Text>
</ScrollView>
```
