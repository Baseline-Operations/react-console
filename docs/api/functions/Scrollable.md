[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / Scrollable

# Function: Scrollable()

> **Scrollable**(`props`): `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: src/components/layout/Scrollable.tsx:47

Scrollable component - Container with scroll support for overflow content

Provides scrollable container for content that overflows visible area.
Supports vertical and horizontal scrolling with scroll position control.
Content beyond maxHeight/maxWidth is accessible via scrolling.

## Parameters

### props

[`ScrollableProps`](../interfaces/ScrollableProps.md)

Scrollable component props

## Returns

`ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

React element representing a scrollable container

## Example

```tsx
<Scrollable scrollTop={scrollPosition} maxHeight={20}>
  <Text>Long content that overflows</Text>
</Scrollable>
```
