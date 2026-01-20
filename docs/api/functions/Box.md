[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / Box

# Function: Box()

> **Box**(`props`): `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: src/components/primitives/Box.tsx:88

Box component - Container for layout and styling with full layout support

Similar to React Native's View component, provides a block-level container with:
- CSS-like styling (flexbox, grid, borders, padding, margins)
- Responsive sizing (percentages, viewport units)
- Scrollbar support (horizontal and vertical)
- Position support (absolute, relative, fixed)

## Parameters

### props

[`BoxProps`](../interfaces/BoxProps.md)

Box component props

## Returns

`ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

React element representing a Box container

## Example

```tsx
// Basic box with border
<Box style={{ border: 'single', padding: 2 }}>
  <Text>Content</Text>
</Box>

// Scrollable box with scrollbars
<Box
  scrollable={true}
  scrollbarVisibility="auto"
  scrollTop={10}
  style={{ width: 50, height: 20 }}
>
  <Text>Long content that overflows</Text>
</Box>

// Flexbox layout
<Box style={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</Box>
```
